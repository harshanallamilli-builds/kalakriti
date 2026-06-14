"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeStats } from "@/lib/types";

function useCountUp(target: number, duration = 1600, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return count;
}

type Props = { stats: HomeStats };

export function StatsStrip({ stats }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const STATS = [
    { value: stats.artisanCount, suffix: "+", label: "Artisan studios", color: "text-terracotta" },
    { value: stats.stateCount,   suffix: "",  label: "Indian states",   color: "text-saffron"   },
    { value: stats.productCount, suffix: "+", label: "Handmade pieces", color: "text-sage"      },
    { value: 100,                suffix: "%", label: "Made by hand",    color: "text-cream"     },
  ];

  return (
    <section ref={ref} className="relative bg-espresso py-12 md:py-16">
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-60" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-4">
          {STATS.map(({ value, suffix, label, color }, i) => (
            <StatItem key={label} value={value} suffix={suffix} label={label}
              color={color} started={started} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatItem({ value, suffix, label, color, started, delay }: {
  value: number; suffix: string; label: string;
  color: string; started: boolean; delay: number;
}) {
  const count = useCountUp(value, 1600, started);
  return (
    <div className="flex flex-col items-center text-center transition-all duration-700"
      style={{ opacity: started ? 1 : 0, transform: started ? "translateY(0)" : "translateY(16px)", transitionDelay: `${delay}ms` }}>
      <p className={`font-heading text-[3rem] font-medium leading-none sm:text-[3.5rem] ${color}`}>
        {count}{suffix}
      </p>
      <p className="mt-2 text-[12px] font-semibold uppercase tracking-[0.20em] text-cream/40">
        {label}
      </p>
    </div>
  );
}