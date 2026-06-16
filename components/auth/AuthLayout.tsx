// import Link from "next/link";

// type AuthLayoutProps = {
//   title: string;
//   subtitle: string;
//   children: React.ReactNode;
// };

// export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
//   return (
//     <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:py-20">
//       {/* Left panel — only visible on desktop */}
//       <div className="hidden flex-col justify-center lg:flex">
//         <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
//           <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-saffron to-terracotta font-heading text-xl font-semibold text-cream">
//             K
//           </span>
//           <span className="font-heading text-3xl text-charcoal">Kalakriti</span>
//         </Link>
//         <h1 className="font-heading text-4xl leading-tight text-charcoal">{title}</h1>
//         <p className="mt-4 max-w-md text-lg leading-relaxed text-warm-gray">{subtitle}</p>

//         <div className="mt-10 rounded-3xl border border-linen bg-sand/40 p-6">
//           <p className="font-heading text-xl italic leading-snug text-charcoal/90">
//             &ldquo;In every handmade piece lives the time, patience, and spirit of the maker.&rdquo;
//           </p>
//           <p className="mt-3 text-sm text-warm-gray">— Kalakriti</p>
//         </div>

//         <div className="mt-8 space-y-3">
//           {[
//             "Browse freely as a guest",
//             "Sign up to message artisans",
//             "Creators keep 100% of their voice",
//           ].map((point) => (
//             <div key={point} className="flex items-center gap-3 text-sm text-warm-gray">
//               <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/20 text-xs text-moss">✓</span>
//               {point}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Right panel — form; on mobile this is the only panel */}
//       <div className="flex flex-col justify-center">
//         {/* Mobile-only brand header */}
//         <div className="mb-6 flex items-center gap-2 lg:hidden">
//           <Link href="/" className="flex items-center gap-2 text-warm-gray hover:text-terracotta">
//             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
//             </svg>
//             <span className="text-sm">Kalakriti</span>
//           </Link>
//         </div>
//         {children}
//       </div>
//     </div>
//   );
// }


import Link from "next/link";

type AuthLayoutProps = {
  children: React.ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-root">
      {/* Full-bleed ambient background */}
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-bg__gradient" />
        <div className="auth-bg__noise" />
        {/* Floating craft motifs */}
        <svg className="auth-bg__motif auth-bg__motif--1" viewBox="0 0 120 120" fill="none">
          <circle cx="60" cy="60" r="55" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 6" opacity="0.3"/>
          <circle cx="60" cy="60" r="35" stroke="currentColor" strokeWidth="0.5" opacity="0.2"/>
          <path d="M60 20 L68 50 L100 60 L68 70 L60 100 L52 70 L20 60 L52 50 Z" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.25"/>
        </svg>
        <svg className="auth-bg__motif auth-bg__motif--2" viewBox="0 0 80 80" fill="none">
          <path d="M40 5 C60 5 75 20 75 40 C75 60 60 75 40 75 C20 75 5 60 5 40 C5 20 20 5 40 5Z" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.2"/>
          <path d="M40 15 L45 30 L62 35 L45 40 L40 58 L35 40 L18 35 L35 30 Z" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3"/>
        </svg>
        <svg className="auth-bg__motif auth-bg__motif--3" viewBox="0 0 60 120" fill="none">
          <path d="M30 0 Q50 30 30 60 Q10 90 30 120" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.25"/>
          <path d="M10 20 Q30 40 10 60" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.15"/>
          <path d="M50 20 Q30 40 50 60" stroke="currentColor" strokeWidth="0.4" fill="none" opacity="0.15"/>
        </svg>
      </div>

      {/* Top bar */}
      <div className="auth-topbar">
        <Link href="/" className="auth-logo">
          <span className="auth-logo__mark">K</span>
          <span className="auth-logo__name">Kalakriti</span>
        </Link>
        <Link href="/marketplace" className="auth-topbar__browse">
          Browse marketplace →
        </Link>
      </div>

      {/* Centered card */}
      <main className="auth-main">
        <div className="auth-card">
          {children}
        </div>

        {/* Bottom craft tagline */}
        <p className="auth-tagline">
          <span className="auth-tagline__mark">✦</span>
          Handmade in India, carried by every artisan
        </p>
      </main>
    </div>
  );
}