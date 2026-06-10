"use client";

import { useToasts } from "@/lib/hooks/useToast";
import { cn } from "@/lib/utils";

export function Toaster() {
  const toasts = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="fixed bottom-24 left-1/2 z-[60] flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-8"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "animate-slide-up rounded-full px-5 py-2.5 text-sm font-medium shadow-[var(--shadow-lift)]",
            toast.type === "success" && "bg-moss text-cream",
            toast.type === "error" && "bg-terracotta text-cream",
            toast.type === "info" && "bg-charcoal text-cream"
          )}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
