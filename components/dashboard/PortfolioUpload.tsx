"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { uploadPortfolioImage, deletePortfolioItem } from "@/lib/actions/profile";
import { addToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/Button";
import type { PortfolioItem } from "@/lib/types";

type Props = {
  items: PortfolioItem[];
};

export function PortfolioUpload({ items }: Props) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
    else setPreview(null);
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (uploading) return;

    const fd = new FormData(e.currentTarget);
    setUploading(true);
    try {
      const result = await uploadPortfolioImage(fd);
      if (result.error) {
        addToast(result.error, "error");
      } else {
        addToast("Portfolio item added", "success");
        setPreview(null);
        formRef.current?.reset();
      }
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(itemId: string) {
    if (deletingId) return;
    setDeletingId(itemId);
    try {
      const result = await deletePortfolioItem(itemId);
      if (result.error) addToast(result.error, "error");
      else addToast("Removed from portfolio", "success");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)]">
      <h2 className="font-heading text-xl text-charcoal">Portfolio Gallery</h2>
      <p className="mt-1 text-sm text-warm-gray">
        Showcase your best work — these won&apos;t appear as marketplace listings.
      </p>

      {/* Upload form */}
      <form ref={formRef} onSubmit={handleUpload} className="mt-5">
        <div className="flex flex-col gap-3">
          {/* Title (required) */}
          <div>
            <label className="block text-xs font-medium text-charcoal/70 mb-1">
              Title <span className="text-terracotta">*</span>
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g. Blue pottery vase"
              maxLength={80}
              required
              disabled={uploading}
              className="block w-full rounded-xl border border-linen bg-cream/50 px-3 py-2 text-sm text-charcoal placeholder-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30 disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="block text-xs font-medium text-charcoal/70 mb-1">
                Portfolio image <span className="text-terracotta">*</span>
              </label>
              <input
                type="file"
                name="portfolio_image"
                accept="image/*"
                onChange={handleFileChange}
                required
                disabled={uploading}
                className="block w-full cursor-pointer rounded-xl border border-dashed border-linen bg-sand/30 px-3 py-2 text-sm file:mr-2 file:rounded-full file:border-0 file:bg-charcoal file:px-3 file:py-1 file:text-xs file:text-cream disabled:opacity-50"
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-charcoal/70 mb-1">
                Caption <span className="text-warm-gray">(optional)</span>
              </label>
              <input
                type="text"
                name="caption"
                placeholder="e.g. Jaipur, 2024 — hand-thrown on the wheel"
                maxLength={120}
                disabled={uploading}
                className="block w-full rounded-xl border border-linen bg-cream/50 px-3 py-2 text-sm text-charcoal placeholder-warm-gray/60 focus:outline-none focus:ring-2 focus:ring-saffron/30 disabled:opacity-50"
              />
            </div>
            <Button type="submit" disabled={uploading} size="sm">
              {uploading ? "Uploading…" : "Upload"}
            </Button>
          </div>
        </div>
        {preview && (
          <div className="mt-3">
            <p className="mb-1 text-xs text-warm-gray">Preview</p>
            <Image
              src={preview}
              alt="Preview"
              width={120}
              height={120}
              className="h-24 w-24 rounded-xl object-cover border border-linen"
            />
          </div>
        )}
      </form>

      {/* Existing items */}
      {items.length === 0 ? (
        <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-dashed border-linen bg-sand/20 py-10 text-center">
          <span className="text-3xl opacity-30">🎨</span>
          <p className="mt-3 text-sm font-medium text-charcoal/70">No portfolio items yet.</p>
          <p className="text-xs text-warm-gray/70 mt-1">
            Showcase your best work to attract customers.
          </p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-2xl border border-linen/60 bg-white shadow-[var(--shadow-card)]"
            >
              <Image
                src={item.image_url}
                alt={item.title ?? item.caption ?? "Portfolio piece"}
                width={200}
                height={200}
                className="h-32 w-full object-cover"
              />
              {(item.title || item.caption) && (
                <div className="px-2 py-1.5">
                  {item.title && (
                    <p className="text-xs font-medium text-charcoal line-clamp-1">{item.title}</p>
                  )}
                  {item.caption && (
                    <p className="text-[11px] text-warm-gray line-clamp-1">{item.caption}</p>
                  )}
                </div>
              )}
              <button
                onClick={() => handleDelete(item.id)}
                disabled={deletingId === item.id}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-charcoal/70 text-cream opacity-0 transition-opacity group-hover:opacity-100 hover:bg-terracotta disabled:opacity-50"
                aria-label="Remove"
              >
                <svg
                  className="h-3 w-3"
                  viewBox="0 0 12 12"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <path d="M1 1l10 10M11 1L1 11" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
