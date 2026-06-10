export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatLocation(
  city: string | null | undefined,
  state: string | null | undefined
): string | null {
  const parts = [city, state].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : null;
}

export function getDashboardPath(role: "user" | "creator"): string {
  return role === "creator" ? "/dashboard/creator" : "/dashboard/user";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

// ── Order product display helpers ─────────────────────────────────────────────

/**
 * Resolve the display label for a product on an order.
 *
 * Priority:
 * 1. product_id = null  → "Custom Request"
 * 2. product is present and active → product.name
 * 3. product is present but is_active = false → "{name} (Deleted Listing)"
 * 4. product is null but product_id exists → use snapshot name if available,
 *    otherwise "Product deleted by creator"
 */
export function resolveOrderProductName(order: {
  product_id: string | null;
  product_name_snapshot?: string | null;
  product?: { name?: string; is_active?: boolean } | null;
}): string {
  if (!order.product_id) return "Custom Request";
  if (order.product) {
    const name = order.product.name ?? order.product_name_snapshot ?? "Deleted Listing";
    return order.product.is_active === false ? `${name} (Deleted Listing)` : name;
  }
  // product_id exists but joined product is null (hard-deleted legacy row)
  return order.product_name_snapshot
    ? `${order.product_name_snapshot} (Deleted Listing)`
    : "Product deleted by creator";
}

/**
 * Resolve the image URL for a product on an order.
 * Falls back to the snapshot image if the product join is null.
 */
export function resolveOrderProductImage(order: {
  product_id: string | null;
  product_image_snapshot?: string | null;
  product?: { image_url?: string } | null;
}): string | null {
  return order.product?.image_url ?? order.product_image_snapshot ?? null;
}

// ── Profile completeness ────────────────────────────────────
export function getProfileCompleteness(
  profile: {
    avatar_url: string | null;
    banner_url?: string | null;
    bio: string | null;
    craft: string | null;
    city: string | null;
  },
  hasPortfolioItem: boolean
): { percent: number; missing: string[] } {
  const checks: Array<{ label: string; done: boolean }> = [
    { label: "Profile photo", done: !!profile.avatar_url },
    { label: "Banner image", done: !!profile.banner_url },
    { label: "About Me", done: !!profile.bio?.trim() },
    { label: "Craft category", done: !!profile.craft?.trim() },
    { label: "City", done: !!profile.city?.trim() },
    { label: "Portfolio item", done: hasPortfolioItem },
  ];

  const done = checks.filter((c) => c.done).length;
  const missing = checks.filter((c) => !c.done).map((c) => c.label);
  return { percent: Math.round((done / checks.length) * 100), missing };
}
