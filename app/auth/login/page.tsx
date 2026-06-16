// import { Suspense } from "react";
// import { AuthLayout } from "@/components/auth/AuthLayout";
// import { LoginForm } from "@/components/auth/LoginForm";
// import type { Metadata } from "next";

// export const metadata: Metadata = { title: "Sign in" };

// export default function LoginPage() {
//   return (
//     <AuthLayout
//       title="Welcome back"
//       subtitle="Sign in to message artisans, place orders, or manage your studio on Kalakriti."
//     >
//       <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-sand/50" />}>
//         <LoginForm />
//       </Suspense>
//     </AuthLayout>
//   );
// }


import { Suspense } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign in · Kalakriti" };

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-sand/50" />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}