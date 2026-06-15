"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import type { ArtisanStory } from "@/lib/types";

type Props = { stories: ArtisanStory[] };

export function ArtisanMagazine({ stories }: Props) {
  const headRef = useScrollReveal();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const total = stories.length;

  const next = useCallback(() => {
    setActive((a) => (a + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setActive((a) => (a - 1 + total) % total);
  }, [total]);

  // Auto-rotate every 40s, pause on hover/touch
  useEffect(() => {
    if (isPaused || total < 2) return;
    timerRef.current = setInterval(next, 40000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPaused, next, total]);

  // Reset timer when manually changed
  const goTo = (i: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setActive(i);
    setIsPaused(false);
  };

  if (!stories.length) return null;

  const featured = stories[active];
  const rest = stories.filter((_, i) => i !== active);

  return (
    <section
      className="relative overflow-hidden bg-espresso py-16 md:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-70" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-saffron/20 to-transparent" />
      <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(212,146,10,0.8) 0%, transparent 65%)" }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Header */}
        <div ref={headRef} className="reveal mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.28em] text-saffron">Artisan Stories</p>
            <h2 className="font-heading text-[2rem] font-medium leading-tight text-cream sm:text-[2.6rem]">
              The hands behind the craft
            </h2>
          </div>

          {/* Desktop prev/next buttons */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              type="button"
              onClick={() => { prev(); setIsPaused(false); }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 bg-cream/8 text-cream/60 transition-all hover:bg-cream/16 hover:text-cream active:scale-[0.95]"
              aria-label="Previous story"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => { next(); setIsPaused(false); }}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 bg-cream/8 text-cream/60 transition-all hover:bg-cream/16 hover:text-cream active:scale-[0.95]"
              aria-label="Next story"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <Link href="/creators"
              className="ml-2 shrink-0 rounded-full border border-cream/15 bg-cream/8 px-5 py-2 text-[12.5px] font-semibold text-cream/70 transition-all hover:bg-cream/14 hover:text-cream active:scale-[0.97]">
              All artisans →
            </Link>
          </div>
        </div>

        {/* ── DESKTOP: Magazine grid ── */}
        <div className="hidden gap-4 lg:grid lg:grid-cols-[1fr_340px]">
          {/* Featured card */}
          <div
            key={featured.id}
            className="group relative overflow-hidden rounded-3xl"
            style={{ minHeight: 460 }}
          >
            <div className="absolute inset-0">
              <Image
                src={featured.image_url}
                alt={featured.artisan_name}
                fill
                className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]"
                sizes="60vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-espresso/30 to-transparent" />
            </div>

            <div className="relative flex h-full flex-col justify-end p-9" style={{ minHeight: 460 }}>
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-saffron">{featured.craft}</span>
              </div>
              <blockquote className="font-heading text-[1.55rem] font-medium italic leading-snug text-cream sm:text-[1.8rem]">
                "{featured.quote}"
              </blockquote>
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-cream">{featured.artisan_name}</p>
                  <p className="mt-0.5 text-[12px] text-cream/50">📍 {featured.location}</p>
                </div>
                {featured.creator_id && (
                  <Link href={`/creators/${featured.creator_id}`}
                    className="shrink-0 rounded-full bg-cream/10 px-4 py-2 text-[12px] font-semibold text-cream backdrop-blur-sm transition-all hover:bg-cream/18 active:scale-[0.97]">
                    View studio →
                  </Link>
                )}
              </div>
              <p className="mt-4 border-t border-cream/10 pt-4 text-[13.5px] leading-relaxed text-cream/50 line-clamp-3">
                {featured.story}
              </p>

              {/* Auto-progress bar */}
              <div className="mt-5 h-[2px] w-full overflow-hidden rounded-full bg-cream/10">
                <div
                  className="h-full rounded-full bg-saffron"
                  style={{
                    width: isPaused ? "0%" : "100%",
                    transition: isPaused ? "none" : "width 40s linear",
                    transitionDelay: "0s",
                  }}
                  key={`${active}-${isPaused}`}
                />
              </div>
            </div>
          </div>

          {/* Side thumbnails */}
          <div className="flex flex-col gap-3">
            {rest.slice(0, 3).map((story) => {
              const idx = stories.indexOf(story);
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => goTo(idx)}
                  className="group relative flex-1 overflow-hidden rounded-2xl text-left transition-all duration-300 hover:scale-[1.01]"
                  style={{ minHeight: 120 }}
                >
                  <Image src={story.image_url} alt={story.artisan_name} fill
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    sizes="340px" />
                  <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent" />
                  {/* Active left bar */}
                  <div className="absolute inset-y-0 left-0 w-[3px] rounded-full bg-saffron transition-all duration-300"
                    style={{ opacity: idx === active ? 1 : 0, transform: idx === active ? "scaleY(1)" : "scaleY(0)" }} />
                  <div className="absolute inset-x-0 bottom-0 p-3">
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-saffron/80">{story.craft}</p>
                    <p className="mt-0.5 font-heading text-[1rem] leading-tight text-cream">{story.artisan_name}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE / TABLET: Horizontal swipeable cards ── */}
        <div
          ref={mobileScrollRef}
          className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory lg:hidden"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          onScroll={(e) => {
            // Sync dot indicator with scroll position
            const el = e.currentTarget;
            const cardWidth = el.scrollWidth / total;
            const newIdx = Math.round(el.scrollLeft / cardWidth);
            if (newIdx !== active) setActive(newIdx);
          }}
        >
          {stories.map((story, i) => (
            <div
              key={story.id}
              className="group relative shrink-0 snap-center overflow-hidden rounded-3xl"
              style={{ width: "min(85vw, 380px)", minHeight: 460 }}
            >
              <div className="absolute inset-0">
                <Image src={story.image_url} alt={story.artisan_name} fill
                  className="object-cover"
                  sizes="85vw"
                  priority={i === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/50 to-transparent" />
              </div>
              <div className="relative flex h-full flex-col justify-end p-6" style={{ minHeight: 460 }}>
                <div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-saffron">{story.craft}</span>
                </div>
                <blockquote className="font-heading text-[1.35rem] font-medium italic leading-snug text-cream">
                  "{story.quote}"
                </blockquote>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-cream text-[14px]">{story.artisan_name}</p>
                    <p className="mt-0.5 text-[11px] text-cream/50">📍 {story.location}</p>
                  </div>
                  {story.creator_id && (
                    <Link href={`/creators/${story.creator_id}`}
                      className="shrink-0 rounded-full bg-cream/10 px-3 py-1.5 text-[11px] font-semibold text-cream backdrop-blur-sm active:scale-[0.97]">
                      Studio →
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Dot nav — both mobile and desktop */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {stories.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                goTo(i);
                // Also scroll mobile carousel
                if (mobileScrollRef.current) {
                  const cardWidth = mobileScrollRef.current.scrollWidth / total;
                  mobileScrollRef.current.scrollTo({ left: cardWidth * i, behavior: "smooth" });
                }
              }}
              className={`rounded-full transition-all duration-300 ${
                i === active ? "w-6 h-2 bg-saffron" : "w-2 h-2 bg-cream/20 hover:bg-cream/40"
              }`}
              aria-label={`Story ${i + 1}`}
            />
          ))}
        </div>

        {/* Mobile all artisans link */}
        <div className="mt-6 flex justify-center lg:hidden">
          <Link href="/creators"
            className="rounded-full border border-cream/15 bg-cream/8 px-5 py-2.5 text-[12.5px] font-semibold text-cream/70 transition-all hover:bg-cream/14 hover:text-cream active:scale-[0.97]">
            All artisans →
          </Link>
        </div>

      </div>
    </section>
  );
}