"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import type { ArtisanStory } from "@/lib/types";

type Props = { stories: ArtisanStory[] };

export function ArtisanMagazine({ stories }: Props) {
  const headRef = useScrollReveal();
  const [active, setActive] = useState(0);

  if (!stories.length) return null;

  const featured = stories[active];
  const rest = stories.filter((_, i) => i !== active);

  return (
    <section className="relative overflow-hidden bg-espresso py-16 md:py-24">
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-70" />

      {/* Top shimmer */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron/30 to-transparent" />
      {/* Bottom shimmer */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-saffron/20 to-transparent" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute -right-32 top-0 h-[500px] w-[500px] rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(212,146,10,0.8) 0%, transparent 65%)" }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">

        {/* Section head */}
        <div ref={headRef} className="reveal mb-12 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.28em] text-saffron">Artisan Stories</p>
            <h2 className="font-heading text-[2rem] font-medium leading-tight text-cream sm:text-[2.6rem]">
              The hands behind the craft
            </h2>
          </div>
          <Link href="/creators"
            className="shrink-0 rounded-full border border-cream/15 bg-cream/8 px-5 py-2.5 text-[12.5px] font-semibold text-cream/70 transition-all hover:bg-cream/14 hover:text-cream active:scale-[0.97]">
            All artisans →
          </Link>
        </div>

        {/* Magazine layout */}
        <div className="grid gap-4 lg:grid-cols-[1fr_340px]">

          {/* ── Featured card (left, large) ── */}
          <div
            key={featured.id}
            className="group relative overflow-hidden rounded-3xl"
            style={{ minHeight: 420 }}
          >
            {/* Image */}
            <div className="absolute inset-0">
              <Image
                src={featured.image_url}
                alt={featured.artisan_name}
                fill
                className="object-cover transition-transform duration-[1400ms] group-hover:scale-[1.03]"
                sizes="(max-width:1024px) 100vw, 60vw"
                priority
              />
              {/* Layered overlay for text legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-espresso/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative flex h-full flex-col justify-end p-7 sm:p-9" style={{ minHeight: 420 }}>
              {/* Craft badge */}
              <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-saffron/25 bg-saffron/10 px-3.5 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                <span className="text-[10.5px] font-bold uppercase tracking-[0.22em] text-saffron">
                  {featured.craft}
                </span>
              </div>

              {/* Pull quote — the hero moment */}
              <blockquote className="font-heading text-[1.45rem] font-medium italic leading-snug text-cream sm:text-[1.75rem]">
                "{featured.quote}"
              </blockquote>

              {/* Attribution */}
              <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-cream">{featured.artisan_name}</p>
                  <p className="mt-0.5 text-[12px] text-cream/50">📍 {featured.location}</p>
                </div>
                {featured.creator_id ? (
                  <Link
                    href={`/creators/${featured.creator_id}`}
                    className="shrink-0 rounded-full bg-cream/10 px-4 py-2 text-[12px] font-semibold text-cream backdrop-blur-sm transition-all hover:bg-cream/18 active:scale-[0.97]"
                  >
                    View studio →
                  </Link>
                ) : null}
              </div>

              {/* Story paragraph — subtle, below fold on mobile */}
              <p className="mt-4 hidden border-t border-cream/10 pt-4 text-[13.5px] leading-relaxed text-cream/50 sm:block line-clamp-3">
                {featured.story}
              </p>
            </div>
          </div>

          {/* ── Side stack (right, 3 thumbnails) ── */}
          <div className="flex flex-row gap-3 lg:flex-col">
            {rest.slice(0, 3).map((story, i) => (
              <button
                key={story.id}
                type="button"
                onClick={() => setActive(stories.indexOf(story))}
                className="group relative flex-1 overflow-hidden rounded-2xl text-left transition-all duration-300 hover:scale-[1.01] lg:flex-none"
                style={{ minHeight: 110 }}
              >
                <Image
                  src={story.image_url}
                  alt={story.artisan_name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  sizes="(max-width:1024px) 33vw, 340px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/90 via-espresso/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-3">
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.18em] text-saffron/80">{story.craft}</p>
                  <p className="mt-0.5 font-heading text-[1rem] leading-tight text-cream">{story.artisan_name}</p>
                </div>
                {/* Active indicator */}
                <div className="absolute inset-x-0 top-0 h-[2px] rounded-full bg-saffron transition-all duration-300"
                  style={{ opacity: stories.indexOf(story) === active ? 0 : 0 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Dot nav — mobile */}
        <div className="mt-6 flex justify-center gap-2">
          {stories.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`rounded-full transition-all duration-300 ${i === active
                ? "w-6 h-2 bg-saffron"
                : "w-2 h-2 bg-cream/20 hover:bg-cream/40"
              }`}
              aria-label={`Story ${i + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}