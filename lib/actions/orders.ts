"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionState, OrderStatus } from "@/lib/types";

// Helper — fire-and-forget notification insert using service-role client.
// Bypasses RLS so server actions can write notifications for ANY user.
// Logs errors so silent failures become visible in server logs.
async function createNotification(
  userId: string,
  type: string,
  title: string,
  body: string,
  href: string | null = null
) {
  const admin = createAdminClient();
  if (!admin) {
    console.error("[createNotification] Admin client unavailable — SUPABASE_SERVICE_ROLE_KEY missing?");
    return;
  }
  const { error } = await admin
    .from("notifications")
    .insert({ user_id: userId, type, title, body, href });
  if (error) {
    console.error("[createNotification] INSERT failed:", error.message, { userId, type, title });
  } else {
    console.log("[createNotification] OK →", { userId, type, title });
  }
}

export async function placeOrder(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "AUTH_REQUIRED" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "user") {
    return { error: "Only customers can place orders." };
  }

  const creatorId = String(formData.get("creator_id") ?? "");
  const productId = String(formData.get("product_id") ?? "") || null;
  const customRequest = String(formData.get("custom_request") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  // Snapshot: fetch product name + image now so order history survives deletion.
  let productNameSnapshot: string | null = null;
  let productImageSnapshot: string | null = null;

  if (productId) {
    const { data: existing } = await supabase
      .from("orders")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("product_id", productId)
      .in("status", ["pending", "confirmed", "in_progress"])
      .maybeSingle();

    if (existing) {
      return {
        error: "You already have an active order for this piece.",
        alreadyExists: true,
      };
    }

    const { data: productData } = await supabase
      .from("products")
      .select("name, image_url")
      .eq("id", productId)
      .single();

    if (productData) {
      productNameSnapshot = productData.name;
      productImageSnapshot = productData.image_url;
    }
  }

  const { error } = await supabase.from("orders").insert({
    user_id: user.id,
    creator_id: creatorId,
    product_id: productId,
    custom_request: customRequest || null,
    notes: notes || null,
    status: "pending",
    product_name_snapshot: productNameSnapshot,
    product_image_snapshot: productImageSnapshot,
  });

  if (error) return { error: error.message };

  // Notify creator of new order
  const orderLabel = productNameSnapshot ?? "Custom Request";
  await createNotification(
    creatorId,
    "order_placed",
    "New order received",
    `A customer placed an order for "${orderLabel}".`,
    "/dashboard/creator"
  );

  revalidatePath("/dashboard/user");
  revalidatePath("/dashboard/creator");
  // Revalidate the product page so hasActiveOrder prop updates on next visit
  if (productId) {
    revalidatePath(`/marketplace/${productId}`);
  }
  return { success: true };
}

export async function updateOrderNotes(
  orderId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const customRequest = String(formData.get("custom_request") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();

  const { error } = await supabase
    .from("orders")
    .update({ custom_request: customRequest || null, notes: notes || null })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .eq("status", "pending"); // only allow editing pending orders

  if (error) return { error: error.message };

  revalidatePath("/dashboard/user");
  return { success: true };
}

export async function updateOrderStatusForm(
  orderId: string,
  formData: FormData
): Promise<ActionState> {
  const status = formData.get("status") as OrderStatus;
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  // Fetch current order to guard against modifying cancelled orders.
  const { data: current, error: fetchError } = await supabase
    .from("orders")
    .select("status, user_id, product_name_snapshot")
    .eq("id", orderId)
    .eq("creator_id", user.id)
    .single();

  if (fetchError || !current) return { error: "Order not found." };

  if (current.status === "cancelled") {
    return { error: "Cancelled orders cannot be modified." };
  }

  // Validate allowed transitions
  const ALLOWED: Partial<Record<OrderStatus, OrderStatus[]>> = {
    pending: ["confirmed"],
    confirmed: ["in_progress"],
    in_progress: ["completed"],
  };

  const allowed = ALLOWED[current.status as OrderStatus] ?? [];
  if (!allowed.includes(status)) {
    return {
      error: `Cannot transition from "${current.status}" to "${status}".`,
    };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .eq("creator_id", user.id);

  if (error) return { error: error.message };

  // Notify customer of status change
  const orderLabel = current.product_name_snapshot ?? "your order";
  const notifMap: Partial<Record<OrderStatus, { type: string; title: string; body: string }>> = {
    confirmed: { type: "order_accepted", title: "Order accepted!", body: `Your order for "${orderLabel}" has been accepted by the creator.` },
    in_progress: { type: "order_update", title: "Order in progress", body: `The creator has started working on "${orderLabel}".` },
    completed: { type: "order_completed", title: "Order completed 🎉", body: `Your order for "${orderLabel}" has been marked complete.` },
  };
  const notif = notifMap[status];
  if (notif && current.user_id) {
    await createNotification(current.user_id, notif.type, notif.title, notif.body, "/dashboard/user");
  }

  revalidatePath("/dashboard/creator");
  return { success: true };
}

export async function cancelOrder(orderId: string): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  // Fetch order first so we can notify the creator after cancellation
  const { data: current, error: fetchError } = await supabase
    .from("orders")
    .select("creator_id, product_name_snapshot")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .single();

  if (fetchError || !current) {
    return { error: "Could not cancel order. It may have already been updated." };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({ status: "cancelled", cancelled_by: "customer" })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .eq("status", "pending")
    .select("id");

  if (error) return { error: error.message };

  // If no rows were returned, the update was silently blocked — either the
  // order does not exist, belongs to another user, or is not pending.
  if (!data || data.length === 0) {
    return { error: "Could not cancel order. It may have already been updated." };
  }

  // Notify creator that the customer cancelled
  if (current.creator_id) {
    const orderLabel = current.product_name_snapshot ?? "an order";
    await createNotification(
      current.creator_id,
      "order_cancelled",
      "Order cancelled by customer",
      `A customer cancelled their order for "${orderLabel}".`,
      "/dashboard/creator"
    );
  }

  revalidatePath("/dashboard/user");
  revalidatePath("/dashboard/creator");
  return { success: true };
}

export async function cancelOrderByCreator(
  orderId: string,
  reason: string
): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  // Fetch current order to validate transition
  const { data: current, error: fetchError } = await supabase
    .from("orders")
    .select("status, user_id, product_name_snapshot")
    .eq("id", orderId)
    .eq("creator_id", user.id)
    .single();

  if (fetchError || !current) return { error: "Order not found." };

  const cancellable: OrderStatus[] = ["pending", "confirmed", "in_progress"];
  if (!cancellable.includes(current.status as OrderStatus)) {
    return { error: `Cannot cancel an order with status "${current.status}".` };
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      status: "cancelled",
      cancelled_by: "creator",
      cancel_reason: reason,
    })
    .eq("id", orderId)
    .eq("creator_id", user.id)
    .select("id");

  if (error) return { error: error.message };
  if (!data || data.length === 0) {
    return { error: "Could not cancel order. It may have already been updated." };
  }

  // Notify customer
  if (current.user_id) {
    const orderLabel = current.product_name_snapshot ?? "your order";
    await createNotification(
      current.user_id,
      "order_cancelled",
      "Order cancelled",
      `The creator has cancelled your order for "${orderLabel}". Reason: ${reason}.`,
      "/dashboard/user"
    );
  }

  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/user");
  return { success: true };
}

export async function addOrderUpdate(
  orderId: string,
  body: string
): Promise<ActionState> {
  if (!isSupabaseConfigured()) return { error: "Database not configured." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const trimmed = body.trim();
  if (!trimmed) return { error: "Update cannot be empty." };

  // Verify this user is the creator of the order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("id, status, user_id, product_name_snapshot")
    .eq("id", orderId)
    .eq("creator_id", user.id)
    .single();

  if (orderError || !order) return { error: "Order not found." };
  if (order.status === "cancelled" || order.status === "completed") {
    return { error: "Cannot add updates to a closed order." };
  }

  const { error } = await supabase.from("order_updates").insert({
    order_id: orderId,
    creator_id: user.id,
    body: trimmed,
  });

  if (error) return { error: error.message };

  // Notify customer
  if (order.user_id) {
    const orderLabel = order.product_name_snapshot ?? "your order";
    await createNotification(
      order.user_id,
      "order_update",
      "New update from creator",
      `Progress update on "${orderLabel}": ${trimmed.slice(0, 80)}${trimmed.length > 80 ? "…" : ""}`,
      "/dashboard/user"
    );
  }

  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/user");
  return { success: true };
}
