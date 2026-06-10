"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { placeOrder } from "@/lib/actions/orders";
import { useAuth } from "@/context/AuthProvider";
import { addToast } from "@/lib/hooks/useToast";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import type { ActionState } from "@/lib/types";

type PlaceOrderFormProps = {
  creatorId: string;
  productId: string;
  productName: string;
  /** Pre-check: pass true if the server already knows there's an active order */
  hasActiveOrder?: boolean;
};

export function PlaceOrderForm({
  creatorId,
  productId,
  productName,
  hasActiveOrder = false,
}: PlaceOrderFormProps) {
  const { profile, isLoading } = useAuth();
  const [state, setState] = useState<ActionState>({});
  const [isPending, startTransition] = useTransition();

  if (isLoading) {
    return <div className="h-28 animate-pulse rounded-2xl bg-sand/50" />;
  }

  if (!profile) {
    return (
      <p className="text-sm text-warm-gray">
        <Link
          href={`/auth/login?role=user&redirect=/marketplace/${productId}`}
          className="font-medium text-terracotta hover:text-charcoal"
        >
          Sign in
        </Link>{" "}
        to request {productName}.
      </p>
    );
  }

  if (profile.role !== "user") {
    return (
      <p className="text-sm text-warm-gray">
        Creator accounts cannot place orders.{" "}
        <Link href="/dashboard/creator" className="text-terracotta">
          Go to your studio →
        </Link>
      </p>
    );
  }

  // Already has active order — either pre-checked or returned by action
  if (hasActiveOrder || state.alreadyExists) {
    return (
      <div className="rounded-2xl border border-saffron/30 bg-saffron/8 px-4 py-4 text-sm">
        <p className="font-medium text-charcoal">Request already pending</p>
        <p className="mt-1 text-warm-gray">
          You have an active order for this piece.{" "}
          <Link href="/dashboard/user" className="text-terracotta underline">
            View your orders
          </Link>{" "}
          or message the artisan directly.
        </p>
      </div>
    );
  }

  if (state.success) {
    return (
      <div className="animate-fade-in rounded-2xl bg-sage/15 px-4 py-5 text-sm text-moss">
        <p className="font-heading text-lg text-moss">Request sent!</p>
        <p className="mt-1 text-sage">
          The artisan will reach out via messages.{" "}
          <Link href="/dashboard/user" className="font-medium underline">
            View your orders
          </Link>
        </p>
      </div>
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await placeOrder(state, fd);
      setState(result);
      if (result.success) addToast("Request sent to artisan!", "success");
      if (result.error && !result.alreadyExists) addToast(result.error, "error");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="creator_id" value={creatorId} />
      <input type="hidden" name="product_id" value={productId} />
      <Textarea
        label="Customisation or size details"
        name="custom_request"
        placeholder="e.g. Set of 4, gift wrapping, deliver by Diwali…"
        rows={2}
      />
      <Textarea
        label="Additional notes (optional)"
        name="notes"
        placeholder="Any questions for the artisan"
        rows={2}
      />
      {state.error && !state.alreadyExists && (
        <p className="rounded-xl bg-terracotta/10 px-3 py-2 text-sm text-terracotta">
          {state.error}
        </p>
      )}
      <Button type="submit" variant="outline" disabled={isPending} className="w-full">
        {isPending ? (
          <span className="flex items-center gap-2">
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-charcoal/30 border-t-charcoal" />
            Sending request…
          </span>
        ) : (
          "Request this piece"
        )}
      </Button>
      <p className="text-center text-xs text-warm-gray">
        No online payment — the artisan will confirm and coordinate directly.
      </p>
    </form>
  );
}
