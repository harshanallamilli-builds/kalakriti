// import { createClient } from "@/lib/supabase/server";

// export type SocialLinkConfig = {
//   instagram: boolean;
//   whatsapp: boolean;
//   website: boolean;
//   youtube: boolean;
// };

// /**
//  * Fetches social link visibility settings from the platform_settings table.
//  * Admin panel writes to this table; this function reads it for public pages.
//  * Falls back to all-false if the table isn't seeded yet.
//  */
// export async function getSocialLinkConfig(): Promise<SocialLinkConfig> {
//   const supabase = await createClient();

//   const { data, error } = await supabase
//     .from("platform_settings")
//     .select("key, value")
//     .in("key", [
//       "social_link.instagram",
//       "social_link.whatsapp",
//       "social_link.website",
//       "social_link.youtube",
//     ]);

//   if (error || !data) {
//     return { instagram: false, whatsapp: false, website: false, youtube: false };
//   }

//   const map = Object.fromEntries(data.map((r) => [r.key, r.value === "true"]));

//   return {
//     instagram: map["social_link.instagram"] ?? false,
//     whatsapp:  map["social_link.whatsapp"]  ?? false,
//     website:   map["social_link.website"]   ?? false,
//     youtube:   map["social_link.youtube"]   ?? false,
//   };
// }

import { createClient } from "@/lib/supabase/server";
import type { CreatorLink } from "@/lib/types";

export type SocialLinkConfig = {
  instagram: boolean;
  whatsapp:  boolean;
  website:   boolean;
  youtube:   boolean;
  facebook:  boolean;
  custom:    boolean; // controls whether creator-named custom links are shown
};

/**
 * Fetches social link visibility settings from the platform_settings table.
 * Admin panel writes to this table; this function reads it for public pages.
 * Default: instagram active, all others inactive.
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
      "social_link.facebook",
      "social_link.custom",
    ]);

  if (error || !data) {
    // Safe fallback — only instagram shown
    return { instagram: true, whatsapp: false, website: false, youtube: false, facebook: false, custom: false };
  }

  const map = Object.fromEntries(data.map((r) => [r.key, r.value === "true"]));

  return {
    instagram: map["social_link.instagram"] ?? true,
    whatsapp:  map["social_link.whatsapp"]  ?? false,
    website:   map["social_link.website"]   ?? false,
    youtube:   map["social_link.youtube"]   ?? false,
    facebook:  map["social_link.facebook"]  ?? false,
    custom:    map["social_link.custom"]    ?? false,
  };
}

const KNOWN_LABELS = ["instagram", "whatsapp", "website", "youtube", "facebook"];

/**
 * Filters a creator's links array by what the admin has activated.
 * Known labels (instagram, whatsapp etc.) are matched by label name.
 * Any label not in the known list is treated as "custom".
 */
export function filterLinksByConfig(
  links: CreatorLink[],
  config: SocialLinkConfig
): CreatorLink[] {
  return links.filter((link) => {
    const label = link.label.toLowerCase().trim();
    if (!link.url) return false;

    if (label === "instagram") return config.instagram;
    if (label === "whatsapp")  return config.whatsapp;
    if (label === "website")   return config.website;
    if (label === "youtube")   return config.youtube;
    if (label === "facebook")  return config.facebook;

    // Anything else is a custom link
    if (!KNOWN_LABELS.includes(label)) return config.custom;

    return false;
  });
}