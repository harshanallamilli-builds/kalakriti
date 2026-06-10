"use client";

import Image from "next/image";
import type { PortfolioItem } from "@/lib/types";

type Props = {
  items: PortfolioItem[];
};

export function PortfolioGallery({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-linen bg-sand/20 px-6 py-14 text-center">
        <span className="text-4xl opacity-40">🎨</span>
        <p className="mt-4 font-heading text-lg text-charcoal/60">No portfolio yet.</p>
        <p className="mt-1 text-sm text-warm-gray">Showcase your best work here.</p>
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3 sm:columns-3 md:columns-4">
      {items.map((item) => (
        <div
          key={item.id}
          className="mb-3 break-inside-avoid overflow-hidden rounded-2xl border border-linen/60 bg-white shadow-[var(--shadow-card)]"
        >
          <div className="relative w-full">
            <Image
              src={item.image_url}
              alt={item.title ?? item.caption ?? "Portfolio piece"}
              width={400}
              height={400}
              className="h-auto w-full object-cover"
            />
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
        </div>
      ))}
    </div>
  );
}
