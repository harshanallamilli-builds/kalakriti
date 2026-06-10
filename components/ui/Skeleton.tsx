import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "skeleton rounded-2xl",
        className
      )}
      aria-hidden="true"
    />
  );
}

/** Pre-built skeleton for a stat card */
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-linen bg-white p-5 shadow-[var(--shadow-card)]">
      <Skeleton className="h-8 w-12" />
      <Skeleton className="mt-2 h-3 w-24" />
    </div>
  );
}

/** Pre-built skeleton for a product list row */
export function ProductRowSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-linen bg-white p-4">
      <Skeleton className="h-16 w-16 shrink-0 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-10 rounded-full" />
    </div>
  );
}

/** Pre-built skeleton for an order card */
export function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-linen bg-white p-4 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 shrink-0 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </div>
  );
}
