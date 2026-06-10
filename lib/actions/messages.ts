"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState } from "@/lib/types";

// Helper — fire-and-forget notification insert using service-role client.
// Bypasses RLS so server actions can write notifications for ANY user.
// Logs errors so silent failures become visible in server logs.
async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  href: string | null = null
) {
  const admin = createAdminClient();
  if (!admin) {
    console.error("[createNotification] Admin client unavailable — SUPABASE_SERVICE_ROLE_KEY missing?");
    return;
  }
  const { error } = await admin
    .from("notifications")
    .insert({ user_id: userId, type, title, body, href });
  if (error) {
    console.error("[createNotification] INSERT failed:", error.message, { userId, type, title });
  } else {
    console.log("[createNotification] OK →", { userId, type, title });
  }
}

export async function startConversation(
  creatorId: string,
  productId?: string,
  initialMessage?: string
): Promise<{ conversationId?: string; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "AUTH_REQUIRED" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "user") {
    return { error: "Only customers can start conversations with creators." };
  }

  if (user.id === creatorId) {
    return { error: "You cannot message yourself." };
  }

  let existingQuery = supabase
    .from("conversations")
    .select("id")
    .eq("user_id", user.id)
    .eq("creator_id", creatorId);

  if (productId) {
    existingQuery = existingQuery.eq("product_id", productId);
  } else {
    existingQuery = existingQuery.is("product_id", null);
  }

  const { data: existing } = await existingQuery.maybeSingle();

  let conversationId = existing?.id;

  if (!conversationId) {
    const { data: created, error } = await supabase
      .from("conversations")
      .insert({
        user_id: user.id,
        creator_id: creatorId,
        product_id: productId ?? null,
      })
      .select("id")
      .single();

    if (error) return { error: error.message };
    conversationId = created.id;
  }

  if (initialMessage?.trim()) {
    await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: user.id,
      body: initialMessage.trim(),
    });
    await supabase
      .from("conversations")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", conversationId);
  }

  revalidatePath("/messages");
  return { conversationId };
}

export async function sendMessage(
  conversationId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const body = String(formData.get("body") ?? "").trim();
  const imageUrl = formData.get("image_url")
    ? String(formData.get("image_url"))
    : null;

  if (!body && !imageUrl) return { error: "Message cannot be empty." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: user.id,
    body: body || "",
    image_url: imageUrl,
  });

  if (error) return { error: error.message };

  await supabase
    .from("conversations")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  // Mark own message as read immediately
  await markConversationRead(conversationId);

  // Notify the other party
  const { data: conv } = await supabase
    .from("conversations")
    .select("user_id, creator_id")
    .eq("id", conversationId)
    .single();

  if (conv) {
    const recipientId = conv.user_id === user.id ? conv.creator_id : conv.user_id;
    if (recipientId) {
      const snippet = imageUrl
        ? body
          ? `📷 ${body.length > 60 ? body.slice(0, 60) + "…" : body}`
          : "📷 Sent an image"
        : body.length > 80
        ? body.slice(0, 80) + "…"
        : body;

      await createNotification(
        recipientId,
        "new_message",
        "New message",
        snippet,
        `/messages/${conversationId}`
      );
    }
  }

  revalidatePath("/messages");
  return {};
}

/** Mark all messages in a conversation as read for the current user */
export async function markConversationRead(
  conversationId: string
): Promise<void> {
  if (!isSupabaseConfigured()) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // Upsert conversation_reads
  await supabase.from("conversation_reads").upsert(
    {
      conversation_id: conversationId,
      user_id: user.id,
      last_read_at: new Date().toISOString(),
    },
    { onConflict: "conversation_id,user_id" }
  );

  // Also mark unread messages (from other party) as read
  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("conversation_id", conversationId)
    .neq("sender_id", user.id)
    .is("read_at", null);
}
