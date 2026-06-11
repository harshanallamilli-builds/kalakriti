import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

// Routes that require authentication
const AUTH_REQUIRED = ["/dashboard", "/messages"];
// Routes only creators can access
const CREATOR_ONLY = ["/dashboard/creator"];
// Routes only users can access  
const USER_ONLY = ["/dashboard/user"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always update session (refreshes auth cookies)
  const sessionResponse = await updateSession(request);

  // Skip proxy for public routes and auth callback
  const isPublicRoute =
    pathname === "/" ||
    pathname.startsWith("/marketplace") ||
    pathname.startsWith("/creators") ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublicRoute) {
    return sessionResponse;
  }

  // Only enforce auth on protected routes when Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return sessionResponse;
  }

  const needsAuth = AUTH_REQUIRED.some((p) => pathname.startsWith(p));
  if (!needsAuth) return sessionResponse;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            sessionResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Not logged in → redirect to login
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/auth/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Get role for role-based routing
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = profile?.role as "user" | "creator" | undefined;

  // /dashboard → redirect to role-specific dashboard
  if (pathname === "/dashboard") {
    const url = request.nextUrl.clone();
    url.pathname = role === "creator" ? "/dashboard/creator" : "/dashboard/user";
    return NextResponse.redirect(url);
  }

  // Creator trying to access user dashboard → redirect to creator dashboard
  if (USER_ONLY.some((p) => pathname.startsWith(p)) && role === "creator") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/creator";
    return NextResponse.redirect(url);
  }

  // User trying to access creator dashboard → redirect to user dashboard
  if (CREATOR_ONLY.some((p) => pathname.startsWith(p)) && role !== "creator") {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard/user";
    return NextResponse.redirect(url);
  }

  return sessionResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};