// import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";
// import { SectionHeading } from "@/components/layout/SectionHeading";
// import { SupabaseNotice } from "@/components/ui/SupabaseNotice";
// import { isSupabaseConfigured } from "@/lib/config";
// import { getProducts } from "@/lib/queries/products";
// import { PRODUCT_CATEGORIES } from "@/lib/types";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Marketplace",
//   description: "Browse authentic handmade pieces from independent Indian artisans. Pottery, textiles, brass work, and more — all priced in ₹.",
// };

// export default async function MarketplacePage() {
//   const configured = isSupabaseConfigured();
//   const products = configured ? await getProducts() : [];

//   return (
//     <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
//       <SectionHeading
//         eyebrow="Marketplace"
//         title="Shop handmade India"
//         description="Browse authentic pieces from registered artisans. Prices in ₹. Message makers to order."
//         className="mb-8"
//       />
//       {!configured && (
//         <div className="mb-8">
//           <SupabaseNotice />
//         </div>
//       )}
//       <MarketplaceClient products={products} categories={[...PRODUCT_CATEGORIES]} />
//     </div>
//   );
// }


// import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";
// import { SupabaseNotice } from "@/components/ui/SupabaseNotice";
// import { isSupabaseConfigured } from "@/lib/config";
// import { getProducts } from "@/lib/queries/products";
// import { PRODUCT_CATEGORIES } from "@/lib/types";
// import type { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Marketplace",
//   description: "Browse authentic handmade pieces from independent Indian artisans.",
// };

// export default async function MarketplacePage() {
//   const configured = isSupabaseConfigured();
//   const products = configured ? await getProducts() : [];

//   return (
//     <div className="mp-root">
//       {/* ── HERO ── */}
//       <section className="mp-hero">
//         <div className="mp-hero__bg" aria-hidden="true">
//           <div className="mp-hero__bg-grid" />
//           <div className="mp-hero__bg-glow mp-hero__bg-glow--1" />
//           <div className="mp-hero__bg-glow mp-hero__bg-glow--2" />
//         </div>
//         <div className="mp-hero__content">
//           <p className="mp-hero__eyebrow">
//             <span className="mp-hero__eyebrow-dot" />
//             Handmade India
//           </p>
//           <h1 className="mp-hero__heading">
//             Every piece,<br />
//             <em>a story.</em>
//           </h1>
//           <p className="mp-hero__sub">
//             {products.length > 0
//               ? `${products.length} handcrafted pieces from independent artisans across India`
//               : "Authentic handcrafted pieces from independent artisans across India"}
//           </p>
//         </div>
//         {/* decorative craft icons */}
//         <div className="mp-hero__floats" aria-hidden="true">
//           {["🏺","🪡","🪵","🔱","💍","🖌️"].map((icon, i) => (
//             <span key={i} className="mp-hero__float" style={{ animationDelay: `${i * 0.6}s`, "--i": i } as React.CSSProperties}>
//               {icon}
//             </span>
//           ))}
//         </div>
//       </section>

//       {/* ── MARKETPLACE BODY ── */}
//       <div className="mp-body">
//         {!configured && (
//           <div className="mb-8">
//             <SupabaseNotice />
//           </div>
//         )}
//         <MarketplaceClient products={products} categories={[...PRODUCT_CATEGORIES]} />
//       </div>
//     </div>
//   );
// }
import { MarketplaceClient } from "@/components/marketplace/MarketplaceClient";
import { SupabaseNotice } from "@/components/ui/SupabaseNotice";
import { isSupabaseConfigured } from "@/lib/config";
import { getProducts } from "@/lib/queries/products";
import { PRODUCT_CATEGORIES } from "@/lib/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace",
  description: "Browse authentic handmade pieces from independent Indian artisans.",
};

export default async function MarketplacePage() {
  const configured = isSupabaseConfigured();
  const products = configured ? await getProducts() : [];

  return (
    <div className="mp-root">
      {/* ── HERO ── */}
      <section className="mp-hero">
        <div className="mp-hero__bg" aria-hidden="true">
          <div className="mp-hero__bg-grid" />
          <div className="mp-hero__bg-glow mp-hero__bg-glow--1" />
          <div className="mp-hero__bg-glow mp-hero__bg-glow--2" />
        </div>
        <div className="mp-hero__content">
          <p className="mp-hero__eyebrow">
            <span className="mp-hero__eyebrow-dot" />
            Handmade India
          </p>
          <h1 className="mp-hero__heading">
            Every piece,<br />
            <em>a story.</em>
          </h1>
          <p className="mp-hero__sub">
            {products.length > 0
              ? `${products.length} handcrafted pieces from independent artisans across India`
              : "Authentic handcrafted pieces from independent artisans across India"}
          </p>
          {/* Real stats only */}
          <div className="mp-hero__stats">
            <div className="mp-hero__stat">
              <span className="mp-hero__stat-num">{products.length > 0 ? products.length : "—"}</span>
              <span className="mp-hero__stat-label">Pieces listed</span>
            </div>
            <div className="mp-hero__stat">
              <span className="mp-hero__stat-num">9</span>
              <span className="mp-hero__stat-label">Craft categories</span>
            </div>
            <div className="mp-hero__stat">
              <span className="mp-hero__stat-num">100%</span>
              <span className="mp-hero__stat-label">Handmade</span>
            </div>
          </div>
        </div>
        <div className="mp-hero__floats" aria-hidden="true">
          {["🏺","🪡","🪵","🔱","💍","🖌️"].map((icon, i) => (
            <span key={i} className="mp-hero__float" style={{ animationDelay: `${i * 0.6}s`, "--i": i } as React.CSSProperties}>
              {icon}
            </span>
          ))}
        </div>
      </section>

      {/* ── MARKETPLACE BODY ── */}
      <div className="mp-body">
        {!configured && (
          <div className="mb-8">
            <SupabaseNotice />
          </div>
        )}
        <MarketplaceClient products={products} categories={[...PRODUCT_CATEGORIES]} />
      </div>
    </div>
  );
}