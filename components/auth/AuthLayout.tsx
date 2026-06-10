import Link from "next/link";

type AuthLayoutProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 sm:py-12 lg:grid-cols-2 lg:py-20">
      {/* Left panel — only visible on desktop */}
      <div className="hidden flex-col justify-center lg:flex">
        <Link href="/" className="mb-8 inline-flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-saffron to-terracotta font-heading text-xl font-semibold text-cream">
            K
          </span>
          <span className="font-heading text-3xl text-charcoal">Kalakriti</span>
        </Link>
        <h1 className="font-heading text-4xl leading-tight text-charcoal">{title}</h1>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-warm-gray">{subtitle}</p>

        <div className="mt-10 rounded-3xl border border-linen bg-sand/40 p-6">
          <p className="font-heading text-xl italic leading-snug text-charcoal/90">
            &ldquo;In every handmade piece lives the time, patience, and spirit of the maker.&rdquo;
          </p>
          <p className="mt-3 text-sm text-warm-gray">— Kalakriti</p>
        </div>

        <div className="mt-8 space-y-3">
          {[
            "Browse freely as a guest",
            "Sign up to message artisans",
            "Creators keep 100% of their voice",
          ].map((point) => (
            <div key={point} className="flex items-center gap-3 text-sm text-warm-gray">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sage/20 text-xs text-moss">✓</span>
              {point}
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form; on mobile this is the only panel */}
      <div className="flex flex-col justify-center">
        {/* Mobile-only brand header */}
        <div className="mb-6 flex items-center gap-2 lg:hidden">
          <Link href="/" className="flex items-center gap-2 text-warm-gray hover:text-terracotta">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm">Kalakriti</span>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
