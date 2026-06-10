"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";

import type { ActionState } from "@/lib/types";

async function uploadProductImage(
  file: File,
  userId: string
): Promise<{ url?: string; error?: string }> {
  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(path, file, { upsert: false });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("product-images").getPublicUrl(path);

  return { url: publicUrl };
}

export async function createProduct(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in as a creator to add products." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "creator") {
    return { error: "Only creators can add products." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = Number(formData.get("price_inr"));
  const category = String(formData.get("category") ?? "");

  if (!name) return { error: "Product name is required." };
  if (!description) return { error: "Description is required." };
  if (!priceRaw || priceRaw <= 0) return { error: "Please enter a valid price." };

  const imageFile = formData.get("image") as File | null;
  if (!imageFile || imageFile.size === 0) {
    return { error: "Please upload a product image." };
  }

  const { url, error: uploadErr } = await uploadProductImage(imageFile, user.id);
  if (uploadErr || !url) return { error: uploadErr ?? "Image upload failed. Check your storage bucket." };

  const { error } = await supabase.from("products").insert({
    creator_id: user.id,
    name,
    description,
    price_inr: priceRaw,
    category,
    image_url: url,
    is_active: true,
  });

  if (error) return { error: error.message };

  // Revalidate all affected paths so server caches are fresh before client navigates
  revalidatePath("/marketplace");
  revalidatePath("/dashboard/creator");

  // Never use redirect() here — it throws NEXT_REDIRECT inside useActionState.
  // Return redirectTo; the client component handles router.push() after success.
  return { success: true, redirectTo: "/dashboard/creator" };
}

export async function updateProduct(
  productId: string,
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priceRaw = Number(formData.get("price_inr"));

  if (!name) return { error: "Product name is required." };
  if (!description) return { error: "Description is required." };
  if (!priceRaw || priceRaw <= 0) return { error: "Please enter a valid price." };

  const updates: Record<string, unknown> = {
    name,
    description,
    price_inr: priceRaw,
    category: String(formData.get("category") ?? ""),
    is_active: formData.get("is_active") === "on",
  };

  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const { url, error: uploadErr } = await uploadProductImage(imageFile, user.id);
    if (uploadErr) return { error: uploadErr };
    if (url) updates.image_url = url;
  }

  const { error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", productId)
    .eq("creator_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/marketplace");
  revalidatePath(`/marketplace/${productId}`);
  revalidatePath("/dashboard/creator");

  return { success: true };
}

export async function deleteProduct(productId: string): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  // Soft-delete: mark inactive rather than hard-deleting.
  // This preserves the product FK on existing orders so order history
  // can still display the product name and image even after deletion.
  const { error } = await supabase
    .from("products")
    .update({ is_active: false })
    .eq("id", productId)
    .eq("creator_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/marketplace");
  revalidatePath("/dashboard/creator");

  return { success: true };
}

export async function deleteProductForm(productId: string): Promise<void> {
  await deleteProduct(productId);
}

export async function restoreProduct(productId: string): Promise<ActionState> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { error } = await supabase
    .from("products")
    .update({ is_active: true })
    .eq("id", productId)
    .eq("creator_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/marketplace");
  revalidatePath("/dashboard/creator");

  return { success: true };
}
