"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/client";
import type { Notification } from "@/lib/types";

export function useNotifications(userId: string | undefined) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

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
      setNotifications(notes);
      setUnreadCount(notes.filter((n) => !n.is_read).length);
    }
  }, [userId]);

  // Stable ref — keeps realtime effect dep-free of fetchNotifications
  const fetchRef = useRef(fetchNotifications);
  useEffect(() => {
    fetchRef.current = fetchNotifications;
  }, [fetchNotifications]);

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Realtime — only re-subscribes when userId changes
  useEffect(() => {
    if (!userId || !isSupabaseConfigured()) return;

    const supabase = createClient();
    const channelName = `notifications:${userId}`;

    console.log("[useNotifications] subscribing to realtime channel:", channelName);

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("[useNotifications] realtime event received:", payload.eventType, payload.new);
          fetchRef.current();
        }
      )
      .subscribe((status, err) => {
        if (status === "SUBSCRIBED") {
          console.log("[useNotifications] realtime channel SUBSCRIBED:", channelName);
        } else if (status === "CHANNEL_ERROR") {
          console.error("[useNotifications] channel error:", err);
        } else if (status === "TIMED_OUT") {
          console.warn("[useNotifications] channel timed out, will retry:", channelName);
        } else {
          console.log("[useNotifications] channel status:", status);
        }
      });

    return () => {
      console.log("[useNotifications] unsubscribing channel:", channelName);
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]); // intentionally excludes fetchNotifications — use fetchRef

  return { notifications, unreadCount, refetch: fetchNotifications };
}
