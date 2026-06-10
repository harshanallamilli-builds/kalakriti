"use client";

import type { Order } from "@/lib/types";

function fmt(iso: string | null | undefined): string | null {
  if (!iso) return null;
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

type Props = { order: Order };

export function OrderDates({ order }: Props) {
  const rows: { label: string; value: string | null }[] = [
    { label: "Requested", value: fmt(order.created_at) },
    ...(order.confirmed_at ? [{ label: "Confirmed", value: fmt(order.confirmed_at) }] : []),
    ...(order.in_progress_at ? [{ label: "Started", value: fmt(order.in_progress_at) }] : []),
    ...(order.completed_at ? [{ label: "Completed", value: fmt(order.completed_at) }] : []),
    ...(order.cancelled_at ? [{ label: "Cancelled", value: fmt(order.cancelled_at) }] : []),
  ];

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-0.5">
      {rows.map((r) => (
        <span key={r.label} className="text-xs text-warm-gray/70">
          <span className="font-medium text-warm-gray">{r.label}:</span>{" "}
          {r.value}
        </span>
      ))}
    </div>
  );
}
