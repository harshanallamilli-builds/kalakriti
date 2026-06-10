"use client";

import { useActionState, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, type AuthState } from "@/lib/actions/auth";
import { useAuth } from "@/context/AuthProvider";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { INDIAN_STATES } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const initial: AuthState = {};

export function SignupForm() {
  const router = useRouter();
  const { refresh: refreshAuth } = useAuth();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as UserRole) || "user";
  const [state, formAction, pending] = useActionState(signUp, initial);
  const [clientError, setClientError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const isCreator = role === "creator";

  // Wait for AuthProvider to read the session from the cookie the server action
  // just wrote, bust the SSR cache, then navigate. Mirrors the same fix in
  // LoginForm — prevents the stale-navbar race on email-based signup.
  useEffect(() => {
    if (!state.redirectTo) return;
    refreshAuth().then(() => {
      router.refresh();
      router.push(state.redirectTo!);
    });
  }, [state.redirectTo, router, refreshAuth]);

  function getPasswordStrength(p: string) {
    if (!p) return null;
    if (p.length < 6) return { label: "Too short", color: "text-terracotta" };
    if (p.length < 8) return { label: "Weak", color: "text-saffron" };
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: "Strong", color: "text-moss" };
    return { label: "Good", color: "text-sage" };
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    setClientError("");
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const pwd = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm_password") ?? "");
    const fullName = String(data.get("full_name") ?? "").trim();

    if (!fullName) { e.preventDefault(); setClientError("Please enter your full name."); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { e.preventDefault(); setClientError("Please enter a valid email address."); return; }
    if (pwd.length < 6) { e.preventDefault(); setClientError("Password must be at least 6 characters."); return; }
    if (pwd !== confirm) { e.preventDefault(); setClientError("Passwords do not match."); return; }
  }

  const strength = getPasswordStrength(password);
  const displayError = clientError || state.error;
  const mismatch = !!confirmPassword && password !== confirmPassword;
  const isNavigating = !!state.redirectTo;

  return (
    <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
      <div className="flex gap-2 rounded-full bg-sand/60 p-1">
        {(["user", "creator"] as const).map((r) => (
          <Link
            key={r}
            href={`/auth/signup?role=${r}`}
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
        Join as {isCreator ? "artisan" : "customer"}
      </h2>
      <p className="mt-1 text-sm text-warm-gray">
        {isCreator
          ? "Set up your studio and start selling your handmade work."
          : "Browse and order from independent Indian artisans."}
      </p>

      {displayError && (
        <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          {displayError}
        </p>
      )}

      <div className="mt-5">
        <GoogleButton role={role} />
      </div>

      <div className="relative my-5 flex items-center gap-3">
        <div className="flex-1 border-t border-linen" />
        <span className="text-xs text-warm-gray">or</span>
        <div className="flex-1 border-t border-linen" />
      </div>

      <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="role" value={role} />

        <Input label="Full name" name="full_name" required placeholder="Your full name" />
        <Input label="Email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />

        <div>
          <Input
            label="Password"
            name="password"
            type="password"
            minLength={6}
            required
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {strength && <p className={`mt-1 text-xs ${strength.color}`}>{strength.label}</p>}
        </div>

        <div>
          <Input
            label="Confirm password"
            name="confirm_password"
            type="password"
            required
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {mismatch && <p className="mt-1 text-xs text-terracotta">Passwords do not match</p>}
        </div>

        {isCreator && (
          <div className="space-y-4 rounded-2xl border border-linen bg-sand/20 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-saffron">Studio details</p>
            <Input label="Craft / art form" name="craft" placeholder="e.g. Blue pottery, Banarasi weave" required />
            <Input label="Studio name (optional)" name="store_name" placeholder="Your brand or studio name" />
            <Input label="WhatsApp (with country code)" name="whatsapp" placeholder="919876543210" required />
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="City" name="city" placeholder="Jaipur" />
          <Select
            label="State"
            name="state"
            options={[
              { value: "", label: "Select state" },
              ...INDIAN_STATES.map((s) => ({ value: s, label: s })),
            ]}
          />
        </div>

        <Button type="submit" className="mt-2 w-full" variant="secondary" disabled={pending || mismatch || isNavigating}>
          {pending || isNavigating ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-warm-gray">
        Already have an account?{" "}
        <Link href={`/auth/login?role=${role}`} className="font-medium text-terracotta hover:text-charcoal">
          Sign in
        </Link>
      </p>
    </div>
  );
}
