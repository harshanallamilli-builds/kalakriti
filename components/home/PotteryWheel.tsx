// "use client";

// // Animated pottery wheel — SVG path morphing + rotation
// // Plays on loop, 10 second cycle. Pure CSS + React state.
// // On mobile: shown as background watermark behind hero text.
// // On desktop: shown as the right-side hero visual (replaces static mosaic).

// import { useEffect, useState } from "react";

// // Pre-computed spoke coords for the spinning wheel disc (avoids hydration trig issues)
// const SPOKE_COORDS = [0, 45, 90, 135].map((a) => {
//   const rad = (a * Math.PI) / 180;
//   return {
//     x1: +(80 + 40 * Math.cos(rad)).toFixed(2),
//     y1: +(150 + 6 * Math.sin(rad)).toFixed(2),
//     x2: +(80 - 40 * Math.cos(rad)).toFixed(2),
//     y2: +(150 - 6 * Math.sin(rad)).toFixed(2),
//   };
// });



// // Pre-computed clay shape paths at different "throwing" stages
// // Stage 0: flat lump → Stage 1: tall cylinder → Stage 2: bowl opening → Stage 3: finished pot
// const CLAY_PATHS = [
//   // Stage 0 — raw lump on wheel
//   "M35 130 Q20 125 18 115 Q16 100 28 92 Q40 84 60 84 Q80 84 92 92 Q104 100 102 115 Q100 125 85 130 Q72 134 60 134 Q48 134 35 130Z",
//   // Stage 1 — hands pulling up, tall cylinder
//   "M42 130 Q30 128 28 118 Q26 100 30 75 Q34 55 60 52 Q86 55 90 75 Q94 100 92 118 Q90 128 78 130 Q68 133 60 133 Q52 133 42 130Z",
//   // Stage 2 — opening the belly, classic pot shape forming
//   "M32 132 Q18 126 20 110 Q22 88 28 68 Q36 44 60 42 Q84 44 92 68 Q98 88 100 110 Q102 126 88 132 Q74 138 60 138 Q46 138 32 132Z",
//   // Stage 3 — finished pot with neck
//   "M38 136 Q22 128 24 112 Q26 92 30 70 Q38 44 60 40 Q82 44 90 70 Q94 92 96 112 Q98 128 82 136 Q70 142 60 142 Q50 142 38 136Z",
// ];

// const NECK_PATHS = [
//   "M46 84 Q50 80 60 80 Q70 80 74 84",        // stage 0 — no neck
//   "M44 52 Q50 46 60 44 Q70 46 76 52",        // stage 1
//   "M42 42 Q50 34 60 32 Q70 34 78 42",        // stage 2
//   "M46 40 Q52 32 60 30 Q68 32 74 40",        // stage 3
// ];

// export function PotteryWheel({ size = 320, className = "" }: { size?: number; className?: string }) {
//   const [stage, setStage] = useState(0);
//   const [angle, setAngle] = useState(0);
//   const [splashDots, setSplashDots] = useState<{ x: number; y: number; r: number }[]>([]);

//   useEffect(() => {
//     // Wheel rotation — 60fps-ish
//     let raf: number;
//     let lastTime = 0;
//     const rotate = (time: number) => {
//       if (time - lastTime > 16) {
//         setAngle((a) => (a + 1.8) % 360);
//         lastTime = time;
//       }
//       raf = requestAnimationFrame(rotate);
//     };
//     raf = requestAnimationFrame(rotate);

//     // Clay stage progression
//     const stageTimer = setInterval(() => {
//       setStage((s) => (s + 1) % CLAY_PATHS.length);
//     }, 2400);

//     // Random clay splash dots
//     const splashTimer = setInterval(() => {
//       setSplashDots(
//         Array.from({ length: 5 }, () => ({
//           x: 35 + Math.round(Math.random() * 50),
//           y: 140 + Math.round(Math.random() * 20),
//           r: 1 + Math.round(Math.random() * 3),
//         }))
//       );
//     }, 800);

//     return () => {
//       cancelAnimationFrame(raf);
//       clearInterval(stageTimer);
//       clearInterval(splashTimer);
//     };
//   }, []);

//   const vb = 160; // viewBox size

//   return (
//     <svg
//       viewBox={`0 0 ${vb} ${vb}`}
//       width={size}
//       height={size}
//       className={className}
//       aria-hidden="true"
//     >
//       {/* Wooden table surface */}
//       <ellipse cx="80" cy="148" rx="68" ry="10" fill="#c49a6c" opacity="0.18" />

//       {/* Wheel base / shadow */}
//       <ellipse cx="80" cy="152" rx="52" ry="7" fill="#3a322c" opacity="0.08" />

//       {/* Spinning wheel disc */}
//       <g transform={`rotate(${angle}, 80, 150)`}>
//         <ellipse cx="80" cy="150" rx="46" ry="7" fill="#8a6240" opacity="0.22" />
//         {/* Wheel spokes — pre-computed coords */}
//         {SPOKE_COORDS.map((s, i) => (
//           <line key={i}
//             x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
//             stroke="#8a6240" strokeWidth="1.5" opacity="0.30"
//           />
//         ))}
//         <ellipse cx="80" cy="150" rx="6" ry="3" fill="#6b4e2e" opacity="0.45" />
//       </g>

//       {/* Clay body — morphs between stages */}
//       <path
//         d={CLAY_PATHS[stage].replace(/(\d+)/g, (n) => String(+n / 1.5 + 6))}
//         fill="#b85c38"
//         opacity="0.72"
//         style={{ transition: "d 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
//       />
//       {/* Clay highlight */}
//       <path
//         d={CLAY_PATHS[stage].replace(/(\d+)/g, (n) => String(+n / 1.5 + 6))}
//         fill="none"
//         stroke="#faf6f0"
//         strokeWidth="1"
//         opacity="0.20"
//         style={{ transition: "d 0.8s cubic-bezier(0.34,1.56,0.64,1)" }}
//       />

//       {/* Potter's hands — two curved shapes pressing in */}
//       <path d="M22 78 Q18 72 22 68 Q28 64 34 70 Q38 74 36 80" fill="#c49a6c" opacity="0.55" />
//       <path d="M98 78 Q102 72 98 68 Q92 64 86 70 Q82 74 84 80" fill="#c49a6c" opacity="0.55" />

//       {/* Clay splash dots */}
//       {splashDots.map((d, i) => (
//         <circle key={i}
//           cx={+(d.x / 1.5 + 6).toFixed(1)}
//           cy={+(d.y / 1.5 + 6).toFixed(1)}
//           r={d.r * 0.6}
//           fill="#b85c38" opacity="0.25"
//         />
//       ))}

//       {/* Studio ambience — background scratch marks */}
//       <line x1="8" y1="30" x2="14" y2="32" stroke="#c49a6c" strokeWidth="0.8" opacity="0.15" />
//       <line x1="10" y1="36" x2="16" y2="37" stroke="#c49a6c" strokeWidth="0.8" opacity="0.12" />
//       <line x1="130" y1="28" x2="136" y2="30" stroke="#c49a6c" strokeWidth="0.8" opacity="0.15" />
//     </svg>
//   );
// }


"use client";

import { useEffect, useState, useRef } from "react";

// ── Pre-computed constants — no runtime trig, no hydration mismatch ──

// Wheel disc: 8 spokes radiating from centre (cx=200,cy=340) radius 90
// Top-down perspective: x-radius 90, y-radius 18 (flat ellipse)
const WHEEL_SPOKES = [0,22.5,45,67.5,90,112.5,135,157.5].map((a) => {
  const rad = (a * Math.PI) / 180;
  return {
    x1: +(200 + 90 * Math.cos(rad)).toFixed(2),
    y1: +(340 + 18 * Math.sin(rad)).toFixed(2),
    x2: +(200 - 90 * Math.cos(rad)).toFixed(2),
    y2: +(340 - 18 * Math.sin(rad)).toFixed(2),
  };
});

// Wheel rim ring points — for decorative concentric rings
const RING_RADII = [90, 65, 40, 14];

// ── Clay shapes at 5 stages of throwing ──
// ViewBox 400×480. Wheel sits at bottom (y≈300-360). Clay grows upward.
// Each path is a closed shape — left side, up, right side, back down.
// These are carefully hand-tuned quadratic bezier paths.
const STAGES = [
  {
    // Stage 0 — wet lump just centered on wheel, wide and low
    clay: "M128 318 Q90 312 88 298 Q86 282 108 272 Q140 260 200 258 Q260 260 292 272 Q314 282 312 298 Q310 312 272 318 Q236 324 200 324 Q164 324 128 318Z",
    neck: null,
    label: "Centering clay…",
    highlight: "M148 280 Q180 270 220 272 Q240 274 252 280",
  },
  {
    // Stage 1 — hands pulling up, tall cylinder forming
    clay: "M158 318 Q140 314 138 296 Q136 268 144 232 Q152 196 176 184 Q190 178 200 177 Q210 178 224 184 Q248 196 256 232 Q264 268 262 296 Q260 314 242 318 Q222 324 200 324 Q178 324 158 318Z",
    neck: null,
    label: "Opening up…",
    highlight: "M166 220 Q190 208 220 210 Q234 212 244 220",
  },
  {
    // Stage 2 — belly opening, classic vase silhouette
    clay: "M140 318 Q108 308 110 288 Q112 260 122 224 Q134 184 162 164 Q180 152 200 150 Q220 152 238 164 Q266 184 278 224 Q288 260 290 288 Q292 308 260 318 Q232 326 200 326 Q168 326 140 318Z",
    neck: "M172 150 Q186 138 200 136 Q214 138 228 150",
    label: "Shaping belly…",
    highlight: "M150 230 Q178 210 214 212 Q240 214 258 226",
  },
  {
    // Stage 3 — neck being pulled up, finished pot form
    clay: "M148 318 Q116 306 118 282 Q120 248 132 210 Q148 166 174 146 Q186 138 200 136 Q214 138 226 146 Q252 166 268 210 Q280 248 282 282 Q284 306 252 318 Q228 326 200 326 Q172 326 148 318Z",
    neck: "M176 136 Q188 118 200 114 Q212 118 224 136",
    label: "Forming neck…",
    highlight: "M156 228 Q182 206 218 208 Q244 210 262 224",
  },
  {
    // Stage 4 — complete pot, opening at top
    clay: "M152 318 Q118 304 120 278 Q122 240 136 200 Q154 154 180 136 Q190 128 200 126 Q210 128 220 136 Q246 154 264 200 Q278 240 280 278 Q282 304 248 318 Q226 328 200 328 Q174 328 152 318Z",
    neck: "M180 126 Q190 108 200 104 Q210 108 220 126",
    label: "Finished!",
    highlight: "M160 224 Q184 200 218 202 Q246 204 264 220",
  },
];

// Water/slip droplets — pre-placed, animated with CSS
const DROPLETS = [
  { cx: 118, cy: 308, r: 3.5 },
  { cx: 282, cy: 302, r: 2.5 },
  { cx: 108, cy: 288, r: 2 },
  { cx: 294, cy: 284, r: 3 },
  { cx: 124, cy: 330, r: 2 },
  { cx: 276, cy: 328, r: 2.5 },
];

export function PotteryWheel({ size = 340, className = "" }: { size?: number; className?: string }) {
  const [stage, setStage] = useState(0);
  const [angle, setAngle] = useState(0);
  const [dropletOpacity, setDropletOpacity] = useState(0.15);
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    // Smooth wheel rotation via rAF
    const rotate = (time: number) => {
      if (time - lastTimeRef.current > 14) {
        setAngle((a) => (a + 1.4) % 360);
        lastTimeRef.current = time;
      }
      rafRef.current = requestAnimationFrame(rotate);
    };
    rafRef.current = requestAnimationFrame(rotate);

    // Stage cycle — 3 seconds per stage
    const stageTimer = setInterval(() => {
      setStage((s) => (s + 1) % STAGES.length);
    }, 3000);

    // Droplet pulse
    const dropTimer = setInterval(() => {
      setDropletOpacity((o) => (o === 0.15 ? 0.32 : 0.15));
    }, 900);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearInterval(stageTimer);
      clearInterval(dropTimer);
    };
  }, []);

  const s = STAGES[stage];

  return (
    <svg
      viewBox="0 0 400 480"
      width={size}
      height={size * 1.2}
      className={className}
      aria-hidden="true"
      style={{ overflow: "visible" }}
    >
      <defs>
        {/* Clay gradient — warm terracotta with depth */}
        <radialGradient id="clayGrad" cx="40%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#d4784a" />
          <stop offset="45%" stopColor="#b85c38" />
          <stop offset="100%" stopColor="#7a3820" />
        </radialGradient>

        {/* Wet clay shine */}
        <radialGradient id="shineGrad" cx="35%" cy="25%" r="55%">
          <stop offset="0%" stopColor="#faf6f0" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#faf6f0" stopOpacity="0" />
        </radialGradient>

        {/* Wheel disc gradient */}
        <radialGradient id="wheelGrad" cx="50%" cy="30%" r="60%">
          <stop offset="0%" stopColor="#c49a6c" />
          <stop offset="60%" stopColor="#8a6240" />
          <stop offset="100%" stopColor="#5a3e28" />
        </radialGradient>

        {/* Table surface */}
        <radialGradient id="tableGrad" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#d4b896" />
          <stop offset="100%" stopColor="#a07850" />
        </radialGradient>

        {/* Drop shadow filter */}
        <filter id="clayShadow" x="-20%" y="-20%" width="140%" height="160%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#3a1a0a" floodOpacity="0.35" />
        </filter>

        {/* Wheel shadow */}
        <filter id="wheelShadow" x="-10%" y="-30%" width="120%" height="180%">
          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#1a0a00" floodOpacity="0.5" />
        </filter>

        {/* Glow for wet clay */}
        <filter id="wetGlow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── TABLE SURFACE ── */}
      <ellipse cx="200" cy="368" rx="160" ry="22" fill="url(#tableGrad)" opacity="0.35" />
      <ellipse cx="200" cy="372" rx="140" ry="14" fill="#3a1a0a" opacity="0.18" />

      {/* ── SPINNING WHEEL DISC ── */}
      <g transform={`rotate(${angle}, 200, 340)`} filter="url(#wheelShadow)">
        {/* Main disc ellipse */}
        <ellipse cx="200" cy="340" rx="108" ry="22" fill="url(#wheelGrad)" />

        {/* Concentric rings on wheel */}
        {RING_RADII.map((r, i) => (
          <ellipse key={i} cx="200" cy="340" rx={r} ry={r * 0.204}
            fill="none" stroke="#5a3e28" strokeWidth={i === 0 ? 2 : 1}
            opacity={0.50 - i * 0.08} />
        ))}

        {/* Spokes */}
        {WHEEL_SPOKES.map((sp, i) => (
          <line key={i} x1={sp.x1} y1={sp.y1} x2={sp.x2} y2={sp.y2}
            stroke="#6b4828" strokeWidth="1.8" opacity="0.55" />
        ))}

        {/* Centre hub */}
        <ellipse cx="200" cy="340" rx="14" ry="3" fill="#3a2010" />
        <ellipse cx="200" cy="340" rx="8" ry="1.8" fill="#6b4828" />
        <circle cx="200" cy="340" r="4" fill="#8a6040" />
      </g>

      {/* ── CLAY BODY ── morphs between throwing stages */}
      <g filter="url(#clayShadow)">
        <path
          d={s.clay}
          fill="url(#clayGrad)"
          style={{ transition: "d 1.1s cubic-bezier(0.34,1.2,0.64,1)" }}
        />
        {/* Wet shine overlay */}
        <path
          d={s.clay}
          fill="url(#shineGrad)"
          style={{ transition: "d 1.1s cubic-bezier(0.34,1.2,0.64,1)" }}
        />
        {/* Throwing rings — horizontal lines on clay surface */}
        <path
          d={s.highlight}
          fill="none" stroke="#faf6f0" strokeWidth="1.5"
          strokeLinecap="round" opacity="0.22"
          style={{ transition: "d 1.1s cubic-bezier(0.34,1.2,0.64,1)" }}
        />
      </g>

      {/* ── NECK / RIM (stages 2–4) ── */}
      {s.neck && (
        <path d={s.neck} fill="none" stroke="#c49a6c" strokeWidth="2.5"
          strokeLinecap="round" opacity="0.45"
          style={{ transition: "d 1.1s ease" }} />
      )}

      {/* ── WATER DROPLETS ── pulse gently */}
      {DROPLETS.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r}
          fill="#6ab8d4" opacity={dropletOpacity}
          style={{ transition: "opacity 0.9s ease" }} />
      ))}

      {/* ── POTTER'S HANDS ── left and right, pressing clay */}
      {/* Left hand — 4 fingers curving around clay */}
      <g opacity="0.72">
        <path d="M104 272 Q86 258 90 240 Q94 224 110 228 Q118 230 120 244 Q122 254 116 262 Q112 268 110 276"
          fill="#c4946a" stroke="#a07040" strokeWidth="0.8" />
        {/* Finger lines */}
        <path d="M92 248 Q96 238 106 238" stroke="#8a5c38" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M90 256 Q94 248 104 250" stroke="#8a5c38" strokeWidth="0.8" fill="none" opacity="0.5" />
        {/* Thumb */}
        <path d="M116 270 Q100 280 96 298 Q94 310 102 314"
          fill="#c4946a" stroke="#a07040" strokeWidth="0.8" />
        {/* Clay on hands */}
        <path d="M108 260 Q112 256 118 258 Q120 262 116 268"
          fill="#b85c38" opacity="0.3" />
      </g>

      {/* Right hand */}
      <g opacity="0.72">
        <path d="M296 272 Q314 258 310 240 Q306 224 290 228 Q282 230 280 244 Q278 254 284 262 Q288 268 290 276"
          fill="#c4946a" stroke="#a07040" strokeWidth="0.8" />
        {/* Finger lines */}
        <path d="M308 248 Q304 238 294 238" stroke="#8a5c38" strokeWidth="0.8" fill="none" opacity="0.5" />
        <path d="M310 256 Q306 248 296 250" stroke="#8a5c38" strokeWidth="0.8" fill="none" opacity="0.5" />
        {/* Thumb */}
        <path d="M284 270 Q300 280 304 298 Q306 310 298 314"
          fill="#c4946a" stroke="#a07040" strokeWidth="0.8" />
        {/* Clay on hands */}
        <path d="M292 260 Q288 256 282 258 Q280 262 284 268"
          fill="#b85c38" opacity="0.3" />
      </g>

      {/* ── STAGE LABEL — bottom centre ── */}
      <text x="200" y="430" textAnchor="middle"
        fontSize="13" fontFamily="'Cormorant Garamond', Georgia, serif"
        fontStyle="italic" fill="#c49a6c" opacity="0.55"
        style={{ transition: "opacity 0.5s ease" }}>
        {s.label}
      </text>

      {/* ── AMBIENT STUDIO DETAILS ── */}
      {/* Clay smear marks on table */}
      <path d="M88 356 Q96 352 108 354" stroke="#b85c38" strokeWidth="1.5" fill="none" opacity="0.12" strokeLinecap="round" />
      <path d="M292 358 Q302 354 312 356" stroke="#b85c38" strokeWidth="1.5" fill="none" opacity="0.10" strokeLinecap="round" />
      <path d="M156 366 Q172 362 188 364" stroke="#b85c38" strokeWidth="1" fill="none" opacity="0.08" strokeLinecap="round" />
    </svg>
  );
}