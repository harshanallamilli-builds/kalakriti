// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import type { Metadata } from "next";
// import { ContactCreatorButton } from "@/components/products/ContactCreatorButton";
// import { PlaceOrderForm } from "@/components/products/PlaceOrderForm";
// import { ProductMasonry } from "@/components/products/ProductMasonry";
// import { formatINR, formatLocation } from "@/lib/utils";
// import { getProductById, getProducts } from "@/lib/queries/products";
// import { getCurrentProfile } from "@/lib/queries/profiles";
// import { createClient } from "@/lib/supabase/server";
// import { isSupabaseConfigured } from "@/lib/config";

// type Props = { params: Promise<{ id: string }> };

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { id } = await params;
//   const product = await getProductById(id);
//   if (!product) return { title: "Product not found" };
//   return {
//     title: product.name,
//     description: product.description.slice(0, 160),
//   };
// }

// export default async function ProductPage({ params }: Props) {
//   const { id } = await params;
//   const product = await getProductById(id);
//   if (!product) notFound();

//   const [related, profile] = await Promise.all([
//     getProducts({ category: product.category }).then((ps) =>
//       ps.filter((p) => p.id !== product.id).slice(0, 4)
//     ),
//     getCurrentProfile(),
//   ]);

//   // Check if logged-in user already has an active order for this product
//   let hasActiveOrder = false;
//   if (profile?.role === "user" && isSupabaseConfigured()) {
//     const supabase = await createClient();
//     const { data: existing } = await supabase
//       .from("orders")
//       .select("id")
//       .eq("user_id", profile.id)
//       .eq("product_id", product.id)
//       .in("status", ["pending", "confirmed", "in_progress"])
//       .maybeSingle();
//     hasActiveOrder = !!existing;
//   }

//   const creator = product.creator;
//   const location = creator ? formatLocation(creator.city, creator.state) : null;

//   return (
//     <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
//       <Link
//         href="/marketplace"
//         className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-terracotta"
//       >
//         ← Back to marketplace
//       </Link>

//       <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
//         {/* Product image */}
//         <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand shadow-[var(--shadow-soft)]">
//           <Image
//             src={product.image_url}
//             alt={product.name}
//             fill
//             className="object-cover"
//             sizes="(max-width: 1024px) 100vw, 50vw"
//             priority
//           />
//         </div>

//         {/* Product info */}
//         <div>
//           <p className="text-xs uppercase tracking-[0.2em] text-sage">{product.category}</p>
//           <h1 className="mt-2 font-heading text-4xl text-charcoal md:text-5xl">{product.name}</h1>

//           {creator && (
//             <p className="mt-2 text-warm-gray">
//               by{" "}
//               <Link
//                 href={`/creators/${creator.id}`}
//                 className="font-medium text-terracotta hover:text-charcoal"
//               >
//                 {creator.store_name || creator.full_name}
//               </Link>
//               {location && <span className="text-warm-gray"> · {location}</span>}
//             </p>
//           )}

//           <p className="mt-5 font-heading text-3xl text-charcoal">
//             {formatINR(Number(product.price_inr))}
//           </p>
//           <p className="mt-5 leading-relaxed text-warm-gray">{product.description}</p>

//           {/* Actions panel */}
//           {creator ? (
//             <div className="mt-8 space-y-6 rounded-3xl border border-linen bg-sand/25 p-6">
//               <div>
//                 <h2 className="font-heading text-lg text-charcoal">Message artisan</h2>
//                 <p className="mt-1 text-sm text-warm-gray">
//                   Ask about availability, customisation, or delivery.
//                 </p>
//                 <div className="mt-4">
//                   <ContactCreatorButton
//                     creatorId={creator.id}
//                     productId={product.id}
//                     fullWidth
//                   />
//                 </div>
//               </div>
//               <hr className="border-linen" />
//               <div>
//                 <h2 className="font-heading text-lg text-charcoal">Request this piece</h2>
//                 <p className="mt-1 text-sm text-warm-gray">
//                   Share customisation details — the artisan will confirm and coordinate with you.
//                 </p>
//                 <div className="mt-4">
//                   <PlaceOrderForm
//                     creatorId={creator.id}
//                     productId={product.id}
//                     productName={product.name}
//                     hasActiveOrder={hasActiveOrder}
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="mt-8 rounded-3xl border border-linen bg-sand/25 p-6 text-sm text-warm-gray">
//               Creator information unavailable.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Related products */}
//       {related.length > 0 && (
//         <section className="mt-20 border-t border-linen pt-14">
//           <h2 className="mb-8 font-heading text-3xl text-charcoal">More like this</h2>
//           <ProductMasonry products={related} />
//         </section>
//       )}
//     </article>
//   );
// }


// import Image from "next/image";
// import Link from "next/link";
// import { notFound } from "next/navigation";
// import type { Metadata } from "next";
// import { ContactCreatorButton } from "@/components/products/ContactCreatorButton";
// import { PlaceOrderForm } from "@/components/products/PlaceOrderForm";
// import { ProductCard } from "@/components/products/ProductCard";
// import { formatINR, formatLocation, getInitials } from "@/lib/utils";
// import { getProductById, getProducts } from "@/lib/queries/products";
// import { getCurrentProfile } from "@/lib/queries/profiles";
// import { createClient } from "@/lib/supabase/server";
// import { isSupabaseConfigured } from "@/lib/config";

// type Props = { params: Promise<{ id: string }> };

// export async function generateMetadata({ params }: Props): Promise<Metadata> {
//   const { id } = await params;
//   const product = await getProductById(id);
//   if (!product) return { title: "Product not found" };
//   return {
//     title: product.name,
//     description: product.description.slice(0, 160),
//   };
// }

// export default async function ProductPage({ params }: Props) {
//   const { id } = await params;
//   const product = await getProductById(id);
//   if (!product) notFound();

//   const [related, profile] = await Promise.all([
//     getProducts({ category: product.category }).then((ps) =>
//       ps.filter((p) => p.id !== product.id).slice(0, 4)
//     ),
//     getCurrentProfile(),
//   ]);

//   let hasActiveOrder = false;
//   if (profile?.role === "user" && isSupabaseConfigured()) {
//     const supabase = await createClient();
//     const { data: existing } = await supabase
//       .from("orders")
//       .select("id")
//       .eq("user_id", profile.id)
//       .eq("product_id", product.id)
//       .in("status", ["pending", "confirmed", "in_progress"])
//       .maybeSingle();
//     hasActiveOrder = !!existing;
//   }

//   const creator = product.creator;
//   const location = creator ? formatLocation(creator.city, creator.state) : null;
//   const displayName = creator?.store_name || creator?.full_name;

//   return (
//     <div className="pd-root">
//       {/* ── BACK ── */}
//       <div className="pd-back-row">
//         <Link href="/marketplace" className="pd-back">
//           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
//             <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
//           </svg>
//           Marketplace
//         </Link>
//         <span className="pd-back-sep">/</span>
//         <span className="pd-back-crumb">{product.name}</span>
//       </div>

//       {/* ── MAIN GRID ── */}
//       <div className="pd-grid">

//         {/* ── LEFT: image stack ── */}
//         <div className="pd-images">
//           <div className="pd-img-main">
//             <Image
//               src={product.image_url}
//               alt={product.name}
//               fill
//               className="pd-img-main__img"
//               sizes="(max-width: 1024px) 100vw, 52vw"
//               priority
//             />
//             {/* category badge floating on image */}
//             <span className="pd-img-cat">{product.category}</span>
//           </div>
//         </div>

//         {/* ── RIGHT: info + actions ── */}
//         <div className="pd-info">

//           {/* creator strip */}
//           {creator && (
//             <Link href={`/creators/${creator.id}`} className="pd-creator-strip">
//               <div className="pd-creator-strip__avatar">
//                 {creator.avatar_url ? (
//                   <Image
//                     src={creator.avatar_url}
//                     alt={displayName || ""}
//                     fill
//                     className="object-cover"
//                     sizes="40px"
//                   />
//                 ) : (
//                   <span className="pd-creator-strip__initials">
//                     {getInitials(creator.full_name)}
//                   </span>
//                 )}
//                 {creator.available_for_commissions && (
//                   <span className="pd-creator-strip__dot" aria-label="Available for commissions" />
//                 )}
//               </div>
//               <div className="pd-creator-strip__meta">
//                 <span className="pd-creator-strip__name">{displayName}</span>
//                 {location && (
//                   <span className="pd-creator-strip__loc">
//                     <svg width="10" height="11" viewBox="0 0 10 11" fill="none" aria-hidden="true">
//                       <path d="M5 0C3.07 0 1.5 1.57 1.5 3.5c0 2.63 3.5 6.5 3.5 6.5s3.5-3.87 3.5-6.5C8.5 1.57 6.93 0 5 0Zm0 4.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" fill="currentColor"/>
//                     </svg>
//                     {location}
//                   </span>
//                 )}
//               </div>
//               <svg className="pd-creator-strip__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
//                 <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//               </svg>
//             </Link>
//           )}

//           {/* product name + price */}
//           <div className="pd-title-block">
//             <p className="pd-category">{product.category}</p>
//             <h1 className="pd-name">{product.name}</h1>
//             <p className="pd-price">{formatINR(Number(product.price_inr))}</p>
//             <p className="pd-price-note">No online payment · artisan coordinates directly</p>
//           </div>

//           {/* description */}
//           <p className="pd-desc">{product.description}</p>

//           {/* trust signals */}
//           <div className="pd-trust">
//             <div className="pd-trust__item">
//               <span className="pd-trust__icon">🤝</span>
//               <span>Direct from maker</span>
//             </div>
//             <div className="pd-trust__item">
//               <span className="pd-trust__icon">✦</span>
//               <span>100% handmade</span>
//             </div>
//             <div className="pd-trust__item">
//               <span className="pd-trust__icon">💬</span>
//               <span>Custom requests welcome</span>
//             </div>
//           </div>

//           {/* ── ACTIONS PANEL ── */}
//           {creator ? (
//             <div className="pd-actions">
//               {/* Primary: Request piece */}
//               <div className="pd-actions__block pd-actions__block--primary">
//                 <div className="pd-actions__header">
//                   <div>
//                     <h2 className="pd-actions__title">Request this piece</h2>
//                     <p className="pd-actions__sub">
//                       Add customisation details — the artisan confirms &amp; ships to you.
//                     </p>
//                   </div>
//                 </div>
//                 <PlaceOrderForm
//                   creatorId={creator.id}
//                   productId={product.id}
//                   productName={product.name}
//                   hasActiveOrder={hasActiveOrder}
//                 />
//               </div>

//               {/* Secondary: Message */}
//               <div className="pd-actions__block pd-actions__block--secondary">
//                 <h2 className="pd-actions__title">Have a question?</h2>
//                 <p className="pd-actions__sub">
//                   Ask about availability, sizing, or delivery before ordering.
//                 </p>
//                 <div className="pd-actions__msg-btn">
//                   <ContactCreatorButton
//                     creatorId={creator.id}
//                     productId={product.id}
//                     fullWidth
//                     label={`Message ${creator.full_name.split(" ")[0]}`}
//                   />
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="pd-actions pd-actions--empty">
//               Creator information unavailable.
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ── RELATED ── */}
//       {related.length > 0 && (
//         <section className="pd-related">
//           <div className="pd-related__header">
//             <span className="pd-related__eyebrow">You might also like</span>
//             <h2 className="pd-related__title">More from {product.category}</h2>
//           </div>
//           <div className="pd-related__grid">
//             {related.map((p, i) => (
//               <ProductCard key={p.id} product={p} index={i} />
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   );
// }

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContactCreatorButton } from "@/components/products/ContactCreatorButton";
import { PlaceOrderForm } from "@/components/products/PlaceOrderForm";
import { ProductCard } from "@/components/products/ProductCard";
import { formatINR, formatLocation, getInitials } from "@/lib/utils";
import { getProductById, getProducts } from "@/lib/queries/products";
import { getCurrentProfile } from "@/lib/queries/profiles";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [related, profile] = await Promise.all([
    getProducts({ category: product.category }).then((ps) =>
      ps.filter((p) => p.id !== product.id).slice(0, 4)
    ),
    getCurrentProfile(),
  ]);

  let hasActiveOrder = false;
  if (profile?.role === "user" && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", profile.id)
      .eq("product_id", product.id)
      .in("status", ["pending", "confirmed", "in_progress"])
      .maybeSingle();
    hasActiveOrder = !!existing;
  }

  const creator = product.creator;
  const location = creator ? formatLocation(creator.city, creator.state) : null;
  const displayName = creator?.store_name || creator?.full_name;

  return (
    <div className="pd-root">
      {/* ── BACK ── */}
      <div className="pd-back-row">
        <Link href="/marketplace" className="pd-back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Marketplace
        </Link>
        <span className="pd-back-sep">/</span>
        <span className="pd-back-crumb">{product.name}</span>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="pd-grid">

        {/* ── LEFT: image ── */}
        <div className="pd-images">
          <div className="pd-img-main">
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="pd-img-main__img"
              sizes="(max-width: 900px) min(100vw, 480px), 42vw"
              priority
            />
            <span className="pd-img-cat">{product.category}</span>
          </div>
        </div>

        {/* ── RIGHT: info + actions ── */}
        <div className="pd-info">

          {/* creator strip */}
          {creator && (
            <Link href={`/creators/${creator.id}`} className="pd-creator-strip">
              <div className="pd-creator-strip__avatar">
                {creator.avatar_url ? (
                  <Image
                    src={creator.avatar_url}
                    alt={displayName || ""}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                ) : (
                  <span className="pd-creator-strip__initials">
                    {getInitials(creator.full_name)}
                  </span>
                )}
                {creator.available_for_commissions && (
                  <span className="pd-creator-strip__dot" aria-label="Available for commissions" />
                )}
              </div>
              <div className="pd-creator-strip__meta">
                <span className="pd-creator-strip__name">{displayName}</span>
                {location && (
                  <span className="pd-creator-strip__loc">
                    <svg width="10" height="11" viewBox="0 0 10 11" fill="none" aria-hidden="true">
                      <path d="M5 0C3.07 0 1.5 1.57 1.5 3.5c0 2.63 3.5 6.5 3.5 6.5s3.5-3.87 3.5-6.5C8.5 1.57 6.93 0 5 0Zm0 4.75a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Z" fill="currentColor"/>
                    </svg>
                    {location}
                  </span>
                )}
              </div>
              <svg className="pd-creator-strip__arrow" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          )}

          {/* product name + price */}
          <div className="pd-title-block">
            <p className="pd-category">{product.category}</p>
            <h1 className="pd-name">{product.name}</h1>
            <p className="pd-price">{formatINR(Number(product.price_inr))}</p>
            <p className="pd-price-note">No online payment · artisan coordinates directly</p>
          </div>

          {/* description */}
          <p className="pd-desc">{product.description}</p>

          {/* trust signals */}
          <div className="pd-trust">
            <div className="pd-trust__item">
              <span className="pd-trust__icon">🤝</span>
              <span>Direct from maker</span>
            </div>
            <div className="pd-trust__item">
              <span className="pd-trust__icon">✦</span>
              <span>100% handmade</span>
            </div>
            <div className="pd-trust__item">
              <span className="pd-trust__icon">💬</span>
              <span>Custom requests welcome</span>
            </div>
            <div className="pd-trust__item">
              <span className="pd-trust__icon">🇮🇳</span>
              <span>Made in India</span>
            </div>
          </div>

          {/* ── ACTIONS PANEL ── */}
          {creator ? (
            <div className="pd-actions">
              <div className="pd-actions__block pd-actions__block--primary">
                <div className="pd-actions__header">
                  <div>
                    <h2 className="pd-actions__title">Request this piece</h2>
                    <p className="pd-actions__sub">
                      Add customisation details — the artisan confirms &amp; ships to you.
                    </p>
                  </div>
                </div>
                <PlaceOrderForm
                  creatorId={creator.id}
                  productId={product.id}
                  productName={product.name}
                  hasActiveOrder={hasActiveOrder}
                />
              </div>

              <div className="pd-actions__block pd-actions__block--secondary">
                <h2 className="pd-actions__title">Have a question?</h2>
                <p className="pd-actions__sub">
                  Ask about availability, sizing, or delivery before ordering.
                </p>
                <div className="pd-actions__msg-btn">
                  <ContactCreatorButton
                    creatorId={creator.id}
                    productId={product.id}
                    fullWidth
                    label={`Message ${creator.full_name.split(" ")[0]}`}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="pd-actions pd-actions--empty">
              Creator information unavailable.
            </div>
          )}
        </div>
      </div>

      {/* ── RELATED ── */}
      {related.length > 0 && (
        <section className="pd-related">
          <div className="pd-related__header">
            <span className="pd-related__eyebrow">You might also like</span>
            <h2 className="pd-related__title">More from {product.category}</h2>
          </div>
          <div className="pd-related__grid">
            {related.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}