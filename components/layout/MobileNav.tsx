// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useAuth } from "@/context/AuthProvider";
// import { NotificationBell } from "@/components/layout/NotificationBell";
// import { cn } from "@/lib/utils";

// function HomeIcon({ active }: { active: boolean }) {
//   return (
//     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//     </svg>
//   );
// }
// function ShopIcon({ active }: { active: boolean }) {
//   return (
//     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
//     </svg>
//   );
// }
// function ArtisanIcon({ active }: { active: boolean }) {
//   return (
//     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
//     </svg>
//   );
// }
// function MessageIcon({ active, badge, count }: { active: boolean; badge?: boolean; count?: number }) {
//   return (
//     <span className="relative">
//       <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
//         <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
//       </svg>
//       {badge && (
//         <span className="absolute -right-1.5 -top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-0.5 text-[9px] font-bold text-cream">
//           {count && count > 9 ? "9+" : count || ""}
//         </span>
//       )}
//     </span>
//   );
// }
// function AccountIcon({ active }: { active: boolean }) {
//   return (
//     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//     </svg>
//   );
// }

// export function MobileNav() {
//   const pathname = usePathname();
//   const { profile, isLoading, unreadMessageCount } = useAuth();
//   const unreadCount = unreadMessageCount;
//   const hasUnread = unreadCount > 0;

//   // Hide on auth pages and inside a conversation (full-height chat needs full space)
//   if (pathname.startsWith("/auth") || /^\/messages\/[^/]+/.test(pathname)) return null;

//   const isActive = (href: string) =>
//     pathname === href || (href !== "/" && pathname.startsWith(href));

//   const dashboardHref = profile?.role === "creator" ? "/dashboard/creator" : "/dashboard/user";
//   const dashboardLabel = profile?.role === "creator" ? "Studio" : "Account";
//   const onMessagesPage = pathname.startsWith("/messages");

//   const navItems = [
//     { href: "/", label: "Home", icon: (a: boolean) => <HomeIcon active={a} /> },
//     { href: "/marketplace", label: "Shop", icon: (a: boolean) => <ShopIcon active={a} /> },
//     { href: "/creators", label: "Artisans", icon: (a: boolean) => <ArtisanIcon active={a} /> },
//   ];

//   return (
//     <nav
//       className="fixed bottom-0 left-0 right-0 z-50 border-t border-linen/80 bg-cream/95 backdrop-blur-md md:hidden"
//       style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
//     >
//       <div className="flex items-stretch">
//         {navItems.map(({ href, label, icon }) => {
//           const active = isActive(href);
//           return (
//             <Link
//               key={href}
//               href={href}
//               className={cn(
//                 "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
//                 active ? "text-terracotta" : "text-warm-gray"
//               )}
//             >
//               {icon(active)}
//               {label}
//             </Link>
//           );
//         })}

//         {/* Messages — only when logged in */}
//         {!isLoading && profile && (
//           <Link
//             href="/messages"
//             className={cn(
//               "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
//               isActive("/messages") ? "text-terracotta" : "text-warm-gray"
//             )}
//           >
//             <MessageIcon active={isActive("/messages")} badge={hasUnread && !onMessagesPage} count={unreadCount} />
//             Messages
//           </Link>
//         )}

//         {/* Notification Bell — only when logged in */}
//         {!isLoading && profile && (
//           <div className={cn(
//             "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
//             "text-warm-gray"
//           )}>
//             {/* The bell renders its own popup — on mobile it pops upward */}
//             <div className="relative flex flex-col items-center gap-0.5">
//               <NotificationBell userId={profile.id} />
//             </div>
//             <span className="mt-0.5">Alerts</span>
//           </div>
//         )}

//         {/* Dashboard / Sign in */}
//         {!isLoading && profile ? (
//           <Link
//             href={dashboardHref}
//             className={cn(
//               "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
//               isActive(dashboardHref) ? "text-terracotta" : "text-warm-gray"
//             )}
//           >
//             <AccountIcon active={isActive(dashboardHref)} />
//             {dashboardLabel}
//           </Link>
//         ) : !isLoading ? (
//           <Link
//             href="/auth/login"
//             className={cn(
//               "flex flex-1 flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors",
//               isActive("/auth/login") ? "text-terracotta" : "text-warm-gray"
//             )}
//           >
//             <AccountIcon active={isActive("/auth/login")} />
//             Sign in
//           </Link>
//         ) : (
//           <div className="flex flex-1 flex-col items-center justify-center gap-1 py-2.5">
//             <div className="h-6 w-6 animate-pulse rounded-full bg-sand" />
//             <div className="h-2 w-10 animate-pulse rounded bg-sand" />
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { cn } from "@/lib/utils";

// ── Icons ──────────────────────────────────────────────────────────────────────


// function FounderIcon({ active }: { active: boolean }) {
//   return active ? (
//     <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor">
//       <path fillRule="evenodd" d="M4.125 3C3.089 3 2.25 3.84 2.25 4.875V18a3 3 0 003 3h15.75a.75.75 0 000-1.5H5.25A1.5 1.5 0 013.75 18V4.875C3.75 4.669 3.919 3 4.125 3h.375v15a.75.75 0 001.5 0V3h13.5A1.5 1.5 0 0121 4.5v13.125c0 .207-.168.375-.375.375H5.625A.75.75 0 005.625 19.5H20.625A1.875 1.875 0 0022.5 17.625V4.5A3 3 0 0019.5 1.5H4.125C3.089 1.5 2.25 2.34 2.25 3.375v.75A.75.75 0 003 4.875.75.75 0 004.125 3z" clipRule="evenodd" />
//     </svg>
//   ) : (
//     <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
//       <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
//     </svg>
//   );
// }
function HomeIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-1.3-1.3V5.25a.75.75 0 00-.75-.75h-1.5a.75.75 0 00-.75.75v1.932l-3.97-3.97A.75.75 0 0012 3a.75.75 0 00-.53.22l-8.69 8.69a.75.75 0 101.06 1.06l.97-.97V19.5a.75.75 0 00.75.75H9a.75.75 0 00.75-.75v-4.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v4.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-7.498l-7.5-7.5z" />
    </svg>
  ) : (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function ShopIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  ) : (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
    </svg>
  );
}

function ArtisanIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  ) : (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function MessageIcon({ active, badge, count }: { active: boolean; badge?: boolean; count?: number }) {
  return (
    <span className="relative">
      {active ? (
        <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )}
      {badge && (
        <span className="absolute -right-1.5 -top-1.5 flex h-[15px] min-w-[15px] items-center justify-center rounded-full bg-terracotta px-0.5 text-[8px] font-bold text-cream shadow-[0_0_0_1.5px_rgba(250,246,240,0.9)]">
          {count && count > 9 ? "9+" : count || ""}
        </span>
      )}
    </span>
  );
}

function AccountIcon({ active }: { active: boolean }) {
  return active ? (
    <svg className="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg className="h-[22px] w-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

// ── Main component ──────────────────────────────────────────────────────────────

export function MobileNav() {
  const pathname = usePathname();
  const { profile, isLoading, unreadMessageCount } = useAuth();
  const unreadCount = unreadMessageCount;
  const hasUnread = unreadCount > 0;

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
    // { href: "/founder", label: "Our Story", icon: (a: boolean) => <FounderIcon active={a} /> },

  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {/* Top shimmer line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-saffron/25 to-transparent" />

      {/* Glass bar */}
      <div className="bg-cream/92 backdrop-blur-xl shadow-[0_-1px_0_rgba(229,217,200,0.8),0_-8px_32px_-4px_rgba(58,50,44,0.10)]">
        <div className="flex items-stretch">

          {/* Static nav items */}
          {navItems.map(({ href, label, icon }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-1 flex-col items-center justify-center gap-[3px] py-2.5 transition-colors duration-200",
                  active ? "text-terracotta" : "text-warm-gray active:text-charcoal"
                )}
              >
                {/* Active pill */}
                {active && (
                  <span className="absolute top-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-terracotta" />
                )}
                <span className={cn("transition-transform duration-200", active && "scale-110")}>
                  {icon(active)}
                </span>
                <span className={cn("text-[9.5px] font-medium tracking-wide", active && "font-semibold")}>
                  {label}
                </span>
              </Link>
            );
          })}

          {/* Messages — logged in only */}
          {!isLoading && profile && (
            <Link
              href="/messages"
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-[3px] py-2.5 transition-colors duration-200",
                isActive("/messages") ? "text-terracotta" : "text-warm-gray active:text-charcoal"
              )}
            >
              {isActive("/messages") && (
                <span className="absolute top-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-terracotta" />
              )}
              <span className={cn("transition-transform duration-200", isActive("/messages") && "scale-110")}>
                <MessageIcon
                  active={isActive("/messages")}
                  badge={hasUnread && !onMessagesPage}
                  count={unreadCount}
                />
              </span>
              <span className={cn("text-[9.5px] font-medium tracking-wide", isActive("/messages") && "font-semibold")}>
                Messages
              </span>
            </Link>
          )}

          {/* Notification Bell — logged in only */}
          {!isLoading && profile && (
            <div className="relative flex flex-1 flex-col items-center justify-center gap-[3px] py-2.5 text-warm-gray">
              <div className="relative flex flex-col items-center gap-[3px]">
                <NotificationBell userId={profile.id} />
                <span className="text-[9.5px] font-medium tracking-wide">Alerts</span>
              </div>
            </div>
          )}

          {/* Dashboard / Sign in */}
          {!isLoading && profile ? (
            <Link
              href={dashboardHref}
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-[3px] py-2.5 transition-colors duration-200",
                isActive(dashboardHref) ? "text-terracotta" : "text-warm-gray active:text-charcoal"
              )}
            >
              {isActive(dashboardHref) && (
                <span className="absolute top-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-terracotta" />
              )}
              <span className={cn("transition-transform duration-200", isActive(dashboardHref) && "scale-110")}>
                <AccountIcon active={isActive(dashboardHref)} />
              </span>
              <span className={cn("text-[9.5px] font-medium tracking-wide", isActive(dashboardHref) && "font-semibold")}>
                {dashboardLabel}
              </span>
            </Link>
          ) : !isLoading ? (
            <Link
              href="/auth/login"
              className={cn(
                "relative flex flex-1 flex-col items-center justify-center gap-[3px] py-2.5 transition-colors duration-200",
                isActive("/auth/login") ? "text-terracotta" : "text-warm-gray active:text-charcoal"
              )}
            >
              {isActive("/auth/login") && (
                <span className="absolute top-0 left-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full bg-terracotta" />
              )}
              <AccountIcon active={isActive("/auth/login")} />
              <span className="text-[9.5px] font-medium tracking-wide">Sign in</span>
            </Link>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-2.5">
              <div className="h-[22px] w-[22px] animate-pulse rounded-full bg-sand" />
              <div className="h-2 w-8 animate-pulse rounded bg-sand" />
            </div>
          )}

        </div>
      </div>
    </nav>
  );
}