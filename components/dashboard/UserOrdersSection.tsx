"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { cancelOrder, updateOrderNotes } from "@/lib/actions/orders";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EmptyState } from "@/components/ui/EmptyState";
import { OrderTimeline } from "@/components/dashboard/OrderTimeline";
import { OrderDates } from "@/components/dashboard/OrderDates";
import { formatINR, resolveOrderProductName, resolveOrderProductImage } from "@/lib/utils";
import { addToast } from "@/lib/hooks/useToast";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/config";
import type { Order, OrderStatus, OrderUpdate } from "@/lib/types";
import Image from "next/image";

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

// Customer-specific helper text
const STATUS_HELPER_CUSTOMER: Record<OrderStatus, string> = {
  pending: "Waiting for creator response.",
  confirmed: "Creator has accepted your order.",
  in_progress: "Creator is working on your order.",
  completed: "Your order has been completed.",
  cancelled: "This order was cancelled and cannot be modified.",
};

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: "bg-saffron/15 text-saffron",
  confirmed: "bg-sage/15 text-moss",
  in_progress: "bg-clay/20 text-clay",
  completed: "bg-sage/25 text-moss",
  cancelled: "bg-warm-gray/10 text-warm-gray",
};

function isDeletedListing(order: Order): boolean {
  return !!order.product_id && order.product !== null && order.product !== undefined && order.product.is_active === false;
}

type Props = { orders: Order[]; userId: string };

export function UserOrdersSection({ orders: initialOrders, userId }: Props) {
  const [orders, setOrders] = useState<Order[]>(initialOrders);

  const activeCount = orders.filter(
    (o) => o.status !== "cancelled" && o.status !== "completed"
  ).length;

  useEffect(() => {
    if (!isSupabaseConfigured() || !userId) return;
    const supabase = createClient();
    const channel = supabase
      .channel(`user-orders:${userId}`)
      .on("postgres_changes", {
        event: "UPDATE",
        schema: "public",
        table: "orders",
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        const u = payload.new as Order;
        setOrders((prev) => prev.map((o) => o.id === u.id
          ? { ...o, status: u.status, notes: u.notes, custom_request: u.custom_request, cancelled_by: u.cancelled_by, cancel_reason: u.cancel_reason, confirmed_at: u.confirmed_at, in_progress_at: u.in_progress_at, completed_at: u.completed_at, cancelled_at: u.cancelled_at }
          : o
        ));
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [userId]);

  return (
    <section className="rounded-3xl border border-linen bg-white p-4 sm:p-6 shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-xl text-charcoal">
          Orders
          {activeCount > 0 && (
            <span className="ml-2 rounded-full bg-saffron/15 px-2 py-0.5 font-sans text-sm text-saffron">
              {activeCount} active
            </span>
          )}
        </h2>
        <Link href="/messages" className="shrink-0 text-sm text-terracotta hover:text-charcoal">
          Messages →
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6">
          <EmptyState
            icon="🛍️"
            title="No orders yet"
            description="Browse the marketplace and place your first order with an artisan."
            actionLabel="Browse marketplace"
            actionHref="/marketplace"
          />
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {orders.map((order) => (
            <OrderRow
              key={order.id}
              order={order}
              onUpdate={(updated) => setOrders((prev) => prev.map((o) => o.id === updated.id ? updated : o))}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function OrderRow({ order, onUpdate }: { order: Order; onUpdate: (o: Order) => void }) {
  const [expanded, setExpanded] = useState(false);
  const [cancelPending, startCancelTransition] = useTransition();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [cancelError, setCancelError] = useState("");
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesPending, startNoteTransition] = useTransition();
  const [notesError, setNotesError] = useState("");

  const effectiveStatus = order.status;
  const isCancelled = effectiveStatus === "cancelled";
  const canCancel = effectiveStatus === "pending";
  const canEditNotes = effectiveStatus === "pending";
  const deletedListing = isDeletedListing(order);
  const updates: OrderUpdate[] = order.order_updates ?? [];
  const productImg = resolveOrderProductImage(order);

  function handleConfirmCancel() {
    setShowCancelConfirm(false);
    startCancelTransition(async () => {
      const result = await cancelOrder(order.id);
      if (result.success) {
        onUpdate({ ...order, status: "cancelled", cancelled_by: "customer" });
        addToast("Request cancelled", "info");
      } else {
        setCancelError(result.error ?? "Could not cancel. Please try again.");
      }
    });
  }

  function handleSaveNotes(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const customRequest = String(fd.get("custom_request") ?? "").trim();
    const notes = String(fd.get("notes") ?? "").trim();
    setNotesError("");
    startNoteTransition(async () => {
      const result = await updateOrderNotes(order.id, {}, fd);
      if (result.success) {
        onUpdate({ ...order, custom_request: customRequest || null, notes: notes || null });
        setEditingNotes(false);
      } else {
        setNotesError(result.error ?? "Could not save.");
      }
    });
  }

  return (
    <>
      <li className="rounded-2xl border border-linen bg-white shadow-[var(--shadow-card)]">
        {/* Collapsed header — always visible */}
        <button type="button" onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-3 p-4 text-left"
        >
          {productImg ? (
            <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-sand">
              <Image src={productImg} alt="" fill className="object-cover" />
            </div>
          ) : (
            <div className="h-11 w-11 shrink-0 rounded-lg bg-sand" />
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-charcoal leading-snug">
              {resolveOrderProductName(order)}
            </p>
            <p className="text-xs text-warm-gray/80">{STATUS_HELPER_CUSTOMER[effectiveStatus]}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[effectiveStatus]}`}>
              {STATUS_LABELS[effectiveStatus]}
            </span>
            <svg className={`h-4 w-4 text-warm-gray transition-transform ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {expanded && (
          <div className="border-t border-linen px-4 pb-4 pt-3 space-y-3">

            {/* Timeline */}
            <OrderTimeline status={effectiveStatus} />

            {/* Dates */}
            <OrderDates order={order} />

            {/* Deleted listing notice */}
            {deletedListing && (
              <div className="rounded-lg bg-sand/50 px-3 py-2 text-xs text-warm-gray leading-relaxed">
                <span className="font-medium text-charcoal">{order.product?.name ?? order.product_name_snapshot ?? "This listing"}</span>
                {" "}is no longer available for new orders. Your existing order is unaffected.
              </div>
            )}

            {/* Cancellation info */}
            {isCancelled && order.cancelled_by && (
              <div className="rounded-lg bg-warm-gray/10 px-3 py-2 text-sm">
                <p className="font-medium text-charcoal">
                  Cancelled by {order.cancelled_by === "creator" ? "creator" : "you"}
                </p>
                {order.cancel_reason && (
                  <p className="mt-0.5 text-xs text-warm-gray">Reason: {order.cancel_reason}</p>
                )}
              </div>
            )}

            {/* Request details */}
            {!editingNotes && order.custom_request && (
              <p className="text-xs text-warm-gray">{order.custom_request}</p>
            )}

            {/* Edit notes form */}
            {editingNotes && !isCancelled && (
              <form onSubmit={handleSaveNotes} className="space-y-2">
                <textarea name="custom_request" defaultValue={order.custom_request ?? ""} rows={2}
                  placeholder="Customisation or size details…"
                  className="w-full resize-none rounded-xl border border-linen bg-sand/30 px-3 py-2 text-sm focus:border-clay focus:outline-none"
                />
                <textarea name="notes" defaultValue={order.notes ?? ""} rows={1}
                  placeholder="Additional notes (optional)"
                  className="w-full resize-none rounded-xl border border-linen bg-sand/30 px-3 py-2 text-sm focus:border-clay focus:outline-none"
                />
                {notesError && <p className="text-xs text-terracotta">{notesError}</p>}
                <div className="flex gap-2">
                  <button type="submit" disabled={notesPending}
                    className="rounded-full bg-charcoal px-4 py-1.5 text-xs font-medium text-cream hover:bg-terracotta disabled:opacity-40"
                  >{notesPending ? "Saving…" : "Save notes"}</button>
                  <button type="button" onClick={() => setEditingNotes(false)}
                    className="rounded-full border border-linen px-4 py-1.5 text-xs text-warm-gray hover:text-charcoal"
                  >Cancel</button>
                </div>
              </form>
            )}

            {cancelError && <p className="text-xs text-terracotta">{cancelError}</p>}

            {/* Actions */}
            {!isCancelled && (canCancel || canEditNotes) && !editingNotes && (
              <div className="flex flex-wrap items-center gap-4">
                {canEditNotes && (
                  <button type="button" onClick={() => setEditingNotes(true)}
                    className="text-xs text-warm-gray underline hover:text-terracotta"
                  >Edit notes</button>
                )}
                {canCancel && (
                  <button type="button" onClick={() => setShowCancelConfirm(true)} disabled={cancelPending}
                    className="text-xs text-warm-gray underline hover:text-terracotta disabled:opacity-40"
                  >{cancelPending ? "Cancelling…" : "Cancel request"}</button>
                )}
              </div>
            )}

            {/* Creator progress updates */}
            {updates.length > 0 && (
              <div className="border-t border-linen/60 pt-3">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-warm-gray">Creator updates</p>
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
              </div>
            )}
          </div>
        )}
      </li>

      <ConfirmModal
        open={showCancelConfirm}
        title="Cancel this order?"
        description="This action cannot be undone."
        confirmLabel="Cancel Order"
        cancelLabel="Back"
        danger
        onConfirm={handleConfirmCancel}
        onCancel={() => setShowCancelConfirm(false)}
      />
    </>
  );
}
