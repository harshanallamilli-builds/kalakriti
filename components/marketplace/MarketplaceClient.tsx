"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { ProductMasonry } from "@/components/products/ProductMasonry";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

type MarketplaceClientProps = {
  products: Product[];
  categories: string[];
};

export function MarketplaceClient({ products, categories }: MarketplaceClientProps) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchCat = category === "All" || p.category === category;
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.creator?.full_name?.toLowerCase().includes(q) ?? false) ||
        (p.creator?.store_name?.toLowerCase().includes(q) ?? false);
      return matchCat && matchQ;
    });
  }, [products, category, query]);

  return (
    <>
      {/* Search — full width on mobile, constrained on desktop */}
      <div className="mb-4">
        <input
          type="search"
          placeholder="Search pieces or artisans…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full border border-linen bg-white px-4 py-2.5 text-sm focus:border-clay focus:outline-none focus:ring-2 focus:ring-clay/20 lg:max-w-xs"
        />
      </div>

      {/* Category pills — horizontally scrollable on mobile */}
      <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm transition-all",
              category === cat
                ? "bg-charcoal text-cream"
                : "bg-sand/70 text-warm-gray hover:bg-sand"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="mb-6 text-sm text-warm-gray">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
        {category !== "All" && <span className="ml-1 text-warm-gray/60">in {category}</span>}
      </p>

      {products.length === 0 ? (
        <EmptyState
          title="No handmade pieces yet"
          description="The marketplace is empty until artisans list their work. If you create by hand, your studio belongs here."
          actionLabel="Become an artisan"
          actionHref="/auth/signup?role=creator"
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No matches"
          description="Try a different category or search term."
        />
      ) : (
        <ProductMasonry products={filtered} />
      )}
    </>
  );
}
