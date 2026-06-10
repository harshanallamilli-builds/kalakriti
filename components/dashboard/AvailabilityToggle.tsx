"use client";

import { useState } from "react";
import { updateAvailability } from "@/lib/actions/profile";
import { addToast } from "@/lib/hooks/useToast";

type Props = {
  initialAvailable: boolean;
};

export function AvailabilityToggle({ initialAvailable }: Props) {
  const [available, setAvailable] = useState(initialAvailable);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    const next = !available;
    setAvailable(next); // optimistic update
    setPending(true);
    try {
      const result = await updateAvailability(next);
      if (result.error) {
        setAvailable(!next); // revert on error
        addToast(result.error, "error");
      } else {
        addToast(
          next ? "Now accepting commissions" : "Marked as unavailable",
          "success"
        );
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex items-center justify-between rounded-2xl border border-linen bg-white px-4 py-3 shadow-[var(--shadow-card)]">
      <div>
        <p className="text-sm font-medium text-charcoal">Commission Status</p>
        <p className="text-xs text-warm-gray">
          {available
            ? "You are accepting new commissions"
            : "You are not accepting commissions"}
        </p>
      </div>
      <button
        onClick={toggle}
        disabled={pending}
        aria-pressed={available}
        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-saffron/40 disabled:opacity-50 ${
          available ? "bg-sage" : "bg-linen"
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
            available ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
