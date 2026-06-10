import Link from "next/link";

const footerLinks = {
  Explore: [
    { href: "/marketplace", label: "Marketplace" },
    { href: "/creators", label: "Artisans" },
  ],
  Account: [
    { href: "/auth/signup?role=user", label: "Join as buyer" },
    { href: "/auth/signup?role=creator", label: "Open your studio" },
    { href: "/auth/login", label: "Sign in" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-linen/80 bg-sand/35">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-saffron/90 to-terracotta font-heading text-xl font-semibold text-cream">
                K
              </span>
              <span className="font-heading text-2xl text-charcoal">Kalakriti</span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-warm-gray">
              India&apos;s handmade marketplace — connecting independent artisans
              with people who value slow craft and honest materials.
            </p>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-heading text-lg text-charcoal">{title}</h3>
              <ul className="mt-4 space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-warm-gray transition-colors hover:text-terracotta"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-linen/80 pt-8 text-sm text-warm-gray md:flex-row">
          <p>&copy; {new Date().getFullYear()} Kalakriti. Made in India, made by hand.</p>
          <p className="font-heading italic text-charcoal/60">Craft with intention.</p>
        </div>
      </div>
    </footer>
  );
}
