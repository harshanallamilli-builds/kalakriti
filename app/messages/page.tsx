import { redirect } from "next/navigation";
import { ConversationList } from "@/components/messages/ConversationList";
import { EmptyState } from "@/components/ui/EmptyState";
import { getCurrentProfile } from "@/lib/queries/profiles";
import { getUserConversations } from "@/lib/queries/messages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Messages" };

export default async function MessagesPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login");

  const conversations = await getUserConversations(profile.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 md:py-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl text-charcoal">Messages</h1>
          <p className="mt-1 text-sm text-warm-gray">
            {profile.role === "creator"
              ? "Conversations with your customers"
              : "Your conversations with artisans"}
          </p>
        </div>
        {conversations.length > 0 && (
          <span className="rounded-full bg-sand px-3 py-1 text-sm text-warm-gray">
            {conversations.length}
          </span>
        )}
      </div>

      <ConversationList
        conversations={conversations}
        profileId={profile.id}
        role={profile.role}
      />
    </div>
  );
}
