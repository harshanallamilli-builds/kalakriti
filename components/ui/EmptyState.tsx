import Link from "next/link";
import { Button } from "@/components/ui/Button";

type EmptyStateProps = {
  icon?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
};

export function EmptyState({
  icon = "✦",
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-linen bg-sand/30 px-8 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-cream font-heading text-2xl text-saffron shadow-[var(--shadow-card)]">
        {icon}
      </span>
      <h3 className="mt-6 font-heading text-2xl text-charcoal">{title}</h3>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-warm-gray">
        {description}
      </p>
      {actionLabel && actionHref && (
        <Button href={actionHref} variant="secondary" className="mt-8">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
