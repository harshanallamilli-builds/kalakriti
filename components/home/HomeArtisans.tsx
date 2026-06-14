"use client";

import Link from "next/link";
import Image from "next/image";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import type { Profile } from "@/lib/types";
import { formatLocation, getInitials } from "@/lib/utils";

type Props = { creators: Profile[]; isLoggedIn: boolean };

export function HomeArtisans({ creators, isLoggedIn }: Props) {
  const headRef  = useScrollReveal();
  const listRef  = useScrollReveal();

  const visible = isLoggedIn ? creators : creators.slice(0, 2);
  const teased  = isLoggedIn ? [] : creators.slice(2, 3);

  return (
    <section className="py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        <div ref={headRef} className="reveal mb-8 flex items-end justify-between">
          <div>
            <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.26em] text-sage">Artisans</p>
            <h2 className="font-heading text-[1.9rem] font-medium leading-tight text-charcoal sm:text-[2.4rem]">
              Meet the makers
            </h2>
          </div>
          {isLoggedIn && creators.length > 0 && (
            <Link href="/creators"
              className="shrink-0 rounded-full border border-linen bg-cream px-4 py-2 text-[12px] font-semibold text-charcoal shadow-sm transition-all hover:border-clay/40 hover:bg-sand active:scale-[0.97]">
              All artisans →
            </Link>
          )}
        </div>

        {creators.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-linen py-20 text-center">
            <span className="text-5xl">🪔</span>
            <p className="mt-5 font-heading text-2xl text-charcoal">No studios yet</p>
            <Link href="/auth/signup?role=creator"
              className="mt-6 rounded-full bg-terracotta px-7 py-3 text-[13px] font-bold text-cream transition-all hover:bg-[#a34e2d]">
              Join as artisan
            </Link>
          </div>
        ) : (
          <>
            <div ref={listRef} className="reveal flex flex-col gap-3 sm:grid sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((c) => <ArtisanCard key={c.id} creator={c} />)}

              {teased.map((c) => (
                <div key={c.id} className="relative overflow-hidden rounded-3xl">
                  <div className="pointer-events-none select-none blur-[4px] brightness-95">
                    <ArtisanCard creator={c} />
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-cream/58 backdrop-blur-[2px]">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md">
                      <svg className="h-4 w-4 text-charcoal" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <Link href="/auth/signup"
                      className="rounded-full bg-terracotta px-4 py-1.5 text-[12px] font-bold text-cream shadow-[0_2px_10px_rgba(184,92,56,0.30)] active:scale-[0.97]">
                      Sign up to connect
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {!isLoggedIn && (
              <p className="mt-8 text-center text-[14px] text-warm-gray">
                <Link href="/auth/signup"
                  className="font-bold text-terracotta underline decoration-terracotta/30 underline-offset-2 transition-colors hover:text-charcoal">
                  Create a free account
                </Link>{" "}
                to message artisans directly and place orders
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function ArtisanCard({ creator }: { creator: Profile }) {
  const location = formatLocation(creator.city, creator.state);
  return (
    <Link href={`/creators/${creator.id}`}
      className="group flex items-center gap-4 rounded-3xl border border-linen/80 bg-white px-5 py-4 shadow-[0_2px_12px_rgba(58,50,44,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-terracotta/20 hover:shadow-[0_8px_28px_rgba(58,50,44,0.11)]">
      <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full ring-2 ring-linen ring-offset-2 ring-offset-white transition-all duration-300 group-hover:ring-terracotta/30">
        {creator.avatar_url ? (
          <Image src={creator.avatar_url} alt={creator.store_name || creator.full_name}
            fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="60px" />
        ) : (
          <span className="flex h-full w-full items-center justify-center bg-sand font-heading text-xl text-terracotta">
            {getInitials(creator.full_name)}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-heading text-[1.05rem] text-charcoal transition-colors group-hover:text-terracotta">
          {creator.store_name || creator.full_name}
        </h3>
        {creator.craft && (
          <p className="mt-0.5 truncate text-[11.5px] font-semibold text-saffron">{creator.craft}</p>
        )}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          {location && <span className="text-[11px] text-warm-gray">📍 {location}</span>}
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${creator.available_for_commissions ? "bg-sage/10 text-moss" : "bg-linen text-warm-gray"}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${creator.available_for_commissions ? "bg-sage" : "bg-warm-gray/30"}`} />
            {creator.available_for_commissions ? "Taking orders" : "Unavailable"}
          </span>
        </div>
      </div>
      <svg className="h-4 w-4 shrink-0 text-linen transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-terracotta"
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}