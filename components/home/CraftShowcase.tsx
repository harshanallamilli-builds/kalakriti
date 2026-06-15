"use client";

// Draw-on craft showcase section — uses simplified silhouettes from the uploaded SVG
// The original SVG contained 4 craft objects: pottery pot (centre), tall vase (right),
// decorative vessel (left), and a hookah/surahi (far right).
// We simplify them to clean outlines that draw themselves on scroll into view.

import { useEffect, useRef, useState } from "react";

// Pre-computed circumferences to avoid runtime Math.PI hydration mismatch
const CIRC = {
  r60: "376.99",
  r42: "263.89",
  r24: "150.80",
  r8:  "50.27",
};

export function CraftShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setDrawn(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const T = (delay: number, dur = "1.2s") => ({
    strokeDashoffset: drawn ? 0 : 999,
    opacity: drawn ? 1 : 0,
    transition: `stroke-dashoffset ${dur} cubic-bezier(0.22,1,0.36,1) ${delay}ms, opacity 0.5s ease ${delay}ms`,
  });

  const F = (delay: number) => ({
    opacity: drawn ? 1 : 0,
    transition: `opacity 0.8s ease ${delay}ms`,
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-espresso py-16 md:py-20"
      aria-hidden="true"
    >
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-80" />
      {/* Shimmer lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-saffron/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-saffron/20 to-transparent" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-10"
        style={{ background: "radial-gradient(circle, rgba(184,92,56,0.8) 0%, transparent 65%)" }} />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section label */}
        <div className="mb-10 text-center"
          style={{ opacity: drawn ? 1 : 0, transform: drawn ? "translateY(0)" : "translateY(12px)", transition: "all 0.7s ease" }}>
          <p className="text-[10.5px] font-bold uppercase tracking-[0.28em] text-saffron/70">
            Crafted by hand
          </p>
          <h2 className="mt-2 font-heading text-[2rem] font-medium text-cream sm:text-[2.6rem]">
            Every form tells a story
          </h2>
        </div>

        {/* The draw-on SVG canvas — 5 craft objects across the width */}
        <div className="flex items-end justify-center gap-8 sm:gap-12 md:gap-16 lg:gap-20">

          {/* ── 1. Blue Pottery Vase ── */}
          <div className="flex flex-col items-center gap-3">
            <svg width="90" height="160" viewBox="0 0 90 160" fill="none" className="overflow-visible">
              {/* Base shadow */}
              <ellipse cx="45" cy="152" rx="28" ry="5" fill="#b85c38" style={F(1800)} opacity="0.18" />
              {/* Body fill */}
              <path d="M18 100 Q10 118 12 136 Q20 152 45 152 Q70 152 78 136 Q80 118 72 100Z"
                fill="#b85c38" style={F(600)} opacity="0.30" />
              {/* Neck fill */}
              <path d="M28 100 Q24 78 28 58 Q35 36 45 34 Q55 36 62 58 Q66 78 62 100Z"
                fill="#d4920a" style={F(800)} opacity="0.20" />
              {/* Body outline */}
              <path d="M18 100 Q10 118 12 136 Q20 152 45 152 Q70 152 78 136 Q80 118 72 100Z"
                stroke="#b85c38" strokeWidth="1.5" fill="none"
                strokeDasharray="250"
                style={T(400, "1.0s")} />
              {/* Neck outline */}
              <path d="M28 100 Q24 78 28 58 Q35 36 45 34 Q55 36 62 58 Q66 78 62 100Z"
                stroke="#d4920a" strokeWidth="1.5" fill="none"
                strokeDasharray="220"
                style={T(700, "0.9s")} />
              {/* Rim */}
              <path d="M32 34 Q38 24 45 22 Q52 24 58 34"
                stroke="#faf6f0" strokeWidth="1.5" fill="none"
                strokeDasharray="50"
                style={T(1100, "0.6s")} />
              {/* Throwing rings */}
              {[108, 122, 136].map((y, i) => (
                <path key={i}
                  d={`M${16 + i} ${y} Q32 ${y - 3} 45 ${y - 2} Q58 ${y - 3} ${74 - i} ${y}`}
                  stroke="#faf6f0" strokeWidth="0.8" fill="none"
                  strokeDasharray="80"
                  style={{ ...T(1300 + i * 120, "0.7s"), opacity: drawn ? 0.3 : 0 }} />
              ))}
              {/* Label */}
              <text x="45" y="170" textAnchor="middle" fontSize="9" fontFamily="'Cormorant Garamond', Georgia, serif"
                fontStyle="italic" fill="#d4920a" style={F(1800)} opacity="0.55">
                Blue Pottery
              </text>
            </svg>
          </div>

          {/* ── 2. Dhurrie / Textile frame ── */}
          <div className="flex flex-col items-center gap-3">
            <svg width="100" height="130" viewBox="0 0 100 130" fill="none" className="overflow-visible">
              {/* Frame outline */}
              <rect x="8" y="8" width="84" height="100" rx="3" stroke="#d4920a"
                strokeWidth="1.5" fill="none"
                strokeDasharray="380"
                style={T(200, "1.1s")} />
              {/* Inner frame */}
              <rect x="16" y="16" width="68" height="84" rx="2" stroke="#d4920a"
                strokeWidth="1" fill="none"
                strokeDasharray="320"
                style={{ ...T(500, "0.9s"), opacity: drawn ? 0.40 : 0 }} />
              {/* Warp threads */}
              {[0,1,2,3,4,5].map(i => (
                <line key={i}
                  x1={24 + i * 12} y1="20" x2={24 + i * 12} y2="96"
                  stroke="#d4920a" strokeWidth="1" strokeDasharray="80"
                  style={{ ...T(700 + i * 60, "0.7s"), opacity: drawn ? 0.25 : 0 }} />
              ))}
              {/* Weft threads */}
              {[0,1,2,3,4,5,6].map(i => (
                <line key={i}
                  x1="20" y1={24 + i * 12} x2="80" y2={24 + i * 12}
                  stroke="#b85c38" strokeWidth={i % 2 === 0 ? 1.5 : 0.8}
                  strokeDasharray="70"
                  style={{ ...T(1000 + i * 50, "0.6s"), opacity: drawn ? (i % 2 === 0 ? 0.35 : 0.18) : 0 }} />
              ))}
              {/* Diamond pattern centre */}
              <path d="M50 30 L64 50 L50 70 L36 50Z"
                stroke="#b85c38" strokeWidth="1.2" fill="none"
                strokeDasharray="100"
                style={{ ...T(1500, "0.8s"), opacity: drawn ? 0.35 : 0 }} />
              <text x="50" y="120" textAnchor="middle" fontSize="9" fontFamily="'Cormorant Garamond', Georgia, serif"
                fontStyle="italic" fill="#d4920a" style={F(1800)} opacity="0.55">
                Dhurrie
              </text>
            </svg>
          </div>

          {/* ── 3. Large Surahi / Hookah vessel (from SVG Layer 1, centre shape) ── */}
          <div className="hidden flex-col items-center gap-3 sm:flex">
            <svg width="120" height="200" viewBox="0 0 120 200" fill="none" className="overflow-visible">
              {/* Shadow */}
              <ellipse cx="60" cy="192" rx="36" ry="6" fill="#b85c38" style={F(1800)} opacity="0.15" />
              {/* Base ellipse */}
              <ellipse cx="60" cy="182" rx="30" ry="6" stroke="#b85c38" strokeWidth="1.5"
                strokeDasharray="200"
                style={T(200, "0.8s")} opacity="0.50" />
              {/* Wide belly */}
              <path d="M20 130 Q8 148 12 168 Q22 182 60 182 Q98 182 108 168 Q112 148 100 130Z"
                fill="#b85c38" style={F(500)} opacity="0.22" />
              <path d="M20 130 Q8 148 12 168 Q22 182 60 182 Q98 182 108 168 Q112 148 100 130Z"
                stroke="#b85c38" strokeWidth="1.8" fill="none"
                strokeDasharray="360"
                style={T(300, "1.2s")} />
              {/* Narrow mid section */}
              <path d="M36 130 Q32 112 36 94 Q42 72 60 70 Q78 72 84 94 Q88 112 84 130Z"
                stroke="#c49a6c" strokeWidth="1.5" fill="none"
                strokeDasharray="280"
                style={T(700, "1.0s")} />
              {/* Upper shoulder */}
              <path d="M42 70 Q38 48 44 32 Q50 16 60 14 Q70 16 76 32 Q82 48 78 70Z"
                fill="#d4920a" style={F(900)} opacity="0.16" />
              <path d="M42 70 Q38 48 44 32 Q50 16 60 14 Q70 16 76 32 Q82 48 78 70Z"
                stroke="#d4920a" strokeWidth="1.5" fill="none"
                strokeDasharray="240"
                style={T(900, "0.9s")} />
              {/* Rim/neck */}
              <path d="M48 14 Q53 6 60 4 Q67 6 72 14"
                stroke="#faf6f0" strokeWidth="1.8" fill="none"
                strokeDasharray="50"
                style={T(1300, "0.5s")} />
              {/* Horizontal bands */}
              {[100, 114, 150, 163].map((y, i) => (
                <path key={i}
                  d={`M${i < 2 ? 36 : 22} ${y} Q48 ${y - 3} 60 ${y - 2} Q72 ${y - 3} ${i < 2 ? 84 : 98} ${y}`}
                  stroke="#faf6f0" strokeWidth="0.8" fill="none"
                  strokeDasharray="90"
                  style={{ ...T(1400 + i * 80, "0.6s"), opacity: drawn ? 0.28 : 0 }} />
              ))}
              <text x="60" y="208" textAnchor="middle" fontSize="9" fontFamily="'Cormorant Garamond', Georgia, serif"
                fontStyle="italic" fill="#b85c38" style={F(1900)} opacity="0.55">
                Surahi
              </text>
            </svg>
          </div>

          {/* ── 4. Brass Mandala / Dokra ── */}
          <div className="flex flex-col items-center gap-3">
            <svg width="110" height="130" viewBox="0 0 110 130" fill="none" className="overflow-visible">
              {/* Outer ring */}
              <circle cx="55" cy="58" r="48" stroke="#6b8f71" strokeWidth="1.5"
                strokeDasharray={CIRC.r60}
                style={T(200, "1.4s")} opacity="0.40" />
              {/* Mid ring */}
              <circle cx="55" cy="58" r="34" stroke="#6b8f71" strokeWidth="1.2"
                strokeDasharray={CIRC.r42}
                style={T(600, "1.1s")} opacity="0.32" />
              {/* Inner ring */}
              <circle cx="55" cy="58" r="20" stroke="#6b8f71" strokeWidth="1"
                strokeDasharray={CIRC.r24}
                style={T(900, "0.9s")} opacity="0.26" />
              {/* Centre dot */}
              <circle cx="55" cy="58" r="5" stroke="#4a6b52" strokeWidth="1.2"
                strokeDasharray={CIRC.r8}
                style={T(1200, "0.5s")} opacity="0.40" />
              {/* 8 spokes — pre-computed to avoid trig hydration issues */}
              {[
                [55, 24, 55, 38], [55, 78, 55, 92],   // vertical
                [21, 58, 35, 58], [75, 58, 89, 58],   // horizontal
                [32, 35, 41, 44], [69, 72, 78, 81],   // diagonal ↘
                [78, 35, 69, 44], [32, 72, 41, 81],   // diagonal ↙
              ].map(([x1,y1,x2,y2], i) => (
                <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                  stroke="#6b8f71" strokeWidth="1.5"
                  strokeDasharray="20"
                  style={{ ...T(1300 + i * 60, "0.4s"), opacity: drawn ? 0.42 : 0 }} />
              ))}
              {/* Petal points at mid ring */}
              {[
                "M55 24 Q62 38 55 38 Q48 38 55 24",
                "M55 78 Q62 78 55 92 Q48 78 55 78",
                "M21 58 Q35 65 35 58 Q35 51 21 58",
                "M89 58 Q75 65 75 58 Q75 51 89 58",
              ].map((d, i) => (
                <path key={i} d={d} fill="#6b8f71"
                  style={{ ...F(1700 + i * 80), opacity: drawn ? 0.15 : 0 }} />
              ))}
              <text x="55" y="122" textAnchor="middle" fontSize="9" fontFamily="'Cormorant Garamond', Georgia, serif"
                fontStyle="italic" fill="#6b8f71" style={F(1900)} opacity="0.55">
                Dokra
              </text>
            </svg>
          </div>

          {/* ── 5. Wooden carved panel ── */}
          <div className="hidden flex-col items-center gap-3 md:flex">
            <svg width="90" height="140" viewBox="0 0 90 140" fill="none" className="overflow-visible">
              {/* Panel outer */}
              <rect x="8" y="8" width="74" height="110" rx="4" stroke="#c49a6c"
                strokeWidth="1.5" fill="none"
                strokeDasharray="380"
                style={T(200, "1.1s")} opacity="0.50" />
              {/* Panel inner border */}
              <rect x="14" y="14" width="62" height="98" rx="3" stroke="#c49a6c"
                strokeWidth="1" fill="none"
                strokeDasharray="340"
                style={{ ...T(500, "0.9s"), opacity: drawn ? 0.30 : 0 }} />
              {/* Central lotus — petals drawn one by one */}
              {[
                "M45 35 Q50 45 45 55 Q40 45 45 35",   // top
                "M45 75 Q50 85 45 90 Q40 85 45 75",   // bottom
                "M20 63 Q30 58 35 63 Q30 68 20 63",   // left
                "M55 63 Q60 58 70 63 Q60 68 55 63",   // right
              ].map((d, i) => (
                <path key={i} d={d}
                  stroke="#c49a6c" strokeWidth="1.2" fill="none"
                  strokeDasharray="60"
                  style={{ ...T(700 + i * 150, "0.6s"), opacity: drawn ? 0.50 : 0 }} />
              ))}
              {/* Centre circle */}
              <circle cx="45" cy="63" r="9" stroke="#c49a6c" strokeWidth="1.2"
                strokeDasharray="60"
                style={T(1400, "0.6s")} opacity="0.45" />
              <circle cx="45" cy="63" r="4" stroke="#c49a6c" strokeWidth="1"
                strokeDasharray="30"
                style={T(1600, "0.4s")} opacity="0.35" />
              {/* Corner flourishes */}
              {[
                "M14 14 Q20 20 22 28",
                "M76 14 Q70 20 68 28",
                "M14 112 Q20 106 22 98",
                "M76 112 Q70 106 68 98",
              ].map((d, i) => (
                <path key={i} d={d}
                  stroke="#c49a6c" strokeWidth="1" fill="none"
                  strokeDasharray="25"
                  style={{ ...T(1600 + i * 80, "0.4s"), opacity: drawn ? 0.35 : 0 }} />
              ))}
              <text x="45" y="132" textAnchor="middle" fontSize="9" fontFamily="'Cormorant Garamond', Georgia, serif"
                fontStyle="italic" fill="#c49a6c" style={F(1900)} opacity="0.55">
                Wood Carving
              </text>
            </svg>
          </div>

        </div>

        {/* Bottom label */}
        <p className="mt-10 text-center font-heading text-[1rem] italic text-cream/30"
          style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.8s ease 2s" }}>
          "Every line you see was drawn by someone's hands."
        </p>
      </div>
    </section>
  );
}