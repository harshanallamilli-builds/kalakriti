// "use client";

// import { useActionState, useState, useEffect } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { signUp, type AuthState } from "@/lib/actions/auth";
// import { useAuth } from "@/context/AuthProvider";
// import { GoogleButton } from "@/components/auth/GoogleButton";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";
// import { INDIAN_STATES } from "@/lib/types";
// import { cn } from "@/lib/utils";
// import type { UserRole } from "@/lib/types";

// const initial: AuthState = {};

// export function SignupForm() {
//   const router = useRouter();
//   const { refresh: refreshAuth } = useAuth();
//   const searchParams = useSearchParams();
//   const role = (searchParams.get("role") as UserRole) || "user";
//   const [state, formAction, pending] = useActionState(signUp, initial);
//   const [clientError, setClientError] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const isCreator = role === "creator";

//   // Wait for AuthProvider to read the session from the cookie the server action
//   // just wrote, bust the SSR cache, then navigate. Mirrors the same fix in
//   // LoginForm — prevents the stale-navbar race on email-based signup.
//   useEffect(() => {
//     if (!state.redirectTo) return;
//     refreshAuth().then(() => {
//       router.refresh();
//       router.push(state.redirectTo!);
//     });
//   }, [state.redirectTo, router, refreshAuth]);

//   function getPasswordStrength(p: string) {
//     if (!p) return null;
//     if (p.length < 6) return { label: "Too short", color: "text-terracotta" };
//     if (p.length < 8) return { label: "Weak", color: "text-saffron" };
//     if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return { label: "Strong", color: "text-moss" };
//     return { label: "Good", color: "text-sage" };
//   }

//   function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
//     setClientError("");
//     const data = new FormData(e.currentTarget);
//     const email = String(data.get("email") ?? "").trim();
//     const pwd = String(data.get("password") ?? "");
//     const confirm = String(data.get("confirm_password") ?? "");
//     const fullName = String(data.get("full_name") ?? "").trim();

//     if (!fullName) { e.preventDefault(); setClientError("Please enter your full name."); return; }
//     if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { e.preventDefault(); setClientError("Please enter a valid email address."); return; }
//     if (pwd.length < 6) { e.preventDefault(); setClientError("Password must be at least 6 characters."); return; }
//     if (pwd !== confirm) { e.preventDefault(); setClientError("Passwords do not match."); return; }
//   }

//   const strength = getPasswordStrength(password);
//   const displayError = clientError || state.error;
//   const mismatch = !!confirmPassword && password !== confirmPassword;
//   const isNavigating = !!state.redirectTo;

//   return (
//     <div className="rounded-3xl border border-linen bg-white p-6 shadow-[var(--shadow-card)] sm:p-8">
//       <div className="flex gap-2 rounded-full bg-sand/60 p-1">
//         {(["user", "creator"] as const).map((r) => (
//           <Link
//             key={r}
//             href={`/auth/signup?role=${r}`}
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
//         Join as {isCreator ? "artisan" : "customer"}
//       </h2>
//       <p className="mt-1 text-sm text-warm-gray">
//         {isCreator
//           ? "Set up your studio and start selling your handmade work."
//           : "Browse and order from independent Indian artisans."}
//       </p>

//       {displayError && (
//         <p className="mt-4 rounded-2xl bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
//           {displayError}
//         </p>
//       )}

//       <div className="mt-5">
//         <GoogleButton role={role} />
//       </div>

//       <div className="relative my-5 flex items-center gap-3">
//         <div className="flex-1 border-t border-linen" />
//         <span className="text-xs text-warm-gray">or</span>
//         <div className="flex-1 border-t border-linen" />
//       </div>

//       <form action={formAction} onSubmit={handleSubmit} className="space-y-4">
//         <input type="hidden" name="role" value={role} />

//         <Input label="Full name" name="full_name" required placeholder="Your full name" />
//         <Input label="Email" name="email" type="email" required autoComplete="email" placeholder="you@example.com" />

//         <div>
//           <Input
//             label="Password"
//             name="password"
//             type="password"
//             minLength={6}
//             required
//             placeholder="Minimum 6 characters"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           {strength && <p className={`mt-1 text-xs ${strength.color}`}>{strength.label}</p>}
//         </div>

//         <div>
//           <Input
//             label="Confirm password"
//             name="confirm_password"
//             type="password"
//             required
//             placeholder="Re-enter your password"
//             value={confirmPassword}
//             onChange={(e) => setConfirmPassword(e.target.value)}
//           />
//           {mismatch && <p className="mt-1 text-xs text-terracotta">Passwords do not match</p>}
//         </div>

//         {isCreator && (
//           <div className="space-y-4 rounded-2xl border border-linen bg-sand/20 p-4">
//             <p className="text-xs font-medium uppercase tracking-wide text-saffron">Studio details</p>
//             <Input label="Craft / art form" name="craft" placeholder="e.g. Blue pottery, Banarasi weave" required />
//             <Input label="Studio name (optional)" name="store_name" placeholder="Your brand or studio name" />
//             <Input label="WhatsApp (with country code)" name="whatsapp" placeholder="919876543210" required />
//           </div>
//         )}

//         <div className="grid gap-4 sm:grid-cols-2">
//           <Input label="City" name="city" placeholder="Jaipur" />
//           <Select
//             label="State"
//             name="state"
//             options={[
//               { value: "", label: "Select state" },
//               ...INDIAN_STATES.map((s) => ({ value: s, label: s })),
//             ]}
//           />
//         </div>

//         <Button type="submit" className="mt-2 w-full" variant="secondary" disabled={pending || mismatch || isNavigating}>
//           {pending || isNavigating ? "Creating account…" : "Create account"}
//         </Button>
//       </form>

//       <p className="mt-6 text-center text-sm text-warm-gray">
//         Already have an account?{" "}
//         <Link href={`/auth/login?role=${role}`} className="font-medium text-terracotta hover:text-charcoal">
//           Sign in
//         </Link>
//       </p>
//     </div>
//   );
// }



"use client";

import { useActionState, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, type AuthState } from "@/lib/actions/auth";
import { useAuth } from "@/context/AuthProvider";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Select } from "@/components/ui/Select";
import { INDIAN_STATES } from "@/lib/types";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

const initial: AuthState = {};

function StrengthBar({ password }: { password: string }) {
  if (!password) return null;
  const score = !password ? 0
    : password.length < 6 ? 1
    : password.length < 8 ? 2
    : /[A-Z]/.test(password) && /[0-9]/.test(password) ? 4
    : 3;
  const labels = ["", "Too short", "Weak", "Good", "Strong"];
  const colors = ["", "#b85c38", "#d4920a", "#6b8f71", "#3a7d44"];
  return (
    <div className="auth-strength">
      <div className="auth-strength__bars">
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className="auth-strength__bar"
            style={{ background: i <= score ? colors[score] : undefined }}
          />
        ))}
      </div>
      <span className="auth-strength__label" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
}

export function SignupForm() {
  const router = useRouter();
  const { refresh: refreshAuth } = useAuth();
  const searchParams = useSearchParams();
  const role = (searchParams.get("role") as UserRole) || "user";
  const [state, formAction, pending] = useActionState(signUp, initial);
  const [clientError, setClientError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const isCreator = role === "creator";
  const isNavigating = !!state.redirectTo;
  const mismatch = !!confirmPassword && password !== confirmPassword;

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
    const pwd = String(data.get("password") ?? "");
    const confirm = String(data.get("confirm_password") ?? "");
    const fullName = String(data.get("full_name") ?? "").trim();
    if (!fullName) { e.preventDefault(); setClientError("Enter your full name."); return; }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { e.preventDefault(); setClientError("Enter a valid email."); return; }
    if (pwd.length < 6) { e.preventDefault(); setClientError("Password needs 6+ characters."); return; }
    if (pwd !== confirm) { e.preventDefault(); setClientError("Passwords don't match."); return; }
  }

  const displayError = clientError || state.error;

  // Reusable field builder
  function Field({
    id, label, name, type = "text", placeholder, required, autoComplete,
    value, onChange, icon, children
  }: {
    id: string; label: string; name: string; type?: string; placeholder: string;
    required?: boolean; autoComplete?: string; value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ReactNode; children?: React.ReactNode;
  }) {
    return (
      <div className={cn("auth-field", focused === id && "auth-field--focused", value && "auth-field--filled")}>
        <label className="auth-field__label" htmlFor={id}>{label}</label>
        <div className="auth-field__wrap">
          <span className="auth-field__icon">{icon}</span>
          <input
            id={id} name={name} type={type} required={required}
            autoComplete={autoComplete} placeholder={placeholder}
            className="auth-field__input" value={value} onChange={onChange}
            onFocus={() => setFocused(id)} onBlur={() => setFocused(null)}
          />
        </div>
        {children}
      </div>
    );
  }

  return (
    <div className="auth-form-wrap">
      {/* Role switcher */}
      <div className="auth-role-tabs">
        {(["user", "creator"] as const).map((r) => (
          <Link
            key={r}
            href={`/auth/signup?role=${r}`}
            className={cn("auth-role-tab", role === r && "auth-role-tab--active")}
          >
            <span className="auth-role-tab__icon">{r === "user" ? "🛍️" : "🏺"}</span>
            {r === "user" ? "Customer" : "Artisan"}
          </Link>
        ))}
      </div>

      {/* Heading */}
      <div className="auth-heading">
        <h1 className="auth-heading__title">
          {isCreator ? "Open your studio" : "Join Kalakriti"}
        </h1>
        <p className="auth-heading__sub">
          {isCreator
            ? "Share your craft with buyers who care"
            : "Discover handmade India, piece by piece"}
        </p>
      </div>

      {/* Error */}
      {displayError && (
        <div className="auth-error">
          <svg className="auth-error__icon" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10 6v4M10 13.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          {displayError}
        </div>
      )}

      {/* Google */}
      <GoogleButton role={role} />

      {/* Divider */}
      <div className="auth-divider">
        <span className="auth-divider__line" />
        <span className="auth-divider__text">or continue with email</span>
        <span className="auth-divider__line" />
      </div>

      {/* Form */}
      <form action={formAction} onSubmit={handleSubmit} className="auth-fields">
        <input type="hidden" name="role" value={role} />

        <Field id="su-name" label="Full name" name="full_name" placeholder="Your full name" required
          icon={<svg fill="none" viewBox="0 0 20 20" width="16" height="16"><circle cx="10" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.4"/><path d="M2 17c0-3.314 3.582-6 8-6s8 2.686 8 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
        />

        <Field id="su-email" label="Email" name="email" type="email" placeholder="you@example.com" required autoComplete="email"
          icon={<svg fill="none" viewBox="0 0 20 20" width="16" height="16"><path d="M2 5l8 6 8-6M2 5h16v10H2V5z" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        />

        {/* Password with strength */}
        <div className={cn("auth-field", focused === "su-pass" && "auth-field--focused", password && "auth-field--filled")}>
          <label className="auth-field__label" htmlFor="su-pass">Password</label>
          <div className="auth-field__wrap">
            <span className="auth-field__icon">
              <svg fill="none" viewBox="0 0 20 20" width="16" height="16"><rect x="3" y="9" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M7 9V6a3 3 0 016 0v3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/><circle cx="10" cy="14" r="1.2" fill="currentColor"/></svg>
            </span>
            <input
              id="su-pass" name="password" type={showPass ? "text" : "password"}
              minLength={6} required placeholder="6+ characters"
              className="auth-field__input" value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocused("su-pass")} onBlur={() => setFocused(null)}
            />
            <button type="button" onClick={() => setShowPass(s => !s)} className="auth-field__toggle" aria-label="Toggle password">
              <svg fill="none" viewBox="0 0 20 20" width="16" height="16">
                <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="10" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
            </button>
          </div>
          <StrengthBar password={password} />
        </div>

        {/* Confirm */}
        <div className={cn("auth-field", focused === "su-confirm" && "auth-field--focused", confirmPassword && "auth-field--filled", mismatch && "auth-field--error")}>
          <label className="auth-field__label" htmlFor="su-confirm">Confirm password</label>
          <div className="auth-field__wrap">
            <span className="auth-field__icon">
              <svg fill="none" viewBox="0 0 20 20" width="16" height="16"><path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <input
              id="su-confirm" name="confirm_password" type={showPass ? "text" : "password"}
              required placeholder="Re-enter password"
              className="auth-field__input" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocused("su-confirm")} onBlur={() => setFocused(null)}
            />
          </div>
          {mismatch && <p className="auth-field__hint auth-field__hint--error">Passwords don't match</p>}
        </div>

        {/* Creator studio section */}
        {isCreator && (
          <div className="auth-studio-block">
            <div className="auth-studio-block__header">
              <span className="auth-studio-block__icon">🏺</span>
              <span className="auth-studio-block__label">Studio details</span>
            </div>

            <Field id="su-craft" label="Your craft / art form" name="craft" placeholder="e.g. Blue pottery, Banarasi weave" required
              icon={<svg fill="none" viewBox="0 0 20 20" width="16" height="16"><path d="M10 2l2 6h6l-5 3.5 2 6L10 14l-5 3.5 2-6L2 8h6z" stroke="currentColor" strokeWidth="1.3"/></svg>}
            />
            <Field id="su-store" label="Studio name (optional)" name="store_name" placeholder="Your brand or studio name"
              icon={<svg fill="none" viewBox="0 0 20 20" width="16" height="16"><path d="M3 9l7-7 7 7v8a1 1 0 01-1 1H4a1 1 0 01-1-1V9z" stroke="currentColor" strokeWidth="1.4"/></svg>}
            />
            <Field id="su-wa" label="WhatsApp (with country code)" name="whatsapp" placeholder="919876543210" required type="tel"
              icon={<svg fill="none" viewBox="0 0 20 20" width="16" height="16"><path d="M10 2a8 8 0 100 16A8 8 0 0010 2zM7 8c.5-1.5 2-2 3-1s1 2.5 0 3l-1 1c.5 1 1.5 2 2.5 2.5l1-1c1-1 2.5-.5 3 .5s0 2.5-1.5 3C12 17 7 14 7 8z" stroke="currentColor" strokeWidth="1.3"/></svg>}
            />
          </div>
        )}

        {/* Location */}
        <div className="auth-location-row">
          <div className={cn("auth-field", focused === "su-city" && "auth-field--focused")}>
            <label className="auth-field__label" htmlFor="su-city">City</label>
            <div className="auth-field__wrap">
              <span className="auth-field__icon">
                <svg fill="none" viewBox="0 0 20 20" width="16" height="16"><path d="M10 2C7.24 2 5 4.24 5 7c0 4.25 5 11 5 11s5-6.75 5-11c0-2.76-2.24-5-5-5zm0 6.5A1.5 1.5 0 1110 5a1.5 1.5 0 010 3.5z" fill="currentColor" opacity="0.4"/></svg>
              </span>
              <input id="su-city" name="city" placeholder="Jaipur" className="auth-field__input"
                onFocus={() => setFocused("su-city")} onBlur={() => setFocused(null)} />
            </div>
          </div>
          <div className="auth-field">
            <label className="auth-field__label">State</label>
            <Select
              label=""
              name="state"
              options={[{ value: "", label: "Select state" }, ...INDIAN_STATES.map(s => ({ value: s, label: s }))]}
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={pending || mismatch || isNavigating}
          className="auth-submit auth-submit--signup"
        >
          {pending || isNavigating ? (
            <>
              <span className="auth-submit__spinner" />
              Creating account…
            </>
          ) : (
            <>
              {isCreator ? "Open my studio" : "Create account"}
              <svg fill="none" viewBox="0 0 20 20" width="16" height="16">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </>
          )}
        </button>
      </form>

      <p className="auth-footer-link">
        Already have an account?{" "}
        <Link href={`/auth/login?role=${role}`} className="auth-footer-link__cta">
          Sign in
        </Link>
      </p>
    </div>
  );
}