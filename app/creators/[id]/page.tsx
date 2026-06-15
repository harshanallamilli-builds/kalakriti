// import Image from "next/image";
// import { notFound } from "next/navigation";
// import { ContactCreatorButton } from "@/components/products/ContactCreatorButton";
// import { ProductMasonry } from "@/components/products/ProductMasonry";
// import { PortfolioGallery } from "@/components/creators/PortfolioGallery";
// import { EmptyState } from "@/components/ui/EmptyState";
// import { getInitials, formatLocation } from "@/lib/utils";
// import { getCreatorById } from "@/lib/queries/profiles";
// import { getCreatorProducts } from "@/lib/queries/products";
// import { getCreatorPortfolio, getCompletedOrdersCount } from "@/lib/queries/portfolio";
// import { getCreatorResponseTime } from "@/lib/queries/notifications";

// function formatMemberSince(dateStr: string): string {
//   return new Date(dateStr).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
// }

// export default async function CreatorProfilePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const creator = await getCreatorById(id);
//   if (!creator) notFound();

//   const [products, portfolioItems, completedCount, responseTime] = await Promise.all([
//     getCreatorProducts(id),
//     getCreatorPortfolio(id),
//     getCompletedOrdersCount(id),
//     getCreatorResponseTime(id),
//   ]);
//   const location = formatLocation(creator.city, creator.state);

//   return (
//     <div className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
//       {/* Banner */}
//       <div className="relative h-40 w-full overflow-hidden rounded-b-3xl sm:h-56 md:h-64">
//         {creator.banner_url ? (
//           <Image
//             src={creator.banner_url}
//             alt={`${creator.store_name || creator.full_name} banner`}
//             fill
//             className="object-cover"
//             priority
//           />
//         ) : (
//           <div className="h-full w-full bg-gradient-to-br from-sand via-linen to-cream" />
//         )}
//         {/* subtle pattern overlay */}
//         <div className="absolute inset-0 bg-charcoal/10" />
//       </div>

//       {/* Profile card — overlapping banner */}
//       <div className="-mt-10 mx-4 sm:mx-8">
//         <div className="flex flex-col items-center gap-5 rounded-3xl border border-linen bg-white p-6 text-center shadow-[var(--shadow-card)] sm:flex-row sm:text-left md:p-8">
//           {/* Avatar */}
//           <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full ring-4 ring-white shadow-md">
//             {creator.avatar_url ? (
//               <Image src={creator.avatar_url} alt={creator.full_name} fill className="object-cover" />
//             ) : (
//               <span className="flex h-full w-full items-center justify-center bg-sand font-heading text-3xl text-terracotta">
//                 {getInitials(creator.full_name)}
//               </span>
//             )}
//           </div>

//           {/* Info */}
//           <div className="flex-1 min-w-0">
//             <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
//               <h1 className="font-heading text-2xl text-charcoal md:text-3xl">
//                 {creator.store_name || creator.full_name}
//               </h1>
//               {/* Availability badge */}
//               <span
//                 className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
//                   creator.available_for_commissions
//                     ? "bg-sage/20 text-moss"
//                     : "bg-linen text-warm-gray"
//                 }`}
//               >
//                 <span className={`h-1.5 w-1.5 rounded-full ${creator.available_for_commissions ? "bg-sage" : "bg-warm-gray/50"}`} />
//                 {creator.available_for_commissions ? "Available for commissions" : "Not taking commissions"}
//               </span>
//             </div>

//             {creator.craft && <p className="mt-1 text-saffron font-medium">{creator.craft}</p>}

//             <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-warm-gray justify-center sm:justify-start">
//               {location && <span>📍 {location}</span>}
//               {creator.years_experience && (
//                 <span>🪔 {creator.years_experience} yrs experience</span>
//               )}
//             </div>

//             {/* Trust bar — member since · orders · response time */}
//             <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-warm-gray/80 justify-center sm:justify-start">
//               <span>Member since {formatMemberSince(creator.created_at)}</span>
//               {completedCount > 0 && (
//                 <>
//                   <span className="text-linen">·</span>
//                   <span>{completedCount} {completedCount === 1 ? "order" : "orders"} completed</span>
//                 </>
//               )}
//               <span className="text-linen">·</span>
//               <span>
//                 {responseTime === "New creator"
//                   ? "New creator"
//                   : `Usually replies within ${responseTime.toLowerCase()}`}
//               </span>
//             </div>

//             {creator.bio && (
//               <p className="mt-3 max-w-2xl text-sm leading-relaxed text-warm-gray">{creator.bio}</p>
//             )}
//           </div>

//           <div className="shrink-0">
//             <ContactCreatorButton creatorId={creator.id} label="Message studio" />
//           </div>
//         </div>
//       </div>

//       {/* Portfolio */}
//       <section className="mt-12 px-4 sm:px-8">
//         <h2 className="mb-5 font-heading text-2xl text-charcoal">Portfolio</h2>
//         <PortfolioGallery items={portfolioItems} />
//       </section>

//       {/* Products */}
//       <section className="mt-14 px-4 sm:px-8">
//         <h2 className="mb-8 font-heading text-2xl text-charcoal">Handmade pieces</h2>
//         {products.length === 0 ? (
//           <EmptyState
//             title="No pieces listed yet"
//             description="This artisan hasn't published products yet. Check back soon or send a message."
//           />
//         ) : (
//           <ProductMasonry products={products} />
//         )}
//       </section>
//     </div>
//   );
// }

import Image from "next/image";
import { notFound } from "next/navigation";
import { ContactCreatorButton } from "@/components/products/ContactCreatorButton";
import { PortfolioGallery } from "@/components/creators/PortfolioGallery";
import { getInitials, formatLocation } from "@/lib/utils";
import { getCreatorById } from "@/lib/queries/profiles";
import { getCreatorPortfolio, getCompletedOrdersCount } from "@/lib/queries/portfolio";
import { getCreatorResponseTime } from "@/lib/queries/notifications";
import { ShareButton } from "@/components/creators/ShareButton";
import { CreatorHeroLogo } from "@/components/creators/CreatorHeroLogo";

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function getYearsSince(dateStr: string): number {
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
}

export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const creator = await getCreatorById(id);
  if (!creator) notFound();

  const [portfolioItems, completedCount, responseTime] = await Promise.all([
    getCreatorPortfolio(id),
    getCompletedOrdersCount(id),
    getCreatorResponseTime(id),
  ]);
  const location = formatLocation(creator.city, creator.state);
  const yearsOnPlatform = getYearsSince(creator.created_at);
  const displayName = creator.store_name || creator.full_name;

  return (
    <div className="creator-portfolio-root">
      {/* ── CINEMATIC HERO ───────────────────────────────── */}
      <section className="cp-hero">
        {/* Banner */}
        <div className="cp-hero__banner">
          {creator.banner_url ? (
            <Image
              src={creator.banner_url}
              alt={`${displayName} banner`}
              fill
              className="cp-hero__banner-img"
              priority
            />
          ) : (
            <div className="cp-hero__banner-fallback" />
          )}
          <div className="cp-hero__banner-vignette" />
          <div className="cp-hero__banner-grain grain-overlay" />
        </div>

        {/* Floating scroll-aware logo — centered → top-right */}
        <CreatorHeroLogo />

        {/* Floating craft tag */}
        {creator.craft && (
          <div className="cp-hero__craft-pill animate-fade-up">
            <span className="cp-hero__craft-dot" />
            {creator.craft}
          </div>
        )}

        {/* Large display name */}
        <div className="cp-hero__title-wrap animate-fade-up animation-delay-150">
          <h1 className="cp-hero__title">{displayName}</h1>
        </div>

        {/* Location + Share */}
        <div className="cp-hero__meta-row animate-fade-up" style={{ animationDelay: "300ms" }}>
          {location && (
            <span className="cp-hero__location">
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
                <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Zm0 6.5A1.5 1.5 0 1 1 6 3.5 1.5 1.5 0 0 1 6 6.5Z" fill="currentColor"/>
              </svg>
              {location}
            </span>
          )}
          <ShareButton url="" title={`${displayName} — Kalakriti`} />
        </div>

        {/* Scroll cue */}
        <div className="cp-scroll-cue" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ── STORY BODY ──────────────────────────────────── */}
      <div className="cp-body">

        {/* === ACT I: Who === */}
        <section className="cp-act cp-act--who">
          <div className="cp-act__spine">
            <span className="cp-act__eyebrow">The maker</span>
            <div className="cp-act__avatar-wrap">
              {creator.avatar_url ? (
                <Image
                  src={creator.avatar_url}
                  alt={creator.full_name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span className="cp-act__avatar-initials">
                  {getInitials(creator.full_name)}
                </span>
              )}
              <div
                className={`cp-act__avail-ring ${creator.available_for_commissions ? "cp-act__avail-ring--open" : "cp-act__avail-ring--closed"}`}
              />
            </div>
          </div>
          <div className="cp-act__content">
            <p className="cp-act__overline">
              {creator.available_for_commissions
                ? "✦ Open for commissions"
                : "Currently closed for commissions"}
            </p>
            {creator.bio ? (
              <p className="cp-act__bio">{creator.bio}</p>
            ) : (
              <p className="cp-act__bio cp-act__bio--placeholder">
                A craftsperson whose hands remember what words forget.
              </p>
            )}

            <div className="cp-stat-row">
              {creator.years_experience && (
                <div className="cp-stat">
                  <span className="cp-stat__num">{creator.years_experience}</span>
                  <span className="cp-stat__label">years of craft</span>
                </div>
              )}
              {completedCount > 0 && (
                <div className="cp-stat">
                  <span className="cp-stat__num">{completedCount}</span>
                  <span className="cp-stat__label">pieces made</span>
                </div>
              )}
              {yearsOnPlatform > 0 && (
                <div className="cp-stat">
                  <span className="cp-stat__num">{yearsOnPlatform}</span>
                  <span className="cp-stat__label">
                    {yearsOnPlatform === 1 ? "year" : "years"} with us
                  </span>
                </div>
              )}
            </div>

            <div className="cp-act__cta">
              <ContactCreatorButton creatorId={creator.id} label="Start a conversation" />
              <span className="cp-act__reply-note">
                {responseTime === "New creator"
                  ? "New here — be their first client"
                  : `Usually replies within ${responseTime.toLowerCase()}`}
              </span>
            </div>
          </div>
        </section>

        <div className="cp-rune" aria-hidden="true"><span>✦</span></div>

        {/* === ACT II: The Work === */}
        <section className="cp-act cp-act--work">
          <div className="cp-act__header">
            <span className="cp-act__eyebrow">The work</span>
            <h2 className="cp-act__title">
              Every piece<br />tells its own story.
            </h2>
            <p className="cp-act__subtitle">
              {portfolioItems.length > 0
                ? `${portfolioItems.length} work${portfolioItems.length > 1 ? "s" : ""} in the archive`
                : "Portfolio coming soon"}
            </p>
          </div>
          <PortfolioGallery items={portfolioItems} />
        </section>

        {/* === FOOTER CTA === */}
        <section className="cp-footer-cta">
          <div className="cp-footer-cta__inner">
            <p className="cp-footer-cta__label">Want something made just for you?</p>
            <h3 className="cp-footer-cta__heading">
              Commission {creator.full_name.split(" ")[0]}.
            </h3>
            <div className="cp-footer-cta__actions">
              <ContactCreatorButton creatorId={creator.id} label="Open a commission" />
              <ShareButton url="" title={`${displayName} — Kalakriti`} variant="ghost" />
            </div>
            <p className="cp-footer-cta__since">
              On Kalakriti since {formatMemberSince(creator.created_at)}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}