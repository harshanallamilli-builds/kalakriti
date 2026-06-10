import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { PortfolioItem } from "@/lib/types";

export async function getCreatorPortfolio(creatorId: string): Promise<PortfolioItem[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as PortfolioItem[];
}

export async function getCompletedOrdersCount(creatorId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = await createClient();
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("creator_id", creatorId)
    .eq("status", "completed");

  if (error) return 0;
  return count ?? 0;
}
