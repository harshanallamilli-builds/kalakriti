import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";

export async function getProducts(options?: {
  category?: string;
  creatorId?: string;
  limit?: number;
}): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      `
      *,
      creator:profiles!creator_id (
        id, full_name, store_name, craft, city, state, avatar_url
      )
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (options?.category) {
    query = query.eq("category", options.category);
  }
  if (options?.creatorId) {
    query = query.eq("creator_id", options.creatorId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) {
    console.error("getProducts:", error.message);
    return [];
  }

  return (data ?? []) as Product[];
}

export async function getProductById(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      *,
      creator:profiles!creator_id (
        id, full_name, store_name, craft, city, state, avatar_url, bio, whatsapp
      )
    `
    )
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getCreatorProducts(
  creatorId: string,
  includeInactive = false
): Promise<Product[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select("*")
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (!includeInactive) {
    query = query.eq("is_active", true);
  }

  const { data, error } = await query;
  if (error) return [];
  return (data ?? []) as Product[];
}
