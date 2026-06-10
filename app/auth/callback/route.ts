import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardPath } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const role = (searchParams.get("role") as UserRole) ?? "user";
  const redirectAfter = searchParams.get("redirect") ?? "";

  if (!code) {
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
  }

  const supabase = await createClient();
  const { data: sessionData, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !sessionData.user) {
    return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`);
  }

  const user = sessionData.user;

  // Check if profile already exists
  const { data: existingProfile } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!existingProfile) {
    // Create profile for new OAuth user
    const fullName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "User";

    await supabase.from("profiles").insert({
      id: user.id,
      role,
      full_name: fullName,
      email: user.email ?? "",
      avatar_url: user.user_metadata?.avatar_url || null,
    });
  }

  const finalRole = existingProfile?.role ?? role;
  const destination = redirectAfter?.startsWith("/")
    ? redirectAfter
    : getDashboardPath(finalRole as UserRole);

  return NextResponse.redirect(`${origin}${destination}`);
}
