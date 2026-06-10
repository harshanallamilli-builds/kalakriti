import { redirect } from "next/navigation";
import { ProfileForm } from "@/components/dashboard/ProfileForm";
import { UserOrdersSection } from "@/components/dashboard/UserOrdersSection";
import { getCurrentProfile } from "@/lib/queries/profiles";
import { getUserOrders } from "@/lib/queries/orders";
import { SignOutButton } from "@/components/ui/SignOutButton";
import { Button } from "@/components/ui/Button";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account" };

export default async function UserDashboardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login?role=user");
  if (profile.role !== "user") redirect("/dashboard/creator");

  const orders = await getUserOrders(profile.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 md:py-14">
      <div className="flex flex-col gap-4 border-b border-linen pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-sage">
            Your account
          </p>
          <h1 className="mt-1 font-heading text-3xl text-charcoal">
            Welcome, {profile.full_name.split(" ")[0]}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button href="/marketplace" variant="outline" size="sm">
            Browse marketplace
          </Button>
          <SignOutButton className="rounded-full border border-linen px-3 py-1.5 text-sm text-warm-gray transition-colors hover:text-charcoal disabled:opacity-50">
            Sign out
          </SignOutButton>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <ProfileForm profile={profile} />
        {/* Pass userId so the component can subscribe to realtime order updates */}
        <UserOrdersSection orders={orders} userId={profile.id} />
      </div>
    </div>
  );
}
