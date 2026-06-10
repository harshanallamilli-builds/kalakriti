import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SupabaseNotice } from "@/components/ui/SupabaseNotice";
import { isSupabaseConfigured } from "@/lib/config";
import { getProducts } from "@/lib/queries/products";
import { PRODUCT_CATEGORIES } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse authentic handmade pieces from independent Indian artisans. Pottery, textiles, brass work, and more — all priced in ₹.",
};

export default async function MarketplacePage() {
  const configured = isSupabaseConfigured();
  const products = configured ? await getProducts() : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Marketplace"
        title="Shop handmade India"
        description="Browse authentic pieces from registered artisans. Prices in ₹. Message makers to order."
        className="mb-8"
      />
      {!configured && (
        <div className="mb-8">
          <SupabaseNotice />
        </div>
      )}
      <MarketplaceClient products={products} categories={[...PRODUCT_CATEGORIES]} />
    </div>
  );
}
