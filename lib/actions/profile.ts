"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

export async function updateAvailability(available: boolean): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("profiles")
    .update({ available_for_commissions: available })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/creator");
  return { success: true };
}

export async function uploadPortfolioImage(
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const supabase = await createClient();

  // auth.getUser() reads the session from the request cookies that Next.js
  // forwards automatically when a server action is called from a client component.
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not signed in." };

  const file = formData.get("portfolio_image") as File | null;
  const title = String(formData.get("title") ?? "").trim() || null;
  const caption = String(formData.get("caption") ?? "").trim() || null;

  if (!file || file.size === 0) return { error: "Please select an image." };
  if (!title) return { error: "Please enter a title for this portfolio piece." };
  if (file.size > 5 * 1024 * 1024) return { error: "Image must be under 5 MB." };

  // Path MUST start with the user's own UUID so the storage RLS policy
  // `auth.uid()::text = (storage.foldername(name))[1]` passes.
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const path = `${user.id}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("portfolio")
    .upload(path, file, { upsert: false });

  // Surface storage errors immediately — do NOT silently skip them.
  if (uploadError) {
    return {
      error: `Storage upload failed: ${uploadError.message}`,
    };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("portfolio").getPublicUrl(path);

  // The RLS policy on portfolio_items requires creator_id = auth.uid().
  // We use user.id (= auth.uid()) directly — never trust client-supplied IDs.
  const { error: dbError } = await supabase.from("portfolio_items").insert({
    creator_id: user.id,
    image_url: publicUrl,
    title,
    caption,
  });

  if (dbError) {
    return { error: `Database insert failed: ${dbError.message}` };
  }

  revalidatePath("/dashboard/creator");
  revalidatePath(`/creators/${user.id}`);
  return { success: true };
}

export async function deletePortfolioItem(itemId: string): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("portfolio_items")
    .delete()
    .eq("id", itemId)
    .eq("creator_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/creator");
  revalidatePath(`/creators/${user.id}`);
  return { success: true };
}
