"use client";

import type { OrderStatus } from "@/lib/types";

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Requested" },
  { status: "confirmed", label: "Confirmed" },
  { status: "in_progress", label: "In Progress" },
  { status: "completed", label: "Completed" },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  pending: 0,
  confirmed: 1,
  in_progress: 2,
  completed: 3,
  cancelled: -1,
};

type Props = { status: OrderStatus };

export function OrderTimeline({ status }: Props) {
  const currentIdx = STATUS_ORDER[status];
  const isCancelled = status === "cancelled";

  if (isCancelled) {
    return (
      <div className="flex items-center gap-2 py-1">
        <span className="h-2 w-2 rounded-full bg-warm-gray/40" />
        <span className="text-xs text-warm-gray">Order cancelled</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0 py-1" aria-label="Order progress">
      {STEPS.map((step, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        const future = i > currentIdx;

        return (
          <div key={step.status} className="flex items-center">
            {/* Step dot + label */}
            <div className="flex flex-col items-center">
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                  done
                    ? "bg-moss text-white"
                    : active
                    ? "bg-charcoal text-white ring-2 ring-charcoal/20 ring-offset-1"
                    : "border border-linen bg-white text-warm-gray/40"
                }`}
              >
                {done ? (
                  <svg viewBox="0 0 12 12" fill="none" className="h-3 w-3">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : active ? (
                  <span className="block h-2 w-2 rounded-full bg-white" />
                ) : (
                  <span className="block h-1.5 w-1.5 rounded-full bg-linen" />
                )}
              </div>
              <span
                className={`mt-0.5 whitespace-nowrap text-[10px] leading-tight ${
                  done ? "text-moss" : active ? "font-medium text-charcoal" : "text-warm-gray/50"
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line between steps */}
            {i < STEPS.length - 1 && (
              <div
                className={`mx-1 mb-3.5 h-px w-6 sm:w-8 flex-shrink-0 transition-colors ${
                  i < currentIdx ? "bg-moss" : "bg-linen"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
