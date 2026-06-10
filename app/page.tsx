import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { CreatorCard } from "@/components/creators/CreatorCard";
import { ProductMasonry } from "@/components/products/ProductMasonry";
import { EmptyState } from "@/components/ui/EmptyState";
import { SupabaseNotice } from "@/components/ui/SupabaseNotice";
import { Button } from "@/components/ui/Button";
import { isSupabaseConfigured } from "@/lib/config";
import { getCreators } from "@/lib/queries/profiles";
import { getProducts } from "@/lib/queries/products";

export default async function HomePage() {
  const configured = isSupabaseConfigured();
  const [products, creators] = configured
    ? await Promise.all([getProducts({ limit: 8 }), getCreators(4)])
    : [[], []];

  return (
    <>
      <Hero />
      <section className="border-y border-linen/80 bg-sand/25 py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:grid-cols-3 sm:px-6 lg:px-8">
          {[
            { title: "Artisan-first", text: "Makers keep their voice, pricing, and customer relationships." },
            { title: "Honest materials", text: "Pottery, textiles, brass, wood — celebrated as they are." },
            { title: "Direct orders", text: "Message artisans, customise pieces, no payment gateway yet." },
          ].map((item) => (
            <article key={item.title} className="text-center sm:text-left">
              <h3 className="font-heading text-xl text-charcoal">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-warm-gray">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <SectionHeading
              eyebrow="Marketplace"
              title="Handmade from across India"
              description="Real listings from registered artisans — no placeholders, only what exists in the studio today."
            />
            <Button href="/marketplace" variant="outline" className="shrink-0">
              View all
            </Button>
          </div>
          {!configured && <SupabaseNotice />}
          {configured && products.length === 0 ? (
            <EmptyState
              title="The marketplace is waiting"
              description="Be among the first artisans to list your handmade work on Kalakriti."
              actionLabel="Open your studio"
              actionHref="/auth/signup?role=creator"
            />
          ) : (
            <ProductMasonry products={products} />
          )}
        </div>
      </section>

      <section id="artisans" className="bg-sand/30 py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Artisans"
            title="Meet the makers"
            description="Independent creators sharing their craft from studios across India."
            className="mb-10"
          />
          {configured && creators.length === 0 ? (
            <EmptyState
              icon="🪔"
              title="No studios yet"
              description="Kalakriti grows with its artisans. Register as a creator and be the first in your craft."
              actionLabel="Join as artisan"
              actionHref="/auth/signup?role=creator"
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {creators.map((c) => (
                <CreatorCard key={c.id} creator={c} />
              ))}
            </div>
          )}
          <p className="mt-10 text-center">
            <Link href="/creators" className="text-sm font-medium text-terracotta hover:text-charcoal">
              Explore all artisans →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
