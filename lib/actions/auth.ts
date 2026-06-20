// "use server";

// import { revalidatePath } from "next/cache";
// import { isSupabaseConfigured } from "@/lib/config";
// import { createClient } from "@/lib/supabase/server";
// import { isValidEmail, isValidPassword, sanitizeText } from "@/lib/validations";
// import type { UserRole } from "@/lib/types";
// import { getDashboardPath } from "@/lib/utils";

// export type AuthState = {
//   error?: string;
//   success?: boolean;
//   /** Client should navigate here after success (signIn/signUp only) */
//   redirectTo?: string;
// };

// export async function signUp(
//   _prev: AuthState,
//   formData: FormData
// ): Promise<AuthState> {
//   if (!isSupabaseConfigured()) {
//     return { error: "Supabase is not configured. Add environment variables." };
//   }

//   const email = sanitizeText(formData.get("email"));
//   const password = String(formData.get("password") ?? "");
//   const fullName = sanitizeText(formData.get("full_name"));
//   const role = String(formData.get("role") ?? "user") as UserRole;
//   const craft = sanitizeText(formData.get("craft"));
//   const storeName = sanitizeText(formData.get("store_name"));
//   const city = sanitizeText(formData.get("city"));
//   const state = sanitizeText(formData.get("state"));
//   const whatsapp = sanitizeText(formData.get("whatsapp"));

//   if (!fullName) return { error: "Please enter your full name." };
//   if (!isValidEmail(email)) return { error: "Please enter a valid email address." };
//   if (!isValidPassword(password)) return { error: "Password must be at least 6 characters." };
//   if (role === "creator" && !craft) return { error: "Please enter your craft or art form." };
//   if (role === "creator" && !whatsapp) return { error: "Please enter your WhatsApp number." };

//   const supabase = await createClient();
//   const { data: authData, error: signUpError } = await supabase.auth.signUp({
//     email,
//     password,
//     options: { data: { full_name: fullName, role } },
//   });

//   if (signUpError) return { error: signUpError.message };
//   if (!authData.user) return { error: "Could not create account. Please try again." };

//   const { error: profileError } = await supabase.from("profiles").insert({
//     id: authData.user.id,
//     role,
//     full_name: fullName,
//     email,
//     craft: role === "creator" ? craft : null,
//     store_name: role === "creator" ? storeName || null : null,
//     city: city || null,
//     state: state || null,
//     whatsapp: role === "creator" ? whatsapp : null,
//   });

//   if (profileError) return { error: profileError.message };

//   // Mark the full layout SSR cache stale so the next server render (triggered
//   // by router.refresh() in AuthProvider.onAuthStateChange) sees the new session.
//   revalidatePath("/", "layout");

//   // Return redirectTo — client navigates after Supabase onAuthStateChange fires.
//   // Never call redirect() here; it throws inside useActionState.
//   return { success: true, redirectTo: getDashboardPath(role) };
// }

// export async function signIn(
//   _prev: AuthState,
//   formData: FormData
// ): Promise<AuthState> {
//   if (!isSupabaseConfigured()) {
//     return { error: "Supabase is not configured." };
//   }

//   const email = sanitizeText(formData.get("email"));
//   const password = String(formData.get("password") ?? "");
//   const redirectAfter = sanitizeText(formData.get("redirect"));

//   if (!isValidEmail(email)) return { error: "Please enter a valid email address." };
//   if (!isValidPassword(password)) return { error: "Password must be at least 6 characters." };

//   const supabase = await createClient();
//   const { error } = await supabase.auth.signInWithPassword({ email, password });

//   if (error) {
//     if (error.message.toLowerCase().includes("invalid login")) {
//       return { error: "Incorrect email or password. Please try again." };
//     }
//     return { error: error.message };
//   }

//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { error: "Sign in failed." };

//   const { data: profile } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", user.id)
//     .single();

//   const destination =
//     redirectAfter && redirectAfter.startsWith("/")
//       ? redirectAfter
//       : getDashboardPath((profile?.role as UserRole) ?? "user");

//   // Mark the full layout SSR cache stale so the next server render sees the session.
//   revalidatePath("/", "layout");

//   // Return redirectTo — client navigates after onAuthStateChange fires.
//   return { success: true, redirectTo: destination };
// }

// /**
//  * Sign out — does NOT call redirect().
//  * Returns { success: true } so the SignOutButton client component can
//  * navigate after Supabase's onAuthStateChange(SIGNED_OUT) fires and
//  * clears AuthProvider state. Avoids server-redirect race with client auth.
//  */
// export async function signOut(): Promise<AuthState> {
//   if (!isSupabaseConfigured()) return { success: true };

//   const supabase = await createClient();
//   await supabase.auth.signOut();
//   revalidatePath("/", "layout");
//   return { success: true };
// }

// export async function updateProfile(
//   _prev: AuthState,
//   formData: FormData
// ): Promise<AuthState> {
//   if (!isSupabaseConfigured()) {
//     return { error: "Supabase is not configured." };
//   }

//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { error: "Not signed in." };

//   const { data: currentProfile } = await supabase
//     .from("profiles")
//     .select("role")
//     .eq("id", user.id)
//     .single();

//   const isCreator = currentProfile?.role === "creator";

//   const updates: Record<string, unknown> = {
//     full_name: sanitizeText(formData.get("full_name")),
//     city: sanitizeText(formData.get("city")) || null,
//     state: sanitizeText(formData.get("state")) || null,
//   };

//   if (isCreator) {
//     updates.bio = sanitizeText(formData.get("bio")) || null;
//     updates.craft = sanitizeText(formData.get("craft")) || null;
//     updates.store_name = sanitizeText(formData.get("store_name")) || null;
//     updates.whatsapp = sanitizeText(formData.get("whatsapp")) || null;
//     const yearsRaw = formData.get("years_experience");
//     updates.years_experience = yearsRaw ? parseInt(String(yearsRaw), 10) || null : null;
//   }

//   const avatarFile = formData.get("avatar") as File | null;
//   if (avatarFile && avatarFile.size > 0) {
//     // Path must start with user.id so storage RLS policy passes.
//     const ext = avatarFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
//     const path = `${user.id}/avatar.${ext}`;
//     const { error: uploadError } = await supabase.storage
//       .from("avatars")
//       .upload(path, avatarFile, { upsert: true });

//     // Surface storage errors — never silently skip so avatar_url doesn't stay stale.
//     if (uploadError) {
//       return { error: `Avatar upload failed: ${uploadError.message}` };
//     }

//     const {
//       data: { publicUrl },
//     } = supabase.storage.from("avatars").getPublicUrl(path);
//     updates.avatar_url = publicUrl;
//   }

//   const bannerFile = formData.get("banner") as File | null;
//   if (bannerFile && bannerFile.size > 0) {
//     // Path must start with user.id so storage RLS policy passes.
//     const ext = bannerFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
//     const path = `${user.id}/banner.${ext}`;
//     const { error: uploadError } = await supabase.storage
//       .from("banners")
//       .upload(path, bannerFile, { upsert: true });

//     // Surface storage errors — never silently skip so banner_url doesn't stay NULL.
//     if (uploadError) {
//       return { error: `Banner upload failed: ${uploadError.message}` };
//     }

//     const {
//       data: { publicUrl },
//     } = supabase.storage.from("banners").getPublicUrl(path);
//     updates.banner_url = publicUrl;
//   }

//   const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
//   if (error) return { error: error.message };

//   // Profile realtime subscription in AuthProvider handles client-side update instantly.
//   // revalidatePath ensures SSR cache is fresh for the next server render.
//   revalidatePath("/dashboard/creator");
//   revalidatePath("/dashboard/user");

//   return { success: true };
// }

// /**
//  * Completes creator onboarding after Google OAuth signup.
//  * Sets store_name, craft, city, bio — marks onboarding done.
//  */
// export async function completeCreatorSetup(
//   formData: FormData
// ): Promise<AuthState> {
//   if (!isSupabaseConfigured()) {
//     return { error: "Database not configured." };
//   }

//   const supabase = await createClient();
//   const {
//     data: { user },
//   } = await supabase.auth.getUser();
//   if (!user) return { error: "Not signed in." };

//   const storeName = sanitizeText(formData.get("store_name"));
//   const craft = sanitizeText(formData.get("craft"));
//   const city = sanitizeText(formData.get("city"));
//   const bio = sanitizeText(formData.get("bio")) || null;

//   if (!storeName) return { error: "Please enter your store name." };
//   if (!craft) return { error: "Please select your craft category." };
//   if (!city) return { error: "Please enter your city." };

//   const { error } = await supabase
//     .from("profiles")
//     .update({
//       store_name: storeName,
//       craft,
//       city,
//       bio,
//       onboarding_complete: true,
//     })
//     .eq("id", user.id);

//   if (error) return { error: error.message };

//   revalidatePath("/dashboard/creator");
//   return { success: true };
// }


"use server";

import { revalidatePath } from "next/cache";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { isValidEmail, isValidPassword, sanitizeText } from "@/lib/validations";
import type { UserRole } from "@/lib/types";
import { getDashboardPath } from "@/lib/utils";

export type AuthState = {
  error?: string;
  success?: boolean;
  /** Client should navigate here after success (signIn/signUp only) */
  redirectTo?: string;
};

export async function signUp(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured. Add environment variables." };
  }

  const email = sanitizeText(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const fullName = sanitizeText(formData.get("full_name"));
  const role = String(formData.get("role") ?? "user") as UserRole;
  const craft = sanitizeText(formData.get("craft"));
  const storeName = sanitizeText(formData.get("store_name"));
  const city = sanitizeText(formData.get("city"));
  const state = sanitizeText(formData.get("state"));
  const whatsapp = sanitizeText(formData.get("whatsapp"));
  const instagramUrl = sanitizeText(formData.get("instagram_url"));
  const websiteUrl = sanitizeText(formData.get("website_url"));

  if (!fullName) return { error: "Please enter your full name." };
  if (!isValidEmail(email)) return { error: "Please enter a valid email address." };
  if (!isValidPassword(password)) return { error: "Password must be at least 6 characters." };
  if (role === "creator" && !craft) return { error: "Please enter your craft or art form." };
  if (role === "creator" && !whatsapp) return { error: "Please enter your WhatsApp number." };

  const supabase = await createClient();
  const { data: authData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName, role } },
  });

  if (signUpError) return { error: signUpError.message };
  if (!authData.user) return { error: "Could not create account. Please try again." };

  const { error: profileError } = await supabase.from("profiles").insert({
    id: authData.user.id,
    role,
    full_name: fullName,
    email,
    craft: role === "creator" ? craft : null,
    store_name: role === "creator" ? storeName || null : null,
    city: city || null,
    state: state || null,
    whatsapp: role === "creator" ? whatsapp : null,
    instagram_url: role === "creator" ? instagramUrl || null : null,
    website_url: role === "creator" ? websiteUrl || null : null,
  });

  if (profileError) return { error: profileError.message };

  // Mark the full layout SSR cache stale so the next server render (triggered
  // by router.refresh() in AuthProvider.onAuthStateChange) sees the new session.
  revalidatePath("/", "layout");

  // Return redirectTo — client navigates after Supabase onAuthStateChange fires.
  // Never call redirect() here; it throws inside useActionState.
  return { success: true, redirectTo: getDashboardPath(role) };
}

export async function signIn(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const email = sanitizeText(formData.get("email"));
  const password = String(formData.get("password") ?? "");
  const redirectAfter = sanitizeText(formData.get("redirect"));

  if (!isValidEmail(email)) return { error: "Please enter a valid email address." };
  if (!isValidPassword(password)) return { error: "Password must be at least 6 characters." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login")) {
      return { error: "Incorrect email or password. Please try again." };
    }
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in failed." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const destination =
    redirectAfter && redirectAfter.startsWith("/")
      ? redirectAfter
      : getDashboardPath((profile?.role as UserRole) ?? "user");

  // Mark the full layout SSR cache stale so the next server render sees the session.
  revalidatePath("/", "layout");

  // Return redirectTo — client navigates after onAuthStateChange fires.
  return { success: true, redirectTo: destination };
}

/**
 * Sign out — does NOT call redirect().
 * Returns { success: true } so the SignOutButton client component can
 * navigate after Supabase's onAuthStateChange(SIGNED_OUT) fires and
 * clears AuthProvider state. Avoids server-redirect race with client auth.
 */
export async function signOut(): Promise<AuthState> {
  if (!isSupabaseConfigured()) return { success: true };

  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  return { success: true };
}

export async function updateProfile(
  _prev: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isCreator = currentProfile?.role === "creator";

  const updates: Record<string, unknown> = {
    full_name: sanitizeText(formData.get("full_name")),
    city: sanitizeText(formData.get("city")) || null,
    state: sanitizeText(formData.get("state")) || null,
  };

  if (isCreator) {
    updates.bio = sanitizeText(formData.get("bio")) || null;
    updates.craft = sanitizeText(formData.get("craft")) || null;
    updates.store_name = sanitizeText(formData.get("store_name")) || null;
    updates.whatsapp = sanitizeText(formData.get("whatsapp")) || null;
    updates.instagram_url = sanitizeText(formData.get("instagram_url")) || null;
    updates.website_url = sanitizeText(formData.get("website_url")) || null;
    updates.youtube_url = sanitizeText(formData.get("youtube_url")) || null;
    const yearsRaw = formData.get("years_experience");
    updates.years_experience = yearsRaw ? parseInt(String(yearsRaw), 10) || null : null;
  }

  const avatarFile = formData.get("avatar") as File | null;
  if (avatarFile && avatarFile.size > 0) {
    // Path must start with user.id so storage RLS policy passes.
    const ext = avatarFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true });

    // Surface storage errors — never silently skip so avatar_url doesn't stay stale.
    if (uploadError) {
      return { error: `Avatar upload failed: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(path);
    updates.avatar_url = publicUrl;
  }

  const bannerFile = formData.get("banner") as File | null;
  if (bannerFile && bannerFile.size > 0) {
    // Path must start with user.id so storage RLS policy passes.
    const ext = bannerFile.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const path = `${user.id}/banner.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("banners")
      .upload(path, bannerFile, { upsert: true });

    // Surface storage errors — never silently skip so banner_url doesn't stay NULL.
    if (uploadError) {
      return { error: `Banner upload failed: ${uploadError.message}` };
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("banners").getPublicUrl(path);
    updates.banner_url = publicUrl;
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", user.id);
  if (error) return { error: error.message };

  // Profile realtime subscription in AuthProvider handles client-side update instantly.
  // revalidatePath ensures SSR cache is fresh for the next server render.
  revalidatePath("/dashboard/creator");
  revalidatePath("/dashboard/user");

  return { success: true };
}

/**
 * Completes creator onboarding after Google OAuth signup.
 * Sets store_name, craft, city, bio — marks onboarding done.
 */
export async function completeCreatorSetup(
  formData: FormData
): Promise<AuthState> {
  if (!isSupabaseConfigured()) {
    return { error: "Database not configured." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in." };

  const storeName = sanitizeText(formData.get("store_name"));
  const craft = sanitizeText(formData.get("craft"));
  const city = sanitizeText(formData.get("city"));
  const bio = sanitizeText(formData.get("bio")) || null;

  if (!storeName) return { error: "Please enter your store name." };
  if (!craft) return { error: "Please select your craft category." };
  if (!city) return { error: "Please enter your city." };

  const { error } = await supabase
    .from("profiles")
    .update({
      store_name: storeName,
      craft,
      city,
      bio,
      onboarding_complete: true,
    })
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard/creator");
  return { success: true };
}