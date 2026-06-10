"use client";

import { useActionState, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, type AuthState } from "@/lib/actions/auth";
import { useAuth } from "@/context/AuthProvider";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const initial: AuthState = {};

export function LoginForm() {
  const router = useRouter();
  const { refresh: refreshAuth } = useAuth();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as UserRole) || "user";
  const redirect = searchParams.get("redirect") ?? "";
  const [state, formAction, pending] = useActionState(signIn, initial);
  const [clientError, setClientError] = useState("");

  // Wait for AuthProvider to read the session from the cookie the server action
  // just wrote, bust the SSR cache, then navigate. This prevents the navbar from
  // showing "Sign in" at the destination because router.push fired before the
  // browser-side auth state had a chance to sync with the new cookie session.
  useEffect(() => {
    if (!state.redirectTo) return;
    refreshAuth().then(() => {
      router.refresh();
      router.push(state.redirectTo!);
    });
  }, [state.redirectTo, router, refreshAuth]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setClientError("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.preventDefault();
      setClientError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      e.preventDefault();
      setClientError("Password must be at least 6 characters.");
      return;
    }
  }

  const displayError = clientError || state.error;

  return (
    <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      {/* Role tabs */}
      <div className="flex gap-2 rounded-full bg-sand/60 p-1">
        {(["user", "creator"] as const).map((r) => (
          <Link
            key={r}
            href={`/auth/login?role=${r}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`}
            className={cn(
              "flex-1 rounded-full py-2 text-center text-sm font-medium transition-all",
              role === r ? "bg-white text-charcoal shadow-sm" : "text-warm-gray hover:text-charcoal"
            )}
          >
            {r === "user" ? "Customer" : "Artisan"}
          </Link>
        ))}
      </div>

      <h2 className="mt-6 font-heading text-2xl text-charcoal">
        Sign in as {role === "creator" ? "artisan" : "customer"}
      </h2>

      {displayError && (
        <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {displayError}
        </p>
      )}

      <div className="mt-5">
        <GoogleButton role={role} redirectAfter={redirect} />
      </div>

      <div className="relative my-5 flex items-center gap-3">
        <div className="flex-1 border-t border-linen" />
        <span className="text-xs text-warm-gray">or</span>
        <div className="flex-1 border-t border-linen" />
      </div>

      <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="redirect" value={redirect} />
        <Input label="Email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
        <Input label="Password" name="password" type="password" required autoComplete="current-password" placeholder="Your password" />
        <Button type="submit" className="mt-2 w-full" disabled={pending || !!state.redirectTo}>
          {pending || state.redirectTo ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-warm-gray">
        New here?{" "}
        <Link href={`/auth/signup?role=${role}`} className="font-medium text-terracotta hover:text-charcoal">
          Create an account
        </Link>
      </p>
    </div>
  );
}
