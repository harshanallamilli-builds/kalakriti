import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { SignupForm } from "@/components/auth/SignupForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Create account" };

export default function SignupPage() {
  return (
    <AuthLayout
      title="Join Kalakriti"
      subtitle="Choose whether you're collecting handmade India or sharing your craft with the world."
    >
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-sand/50" />}>
        <SignupForm />
      </Suspense>
    </AuthLayout>
  );
}
