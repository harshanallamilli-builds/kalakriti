"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import { getInitials, cn } from "@/lib/utils";
import type { Conversation } from "@/lib/types";

type Props = {
  conversations: Conversation[];
  profileId: string;
  role: "user" | "creator";
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

export function ConversationList({
  conversations: initial,
  profileId,
  role,
}: Props) {
  const [conversations, setConversations] = useState(initial);

  // ── read-state fetch ──────────────────────────────────────────
  const fetchReadState = useCallback(async () => {
    if (!profileId || !isSupabaseConfigured()) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("conversation_reads")
      .select("conversation_id, last_read_at")
      .eq("user_id", profileId);

    if (!data) return;
    const readMap: Record<string, string> = {};
    for (const r of data) readMap[r.conversation_id] = r.last_read_at;

    // Recompute unread_count from current conversations state
    setConversations((prev) =>
      prev.map((conv) => {
        const lastRead = readMap[conv.id];
        if (!lastRead) return conv;
        // If we have a last_read and it's newer than last message, mark 0
        const lastMsgTime = conv.last_message?.created_at;
        if (lastMsgTime && new Date(lastMsgTime) <= new Date(lastRead)) {
          return { ...conv, unread_count: 0 };
        }
        return conv;
      })
    );
  }, [profileId]);

  // Stable ref — the realtime effect must NOT have fetchReadState in deps
  const fetchReadStateRef = useRef(fetchReadState);
  useEffect(() => {
    fetchReadStateRef.current = fetchReadState;
  }, [fetchReadState]);

  // Initial read-state sync
  useEffect(() => {
    fetchReadState();
  }, [fetchReadState]);

  // ── realtime ──────────────────────────────────────────────────
  // Only depends on [profileId]. All .on() handlers registered BEFORE
  // .subscribe() — never after — to satisfy the Supabase realtime contract.
  useEffect(() => {
    if (!isSupabaseConfigured() || !profileId) return;

    const supabase = createClient();

    const channel = supabase
      .channel(`conv-list:${profileId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const msg = payload.new as {
            conversation_id: string;
            sender_id: string;
            body: string;
            image_url: string | null;
            created_at: string;
          };

          setConversations((prev) => {
            const idx = prev.findIndex((c) => c.id === msg.conversation_id);
            if (idx === -1) return prev;

            const isOtherSender = msg.sender_id !== profileId;
            const updated: Conversation = {
              ...prev[idx],
              updated_at: msg.created_at,
              last_message: {
                body: msg.body,
                created_at: msg.created_at,
                image_url: msg.image_url,
              },
              unread_count: isOtherSender
                ? (prev[idx].unread_count ?? 0) + 1
                : prev[idx].unread_count,
            };

            return [
              updated,
              ...prev.filter((c) => c.id !== msg.conversation_id),
            ];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversation_reads",
          filter: `user_id=eq.${profileId}`,
        },
        () => {
          fetchReadStateRef.current();
        }
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[ConversationList] channel error:", err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId]); // intentionally excludes fetchReadState — use fetchReadStateRef

  // ── render ────────────────────────────────────────────────────
  if (conversations.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title={role === "user" ? "No messages yet" : "No conversations yet"}
        description={
          role === "user"
            ? "Start a conversation with a creator from any product page to ask questions or request something custom."
            : "When customers reach out about your work, their messages will appear here."
        }
        actionLabel={role === "user" ? "Browse marketplace" : undefined}
        actionHref={role === "user" ? "/marketplace" : undefined}
      />
    );
  }

  return (
    <ul className="divide-y divide-linen rounded-3xl border border-linen bg-white shadow-[var(--shadow-card)]">
      {conversations.map((conv) => {
        const name =
          conv.other_party?.store_name ||
          conv.other_party?.full_name ||
          "Unknown";
        const initials = getInitials(name);
        const timeStr = conv.last_message?.created_at || conv.updated_at;
        const unread = conv.unread_count ?? 0;
        const isImageOnly =
          !!conv.last_message?.image_url && !conv.last_message?.body;
        const lastMsgPreview = isImageOnly
          ? "📷 Image"
          : conv.last_message?.body || "";

        return (
          <li key={conv.id}>
            <Link
              href={`/messages/${conv.id}`}
              className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-sand/30 first:rounded-t-3xl last:rounded-b-3xl active:bg-sand/50"
            >
              {/* Avatar */}
              <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-sand ring-2 ring-linen">
                <span className="flex h-full w-full items-center justify-center font-heading text-sm text-terracotta">
                  {initials}
                </span>
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span
                    className={cn(
                      "truncate",
                      unread > 0
                        ? "font-semibold text-charcoal"
                        : "font-medium text-charcoal"
                    )}
                  >
                    {name}
                  </span>
                  {timeStr && (
                    <span
                      className={cn(
                        "shrink-0 text-xs",
                        unread > 0
                          ? "font-medium text-terracotta"
                          : "text-warm-gray"
                      )}
                    >
                      {relativeTime(timeStr)}
                    </span>
                  )}
                </div>
                {conv.product && (
                  <span className="text-xs text-saffron">
                    Re: {conv.product.name}
                  </span>
                )}
                {lastMsgPreview && (
                  <p
                    className={cn(
                      "mt-0.5 line-clamp-1 text-sm",
                      unread > 0
                        ? "font-medium text-charcoal"
                        : "text-warm-gray"
                    )}
                  >
                    {lastMsgPreview}
                  </p>
                )}
              </div>

              {/* Unread badge or chevron */}
              {unread > 0 ? (
                <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-bold text-cream">
                  {unread > 9 ? "9+" : unread}
                </span>
              ) : (
                <svg
                  className="h-4 w-4 shrink-0 text-linen"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
