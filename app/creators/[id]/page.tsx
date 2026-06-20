// import Image from "next/image";
// import { notFound } from "next/navigation";
// import type { Metadata } from "next";
// import { ContactCreatorButton } from "@/components/products/ContactCreatorButton";
// import { PortfolioGallery } from "@/components/creators/PortfolioGallery";
// import { ShareButton } from "@/components/creators/ShareButton";
// import { CreatorHeroLogo } from "@/components/creators/CreatorHeroLogo";
// import { getInitials, formatLocation } from "@/lib/utils";
// import { getCreatorById } from "@/lib/queries/profiles";
// import { getCreatorPortfolio, getCompletedOrdersCount } from "@/lib/queries/portfolio";
// import { getCreatorResponseTime } from "@/lib/queries/notifications";

// function formatMemberSince(dateStr: string): string {
//   return new Date(dateStr).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
// }

// function getYearsSince(dateStr: string): number {
//   return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24 * 365));
// }

// // ── SEO metadata (dynamic per creator) ──────────────────────────────────────
// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }): Promise<Metadata> {
//   const { id } = await params;
//   const creator = await getCreatorById(id);
//   if (!creator) return { title: "Artisan not found" };

//   const displayName = creator.store_name || creator.full_name;
//   const craft = creator.craft ?? "Handmade crafts";
//   const location = formatLocation(creator.city, creator.state);
//   const desc = creator.bio
//     ? `${creator.bio.slice(0, 150)}…`
//     : `${displayName} is an independent Indian artisan specialising in ${craft}${location ? `, based in ${location}` : ""}. View their portfolio and commission handmade work on Kalakriti.`;

//   return {
//     title: `${displayName} — ${craft}`,
//     description: desc,
//     openGraph: {
//       title: `${displayName} · Kalakriti`,
//       description: desc,
//       images: creator.avatar_url ? [{ url: creator.avatar_url }] : [],
//       type: "profile",
//     },
//     twitter: {
//       card: "summary",
//       title: `${displayName} · Kalakriti`,
//       description: desc,
//       images: creator.avatar_url ? [creator.avatar_url] : [],
//     },
//     alternates: {
//       canonical: `/creators/${id}`,
//     },
//   };
// }

// // ── Social link helpers ──────────────────────────────────────────────────────
// function SocialPill({
//   href,
//   label,
//   icon,
// }: {
//   href: string;
//   label: string;
//   icon: React.ReactNode;
// }) {
//   return (
//     <a
//       href={href}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="inline-flex items-center gap-1.5 rounded-full border border-linen/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-charcoal shadow-[var(--shadow-card)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
//     >
//       {icon}
//       {label}
//     </a>
//   );
// }

// const IgIcon = () => (
//   <svg width="15" height="15" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//     <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6" />
//     <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
//     <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
//   </svg>
// );
// const WaIcon = () => (
//   <svg width="15" height="15" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//     <path d="M12 2a10 10 0 0 1 8.66 15L22 22l-5.17-1.35A10 10 0 1 1 12 2Z" stroke="currentColor" strokeWidth="1.6" />
//     <path d="M9 10.5c.5-1.8 2.5-2.5 3.5-1.5s1 3 0 3.5l-1 1c.5 1.2 1.8 2.5 3 3l1-1c1-1 3-.5 3.5.5s-.5 3-2 3C12 19 7 15 7 9.5a2.5 2.5 0 0 1 2-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
//   </svg>
// );
// const WebIcon = () => (
//   <svg width="15" height="15" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//     <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6" />
//     <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.3" />
//   </svg>
// );
// const YtIcon = () => (
//   <svg width="15" height="15" fill="none" viewBox="0 0 24 24" aria-hidden="true">
//     <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.6" />
//     <path d="M10 9l5 3-5 3V9Z" fill="currentColor" />
//   </svg>
// );

// // ── JSON-LD structured data ──────────────────────────────────────────────────
// function PersonSchema({
//   creator,
//   location,
// }: {
//   creator: Awaited<ReturnType<typeof getCreatorById>>;
//   location: string;
// }) {
//   if (!creator) return null;
//   const displayName = creator.store_name || creator.full_name;
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "Person",
//     name: displayName,
//     description: creator.bio ?? undefined,
//     image: creator.avatar_url ?? undefined,
//     jobTitle: creator.craft ?? "Artisan",
//     address: location
//       ? { "@type": "PostalAddress", addressLocality: creator.city, addressRegion: creator.state, addressCountry: "IN" }
//       : undefined,
//     url: `https://kalakrithi.vercel.app/creators/${creator.id}`,
//     sameAs: [
//       creator.instagram_url,
//       creator.website_url,
//       creator.youtube_url,
//       creator.whatsapp ? `https://wa.me/${creator.whatsapp}` : null,
//     ].filter((v): v is string => typeof v === "string"),
//   };
//   return (
//     <script
//       type="application/ld+json"
//       dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
//     />
//   );
// }

// // ── Page ─────────────────────────────────────────────────────────────────────
// export default async function CreatorProfilePage({
//   params,
// }: {
//   params: Promise<{ id: string }>;
// }) {
//   const { id } = await params;
//   const creator = await getCreatorById(id);
//   if (!creator) notFound();

//   const [portfolioItems, completedCount, responseTime] = await Promise.all([
//     getCreatorPortfolio(id),
//     getCompletedOrdersCount(id),
//     getCreatorResponseTime(id),
//   ]);

//   const location = formatLocation(creator.city, creator.state);
//   const yearsOnPlatform = getYearsSince(creator.created_at);
//   const displayName = creator.store_name || creator.full_name;

//   const hasSocialLinks =
//     creator.whatsapp || creator.instagram_url || creator.website_url || creator.youtube_url;

//   return (
//     <>
//       <PersonSchema creator={creator} location={location ?? ""} />

//       <div className="creator-portfolio-root">
//         {/* ── CINEMATIC HERO ───────────────────────────────── */}
//         <section className="cp-hero">
//           {/* Banner */}
//           <div className="cp-hero__banner">
//             {creator.banner_url ? (
//               <Image
//                 src={creator.banner_url}
//                 alt={`${displayName} studio banner`}
//                 fill
//                 className="cp-hero__banner-img"
//                 priority
//               />
//             ) : (
//               <div className="cp-hero__banner-fallback" />
//             )}
//             <div className="cp-hero__banner-vignette" />
//             <div className="cp-hero__banner-grain grain-overlay" />
//           </div>

//           <CreatorHeroLogo />

//           {creator.craft && (
//             <div className="cp-hero__craft-pill animate-fade-up">
//               <span className="cp-hero__craft-dot" />
//               {creator.craft}
//             </div>
//           )}

//           <div className="cp-hero__title-wrap animate-fade-up animation-delay-150">
//             <h1 className="cp-hero__title">{displayName}</h1>
//           </div>

//           <div className="cp-hero__meta-row animate-fade-up" style={{ animationDelay: "300ms" }}>
//             {location && (
//               <span className="cp-hero__location">
//                 <svg width="12" height="14" viewBox="0 0 12 14" fill="none" aria-hidden="true">
//                   <path d="M6 0C3.24 0 1 2.24 1 5c0 3.75 5 9 5 9s5-5.25 5-9c0-2.76-2.24-5-5-5Zm0 6.5A1.5 1.5 0 1 1 6 3.5 1.5 1.5 0 0 1 6 6.5Z" fill="currentColor" />
//                 </svg>
//                 {location}
//               </span>
//             )}
//             <ShareButton url="" title={`${displayName} — Kalakriti`} />
//           </div>

//           <div className="cp-scroll-cue" aria-hidden="true"><span /></div>
//         </section>

//         {/* ── STORY BODY ──────────────────────────────────── */}
//         <div className="cp-body">

//           {/* === ACT I: Who === */}
//           <section className="cp-act cp-act--who">
//             <div className="cp-act__spine">
//               <span className="cp-act__eyebrow">The maker</span>
//               <div className="cp-act__avatar-wrap">
//                 {creator.avatar_url ? (
//                   <Image
//                     src={creator.avatar_url}
//                     alt={creator.full_name}
//                     fill
//                     className="object-cover"
//                   />
//                 ) : (
//                   <span className="cp-act__avatar-initials">
//                     {getInitials(creator.full_name)}
//                   </span>
//                 )}
//                 <div
//                   className={`cp-act__avail-ring ${creator.available_for_commissions
//                       ? "cp-act__avail-ring--open"
//                       : "cp-act__avail-ring--closed"
//                     }`}
//                 />
//               </div>
//             </div>

//             <div className="cp-act__content">
//               <p className="cp-act__overline">
//                 {creator.available_for_commissions
//                   ? "✦ Open for commissions"
//                   : "Currently closed for commissions"}
//               </p>

//               {creator.bio ? (
//                 <p className="cp-act__bio">{creator.bio}</p>
//               ) : (
//                 <p className="cp-act__bio cp-act__bio--placeholder">
//                   A craftsperson whose hands remember what words forget.
//                 </p>
//               )}

//               {/* Stats row */}
//               {(creator.years_experience || completedCount > 0 || yearsOnPlatform > 0) && (
//                 <div className="cp-stat-row">
//                   {creator.years_experience && (
//                     <div className="cp-stat">
//                       <span className="cp-stat__num">{creator.years_experience}</span>
//                       <span className="cp-stat__label">years of craft</span>
//                     </div>
//                   )}
//                   {completedCount > 0 && (
//                     <div className="cp-stat">
//                       <span className="cp-stat__num">{completedCount}</span>
//                       <span className="cp-stat__label">pieces made</span>
//                     </div>
//                   )}
//                   {yearsOnPlatform > 0 && (
//                     <div className="cp-stat">
//                       <span className="cp-stat__num">{yearsOnPlatform}</span>
//                       <span className="cp-stat__label">
//                         {yearsOnPlatform === 1 ? "year" : "years"} on Kalakriti
//                       </span>
//                     </div>
//                   )}
//                 </div>
//               )}

//               {/* Social / contact links */}
//               {hasSocialLinks && (
//                 <div className="cp-social-links">
//                   {creator.whatsapp && (
//                     <SocialPill
//                       href={`https://wa.me/${creator.whatsapp}`}
//                       label="WhatsApp"
//                       icon={<WaIcon />}
//                     />
//                   )}
//                   {creator.instagram_url && (
//                     <SocialPill
//                       href={creator.instagram_url}
//                       label="Instagram"
//                       icon={<IgIcon />}
//                     />
//                   )}
//                   {creator.website_url && (
//                     <SocialPill
//                       href={creator.website_url}
//                       label="Website"
//                       icon={<WebIcon />}
//                     />
//                   )}
//                   {creator.youtube_url && (
//                     <SocialPill
//                       href={creator.youtube_url}
//                       label="YouTube"
//                       icon={<YtIcon />}
//                     />
//                   )}
//                 </div>
//               )}

//               {/* CTA */}
//               <div className="cp-act__cta">
//                 <ContactCreatorButton creatorId={creator.id} label="Start a conversation" />
//                 <span className="cp-act__reply-note">
//                   {responseTime === "New creator"
//                     ? "New here — be their first client"
//                     : `Usually replies within ${responseTime.toLowerCase()}`}
//                 </span>
//               </div>
//             </div>
//           </section>

//           <div className="cp-rune" aria-hidden="true"><span>✦</span></div>

//           {/* === ACT II: The Work === */}
//           <section className="cp-act cp-act--work">
//             <div className="cp-act__header">
//               <span className="cp-act__eyebrow">The work</span>
//               <h2 className="cp-act__title">
//                 Every piece<br />tells its own story.
//               </h2>
//               <p className="cp-act__subtitle">
//                 {portfolioItems.length > 0
//                   ? `${portfolioItems.length} work${portfolioItems.length > 1 ? "s" : ""} in the archive`
//                   : "Portfolio coming soon"}
//               </p>
//             </div>
//             <PortfolioGallery items={portfolioItems} />
//           </section>

//           {/* === FOOTER CTA === */}
//           <section className="cp-footer-cta">
//             <div className="cp-footer-cta__inner">
//               <p className="cp-footer-cta__label">Want something made just for you?</p>
//               <h3 className="cp-footer-cta__heading">
//                 Commission {creator.full_name.split(" ")[0]}.
//               </h3>

//               {/* Show all contact options at the bottom CTA */}
//               <div className="cp-footer-cta__contact-options">
//                 <ContactCreatorButton creatorId={creator.id} label="Message on Kalakriti" />
//                 {creator.whatsapp && (
//                   <a
//                     href={`https://wa.me/${creator.whatsapp}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="cp-footer-cta__whatsapp"
//                   >
//                     <WaIcon />
//                     Chat on WhatsApp
//                   </a>
//                 )}
//               </div>

//               {hasSocialLinks && (
//                 <div className="cp-footer-social">
//                   {creator.instagram_url && (
//                     <a href={creator.instagram_url} target="_blank" rel="noopener noreferrer" className="cp-footer-social__link" aria-label="Instagram">
//                       <IgIcon />
//                     </a>
//                   )}
//                   {creator.youtube_url && (
//                     <a href={creator.youtube_url} target="_blank" rel="noopener noreferrer" className="cp-footer-social__link" aria-label="YouTube">
//                       <YtIcon />
//                     </a>
//                   )}
//                   {creator.website_url && (
//                     <a href={creator.website_url} target="_blank" rel="noopener noreferrer" className="cp-footer-social__link" aria-label="Website">
//                       <WebIcon />
//                     </a>
//                   )}
//                 </div>
//               )}

//               <div className="cp-footer-cta__actions">
//                 <ShareButton url="" title={`${displayName} — Kalakriti`} variant="ghost" />
//               </div>
//               <p className="cp-footer-cta__since">
//                 On Kalakriti since {formatMemberSince(creator.created_at)}
//               </p>
//             </div>
//           </section>
//         </div>
//       </div>
//     </>
//   );
// }


import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContactCreatorButton } from "@/components/products/ContactCreatorButton";
import { PortfolioGallery } from "@/components/creators/PortfolioGallery";
import { LockedLinksPlaceholder } from "@/components/creators/SocialLinksSection";
import { ShareButton } from "@/components/creators/ShareButton";
import { CreatorHeroLogo } from "@/components/creators/CreatorHeroLogo";
import { getInitials, formatLocation } from "@/lib/utils";
import { getCreatorById } from "@/lib/queries/profiles";
import { getCreatorPortfolio, getCompletedOrdersCount } from "@/lib/queries/portfolio";
import { getCreatorResponseTime } from "@/lib/queries/notifications";
import { createClient } from "@/lib/supabase/server";
import { getSocialLinkConfig } from "@/lib/queries/platform-settings";

function formatMemberSince(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function getYearsSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24 * 365));
}

// ── SEO metadata ─────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const creator = await getCreatorById(id);
  if (!creator) return { title: "Artisan not found" };

  const displayName = creator.store_name || creator.full_name;
  const craft = creator.craft ?? "Handmade crafts";
  const location = formatLocation(creator.city, creator.state);
  const desc = creator.bio
    ? `${creator.bio.slice(0, 150)}…`
    : `${displayName} is an independent Indian artisan specialising in ${craft}${location ? `, based in ${location}` : ""}. View their portfolio and commission handmade work on Kalakriti.`;

  return {
    title: `${displayName} — ${craft}`,
    description: desc,
    openGraph: {
      title: `${displayName} · Kalakriti`,
      description: desc,
      images: creator.avatar_url ? [{ url: creator.avatar_url }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: `${displayName} · Kalakriti`,
      description: desc,
      images: creator.avatar_url ? [creator.avatar_url] : [],
    },
    alternates: { canonical: `/creators/${id}` },
  };
}

// ── Social pill ───────────────────────────────────────────────────────────────
function SocialPill({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-linen/80 bg-white/80 px-4 py-1.5 text-sm font-medium text-charcoal shadow-[var(--shadow-card)] backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]"
    >
      {icon}
      {label}
    </a>
  );
}

const IgIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
  </svg>
);
const WaIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2a10 10 0 0 1 8.66 15L22 22l-5.17-1.35A10 10 0 1 1 12 2Z" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M9 10.5c.5-1.8 2.5-2.5 3.5-1.5s1 3 0 3.5l-1 1c.5 1.2 1.8 2.5 3 3l1-1c1-1 3-.5 3.5.5s-.5 3-2 3C12 19 7 15 7 9.5a2.5 2.5 0 0 1 2-2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
  </svg>
);
const WebIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20" stroke="currentColor" strokeWidth="1.3"/>
  </svg>
);
const YtIcon = () => (
  <svg width="15" height="15" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.6"/>
    <path d="M10 9l5 3-5 3V9Z" fill="currentColor"/>
  </svg>
);

// ── JSON-LD ───────────────────────────────────────────────────────────────────
function PersonSchema({
  creator,
  location,
}: {
  creator: Awaited<ReturnType<typeof getCreatorById>>;
  location: string;
}) {
  if (!creator) return null;
  const displayName = creator.store_name || creator.full_name;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: displayName,
    description: creator.bio ?? undefined,
    image: creator.avatar_url ?? undefined,
    jobTitle: creator.craft ?? "Artisan",
    address: location
      ? { "@type": "PostalAddress", addressLocality: creator.city, addressRegion: creator.state, addressCountry: "IN" }
      : undefined,
    url: `https://kalakrithi.vercel.app/creators/${creator.id}`,
    sameAs: [
      creator.instagram_url,
      creator.website_url,
      creator.youtube_url,
      creator.whatsapp ? `https://wa.me/${creator.whatsapp}` : null,
    ].filter((v): v is string => typeof v === "string"),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function CreatorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Check session server-side — reads the cookie, no extra round trip
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const [creator, socialLinkConfig] = await Promise.all([
    getCreatorById(id),
    getSocialLinkConfig(),
  ]);
  if (!creator) notFound();

  const [portfolioItems, completedCount, responseTime] = await Promise.all([
    getCreatorPortfolio(id),
    getCompletedOrdersCount(id),
    getCreatorResponseTime(id),
  ]);

  const location = formatLocation(creator.city, creator.state) ?? "";
  const yearsOnPlatform = getYearsSince(creator.created_at);
  const displayName = creator.store_name || creator.full_name;

  // Which links exist on the creator's profile
  const creatorLinks = {
    instagram: creator.instagram_url,
    whatsapp: creator.whatsapp,
    website: creator.website_url,
    youtube: creator.youtube_url,
  };

  // Links that are both admin-enabled AND the creator has filled in
  const visibleLinks = {
    instagram: socialLinkConfig.instagram && !!creatorLinks.instagram,
    whatsapp: socialLinkConfig.whatsapp && !!creatorLinks.whatsapp,
    website: socialLinkConfig.website && !!creatorLinks.website,
    youtube: socialLinkConfig.youtube && !!creatorLinks.youtube,
  };

  // Whether there are any admin-enabled links the creator has filled in
  const hasAnyVisibleLink = Object.values(visibleLinks).some(Boolean);

  // Show the locked placeholder if: there are enabled links but user isn't logged in
  const showLockedPlaceholder = hasAnyVisibleLink && !isLoggedIn;
  // Show actual links if: there are enabled links AND user is logged in
  const showLinks = hasAnyVisibleLink && isLoggedIn;

  return (
    <>
      <PersonSchema creator={creator} location={location} />

      <div className="creator-portfolio-root">
        {/* ── HERO ─────────────────────────────────────────── */}
        <section className="cp-hero">
          <div className="cp-hero__banner">
            {creator.banner_url ? (
              <Image
                src={creator.banner_url}
                alt={`${displayName} studio banner`}
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

          <CreatorHeroLogo />

          {creator.craft && (
            <div className="cp-hero__craft-pill animate-fade-up">
              <span className="cp-hero__craft-dot" />
              {creator.craft}
            </div>
          )}

          <div className="cp-hero__title-wrap animate-fade-up animation-delay-150">
            <h1 className="cp-hero__title">{displayName}</h1>
          </div>

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

          <div className="cp-scroll-cue" aria-hidden="true"><span /></div>
        </section>

        {/* ── BODY ─────────────────────────────────────────── */}
        <div className="cp-body">

          {/* ACT I: The Maker */}
          <section className="cp-act cp-act--who">
            <div className="cp-act__spine">
              <span className="cp-act__eyebrow">The maker</span>
              <div className="cp-act__avatar-wrap">
                {creator.avatar_url ? (
                  <Image src={creator.avatar_url} alt={creator.full_name} fill className="object-cover" />
                ) : (
                  <span className="cp-act__avatar-initials">{getInitials(creator.full_name)}</span>
                )}
                <div className={`cp-act__avail-ring ${creator.available_for_commissions ? "cp-act__avail-ring--open" : "cp-act__avail-ring--closed"}`} />
              </div>
            </div>

            <div className="cp-act__content">
              <p className="cp-act__overline">
                {creator.available_for_commissions ? "✦ Open for commissions" : "Currently closed for commissions"}
              </p>

              {creator.bio ? (
                <p className="cp-act__bio">{creator.bio}</p>
              ) : (
                <p className="cp-act__bio cp-act__bio--placeholder">
                  A craftsperson whose hands remember what words forget.
                </p>
              )}

              {/* Stats */}
              {(creator.years_experience || completedCount > 0 || yearsOnPlatform > 0) && (
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
                      <span className="cp-stat__label">{yearsOnPlatform === 1 ? "year" : "years"} on Kalakriti</span>
                    </div>
                  )}
                </div>
              )}

              {/* ── SOCIAL LINKS — gated behind login + admin config ── */}
              {showLockedPlaceholder && (
                <LockedLinksPlaceholder creatorName={creator.full_name.split(" ")[0]} />
              )}

              {showLinks && (
                <div className="cp-social-links">
                  {visibleLinks.instagram && (
                    <SocialPill href={creator.instagram_url!} label="Instagram" icon={<IgIcon />} />
                  )}
                  {visibleLinks.whatsapp && (
                    <SocialPill href={`https://wa.me/${creator.whatsapp}`} label="WhatsApp" icon={<WaIcon />} />
                  )}
                  {visibleLinks.website && (
                    <SocialPill href={creator.website_url!} label="Website" icon={<WebIcon />} />
                  )}
                  {visibleLinks.youtube && (
                    <SocialPill href={creator.youtube_url!} label="YouTube" icon={<YtIcon />} />
                  )}
                </div>
              )}

              {/* CTA */}
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

          {/* ACT II: The Work */}
          <section className="cp-act cp-act--work">
            <div className="cp-act__header">
              <span className="cp-act__eyebrow">The work</span>
              <h2 className="cp-act__title">Every piece<br />tells its own story.</h2>
              <p className="cp-act__subtitle">
                {portfolioItems.length > 0
                  ? `${portfolioItems.length} work${portfolioItems.length > 1 ? "s" : ""} in the archive`
                  : "Portfolio coming soon"}
              </p>
            </div>
            <PortfolioGallery items={portfolioItems} />
          </section>

          {/* Footer CTA */}
          <section className="cp-footer-cta">
            <div className="cp-footer-cta__inner">
              <p className="cp-footer-cta__label">Want something made just for you?</p>
              <h3 className="cp-footer-cta__heading">
                Commission {creator.full_name.split(" ")[0]}.
              </h3>

              <div className="cp-footer-cta__contact-options">
                <ContactCreatorButton creatorId={creator.id} label="Message on Kalakriti" />
                {/* WhatsApp in footer — only if admin-enabled AND logged in */}
                {isLoggedIn && visibleLinks.whatsapp && (
                  <a
                    href={`https://wa.me/${creator.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cp-footer-cta__whatsapp"
                  >
                    <WaIcon />
                    Chat on WhatsApp
                  </a>
                )}
              </div>

              {/* Footer social icons — only logged-in users */}
              {isLoggedIn && (visibleLinks.instagram || visibleLinks.youtube || visibleLinks.website) && (
                <div className="cp-footer-social">
                  {visibleLinks.instagram && (
                    <a href={creator.instagram_url!} target="_blank" rel="noopener noreferrer" className="cp-footer-social__link" aria-label="Instagram">
                      <IgIcon />
                    </a>
                  )}
                  {visibleLinks.youtube && (
                    <a href={creator.youtube_url!} target="_blank" rel="noopener noreferrer" className="cp-footer-social__link" aria-label="YouTube">
                      <YtIcon />
                    </a>
                  )}
                  {visibleLinks.website && (
                    <a href={creator.website_url!} target="_blank" rel="noopener noreferrer" className="cp-footer-social__link" aria-label="Website">
                      <WebIcon />
                    </a>
                  )}
                </div>
              )}

              {/* Locked placeholder in footer too for non-logged-in */}
              {showLockedPlaceholder && (
                <div className="mt-4">
                  <LockedLinksPlaceholder creatorName={creator.full_name.split(" ")[0]} />
                </div>
              )}

              <div className="cp-footer-cta__actions">
                <ShareButton url="" title={`${displayName} — Kalakriti`} variant="ghost" />
              </div>
              <p className="cp-footer-cta__since">
                On Kalakriti since {formatMemberSince(creator.created_at)}
              </p>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}