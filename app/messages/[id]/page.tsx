import { redirect, notFound } from "next/navigation";
import { MessageThread } from "@/components/messages/MessageThread";
import { OrderContextBanner } from "@/components/messages/OrderContextBanner";
import { ChatHeader } from "@/components/messages/ChatHeader";
import { getCurrentProfile } from "@/lib/queries/profiles";
import {
  getConversationById,
  getConversationMessages,
  getConversationOrder,
} from "@/lib/queries/messages";
import { createClient } from "@/lib/supabase/server";
import { getInitials } from "@/lib/utils";
import type { Metadata } from "next";
import type { OrderStatus } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const conv = await getConversationById(id);
  return { title: conv ? "Messages" : "Messages" };
}

export default async function ConversationPage({ params }: Props) {
  const { id } = await params;

  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login");

  const conversation = await getConversationById(id);
  if (!conversation) notFound();

  if (
    conversation.user_id !== profile.id &&
    conversation.creator_id !== profile.id
  ) {
    notFound();
  }

  const [messages, order] = await Promise.all([
    getConversationMessages(id),
    getConversationOrder(id),
  ]);

  const otherId =
    conversation.user_id === profile.id
      ? conversation.creator_id
      : conversation.user_id;

  const supabase = await createClient();
  const { data: other } = await supabase
    .from("profiles")
    .select("full_name, store_name, avatar_url")
    .eq("id", otherId)
    .single();

  const displayName = other?.store_name || other?.full_name || "Artisan";
  const initials = getInitials(displayName);
  const subtitle = conversation.product?.name
    ? `Re: ${conversation.product.name}`
    : undefined;

  return (
    <>
      {/* ── Fixed header ── */}
      <ChatHeader
        displayName={displayName}
        initials={initials}
        subtitle={subtitle}
        avatarUrl={other?.avatar_url ?? undefined}
      />

      {/* ── Scrollable body ── */}
      <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
        {order && (
          <OrderContextBanner
            orderId={order.id}
            productName={order.product_name_snapshot}
            status={order.status as OrderStatus}
            imageUrl={order.product_image_snapshot}
            viewerRole={profile.role}
          />
        )}

        <MessageThread
          conversationId={id}
          messages={messages}
          currentUserId={profile.id}
          hasOrderBanner={!!order}
        />
      </div>
    </>
  );
}