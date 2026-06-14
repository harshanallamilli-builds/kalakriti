"use client";

import Link from "next/link";

const CRAFTS = [
  { emoji: "🏺", label: "Pottery",   q: "Pottery & Terracotta",   bg: "rgba(184,92,56,0.07)",  border: "rgba(184,92,56,0.18)",  text: "#b85c38" },
  { emoji: "🧵", label: "Textiles",  q: "Textiles & Weaving",     bg: "rgba(212,146,10,0.07)", border: "rgba(212,146,10,0.18)", text: "#d4920a" },
  { emoji: "🪵", label: "Wood",      q: "Wood & Carving",          bg: "rgba(196,154,108,0.09)",border: "rgba(196,154,108,0.20)",text: "#8a6240" },
  { emoji: "🔔", label: "Metal",     q: "Metal & Brass",           bg: "rgba(107,143,113,0.07)",border: "rgba(107,143,113,0.18)",text: "#4a6b52" },
  { emoji: "💍", label: "Jewelry",   q: "Jewelry & Accessories",   bg: "rgba(184,92,56,0.06)",  border: "rgba(184,92,56,0.14)",  text: "#b85c38" },
  { emoji: "🪔", label: "Décor",     q: "Home Décor",              bg: "rgba(212,146,10,0.06)", border: "rgba(212,146,10,0.14)", text: "#d4920a" },
  { emoji: "🎨", label: "Folk Art",  q: "Paper & Folk Art",        bg: "rgba(107,143,113,0.06)",border: "rgba(107,143,113,0.14)",text: "#4a6b52" },
  { emoji: "🖼️", label: "Paintings", q: "Paintings & Art",         bg: "rgba(196,154,108,0.08)",border: "rgba(196,154,108,0.18)",text: "#8a6240" },
];

export function HomeCategories() {
  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <p className="mb-5 text-center text-[10.5px] font-bold uppercase tracking-[0.28em] text-warm-gray/45">
          Shop by craft
        </p>
        {/* Swipeable on mobile, wraps on desktop */}
        <div className="-mx-5 flex gap-2.5 overflow-x-auto px-5 pb-1 hide-scrollbar sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0 sm:pb-0">
          {CRAFTS.map(({ emoji, label, q, bg, border, text }, i) => (
            <Link
              key={q}
              href={`/marketplace?category=${encodeURIComponent(q)}`}
              className="group flex shrink-0 flex-col items-center gap-2 rounded-2xl border px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(58,50,44,0.10)] active:scale-[0.95]"
              style={{
                background: bg,
                borderColor: border,
                animationDelay: `${i * 40}ms`,
              }}
            >
              <span className="text-[1.6rem] leading-none transition-transform duration-200 group-hover:scale-110">
                {emoji}
              </span>
              <span className="text-[11.5px] font-bold tracking-wide whitespace-nowrap" style={{ color: text }}>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}