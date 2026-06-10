"use server";

import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

export type FeedbackState = { error?: string; success?: boolean };

export async function submitFeedback(
  _prev: FeedbackState,
  formData: FormData
): Promise<FeedbackState> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const category = String(formData.get("category") ?? "general");
  const message = String(formData.get("message") ?? "").trim();

  if (!message || message.length < 5) {
    return { error: "Please write at least a few words." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { error } = await supabase.from("feedback").insert({
    user_id: user?.id ?? null,
    category,
    message,
  });

  if (error) {
    // Table might not exist yet — gracefully degrade
    if (error.code === "42P01") {
      console.warn("feedback table not found — run schema.sql");
      return { success: true }; // Don't block the user
    }
    return { error: error.message };
  }

  return { success: true };
}
