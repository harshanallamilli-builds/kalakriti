// "use client";

// import { useActionState, useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { signIn, type AuthState } from "@/lib/actions/auth";
// import { useAuth } from "@/context/AuthProvider";
// import { GoogleButton } from "@/components/auth/GoogleButton";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { cn } from "@/lib/utils";
// import type { UserRole } from "@/lib/types";

// const initial: AuthState = {};

// export function LoginForm() {
//   const router = useRouter();
//   const { refresh: refreshAuth } = useAuth();
//   const searchParams = useSearchParams();
//   const role = (searchParams.get("role") as UserRole) || "user";
//   const redirect = searchParams.get("redirect") ?? "";
//   const [state, formAction, pending] = useActionState(signIn, initial);
//   const [clientError, setClientError] = useState("");

//   // Wait for AuthProvider to read the session from the cookie the server action
//   // just wrote, bust the SSR cache, then navigate. This prevents the navbar from
//   // showing "Sign in" at the destination because router.push fired before the
//   // browser-side auth state had a chance to sync with the new cookie session.
//   useEffect(() => {
//     if (!state.redirectTo) return;
//     refreshAuth().then(() => {
//       router.refresh();
//       router.push(state.redirectTo!);
//     });
//   }, [state.redirectTo, router, refreshAuth]);

//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     setClientError("");
//     const data = new FormData(e.currentTarget);
//     const email = String(data.get("email") ?? "").trim();
//     const password = String(data.get("password") ?? "");

//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
//       e.preventDefault();
//       setClientError("Please enter a valid email address.");
//       return;
//     }
//     if (password.length < 6) {
//       e.preventDefault();
//       setClientError("Password must be at least 6 characters.");
//       return;
//     }
//   }

//   const displayError = clientError || state.error;

//   return (
//     <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
//       {/* Role tabs */}
//       <div className="flex gap-2 rounded-full bg-sand/60 p-1">
//         {(["user", "creator"] as const).map((r) => (
//           <Link
//             key={r}
//             href={`/auth/login?role=${r}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`}
//             className={cn(
//               "flex-1 rounded-full py-2 text-center text-sm font-medium transition-all",
//               role === r ? "bg-white text-charcoal shadow-sm" : "text-warm-gray hover:text-charcoal"
//             )}
//           >
//             {r === "user" ? "Customer" : "Artisan"}
//           </Link>
//         ))}
//       </div>

//       <h2 className="mt-6 font-heading text-2xl text-charcoal">
//         Sign in as {role === "creator" ? "artisan" : "customer"}
//       </h2>

//       {displayError && (
//         <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
//           {displayError}
//         </p>
//       )}

//       <div className="mt-5">
//         <GoogleButton role={role} redirectAfter={redirect} />
//       </div>

//       <div className="relative my-5 flex items-center gap-3">
//         <div className="flex-1 border-t border-linen" />
//         <span className="text-xs text-warm-gray">or</span>
//         <div className="flex-1 border-t border-linen" />
//       </div>

//       <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
//         <input type="hidden" name="redirect" value={redirect} />
//         <Input label="Email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />
//         <Input label="Password" name="password" type="password" required autoComplete="current-password" placeholder="Your password" />
//         <Button type="submit" className="mt-2 w-full" disabled={pending || !!state.redirectTo}>
//           {pending || state.redirectTo ? "Signing in…" : "Sign in"}
//         </Button>
//       </form>

//       <p className="mt-6 text-center text-sm text-warm-gray">
//         New here?{" "}
//         <Link href={`/auth/signup?role=${role}`} className="font-medium text-terracotta hover:text-charcoal">
//           Create an account
//         </Link>
//       </p>
//     </div>
//   );
// }

"use client";

import { useActionState, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signIn, type AuthState } from "@/lib/actions/auth";
import { useAuth } from "@/context/AuthProvider";
import { GoogleButton } from "@/components/auth/GoogleButton";
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
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [vals, setVals] = useState({ email: "", password: "" });

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
      e.preventDefault(); setClientError("Enter a valid email address."); return;
    }
    if (password.length < 6) {
      e.preventDefault(); setClientError("Password must be at least 6 characters."); return;
    }
  }

  const displayError = clientError || state.error;

  return (
    <div className="auth-form-wrap">
      {/* Role switcher */}
      <div className="auth-role-tabs">
        {(["user", "creator"] as const).map((r) => (
          <Link
            key={r}
            href={`/auth/login?role=${r}${redirect ? `&redirect=${encodeURIComponent(redirect)}` : ""}`}
            className={cn("auth-role-tab", role === r && "auth-role-tab--active")}
          >
            <span className="auth-role-tab__icon">{r === "user" ? "🛍️" : "🏺"}</span>
            {r === "user" ? "Customer" : "Artisan"}
          </Link>
        ))}
      </div>

      {/* Heading */}
      <div className="auth-heading">
        <h1 className="auth-heading__title">Welcome back</h1>
        <p className="auth-heading__sub">
          Sign in as {role === "creator" ? "an artisan" : "a customer"}
        </p>
      </div>

      {/* Error */}
      {displayError && (
        <div className="auth-error">
          <svg width="16" height="16" fill="none" viewBox="0 0 20 20" className="auth-error__icon">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 6v4M10 13.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {displayError}
        </div>
      )}

      {/* Google */}
      <GoogleButton role={role} redirectAfter={redirect} />

      {/* Divider */}
      <div className="auth-divider">
        <span className="auth-divider__line" />
        <span className="auth-divider__text">or continue with email</span>
        <span className="auth-divider__line" />
      </div>

      {/* Form */}
      <form action={formAction} onSubmit={handleSubmit} className="auth-fields">
        <input type="hidden" name="redirect" value={redirect} />

        {/* Email field */}
        <div className={cn("auth-field", focused === "email" && "auth-field--focused", vals.email && "auth-field--filled")}>
          <label className="auth-field__label" htmlFor="login-email">Email</label>
          <div className="auth-field__wrap">
            <svg
              width="16" height="16"
              fill="none" viewBox="0 0 20 20"
              style={{ position: "absolute", left: 12, color: "var(--warm-gray)", pointerEvents: "none", flexShrink: 0 }}
            >
              <path d="M2 5l8 6 8-6M2 5h16v10H2V5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              id="login-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="auth-field__input"
              value={vals.email}
              onChange={(e) => setVals(v => ({ ...v, email: e.target.value }))}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
          </div>
        </div>

        {/* Password field */}
        <div className={cn("auth-field", focused === "password" && "auth-field--focused", vals.password && "auth-field--filled")}>
          <label className="auth-field__label" htmlFor="login-password">Password</label>
          <div className="auth-field__wrap">
            <svg
              width="16" height="16"
              fill="none" viewBox="0 0 20 20"
              style={{ position: "absolute", left: 12, color: "var(--warm-gray)", pointerEvents: "none", flexShrink: 0 }}
            >
              <rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
              <circle cx="10" cy="14" r="1.2" fill="currentColor"/>
            </svg>
            <input
              id="login-password"
              name="password"
              type={showPass ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Your password"
              className="auth-field__input"
              value={vals.password}
              onChange={(e) => setVals(v => ({ ...v, password: e.target.value }))}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
            />
            <button
              type="button"
              onClick={() => setShowPass(s => !s)}
              className="auth-field__toggle"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass ? (
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                  <path d="M3 3l14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                  <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4"/>
                  <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={pending || !!state.redirectTo}
          className="auth-submit"
        >
          {pending || state.redirectTo ? (
            <>
              <span className="auth-submit__spinner" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <svg width="16" height="16" fill="none" viewBox="0 0 20 20">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </form>

      {/* Footer */}
      <p className="auth-footer-link">
        New here?{" "}
        <Link href={`/auth/signup?role=${role}`} className="auth-footer-link__cta">
          Create an account
        </Link>
      </p>
    </div>
  );
}