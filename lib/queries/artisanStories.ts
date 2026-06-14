import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { ArtisanStory } from "@/lib/types";

export async function getFeaturedStories(limit = 4): Promise<ArtisanStory[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("artisan_stories")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(limit);
  if (error) { console.error("getFeaturedStories:", error.message); return []; }
  return (data ?? []) as ArtisanStory[];
}