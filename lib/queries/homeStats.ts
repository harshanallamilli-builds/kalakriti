import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { HomeStats } from "@/lib/types";

export async function getHomeStats(): Promise<HomeStats> {
  if (!isSupabaseConfigured()) {
    return { artisanCount: 0, stateCount: 0, productCount: 0 };
  }

  const supabase = await createClient();

  const [creatorsRes, productsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("state", { count: "exact" })
      .eq("role", "creator"),
    supabase
      .from("products")
      .select("id", { count: "exact" })
      .eq("is_active", true),
  ]);

  const creators = creatorsRes.data ?? [];
  const artisanCount = creatorsRes.count ?? 0;
  const productCount = productsRes.count ?? 0;

  const stateCount = new Set(
    creators.map((c) => c.state).filter(Boolean)
  ).size;

  return { artisanCount, stateCount, productCount };
}