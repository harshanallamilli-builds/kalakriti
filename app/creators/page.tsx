import { CreatorCard } from "@/components/creators/CreatorCard";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { EmptyState } from "@/components/ui/EmptyState";
import { SupabaseNotice } from "@/components/ui/SupabaseNotice";
import { isSupabaseConfigured } from "@/lib/config";
import { getCreatorsWithStats } from "@/lib/queries/profiles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Artisans",
  description: "Explore independent Indian artisans on Kalakriti. Each profile is a real maker — pottery, weaving, woodwork, and more.",
};

export default async function CreatorsPage() {
  const configured = isSupabaseConfigured();
  const creators = configured ? await getCreatorsWithStats() : [];

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Artisans"
        title="Studios across India"
        description="Explore makers on Kalakriti — each profile is a real registered artisan, not a placeholder."
        className="mb-10"
      />
      {!configured && (
        <div className="mb-8">
          <SupabaseNotice />
        </div>
      )}
      {configured && creators.length === 0 ? (
        <EmptyState
          icon="🪔"
          title="No artisans yet"
          description="Kalakriti is built for Indian makers. Be among the first to open your studio and list handmade work."
          actionLabel="Register as artisan"
          actionHref="/auth/signup?role=creator"
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {creators.map((c) => (
            <CreatorCard key={c.id} creator={c} completedOrders={c.completed_orders_count} />
          ))}
        </div>
      )}
    </div>
  );
}
