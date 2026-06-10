"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import type { Profile } from "@/lib/types";

type AuthContextValue = {
  profile: Profile | null;
  isLoading: boolean;
  refresh: () => Promise<void>;
  clearAuth: () => void;
  /** Total unread message count across all conversations. Sourced from a
   *  single realtime channel owned by AuthProvider — safe to read in any
   *  number of components without creating duplicate subscriptions. */
  unreadMessageCount: number;
};

const AuthContext = createContext<AuthContextValue>({
  profile: null,
  isLoading: true,
  refresh: async () => {},
  clearAuth: () => {},
  unreadMessageCount: 0,
});

// ─── unread-count helpers (no hook — runs inside AuthProvider) ────────────────

async function fetchUnreadCount(
  profileId: string
): Promise<number> {
  if (!isSupabaseConfigured()) return 0;
  const supabase = createClient();

  const { data: convs } = await supabase
    .from("conversations")
    .select("id")
    .or(`user_id.eq.${profileId},creator_id.eq.${profileId}`);

  if (!convs || convs.length === 0) return 0;
  const convIds = convs.map((c) => c.id);

  const { data: readRows } = await supabase
    .from("conversation_reads")
    .select("conversation_id, last_read_at")
    .eq("user_id", profileId)
    .in("conversation_id", convIds);

  const readByConv: Record<string, string> = {};
  for (const r of readRows ?? []) {
    readByConv[r.conversation_id] = r.last_read_at;
  }

  const { data: msgs } = await supabase
    .from("messages")
    .select("conversation_id, created_at, sender_id")
    .in("conversation_id", convIds)
    .neq("sender_id", profileId);

  let count = 0;
  for (const msg of msgs ?? []) {
    const lastRead = readByConv[msg.conversation_id];
    if (!lastRead || new Date(msg.created_at) > new Date(lastRead)) {
      count++;
    }
  }
  return count;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const refreshingRef = useRef(false);

  const clearAuth = useCallback(() => {
    setProfile(null);
    setIsLoading(false);
    setUnreadMessageCount(0);
  }, []);

  const refresh = useCallback(async (force = false) => {
    if (!force && refreshingRef.current) return;
    refreshingRef.current = true;

    try {
      if (!isSupabaseConfigured()) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProfile(null);
        setIsLoading(false);
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile((data as Profile) ?? null);
      setIsLoading(false);
    } catch {
      setProfile(null);
      setIsLoading(false);
    } finally {
      refreshingRef.current = false;
    }
  }, []);

  // ── Initial load + auth state listener ────────────────────
  useEffect(() => {
    refresh();

    if (!isSupabaseConfigured()) return;

    const supabase = createClient();
    const {
      data: { subscription: authSub },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setProfile(null);
        setIsLoading(false);
        setUnreadMessageCount(0);
        router.refresh();
      } else if (event === "SIGNED_IN" || event === "USER_UPDATED") {
        refresh(true).then(() => {
          router.refresh();
        });
      }
    });

    return () => authSub.unsubscribe();
  }, [refresh, router]);

  // ── Profile realtime sync ──────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured() || !profile?.id) return;

    const supabase = createClient();
    const profileId = profile.id;

    const channel = supabase
      .channel(`profile-sync:${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${profileId}`,
        },
        (payload) => {
          setProfile((prev) =>
            prev ? { ...prev, ...(payload.new as Profile) } : prev
          );
        }
      )
      .subscribe((status) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          supabase.removeChannel(channel);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile?.id]);

  // ── Unread message count — ONE channel for the entire app ──
  //
  // Root cause of the Phase C crash:
  //   Both <Navbar> and <MobileNav> called useUnreadMessages(profileId),
  //   each trying to create channel("unread-messages:<id>"). Supabase's
  //   client-side channel registry returns the SAME cached object on the
  //   second call (already subscribed), so the second .on() threw:
  //   "cannot add postgres_changes callbacks after subscribe()".
  //
  // Fix: own the single channel here in AuthProvider. Any number of
  // components can read `unreadMessageCount` from context with zero risk
  // of duplicate channels.
  //
  // The stable-ref pattern is still used so the realtime effect only
  // depends on [profile?.id] and never re-subscribes on re-renders.
  const doFetchUnread = useCallback(async () => {
    if (!profile?.id) { setUnreadMessageCount(0); return; }
    const count = await fetchUnreadCount(profile.id);
    setUnreadMessageCount(count);
  }, [profile?.id]);

  const doFetchUnreadRef = useRef(doFetchUnread);
  useEffect(() => {
    doFetchUnreadRef.current = doFetchUnread;
  }, [doFetchUnread]);

  // Initial fetch whenever profile changes
  useEffect(() => {
    doFetchUnread();
  }, [doFetchUnread]);

  // Clear badge when navigating to /messages
  useEffect(() => {
    if (pathname?.startsWith("/messages")) {
      setUnreadMessageCount(0);
    }
  }, [pathname]);

  // Single realtime channel — all .on() before .subscribe()
  useEffect(() => {
    if (!profile?.id || !isSupabaseConfigured()) return;

    const profileId = profile.id;
    const supabase = createClient();

    const channel = supabase
      .channel(`unread-messages:${profileId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          const msg = payload.new as { sender_id: string };
          if (msg.sender_id !== profileId) {
            doFetchUnreadRef.current();
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
          doFetchUnreadRef.current();
        }
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR") {
          console.warn("[AuthProvider] unread channel error:", err);
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.id]); // stable — never depends on doFetchUnread directly

  // ── Safety net ─────────────────────────────────────────────
  useEffect(() => {
    if (!isLoading) return;
    const t = setTimeout(() => setIsLoading(false), 5000);
    return () => clearTimeout(t);
  }, [isLoading]);

  const value = useMemo(
    () => ({ profile, isLoading, refresh, clearAuth, unreadMessageCount }),
    [profile, isLoading, refresh, clearAuth, unreadMessageCount]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
