// "use client";

// import Image from "next/image";
// import type { PortfolioItem } from "@/lib/types";

// type Props = {
//   items: PortfolioItem[];
// };

// export function PortfolioGallery({ items }: Props) {
//   if (items.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-linen bg-sand/20 px-6 py-14 text-center">
//         <span className="text-4xl opacity-40">🎨</span>
//         <p className="mt-4 font-heading text-lg text-charcoal/60">No portfolio yet.</p>
//         <p className="mt-1 text-sm text-warm-gray">Showcase your best work here.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="columns-2 gap-3 sm:columns-3 md:columns-4">
//       {items.map((item) => (
//         <div
//           key={item.id}
//           className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-linen/60 bg-white shadow-[var(--shadow-card)]"
//         >
//           <div className="relative w-full">
//             <Image
//               src={item.image_url}
//               alt={item.title ?? item.caption ?? "Portfolio piece"}
//               width={400}
//               height={400}
//               className="h-auto w-full object-cover"
//             />
//           </div>
//           {(item.title || item.caption) && (
//             <div className="px-3 py-2.5">
//               {item.title && (
//                 <p className="text-xs font-semibold text-charcoal leading-snug">{item.title}</p>
//               )}
//               {item.caption && (
//                 <p className="mt-0.5 text-[11px] leading-relaxed text-warm-gray">{item.caption}</p>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }


"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import type { PortfolioItem } from "@/lib/types";

type Props = {
  items: PortfolioItem[];
};

export function PortfolioGallery({ items }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const openLightbox = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = useCallback(() => setLightboxIdx(null), []);
  const goPrev = useCallback(
    () => setLightboxIdx((i) => (i === null ? 0 : (i - 1 + items.length) % items.length)),
    [items.length]
  );
  const goNext = useCallback(
    () => setLightboxIdx((i) => (i === null ? 0 : (i + 1) % items.length)),
    [items.length]
  );

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-linen bg-sand/20 px-6 py-16 text-center">
        <span className="text-5xl opacity-30">🎨</span>
        <p className="mt-4 font-heading text-lg text-charcoal/50">
          Portfolio coming soon.
        </p>
        <p className="mt-1 text-sm text-warm-gray">
          This artisan is setting up their studio. Check back soon.
        </p>
      </div>
    );
  }

  const active = lightboxIdx !== null ? items[lightboxIdx] : null;

  return (
    <>
      {/* Masonry grid */}
      <div className="columns-2 gap-3 sm:columns-3 md:columns-4">
        {items.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => openLightbox(idx)}
            className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl border border-linen/60 bg-white shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)] group text-left"
            aria-label={`View ${item.title ?? "portfolio piece"} in full`}
          >
            <div className="relative w-full overflow-hidden">
              <Image
                src={item.image_url}
                alt={item.title ?? item.caption ?? "Portfolio piece"}
                width={400}
                height={400}
                className="h-auto w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              {/* Hover overlay with expand icon */}
              <div className="absolute inset-0 flex items-center justify-center bg-charcoal/0 transition-all duration-300 group-hover:bg-charcoal/20">
                <svg
                  className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  width="28"
                  height="28"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="11" fill="white" fillOpacity=".85"/>
                  <path d="M8 12h8M12 8v8" stroke="#1a1714" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
            {(item.title || item.caption) && (
              <div className="px-3 py-2.5">
                {item.title && (
                  <p className="text-xs font-semibold text-charcoal leading-snug">{item.title}</p>
                )}
                {item.caption && (
                  <p className="mt-0.5 text-[11px] leading-relaxed text-warm-gray">{item.caption}</p>
                )}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {active && lightboxIdx !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/90 backdrop-blur-md px-4"
          role="dialog"
          aria-modal="true"
          aria-label={active.title ?? "Portfolio image"}
          onClick={closeLightbox}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-cream hover:bg-white/20 transition-colors"
            onClick={closeLightbox}
            aria-label="Close"
          >
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>

          {/* Prev */}
          {items.length > 1 && (
            <button
              className="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label="Previous image"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}

          {/* Image */}
          <div
            className="relative max-h-[85vh] max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={active.image_url}
              alt={active.title ?? active.caption ?? "Portfolio piece"}
              width={1200}
              height={900}
              className="h-auto max-h-[80vh] w-full rounded-2xl object-contain"
              priority
            />
            {(active.title || active.caption) && (
              <div className="mt-3 text-center">
                {active.title && (
                  <p className="font-heading text-lg text-cream">{active.title}</p>
                )}
                {active.caption && (
                  <p className="mt-1 text-sm text-cream/70">{active.caption}</p>
                )}
              </div>
            )}
            {/* Counter */}
            <p className="mt-2 text-center text-xs text-cream/50">
              {lightboxIdx + 1} / {items.length}
            </p>
          </div>

          {/* Next */}
          {items.length > 1 && (
            <button
              className="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-cream hover:bg-white/20 transition-colors"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label="Next image"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>
      )}
    </>
  );
}