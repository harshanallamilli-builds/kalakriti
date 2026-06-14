"use client";

import Link from "next/link";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";

export function HomeCTA() {
  const ref = useScrollReveal();

  return (
    <section className="bg-sand/20 py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div ref={ref} className="reveal relative overflow-hidden rounded-[2rem] bg-espresso px-7 py-14 text-center shadow-[0_28px_72px_-12px_rgba(31,26,23,0.40)] sm:px-12 md:py-20">
          <div className="grain-overlay absolute inset-0 opacity-80" />

          {/* Ambient glows inside card */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full opacity-25"
            style={{ background: "radial-gradient(circle, rgba(212,146,10,0.7) 0%, transparent 70%)" }} />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, rgba(184,92,56,0.8) 0%, transparent 70%)" }} />

          {/* Shimmer top line */}
          <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-saffron/35 to-transparent" />

          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-saffron/20 bg-saffron/8 px-4 py-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
              <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-saffron">Free to join</span>
            </div>

            <h2 className="font-heading text-4xl font-medium leading-[1.06] text-cream sm:text-5xl">
              Bring home a piece of
              <span className="block text-terracotta">India's craft tradition</span>
            </h2>
            <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-cream/55">
              Message artisans directly, place custom orders, and own something truly made by hand.
            </p>

            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-center">
              <Link href="/auth/signup?role=user"
                className="group relative overflow-hidden rounded-full bg-gradient-to-b from-terracotta to-[#a34e2d] px-8 py-4 text-[14px] font-bold tracking-wide text-cream shadow-[0_4px_20px_rgba(184,92,56,0.40)] transition-all hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(184,92,56,0.52)] active:scale-[0.98]">
                <span className="relative z-10">I want to shop — Join free</span>
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link href="/auth/signup?role=creator"
                className="rounded-full border border-cream/18 bg-cream/8 px-8 py-4 text-[14px] font-bold text-cream transition-all hover:bg-cream/14 hover:border-cream/28 active:scale-[0.98]">
                I'm an artisan — Open studio →
              </Link>
            </div>

            <p className="mt-8 text-[11.5px] text-cream/28">No credit card · No fees · Your data stays yours</p>
          </div>
        </div>
      </div>
    </section>
  );
}