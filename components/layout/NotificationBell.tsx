// "use client";

// import { useState, useEffect, useRef } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { markNotificationRead, markAllNotificationsRead } from "@/lib/actions/notifications";
// import { useNotifications } from "@/lib/hooks/useNotifications";
// import { cn } from "@/lib/utils";

// function timeAgo(dateStr: string): string {
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${mins}m ago`;
//   const hours = Math.floor(mins / 60);
//   if (hours < 24) return `${hours}h ago`;
//   const days = Math.floor(hours / 24);
//   return `${days}d ago`;
// }

// const TYPE_ICONS: Record<string, string> = {
//   new_message:    "💬",
//   order_placed:   "🛍️",
//   order_accepted: "✅",
//   order_update:   "📝",
//   order_completed:"🎉",
//   order_cancelled:"❌",
// };

// // Human-friendly label for each notification type shown in the bell panel
// const TYPE_LABELS: Record<string, string> = {
//   new_message:    "Message",
//   order_placed:   "New Order",
//   order_accepted: "Order Accepted",
//   order_update:   "Order Update",
//   order_completed:"Order Completed",
//   order_cancelled:"Order Cancelled",
// };

// type Props = { userId: string };

// export function NotificationBell({ userId }: Props) {
//   const [open, setOpen] = useState(false);
//   const { notifications, unreadCount, refetch } = useNotifications(userId);
//   const ref = useRef<HTMLDivElement>(null);
//   const router = useRouter();

//   // Close on outside click
//   useEffect(() => {
//     function handler(e: MouseEvent) {
//       if (ref.current && !ref.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     if (open) document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, [open]);

//   // Close on Escape
//   useEffect(() => {
//     function onKey(e: KeyboardEvent) {
//       if (e.key === "Escape") setOpen(false);
//     }
//     if (open) window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open]);

//   async function handleMarkRead(id: string) {
//     await markNotificationRead(id);
//     refetch();
//   }

//   async function handleMarkAll() {
//     await markAllNotificationsRead();
//     refetch();
//   }

//   async function handleNotificationClick(id: string, href: string | null, isRead: boolean) {
//     setOpen(false);
//     if (!isRead) {
//       await markNotificationRead(id);
//       refetch();
//     }
//     if (href) {
//       router.push(href);
//     }
//   }

//   // Split into unread / read for better UX
//   const unread = notifications.filter((n) => !n.is_read);
//   const read = notifications.filter((n) => n.is_read);

//   return (
//     <div ref={ref} className="relative">
//       {/* Bell button */}
//       <button
//         type="button"
//         onClick={() => setOpen((o) => !o)}
//         className="relative flex h-9 w-9 items-center justify-center rounded-full border border-linen/80 bg-cream transition-colors hover:bg-sand"
//         aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
//       >
//         {/* Bell icon */}
//         <svg
//           className="h-4 w-4 text-charcoal"
//           viewBox="0 0 24 24"
//           fill="none"
//           stroke="currentColor"
//           strokeWidth="1.8"
//           strokeLinecap="round"
//           strokeLinejoin="round"
//         >
//           <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
//           <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//         </svg>

//         {/* Unread badge */}
//         {unreadCount > 0 && (
//           <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-bold text-cream animate-in zoom-in-50 duration-200">
//             {unreadCount > 9 ? "9+" : unreadCount}
//           </span>
//         )}
//       </button>

//       {/* Dropdown panel */}
//       {open && (
//         <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-linen bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] sm:w-96">
//           {/* Header */}
//           <div className="flex items-center justify-between border-b border-linen px-4 py-3">
//             <div className="flex items-center gap-2">
//               <h3 className="font-heading text-base text-charcoal">Notifications</h3>
//               {unreadCount > 0 && (
//                 <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-cream">
//                   {unreadCount}
//                 </span>
//               )}
//             </div>
//             {unreadCount > 0 && (
//               <button
//                 onClick={handleMarkAll}
//                 className="text-xs text-saffron transition-colors hover:text-terracotta"
//               >
//                 Mark all read
//               </button>
//             )}
//           </div>

//           {/* Notification list */}
//           <div className="max-h-[400px] overflow-y-auto">
//             {notifications.length === 0 ? (
//               <div className="px-4 py-10 text-center">
//                 <span className="text-4xl opacity-25">🔔</span>
//                 <p className="mt-2 text-sm font-medium text-charcoal/50">You're all caught up!</p>
//                 <p className="mt-0.5 text-xs text-warm-gray/60">No notifications yet</p>
//               </div>
//             ) : (
//               <>
//                 {/* Unread section */}
//                 {unread.length > 0 && (
//                   <div>
//                     {read.length > 0 && (
//                       <p className="border-b border-linen/60 bg-sand/30 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-warm-gray/70">
//                         New
//                       </p>
//                     )}
//                     {unread.map((n) => (
//                       <NotificationRow
//                         key={n.id}
//                         notification={n}
//                         onMarkRead={handleMarkRead}
//                         onClickThrough={handleNotificationClick}
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {/* Read section */}
//                 {read.length > 0 && (
//                   <div>
//                     {unread.length > 0 && (
//                       <p className="border-b border-linen/60 bg-sand/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-warm-gray/50">
//                         Earlier
//                       </p>
//                     )}
//                     {read.map((n) => (
//                       <NotificationRow
//                         key={n.id}
//                         notification={n}
//                         onMarkRead={handleMarkRead}
//                         onClickThrough={handleNotificationClick}
//                       />
//                     ))}
//                   </div>
//                 )}
//               </>
//             )}
//           </div>

//           {/* Footer */}
//           {notifications.length > 0 && (
//             <div className="border-t border-linen px-4 py-2.5">
//               <p className="text-center text-[11px] text-warm-gray/60">
//                 Showing last {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
//               </p>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// // ── Single notification row ────────────────────────────────────────────────────

// type RowProps = {
//   notification: {
//     id: string;
//     type: string;
//     title: string;
//     body: string;
//     href: string | null;
//     is_read: boolean;
//     created_at: string;
//   };
//   onMarkRead: (id: string) => void;
//   onClickThrough: (id: string, href: string | null, isRead: boolean) => void;
// };

// function NotificationRow({ notification: n, onMarkRead, onClickThrough }: RowProps) {
//   const icon = TYPE_ICONS[n.type] ?? "🔔";
//   const typeLabel = TYPE_LABELS[n.type] ?? "";

//   const content = (
//     <div
//       className={cn(
//         "flex items-start gap-3 px-4 py-3 transition-colors",
//         n.href ? "cursor-pointer hover:bg-sand/40 active:bg-sand/70" : "hover:bg-sand/20",
//         !n.is_read && "bg-saffron/5"
//       )}
//       onClick={() => {
//         if (n.href) onClickThrough(n.id, n.href, n.is_read);
//       }}
//     >
//       {/* Icon */}
//       <span className="mt-0.5 shrink-0 text-lg">{icon}</span>

//       {/* Body */}
//       <div className="min-w-0 flex-1">
//         {typeLabel && (
//           <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-warm-gray/60">
//             {typeLabel}
//           </p>
//         )}
//         <p className={cn("text-[13px] leading-snug text-charcoal", !n.is_read && "font-semibold")}>
//           {n.title}
//         </p>
//         {n.body && (
//           <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-warm-gray">
//             {n.body}
//           </p>
//         )}
//         <p className="mt-1 text-[10px] text-warm-gray/50">{timeAgo(n.created_at)}</p>
//       </div>

//       {/* Unread dot */}
//       {!n.is_read && (
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             onMarkRead(n.id);
//           }}
//           className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-terracotta shadow-sm transition-transform hover:scale-125"
//           aria-label="Mark as read"
//           title="Mark as read"
//         />
//       )}
//     </div>
//   );

//   return (
//     <div className="border-b border-linen/50 last:border-b-0">
//       {content}
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  new_message:    "💬",
  order_placed:   "🛍️",
  order_accepted: "✅",
  order_update:   "📝",
  order_completed:"🎉",
  order_cancelled:"❌",
};

// Human-friendly label for each notification type shown in the bell panel
const TYPE_LABELS: Record<string, string> = {
  new_message:    "Message",
  order_placed:   "New Order",
  order_accepted: "Order Accepted",
  order_update:   "Order Update",
  order_completed:"Order Completed",
  order_cancelled:"Order Cancelled",
};

type Props = { userId: string };

export function NotificationBell({ userId }: Props) {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, refetch } = useNotifications(userId);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Mark all as read the moment the dropdown is opened — just like a real app
  useEffect(() => {
    if (!open) return;
    const hasUnread = notifications.some((n) => !n.is_read);
    if (!hasUnread) return;

    // Fire-and-forget: optimistically update UI first, then persist
    markAllNotificationsRead().then(() => {
      refetch();
      // Sync the navbar badge in AuthProvider
      window.dispatchEvent(new CustomEvent("kk:notifications-changed"));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function handleMarkRead(id: string) {
    await markNotificationRead(id);
    refetch();
    window.dispatchEvent(new CustomEvent("kk:notifications-changed"));
  }

  async function handleMarkAll() {
    await markAllNotificationsRead();
    refetch();
    window.dispatchEvent(new CustomEvent("kk:notifications-changed"));
  }

  async function handleNotificationClick(id: string, href: string | null, isRead: boolean) {
    setOpen(false);
    if (!isRead) {
      await markNotificationRead(id);
      refetch();
      window.dispatchEvent(new CustomEvent("kk:notifications-changed"));
    }
    if (href) {
      router.push(href);
    }
  }

  // Split into unread / read for better UX
  const unread = notifications.filter((n) => !n.is_read);
  const read = notifications.filter((n) => n.is_read);

  return (
    <div ref={ref} className="relative">
      {/* Bell button */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-linen/80 bg-cream transition-colors hover:bg-sand"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        {/* Bell icon */}
        <svg
          className="h-4 w-4 text-charcoal"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta text-[9px] font-bold text-cream animate-in zoom-in-50 duration-200">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-2xl border border-linen bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] sm:w-96">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-linen px-4 py-3">
            <div className="flex items-center gap-2">
              <h3 className="font-heading text-base text-charcoal">Notifications</h3>
              {unreadCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-[10px] font-bold text-cream">
                  {unreadCount}
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAll}
                className="text-xs text-saffron transition-colors hover:text-terracotta"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-10 text-center">
                <span className="text-4xl opacity-25">🔔</span>
                <p className="mt-2 text-sm font-medium text-charcoal/50">You're all caught up!</p>
                <p className="mt-0.5 text-xs text-warm-gray/60">No notifications yet</p>
              </div>
            ) : (
              <>
                {/* Unread section */}
                {unread.length > 0 && (
                  <div>
                    {read.length > 0 && (
                      <p className="border-b border-linen/60 bg-sand/30 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-warm-gray/70">
                        New
                      </p>
                    )}
                    {unread.map((n) => (
                      <NotificationRow
                        key={n.id}
                        notification={n}
                        onMarkRead={handleMarkRead}
                        onClickThrough={handleNotificationClick}
                      />
                    ))}
                  </div>
                )}

                {/* Read section */}
                {read.length > 0 && (
                  <div>
                    {unread.length > 0 && (
                      <p className="border-b border-linen/60 bg-sand/20 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-warm-gray/50">
                        Earlier
                      </p>
                    )}
                    {read.map((n) => (
                      <NotificationRow
                        key={n.id}
                        notification={n}
                        onMarkRead={handleMarkRead}
                        onClickThrough={handleNotificationClick}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-linen px-4 py-2.5">
              <p className="text-center text-[11px] text-warm-gray/60">
                Showing last {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Single notification row ────────────────────────────────────────────────────

type RowProps = {
  notification: {
    id: string;
    type: string;
    title: string;
    body: string;
    href: string | null;
    is_read: boolean;
    created_at: string;
  };
  onMarkRead: (id: string) => void;
  onClickThrough: (id: string, href: string | null, isRead: boolean) => void;
};

function NotificationRow({ notification: n, onMarkRead, onClickThrough }: RowProps) {
  const icon = TYPE_ICONS[n.type] ?? "🔔";
  const typeLabel = TYPE_LABELS[n.type] ?? "";

  const content = (
    <div
      className={cn(
        "flex items-start gap-3 px-4 py-3 transition-colors",
        n.href ? "cursor-pointer hover:bg-sand/40 active:bg-sand/70" : "hover:bg-sand/20",
        !n.is_read && "bg-saffron/5"
      )}
      onClick={() => {
        if (n.href) onClickThrough(n.id, n.href, n.is_read);
      }}
    >
      {/* Icon */}
      <span className="mt-0.5 shrink-0 text-lg">{icon}</span>

      {/* Body */}
      <div className="min-w-0 flex-1">
        {typeLabel && (
          <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wider text-warm-gray/60">
            {typeLabel}
          </p>
        )}
        <p className={cn("text-[13px] leading-snug text-charcoal", !n.is_read && "font-semibold")}>
          {n.title}
        </p>
        {n.body && (
          <p className="mt-0.5 line-clamp-2 text-[12px] leading-relaxed text-warm-gray">
            {n.body}
          </p>
        )}
        <p className="mt-1 text-[10px] text-warm-gray/50">{timeAgo(n.created_at)}</p>
      </div>

      {/* Unread dot */}
      {!n.is_read && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMarkRead(n.id);
          }}
          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-terracotta shadow-sm transition-transform hover:scale-125"
          aria-label="Mark as read"
          title="Mark as read"
        />
      )}
    </div>
  );

  return (
    <div className="border-b border-linen/50 last:border-b-0">
      {content}
    </div>
  );
}