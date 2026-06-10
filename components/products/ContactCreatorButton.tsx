"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { startConversation } from "@/lib/actions/messages";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/Button";

type ContactCreatorButtonProps = {
  creatorId: string;
  productId?: string;
  label?: string;
  fullWidth?: boolean;
};

export function ContactCreatorButton({
  creatorId,
  productId,
  label = "Message artisan",
  fullWidth = false,
}: ContactCreatorButtonProps) {
  const { profile, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className={`h-12 animate-pulse rounded-full bg-sand ${fullWidth ? "w-full" : "w-48"}`} />
    );
  }

  if (!profile) {
    const loginUrl = `/auth/login?role=user&redirect=${encodeURIComponent(pathname)}`;
    return (
      <div className={fullWidth ? "w-full" : ""}>
        <Button href={loginUrl} variant="secondary" className={fullWidth ? "w-full" : ""}>
          Sign in to message
        </Button>
        <p className="mt-2 text-center text-xs text-warm-gray">
          Guests can browse freely — sign in to connect with artisans.
        </p>
      </div>
    );
  }

  if (profile.role !== "user") {
    return (
      <p className="text-sm text-warm-gray">
        Creator accounts cannot message other artisans.{" "}
        <Link href="/dashboard/creator" className="text-terracotta">
          Go to your studio
        </Link>
      </p>
    );
  }

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await startConversation(creatorId, productId);
      if (result.error === "AUTH_REQUIRED") {
        router.push("/auth/login?role=user");
        return;
      }
      if (result.error) {
        setError(result.error);
        return;
      }
      if (result.conversationId) {
        router.push(`/messages/${result.conversationId}`);
      }
    });
  }

  return (
    <div className={fullWidth ? "w-full" : ""}>
      <Button
        type="button"
        variant="secondary"
        className={fullWidth ? "w-full" : ""}
        onClick={handleClick}
        disabled={pending}
      >
        {pending ? "Opening chat…" : label}
      </Button>
      {error && <p className="mt-2 text-sm text-terracotta">{error}</p>}
    </div>
  );
}
