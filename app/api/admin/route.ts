import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

// ─── CORS headers — allow the admin HTML file from any origin ─────────────────
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-secret",
};

// Preflight handler (browser sends OPTIONS before every cross-origin request)
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

// ─── Admin helpers ────────────────────────────────────────────────────────────
function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function checkAdminSecret(req: NextRequest): boolean {
  const secret = req.headers.get("x-admin-secret");
  const expected = process.env.ADMIN_SECRET;
  if (!expected) return false;
  return secret === expected;
}

function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status, headers: CORS });
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  if (!checkAdminSecret(req)) return json({ error: "Unauthorized" }, 401);

  const db = getAdminClient();
  if (!db) return json({ error: "Admin client unavailable — check SUPABASE_SERVICE_ROLE_KEY env var" }, 500);

  const { searchParams } = req.nextUrl;
  const resource = searchParams.get("resource");

  try {
    switch (resource) {
      case "stats": {
        const [users, creators, products, orders, conversations, feedback] = await Promise.all([
          db.from("profiles").select("id", { count: "exact", head: true }).eq("role", "user"),
          db.from("profiles").select("id", { count: "exact", head: true }).eq("role", "creator"),
          db.from("products").select("id", { count: "exact", head: true }),
          db.from("orders").select("id", { count: "exact", head: true }),
          db.from("conversations").select("id", { count: "exact", head: true }),
          db.from("feedback").select("id", { count: "exact", head: true }),
        ]);
        return json({
          users: users.count ?? 0,
          creators: creators.count ?? 0,
          products: products.count ?? 0,
          orders: orders.count ?? 0,
          conversations: conversations.count ?? 0,
          feedback: feedback.count ?? 0,
        });
      }

      case "users": {
        const page = parseInt(searchParams.get("page") ?? "0");
        const pageSize = 30;
        const role = searchParams.get("role") ?? undefined;
        let q = db
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false })
          .range(page * pageSize, page * pageSize + pageSize - 1);
        if (role) q = q.eq("role", role);
        const { data, error } = await q;
        if (error) throw error;
        return json(data);
      }

      case "products": {
        const page = parseInt(searchParams.get("page") ?? "0");
        const pageSize = 30;
        const { data, error } = await db
          .from("products")
          .select("*, creator:profiles(id, full_name, store_name, email)")
          .order("created_at", { ascending: false })
          .range(page * pageSize, page * pageSize + pageSize - 1);
        if (error) throw error;
        return json(data);
      }

      case "orders": {
        const page = parseInt(searchParams.get("page") ?? "0");
        const pageSize = 30;
        const status = searchParams.get("status") ?? undefined;
        let q = db
          .from("orders")
          .select(`
            *,
            customer:profiles!orders_user_id_fkey(id, full_name, email),
            creator:profiles!orders_creator_id_fkey(id, full_name, store_name, email),
            product:products(id, name, image_url, price_inr)
          `)
          .order("created_at", { ascending: false })
          .range(page * pageSize, page * pageSize + pageSize - 1);
        if (status) q = q.eq("status", status);
        const { data, error } = await q;
        if (error) throw error;
        return json(data);
      }

      case "conversations": {
        const page = parseInt(searchParams.get("page") ?? "0");
        const pageSize = 30;
        const { data, error } = await db
          .from("conversations")
          .select(`
            *,
            user:profiles!conversations_user_id_fkey(id, full_name, email, avatar_url),
            creator:profiles!conversations_creator_id_fkey(id, full_name, store_name, email, avatar_url),
            product:products(id, name, image_url)
          `)
          .order("updated_at", { ascending: false })
          .range(page * pageSize, page * pageSize + pageSize - 1);
        if (error) throw error;
        return json(data);
      }

      case "messages": {
        const conversationId = searchParams.get("conversationId");
        if (!conversationId) return json({ error: "conversationId required" }, 400);
        const { data, error } = await db
          .from("messages")
          .select("*, sender:profiles(id, full_name, avatar_url, role)")
          .eq("conversation_id", conversationId)
          .order("created_at", { ascending: true });
        if (error) throw error;
        return json(data);
      }

      case "feedback": {
        const page = parseInt(searchParams.get("page") ?? "0");
        const pageSize = 30;
        const { data, error } = await db
          .from("feedback")
          .select("*, user:profiles(id, full_name, email)")
          .order("created_at", { ascending: false })
          .range(page * pageSize, page * pageSize + pageSize - 1);
        if (error) throw error;
        return json(data);
      }

      case "user_detail": {
        const userId = searchParams.get("userId");
        if (!userId) return json({ error: "userId required" }, 400);
        const [profile, orders, products] = await Promise.all([
          db.from("profiles").select("*").eq("id", userId).single(),
          db.from("orders")
            .select("*, product:products(id, name, image_url, price_inr)")
            .or(`user_id.eq.${userId},creator_id.eq.${userId}`)
            .order("created_at", { ascending: false })
            .limit(20),
          db.from("products")
            .select("*")
            .eq("creator_id", userId)
            .order("created_at", { ascending: false })
            .limit(20),
        ]);
        return json({
          profile: profile.data,
          orders: orders.data ?? [],
          products: products.data ?? [],
        });
      }

      default:
        return json({ error: "Unknown resource" }, 400);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ error: message }, 500);
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  if (!checkAdminSecret(req)) return json({ error: "Unauthorized" }, 401);

  const db = getAdminClient();
  if (!db) return json({ error: "Admin client unavailable — check SUPABASE_SERVICE_ROLE_KEY env var" }, 500);

  const body = await req.json();
  const { action } = body;

  try {
    switch (action) {
      case "delete_user": {
        const { error } = await db.auth.admin.deleteUser(body.userId);
        if (error) throw error;
        return json({ success: true });
      }
      case "delete_product": {
        const { error } = await db.from("products").delete().eq("id", body.productId);
        if (error) throw error;
        return json({ success: true });
      }
      case "delete_order": {
        const { error } = await db.from("orders").delete().eq("id", body.orderId);
        if (error) throw error;
        return json({ success: true });
      }
      case "delete_message": {
        const { error } = await db.from("messages").delete().eq("id", body.messageId);
        if (error) throw error;
        return json({ success: true });
      }
      case "delete_conversation": {
        const { error } = await db.from("conversations").delete().eq("id", body.conversationId);
        if (error) throw error;
        return json({ success: true });
      }
      case "delete_feedback": {
        const { error } = await db.from("feedback").delete().eq("id", body.feedbackId);
        if (error) throw error;
        return json({ success: true });
      }
      case "toggle_product_active": {
        const { data: product } = await db.from("products").select("is_active").eq("id", body.productId).single();
        const { error } = await db.from("products").update({ is_active: !product?.is_active }).eq("id", body.productId);
        if (error) throw error;
        return json({ success: true, is_active: !product?.is_active });
      }
      case "update_order_status": {
        const { error } = await db.from("orders").update({ status: body.status }).eq("id", body.orderId);
        if (error) throw error;
        return json({ success: true });
      }
      case "send_admin_message": {
        const { error } = await db.from("messages").insert({
          conversation_id: body.conversationId,
          sender_id: body.senderId,
          body: body.body,
        });
        if (error) throw error;
        await db.from("conversations").update({ updated_at: new Date().toISOString() }).eq("id", body.conversationId);
        return json({ success: true });
      }
      case "update_profile": {
        const { userId, updates } = body;
        const { error } = await db.from("profiles").update(updates).eq("id", userId);
        if (error) throw error;
        return json({ success: true });
      }
      case "change_role": {
        const { error } = await db.from("profiles").update({ role: body.role }).eq("id", body.userId);
        if (error) throw error;
        return json({ success: true });
      }
      default:
        return json({ error: "Unknown action" }, 400);
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return json({ error: message }, 500);
  }
}