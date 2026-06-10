"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import type { UserRole } from "@/lib/types";

export async function signInWithGoogleClient(
  role: UserRole = "user",
  redirectAfter: string = ""
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = createClient();
  const origin = window.location.origin;

  const callbackUrl = new URL("/auth/callback", origin);
  callbackUrl.searchParams.set("role", role);
  if (redirectAfter) callbackUrl.searchParams.set("redirect", redirectAfter);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    // Provider not enabled in Supabase dashboard
    if (error.message?.toLowerCase().includes("provider") || error.status === 400) {
      return { error: "Google sign-in is not enabled yet. Please use email and password." };
    }
    return { error: error.message };
  }

  return {};
}
