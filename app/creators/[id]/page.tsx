import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactCreatorButton } from "@/components/products/ContactCreatorButton";
import { ProductMasonry } from "@/components/products/ProductMasonry";
import { PortfolioGallery } from "@/components/creators/PortfolioGallery";
import { EmptyState } from "@/components/ui/EmptyState";
import { getInitials, formatLocation } from "@/lib/utils";
import { getCreatorById } from "@/lib/queries/profiles";
import { getCreatorProducts } from "@/lib/queries/products";
import { getCreatorPortfolio, getCompletedOrdersCount } from "@/lib/queries/portfolio";
import { getCreatorResponseTime } from "@/lib/queries/notifications";

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creator = await getCreatorById(id);
  if (!creator) notFound();

  const [products, portfolioItems, completedCount, responseTime] = await Promise.all([
    getCreatorProducts(id),
    getCreatorPortfolio(id),
    getCompletedOrdersCount(id),
    getCreatorResponseTime(id),
  ]);
  const location = formatLocation(creator.city, creator.state);

  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      {/* Banner */}
      <div className="relative h-40 w-full overflow-hidden rounded-b-3xl sm:h-56 md:h-64">
        {creator.banner_url ? (
          <Image
            src={creator.banner_url}
            alt={`${creator.store_name || creator.full_name} banner`}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-sand via-linen to-cream" />
        )}
        {/* subtle pattern overlay */}
        <div className="absolute inset-0 bg-charcoal/10" />
      </div>

      {/* Profile card — overlapping banner */}
      <div className="-mt-10 mx-4 sm:mx-8">
        <div className="flex flex-col items-center gap-5 rounded-3xl border border-linen bg-white p-6 text-center shadow-[var(--shadow-card)] sm:flex-row sm:text-left md:p-8">
          {/* Avatar */}
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-white shadow-md">
            {creator.avatar_url ? (
              <Image src={creator.avatar_url} alt={creator.full_name} fill className="object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center bg-sand font-heading text-3xl text-terracotta">
                {getInitials(creator.full_name)}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
              <h1 className="font-heading text-2xl text-charcoal md:text-3xl">
                {creator.store_name || creator.full_name}
              </h1>
              {/* Availability badge */}
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  creator.available_for_commissions
                    ? "bg-sage/20 text-moss"
                    : "bg-linen text-warm-gray"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${creator.available_for_commissions ? "bg-sage" : "bg-warm-gray/50"}`} />
                {creator.available_for_commissions ? "Available for commissions" : "Not taking commissions"}
              </span>
            </div>

            {creator.craft && <p className="mt-1 text-saffron font-medium">{creator.craft}</p>}

            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-warm-gray justify-center sm:justify-start">
              {location && <span>📍 {location}</span>}
              {creator.years_experience && (
                <span>🪔 {creator.years_experience} yrs experience</span>
              )}
            </div>

            {/* Trust bar — member since · orders · response time */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-warm-gray/80 justify-center sm:justify-start">
              <span>Member since {formatMemberSince(creator.created_at)}</span>
              {completedCount > 0 && (
                <>
                  <span className="text-linen">·</span>
                  <span>{completedCount} {completedCount === 1 ? "order" : "orders"} completed</span>
                </>
              )}
              <span className="text-linen">·</span>
              <span>
                {responseTime === "New creator"
                  ? "New creator"
                  : `Usually replies within ${responseTime.toLowerCase()}`}
              </span>
            </div>

            {creator.bio && (
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-warm-gray">{creator.bio}</p>
            )}
          </div>

          <div className="shrink-0">
            <ContactCreatorButton creatorId={creator.id} label="Message studio" />
          </div>
        </div>
      </div>

      {/* Portfolio */}
      <section className="mt-12 px-4 sm:px-8">
        <h2 className="mb-5 font-heading text-2xl text-charcoal">Portfolio</h2>
        <PortfolioGallery items={portfolioItems} />
      </section>

      {/* Products */}
      <section className="mt-14 px-4 sm:px-8">
        <h2 className="mb-8 font-heading text-2xl text-charcoal">Handmade pieces</h2>
        {products.length === 0 ? (
          <EmptyState
            title="No pieces listed yet"
            description="This artisan hasn't published products yet. Check back soon or send a message."
          />
        ) : (
          <ProductMasonry products={products} />
        )}
      </section>
    </div>
  );
}
