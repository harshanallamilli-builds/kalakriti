"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";
import { useNotifications } from "@/lib/hooks/useNotifications";
import { cn } from "@/lib/utils";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const TYPE_ICONS: Record<string, string> = {
  new_message: "💬",
  order_placed: "🛍️",
  order_accepted: "✅",
  order_update: "📝",
  order_completed: "🎉",
  order_cancelled: "❌",
};

type Props = { userId: string };

export function NotificationBell({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, refetch } = useNotifications(userId);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    refetch();
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    refetch();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-linen/80 bg-cream transition-colors hover:bg-sand"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <svg className="h-4 w-4 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-bold text-cream">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-linen bg-white shadow-[var(--shadow-lift)] sm:w-96">
          <div className="flex items-center justify-between border-b border-linen px-4 py-3">
            <h3 className="font-heading text-base text-charcoal">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-saffron hover:text-terracotta transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[340px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <span className="text-3xl opacity-30">🔔</span>
                <p className="mt-2 text-sm text-warm-gray">You're all caught up!</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-sand/40",
                    !n.is_read && "bg-saffron/5"
                  )}
                >
                  <span className="mt-0.5 text-lg shrink-0">{TYPE_ICONS[n.type] ?? "🔔"}</span>
                  <div className="min-w-0 flex-1">
                    {n.href ? (
                      <Link
                        href={n.href}
                        onClick={() => { if (!n.is_read) handleMarkRead(n.id); setOpen(false); }}
                        className="block"
                      >
                        <p className={cn("text-sm text-charcoal leading-snug", !n.is_read && "font-medium")}>
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-warm-gray">{n.body}</p>
                        )}
                      </Link>
                    ) : (
                      <>
                        <p className={cn("text-sm text-charcoal leading-snug", !n.is_read && "font-medium")}>
                          {n.title}
                        </p>
                        {n.body && (
                          <p className="mt-0.5 line-clamp-2 text-xs text-warm-gray">{n.body}</p>
                        )}
                      </>
                    )}
                    <p className="mt-0.5 text-[11px] text-warm-gray/60">{timeAgo(n.created_at)}</p>
                  </div>
                  {!n.is_read && (
                    <button
                      onClick={() => handleMarkRead(n.id)}
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-terracotta hover:bg-clay transition-colors"
                      aria-label="Mark as read"
                      title="Mark as read"
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
