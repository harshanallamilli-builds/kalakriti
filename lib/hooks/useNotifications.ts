// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import { isSupabaseConfigured } from "@/lib/config";
// import { createClient } from "@/lib/supabase/client";
// import type { Notification } from "@/lib/types";

// // ── Toast popup for new notifications ────────────────────────────────────────
// // Shows a brief branded toast in the top-right when a new notification arrives.
// // Self-contained so it doesn't require an external toast library.

// const TOAST_ICONS: Record<string, string> = {
//   new_message: "💬",
//   order_placed: "🛍️",
//   order_accepted: "✅",
//   order_update: "📝",
//   order_completed: "🎉",
//   order_cancelled: "❌",
// };

// function showNotificationToast(notification: Notification) {
//   // Don't show if the page is already focused on the notifications area
//   if (typeof document === "undefined") return;

//   const id = `kk-toast-${notification.id}`;
//   if (document.getElementById(id)) return; // already shown

//   const icon = TOAST_ICONS[notification.type] ?? "🔔";

//   const toast = document.createElement("div");
//   toast.id = id;
//   toast.style.cssText = `
//     position: fixed;
//     top: 80px;
//     right: 16px;
//     z-index: 9999;
//     max-width: 320px;
//     min-width: 260px;
//     background: white;
//     border: 1px solid rgba(0,0,0,0.08);
//     border-radius: 16px;
//     box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08);
//     padding: 12px 16px;
//     display: flex;
//     align-items: flex-start;
//     gap: 10px;
//     cursor: pointer;
//     animation: kkSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;
//     font-family: inherit;
//   `;

//   // Inject keyframes once
//   if (!document.getElementById("kk-toast-styles")) {
//     const style = document.createElement("style");
//     style.id = "kk-toast-styles";
//     style.textContent = `
//       @keyframes kkSlideIn {
//         from { transform: translateX(110%); opacity: 0; }
//         to   { transform: translateX(0);   opacity: 1; }
//       }
//       @keyframes kkSlideOut {
//         from { transform: translateX(0);   opacity: 1; }
//         to   { transform: translateX(110%); opacity: 0; }
//       }
//     `;
//     document.head.appendChild(style);
//   }

//   toast.innerHTML = `
//     <span style="font-size:20px;line-height:1;flex-shrink:0;margin-top:1px">${icon}</span>
//     <div style="flex:1;min-width:0">
//       <p style="margin:0;font-size:13px;font-weight:600;color:#2d2926;line-height:1.3;word-break:break-word">
//         ${notification.title}
//       </p>
//       ${
//         notification.body
//           ? `<p style="margin:4px 0 0;font-size:12px;color:#6b6461;line-height:1.4;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">
//               ${notification.body}
//             </p>`
//           : ""
//       }
//     </div>
//     <button
//       style="flex-shrink:0;background:none;border:none;cursor:pointer;padding:0;color:#aaa;font-size:16px;line-height:1;margin-top:1px"
//       aria-label="Dismiss"
//       onclick="event.stopPropagation()"
//     >×</button>
//   `;

//   function dismiss() {
//     toast.style.animation = "kkSlideOut 0.25s ease-in both";
//     setTimeout(() => toast.remove(), 260);
//   }

//   // Close button
//   const closeBtn = toast.querySelector("button");
//   if (closeBtn) {
//     closeBtn.addEventListener("click", (e) => {
//       e.stopPropagation();
//       dismiss();
//     });
//   }

//   // Click to navigate
//   toast.addEventListener("click", () => {
//     if (notification.href) {
//       window.location.href = notification.href;
//     }
//     dismiss();
//   });

//   document.body.appendChild(toast);

//   // Auto-dismiss after 5 seconds
//   setTimeout(dismiss, 5000);
// }

// // ── Hook ──────────────────────────────────────────────────────────────────────

// export function useNotifications(userId: string | undefined) {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   // Track IDs we've already seen so we don't toast on initial load
//   const seenIdsRef = useRef<Set<string>>(new Set());
//   const initialLoadDoneRef = useRef(false);

//   const fetchNotifications = useCallback(async () => {
//     if (!userId || !isSupabaseConfigured()) return;

//     const supabase = createClient();
//     const { data, error } = await supabase
//       .from("notifications")
//       .select("*")
//       .eq("user_id", userId)
//       .order("created_at", { ascending: false })
//       .limit(30);

//     if (error) {
//       console.warn("[useNotifications] fetch error:", error.message);
//       return;
//     }

//     if (data) {
//       const notes = data as Notification[];

//       // On first load, seed seenIds — don't toast for existing notifications
//       if (!initialLoadDoneRef.current) {
//         for (const n of notes) seenIdsRef.current.add(n.id);
//         initialLoadDoneRef.current = true;
//       } else {
//         // On subsequent fetches, toast any NEW unread notifications
//         for (const n of notes) {
//           if (!seenIdsRef.current.has(n.id) && !n.is_read) {
//             seenIdsRef.current.add(n.id);
//             showNotificationToast(n);
//           } else {
//             seenIdsRef.current.add(n.id);
//           }
//         }
//       }

//       setNotifications(notes);
//       setUnreadCount(notes.filter((n) => !n.is_read).length);
//     }
//   }, [userId]);

//   // Stable ref
//   const fetchRef = useRef(fetchNotifications);
//   useEffect(() => {
//     fetchRef.current = fetchNotifications;
//   }, [fetchNotifications]);

//   // Initial fetch
//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);

//   // Realtime
//   useEffect(() => {
//     if (!userId || !isSupabaseConfigured()) return;

//     const supabase = createClient();
//     const channelName = `notifications:${userId}`;

//     const channel = supabase
//       .channel(channelName)
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "notifications",
//           filter: `user_id=eq.${userId}`,
//         },
//         (payload) => {
//           console.log("[useNotifications] realtime event:", payload.eventType);
//           fetchRef.current();
//         }
//       )
//       .subscribe((status, err) => {
//         if (status === "SUBSCRIBED") {
//           console.log("[useNotifications] subscribed:", channelName);
//         } else if (status === "CHANNEL_ERROR") {
//           console.error("[useNotifications] channel error:", err);
//         }
//       });

//     return () => {
//       supabase.removeChannel(channel);
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [userId]);

//   return { notifications, unreadCount, refetch: fetchNotifications };
// }


"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/lib/types";

const TOAST_ICONS: Record<string, string> = {
  new_message: "💬", order_placed: "🛍️", order_accepted: "✅",
  order_update: "📝", order_completed: "🎉", order_cancelled: "❌",
};

function showNotificationToast(notification: Notification) {
  if (typeof document === "undefined") return;
  const id = `kk-toast-${notification.id}`;
  if (document.getElementById(id)) return;

  if (!document.getElementById("kk-toast-styles")) {
    const style = document.createElement("style");
    style.id = "kk-toast-styles";
    style.textContent = `
      @keyframes kkSlideIn { from { transform:translateX(110%); opacity:0 } to { transform:translateX(0); opacity:1 } }
      @keyframes kkSlideOut { from { transform:translateX(0); opacity:1 } to { transform:translateX(110%); opacity:0 } }
    `;
    document.head.appendChild(style);
  }

  const toast = document.createElement("div");
  toast.id = id;
  toast.style.cssText = `position:fixed;top:80px;right:16px;z-index:9999;max-width:320px;min-width:260px;background:white;border:1px solid rgba(0,0,0,0.08);border-radius:16px;box-shadow:0 8px 32px rgba(0,0,0,0.12);padding:12px 16px;display:flex;align-items:flex-start;gap:10px;cursor:pointer;animation:kkSlideIn 0.3s cubic-bezier(0.34,1.56,0.64,1) both;font-family:inherit;`;
  toast.innerHTML = `
    <span style="font-size:20px;flex-shrink:0">${TOAST_ICONS[notification.type] ?? "🔔"}</span>
    <div style="flex:1;min-width:0">
      <p style="margin:0;font-size:13px;font-weight:600;color:#2d2926">${notification.title}</p>
      ${notification.body ? `<p style="margin:4px 0 0;font-size:12px;color:#6b6461;overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${notification.body}</p>` : ""}
    </div>
    <button style="background:none;border:none;cursor:pointer;color:#aaa;font-size:18px;line-height:1">×</button>
  `;

  function dismiss() {
    toast.style.animation = "kkSlideOut 0.25s ease-in both";
    setTimeout(() => toast.remove(), 260);
  }
  toast.querySelector("button")?.addEventListener("click", (e) => { e.stopPropagation(); dismiss(); });
  toast.addEventListener("click", () => { if (notification.href) window.location.href = notification.href; dismiss(); });
  document.body.appendChild(toast);
  setTimeout(dismiss, 5000);
}

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const seenIdsRef = useRef<Set<string>>(new Set());
  const initialLoadDoneRef = useRef(false);

  const fetchNotifications = useCallback(async () => {
    if (!userId || !isSupabaseConfigured()) return;

    const supabase = createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.warn("[useNotifications] fetch error:", error.message);
      return;
    }

    if (data) {
      const notes = data as Notification[];

      if (!initialLoadDoneRef.current) {
        for (const n of notes) seenIdsRef.current.add(n.id);
        initialLoadDoneRef.current = true;
      } else {
        for (const n of notes) {
          if (!seenIdsRef.current.has(n.id) && !n.is_read) {
            seenIdsRef.current.add(n.id);
            showNotificationToast(n);
          } else {
            seenIdsRef.current.add(n.id);
          }
        }
      }

      setNotifications(notes);
      setUnreadCount(notes.filter((n) => !n.is_read).length);
    }
  }, [userId]);

  const fetchRef = useRef(fetchNotifications);
  useEffect(() => { fetchRef.current = fetchNotifications; }, [fetchNotifications]);

  // Initial fetch only — NO realtime channel here.
  // Realtime is handled in AuthProvider (single channel) which calls refetch via context.
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Listen for the global event fired by AuthProvider's single channel
  useEffect(() => {
    function onChanged() {
      fetchRef.current();
    }

    window.addEventListener("kk:notifications-changed", onChanged);
    return () => window.removeEventListener("kk:notifications-changed", onChanged);
  }, []);

  return { notifications, unreadCount, refetch: fetchNotifications };
}