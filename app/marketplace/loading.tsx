import { Skeleton } from "@/components/ui/Skeleton";

export default function MarketplaceLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      {/* Heading skeleton */}
      <div className="mb-8 space-y-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* Search + filters */}
      <Skeleton className="mb-4 h-10 w-full max-w-xs rounded-full" />
      <div className="mb-6 flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-20 rounded-full" />
        ))}
      </div>

      {/* Masonry grid skeleton */}
      <div className="masonry-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="masonry-item">
            <div className="overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)]">
              <div style={{ aspectRatio: i % 3 === 0 ? "4/5" : "4/6" }}>
                <Skeleton className="h-full w-full rounded-none" />
              </div>
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
