// import Image from "next/image";
// import Link from "next/link";
// import type { Product } from "@/lib/types";
// import { formatINR, formatLocation } from "@/lib/utils";

// type ProductCardProps = {
//   product: Product;
//   priority?: boolean;
// };

// export function ProductCard({ product, priority = false }: ProductCardProps) {
//   const location = product.creator
//     ? formatLocation(product.creator.city, product.creator.state)
//     : null;

//   return (
//     <article className="masonry-item group overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
//       <Link href={`/marketplace/${product.id}`} className="block">
//         <div className="relative aspect-[4/5] overflow-hidden bg-sand">
//           <Image
//             src={product.image_url}
//             alt={product.name}
//             fill
//             sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
//             className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
//             priority={priority}
//           />
//           <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-2.5 py-1 text-[11px] font-medium tracking-wide text-charcoal backdrop-blur-sm">
//             {product.category}
//           </span>
//         </div>
//       </Link>
//       <div className="p-4">
//         <p className="text-xs text-warm-gray">
//           {product.creator?.store_name || product.creator?.full_name}
//           {location && ` · ${location}`}
//         </p>
//         <Link href={`/marketplace/${product.id}`}>
//           <h3 className="mt-1 font-heading text-lg leading-snug text-charcoal transition-colors group-hover:text-terracotta">
//             {product.name}
//           </h3>
//         </Link>
//         <p className="mt-2 text-sm font-medium text-charcoal">
//           {formatINR(Number(product.price_inr))}
//         </p>
//       </div>
//     </article>
//   );
// }




// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { useState } from "react";
// import type { Product } from "@/lib/types";
// import { formatINR, formatLocation } from "@/lib/utils";

// type ProductCardProps = {
//   product: Product;
//   priority?: boolean;
//   index?: number;
// };

// export function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
//   const [imgLoaded, setImgLoaded] = useState(false);
//   const location = product.creator
//     ? formatLocation(product.creator.city, product.creator.state)
//     : null;

//   return (
//     <article
//       className="mp-card"
//       style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
//     >
//       <Link href={`/marketplace/${product.id}`} className="mp-card__img-wrap">
//         {/* skeleton shimmer */}
//         {!imgLoaded && <div className="mp-card__skeleton" />}

//         <Image
//           src={product.image_url}
//           alt={product.name}
//           fill
//           sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
//           className={cn("mp-card__img", imgLoaded && "mp-card__img--loaded")}
//           priority={priority}
//           onLoad={() => setImgLoaded(true)}
//         />

//         {/* overlay on hover */}
//         <div className="mp-card__overlay" aria-hidden="true" />

//         {/* category badge */}
//         <span className="mp-card__cat">{product.category}</span>

//         {/* quick-view hint */}
//         <span className="mp-card__hint">View piece →</span>
//       </Link>

//       <div className="mp-card__body">
//         {/* creator line */}
//         {product.creator && (
//           <Link
//             href={`/creators/${product.creator.id}`}
//             className="mp-card__creator"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {product.creator.store_name || product.creator.full_name}
//             {location && (
//               <span className="mp-card__creator-loc"> · {location}</span>
//             )}
//           </Link>
//         )}

//         <Link href={`/marketplace/${product.id}`}>
//           <h3 className="mp-card__name">{product.name}</h3>
//         </Link>

//         <div className="mp-card__footer">
//           <span className="mp-card__price">
//             {formatINR(Number(product.price_inr))}
//           </span>
//           <Link
//             href={`/marketplace/${product.id}`}
//             className="mp-card__cta"
//             aria-label={`View ${product.name}`}
//           >
//             <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
//               <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
//             </svg>
//           </Link>
//         </div>
//       </div>
//     </article>
//   );
// }

// function cn(...classes: (string | boolean | undefined)[]) {
//   return classes.filter(Boolean).join(" ");
// }

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { formatINR, formatLocation } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
  index?: number;
};

export function ProductCard({ product, priority = false, index = 0 }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const location = product.creator
    ? formatLocation(product.creator.city, product.creator.state)
    : null;

  return (
    <article
      className="mp-card"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link href={`/marketplace/${product.id}`} className="mp-card__img-wrap">
        {!imgLoaded && <div className="mp-card__skeleton" />}

        <Image
          src={product.image_url}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn("mp-card__img", imgLoaded && "mp-card__img--loaded")}
          priority={priority}
          onLoad={() => setImgLoaded(true)}
        />

        <div className="mp-card__overlay" aria-hidden="true" />
        <span className="mp-card__cat">{product.category}</span>
        <span className="mp-card__hint">View piece →</span>
      </Link>

      <div className="mp-card__body">
        {product.creator && (
          <Link
            href={`/creators/${product.creator.id}`}
            className="mp-card__creator"
            onClick={(e) => e.stopPropagation()}
          >
            {product.creator.store_name || product.creator.full_name}
            {location && (
              <span className="mp-card__creator-loc"> · {location}</span>
            )}
          </Link>
        )}

        <Link href={`/marketplace/${product.id}`}>
          <h3 className="mp-card__name">{product.name}</h3>
        </Link>

        <div className="mp-card__footer">
          <span className="mp-card__price">
            {formatINR(Number(product.price_inr))}
          </span>
          <Link
            href={`/marketplace/${product.id}`}
            className="mp-card__cta"
            aria-label={`View ${product.name}`}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}