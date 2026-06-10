import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatINR, formatLocation } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  priority?: boolean;
};

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const location = product.creator
    ? formatLocation(product.creator.city, product.creator.state)
    : null;

  return (
    <article className="masonry-item group overflow-hidden rounded-2xl bg-white shadow-[var(--shadow-card)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[var(--shadow-lift)]">
      <Link href={`/marketplace/${product.id}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-sand">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            priority={priority}
          />
          <span className="absolute left-3 top-3 rounded-full bg-cream/95 px-2.5 py-1 text-[11px] font-medium tracking-wide text-charcoal backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <p className="text-xs text-warm-gray">
          {product.creator?.store_name || product.creator?.full_name}
          {location && ` · ${location}`}
        </p>
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="mt-1 font-heading text-lg leading-snug text-charcoal transition-colors group-hover:text-terracotta">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-sm font-medium text-charcoal">
          {formatINR(Number(product.price_inr))}
        </p>
      </div>
    </article>
  );
}
