// "use client";

// import { useState, useEffect, useCallback, useRef } from "react";
// import Link from "next/link";
// import { EmptyState } from "@/components/ui/EmptyState";
// import { createClient } from "@/lib/supabase/client";
// import { isSupabaseConfigured } from "@/lib/config";
// import { getInitials, cn } from "@/lib/utils";
// import type { Conversation } from "@/lib/types";

// type Props = {
//   conversations: Conversation[];
//   profileId: string;
//   role: "user" | "creator";
// };

// function relativeTime(iso: string) {
//   const diff = Date.now() - new Date(iso).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "now";
//   if (mins < 60) return `${mins}m`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h`;
//   const days = Math.floor(hrs / 24);
//   if (days < 7) return `${days}d`;
//   return new Date(iso).toLocaleDateString("en-IN", {
//     day: "numeric",
//     month: "short",
//   });
// }

// // Deterministic avatar color from name string
// function avatarColor(name: string) {
//   const palette = [
//     "bg-terracotta/20 text-terracotta",
//     "bg-saffron/20 text-saffron",
//     "bg-sage/20 text-sage",
//     "bg-clay/20 text-clay",
//     "bg-moss/20 text-moss",
//   ];
//   let hash = 0;
//   for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
//   return palette[hash % palette.length];
// }

// export function ConversationList({
//   conversations: initial,
//   profileId,
//   role,
// }: Props) {
//   const [conversations, setConversations] = useState(initial);
//   const [searchQuery, setSearchQuery] = useState("");
//   // Track which conversation is currently open so realtime doesn't increment it
//   const activeConvIdRef = useRef<string | null>(null);
//   // Stable ref so fetchReadState can read current convIds without being a dependency
//   const conversationsRef = useRef(initial);
//   useEffect(() => { conversationsRef.current = conversations; }, [conversations]);

//   // ── read-state sync ─────────────────────────────────────────

//   const fetchReadState = useCallback(async () => {
//     if (!profileId || !isSupabaseConfigured()) return;
//     const supabase = createClient();

//     // Step 1: get the IDs of conversations this user is part of (via stable ref)
//     const convIds = conversationsRef.current.map((c) => c.id);
//     if (convIds.length === 0) return;

//     // Step 2: fetch read records AND only messages in those conversations from others
//     const [readsResult, msgsResult] = await Promise.all([
//       supabase
//         .from("conversation_reads")
//         .select("conversation_id, last_read_at")
//         .eq("user_id", profileId),
//       supabase
//         .from("messages")
//         .select("conversation_id, created_at")
//         .in("conversation_id", convIds)   // ← only THIS user's convs
//         .neq("sender_id", profileId),
//     ]);

//     if (!readsResult.data) return;

//     const readMap: Record<string, string> = {};
//     for (const r of readsResult.data) readMap[r.conversation_id] = r.last_read_at;

//     // Recompute unread: messages from others that arrived after last_read_at
//     const unreadCounts: Record<string, number> = {};
//     for (const msg of msgsResult.data ?? []) {
//       const lastRead = readMap[msg.conversation_id];
//       if (!lastRead || new Date(msg.created_at) > new Date(lastRead)) {
//         unreadCounts[msg.conversation_id] = (unreadCounts[msg.conversation_id] ?? 0) + 1;
//       }
//     }

//     setConversations((prev) =>
//       prev.map((conv) => {
//         if (activeConvIdRef.current === conv.id) {
//           return { ...conv, unread_count: 0 };
//         }
//         return { ...conv, unread_count: unreadCounts[conv.id] ?? 0 };
//       })
//     );
//   }, [profileId]);

//   const fetchReadStateRef = useRef(fetchReadState);
//   useEffect(() => {
//     fetchReadStateRef.current = fetchReadState;
//   }, [fetchReadState]);

//   useEffect(() => {
//     // Run immediately to apply any already-completed reads
//     void fetchReadState();
//     // Run again after 800 ms to catch the race where MessageThread's
//     // conversation_reads upsert hasn't finished before this page re-rendered
//     const t = setTimeout(() => void fetchReadStateRef.current(), 800);
//     return () => clearTimeout(t);
//   }, [fetchReadState]);

//   // Clear unread dot instantly when a conversation is opened (before realtime fires)
//   useEffect(() => {
//     function onMessagesRead(e: Event) {
//       const { conversationId } = (e as CustomEvent<{ conversationId: string }>).detail;
//       if (!conversationId) return;
//       // Track this as the active conversation so realtime doesn't re-increment it
//       activeConvIdRef.current = conversationId;
//       setConversations((prev) =>
//         prev.map((c) => (c.id === conversationId ? { ...c, unread_count: 0 } : c))
//       );
//     }
//     // When user navigates away from a conversation, clear the active ref
//     function onMessagesLeft(e: Event) {
//       const { conversationId } = (e as CustomEvent<{ conversationId: string }>).detail;
//       if (activeConvIdRef.current === conversationId) {
//         activeConvIdRef.current = null;
//       }
//     }
//     window.addEventListener("kk:messages-read", onMessagesRead);
//     window.addEventListener("kk:messages-left", onMessagesLeft);
//     return () => {
//       window.removeEventListener("kk:messages-read", onMessagesRead);
//       window.removeEventListener("kk:messages-left", onMessagesLeft);
//     };
//   }, []);

//   // ── realtime ────────────────────────────────────────────────

//   useEffect(() => {
//     if (!isSupabaseConfigured() || !profileId) return;
//     const supabase = createClient();

//     const channel = supabase
//       .channel(`convlist:${profileId}`)
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "messages" },
//         (payload) => {
//           const msg = payload.new as {
//             conversation_id: string;
//             sender_id: string;
//             body: string;
//             image_url: string | null;
//             created_at: string;
//           };

//           setConversations((prev) => {
//             const idx = prev.findIndex((c) => c.id === msg.conversation_id);
//             if (idx === -1) return prev;

//             const isOther = msg.sender_id !== profileId;
//             // Don't increment if this is the active conversation (user is reading it now)
//             const isActive = activeConvIdRef.current === msg.conversation_id;
//             const updated: Conversation = {
//               ...prev[idx],
//               updated_at: msg.created_at,
//               last_message: {
//                 body: msg.body,
//                 created_at: msg.created_at,
//                 image_url: msg.image_url,
//               },
//               unread_count: isOther && !isActive
//                 ? (prev[idx].unread_count ?? 0) + 1
//                 : prev[idx].unread_count,
//             };

//             return [updated, ...prev.filter((c) => c.id !== msg.conversation_id)];
//           });
//         }
//       )
//       .on(
//         "postgres_changes",
//         {
//           event: "*",
//           schema: "public",
//           table: "conversation_reads",
//           filter: `user_id=eq.${profileId}`,
//         },
//         () => {
//           void fetchReadStateRef.current();
//         }
//       )
//       .subscribe();

//     return () => {
//       void supabase.removeChannel(channel);
//     };
//   }, [profileId]);

//   // ── filtered list ───────────────────────────────────────────

//   const filtered = searchQuery.trim()
//     ? conversations.filter((conv) => {
//         const name =
//           conv.other_party?.store_name ||
//           conv.other_party?.full_name ||
//           "";
//         const product = conv.product?.name || "";
//         const q = searchQuery.toLowerCase();
//         return (
//           name.toLowerCase().includes(q) ||
//           product.toLowerCase().includes(q) ||
//           conv.last_message?.body?.toLowerCase().includes(q)
//         );
//       })
//     : conversations;

//   const totalUnread = conversations.reduce(
//     (n, c) => n + (c.unread_count ?? 0),
//     0
//   );

//   // ── render ──────────────────────────────────────────────────

//   if (conversations.length === 0) {
//     return (
//       <EmptyState
//         icon="💬"
//         title={role === "user" ? "No messages yet" : "No conversations yet"}
//         description={
//           role === "user"
//             ? "Start a conversation with a creator from any product page."
//             : "When customers reach out about your work, their messages will appear here."
//         }
//         actionLabel={role === "user" ? "Browse marketplace" : undefined}
//         actionHref={role === "user" ? "/marketplace" : undefined}
//       />
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Search bar */}
//       <div className="relative">
//         <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
//           <svg
//             className="h-4 w-4 text-warm-gray/60"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={1.8}
//               d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//             />
//           </svg>
//         </div>
//         <input
//           type="text"
//           placeholder="Search conversations…"
//           value={searchQuery}
//           onChange={(e) => setSearchQuery(e.target.value)}
//           className="w-full rounded-2xl border border-linen bg-white py-2.5 pl-9 pr-4 text-sm text-charcoal placeholder:text-warm-gray/60 shadow-[var(--shadow-card)] focus:border-clay/60 focus:outline-none focus:ring-2 focus:ring-clay/15 transition-colors"
//         />
//         {searchQuery && (
//           <button
//             onClick={() => setSearchQuery("")}
//             className="absolute inset-y-0 right-3 flex items-center text-warm-gray/60 hover:text-charcoal"
//           >
//             <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         )}
//       </div>

//       {/* Stats row */}
//       {totalUnread > 0 && (
//         <div className="flex items-center gap-2 px-1">
//           <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-bold text-cream">
//             {totalUnread > 99 ? "99+" : totalUnread}
//           </span>
//           <span className="text-xs text-warm-gray">unread message{totalUnread !== 1 ? "s" : ""}</span>
//         </div>
//       )}

//       {/* List */}
//       {filtered.length === 0 ? (
//         <div className="py-10 text-center">
//           <p className="text-sm text-warm-gray">No results for "{searchQuery}"</p>
//         </div>
//       ) : (
//         <ul className="overflow-hidden rounded-3xl border border-linen bg-white shadow-[var(--shadow-card)]">
//           {filtered.map((conv, idx) => {
//             const name =
//               conv.other_party?.store_name ||
//               conv.other_party?.full_name ||
//               "Artisan";
//             const initials = getInitials(name);
//             const colorClass = avatarColor(name);
//             const timeStr = conv.last_message?.created_at || conv.updated_at;
//             const unread = conv.unread_count ?? 0;
//             const isImageOnly =
//               !!conv.last_message?.image_url && !conv.last_message?.body;
//             const preview = isImageOnly
//               ? "📷 Photo"
//               : conv.last_message?.body || "";

//             return (
//               <li
//                 key={conv.id}
//                 className={idx < filtered.length - 1 ? "border-b border-linen/70" : ""}
//               >
//                 <Link
//                   href={`/messages/${conv.id}`}
//                   className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-sand/30 first:rounded-t-3xl last:rounded-b-3xl active:bg-sand/60"
//                 >
//                   {/* Avatar */}
//                   <div
//                     className={cn(
//                       "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-heading text-sm ring-2 ring-linen",
//                       colorClass
//                     )}
//                   >
//                     {initials}
//                     {/* Online dot placeholder — remove if not tracking presence */}
//                   </div>

//                   {/* Content */}
//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-baseline justify-between gap-2">
//                       <span
//                         className={cn(
//                           "truncate text-[15px]",
//                           unread > 0
//                             ? "font-semibold text-charcoal"
//                             : "font-medium text-charcoal"
//                         )}
//                       >
//                         {name}
//                       </span>
//                       {timeStr && (
//                         <span
//                           className={cn(
//                             "shrink-0 text-[11px]",
//                             unread > 0
//                               ? "font-semibold text-terracotta"
//                               : "text-warm-gray"
//                           )}
//                         >
//                           {relativeTime(timeStr)}
//                         </span>
//                       )}
//                     </div>

//                     {conv.product && (
//                       <p className="truncate text-[11px] text-saffron">
//                         Re: {conv.product.name}
//                       </p>
//                     )}

//                     {preview && (
//                       <p
//                         className={cn(
//                           "mt-0.5 line-clamp-1 text-[13px]",
//                           unread > 0
//                             ? "font-medium text-charcoal"
//                             : "text-warm-gray"
//                         )}
//                       >
//                         {preview}
//                       </p>
//                     )}
//                   </div>

//                   {/* Right side: badge or chevron */}
//                   {unread > 0 ? (
//                     <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-bold text-cream">
//                       {unread > 9 ? "9+" : unread}
//                     </span>
//                   ) : (
//                     <svg
//                       className="h-4 w-4 shrink-0 text-linen transition-colors group-hover:text-warm-gray/50"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.5}
//                         d="M9 5l7 7-7 7"
//                       />
//                     </svg>
//                   )}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }



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
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
}

// Deterministic avatar color from name string
function avatarColor(name: string) {
  const palette = [
    "bg-terracotta/20 text-terracotta",
    "bg-saffron/20 text-saffron",
    "bg-sage/20 text-sage",
    "bg-clay/20 text-clay",
    "bg-moss/20 text-moss",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return palette[hash % palette.length];
}

export function ConversationList({
  conversations: initial,
  profileId,
  role,
}: Props) {
  const [conversations, setConversations] = useState(initial);
  const [searchQuery, setSearchQuery] = useState("");
  // Track which conversation is currently open so realtime doesn't increment it
  const activeConvIdRef = useRef<string | null>(null);
  // Stable ref so fetchReadState can read current convIds without being a dependency
  const conversationsRef = useRef(initial);
  useEffect(() => { conversationsRef.current = conversations; }, [conversations]);

  // ── read-state sync ─────────────────────────────────────────

  const fetchReadState = useCallback(async () => {
    if (!profileId || !isSupabaseConfigured()) return;
    const supabase = createClient();

    // Step 1: get the IDs of conversations this user is part of (via stable ref)
    const convIds = conversationsRef.current.map((c) => c.id);
    if (convIds.length === 0) return;

    // Step 2: fetch read records AND only messages in those conversations from others
    const [readsResult, msgsResult] = await Promise.all([
      supabase
        .from("conversation_reads")
        .select("conversation_id, last_read_at")
        .eq("user_id", profileId),
      supabase
        .from("messages")
        .select("conversation_id, created_at")
        .in("conversation_id", convIds)   // ← only THIS user's convs
        .neq("sender_id", profileId),
    ]);

    if (!readsResult.data) return;

    const readMap: Record<string, string> = {};
    for (const r of readsResult.data) readMap[r.conversation_id] = r.last_read_at;

    // Recompute unread: messages from others that arrived after last_read_at
    const unreadCounts: Record<string, number> = {};
    for (const msg of msgsResult.data ?? []) {
      const lastRead = readMap[msg.conversation_id];
      if (!lastRead || new Date(msg.created_at) > new Date(lastRead)) {
        unreadCounts[msg.conversation_id] = (unreadCounts[msg.conversation_id] ?? 0) + 1;
      }
    }

    setConversations((prev) =>
      prev.map((conv) => {
        if (activeConvIdRef.current === conv.id) {
          return { ...conv, unread_count: 0 };
        }
        return { ...conv, unread_count: unreadCounts[conv.id] ?? 0 };
      })
    );
  }, [profileId]);

  const fetchReadStateRef = useRef(fetchReadState);
  useEffect(() => {
    fetchReadStateRef.current = fetchReadState;
  }, [fetchReadState]);

  useEffect(() => {
    // Run immediately to apply any already-completed reads
    void fetchReadState();
    // Run again after 800 ms to catch the race where MessageThread's
    // conversation_reads upsert hasn't finished before this page re-rendered
    const t = setTimeout(() => void fetchReadStateRef.current(), 800);
    return () => clearTimeout(t);
  }, [fetchReadState]);

  // Clear unread dot instantly when a conversation is opened (before realtime fires)
  useEffect(() => {
    function onMessagesRead(e: Event) {
      const { conversationId } = (e as CustomEvent<{ conversationId: string }>).detail;
      if (!conversationId) return;
      // Track this as the active conversation so realtime doesn't re-increment it
      activeConvIdRef.current = conversationId;
      setConversations((prev) =>
        prev.map((c) => (c.id === conversationId ? { ...c, unread_count: 0 } : c))
      );
    }
    // When user navigates away from a conversation, clear the active ref
    function onMessagesLeft(e: Event) {
      const { conversationId } = (e as CustomEvent<{ conversationId: string }>).detail;
      if (activeConvIdRef.current === conversationId) {
        activeConvIdRef.current = null;
      }
    }
    window.addEventListener("kk:messages-read", onMessagesRead);
    window.addEventListener("kk:messages-left", onMessagesLeft);
    return () => {
      window.removeEventListener("kk:messages-read", onMessagesRead);
      window.removeEventListener("kk:messages-left", onMessagesLeft);
    };
  }, []);

  // ── realtime ────────────────────────────────────────────────

  useEffect(() => {
    if (!isSupabaseConfigured() || !profileId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`convlist:${profileId}`)
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
            if (idx === -1) return prev; // new conversation — handled by conversations INSERT below

            const isOther = msg.sender_id !== profileId;
            // Don't increment if this is the active conversation (user is reading it now)
            const isActive = activeConvIdRef.current === msg.conversation_id;
            const updated: Conversation = {
              ...prev[idx],
              updated_at: msg.created_at,
              last_message: {
                body: msg.body,
                created_at: msg.created_at,
                image_url: msg.image_url,
              },
              unread_count: isOther && !isActive
                ? (prev[idx].unread_count ?? 0) + 1
                : prev[idx].unread_count,
            };

            return [updated, ...prev.filter((c) => c.id !== msg.conversation_id)];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          // A new conversation involving this profile was created by the other party.
          // Fetch fresh data so it appears in the list without a manual page refresh.
          event: "INSERT",
          schema: "public",
          table: "conversations",
          filter: `creator_id=eq.${profileId}`,
        },
        async () => {
          // Re-fetch conversations from the server so we get full profile + product joins
          const res = await fetch(`/api/conversations?profileId=${profileId}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setConversations(data);
              void fetchReadStateRef.current();
            }
          } else {
            // Fallback: refetch read state — the new conversation will appear on next navigation
            void fetchReadStateRef.current();
          }
        }
      )
      .on(
        "postgres_changes",
        {
          // Same, but this profile is the user side (in case user receives a reply in a new conv)
          event: "INSERT",
          schema: "public",
          table: "conversations",
          filter: `user_id=eq.${profileId}`,
        },
        async () => {
          const res = await fetch(`/api/conversations?profileId=${profileId}`);
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              setConversations(data);
              void fetchReadStateRef.current();
            }
          }
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
          void fetchReadStateRef.current();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [profileId]);

  // ── filtered list ───────────────────────────────────────────

  const filtered = searchQuery.trim()
    ? conversations.filter((conv) => {
        const name =
          conv.other_party?.store_name ||
          conv.other_party?.full_name ||
          "";
        const product = conv.product?.name || "";
        const q = searchQuery.toLowerCase();
        return (
          name.toLowerCase().includes(q) ||
          product.toLowerCase().includes(q) ||
          conv.last_message?.body?.toLowerCase().includes(q)
        );
      })
    : conversations;

  const totalUnread = conversations.reduce(
    (n, c) => n + (c.unread_count ?? 0),
    0
  );

  // ── render ──────────────────────────────────────────────────

  if (conversations.length === 0) {
    return (
      <EmptyState
        icon="💬"
        title={role === "user" ? "No messages yet" : "No conversations yet"}
        description={
          role === "user"
            ? "Start a conversation with a creator from any product page."
            : "When customers reach out about your work, their messages will appear here."
        }
        actionLabel={role === "user" ? "Browse marketplace" : undefined}
        actionHref={role === "user" ? "/marketplace" : undefined}
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center">
          <svg
            className="h-4 w-4 text-warm-gray/60"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search conversations…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-linen bg-white py-2.5 pl-9 pr-4 text-sm text-charcoal placeholder:text-warm-gray/60 shadow-[var(--shadow-card)] focus:border-clay/60 focus:outline-none focus:ring-2 focus:ring-clay/15 transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute inset-y-0 right-3 flex items-center text-warm-gray/60 hover:text-charcoal"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {/* Stats row */}
      {totalUnread > 0 && (
        <div className="flex items-center gap-2 px-1">
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-bold text-cream">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>
          <span className="text-xs text-warm-gray">unread message{totalUnread !== 1 ? "s" : ""}</span>
        </div>
      )}

      {/* List */}
      {filtered.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-sm text-warm-gray">No results for "{searchQuery}"</p>
        </div>
      ) : (
        <ul className="overflow-hidden rounded-3xl border border-linen bg-white shadow-[var(--shadow-card)]">
          {filtered.map((conv, idx) => {
            const name =
              conv.other_party?.store_name ||
              conv.other_party?.full_name ||
              "Artisan";
            const initials = getInitials(name);
            const colorClass = avatarColor(name);
            const timeStr = conv.last_message?.created_at || conv.updated_at;
            const unread = conv.unread_count ?? 0;
            const isImageOnly =
              !!conv.last_message?.image_url && !conv.last_message?.body;
            const preview = isImageOnly
              ? "📷 Photo"
              : conv.last_message?.body || "";

            return (
              <li
                key={conv.id}
                className={idx < filtered.length - 1 ? "border-b border-linen/70" : ""}
              >
                <Link
                  href={`/messages/${conv.id}`}
                  className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-sand/30 first:rounded-t-3xl last:rounded-b-3xl active:bg-sand/60"
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-heading text-sm ring-2 ring-linen",
                      colorClass
                    )}
                  >
                    {initials}
                    {/* Online dot placeholder — remove if not tracking presence */}
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span
                        className={cn(
                          "truncate text-[15px]",
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
                            "shrink-0 text-[11px]",
                            unread > 0
                              ? "font-semibold text-terracotta"
                              : "text-warm-gray"
                          )}
                        >
                          {relativeTime(timeStr)}
                        </span>
                      )}
                    </div>

                    {conv.product && (
                      <p className="truncate text-[11px] text-saffron">
                        Re: {conv.product.name}
                      </p>
                    )}

                    {preview && (
                      <p
                        className={cn(
                          "mt-0.5 line-clamp-1 text-[13px]",
                          unread > 0
                            ? "font-medium text-charcoal"
                            : "text-warm-gray"
                        )}
                      >
                        {preview}
                      </p>
                    )}
                  </div>

                  {/* Right side: badge or chevron */}
                  {unread > 0 ? (
                    <span className="ml-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-terracotta px-1.5 text-[11px] font-bold text-cream">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : (
                    <svg
                      className="h-4 w-4 shrink-0 text-linen transition-colors group-hover:text-warm-gray/50"
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
      )}
    </div>
  );
}