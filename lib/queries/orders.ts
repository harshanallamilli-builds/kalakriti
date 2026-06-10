import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Order, OrderStatus, OrderUpdate } from "@/lib/types";

const ORDER_SELECT = `
  *,
  product:products (id, name, image_url, price_inr, is_active),
  order_updates (id, order_id, creator_id, body, created_at)
`;

const ORDER_SELECT_WITH_CUSTOMER = `
  *,
  product:products (id, name, image_url, price_inr, is_active),
  customer:profiles!user_id (id, full_name, email),
  order_updates (id, order_id, creator_id, body, created_at)
`;

export async function getCreatorOrders(creatorId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT_WITH_CUSTOMER)
    .eq("creator_id", creatorId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as Order[];
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return (data ?? []) as Order[];
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ error?: string }> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured" };
  }

  const supabase = await createClient();

  const { data: current, error: fetchError } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (fetchError || !current) return { error: "Order not found." };
  if (current.status === "cancelled") {
    return { error: "Cancelled orders cannot be modified." };
  }

  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  return error ? { error: error.message } : {};
}
