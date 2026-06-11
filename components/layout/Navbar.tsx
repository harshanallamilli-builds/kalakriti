"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { NotificationBell } from "@/components/layout/NotificationBell";

const publicLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/creators", label: "Artisans" },
];

export function Navbar() {
  const pathname = usePathname();
  const { profile, isLoading, unreadMessageCount, unreadNotificationCount } = useAuth();
  const [open, setOpen] = useState(false);
  const unreadCount = unreadMessageCount;
  const hasUnread = unreadCount > 0;
  const hasUnreadNotifs = unreadNotificationCount > 0;

  const dashboardHref = profile?.role === "creator" ? "/dashboard/creator" : "/dashboard/user";
  const dashboardLabel = profile?.role === "creator" ? "Studio" : "My Account";
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href));
  const onMessagesPage = pathname.startsWith("/messages");

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-linen/70 bg-cream/92 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-saffron/90 to-terracotta font-heading text-xl font-semibold text-cream shadow-[var(--shadow-card)] transition-transform duration-300 group-hover:scale-105">
              K
            </span>
            <span className="font-heading text-2xl font-medium tracking-tight text-charcoal">
              Kalakriti
            </span>
          </Link>

          {/* Desktop nav */}
          <ul className="hidden items-center gap-7 md:flex">
            {publicLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm tracking-wide transition-colors duration-200 hover:text-terracotta",
                    isActive(link.href) ? "text-terracotta" : "text-warm-gray"
                  )}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            {profile && (
              <li>
                <Link
                  href="/messages"
                  className={cn(
                    "relative text-sm tracking-wide transition-colors hover:text-terracotta",
                    isActive("/messages") ? "text-terracotta" : "text-warm-gray"
                  )}
                >
                  Messages
                  {hasUnread && !onMessagesPage && (
                    <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-bold text-cream">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            )}
          </ul>

          {/* Desktop auth */}
          <div className="hidden items-center gap-3 md:flex">
            {!isLoading && profile ? (
              <>
                {/* Notification bell — badge count comes from AuthProvider via NotificationBell's own hook */}
                <div className="relative">
                  <NotificationBell userId={profile.id} />
                  {/* Extra dot on bell when there are unread notifications and bell is not open */}
                  {/* Note: NotificationBell manages its own badge via useNotifications — this is handled internally */}
                </div>
                <Button href={dashboardHref} size="sm">{dashboardLabel}</Button>
              </>
            ) : !isLoading ? (
              <>
                <Link href="/auth/login" className="text-sm text-warm-gray transition-colors hover:text-charcoal">
                  Sign in
                </Link>
                <Button href="/auth/signup" size="sm" variant="secondary">
                  Join Kalakriti
                </Button>
              </>
            ) : (
              <div className="h-8 w-24 animate-pulse rounded-full bg-sand" />
            )}
          </div>

          {/* Mobile hamburger — shows both message + notification dots */}
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-linen md:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
            {/* Dot indicator for unread messages OR notifications */}
            {((hasUnread && !onMessagesPage) || hasUnreadNotifs) && profile && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta" />
            )}
          </button>
        </nav>

        {/* Mobile drawer */}
        {open && (
          <div className="animate-slide-up border-t border-linen/70 bg-cream px-4 py-5 md:hidden">
            <ul className="flex flex-col gap-1">
              {publicLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-xl px-3 py-3.5 font-heading text-lg transition-colors",
                      isActive(link.href) ? "text-terracotta" : "text-charcoal hover:bg-sand/50"
                    )}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {profile && (
                <>
                  <li>
                    <Link
                      href="/messages"
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-3.5 font-heading text-lg transition-colors",
                        isActive("/messages") ? "text-terracotta" : "text-charcoal hover:bg-sand/50"
                      )}
                    >
                      Messages
                      {hasUnread && !onMessagesPage && (
                        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold text-cream">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </Link>
                  </li>
                  {/* Notifications link in mobile menu */}
                  <li>
                    <div className="flex items-center gap-2 rounded-xl px-3 py-3.5 font-heading text-lg text-charcoal">
                      <span>Notifications</span>
                      {hasUnreadNotifs && (
                        <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold text-cream">
                          {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                        </span>
                      )}
                      {/* Render the bell inline in mobile menu */}
                      <span className="ml-auto">
                        <NotificationBell userId={profile.id} />
                      </span>
                    </div>
                  </li>
                </>
              )}
            </ul>
            <div className="mt-4 flex flex-col gap-2 border-t border-linen pt-4">
              {isLoading ? (
                <div className="h-12 animate-pulse rounded-full bg-sand" />
              ) : profile ? (
                <Link
                  href={dashboardHref}
                  onClick={() => setOpen(false)}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-charcoal text-sm font-medium text-cream"
                >
                  {dashboardLabel}
                </Link>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full border border-linen text-sm text-charcoal"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setOpen(false)}
                    className="flex h-12 items-center justify-center rounded-full bg-terracotta text-sm text-cream"
                  >
                    Join Kalakriti
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
