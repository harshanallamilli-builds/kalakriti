import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { getCurrentProfile } from "@/lib/queries/profiles";
import { createClient } from "@/lib/supabase/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit piece" };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login?role=creator");
  if (profile.role !== "creator") redirect("/dashboard/user");

  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .eq("creator_id", profile.id)
    .single();

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
      <Link
        href="/dashboard/creator"
        className="mb-6 inline-flex items-center gap-1 text-sm text-warm-gray hover:text-terracotta"
      >
        ← Back to studio
      </Link>
      <ProductForm product={product} />
    </div>
  );
}
