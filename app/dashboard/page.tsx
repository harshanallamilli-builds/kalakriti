import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/queries/profiles";
import { getDashboardPath } from "@/lib/utils";

export default async function DashboardRedirectPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/auth/login");
  redirect(getDashboardPath(profile.role));
}
