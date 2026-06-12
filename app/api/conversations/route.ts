import { NextRequest, NextResponse } from "next/server";
import { getUserConversations } from "@/lib/queries/messages";
import { getCurrentProfile } from "@/lib/queries/profiles";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  // Verify the caller is the authenticated user — ignore the profileId param for auth
  const profile = await getCurrentProfile();
  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // profileId from query is just used to confirm it matches the session user
  const profileId = req.nextUrl.searchParams.get("profileId");
  if (!profileId || profileId !== profile.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const conversations = await getUserConversations(profile.id);
  return NextResponse.json(conversations);
}