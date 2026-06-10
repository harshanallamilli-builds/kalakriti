import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Conversation, Message } from "@/lib/types";

export async function getUserConversations(
  userId: string
): Promise<Conversation[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
      *,
      product:products (id, name, image_url),
      user_profile:profiles!user_id (id, full_name, avatar_url, store_name),
      creator_profile:profiles!creator_id (id, full_name, avatar_url, store_name)
    `
    )
    .or(`user_id.eq.${userId},creator_id.eq.${userId}`)
    .order("updated_at", { ascending: false });

  if (error) return [];

  const conversations = (data ?? []) as any[];
  if (conversations.length === 0) return [];

  const convIds = conversations.map((c) => c.id);

  // Batch fetch last message per conversation
  const { data: allMsgs } = await supabase
    .from("messages")
    .select("conversation_id, body, image_url, created_at")
    .in("conversation_id", convIds)
    .order("created_at", { ascending: false });

  const lastMsgByConv: Record<
    string,
    { body: string; created_at: string; image_url?: string | null }
  > = {};
  for (const msg of allMsgs ?? []) {
    if (!lastMsgByConv[msg.conversation_id]) {
      lastMsgByConv[msg.conversation_id] = {
        body: msg.body,
        created_at: msg.created_at,
        image_url: msg.image_url ?? null,
      };
    }
  }

  // Fetch read state for this user
  const { data: readRows } = await supabase
    .from("conversation_reads")
    .select("conversation_id, last_read_at")
    .eq("user_id", userId)
    .in("conversation_id", convIds);

  const readByConv: Record<string, string> = {};
  for (const r of readRows ?? []) {
    readByConv[r.conversation_id] = r.last_read_at;
  }

  // Count unread messages per conversation (messages from others after last_read_at)
  const { data: unreadMsgs } = await supabase
    .from("messages")
    .select("conversation_id, sender_id, created_at")
    .in("conversation_id", convIds)
    .neq("sender_id", userId);

  const realUnreadCounts: Record<string, number> = {};
  for (const msg of unreadMsgs ?? []) {
    const lastRead = readByConv[msg.conversation_id];
    if (!lastRead || new Date(msg.created_at) > new Date(lastRead)) {
      realUnreadCounts[msg.conversation_id] =
        (realUnreadCounts[msg.conversation_id] ?? 0) + 1;
    }
  }

  return conversations.map((conv) => {
    const isUser = conv.user_id === userId;
    const otherParty = isUser ? conv.creator_profile : conv.user_profile;

    return {
      id: conv.id,
      user_id: conv.user_id,
      creator_id: conv.creator_id,
      product_id: conv.product_id,
      created_at: conv.created_at,
      updated_at: conv.updated_at,
      product: conv.product ?? null,
      other_party: otherParty ?? undefined,
      last_message: lastMsgByConv[conv.id] ?? undefined,
      unread_count: realUnreadCounts[conv.id] ?? 0,
    } satisfies Conversation;
  });
}

export async function getConversationMessages(
  conversationId: string
): Promise<Message[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) return [];
  return (data ?? []) as Message[];
}

export async function getConversationById(
  id: string
): Promise<Conversation | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select(
      `
      *,
      product:products (id, name, image_url)
    `
    )
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Conversation;
}

/** Get the related order for a conversation (via product_id + user_id + creator_id) */
export async function getConversationOrder(conversationId: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();

  const { data: conv } = await supabase
    .from("conversations")
    .select("user_id, creator_id, product_id")
    .eq("id", conversationId)
    .single();

  if (!conv) return null;

  let query = supabase
    .from("orders")
    .select("id, status, product_name_snapshot, product_image_snapshot")
    .eq("user_id", conv.user_id)
    .eq("creator_id", conv.creator_id)
    .not("status", "eq", "cancelled")
    .order("created_at", { ascending: false })
    .limit(1);

  if (conv.product_id) {
    query = query.eq("product_id", conv.product_id);
  }

  const { data: orders } = await query;
  return orders?.[0] ?? null;
}
