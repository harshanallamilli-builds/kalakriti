// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { PotteryWheel } from "@/components/home/PotteryWheel";
// import type { Profile } from "@/lib/types";

// // Pre-computed trig — identical on server & client, avoids hydration mismatch
// const BG_SPOKES = [0, 60, 120, 180, 240, 300].map((a) => {
//   const rad = (a * Math.PI) / 180;
//   return {
//     x1: +(44 + 20 * Math.cos(rad)).toFixed(2),
//     y1: +(44 + 20 * Math.sin(rad)).toFixed(2),
//     x2: +(44 + 30 * Math.cos(rad)).toFixed(2),
//     y2: +(44 + 30 * Math.sin(rad)).toFixed(2),
//   };
// });

// type Props = { profile: Profile | null };

// export function Hero({ profile }: Props) {
//   const firstName = profile?.full_name?.split(" ")[0];
//   const [visible, setVisible] = useState(false);
//   const [drawn, setDrawn] = useState(false);

//   useEffect(() => {
//     const t1 = setTimeout(() => setVisible(true), 60);
//     const t2 = setTimeout(() => setDrawn(true), 480);
//     return () => { clearTimeout(t1); clearTimeout(t2); };
//   }, []);

//   return (
//     <section className="relative overflow-hidden bg-cream">
//       <div className="grain-overlay pointer-events-none absolute inset-0 opacity-60" />

//       {/* Ambient glows */}
//       <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full"
//         style={{ background: "radial-gradient(circle, rgba(212,146,10,0.13) 0%, transparent 68%)" }} />
//       <div className="pointer-events-none absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full"
//         style={{ background: "radial-gradient(circle, rgba(184,92,56,0.10) 0%, transparent 65%)" }} />

//       {/* ── MOBILE BACKGROUND LAYER — floating craft SVGs behind text ── */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden md:hidden" aria-hidden="true">
//         {/* Pottery pot — drifts top-right */}
//         <div className="animate-float-slow absolute -right-8 -top-6 opacity-[0.08]" style={{ width: 210, height: 270 }}>
//           <svg viewBox="0 0 120 190" className="h-full w-full" fill="none">
//             <ellipse cx="60" cy="174" rx="36" ry="8" fill="#b85c38" />
//             <path d="M29 102 Q20 128 26 156 Q37 174 60 174 Q83 174 94 156 Q100 128 91 102Z" fill="#b85c38" />
//             <path d="M38 102 Q32 76 39 54 Q49 28 60 26 Q71 28 81 54 Q88 76 82 102Z" fill="#d4920a" />
//             <path d="M43 52 Q52 38 60 36 Q68 38 77 52" stroke="#b85c38" strokeWidth="3" fill="none" />
//             {[116, 136, 154].map((y, i) => (
//               <path key={i} d={`M${34 - i * 2} ${y} Q52 ${y - 5} 60 ${y - 4} Q68 ${y - 5} ${86 + i * 2} ${y}`}
//                 stroke="#b85c38" strokeWidth="2" fill="none" />
//             ))}
//           </svg>
//         </div>

//         {/* Weave grid — centre left */}
//         <div className="animate-float-medium absolute -left-4 top-[38%] opacity-[0.06]" style={{ width: 150, height: 150 }}>
//           <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
//             {[1,2,3,4,5].map(i => (
//               <line key={i} x1={i*15} y1="0" x2={i*15} y2="88" stroke="#d4920a" strokeWidth="3" />
//             ))}
//             {[1,2,3,4,5,6].map(i => (
//               <line key={i} x1="0" y1={i*13} x2="88" y2={i*13} stroke="#b85c38" strokeWidth={i%2===0?3:1.5} />
//             ))}
//           </svg>
//         </div>

//         {/* Metal mandala — spins bottom-right */}
//         <div className="animate-spin-slow absolute -bottom-12 -right-12 opacity-[0.07]" style={{ width: 200, height: 200 }}>
//           <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
//             {[30, 20, 11].map((r, i) => (
//               <circle key={i} cx="44" cy="44" r={r} stroke="#6b8f71" strokeWidth={i===0?2.5:1.8} />
//             ))}
//             {BG_SPOKES.map((s, i) => (
//               <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#6b8f71" strokeWidth="3" />
//             ))}
//             <circle cx="44" cy="44" r="5" fill="#4a6b52" />
//           </svg>
//         </div>

//         {/* Dot cluster */}
//         <div className="animate-float-fast absolute left-[45%] top-16 opacity-[0.05]" style={{ width: 70 }}>
//           <svg viewBox="0 0 60 60" className="h-full w-full" fill="none">
//             {[0,1,2].flatMap(row => [0,1,2].map(col => (
//               <circle key={`${row}-${col}`} cx={10+col*20} cy={10+row*20} r="3" fill="#b85c38" />
//             )))}
//           </svg>
//         </div>

//         {/* Leaf — lower left */}
//         <div className="animate-float-medium absolute bottom-10 left-6 opacity-[0.05]"
//           style={{ width: 90, height: 90, animationDelay: "1.5s" }}>
//           <svg viewBox="0 0 80 80" className="h-full w-full" fill="none">
//             <path d="M40 10 Q65 25 65 40 Q65 58 40 70 Q15 58 15 40 Q15 25 40 10Z"
//               stroke="#6b8f71" strokeWidth="2" fill="rgba(107,143,113,0.15)" />
//             <path d="M40 10 Q40 40 40 70" stroke="#6b8f71" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
//           </svg>
//         </div>
//       </div>

//       {/* ── DESKTOP AMBIENT LAYER — floats in empty space beside content ── */}
//       <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden="true">
//         {/* Top-left weave */}
//         <div className="animate-float-slow absolute -left-16 top-10 opacity-[0.04]" style={{ width: 200, height: 200 }}>
//           <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
//             {[1,2,3,4,5].map(i => (
//               <line key={i} x1={i*15} y1="0" x2={i*15} y2="88" stroke="#d4920a" strokeWidth="2.5" />
//             ))}
//             {[1,2,3,4,5,6].map(i => (
//               <line key={i} x1="0" y1={i*13} x2="88" y2={i*13} stroke="#b85c38" strokeWidth={i%2===0?2.5:1.2} />
//             ))}
//           </svg>
//         </div>

//         {/* Mid-left slow mandala */}
//         <div className="animate-spin-slow absolute left-4 top-1/2 -translate-y-1/2 opacity-[0.035]"
//           style={{ width: 160, height: 160, animationDuration: "28s" }}>
//           <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
//             {[30, 20, 11].map((r, i) => (
//               <circle key={i} cx="44" cy="44" r={r} stroke="#6b8f71" strokeWidth={i===0?2:1.5} />
//             ))}
//             {BG_SPOKES.map((s, i) => (
//               <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#6b8f71" strokeWidth="2" />
//             ))}
//           </svg>
//         </div>

//         {/* Bottom-left leaf */}
//         <div className="animate-float-medium absolute bottom-16 left-20 opacity-[0.04]" style={{ width: 100 }}>
//           <svg viewBox="0 0 80 80" className="h-full w-full" fill="none">
//             <path d="M40 8 Q66 22 66 40 Q66 60 40 72 Q14 60 14 40 Q14 22 40 8Z"
//               stroke="#6b8f71" strokeWidth="1.5" fill="rgba(107,143,113,0.10)" />
//             <path d="M40 8 Q40 40 40 72" stroke="#6b8f71" strokeWidth="1" fill="none" strokeDasharray="3 4" />
//           </svg>
//         </div>

//         {/* Dot grid top-centre */}
//         <div className="animate-float-fast absolute left-1/2 top-12 -translate-x-1/2 opacity-[0.03]"
//           style={{ width: 120, animationDelay: "0.8s" }}>
//           <svg viewBox="0 0 100 40" className="h-full w-full" fill="none">
//             {[0,1,2,3,4].flatMap(col => [0,1].map(row => (
//               <circle key={`${col}-${row}`} cx={10+col*20} cy={10+row*20} r="2.5" fill="#b85c38" />
//             )))}
//           </svg>
//         </div>
//       </div>

//       {/* ── MAIN CONTENT ── */}
//       <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
//         <div className="flex flex-col gap-10 py-12 md:grid md:min-h-[84vh] md:grid-cols-[1fr_420px] md:items-center md:gap-16 md:py-0 lg:grid-cols-[1fr_460px]">

//           {/* ── TEXT — order-1, always top on mobile ── */}
//           <div className="relative order-1 z-10">

//             <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/8 px-4 py-1.5"
//               style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "all 0.7s ease" }}>
//               <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
//               <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-saffron">Handmade India</span>
//             </div>

//             <h1 className="font-heading text-[2.75rem] font-medium leading-[1.04] text-charcoal sm:text-[3.5rem] lg:text-[4rem]">
//               {profile ? (
//                 <>
//                   <Word delay={80} v={visible}>Welcome</Word>{" "}
//                   <Word delay={160} v={visible}>back,</Word>
//                   <br />
//                   <Word delay={260} v={visible} col="text-terracotta">{firstName} 🙏</Word>
//                 </>
//               ) : (
//                 <>
//                   <Word delay={80} v={visible}>Where</Word>{" "}
//                   <Word delay={155} v={visible}>every</Word>{" "}
//                   <Word delay={230} v={visible}>piece</Word>
//                   <br />
//                   <Word delay={330} v={visible} col="text-terracotta">carries a story</Word>
//                 </>
//               )}
//             </h1>

//             <p className="mt-5 max-w-[440px] text-[15.5px] leading-relaxed text-warm-gray md:text-[17px]"
//               style={{ opacity: visible ? 1 : 0, transitionDelay: "430ms", transform: visible ? "none" : "translateY(8px)", transition: "all 0.7s ease" }}>
//               {profile
//                 ? "Fresh pieces from India's finest artisans — pottery, weaving, brass, woodwork. Every one made by real hands."
//                 : "Direct from Indian artisan studios — pottery, weaving, woodwork, metal craft. Real makers, no middlemen, straight to your home."}
//             </p>

//             <div className="mt-8 flex flex-wrap gap-3"
//               style={{ opacity: visible ? 1 : 0, transitionDelay: "530ms", transform: visible ? "none" : "translateY(8px)", transition: "all 0.7s ease" }}>
//               {profile ? (
//                 <>
//                   <DarkBtn href="/marketplace">Browse marketplace</DarkBtn>
//                   <OutlineBtn href={profile.role === "creator" ? "/dashboard/creator" : "/creators"}>
//                     {profile.role === "creator" ? "My Studio →" : "Meet artisans"}
//                   </OutlineBtn>
//                 </>
//               ) : (
//                 <>
//                   <ClayBtn href="/marketplace">Explore marketplace</ClayBtn>
//                   <OutlineBtn href="/auth/signup">Join free</OutlineBtn>
//                 </>
//               )}
//             </div>

//             <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-linen/70 pt-7"
//               style={{ opacity: visible ? 1 : 0, transitionDelay: "650ms", transition: "all 0.7s ease" }}>
//               {[
//                 { icon: "🏺", label: "10+ craft types" },
//                 { icon: "📍", label: "Across India" },
//                 { icon: "💬", label: "Direct messaging" },
//               ].map(({ icon, label }) => (
//                 <div key={label} className="flex items-center gap-1.5">
//                   <span className="text-sm">{icon}</span>
//                   <span className="text-[12.5px] font-medium text-warm-gray">{label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── POTTERY WHEEL CARD — desktop only ── */}
//           <div className="hidden md:order-2 md:flex md:items-center md:justify-center"
//             style={{ opacity: drawn ? 1 : 0, transform: drawn ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
//             <div className="relative flex items-center justify-center">

//               {/* Outer glow */}
//               <div className="absolute h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
//                 style={{ background: "radial-gradient(circle, rgba(184,92,56,0.6) 0%, transparent 70%)" }} />

//               {/* Studio card */}
//               <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.50)]"
//                 style={{ width: 380, height: 420, background: "linear-gradient(148deg,#2a1f19,#1a1208)" }}>
//                 <div className="grain-overlay absolute inset-0 opacity-100" />

//                 {/* Studio header */}
//                 <div className="relative flex items-center justify-between px-6 pt-5">
//                   <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-saffron/70">Live studio</span>
//                   <span className="flex items-center gap-1.5">
//                     <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage" />
//                     <span className="text-[9px] font-medium text-cream/30">Wheel spinning</span>
//                   </span>
//                 </div>

//                 {/* Pottery wheel */}
//                 <div className="relative flex items-center justify-center" style={{ height: 300 }}>
//                   <PotteryWheel size={300} />
//                 </div>

//                 {/* Quote at bottom */}
//                 <div className="relative border-t border-white/8 px-6 pb-6 pt-4">
//                   <p className="font-heading text-[1.05rem] italic leading-snug text-cream/65">
//                     "Every pot begins as silence."
//                   </p>
//                   <p className="mt-1 text-[10px] font-medium text-cream/28">— A Kalakriti artisan</p>
//                 </div>
//               </div>

//               {/* Floating ₹ badge */}
//               <div className="absolute -right-4 top-12 rounded-2xl border border-white/8 bg-espresso/95 px-4 py-3 shadow-xl backdrop-blur-sm"
//                 style={{ opacity: drawn ? 1 : 0, transform: drawn ? "translateX(0)" : "translateX(12px)", transition: "all 0.7s ease 1.1s" }}>
//                 <p className="text-[9px] font-medium uppercase tracking-wider text-cream/40">Priced in</p>
//                 <p className="mt-0.5 font-heading text-[1.3rem] font-medium text-terracotta">₹ INR</p>
//               </div>

//               {/* Floating crafts badge */}
//               <div className="absolute -left-4 bottom-16 rounded-2xl border border-white/8 bg-espresso/95 px-4 py-3 shadow-xl backdrop-blur-sm"
//                 style={{ opacity: drawn ? 1 : 0, transform: drawn ? "translateX(0)" : "translateX(-12px)", transition: "all 0.7s ease 1.2s" }}>
//                 <p className="text-[9px] font-medium uppercase tracking-wider text-cream/40">Across India</p>
//                 <p className="mt-0.5 font-heading text-[1.3rem] font-medium text-sage">10+ crafts</p>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

// /* ── Helpers ── */
// function Word({ children, delay, v, col = "" }: {
//   children: React.ReactNode; delay: number; v: boolean; col?: string;
// }) {
//   return (
//     <span
//       className={`inline-block ${col}`}
//       style={{
//         opacity: v ? 1 : 0,
//         transform: v ? "translateY(0)" : "translateY(16px)",
//         transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
//       }}
//     >
//       {children}
//     </span>
//   );
// }

// function DarkBtn({ href, children }: { href: string; children: React.ReactNode }) {
//   return (
//     <Link href={href}
//       className="group relative overflow-hidden rounded-full bg-charcoal px-7 py-3.5 text-[14px] font-semibold tracking-wide text-cream shadow-[0_4px_20px_rgba(58,50,44,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(58,50,44,0.30)] active:scale-[0.98]">
//       <span className="relative z-10">{children}</span>
//       <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
//     </Link>
//   );
// }

// function ClayBtn({ href, children }: { href: string; children: React.ReactNode }) {
//   return (
//     <Link href={href}
//       className="group relative overflow-hidden rounded-full bg-gradient-to-b from-terracotta to-[#a34e2d] px-7 py-3.5 text-[14px] font-semibold tracking-wide text-cream shadow-[0_4px_20px_rgba(184,92,56,0.32)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(184,92,56,0.42)] active:scale-[0.98]">
//       <span className="relative z-10">{children}</span>
//       <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
//     </Link>
//   );
// }

// function OutlineBtn({ href, children }: { href: string; children: React.ReactNode }) {
//   return (
//     <Link href={href}
//       className="rounded-full border border-linen bg-cream px-7 py-3.5 text-[14px] font-semibold text-charcoal shadow-[0_2px_8px_rgba(58,50,44,0.06)] transition-all duration-200 hover:border-clay/40 hover:bg-sand active:scale-[0.98]">
//       {children}
//     </Link>
//   );
// }


// "use client";

// import Link from "next/link";
// import { useEffect, useState } from "react";
// import { PotteryWheel } from "@/components/home/PotteryWheel";
// import type { Profile } from "@/lib/types";

// // Pre-computed trig — identical on server & client, avoids hydration mismatch
// const BG_SPOKES = [0, 60, 120, 180, 240, 300].map((a) => {
//   const rad = (a * Math.PI) / 180;
//   return {
//     x1: +(44 + 20 * Math.cos(rad)).toFixed(2),
//     y1: +(44 + 20 * Math.sin(rad)).toFixed(2),
//     x2: +(44 + 30 * Math.cos(rad)).toFixed(2),
//     y2: +(44 + 30 * Math.sin(rad)).toFixed(2),
//   };
// });

// type Props = { profile: Profile | null };

// export function Hero({ profile }: Props) {
//   const firstName = profile?.full_name?.split(" ")[0];
//   const [visible, setVisible] = useState(false);
//   const [drawn, setDrawn] = useState(false);

//   useEffect(() => {
//     const t1 = setTimeout(() => setVisible(true), 60);
//     const t2 = setTimeout(() => setDrawn(true), 480);
//     return () => { clearTimeout(t1); clearTimeout(t2); };
//   }, []);

//   return (
//     <section className="relative overflow-hidden bg-cream">
//       <div className="grain-overlay pointer-events-none absolute inset-0 opacity-60" />

//       {/* Ambient glows */}
//       <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full"
//         style={{ background: "radial-gradient(circle, rgba(212,146,10,0.13) 0%, transparent 68%)" }} />
//       <div className="pointer-events-none absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full"
//         style={{ background: "radial-gradient(circle, rgba(184,92,56,0.10) 0%, transparent 65%)" }} />

//       {/* ── MOBILE BACKGROUND LAYER — floating craft SVGs behind text ── */}
//       <div className="pointer-events-none absolute inset-0 overflow-hidden md:hidden" aria-hidden="true">
//         {/* Pottery pot — drifts top-right */}
//         <div className="animate-float-slow absolute -right-8 -top-6 opacity-[0.08]" style={{ width: 210, height: 270 }}>
//           <svg viewBox="0 0 120 190" className="h-full w-full" fill="none">
//             <ellipse cx="60" cy="174" rx="36" ry="8" fill="#b85c38" />
//             <path d="M29 102 Q20 128 26 156 Q37 174 60 174 Q83 174 94 156 Q100 128 91 102Z" fill="#b85c38" />
//             <path d="M38 102 Q32 76 39 54 Q49 28 60 26 Q71 28 81 54 Q88 76 82 102Z" fill="#d4920a" />
//             <path d="M43 52 Q52 38 60 36 Q68 38 77 52" stroke="#b85c38" strokeWidth="3" fill="none" />
//             {[116, 136, 154].map((y, i) => (
//               <path key={i} d={`M${34 - i * 2} ${y} Q52 ${y - 5} 60 ${y - 4} Q68 ${y - 5} ${86 + i * 2} ${y}`}
//                 stroke="#b85c38" strokeWidth="2" fill="none" />
//             ))}
//           </svg>
//         </div>

//         {/* Weave grid — centre left */}
//         <div className="animate-float-medium absolute -left-4 top-[38%] opacity-[0.06]" style={{ width: 150, height: 150 }}>
//           <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
//             {[1,2,3,4,5].map(i => (
//               <line key={i} x1={i*15} y1="0" x2={i*15} y2="88" stroke="#d4920a" strokeWidth="3" />
//             ))}
//             {[1,2,3,4,5,6].map(i => (
//               <line key={i} x1="0" y1={i*13} x2="88" y2={i*13} stroke="#b85c38" strokeWidth={i%2===0?3:1.5} />
//             ))}
//           </svg>
//         </div>

//         {/* Metal mandala — spins bottom-right */}
//         <div className="animate-spin-slow absolute -bottom-12 -right-12 opacity-[0.07]" style={{ width: 200, height: 200 }}>
//           <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
//             {[30, 20, 11].map((r, i) => (
//               <circle key={i} cx="44" cy="44" r={r} stroke="#6b8f71" strokeWidth={i===0?2.5:1.8} />
//             ))}
//             {BG_SPOKES.map((s, i) => (
//               <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#6b8f71" strokeWidth="3" />
//             ))}
//             <circle cx="44" cy="44" r="5" fill="#4a6b52" />
//           </svg>
//         </div>

//         {/* Dot cluster */}
//         <div className="animate-float-fast absolute left-[45%] top-16 opacity-[0.05]" style={{ width: 70 }}>
//           <svg viewBox="0 0 60 60" className="h-full w-full" fill="none">
//             {[0,1,2].flatMap(row => [0,1,2].map(col => (
//               <circle key={`${row}-${col}`} cx={10+col*20} cy={10+row*20} r="3" fill="#b85c38" />
//             )))}
//           </svg>
//         </div>

//         {/* Leaf — lower left */}
//         <div className="animate-float-medium absolute bottom-10 left-6 opacity-[0.05]"
//           style={{ width: 90, height: 90, animationDelay: "1.5s" }}>
//           <svg viewBox="0 0 80 80" className="h-full w-full" fill="none">
//             <path d="M40 10 Q65 25 65 40 Q65 58 40 70 Q15 58 15 40 Q15 25 40 10Z"
//               stroke="#6b8f71" strokeWidth="2" fill="rgba(107,143,113,0.15)" />
//             <path d="M40 10 Q40 40 40 70" stroke="#6b8f71" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
//           </svg>
//         </div>
//       </div>

//       {/* ── DESKTOP AMBIENT LAYER — floats in empty space beside content ── */}
//       <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden="true">
//         {/* Top-left weave */}
//         <div className="animate-float-slow absolute -left-16 top-10 opacity-[0.04]" style={{ width: 200, height: 200 }}>
//           <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
//             {[1,2,3,4,5].map(i => (
//               <line key={i} x1={i*15} y1="0" x2={i*15} y2="88" stroke="#d4920a" strokeWidth="2.5" />
//             ))}
//             {[1,2,3,4,5,6].map(i => (
//               <line key={i} x1="0" y1={i*13} x2="88" y2={i*13} stroke="#b85c38" strokeWidth={i%2===0?2.5:1.2} />
//             ))}
//           </svg>
//         </div>

//         {/* Mid-left slow mandala */}
//         <div className="animate-spin-slow absolute left-4 top-1/2 -translate-y-1/2 opacity-[0.035]"
//           style={{ width: 160, height: 160, animationDuration: "28s" }}>
//           <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
//             {[30, 20, 11].map((r, i) => (
//               <circle key={i} cx="44" cy="44" r={r} stroke="#6b8f71" strokeWidth={i===0?2:1.5} />
//             ))}
//             {BG_SPOKES.map((s, i) => (
//               <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#6b8f71" strokeWidth="2" />
//             ))}
//           </svg>
//         </div>

//         {/* Bottom-left leaf */}
//         <div className="animate-float-medium absolute bottom-16 left-20 opacity-[0.04]" style={{ width: 100 }}>
//           <svg viewBox="0 0 80 80" className="h-full w-full" fill="none">
//             <path d="M40 8 Q66 22 66 40 Q66 60 40 72 Q14 60 14 40 Q14 22 40 8Z"
//               stroke="#6b8f71" strokeWidth="1.5" fill="rgba(107,143,113,0.10)" />
//             <path d="M40 8 Q40 40 40 72" stroke="#6b8f71" strokeWidth="1" fill="none" strokeDasharray="3 4" />
//           </svg>
//         </div>

//         {/* Dot grid top-centre */}
//         <div className="animate-float-fast absolute left-1/2 top-12 -translate-x-1/2 opacity-[0.03]"
//           style={{ width: 120, animationDelay: "0.8s" }}>
//           <svg viewBox="0 0 100 40" className="h-full w-full" fill="none">
//             {[0,1,2,3,4].flatMap(col => [0,1].map(row => (
//               <circle key={`${col}-${row}`} cx={10+col*20} cy={10+row*20} r="2.5" fill="#b85c38" />
//             )))}
//           </svg>
//         </div>
//       </div>

//       {/* ── MAIN CONTENT ── */}
//       <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
//         <div className="flex flex-col gap-10 py-12 md:grid md:min-h-[84vh] md:grid-cols-[1fr_420px] md:items-center md:gap-16 md:py-0 lg:grid-cols-[1fr_460px]">

//           {/* ── TEXT — order-1, always top on mobile ── */}
//           <div className="relative order-1 z-10">

//             <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/8 px-4 py-1.5"
//               style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "all 0.7s ease" }}>
//               <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
//               <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-saffron">Handmade India</span>
//             </div>

//             <h1 className="font-heading text-[2.75rem] font-medium leading-[1.04] text-charcoal sm:text-[3.5rem] lg:text-[4rem]">
//               {profile ? (
//                 <>
//                   <Word delay={80} v={visible}>Welcome</Word>{" "}
//                   <Word delay={160} v={visible}>back,</Word>
//                   <br />
//                   <Word delay={260} v={visible} col="text-terracotta">{firstName} 🙏</Word>
//                 </>
//               ) : (
//                 <>
//                   <Word delay={80} v={visible}>Where</Word>{" "}
//                   <Word delay={155} v={visible}>every</Word>{" "}
//                   <Word delay={230} v={visible}>piece</Word>
//                   <br />
//                   <Word delay={330} v={visible} col="text-terracotta">carries a story</Word>
//                 </>
//               )}
//             </h1>

//             <p className="mt-5 max-w-[440px] text-[15.5px] leading-relaxed text-warm-gray md:text-[17px]"
//               style={{ opacity: visible ? 1 : 0, transitionDelay: "430ms", transform: visible ? "none" : "translateY(8px)", transition: "all 0.7s ease" }}>
//               {profile
//                 ? "Fresh pieces from India's finest artisans — pottery, weaving, brass, woodwork. Every one made by real hands."
//                 : "Direct from Indian artisan studios — pottery, weaving, woodwork, metal craft. Real makers, no middlemen, straight to your home."}
//             </p>

//             <div className="mt-8 flex flex-wrap gap-3"
//               style={{ opacity: visible ? 1 : 0, transitionDelay: "530ms", transform: visible ? "none" : "translateY(8px)", transition: "all 0.7s ease" }}>
//               {profile ? (
//                 <>
//                   <DarkBtn href="/marketplace">Browse marketplace</DarkBtn>
//                   <OutlineBtn href={profile.role === "creator" ? "/dashboard/creator" : "/creators"}>
//                     {profile.role === "creator" ? "My Studio →" : "Meet artisans"}
//                   </OutlineBtn>
//                 </>
//               ) : (
//                 <>
//                   <ClayBtn href="/marketplace">Explore marketplace</ClayBtn>
//                   <OutlineBtn href="/auth/signup">Join free</OutlineBtn>
//                 </>
//               )}
//             </div>

//             <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-linen/70 pt-7"
//               style={{ opacity: visible ? 1 : 0, transitionDelay: "650ms", transition: "all 0.7s ease" }}>
//               {[
//                 { icon: "🏺", label: "10+ craft types" },
//                 { icon: "📍", label: "Across India" },
//                 { icon: "💬", label: "Direct messaging" },
//               ].map(({ icon, label }) => (
//                 <div key={label} className="flex items-center gap-1.5">
//                   <span className="text-sm">{icon}</span>
//                   <span className="text-[12.5px] font-medium text-warm-gray">{label}</span>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* ── POTTERY WHEEL CARD — desktop only ── */}
//           <div className="hidden md:order-2 md:flex md:items-center md:justify-center"
//             style={{ opacity: drawn ? 1 : 0, transform: drawn ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)", transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)" }}>
//             <div className="relative flex items-center justify-center">

//               {/* Outer glow */}
//               <div className="absolute h-[400px] w-[400px] rounded-full opacity-20 blur-3xl"
//                 style={{ background: "radial-gradient(circle, rgba(184,92,56,0.6) 0%, transparent 70%)" }} />

//               {/* Studio card */}
//               <div className="relative overflow-hidden rounded-[2.5rem] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.50)]"
//                 style={{ width: 400, height: 480, background: "linear-gradient(148deg,#2a1f19,#1a1208)" }}>
//                 <div className="grain-overlay absolute inset-0 opacity-100" />

//                 {/* Studio header */}
//                 <div className="relative flex items-center justify-between px-6 pt-5">
//                   <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-saffron/70">Live studio</span>
//                   <span className="flex items-center gap-1.5">
//                     <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sage" />
//                     <span className="text-[9px] font-medium text-cream/30">Wheel spinning</span>
//                   </span>
//                 </div>

//                 {/* Pottery wheel */}
//                 <div className="relative flex items-center justify-center" style={{ height: 360 }}>
//                   <PotteryWheel size={340} />
//                 </div>

//                 {/* Quote at bottom */}
//                 <div className="relative border-t border-white/8 px-6 pb-6 pt-4">
//                   <p className="font-heading text-[1.05rem] italic leading-snug text-cream/65">
//                     "Every pot begins as silence."
//                   </p>
//                   <p className="mt-1 text-[10px] font-medium text-cream/28">— A Kalakriti artisan</p>
//                 </div>
//               </div>

//               {/* Floating ₹ badge */}
//               <div className="absolute -right-4 top-12 rounded-2xl border border-white/8 bg-espresso/95 px-4 py-3 shadow-xl backdrop-blur-sm"
//                 style={{ opacity: drawn ? 1 : 0, transform: drawn ? "translateX(0)" : "translateX(12px)", transition: "all 0.7s ease 1.1s" }}>
//                 <p className="text-[9px] font-medium uppercase tracking-wider text-cream/40">Priced in</p>
//                 <p className="mt-0.5 font-heading text-[1.3rem] font-medium text-terracotta">₹ INR</p>
//               </div>

//               {/* Floating crafts badge */}
//               <div className="absolute -left-4 bottom-16 rounded-2xl border border-white/8 bg-espresso/95 px-4 py-3 shadow-xl backdrop-blur-sm"
//                 style={{ opacity: drawn ? 1 : 0, transform: drawn ? "translateX(0)" : "translateX(-12px)", transition: "all 0.7s ease 1.2s" }}>
//                 <p className="text-[9px] font-medium uppercase tracking-wider text-cream/40">Across India</p>
//                 <p className="mt-0.5 font-heading text-[1.3rem] font-medium text-sage">10+ crafts</p>
//               </div>

//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }

// /* ── Helpers ── */
// function Word({ children, delay, v, col = "" }: {
//   children: React.ReactNode; delay: number; v: boolean; col?: string;
// }) {
//   return (
//     <span
//       className={`inline-block ${col}`}
//       style={{
//         opacity: v ? 1 : 0,
//         transform: v ? "translateY(0)" : "translateY(16px)",
//         transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
//       }}
//     >
//       {children}
//     </span>
//   );
// }

// function DarkBtn({ href, children }: { href: string; children: React.ReactNode }) {
//   return (
//     <Link href={href}
//       className="group relative overflow-hidden rounded-full bg-charcoal px-7 py-3.5 text-[14px] font-semibold tracking-wide text-cream shadow-[0_4px_20px_rgba(58,50,44,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(58,50,44,0.30)] active:scale-[0.98]">
//       <span className="relative z-10">{children}</span>
//       <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
//     </Link>
//   );
// }

// function ClayBtn({ href, children }: { href: string; children: React.ReactNode }) {
//   return (
//     <Link href={href}
//       className="group relative overflow-hidden rounded-full bg-gradient-to-b from-terracotta to-[#a34e2d] px-7 py-3.5 text-[14px] font-semibold tracking-wide text-cream shadow-[0_4px_20px_rgba(184,92,56,0.32)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(184,92,56,0.42)] active:scale-[0.98]">
//       <span className="relative z-10">{children}</span>
//       <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
//     </Link>
//   );
// }

// function OutlineBtn({ href, children }: { href: string; children: React.ReactNode }) {
//   return (
//     <Link href={href}
//       className="rounded-full border border-linen bg-cream px-7 py-3.5 text-[14px] font-semibold text-charcoal shadow-[0_2px_8px_rgba(58,50,44,0.06)] transition-all duration-200 hover:border-clay/40 hover:bg-sand active:scale-[0.98]">
//       {children}
//     </Link>
//   );
// }



"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Profile } from "@/lib/types";

// Pre-computed trig — identical on server & client, avoids hydration mismatch
const BG_SPOKES = [0, 60, 120, 180, 240, 300].map((a) => {
  const rad = (a * Math.PI) / 180;
  return {
    x1: +(44 + 20 * Math.cos(rad)).toFixed(2),
    y1: +(44 + 20 * Math.sin(rad)).toFixed(2),
    x2: +(44 + 30 * Math.cos(rad)).toFixed(2),
    y2: +(44 + 30 * Math.sin(rad)).toFixed(2),
  };
});

// Pre-computed metal ring spokes for the draw-on mosaic card
const METAL_SPOKES = [0, 60, 120, 180, 240, 300].map((a) => {
  const rad = (a * Math.PI) / 180;
  return {
    x1: +(44 + 20 * Math.cos(rad)).toFixed(2),
    y1: +(44 + 20 * Math.sin(rad)).toFixed(2),
    x2: +(44 + 30 * Math.cos(rad)).toFixed(2),
    y2: +(44 + 30 * Math.sin(rad)).toFixed(2),
  };
});

const RING_C = {
  r30: +(2 * Math.PI * 30).toFixed(2),
  r20: +(2 * Math.PI * 20).toFixed(2),
  r11: +(2 * Math.PI * 11).toFixed(2),
};

type Props = { profile: Profile | null };

export function Hero({ profile }: Props) {
  const firstName = profile?.full_name?.split(" ")[0];
  const [visible, setVisible] = useState(false);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 60);
    const t2 = setTimeout(() => setDrawn(true), 480);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="grain-overlay pointer-events-none absolute inset-0 opacity-60" />

      {/* Ambient glows */}
      <div className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(212,146,10,0.13) 0%, transparent 68%)" }} />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-[480px] w-[480px] rounded-full"
        style={{ background: "radial-gradient(circle, rgba(184,92,56,0.10) 0%, transparent 65%)" }} />

      {/* ── MOBILE BACKGROUND LAYER ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden md:hidden" aria-hidden="true">
        <div className="animate-float-slow absolute -right-8 -top-6 opacity-[0.08]" style={{ width: 210, height: 270 }}>
          <svg viewBox="0 0 120 190" className="h-full w-full" fill="none">
            <ellipse cx="60" cy="174" rx="36" ry="8" fill="#b85c38" />
            <path d="M29 102 Q20 128 26 156 Q37 174 60 174 Q83 174 94 156 Q100 128 91 102Z" fill="#b85c38" />
            <path d="M38 102 Q32 76 39 54 Q49 28 60 26 Q71 28 81 54 Q88 76 82 102Z" fill="#d4920a" />
            <path d="M43 52 Q52 38 60 36 Q68 38 77 52" stroke="#b85c38" strokeWidth="3" fill="none" />
            {[116, 136, 154].map((y, i) => (
              <path key={i} d={`M${34 - i * 2} ${y} Q52 ${y - 5} 60 ${y - 4} Q68 ${y - 5} ${86 + i * 2} ${y}`}
                stroke="#b85c38" strokeWidth="2" fill="none" />
            ))}
          </svg>
        </div>

        <div className="animate-float-medium absolute -left-4 top-[38%] opacity-[0.06]" style={{ width: 150, height: 150 }}>
          <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
            {[1,2,3,4,5].map(i => (
              <line key={i} x1={i*15} y1="0" x2={i*15} y2="88" stroke="#d4920a" strokeWidth="3" />
            ))}
            {[1,2,3,4,5,6].map(i => (
              <line key={i} x1="0" y1={i*13} x2="88" y2={i*13} stroke="#b85c38" strokeWidth={i%2===0?3:1.5} />
            ))}
          </svg>
        </div>

        <div className="animate-spin-slow absolute -bottom-12 -right-12 opacity-[0.07]" style={{ width: 200, height: 200 }}>
          <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
            {[30, 20, 11].map((r, i) => (
              <circle key={i} cx="44" cy="44" r={r} stroke="#6b8f71" strokeWidth={i===0?2.5:1.8} />
            ))}
            {BG_SPOKES.map((s, i) => (
              <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#6b8f71" strokeWidth="3" />
            ))}
            <circle cx="44" cy="44" r="5" fill="#4a6b52" />
          </svg>
        </div>

        <div className="animate-float-fast absolute left-[45%] top-16 opacity-[0.05]" style={{ width: 70 }}>
          <svg viewBox="0 0 60 60" className="h-full w-full" fill="none">
            {[0,1,2].flatMap(row => [0,1,2].map(col => (
              <circle key={`${row}-${col}`} cx={10+col*20} cy={10+row*20} r="3" fill="#b85c38" />
            )))}
          </svg>
        </div>

        <div className="animate-float-medium absolute bottom-10 left-6 opacity-[0.05]"
          style={{ width: 90, height: 90, animationDelay: "1.5s" }}>
          <svg viewBox="0 0 80 80" className="h-full w-full" fill="none">
            <path d="M40 10 Q65 25 65 40 Q65 58 40 70 Q15 58 15 40 Q15 25 40 10Z"
              stroke="#6b8f71" strokeWidth="2" fill="rgba(107,143,113,0.15)" />
            <path d="M40 10 Q40 40 40 70" stroke="#6b8f71" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
          </svg>
        </div>
      </div>

      {/* ── DESKTOP AMBIENT LAYER ── */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block" aria-hidden="true">
        <div className="animate-float-slow absolute -left-16 top-10 opacity-[0.04]" style={{ width: 200, height: 200 }}>
          <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
            {[1,2,3,4,5].map(i => (
              <line key={i} x1={i*15} y1="0" x2={i*15} y2="88" stroke="#d4920a" strokeWidth="2.5" />
            ))}
            {[1,2,3,4,5,6].map(i => (
              <line key={i} x1="0" y1={i*13} x2="88" y2={i*13} stroke="#b85c38" strokeWidth={i%2===0?2.5:1.2} />
            ))}
          </svg>
        </div>

        <div className="animate-spin-slow absolute left-4 top-1/2 -translate-y-1/2 opacity-[0.035]"
          style={{ width: 160, height: 160, animationDuration: "28s" }}>
          <svg viewBox="0 0 88 88" className="h-full w-full" fill="none">
            {[30, 20, 11].map((r, i) => (
              <circle key={i} cx="44" cy="44" r={r} stroke="#6b8f71" strokeWidth={i===0?2:1.5} />
            ))}
            {BG_SPOKES.map((s, i) => (
              <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#6b8f71" strokeWidth="2" />
            ))}
          </svg>
        </div>

        <div className="animate-float-medium absolute bottom-16 left-20 opacity-[0.04]" style={{ width: 100 }}>
          <svg viewBox="0 0 80 80" className="h-full w-full" fill="none">
            <path d="M40 8 Q66 22 66 40 Q66 60 40 72 Q14 60 14 40 Q14 22 40 8Z"
              stroke="#6b8f71" strokeWidth="1.5" fill="rgba(107,143,113,0.10)" />
            <path d="M40 8 Q40 40 40 72" stroke="#6b8f71" strokeWidth="1" fill="none" strokeDasharray="3 4" />
          </svg>
        </div>

        <div className="animate-float-fast absolute left-1/2 top-12 -translate-x-1/2 opacity-[0.03]"
          style={{ width: 120, animationDelay: "0.8s" }}>
          <svg viewBox="0 0 100 40" className="h-full w-full" fill="none">
            {[0,1,2,3,4].flatMap(col => [0,1].map(row => (
              <circle key={`${col}-${row}`} cx={10+col*20} cy={10+row*20} r="2.5" fill="#b85c38" />
            )))}
          </svg>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-10 py-12 md:grid md:min-h-[84vh] md:grid-cols-[1fr_420px] md:items-center md:gap-16 md:py-0 lg:grid-cols-[1fr_460px]">

          {/* ── TEXT ── */}
          <div className="relative order-1 z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-saffron/25 bg-saffron/8 px-4 py-1.5"
              style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(10px)", transition: "all 0.7s ease" }}>
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
              <span className="text-[11px] font-bold uppercase tracking-[0.26em] text-saffron">Handmade India</span>
            </div>

            <h1 className="font-heading text-[2.75rem] font-medium leading-[1.04] text-charcoal sm:text-[3.5rem] lg:text-[4rem]">
              {profile ? (
                <>
                  <Word delay={80} v={visible}>Welcome</Word>{" "}
                  <Word delay={160} v={visible}>back,</Word>
                  <br />
                  <Word delay={260} v={visible} col="text-terracotta">{firstName} 🙏</Word>
                </>
              ) : (
                <>
                  <Word delay={80} v={visible}>Where</Word>{" "}
                  <Word delay={155} v={visible}>every</Word>{" "}
                  <Word delay={230} v={visible}>piece</Word>
                  <br />
                  <Word delay={330} v={visible} col="text-terracotta">carries a story</Word>
                </>
              )}
            </h1>

            <p className="mt-5 max-w-[440px] text-[15.5px] leading-relaxed text-warm-gray md:text-[17px]"
              style={{ opacity: visible ? 1 : 0, transitionDelay: "430ms", transform: visible ? "none" : "translateY(8px)", transition: "all 0.7s ease" }}>
              {profile
                ? "Fresh pieces from India's finest artisans — pottery, weaving, brass, woodwork. Every one made by real hands."
                : "Direct from Indian artisan studios — pottery, weaving, woodwork, metal craft. Real makers, no middlemen, straight to your home."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3"
              style={{ opacity: visible ? 1 : 0, transitionDelay: "530ms", transform: visible ? "none" : "translateY(8px)", transition: "all 0.7s ease" }}>
              {profile ? (
                <>
                  <DarkBtn href="/marketplace">Browse marketplace</DarkBtn>
                  <OutlineBtn href={profile.role === "creator" ? "/dashboard/creator" : "/creators"}>
                    {profile.role === "creator" ? "My Studio →" : "Meet artisans"}
                  </OutlineBtn>
                </>
              ) : (
                <>
                  <ClayBtn href="/marketplace">Explore marketplace</ClayBtn>
                  <OutlineBtn href="/auth/signup">Join free</OutlineBtn>
                </>
              )}
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-linen/70 pt-7"
              style={{ opacity: visible ? 1 : 0, transitionDelay: "650ms", transition: "all 0.7s ease" }}>
              {[
                { icon: "🏺", label: "10+ craft types" },
                { icon: "📍", label: "Across India" },
                { icon: "💬", label: "Direct messaging" },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <span className="text-sm">{icon}</span>
                  <span className="text-[12.5px] font-medium text-warm-gray">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── DRAW-ON MOSAIC CARD — desktop only ── */}
          <div
            className="hidden md:order-2 md:block"
            style={{
              opacity: drawn ? 1 : 0,
              transform: drawn ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
              transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="relative">
              {/* Main mosaic card */}
              <div
                className="relative overflow-hidden rounded-[2.5rem] shadow-[0_32px_80px_-16px_rgba(58,50,44,0.22)]"
                style={{ background: "linear-gradient(148deg,#ede3d6,#e0d2bf,#d4c4a8)" }}
              >
                <div className="grain-overlay absolute inset-0 opacity-90" />

                <div className="relative grid grid-cols-2 gap-3 p-4">

                  {/* ── Pottery — tall left, draws itself ── */}
                  <div
                    className="row-span-2 flex flex-col items-center justify-center overflow-hidden rounded-[1.5rem]"
                    style={{ background: "rgba(184,92,56,0.09)", aspectRatio: "3/4" }}
                  >
                    <svg viewBox="0 0 120 190" className="w-3/4" fill="none">
                      {/* Shadow */}
                      <ellipse cx="60" cy="174" rx="36" ry="8" fill="#c49a6c"
                        style={{ opacity: drawn ? 0.28 : 0, transition: "opacity 0.6s 0.3s" }} />
                      {/* Belly */}
                      <path d="M29 102 Q20 128 26 156 Q37 174 60 174 Q83 174 94 156 Q100 128 91 102Z"
                        fill="#b85c38"
                        style={{ opacity: drawn ? 0.52 : 0, transition: "opacity 0.5s 0.5s" }} />
                      {/* Neck */}
                      <path d="M38 102 Q32 76 39 54 Q49 28 60 26 Q71 28 81 54 Q88 76 82 102Z"
                        fill="#d4920a"
                        style={{ opacity: drawn ? 0.38 : 0, transition: "opacity 0.7s 0.7s" }} />
                      {/* Rim — draws in */}
                      <path d="M43 52 Q52 38 60 36 Q68 38 77 52"
                        stroke="#faf6f0" strokeWidth="1.8" fill="none"
                        strokeDasharray="60"
                        style={{ strokeDashoffset: drawn ? 0 : 60, transition: "stroke-dashoffset 0.8s ease 0.9s" }} />
                      {/* Throwing lines — draw in staggered */}
                      {[116, 136, 154].map((y, i) => (
                        <path key={i}
                          d={`M${34 - i * 2} ${y} Q52 ${y - 5} 60 ${y - 4} Q68 ${y - 5} ${86 + i * 2} ${y}`}
                          stroke="#faf6f0" strokeWidth="1.2" fill="none"
                          strokeDasharray="80"
                          style={{
                            strokeDashoffset: drawn ? 0 : 80,
                            opacity: 0.35 + i * 0.08,
                            transition: `stroke-dashoffset 0.9s ease ${1.0 + i * 0.15}s`,
                          }} />
                      ))}
                    </svg>
                    <span
                      className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.22em]"
                      style={{ color: "rgba(184,92,56,0.55)", opacity: drawn ? 1 : 0, transition: "opacity 0.5s 1.3s" }}>
                      Pottery
                    </span>
                  </div>

                  {/* ── Textile — weave draws in ── */}
                  <div
                    className="flex items-center justify-center overflow-hidden rounded-[1.5rem]"
                    style={{ background: "rgba(212,146,10,0.08)", aspectRatio: "1" }}
                  >
                    <svg viewBox="0 0 88 88" className="h-3/4 w-3/4" fill="none">
                      {[1,2,3,4,5].map(i => (
                        <line key={i} x1={i*15} y1="0" x2={i*15} y2="88"
                          stroke="#d4920a" strokeWidth="2.5"
                          strokeDasharray="88"
                          style={{
                            strokeDashoffset: drawn ? 0 : 88,
                            opacity: 0.30,
                            transition: `stroke-dashoffset 0.7s ease ${0.6 + i * 0.1}s`,
                          }} />
                      ))}
                      {[1,2,3,4,5,6].map(i => (
                        <line key={i} x1="0" y1={i*13} x2="88" y2={i*13}
                          stroke="#b85c38"
                          strokeWidth={i%2===0 ? 2.5 : 1.2}
                          strokeDasharray="88"
                          style={{
                            strokeDashoffset: drawn ? 0 : 88,
                            opacity: i%2===0 ? 0.36 : 0.16,
                            transition: `stroke-dashoffset 0.7s ease ${0.9 + i * 0.08}s`,
                          }} />
                      ))}
                    </svg>
                  </div>

                  {/* ── Metal — rings expand outward ── */}
                  <div
                    className="flex items-center justify-center overflow-hidden rounded-[1.5rem]"
                    style={{ background: "rgba(107,143,113,0.08)", aspectRatio: "1" }}
                  >
                    <svg viewBox="0 0 88 88" className="h-3/4 w-3/4" fill="none">
                      {/* Rings draw in */}
                      <circle cx="44" cy="44" r="30" stroke="#6b8f71" strokeWidth="2"
                        strokeDasharray={RING_C.r30}
                        style={{ strokeDashoffset: drawn ? 0 : RING_C.r30, opacity: 0.38, transition: "stroke-dashoffset 1s ease 0.7s" }} />
                      <circle cx="44" cy="44" r="20" stroke="#6b8f71" strokeWidth="1.5"
                        strokeDasharray={RING_C.r20}
                        style={{ strokeDashoffset: drawn ? 0 : RING_C.r20, opacity: 0.32, transition: "stroke-dashoffset 1s ease 0.9s" }} />
                      <circle cx="44" cy="44" r="11" stroke="#6b8f71" strokeWidth="1"
                        strokeDasharray={RING_C.r11}
                        style={{ strokeDashoffset: drawn ? 0 : RING_C.r11, opacity: 0.26, transition: "stroke-dashoffset 1s ease 1.1s" }} />
                      {/* Spokes draw in */}
                      {METAL_SPOKES.map((s, i) => (
                        <line key={i} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2}
                          stroke="#6b8f71" strokeWidth="2.5"
                          strokeDasharray="10"
                          style={{
                            strokeDashoffset: drawn ? 0 : 10,
                            opacity: 0.40,
                            transition: `stroke-dashoffset 0.5s ease ${1.2 + i * 0.06}s`,
                          }} />
                      ))}
                      {/* Centre dot fades in last */}
                      <circle cx="44" cy="44" r="4.5" fill="#4a6b52"
                        style={{ opacity: drawn ? 0.50 : 0, transition: "opacity 0.4s 1.6s" }} />
                    </svg>
                  </div>
                </div>

                {/* Bottom info pill */}
                <div
                  className="relative m-3 mt-0 overflow-hidden rounded-2xl border border-linen/50 bg-cream/94 px-4 py-3.5 shadow-[0_2px_16px_rgba(58,50,44,0.08)] backdrop-blur-sm"
                  style={{
                    opacity: drawn ? 1 : 0,
                    transform: drawn ? "translateY(0)" : "translateY(8px)",
                    transition: "all 0.7s ease 1s",
                  }}
                >
                  <p className="text-[9.5px] font-bold uppercase tracking-[0.26em] text-saffron">Artisan-first</p>
                  <p className="mt-0.5 font-heading text-[1.1rem] leading-snug text-charcoal">
                    Direct from studio to your home.
                  </p>
                </div>
              </div>

              {/* Floating ₹ badge */}
              <div
                className="absolute -right-3 top-8 rounded-2xl border border-linen bg-cream px-4 py-3 shadow-[0_4px_24px_rgba(58,50,44,0.10)]"
                style={{
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? "translateX(0)" : "translateX(8px)",
                  transition: "all 0.7s ease 1.1s",
                }}
              >
                <p className="text-[9px] font-medium uppercase tracking-wider text-warm-gray">Priced in</p>
                <p className="mt-0.5 font-heading text-[1.3rem] font-medium text-terracotta">₹ INR</p>
              </div>

              {/* Floating crafts badge */}
              <div
                className="absolute -left-3 bottom-20 rounded-2xl border border-linen bg-cream px-4 py-3 shadow-[0_4px_24px_rgba(58,50,44,0.10)]"
                style={{
                  opacity: drawn ? 1 : 0,
                  transform: drawn ? "translateX(0)" : "translateX(-8px)",
                  transition: "all 0.7s ease 1.2s",
                }}
              >
                <p className="text-[9px] font-medium uppercase tracking-wider text-warm-gray">Across India</p>
                <p className="mt-0.5 font-heading text-[1.3rem] font-medium text-sage">10+ crafts</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

/* ── Helpers ── */
function Word({ children, delay, v, col = "" }: {
  children: React.ReactNode; delay: number; v: boolean; col?: string;
}) {
  return (
    <span
      className={`inline-block ${col}`}
      style={{
        opacity: v ? 1 : 0,
        transform: v ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 600ms cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {children}
    </span>
  );
}

function DarkBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="group relative overflow-hidden rounded-full bg-charcoal px-7 py-3.5 text-[14px] font-semibold tracking-wide text-cream shadow-[0_4px_20px_rgba(58,50,44,0.22)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(58,50,44,0.30)] active:scale-[0.98]">
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </Link>
  );
}

function ClayBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="group relative overflow-hidden rounded-full bg-gradient-to-b from-terracotta to-[#a34e2d] px-7 py-3.5 text-[14px] font-semibold tracking-wide text-cream shadow-[0_4px_20px_rgba(184,92,56,0.32)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_28px_rgba(184,92,56,0.42)] active:scale-[0.98]">
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
    </Link>
  );
}

function OutlineBtn({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href}
      className="rounded-full border border-linen bg-cream px-7 py-3.5 text-[14px] font-semibold text-charcoal shadow-[0_2px_8px_rgba(58,50,44,0.06)] transition-all duration-200 hover:border-clay/40 hover:bg-sand active:scale-[0.98]">
      {children}
    </Link>
  );
}