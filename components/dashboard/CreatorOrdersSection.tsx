"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import Image from "next/image";
import { updateOrderStatusForm, cancelOrderByCreator, addOrderUpdate } from "@/lib/actions/orders";
import { formatINR, resolveOrderProductName, resolveOrderProductImage } from "@/lib/utils";
import { addToast } from "@/lib/hooks/useToast";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { OrderTimeline } from "@/components/dashboard/OrderTimeline";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderDates } from "@/components/dashboard/OrderDates";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import type { Order, OrderStatus, OrderUpdate, CreatorCancelReason } from "@/lib/types";
import { CREATOR_CANCEL_REASONS } from "@/lib/types";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_HELPER_CREATOR: Record<OrderStatus, string> = {
  pending: "You need to review this order.",
  confirmed: "You have accepted this order.",
  in_progress: "You are currently working on this order.",
  completed: "You marked this order as completed.",
  cancelled: "This order was cancelled and cannot be modified.",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-saffron/15 text-saffron",
  confirmed: "bg-sage/15 text-moss",
  in_progress: "bg-clay/20 text-clay",
  completed: "bg-sage/25 text-moss",
  cancelled: "bg-warm-gray/15 text-warm-gray",
};

// Only forward transitions; cancellation goes through a dedicated action
const FORWARD_OPTIONS: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: "confirmed",
  confirmed: "in_progress",
  in_progress: "completed",
};

const FILTER_TABS: { value: OrderStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Done" },
];

function isDeletedListing(order: Order): boolean {
  return !!order.product_id && order.product !== null && order.product !== undefined && order.product.is_active === false;
}

const CANCELLABLE_STATUSES: OrderStatus[] = ["pending", "confirmed", "in_progress"];

type Props = { orders: Order[]; creatorId: string };

export function CreatorOrdersSection({ orders: initialOrders, creatorId }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  const filtered = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  useEffect(() => {
    if (!isSupabaseConfigured() || !creatorId) return;
    const supabase = createClient();

    const channel = supabase
      .channel(`creator-orders:${creatorId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "orders",
        filter: `creator_id=eq.${creatorId}`,
      }, async (payload) => {
        const newOrder = payload.new as Order;
        const { data: enriched } = await supabase
          .from("orders")
          .select("*, product:products(id,name,image_url,price_inr,is_active), customer:profiles!user_id(id,full_name,email), order_updates(id,order_id,creator_id,body,created_at)")
          .eq("id", newOrder.id)
          .single();
        const order = (enriched ?? newOrder) as Order;
        setOrders((prev) => prev.some((o) => o.id === order.id) ? prev : [order, ...prev]);
        setNewOrderIds((prev) => new Set(prev).add(newOrder.id));
        setTimeout(() => {
          setNewOrderIds((prev) => { const next = new Set(prev); next.delete(newOrder.id); return next; });
        }, 8000);
      })
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `creator_id=eq.${creatorId}`,
      }, (payload) => {
        const u = payload.new as Order;
        setOrders((prev) => prev.map((o) => o.id === u.id
          ? { ...o, status: u.status, notes: u.notes, custom_request: u.custom_request, cancelled_by: u.cancelled_by, cancel_reason: u.cancel_reason, confirmed_at: u.confirmed_at, in_progress_at: u.in_progress_at, completed_at: u.completed_at, cancelled_at: u.cancelled_at }
          : o
        ));
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [creatorId]);

  return (
    <section>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-2xl text-charcoal">
          Incoming orders
          {pendingCount > 0 && (
            <span className="ml-2 rounded-full bg-saffron/15 px-2.5 py-0.5 font-sans text-sm font-medium text-saffron">
              {pendingCount} new
            </span>
          )}
        </h2>
      </div>

      {orders.length > 0 && (
        <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0">
          {FILTER_TABS.map((tab) => (
            <button key={tab.value} onClick={() => setFilter(tab.value)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                filter === tab.value ? "bg-charcoal text-cream" : "border border-linen bg-white text-warm-gray hover:text-charcoal"
              }`}
            >
              {tab.label}
              {tab.value !== "all" && (
                <span className="ml-1.5 opacity-60">({orders.filter((o) => o.status === tab.value).length})</span>
              )}
            </button>
          ))}
        </div>
      )}

      {orders.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No orders yet"
          description="When customers place orders for your pieces, they'll appear here. Make sure your listings are active!"
          actionLabel="View your listings"
          actionHref="#products"
        />
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-linen bg-sand/20 px-6 py-8 text-center">
          <p className="text-sm text-warm-gray">No {STATUS_LABELS[filter as OrderStatus]?.toLowerCase()} orders.</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {filtered.map((order) => (
            <OrderCard key={order.id} order={order} isNew={newOrderIds.has(order.id)}
              onUpdate={(updated) => setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o))}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function OrderCard({ order, isNew, onUpdate }: { order: Order; isNew: boolean; onUpdate: (o: Order) => void }) {
  const [expanded, setExpanded] = useState(order.status === "pending" || isNew);
  const [isPending, startTransition] = useTransition();
  const [optimisticStatus, setOptimisticStatus] = useState<OrderStatus>(order.status);
  const [statusError, setStatusError] = useState("");
  const [showCompleteConfirm, setShowCompleteConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelReason, setCancelReason] = useState<CreatorCancelReason>("Cannot fulfill order");

  // Order updates
  const [updates, setUpdates] = useState<OrderUpdate[]>(order.order_updates ?? []);
  const [updateText, setUpdateText] = useState("");
  const [updatePending, startUpdateTransition] = useTransition();
  const [updateError, setUpdateError] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isCancelled = optimisticStatus === "cancelled";
  const isCompleted = optimisticStatus === "completed";
  const deletedListing = isDeletedListing(order);
  const canCancel = CANCELLABLE_STATUSES.includes(optimisticStatus);
  const nextStatus = FORWARD_OPTIONS[optimisticStatus];
  const dropdownStatuses: OrderStatus[] = ["pending", "confirmed", "in_progress", "completed"];

  useEffect(() => { setOptimisticStatus(order.status); }, [order.status]);
  useEffect(() => { setUpdates(order.order_updates ?? []); }, [order.order_updates]);

  function handleDropdownChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value as OrderStatus;
    if (newStatus === optimisticStatus) return;
    // Only allow forward transitions
    const allowed = FORWARD_OPTIONS[optimisticStatus];
    if (newStatus !== allowed) {
      addToast(`Cannot skip from ${STATUS_LABELS[optimisticStatus]} to ${STATUS_LABELS[newStatus]}`, "error");
      return;
    }
    if (newStatus === "completed") {
      setShowCompleteConfirm(true);
    } else {
      applyStatusChange(newStatus);
    }
  }

  function applyStatusChange(newStatus: OrderStatus) {
    const prevStatus = optimisticStatus;
    setOptimisticStatus(newStatus);
    setStatusError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("status", newStatus);
      const result = await updateOrderStatusForm(order.id, fd);
      if (result.error) {
        setOptimisticStatus(prevStatus);
        setStatusError(result.error);
        addToast("Could not update status", "error");
      } else {
        onUpdate({ ...order, status: newStatus });
        addToast(`Order marked as ${STATUS_LABELS[newStatus].toLowerCase()}`, "success");
      }
    });
  }

  function handleCancelConfirm() {
    setShowCancelConfirm(false);
    const prevStatus = optimisticStatus;
    setOptimisticStatus("cancelled");
    startTransition(async () => {
      const result = await cancelOrderByCreator(order.id, cancelReason);
      if (result.error) {
        setOptimisticStatus(prevStatus);
        addToast("Could not cancel order", "error");
      } else {
        onUpdate({ ...order, status: "cancelled", cancelled_by: "creator", cancel_reason: cancelReason });
        addToast("Order cancelled", "info");
      }
    });
  }

  function handlePostUpdate() {
    const body = updateText.trim();
    if (!body) return;
    setUpdateError("");
    startUpdateTransition(async () => {
      const result = await addOrderUpdate(order.id, body);
      if (result.error) {
        setUpdateError(result.error);
      } else {
        const newUpdate: OrderUpdate = {
          id: crypto.randomUUID(),
          order_id: order.id,
          creator_id: order.creator_id,
          body,
          created_at: new Date().toISOString(),
        };
        setUpdates((prev) => [newUpdate, ...prev]);
        setUpdateText("");
        if (textareaRef.current) textareaRef.current.value = "";
      }
    });
  }

  return (
    <li className={`rounded-2xl border bg-white shadow-[var(--shadow-card)] transition-all duration-500 ${
      isNew ? "border-saffron/40 ring-1 ring-saffron/20" : "border-linen"
    }`}>
      {isNew && (
        <div className="rounded-t-2xl bg-saffron/10 px-4 py-1.5 text-xs font-medium text-saffron">New order received</div>
      )}

      {/* Collapsed header */}
      <button type="button" onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center gap-3 p-4 text-left"
      >
        {resolveOrderProductImage(order) ? (
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-sand">
            <Image src={resolveOrderProductImage(order)!} alt="" fill className="object-cover" />
          </div>
        ) : (
          <div className="h-12 w-12 shrink-0 rounded-xl bg-sand" />
        )}
        <div className="min-w-0 flex-1">
          <p className="break-words font-medium text-charcoal leading-snug">
            {resolveOrderProductName(order)}
            {deletedListing && (
              <span className="ml-1 text-xs font-normal text-warm-gray/60">(deleted listing)</span>
            )}
          </p>
          <p className="mt-0.5 text-sm text-warm-gray">
            {order.customer?.full_name ?? "Customer"}
            {order.product?.price_inr && ` · ${formatINR(Number(order.product.price_inr))}`}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[optimisticStatus]}`}>
            {STATUS_LABELS[optimisticStatus]}
          </span>
          <svg className={`h-4 w-4 shrink-0 text-warm-gray transition-transform ${expanded ? "rotate-180" : ""}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-linen px-4 pb-5 pt-4 space-y-4">

          {/* Customer info */}
          {order.customer && (
            <div className="rounded-xl bg-sand/30 px-3 py-2.5 text-sm">
              <span className="text-warm-gray">From: </span>
              <span className="font-medium text-charcoal">{order.customer.full_name}</span>
              {order.customer.email && (
                <span className="ml-1.5 break-all text-xs text-warm-gray">({order.customer.email})</span>
              )}
            </div>
          )}

          {/* Timeline */}
          <OrderTimeline status={optimisticStatus} />

          {/* Dates */}
          <OrderDates order={{ ...order, status: optimisticStatus }} />

          {/* Deleted listing notice */}
          {deletedListing && (
            <p className="rounded-xl bg-sand/40 px-3 py-2 text-xs text-warm-gray">
              Listing removed from marketplace. Existing orders can still be completed.
            </p>
          )}

          {/* Request details */}
          {order.custom_request && (
            <div className="rounded-xl bg-sand/40 px-3 py-2.5 text-sm text-charcoal/80">
              <span className="font-medium text-warm-gray">Customisation: </span>
              {order.custom_request}
            </div>
          )}
          {order.notes && (
            <div className="rounded-xl bg-sand/20 px-3 py-2.5 text-sm text-charcoal/80">
              <span className="font-medium text-warm-gray">Notes: </span>
              {order.notes}
            </div>
          )}

          {/* Status helper */}
          <p className="text-xs text-warm-gray/80">{STATUS_HELPER_CREATOR[optimisticStatus]}</p>

          {/* Cancellation info */}
          {isCancelled && order.cancelled_by && (
            <div className="rounded-xl bg-warm-gray/10 px-3 py-2.5 text-sm">
              <p className="font-medium text-charcoal">
                Cancelled by {order.cancelled_by === "creator" ? "you" : "customer"}
              </p>
              {order.cancel_reason && (
                <p className="mt-0.5 text-warm-gray text-xs">Reason: {order.cancel_reason}</p>
              )}
            </div>
          )}

          {/* Status controls — dropdown */}
          {!isCancelled && !isCompleted && (
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-warm-gray">Update status</label>
                <select
                  value={optimisticStatus}
                  onChange={handleDropdownChange}
                  disabled={isPending}
                  className="rounded-full border border-linen bg-cream px-3 py-1.5 text-sm focus:border-clay focus:outline-none disabled:opacity-60"
                >
                  {dropdownStatuses.map((s) => {
                    const isAllowed = s === optimisticStatus || s === nextStatus;
                    return (
                      <option key={s} value={s} disabled={!isAllowed}>
                        {STATUS_LABELS[s]}{!isAllowed && s !== optimisticStatus ? " (not yet)" : ""}
                      </option>
                    );
                  })}
                </select>
                {isPending && <span className="text-xs text-warm-gray">Saving…</span>}
              </div>
              {canCancel && (
                <button type="button" onClick={() => setShowCancelConfirm(true)} disabled={isPending}
                  className="rounded-full border border-linen px-4 py-1.5 text-sm text-warm-gray hover:text-terracotta disabled:opacity-40"
                >
                  Cancel order
                </button>
              )}
              {statusError && <span className="text-xs text-terracotta">{statusError}</span>}
            </div>
          )}

          {/* Progress updates */}
          {!isCancelled && (
            <div className="border-t border-linen/60 pt-4">
              <p className="mb-2 text-xs font-medium text-warm-gray uppercase tracking-wide">Progress updates</p>

              {/* Post update — only for active orders */}
              {!isCompleted && (
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-start">
                  <textarea
                    ref={textareaRef}
                    rows={2}
                    placeholder="e.g. Started sketching. Expected completion in 3 days."
                    onChange={(e) => setUpdateText(e.target.value)}
                    className="min-w-0 flex-1 resize-none rounded-xl border border-linen bg-sand/30 px-3 py-2 text-sm focus:border-clay focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handlePostUpdate}
                    disabled={updatePending || !updateText.trim()}
                    className="shrink-0 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-cream hover:bg-espresso disabled:opacity-40 sm:self-start"
                  >
                    {updatePending ? "Posting…" : "Post"}
                  </button>
                </div>
              )}
              {updateError && <p className="mb-2 text-xs text-terracotta">{updateError}</p>}

              {/* Updates list */}
              {updates.length === 0 ? (
                <p className="text-xs text-warm-gray/60">No updates posted yet.</p>
              ) : (
                <ul className="space-y-2">
                  {updates.map((u) => (
                    <li key={u.id} className="rounded-xl bg-sand/30 px-3 py-2">
                      <p className="text-sm text-charcoal">{u.body}</p>
                      <p className="mt-0.5 text-[10px] text-warm-gray/60">
                        {new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(u.created_at))}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}

      {/* Confirm complete */}
      <ConfirmModal
        open={showCompleteConfirm}
        title="Mark this order as completed?"
        description="This indicates the work has been finished."
        confirmLabel="Mark Completed"
        cancelLabel="Back"
        danger={false}
        onConfirm={() => { setShowCompleteConfirm(false); applyStatusChange("completed"); }}
        onCancel={() => setShowCompleteConfirm(false)}
      />

      {/* Confirm cancel */}
      {showCancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-6 sm:items-center" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-espresso/30 backdrop-blur-sm" onClick={() => setShowCancelConfirm(false)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-linen bg-cream p-6 shadow-[var(--shadow-lift)]">
            <h2 className="font-heading text-xl text-charcoal">Cancel this order?</h2>
            <p className="mt-2 text-sm text-warm-gray">The customer will be notified.</p>
            <div className="mt-4">
              <label className="mb-1.5 block text-sm font-medium text-charcoal">Reason</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value as CreatorCancelReason)}
                className="w-full rounded-xl border border-linen bg-white px-3 py-2.5 text-sm focus:border-clay focus:outline-none"
              >
                {CREATOR_CANCEL_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="mt-6 flex gap-3">
              <button type="button" onClick={() => setShowCancelConfirm(false)}
                className="flex-1 rounded-full border border-linen py-2.5 text-sm font-medium text-charcoal hover:bg-sand"
              >Back</button>
              <button type="button" onClick={handleCancelConfirm}
                className="flex-1 rounded-full bg-terracotta py-2.5 text-sm font-medium text-cream hover:bg-charcoal"
              >Cancel Order</button>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
