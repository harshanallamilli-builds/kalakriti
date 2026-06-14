"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import type { Product } from "@/lib/types";
import { ProductMasonry } from "@/components/products/ProductMasonry";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils";

type MarketplaceClientProps = {
  products: Product[];
  categories: string[];
};

export function MarketplaceClient({ products, categories }: MarketplaceClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Read initial category from URL (?category=Pottery+%26+Terracotta)
  const initialCategory = searchParams.get("category") ?? "All";
  const [category, setCategory] = useState(
    categories.includes(initialCategory) ? initialCategory : "All"
  );
  const [query, setQuery] = useState("");

  // Keep URL in sync when category changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [category]); // eslint-disable-line react-hooks/exhaustive-deps

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
      {/* Search */}
      <div className="mb-5">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-gray/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="search"
            placeholder="Search pieces or artisans…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-full border border-linen bg-white py-3 pl-10 pr-4 text-sm text-charcoal placeholder:text-warm-gray/50 focus:border-clay/60 focus:outline-none focus:ring-2 focus:ring-clay/15 lg:max-w-sm"
          />
        </div>
      </div>

      {/* Category pills */}
      <div className="-mx-4 mb-7 flex gap-2 overflow-x-auto px-4 pb-1 hide-scrollbar sm:mx-0 sm:flex-wrap sm:px-0">
        {["All", ...categories].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-[13px] font-medium transition-all duration-200 active:scale-[0.97]",
              category === cat
                ? "border-charcoal/20 bg-charcoal text-cream shadow-[0_2px_8px_rgba(58,50,44,0.20)]"
                : "border-linen bg-white text-warm-gray hover:border-clay/30 hover:bg-sand/60 hover:text-charcoal"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <p className="mb-6 text-[13px] text-warm-gray">
        <span className="font-semibold text-charcoal">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "piece" : "pieces"}
        {category !== "All" && (
          <> in <span className="text-terracotta">{category}</span></>
        )}
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