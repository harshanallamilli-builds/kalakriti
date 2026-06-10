import { Skeleton } from "@/components/ui/Skeleton";

export default function CreatorsLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <div className="mb-10 space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80 max-w-full" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)]">
            <Skeleton className="mx-auto h-20 w-20 rounded-full" />
            <div className="mt-4 space-y-2 text-center">
              <Skeleton className="mx-auto h-5 w-32" />
              <Skeleton className="mx-auto h-3 w-24" />
              <Skeleton className="mx-auto h-3 w-20" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
