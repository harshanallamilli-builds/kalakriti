"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { deleteProduct, restoreProduct } from "@/lib/actions/products";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatINR } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/lib/types";

type Props = { products: Product[] };

export function ProductList({ products: initialProducts }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [confirmArchiveId, setConfirmArchiveId] = useState<string | null>(null);
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const router = useRouter();

  const productToArchive = products.find((p) => p.id === confirmArchiveId);
  const productToRestore = products.find((p) => p.id === confirmRestoreId);

  const activeProducts = products.filter((p) => p.is_active);
  const archivedProducts = products.filter((p) => !p.is_active);

  function handleArchiveConfirm() {
    if (!confirmArchiveId) return;
    const id = confirmArchiveId;
    setConfirmArchiveId(null);
    startTransition(async () => {
      const result = await deleteProduct(id);
      if (result.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_active: false } : p))
        );
        router.refresh();
      } else {
        setError(result.error ?? "Could not archive. Please try again.");
      }
    });
  }

  function handleRestoreConfirm() {
    if (!confirmRestoreId) return;
    const id = confirmRestoreId;
    setConfirmRestoreId(null);
    startTransition(async () => {
      const result = await restoreProduct(id);
      if (result.success) {
        setProducts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, is_active: true } : p))
        );
        router.refresh();
      } else {
        setError(result.error ?? "Could not restore. Please try again.");
      }
    });
  }

  if (products.length === 0) {
    return (
      <EmptyState
        icon="🪔"
        title="No pieces yet"
        description="Add your first handmade product to appear on the marketplace and start receiving orders."
        actionLabel="Add your first piece"
        actionHref="/dashboard/creator/products/new"
      />
    );
  }

  return (
    <>
      {error && (
        <p className="mb-3 rounded-2xl bg-terracotta/10 px-4 py-2.5 text-sm text-terracotta">
          {error}
        </p>
      )}

      {/* Active listings */}
      {activeProducts.length > 0 && (
        <div className="mb-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-warm-gray">
            Active listings ({activeProducts.length})
          </p>
          <ul className="space-y-3">
            {activeProducts.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                isPending={isPending}
                onArchive={() => setConfirmArchiveId(p.id)}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Archived listings */}
      {archivedProducts.length > 0 && (
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.15em] text-warm-gray">
            Archived ({archivedProducts.length})
          </p>
          <ul className="space-y-3 opacity-70">
            {archivedProducts.map((p) => (
              <ProductRow
                key={p.id}
                product={p}
                isPending={isPending}
                onRestore={() => setConfirmRestoreId(p.id)}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Archive confirmation */}
      <ConfirmModal
        open={!!confirmArchiveId}
        title="Archive this listing?"
        description={
          productToArchive
            ? `"${productToArchive.name}" will be hidden from the marketplace. You can restore it any time. Existing orders are unaffected.`
            : "The listing will be hidden from the marketplace. You can restore it any time."
        }
        confirmLabel="Archive Listing"
        cancelLabel="Cancel"
        danger={false}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setConfirmArchiveId(null)}
      />

      {/* Restore confirmation */}
      <ConfirmModal
        open={!!confirmRestoreId}
        title="Restore this listing?"
        description={
          productToRestore
            ? `"${productToRestore.name}" will become visible on the marketplace again.`
            : "The listing will become visible on the marketplace again."
        }
        confirmLabel="Restore Listing"
        cancelLabel="Cancel"
        danger={false}
        onConfirm={handleRestoreConfirm}
        onCancel={() => setConfirmRestoreId(null)}
      />
    </>
  );
}

function ProductRow({
  product: p,
  isPending,
  onArchive,
  onRestore,
}: {
  product: Product;
  isPending: boolean;
  onArchive?: () => void;
  onRestore?: () => void;
}) {
  return (
    <li className="flex items-center gap-4 rounded-2xl border border-linen bg-white p-4 shadow-[var(--shadow-card)] transition-shadow hover:shadow-[var(--shadow-soft)]">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-sand">
        <Image src={p.image_url} alt="" fill className="object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-charcoal">{p.name}</p>
        <p className="text-sm text-warm-gray">{formatINR(Number(p.price_inr))}</p>
      </div>
      <span
        className={`hidden shrink-0 rounded-full px-3 py-1 text-xs font-medium sm:inline-block ${
          p.is_active
            ? "bg-sage/15 text-moss"
            : "bg-sand text-warm-gray"
        }`}
      >
        {p.is_active ? "Active" : "Archived"}
      </span>
      <div className="flex shrink-0 items-center gap-3">
        {p.is_active ? (
          <>
            <Link
              href={`/dashboard/creator/products/${p.id}/edit`}
              className="text-sm text-terracotta hover:text-charcoal"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={onArchive}
              disabled={isPending}
              className="text-sm text-warm-gray hover:text-charcoal disabled:opacity-40"
            >
              Archive Listing
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onRestore}
            disabled={isPending}
            className="text-sm text-moss hover:text-charcoal disabled:opacity-40"
          >
            Restore Listing
          </button>
        )}
      </div>
    </li>
  );
}
