import { redirect } from "next/navigation";
import { ConversationList } from "@/components/messages/ConversationList";
import { getCurrentProfile } from "@/lib/queries/profiles";
import { getUserConversations } from "@/lib/queries/messages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messages" };
// Always fetch fresh data — never serve a cached version of this page.
// Without this, navigating back from a conversation shows stale unread counts.
export const dynamic = "force-dynamic";

export default async function MessagesPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login");

  const conversations = await getUserConversations(profile.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 md:py-12">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl text-charcoal">Messages</h1>
          {conversations.length > 0 && (
            <span className="rounded-full bg-sand px-3 py-1 text-sm text-warm-gray">
              {conversations.length}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-warm-gray">
          {profile.role === "creator"
            ? "Conversations with your customers"
            : "Your conversations with artisans"}
        </p>
      </div>

      <ConversationList
        conversations={conversations}
        profileId={profile.id}
        role={profile.role}
      />
    </div>
  );
}