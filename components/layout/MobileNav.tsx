"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}
function ShopIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
function ArtisanIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
function MessageIcon({ active, badge, count }: { active: boolean; badge?: boolean; count?: number }) {
  return (
    <span className="relative">
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      {badge && (
        <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-0.5 text-[9px] font-bold text-cream">
          {count && count > 9 ? "9+" : count || ""}
        </span>
      )}
    </span>
  );
}
function AccountIcon({ active }: { active: boolean }) {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const { profile, isLoading, unreadMessageCount } = useAuth();
  const unreadCount = unreadMessageCount;
  const hasUnread = unreadCount > 0;

  // Hide on auth pages and inside a conversation (full-height chat needs full space)
  if (pathname.startsWith("/auth") || /^\/messages\/[^/]+/.test(pathname)) return null;

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));

  const dashboardHref = profile?.role === "creator" ? "/dashboard/creator" : "/dashboard/user";
  const dashboardLabel = profile?.role === "creator" ? "Studio" : "Account";
  const onMessagesPage = pathname.startsWith("/messages");

  const navItems = [
    { href: "/", label: "Home", icon: (a: boolean) => <HomeIcon active={a} /> },
    { href: "/marketplace", label: "Shop", icon: (a: boolean) => <ShopIcon active={a} /> },
    { href: "/creators", label: "Artisans", icon: (a: boolean) => <ArtisanIcon active={a} /> },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-linen/80 bg-cream/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch">
        {navItems.map(({ href, label, icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-terracotta" : "text-warm-gray"
              )}
            >
              {icon(active)}
              {label}
            </Link>
          );
        })}

        {/* Messages — only when logged in */}
        {!isLoading && profile && (
          <Link
            href="/messages"
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
              isActive("/messages") ? "text-terracotta" : "text-warm-gray"
            )}
          >
            <MessageIcon active={isActive("/messages")} badge={hasUnread && !onMessagesPage} count={unreadCount} />
            Messages
          </Link>
        )}

        {/* Dashboard / Sign in */}
        {!isLoading && profile ? (
          <Link
            href={dashboardHref}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
              isActive(dashboardHref) ? "text-terracotta" : "text-warm-gray"
            )}
          >
            <AccountIcon active={isActive(dashboardHref)} />
            {dashboardLabel}
          </Link>
        ) : !isLoading ? (
          <Link
            href="/auth/login"
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
              isActive("/auth/login") ? "text-terracotta" : "text-warm-gray"
            )}
          >
            <AccountIcon active={isActive("/auth/login")} />
            Sign in
          </Link>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5">
            <div className="h-6 w-6 animate-pulse rounded-full bg-sand" />
            <div className="h-2 w-10 animate-pulse rounded bg-sand" />
          </div>
        )}
      </div>
    </nav>
  );
}
