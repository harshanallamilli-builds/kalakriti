"use client";

import Link from "next/link";
import Image from "next/image";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import type { Product } from "@/lib/types";
import { formatINR, formatLocation } from "@/lib/utils";

type Props = { products: Product[]; isLoggedIn: boolean };

export function HomeProducts({ products, isLoggedIn }: Props) {
  const headRef = useScrollReveal();
  const gridRef = useScrollReveal();
  const bannerRef = useScrollReveal();

  const visible = isLoggedIn ? products : products.slice(0, 2);
  const teased  = isLoggedIn ? [] : products.slice(2, 4);

  return (
    <section className="bg-sand/20 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Header */}
        <div ref={headRef} className="reveal mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.26em] text-saffron">Marketplace</p>
            <h2 className="font-heading text-[1.9rem] font-medium leading-tight text-charcoal sm:text-[2.4rem]">
              Handmade from across India
            </h2>
          </div>
          {isLoggedIn && products.length > 0 && (
            <Link href="/marketplace"
              className="shrink-0 rounded-full border border-linen bg-cream px-4 py-2 text-[12px] font-semibold text-charcoal shadow-sm transition-all hover:border-clay/40 hover:bg-sand active:scale-[0.97]">
              View all →
            </Link>
          )}
        </div>

        {products.length === 0 ? (
          <div ref={gridRef} className="reveal flex flex-col items-center justify-center rounded-3xl border border-dashed border-linen py-20 text-center">
            <span className="text-5xl">🏺</span>
            <p className="mt-5 font-heading text-2xl text-charcoal">The marketplace is waiting</p>
            <Link href="/auth/signup?role=creator"
              className="mt-6 rounded-full bg-terracotta px-7 py-3 text-[13px] font-bold text-cream transition-all hover:bg-[#a34e2d]">
              Open your studio
            </Link>
          </div>
        ) : (
          <>
            <div ref={gridRef} className="reveal grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
              {visible.map((p, i) => <ProductCard key={p.id} product={p} priority={i < 2} />)}

              {teased.map((p) => (
                <div key={p.id} className="relative overflow-hidden rounded-2xl">
                  <div className="pointer-events-none select-none blur-[5px] brightness-95 saturate-50">
                    <ProductCard product={p} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream/60 backdrop-blur-[3px]">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
                      <svg className="h-4 w-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Link href="/auth/signup"
                      className="rounded-full bg-terracotta px-4 py-1.5 text-[12px] font-bold text-cream shadow-[0_2px_10px_rgba(184,92,56,0.30)] active:scale-[0.97]">
                      Sign up to see
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {!isLoggedIn && (
              <div ref={bannerRef} className="reveal reveal-delay-2 mt-8 overflow-hidden rounded-3xl border border-linen/70 bg-cream">
                <div className="px-6 py-9 text-center sm:py-11">
                  <p className="font-heading text-2xl font-medium text-charcoal sm:text-3xl">
                    Many more pieces <span className="text-terracotta">waiting for you</span>
                  </p>
                  <p className="mt-2 text-[14px] text-warm-gray">
                    Join free — message artisans directly, place orders, track deliveries.
                  </p>
                  <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
                    <Link href="/auth/signup"
                      className="group relative overflow-hidden rounded-full bg-gradient-to-b from-terracotta to-[#a34e2d] px-7 py-3.5 text-[14px] font-bold text-cream shadow-[0_4px_18px_rgba(184,92,56,0.32)] transition-all hover:scale-[1.02] active:scale-[0.98]">
                      <span className="relative z-10">Create free account</span>
                      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                    </Link>
                    <Link href="/marketplace"
                      className="rounded-full border border-linen bg-sand/50 px-7 py-3.5 text-[14px] font-semibold text-charcoal transition-all hover:bg-sand active:scale-[0.98]">
                      Browse without account
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const loc = product.creator ? formatLocation(product.creator.city, product.creator.state) : null;
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-[0_2px_12px_rgba(58,50,44,0.07)] transition-all duration-400 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(58,50,44,0.13)]">
      <Link href={`/marketplace/${product.id}`} className="block">
        <div className="relative overflow-hidden bg-sand" style={{ aspectRatio: "4/5" }}>
          <Image src={product.image_url} alt={product.name} fill
            sizes="(max-width:640px) 50vw, (max-width:1024px) 25vw, 20vw"
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            priority={priority} />
          <span className="absolute left-2.5 top-2.5 rounded-full bg-cream/95 px-2.5 py-1 text-[10px] font-semibold text-charcoal shadow-[0_1px_4px_rgba(58,50,44,0.10)] backdrop-blur-sm">
            {product.category}
          </span>
        </div>
      </Link>
      <div className="p-3.5">
        <p className="truncate text-[11px] text-warm-gray">
          {product.creator?.store_name || product.creator?.full_name}{loc && ` · ${loc}`}
        </p>
        <Link href={`/marketplace/${product.id}`}>
          <h3 className="mt-1 line-clamp-2 font-heading text-[1rem] leading-snug text-charcoal transition-colors group-hover:text-terracotta">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 text-[13px] font-bold text-charcoal">{formatINR(Number(product.price_inr))}</p>
      </div>
    </article>
  );
}