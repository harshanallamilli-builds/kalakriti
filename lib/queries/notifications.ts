import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Notification } from "@/lib/types";

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) return [];
  return (data ?? []) as Notification[];
}

export async function getUnreadNotificationCount(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("notifications")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("is_read", false);

  if (error) return 0;
  return count ?? 0;
}

/** Calculate creator response time label based on conversation history. */
export async function getCreatorResponseTime(
  creatorId: string
): Promise<string> {
  if (!isSupabaseConfigured()) return "New creator";

  const supabase = await createClient();

  // Get conversations where this person is creator, with messages
  const { data: conversations } = await supabase
    .from("conversations")
    .select("id")
    .eq("creator_id", creatorId)
    .limit(20);

  if (!conversations || conversations.length === 0) return "New creator";

  const convIds = conversations.map((c) => c.id);

  // Get messages from these conversations, ordered by created_at
  const { data: messages } = await supabase
    .from("messages")
    .select("conversation_id, sender_id, created_at")
    .in("conversation_id", convIds)
    .order("created_at", { ascending: true });

  if (!messages || messages.length < 2) return "New creator";

  // Calculate response times: find pairs where creator replies to non-creator
  const responseTimes: number[] = [];
  const lastUserMsg: Record<string, { created_at: string }> = {};

  for (const msg of messages) {
    if (msg.sender_id !== creatorId) {
      lastUserMsg[msg.conversation_id] = { created_at: msg.created_at };
    } else if (lastUserMsg[msg.conversation_id]) {
      const userTime = new Date(lastUserMsg[msg.conversation_id].created_at).getTime();
      const replyTime = new Date(msg.created_at).getTime();
      const diffHours = (replyTime - userTime) / (1000 * 60 * 60);
      if (diffHours > 0 && diffHours < 168) { // ignore > 1 week
        responseTimes.push(diffHours);
      }
      delete lastUserMsg[msg.conversation_id];
    }
  }

  if (responseTimes.length < 2) return "New creator";

  const avg = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;

  if (avg < 4) return "A few hours";
  if (avg < 28) return "1 day";
  return "2+ days";
}
