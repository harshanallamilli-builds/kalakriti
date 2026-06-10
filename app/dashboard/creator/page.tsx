import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { CreatorOrdersSection } from "@/components/dashboard/CreatorOrdersSection";
import { ProductList } from "@/components/dashboard/ProductList";
import { PortfolioUpload } from "@/components/dashboard/PortfolioUpload";
import { AvailabilityToggle } from "@/components/dashboard/AvailabilityToggle";
import { ProfileCompleteness } from "@/components/dashboard/ProfileCompleteness";
import { getCurrentProfile } from "@/lib/queries/profiles";
import { getCreatorProducts } from "@/lib/queries/products";
import { getCreatorOrders } from "@/lib/queries/orders";
import { getCreatorPortfolio } from "@/lib/queries/portfolio";
import { getProfileCompleteness } from "@/lib/utils";
import { SignOutButton } from "@/components/ui/SignOutButton";
import { Button } from "@/components/ui/Button";
import { CreatorSetupDialog } from "@/components/auth/CreatorSetupDialog";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Studio" };

export default async function CreatorDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login?role=creator");
  if (profile.role !== "creator") redirect("/dashboard/user");

  const needsSetup = profile.role === "creator" && !profile.store_name && !profile.craft;

  const [products, orders, portfolioItems] = await Promise.all([
    getCreatorProducts(profile.id, true),
    getCreatorOrders(profile.id),
    getCreatorPortfolio(profile.id),
  ]);

  const activeCount = products.filter((p) => p.is_active).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const inProgressOrders = orders.filter((o) => o.status === "in_progress").length;
  const completedOrders = orders.filter((o) => o.status === "completed").length;

  const { percent: completeness, missing } = getProfileCompleteness(
    profile,
    portfolioItems.length > 0
  );

  if (needsSetup) {
    return <CreatorSetupDialog />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 md:py-12">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-linen pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-saffron">Your studio</p>
          <h1 className="mt-1 font-heading text-3xl text-charcoal">
            {profile.store_name || profile.full_name}
          </h1>
          {profile.craft && (
            <p className="mt-1 text-sm text-warm-gray">{profile.craft}</p>
          )}
        </div>
        {/* Desktop action buttons */}
        <div className="hidden flex-wrap gap-2 sm:flex">
          <Button href="/dashboard/creator/products/new" variant="secondary" size="sm">
            + Add piece
          </Button>
          <Button href="/messages" variant="outline" size="sm">
            Messages
          </Button>
          <SignOutButton className="rounded-full border border-linen px-3 py-1.5 text-sm text-warm-gray transition-colors hover:border-clay hover:text-charcoal disabled:opacity-50">
            Sign out
          </SignOutButton>
        </div>
        {/* Mobile: just sign out, add is FAB */}
        <div className="flex gap-2 sm:hidden">
          <Button href="/messages" variant="outline" size="sm">
            Messages
          </Button>
          <SignOutButton className="rounded-full border border-linen px-3 py-1.5 text-sm text-warm-gray transition-colors hover:text-charcoal disabled:opacity-50">
            Sign out
          </SignOutButton>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {[
          { label: "Active Listings", value: activeCount, icon: "🪔" },
          { label: "Pending Orders", value: pendingOrders, highlight: pendingOrders > 0, icon: "⏳" },
          { label: "In Progress", value: inProgressOrders, icon: "🪡" },
          { label: "Completed", value: completedOrders, icon: "✅" },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl border p-4 shadow-[var(--shadow-card)] sm:p-5 ${
              stat.highlight ? "border-saffron/30 bg-saffron/5" : "border-linen bg-white"
            }`}
          >
            <div className="flex items-start justify-between">
              <p className={`font-heading text-3xl ${stat.highlight ? "text-saffron" : "text-charcoal"}`}>
                {stat.value}
              </p>
              <span className="text-lg opacity-50">{stat.icon}</span>
            </div>
            <p className="mt-1.5 text-[11px] leading-tight text-warm-gray sm:text-xs">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-6">
        {/* Profile completeness + availability */}
        <div className="grid gap-3 sm:grid-cols-2">
          <ProfileCompleteness percent={completeness} missing={missing} />
          <AvailabilityToggle initialAvailable={profile.available_for_commissions} />
        </div>

        <ProfileForm profile={profile} />

        {/* Portfolio */}
        <PortfolioUpload items={portfolioItems} />

        {/* Products */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-2xl text-charcoal">
              Your pieces{" "}
              <span className="text-lg text-warm-gray">({products.length})</span>
            </h2>
            <Button href="/dashboard/creator/products/new" variant="outline" size="sm">
              Add piece
            </Button>
          </div>
          <ProductList products={products} />
        </section>

        <CreatorOrdersSection orders={orders} creatorId={profile.id} />
      </div>

      {/* Mobile floating add button */}
      <a
        href="/dashboard/creator/products/new"
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta text-cream shadow-[var(--shadow-lift)] transition-transform active:scale-95 md:hidden"
        aria-label="Add new piece"
        style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
      >
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </a>
    </div>
  );
}
