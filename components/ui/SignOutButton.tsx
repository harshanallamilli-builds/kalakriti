"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/actions/auth";
import { useAuth } from "@/context/AuthProvider";
import { createClient } from "@/lib/supabase/client";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

/**
 * Logout sequence (belt-and-suspenders):
 * 1. clearAuth()  — synchronously wipes profile from React state → Navbar re-renders instantly.
 * 2. supabase.auth.signOut() (client) — clears the browser session/cookie immediately,
 *    which also fires onAuthStateChange(SIGNED_OUT) as a secondary confirmation.
 * 3. server signOut() — invalidates the session on the server + revalidates SSR cache.
 * 4. router.push("/") + router.refresh() — redirects and busts any remaining SSR cache.
 */
export function SignOutButton({ className, children = "Sign out" }: Props) {
  const router = useRouter();
  const { clearAuth } = useAuth();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      // Step 1: Clear React state immediately — Navbar re-renders before any await.
      clearAuth();

      // Step 2: Sign out on the client side (clears cookie + fires SIGNED_OUT event).
      const supabase = createClient();
      await supabase.auth.signOut();

      // Step 3: Invalidate server session + SSR cache.
      await signOut();

      // Step 4: Navigate home.
      router.push("/");
      router.refresh();
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={className}
    >
      {isPending ? "Signing out…" : children}
    </button>
  );
}
