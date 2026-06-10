import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

export type CreatorWithStats = Profile & { completed_orders_count: number };

export async function getCreators(limit?: number): Promise<Profile[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "creator")
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Profile[];
}

export async function getCreatorsWithStats(limit?: number): Promise<CreatorWithStats[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "creator")
    .order("created_at", { ascending: false });

  if (limit) query = query.limit(limit);

  const { data, error } = await query;
  if (error) return [];
  const creators = (data ?? []) as Profile[];
  if (creators.length === 0) return [];

  // Batch-fetch completed order counts
  const creatorIds = creators.map((c) => c.id);
  const { data: orderData } = await supabase
    .from("orders")
    .select("creator_id")
    .in("creator_id", creatorIds)
    .eq("status", "completed");

  const countMap: Record<string, number> = {};
  for (const row of orderData ?? []) {
    countMap[row.creator_id] = (countMap[row.creator_id] ?? 0) + 1;
  }

  return creators.map((c) => ({
    ...c,
    completed_orders_count: countMap[c.id] ?? 0,
  }));
}

export async function getCreatorById(id: string): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "creator")
    .single();

  if (error) return null;
  return data as Profile;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return null;
  return data as Profile;
}
