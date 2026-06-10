import Link from "next/link";
import { redirect } from "next/navigation";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { getCurrentProfile } from "@/lib/queries/profiles";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add new piece" };

export default async function NewProductPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login?role=creator");
  if (profile.role !== "creator") redirect("/dashboard/user");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 md:py-14">
      <Link
        href="/dashboard/creator"
        className="mb-6 inline-flex items-center gap-1 text-sm text-warm-gray hover:text-terracotta"
      >
        ← Back to studio
      </Link>
      <ProductForm />
    </div>
  );
}
