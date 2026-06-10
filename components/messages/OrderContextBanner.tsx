import Link from "next/link";
import { cn } from "@/lib/utils";
import type { OrderStatus } from "@/lib/types";

type Props = {
  orderId: string;
  productName: string | null;
  status: OrderStatus;
  imageUrl?: string | null;
  /** The current viewer's role — determines which dashboard to link to */
  viewerRole: "user" | "creator";
};

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-sand text-warm-gray",
  confirmed: "bg-saffron/20 text-saffron",
  in_progress: "bg-clay/20 text-clay",
  completed: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-terracotta/10 text-terracotta",
};

export function OrderContextBanner({
  orderId,
  productName,
  status,
  imageUrl,
  viewerRole,
}: Props) {
  const dashboardHref =
    viewerRole === "creator" ? "/dashboard/creator" : "/dashboard/user";

  return (
    <Link
      href={dashboardHref}
      className="flex items-center gap-3 border-b border-linen bg-sand/30 px-4 py-2.5 transition-colors hover:bg-sand/50"
    >
      {imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={productName ?? "Product"}
          className="h-8 w-8 shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-charcoal">
          {productName ?? "Custom Order"}
        </p>
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium",
            STATUS_COLORS[status]
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
          {STATUS_LABELS[status]}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1 text-[10px] text-warm-gray">
        <span>View order</span>
        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
