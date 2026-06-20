import type { MetadataRoute } from "next";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

const BASE = "https://kalakrithi.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/marketplace`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/creators`, lastModified: new Date(), changeFrequency: "daily", priority: 0.85 },
    { url: `${BASE}/founder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  if (!isSupabaseConfigured()) return staticRoutes;

  const supabase = await createClient();

  // Creator profile pages
  const { data: creators } = await supabase
    .from("profiles")
    .select("id, updated_at")
    .eq("role", "creator");

  const creatorRoutes: MetadataRoute.Sitemap = (creators ?? []).map((c) => ({
    url: `${BASE}/creators/${c.id}`,
    lastModified: new Date(c.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Marketplace listing pages
  const { data: products } = await supabase
    .from("products")
    .select("id, updated_at")
    .eq("is_active", true);

  const productRoutes: MetadataRoute.Sitemap = (products ?? []).map((p) => ({
    url: `${BASE}/marketplace/${p.id}`,
    lastModified: new Date(p.updated_at ?? new Date()),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...creatorRoutes, ...productRoutes];
}