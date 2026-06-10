"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProduct, updateProduct } from "@/lib/actions/products";
import type { ActionState } from "@/lib/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { PRODUCT_CATEGORIES, type Product } from "@/lib/types";
import { formatINR } from "@/lib/utils";

const initial: ActionState = {};

type ProductFormProps = {
  product?: Product;
};

export function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const isEdit = Boolean(product);
  const action = isEdit ? updateProduct.bind(null, product!.id) : createProduct;
  const [state, formAction, pending] = useActionState(action, initial);
  const [editing, setEditing] = useState(!isEdit); // new product starts in edit mode

  const categoryOptions = PRODUCT_CATEGORIES.map((c) => ({ value: c, label: c }));

  // After create: navigate to the creator dashboard.
  // The server action already called revalidatePath("/dashboard/creator") so the
  // SSR cache is marked stale. We push directly — do NOT call router.refresh()
  // before the push, because that triggers a refetch of the *current* page
  // (the new-product form) while we're simultaneously navigating away, which
  // can cause Next.js App Router to 404 the destination route.
  // router.refresh() after push is also unnecessary here because the destination
  // page will be fetched fresh (the cache was already invalidated server-side).
  useEffect(() => {
    if (state.redirectTo) {
      router.push(state.redirectTo);
    }
  }, [state.redirectTo, router]);

  // After edit save: exit to view mode and bust the SSR cache so the updated
  // product data is reflected if the user navigates back to this page.
  useEffect(() => {
    if (state.success && isEdit && !state.redirectTo) {
      setEditing(false);
      router.refresh();
    }
  }, [state.success, isEdit, state.redirectTo, router]);

  // ── Edit product view mode (after save) ──────────────────
  if (isEdit && !editing && product) {
    return (
      <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h2 className="font-heading text-2xl text-charcoal">{product.name}</h2>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/dashboard/creator")}>
              ← Back
            </Button>
          </div>
        </div>

        {state.success && (
          <p className="mt-3 rounded-2xl bg-sage/15 px-4 py-2.5 text-sm text-moss">
            Product updated successfully.
          </p>
        )}

        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          {product.image_url && (
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand sm:row-span-2">
              <Image src={product.image_url} alt={product.name} fill className="object-cover" />
            </div>
          )}
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-warm-gray">Price</p>
              <p className="font-heading text-2xl text-charcoal">{formatINR(Number(product.price_inr))}</p>
            </div>
            <div>
              <p className="text-warm-gray">Category</p>
              <p className="text-charcoal">{product.category}</p>
            </div>
            <div>
              <p className="text-warm-gray">Status</p>
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${product.is_active ? "bg-sage/15 text-moss" : "bg-sand text-warm-gray"}`}>
                {product.is_active ? "Active Listing" : "Archived"}
              </span>
            </div>
          </div>
          <div className="sm:col-span-2">
            <p className="text-warm-gray text-sm">Description</p>
            <p className="mt-1 leading-relaxed text-charcoal/80">{product.description}</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Form (create or edit) ─────────────────────────────────
  return (
    <form
      action={formAction}
      className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] md:p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading text-2xl text-charcoal">
            {isEdit ? "Edit piece" : "Add new piece"}
          </h2>
          <p className="mt-1 text-sm text-warm-gray">Price in Indian Rupees (₹)</p>
        </div>
        <Button type="button" variant="ghost" size="sm" onClick={() => router.push("/dashboard/creator")}>
          ← Back
        </Button>
      </div>

      {state.error && (
        <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {state.error}
        </p>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Input
          label="Piece name"
          name="name"
          defaultValue={product?.name}
          required
          placeholder="e.g. Hand-thrown terracotta bowl"
        />
        <Input
          label="Price (₹)"
          name="price_inr"
          type="number"
          min="1"
          step="1"
          defaultValue={product?.price_inr}
          required
          placeholder="e.g. 1200"
        />
        <Select
          label="Category"
          name="category"
          options={categoryOptions}
          defaultValue={product?.category ?? PRODUCT_CATEGORIES[0]}
        />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-charcoal/80">
            Product image {isEdit ? "(leave empty to keep current)" : "*"}
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            required={!isEdit}
            className="rounded-2xl border border-dashed border-linen bg-sand/30 px-3 py-2.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-charcoal file:px-3 file:py-1 file:text-cream cursor-pointer"
          />
          <p className="text-xs text-warm-gray">JPG, PNG or WEBP. Max 5MB.</p>
        </div>



        <div className="md:col-span-2">
          <Textarea
            label="Description"
            name="description"
            defaultValue={product?.description}
            required
            placeholder="Describe the piece, materials, dimensions, and what makes it special…"
          />
        </div>
      </div>

      {isEdit && product?.image_url && (
        <div className="mt-5">
          <p className="mb-2 text-xs text-warm-gray">Current image</p>
          <div className="relative h-40 w-32 overflow-hidden rounded-2xl bg-sand shadow-[var(--shadow-card)]">
            <Image src={product.image_url} alt="" fill className="object-cover" />
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <Button type="submit" variant="secondary" disabled={pending}>
          {pending ? "Saving…" : isEdit ? "Update piece" : "Publish piece"}
        </Button>
        {isEdit && (
          <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
}
