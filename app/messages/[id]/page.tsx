import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { MessageThread } from "@/components/messages/MessageThread";
import { OrderContextBanner } from "@/components/messages/OrderContextBanner";
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
  return { title: conv ? "Conversation" : "Messages" };
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

  return (
    <div
      className="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6"
      style={{ height: "calc(100svh - 57px)", maxHeight: "calc(100svh - 57px)" }}
    >
      {/* Conversation header */}
      <div className="flex shrink-0 items-center gap-3 py-3">
        <Link
          href="/messages"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-linen text-warm-gray transition-colors hover:bg-sand active:bg-linen"
          aria-label="Back to messages"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>

        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-sand ring-2 ring-linen">
            <span className="flex h-full w-full items-center justify-center font-heading text-sm text-terracotta">
              {initials}
            </span>
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium leading-tight text-charcoal">{displayName}</p>
            {conversation.product && (
              <p className="truncate text-xs text-saffron">
                Re: {conversation.product.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Thread fills remaining height */}
      <div className="flex min-h-0 flex-1 flex-col pb-0">
        <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-3xl border border-linen bg-white shadow-[var(--shadow-card)]">
          {/* Order context banner */}
          {order && (
            <OrderContextBanner
              orderId={order.id}
              productName={order.product_name_snapshot}
              status={order.status as OrderStatus}
              imageUrl={order.product_image_snapshot}
              viewerRole={profile.role}
            />
          )}

          {/* Message thread (without its own outer wrapper — render inner content) */}
          <MessageThread
            conversationId={id}
            messages={messages}
            currentUserId={profile.id}
            hasOrderBanner={!!order}
          />
        </div>
      </div>
    </div>
  );
}
