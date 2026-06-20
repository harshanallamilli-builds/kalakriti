import { createClient } from "@/lib/supabase/server";

export type SocialLinkConfig = {
  instagram: boolean;
  whatsapp: boolean;
  website: boolean;
  youtube: boolean;
};

/**
 * Fetches social link visibility settings from the platform_settings table.
 * Admin panel writes to this table; this function reads it for public pages.
 * Falls back to all-false if the table isn't seeded yet.
 */
export async function getSocialLinkConfig(): Promise<SocialLinkConfig> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("platform_settings")
    .select("key, value")
    .in("key", [
      "social_link.instagram",
      "social_link.whatsapp",
      "social_link.website",
      "social_link.youtube",
    ]);

  if (error || !data) {
    return { instagram: false, whatsapp: false, website: false, youtube: false };
  }

  const map = Object.fromEntries(data.map((r) => [r.key, r.value === "true"]));

  return {
    instagram: map["social_link.instagram"] ?? false,
    whatsapp:  map["social_link.whatsapp"]  ?? false,
    website:   map["social_link.website"]   ?? false,
    youtube:   map["social_link.youtube"]   ?? false,
  };
}