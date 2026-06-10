import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ContactCreatorButton } from "@/components/products/ContactCreatorButton";
import { PlaceOrderForm } from "@/components/products/PlaceOrderForm";
import { ProductMasonry } from "@/components/products/ProductMasonry";
import { formatINR, formatLocation } from "@/lib/utils";
import { getProductById, getProducts } from "@/lib/queries/products";
import { getCurrentProfile } from "@/lib/queries/profiles";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  const [related, profile] = await Promise.all([
    getProducts({ category: product.category }).then((ps) =>
      ps.filter((p) => p.id !== product.id).slice(0, 4)
    ),
    getCurrentProfile(),
  ]);

  // Check if logged-in user already has an active order for this product
  let hasActiveOrder = false;
  if (profile?.role === "user" && isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("user_id", profile.id)
      .eq("product_id", product.id)
      .in("status", ["pending", "confirmed", "in_progress"])
      .maybeSingle();
    hasActiveOrder = !!existing;
  }

  const creator = product.creator;
  const location = creator ? formatLocation(creator.city, creator.state) : null;

  return (
    <article className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-16 lg:px-8">
      <Link
        href="/marketplace"
        className="inline-flex items-center gap-1 text-sm text-warm-gray hover:text-terracotta"
      >
        ← Back to marketplace
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Product image */}
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-sand shadow-[var(--shadow-soft)]">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Product info */}
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sage">{product.category}</p>
          <h1 className="mt-2 font-heading text-4xl text-charcoal md:text-5xl">{product.name}</h1>

          {creator && (
            <p className="mt-2 text-warm-gray">
              by{" "}
              <Link
                href={`/creators/${creator.id}`}
                className="font-medium text-terracotta hover:text-charcoal"
              >
                {creator.store_name || creator.full_name}
              </Link>
              {location && <span className="text-warm-gray"> · {location}</span>}
            </p>
          )}

          <p className="mt-5 font-heading text-3xl text-charcoal">
            {formatINR(Number(product.price_inr))}
          </p>
          <p className="mt-5 leading-relaxed text-warm-gray">{product.description}</p>

          {/* Actions panel */}
          {creator ? (
            <div className="mt-8 space-y-6 rounded-3xl border border-linen bg-sand/25 p-6">
              <div>
                <h2 className="font-heading text-lg text-charcoal">Message artisan</h2>
                <p className="mt-1 text-sm text-warm-gray">
                  Ask about availability, customisation, or delivery.
                </p>
                <div className="mt-4">
                  <ContactCreatorButton
                    creatorId={creator.id}
                    productId={product.id}
                    fullWidth
                  />
                </div>
              </div>
              <hr className="border-linen" />
              <div>
                <h2 className="font-heading text-lg text-charcoal">Request this piece</h2>
                <p className="mt-1 text-sm text-warm-gray">
                  Share customisation details — the artisan will confirm and coordinate with you.
                </p>
                <div className="mt-4">
                  <PlaceOrderForm
                    creatorId={creator.id}
                    productId={product.id}
                    productName={product.name}
                    hasActiveOrder={hasActiveOrder}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-3xl border border-linen bg-sand/25 p-6 text-sm text-warm-gray">
              Creator information unavailable.
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-linen pt-14">
          <h2 className="mb-8 font-heading text-3xl text-charcoal">More like this</h2>
          <ProductMasonry products={related} />
        </section>
      )}
    </article>
  );
}
