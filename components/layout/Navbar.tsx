// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthProvider";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/Button";
// import { NotificationBell } from "@/components/layout/NotificationBell";

// const publicLinks = [
//   { href: "/marketplace", label: "Marketplace" },
//   { href: "/creators", label: "Artisans" },
// ];

// export function Navbar() {
//   const pathname = usePathname();
//   const { profile, isLoading, unreadMessageCount, unreadNotificationCount } = useAuth();
//   const [open, setOpen] = useState(false);
//   const unreadCount = unreadMessageCount;
//   const hasUnread = unreadCount > 0;
//   const hasUnreadNotifs = unreadNotificationCount > 0;

//   const dashboardHref = profile?.role === "creator" ? "/dashboard/creator" : "/dashboard/user";
//   const dashboardLabel = profile?.role === "creator" ? "Studio" : "My Account";
//   const isActive = (href: string) =>
//     pathname === href || (href !== "/" && pathname.startsWith(href));
//   const onMessagesPage = pathname.startsWith("/messages");

//   useEffect(() => { setOpen(false); }, [pathname]);

//   useEffect(() => {
//     if (!open) return;
//     function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open]);

//   return (
//     <>
//       <header className="sticky top-0 z-50 border-b border-linen/70 bg-cream/92 backdrop-blur-md">
//         <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
//           {/* Logo */}
//           <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
//             <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-saffron/90 to-terracotta font-heading text-xl font-semibold text-cream shadow-[var(--shadow-card)] transition-transform duration-300 group-hover:scale-105">
//               K
//             </span>
//             <span className="font-heading text-2xl font-medium tracking-tight text-charcoal">
//               Kalakriti
//             </span>
//           </Link>

//           {/* Desktop nav */}
//           <ul className="hidden items-center gap-7 md:flex">
//             {publicLinks.map((link) => (
//               <li key={link.href}>
//                 <Link
//                   href={link.href}
//                   className={cn(
//                     "text-sm tracking-wide transition-colors duration-200 hover:text-terracotta",
//                     isActive(link.href) ? "text-terracotta" : "text-warm-gray"
//                   )}
//                 >
//                   {link.label}
//                 </Link>
//               </li>
//             ))}
//             {profile && (
//               <li>
//                 <Link
//                   href="/messages"
//                   className={cn(
//                     "relative text-sm tracking-wide transition-colors hover:text-terracotta",
//                     isActive("/messages") ? "text-terracotta" : "text-warm-gray"
//                   )}
//                 >
//                   Messages
//                   {hasUnread && !onMessagesPage && (
//                     <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-bold text-cream">
//                       {unreadCount > 9 ? "9+" : unreadCount}
//                     </span>
//                   )}
//                 </Link>
//               </li>
//             )}
//           </ul>

//           {/* Desktop auth */}
//           <div className="hidden items-center gap-3 md:flex">
//             {!isLoading && profile ? (
//               <>
//                 {/* Notification bell — badge count comes from AuthProvider via NotificationBell's own hook */}
//                 <div className="relative">
//                   <NotificationBell userId={profile.id} />
//                   {/* Extra dot on bell when there are unread notifications and bell is not open */}
//                   {/* Note: NotificationBell manages its own badge via useNotifications — this is handled internally */}
//                 </div>
//                 <Button href={dashboardHref} size="sm">{dashboardLabel}</Button>
//               </>
//             ) : !isLoading ? (
//               <>
//                 <Link href="/auth/login" className="text-sm text-warm-gray transition-colors hover:text-charcoal">
//                   Sign in
//                 </Link>
//                 <Button href="/auth/signup" size="sm" variant="secondary">
//                   Join Kalakriti
//                 </Button>
//               </>
//             ) : (
//               <div className="h-8 w-24 animate-pulse rounded-full bg-sand" />
//             )}
//           </div>

//           {/* Mobile hamburger — shows both message + notification dots */}
//           <button
//             type="button"
//             className="relative flex h-10 w-10 items-center justify-center rounded-full border border-linen md:hidden"
//             onClick={() => setOpen(!open)}
//             aria-label={open ? "Close menu" : "Open menu"}
//             aria-expanded={open}
//           >
//             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               {open ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//             {/* Dot indicator for unread messages OR notifications */}
//             {((hasUnread && !onMessagesPage) || hasUnreadNotifs) && profile && (
//               <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta" />
//             )}
//           </button>
//         </nav>

//         {/* Mobile drawer */}
//         {open && (
//           <div className="animate-slide-up border-t border-linen/70 bg-cream px-4 py-5 md:hidden">
//             <ul className="flex flex-col gap-1">
//               {publicLinks.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     onClick={() => setOpen(false)}
//                     className={cn(
//                       "block rounded-xl px-3 py-3.5 font-heading text-lg transition-colors",
//                       isActive(link.href) ? "text-terracotta" : "text-charcoal hover:bg-sand/50"
//                     )}
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//               {profile && (
//                 <>
//                   <li>
//                     <Link
//                       href="/messages"
//                       onClick={() => setOpen(false)}
//                       className={cn(
//                         "flex items-center gap-2 rounded-xl px-3 py-3.5 font-heading text-lg transition-colors",
//                         isActive("/messages") ? "text-terracotta" : "text-charcoal hover:bg-sand/50"
//                       )}
//                     >
//                       Messages
//                       {hasUnread && !onMessagesPage && (
//                         <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold text-cream">
//                           {unreadCount > 9 ? "9+" : unreadCount}
//                         </span>
//                       )}
//                     </Link>
//                   </li>
//                   {/* Notifications link in mobile menu */}
//                   <li>
//                     <div className="flex items-center gap-2 rounded-xl px-3 py-3.5 font-heading text-lg text-charcoal">
//                       <span>Notifications</span>
//                       {hasUnreadNotifs && (
//                         <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold text-cream">
//                           {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
//                         </span>
//                       )}
//                       {/* Render the bell inline in mobile menu */}
//                       <span className="ml-auto">
//                         <NotificationBell userId={profile.id} />
//                       </span>
//                     </div>
//                   </li>
//                 </>
//               )}
//             </ul>
//             <div className="mt-4 flex flex-col gap-2 border-t border-linen pt-4">
//               {isLoading ? (
//                 <div className="h-12 animate-pulse rounded-full bg-sand" />
//               ) : profile ? (
//                 <Link
//                   href={dashboardHref}
//                   onClick={() => setOpen(false)}
//                   className="flex h-12 w-full items-center justify-center rounded-full bg-charcoal text-sm font-medium text-cream"
//                 >
//                   {dashboardLabel}
//                 </Link>
//               ) : (
//                 <>
//                   <Link
//                     href="/auth/login"
//                     onClick={() => setOpen(false)}
//                     className="flex h-12 items-center justify-center rounded-full border border-linen text-sm text-charcoal"
//                   >
//                     Sign in
//                   </Link>
//                   <Link
//                     href="/auth/signup"
//                     onClick={() => setOpen(false)}
//                     className="flex h-12 items-center justify-center rounded-full bg-terracotta text-sm text-cream"
//                   >
//                     Join Kalakriti
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </header>
//     </>
//   );
// }

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect, useRef } from "react";
// import { useAuth } from "@/context/AuthProvider";
// import { cn } from "@/lib/utils";
// import { NotificationBell } from "@/components/layout/NotificationBell";

// const publicLinks = [
//   { href: "/marketplace", label: "Marketplace" },
//   { href: "/creators", label: "Artisans" },
//   { href: "/founder", label: "Our Story" },
//   { href: "/contact", label: "Contact" },
// ];

// export function Navbar() {
//   const pathname = usePathname();
//   const { profile, isLoading, unreadMessageCount, unreadNotificationCount } = useAuth();
//   const [open, setOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   // This ref wraps BOTH the hamburger button AND the drawer panel.
//   // The outside-click handler checks against this single container,
//   // so clicking the X button (which lives inside it) does NOT trigger close-on-outside.
//   const mobileMenuRef = useRef<HTMLDivElement>(null);

//   const unreadCount = unreadMessageCount;
//   const hasUnread = unreadCount > 0;
//   const hasUnreadNotifs = unreadNotificationCount > 0;
//   const dashboardHref = profile?.role === "creator" ? "/dashboard/creator" : "/dashboard/user";
//   const dashboardLabel = profile?.role === "creator" ? "Studio" : "My Account";
//   const isActive = (href: string) =>
//     pathname === href || (href !== "/" && pathname.startsWith(href));
//   const onMessagesPage = pathname.startsWith("/messages");

//   useEffect(() => { setOpen(false); }, [pathname]);

//   useEffect(() => {
//     const handler = () => setScrolled(window.scrollY > 8);
//     window.addEventListener("scroll", handler, { passive: true });
//     return () => window.removeEventListener("scroll", handler);
//   }, []);

//   // Outside-click and Escape — only active when drawer is open
//   useEffect(() => {
//     if (!open) return;
//     function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
//     function onOutside(e: MouseEvent) {
//       if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
//         setOpen(false);
//       }
//     }
//     window.addEventListener("keydown", onKey);
//     // Use setTimeout so this handler doesn't fire on the same click that opened the drawer
//     const t = setTimeout(() => document.addEventListener("mousedown", onOutside), 0);
//     return () => {
//       window.removeEventListener("keydown", onKey);
//       clearTimeout(t);
//       document.removeEventListener("mousedown", onOutside);
//     };
//   }, [open]);

//   return (
//     <>
//       <header
//         className={cn(
//           "cp-global-nav sticky top-0 z-50 transition-all duration-500",
//           scrolled
//             ? "bg-cream/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(229,217,200,0.8),0_8px_32px_-8px_rgba(58,50,44,0.10)]"
//             : "bg-cream/70 backdrop-blur-md"
//         )}
//       >
//         {/* Top gold accent line */}
//         <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />

//         <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">

//           {/* ── Logo ── */}
//           <Link
//             href="/"
//             className="group flex items-center gap-3"
//             onClick={() => setOpen(false)}
//           >
//             <span className="relative flex h-9 w-9 items-center justify-center">
//               <span className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron/30 to-terracotta/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
//               <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-saffron via-clay to-terracotta shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(184,92,56,0.30)] transition-all duration-300 group-hover:shadow-[0_4px_16px_rgba(184,92,56,0.40)] group-hover:scale-105">
//                 <span className="font-heading text-xl font-semibold text-cream" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.20)" }}>
//                   K
//                 </span>
//               </span>
//             </span>
//             <span className="font-heading text-[1.45rem] font-medium tracking-tight text-charcoal transition-colors duration-200 group-hover:text-espresso">
//               Kalakriti
//             </span>
//           </Link>

//           {/* ── Desktop nav links ── */}
//           <ul className="hidden items-center md:flex" style={{ gap: "2px" }}>
//             {publicLinks.map((link) => {
//               const active = isActive(link.href);
//               return (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     className={cn(
//                       "relative px-4 py-2 text-[13.5px] font-medium tracking-wide transition-colors duration-200 rounded-full block",
//                       active
//                         ? "text-terracotta"
//                         : "text-warm-gray hover:text-charcoal hover:bg-sand/60"
//                     )}
//                   >
//                     {link.label}
//                     {active && (
//                       <span className="absolute bottom-0.5 left-1/2 h-[1.5px] w-4 -translate-x-1/2 rounded-full bg-terracotta" />
//                     )}
//                   </Link>
//                 </li>
//               );
//             })}

//             {profile && (
//               <li>
//                 <Link
//                   href="/messages"
//                   className={cn(
//                     "relative flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-medium tracking-wide transition-colors duration-200 rounded-full",
//                     isActive("/messages")
//                       ? "text-terracotta"
//                       : "text-warm-gray hover:text-charcoal hover:bg-sand/60"
//                   )}
//                 >
//                   Messages
//                   {hasUnread && !onMessagesPage && (
//                     <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-bold text-cream shadow-[0_1px_4px_rgba(184,92,56,0.4)]">
//                       {unreadCount > 9 ? "9+" : unreadCount}
//                     </span>
//                   )}
//                   {isActive("/messages") && (
//                     <span className="absolute bottom-0.5 left-1/2 h-[1.5px] w-4 -translate-x-1/2 rounded-full bg-terracotta" />
//                   )}
//                 </Link>
//               </li>
//             )}
//           </ul>

//           {/* ── Desktop right actions ── */}
//           <div className="hidden items-center gap-2 md:flex">
//             {!isLoading && profile ? (
//               <>
//                 <NotificationBell userId={profile.id} />
//                 <div className="mx-1 h-5 w-px bg-linen" />
//                 <Link
//                   href={dashboardHref}
//                   className="group relative overflow-hidden rounded-full bg-charcoal px-5 py-2 text-[13px] font-medium tracking-wide text-cream shadow-[0_2px_8px_rgba(58,50,44,0.18)] transition-all duration-300 hover:bg-espresso hover:shadow-[0_4px_16px_rgba(58,50,44,0.28)] hover:scale-[1.02] active:scale-[0.98]"
//                 >
//                   <span className="relative z-10">{dashboardLabel}</span>
//                   <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
//                 </Link>
//               </>
//             ) : !isLoading ? (
//               <>
//                 <Link
//                   href="/auth/login"
//                   className="px-4 py-2 text-[13.5px] font-medium text-warm-gray transition-colors duration-200 hover:text-charcoal rounded-full hover:bg-sand/60"
//                 >
//                   Sign in
//                 </Link>
//                 <Link
//                   href="/auth/signup"
//                   className="group relative overflow-hidden rounded-full border border-terracotta/30 bg-gradient-to-b from-terracotta to-[#a34e2d] px-5 py-2 text-[13px] font-medium tracking-wide text-cream shadow-[0_2px_8px_rgba(184,92,56,0.22)] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(184,92,56,0.32)] hover:scale-[1.02] active:scale-[0.98]"
//                 >
//                   <span className="relative z-10">Join Kalakriti</span>
//                   <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
//                 </Link>
//               </>
//             ) : (
//               <div className="h-8 w-28 animate-pulse rounded-full bg-sand" />
//             )}
//           </div>

//           {/* ── Mobile right side: Founder link + hamburger (both inside mobileMenuRef) ── */}
//           <div ref={mobileMenuRef} className="flex items-center gap-2 md:hidden">

//             {/* Founder icon link — visible directly in top bar on mobile */}
//             <Link
//               href="/founder"
//               className={cn(
//                 "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
//                 isActive("/founder")
//                   ? "border-terracotta/40 bg-sand text-terracotta"
//                   : "border-linen bg-cream text-warm-gray hover:border-clay/30 hover:bg-sand/60 hover:text-charcoal"
//               )}
//               aria-label="Our Story"
//             >
//               {/* Book / story icon */}
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
//               </svg>
//             </Link>

//             {/* Hamburger button — inside same ref so X click doesn't trigger outside-click */}
//             <button
//               type="button"
//               className={cn(
//                 "relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
//                 open
//                   ? "border-clay/40 bg-sand text-charcoal"
//                   : "border-linen bg-cream text-warm-gray hover:border-clay/30 hover:bg-sand/60 hover:text-charcoal"
//               )}
//               onClick={() => setOpen((o) => !o)}
//               aria-label={open ? "Close menu" : "Open menu"}
//               aria-expanded={open}
//             >
//               <span className="relative flex h-4 w-4 flex-col items-center justify-center gap-[5px]">
//                 <span className={cn(
//                   "block h-[1.5px] w-4 rounded-full bg-current origin-center transition-all duration-300",
//                   open && "translate-y-[6.5px] rotate-45"
//                 )} />
//                 <span className={cn(
//                   "block h-[1.5px] w-4 rounded-full bg-current transition-all duration-200",
//                   open && "opacity-0 scale-x-0"
//                 )} />
//                 <span className={cn(
//                   "block h-[1.5px] w-4 rounded-full bg-current origin-center transition-all duration-300",
//                   open && "-translate-y-[6.5px] -rotate-45"
//                 )} />
//               </span>

//               {/* Unread dot */}
//               {((hasUnread && !onMessagesPage) || hasUnreadNotifs) && profile && (
//                 <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta shadow-[0_0_0_1.5px_var(--cream)]" />
//               )}
//             </button>

//             {/* Drawer panel — also inside mobileMenuRef */}
//             {open && (
//               <div className="absolute left-4 right-4 top-[4.5rem] z-50 animate-slide-up overflow-hidden rounded-2xl border border-linen/80 bg-cream shadow-[0_20px_60px_-10px_rgba(58,50,44,0.22),0_0_0_1px_rgba(229,217,200,0.4)]">
//                 <div className="h-px w-full bg-gradient-to-r from-transparent via-saffron/30 to-transparent" />

//                 <div className="px-2 pb-3 pt-2">
//                   <ul className="flex flex-col">
//                     {publicLinks.map((link) => {
//                       const active = isActive(link.href);
//                       return (
//                         <li key={link.href}>
//                           <Link
//                             href={link.href}
//                             onClick={() => setOpen(false)}
//                             className={cn(
//                               "flex items-center gap-3 rounded-xl px-4 py-3 font-heading text-[1.05rem] transition-colors duration-150",
//                               active ? "bg-sand text-terracotta" : "text-charcoal hover:bg-sand/50"
//                             )}
//                           >
//                             {active && <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />}
//                             {link.label}
//                           </Link>
//                         </li>
//                       );
//                     })}

//                     {profile && (
//                       <li>
//                         <Link
//                           href="/messages"
//                           onClick={() => setOpen(false)}
//                           className={cn(
//                             "flex items-center gap-3 rounded-xl px-4 py-3 font-heading text-[1.05rem] transition-colors duration-150",
//                             isActive("/messages") ? "bg-sand text-terracotta" : "text-charcoal hover:bg-sand/50"
//                           )}
//                         >
//                           {isActive("/messages") && <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />}
//                           <span className="flex-1">Messages</span>
//                           {hasUnread && !onMessagesPage && (
//                             <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold text-cream">
//                               {unreadCount > 9 ? "9+" : unreadCount}
//                             </span>
//                           )}
//                         </Link>
//                       </li>
//                     )}

//                     {profile && (
//                       <li>
//                         <div className="flex items-center gap-3 rounded-xl px-4 py-3 font-heading text-[1.05rem] text-charcoal">
//                           <span className="flex-1">Notifications</span>
//                           {hasUnreadNotifs && (
//                             <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold text-cream">
//                               {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
//                             </span>
//                           )}
//                           <NotificationBell userId={profile.id} />
//                         </div>
//                       </li>
//                     )}
//                   </ul>

//                   <div className="my-2 mx-4 h-px bg-linen/80" />

//                   <div className="px-2 pb-1 flex flex-col gap-2">
//                     {isLoading ? (
//                       <div className="h-11 animate-pulse rounded-xl bg-sand" />
//                     ) : profile ? (
//                       <Link
//                         href={dashboardHref}
//                         onClick={() => setOpen(false)}
//                         className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-charcoal text-[13.5px] font-medium tracking-wide text-cream shadow-[0_2px_8px_rgba(58,50,44,0.2)] transition-all duration-200 hover:bg-espresso active:scale-[0.98]"
//                       >
//                         {dashboardLabel}
//                         <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
//                         </svg>
//                       </Link>
//                     ) : (
//                       <>
//                         <Link
//                           href="/auth/login"
//                           onClick={() => setOpen(false)}
//                           className="flex h-11 items-center justify-center rounded-xl border border-linen bg-cream text-[13.5px] font-medium text-charcoal transition-all duration-200 hover:border-clay/40 hover:bg-sand active:scale-[0.98]"
//                         >
//                           Sign in
//                         </Link>
//                         <Link
//                           href="/auth/signup"
//                           onClick={() => setOpen(false)}
//                           className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-b from-terracotta to-[#a34e2d] text-[13.5px] font-medium text-cream shadow-[0_2px_8px_rgba(184,92,56,0.25)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(184,92,56,0.35)] active:scale-[0.98]"
//                         >
//                           Join Kalakriti
//                         </Link>
//                       </>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </nav>

//         <div className={cn(
//           "h-px bg-gradient-to-r from-transparent via-linen/70 to-transparent transition-opacity duration-300",
//           scrolled ? "opacity-100" : "opacity-60"
//         )} />
//       </header>

//       {/* Backdrop overlay (separate from the panel so clicking it closes the drawer) */}
//       {open && (
//         <div
//           className="fixed inset-0 z-40 bg-espresso/20 backdrop-blur-sm md:hidden"
//           aria-hidden="true"
//           onClick={() => setOpen(false)}
//         />
//       )}
//     </>
//   );
// }


// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { useState, useEffect } from "react";
// import { useAuth } from "@/context/AuthProvider";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/Button";
// import { NotificationBell } from "@/components/layout/NotificationBell";
// import { FeedbackModal } from "@/components/ui/FeedbackModal";

// const publicLinks = [
//   { href: "/marketplace", label: "Marketplace" },
//   { href: "/creators", label: "Artisans" },
// ];

// export function Navbar() {
//   const pathname = usePathname();
//   const { profile, isLoading, unreadMessageCount, unreadNotificationCount } = useAuth();
//   const [open, setOpen] = useState(false);
//   const unreadCount = unreadMessageCount;
//   const hasUnread = unreadCount > 0;
//   const hasUnreadNotifs = unreadNotificationCount > 0;

//   const dashboardHref = profile?.role === "creator" ? "/dashboard/creator" : "/dashboard/user";
//   const dashboardLabel = profile?.role === "creator" ? "Studio" : "My Account";
//   const isActive = (href: string) =>
//     pathname === href || (href !== "/" && pathname.startsWith(href));
//   const onMessagesPage = pathname.startsWith("/messages");

//   useEffect(() => { setOpen(false); }, [pathname]);

//   useEffect(() => {
//     if (!open) return;
//     function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [open]);

//   return (
//     <>
//       <header className="sticky top-0 z-50 border-b border-linen/70 bg-cream/92 backdrop-blur-md">
//         <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
//           {/* Logo */}
//           <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
//             <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-saffron/90 to-terracotta font-heading text-xl font-semibold text-cream shadow-[var(--shadow-card)] transition-transform duration-300 group-hover:scale-105">
//               K
//             </span>
//             <span className="font-heading text-2xl font-medium tracking-tight text-charcoal">
//               Kalakriti
//             </span>
//           </Link>

//           {/* Desktop nav */}
//           <ul className="hidden items-center gap-7 md:flex">
//             {publicLinks.map((link) => (
//               <li key={link.href}>
//                 <Link
//                   href={link.href}
//                   className={cn(
//                     "text-sm tracking-wide transition-colors duration-200 hover:text-terracotta",
//                     isActive(link.href) ? "text-terracotta" : "text-warm-gray"
//                   )}
//                 >
//                   {link.label}
//                 </Link>
//               </li>
//             ))}
//             {profile && (
//               <li>
//                 <Link
//                   href="/messages"
//                   className={cn(
//                     "relative text-sm tracking-wide transition-colors hover:text-terracotta",
//                     isActive("/messages") ? "text-terracotta" : "text-warm-gray"
//                   )}
//                 >
//                   Messages
//                   {hasUnread && !onMessagesPage && (
//                     <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-bold text-cream">
//                       {unreadCount > 9 ? "9+" : unreadCount}
//                     </span>
//                   )}
//                 </Link>
//               </li>
//             )}
//           </ul>

//           {/* Desktop auth */}
//           <div className="hidden items-center gap-3 md:flex">
//             {!isLoading && profile ? (
//               <>
//                 {/* Notification bell — badge count comes from AuthProvider via NotificationBell's own hook */}
//                 <div className="relative">
//                   <NotificationBell userId={profile.id} />
//                   {/* Extra dot on bell when there are unread notifications and bell is not open */}
//                   {/* Note: NotificationBell manages its own badge via useNotifications — this is handled internally */}
//                 </div>
//                 <Button href={dashboardHref} size="sm">{dashboardLabel}</Button>
//               </>
//             ) : !isLoading ? (
//               <>
//                 <Link href="/auth/login" className="text-sm text-warm-gray transition-colors hover:text-charcoal">
//                   Sign in
//                 </Link>
//                 <Button href="/auth/signup" size="sm" variant="secondary">
//                   Join Kalakriti
//                 </Button>
//               </>
//             ) : (
//               <div className="h-8 w-24 animate-pulse rounded-full bg-sand" />
//             )}
//           </div>

//           {/* Mobile hamburger — shows both message + notification dots */}
//           <button
//             type="button"
//             className="relative flex h-10 w-10 items-center justify-center rounded-full border border-linen md:hidden"
//             onClick={() => setOpen(!open)}
//             aria-label={open ? "Close menu" : "Open menu"}
//             aria-expanded={open}
//           >
//             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               {open ? (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
//               ) : (
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
//               )}
//             </svg>
//             {/* Dot indicator for unread messages OR notifications */}
//             {((hasUnread && !onMessagesPage) || hasUnreadNotifs) && profile && (
//               <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta" />
//             )}
//           </button>
//         </nav>

//         {/* Mobile drawer */}
//         {open && (
//           <div className="animate-slide-up border-t border-linen/70 bg-cream px-4 py-5 md:hidden">
//             <ul className="flex flex-col gap-1">
//               {publicLinks.map((link) => (
//                 <li key={link.href}>
//                   <Link
//                     href={link.href}
//                     onClick={() => setOpen(false)}
//                     className={cn(
//                       "block rounded-xl px-3 py-3.5 font-heading text-lg transition-colors",
//                       isActive(link.href) ? "text-terracotta" : "text-charcoal hover:bg-sand/50"
//                     )}
//                   >
//                     {link.label}
//                   </Link>
//                 </li>
//               ))}
//               {profile && (
//                 <>
//                   <li>
//                     <Link
//                       href="/messages"
//                       onClick={() => setOpen(false)}
//                       className={cn(
//                         "flex items-center gap-2 rounded-xl px-3 py-3.5 font-heading text-lg transition-colors",
//                         isActive("/messages") ? "text-terracotta" : "text-charcoal hover:bg-sand/50"
//                       )}
//                     >
//                       Messages
//                       {hasUnread && !onMessagesPage && (
//                         <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold text-cream">
//                           {unreadCount > 9 ? "9+" : unreadCount}
//                         </span>
//                       )}
//                     </Link>
//                   </li>
//                   {/* Notifications link in mobile menu */}
//                   <li>
//                     <div className="flex items-center gap-2 rounded-xl px-3 py-3.5 font-heading text-lg text-charcoal">
//                       <span>Notifications</span>
//                       {hasUnreadNotifs && (
//                         <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1 text-xs font-bold text-cream">
//                           {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
//                         </span>
//                       )}
//                       {/* Render the bell inline in mobile menu */}
//                       <span className="ml-auto">
//                         <NotificationBell userId={profile.id} />
//                       </span>
//                     </div>
//                   </li>
//                 </>
//               )}
//             </ul>
//             <div className="mt-4 flex flex-col gap-2 border-t border-linen pt-4">
//               {isLoading ? (
//                 <div className="h-12 animate-pulse rounded-full bg-sand" />
//               ) : profile ? (
//                 <Link
//                   href={dashboardHref}
//                   onClick={() => setOpen(false)}
//                   className="flex h-12 w-full items-center justify-center rounded-full bg-charcoal text-sm font-medium text-cream"
//                 >
//                   {dashboardLabel}
//                 </Link>
//               ) : (
//                 <>
//                   <Link
//                     href="/auth/login"
//                     onClick={() => setOpen(false)}
//                     className="flex h-12 items-center justify-center rounded-full border border-linen text-sm text-charcoal"
//                   >
//                     Sign in
//                   </Link>
//                   <Link
//                     href="/auth/signup"
//                     onClick={() => setOpen(false)}
//                     className="flex h-12 items-center justify-center rounded-full bg-terracotta text-sm text-cream"
//                   >
//                     Join Kalakriti
//                   </Link>
//                 </>
//               )}
//             </div>
//           </div>
//         )}
//       </header>
//     </>
//   );
// }

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthProvider";
import { cn } from "@/lib/utils";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { FeedbackModal } from "@/components/ui/FeedbackModal";

const publicLinks = [
  { href: "/marketplace", label: "Marketplace" },
  { href: "/creators", label: "Artisans" },
  { href: "/founder", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();
  const { profile, isLoading, unreadMessageCount, unreadNotificationCount } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  // This ref wraps BOTH the hamburger button AND the drawer panel.
  // The outside-click handler checks against this single container,
  // so clicking the X button (which lives inside it) does NOT trigger close-on-outside.
  const mobileMenuRef = useRef<HTMLDivElement>(null);

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
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Outside-click and Escape — only active when drawer is open
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    function onOutside(e: MouseEvent) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    // Use setTimeout so this handler doesn't fire on the same click that opened the drawer
    const t = setTimeout(() => document.addEventListener("mousedown", onOutside), 0);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.removeEventListener("mousedown", onOutside);
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "cp-global-nav sticky top-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-cream/90 backdrop-blur-xl shadow-[0_1px_0_0_rgba(229,217,200,0.8),0_8px_32px_-8px_rgba(58,50,44,0.10)]"
            : "bg-cream/70 backdrop-blur-md"
        )}
      >
        {/* Top gold accent line */}
        <div className="h-[1.5px] w-full bg-gradient-to-r from-transparent via-saffron/40 to-transparent" />

        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8 lg:px-10">

          {/* ── Logo ── */}
          <Link
            href="/"
            className="group flex items-center gap-3"
            onClick={() => setOpen(false)}
          >
            <span className="relative flex h-9 w-9 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron/30 to-terracotta/20 opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-100" />
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-saffron via-clay to-terracotta shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_2px_8px_rgba(184,92,56,0.30)] transition-all duration-300 group-hover:shadow-[0_4px_16px_rgba(184,92,56,0.40)] group-hover:scale-105">
                <span className="font-heading text-xl font-semibold text-cream" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.20)" }}>
                  K
                </span>
              </span>
            </span>
            <span className="font-heading text-[1.45rem] font-medium tracking-tight text-charcoal transition-colors duration-200 group-hover:text-espresso">
              Kalakriti
            </span>
          </Link>

          {/* ── Desktop nav links ── */}
          <ul className="hidden items-center md:flex" style={{ gap: "2px" }}>
            {publicLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 text-[13.5px] font-medium tracking-wide transition-colors duration-200 rounded-full block",
                      active
                        ? "text-terracotta"
                        : "text-warm-gray hover:text-charcoal hover:bg-sand/60"
                    )}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute bottom-0.5 left-1/2 h-[1.5px] w-4 -translate-x-1/2 rounded-full bg-terracotta" />
                    )}
                  </Link>
                </li>
              );
            })}

            {profile && (
              <li>
                <Link
                  href="/messages"
                  className={cn(
                    "relative flex items-center gap-1.5 px-4 py-2 text-[13.5px] font-medium tracking-wide transition-colors duration-200 rounded-full",
                    isActive("/messages")
                      ? "text-terracotta"
                      : "text-warm-gray hover:text-charcoal hover:bg-sand/60"
                  )}
                >
                  Messages
                  {hasUnread && !onMessagesPage && (
                    <span className="flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-terracotta px-1 text-[9px] font-bold text-cream shadow-[0_1px_4px_rgba(184,92,56,0.4)]">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                  {isActive("/messages") && (
                    <span className="absolute bottom-0.5 left-1/2 h-[1.5px] w-4 -translate-x-1/2 rounded-full bg-terracotta" />
                  )}
                </Link>
              </li>
            )}
          </ul>

          {/* ── Desktop right actions ── */}
          <div className="hidden items-center gap-2 md:flex">
            {!isLoading && profile ? (
              <>
                {/* Feedback button — desktop */}
                <button
                  type="button"
                  onClick={() => setFeedbackOpen(true)}
                  className="flex items-center gap-1.5 rounded-full border border-linen bg-cream px-3 py-1.5 text-[12.5px] font-medium text-warm-gray shadow-[0_1px_3px_rgba(58,50,44,0.06)] transition-all duration-200 hover:border-terracotta/40 hover:bg-sand hover:text-terracotta"
                  aria-label="Send feedback"
                >
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Feedback
                </button>
                <NotificationBell userId={profile.id} />
                <div className="mx-1 h-5 w-px bg-linen" />
                <Link
                  href={dashboardHref}
                  className="group relative overflow-hidden rounded-full bg-charcoal px-5 py-2 text-[13px] font-medium tracking-wide text-cream shadow-[0_2px_8px_rgba(58,50,44,0.18)] transition-all duration-300 hover:bg-espresso hover:shadow-[0_4px_16px_rgba(58,50,44,0.28)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">{dashboardLabel}</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
              </>
            ) : !isLoading ? (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-[13.5px] font-medium text-warm-gray transition-colors duration-200 hover:text-charcoal rounded-full hover:bg-sand/60"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="group relative overflow-hidden rounded-full border border-terracotta/30 bg-gradient-to-b from-terracotta to-[#a34e2d] px-5 py-2 text-[13px] font-medium tracking-wide text-cream shadow-[0_2px_8px_rgba(184,92,56,0.22)] transition-all duration-300 hover:shadow-[0_4px_16px_rgba(184,92,56,0.32)] hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="relative z-10">Join Kalakriti</span>
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                </Link>
              </>
            ) : (
              <div className="h-8 w-28 animate-pulse rounded-full bg-sand" />
            )}
          </div>

          {/* ── Mobile right side: Founder link + hamburger (both inside mobileMenuRef) ── */}
          <div ref={mobileMenuRef} className="flex items-center gap-2 md:hidden">

            {/* Feedback icon — mobile top bar */}
            <button
              type="button"
              onClick={() => setFeedbackOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-linen bg-cream text-warm-gray transition-all duration-200 hover:border-terracotta/40 hover:bg-sand hover:text-terracotta"
              aria-label="Send feedback"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* Founder icon link — visible directly in top bar on mobile */}
            <Link
              href="/founder"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
                isActive("/founder")
                  ? "border-terracotta/40 bg-sand text-terracotta"
                  : "border-linen bg-cream text-warm-gray hover:border-clay/30 hover:bg-sand/60 hover:text-charcoal"
              )}
              aria-label="Our Story"
            >
              {/* Book / story icon */}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.7}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            </Link>

            {/* Hamburger button — inside same ref so X click doesn't trigger outside-click */}
            <button
              type="button"
              className={cn(
                "relative flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-200",
                open
                  ? "border-clay/40 bg-sand text-charcoal"
                  : "border-linen bg-cream text-warm-gray hover:border-clay/30 hover:bg-sand/60 hover:text-charcoal"
              )}
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
            >
              <span className="relative flex h-4 w-4 flex-col items-center justify-center gap-[5px]">
                <span className={cn(
                  "block h-[1.5px] w-4 rounded-full bg-current origin-center transition-all duration-300",
                  open && "translate-y-[6.5px] rotate-45"
                )} />
                <span className={cn(
                  "block h-[1.5px] w-4 rounded-full bg-current transition-all duration-200",
                  open && "opacity-0 scale-x-0"
                )} />
                <span className={cn(
                  "block h-[1.5px] w-4 rounded-full bg-current origin-center transition-all duration-300",
                  open && "-translate-y-[6.5px] -rotate-45"
                )} />
              </span>

              {/* Unread dot */}
              {((hasUnread && !onMessagesPage) || hasUnreadNotifs) && profile && (
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-terracotta shadow-[0_0_0_1.5px_var(--cream)]" />
              )}
            </button>

            {/* Drawer panel — also inside mobileMenuRef */}
            {open && (
              <div className="absolute left-4 right-4 top-[4.5rem] z-50 animate-slide-up overflow-hidden rounded-2xl border border-linen/80 bg-cream shadow-[0_20px_60px_-10px_rgba(58,50,44,0.22),0_0_0_1px_rgba(229,217,200,0.4)]">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-saffron/30 to-transparent" />

                <div className="px-2 pb-3 pt-2">
                  <ul className="flex flex-col">
                    {publicLinks.map((link) => {
                      const active = isActive(link.href);
                      return (
                        <li key={link.href}>
                          <Link
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "flex items-center gap-3 rounded-xl px-4 py-3 font-heading text-[1.05rem] transition-colors duration-150",
                              active ? "bg-sand text-terracotta" : "text-charcoal hover:bg-sand/50"
                            )}
                          >
                            {active && <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />}
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}

                    {profile && (
                      <li>
                        <Link
                          href="/messages"
                          onClick={() => setOpen(false)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-4 py-3 font-heading text-[1.05rem] transition-colors duration-150",
                            isActive("/messages") ? "bg-sand text-terracotta" : "text-charcoal hover:bg-sand/50"
                          )}
                        >
                          {isActive("/messages") && <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />}
                          <span className="flex-1">Messages</span>
                          {hasUnread && !onMessagesPage && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold text-cream">
                              {unreadCount > 9 ? "9+" : unreadCount}
                            </span>
                          )}
                        </Link>
                      </li>
                    )}

                    {profile && (
                      <li>
                        <div className="flex items-center gap-3 rounded-xl px-4 py-3 font-heading text-[1.05rem] text-charcoal">
                          <span className="flex-1">Notifications</span>
                          {hasUnreadNotifs && (
                            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-terracotta px-1.5 text-[10px] font-bold text-cream">
                              {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
                            </span>
                          )}
                          <NotificationBell userId={profile.id} />
                        </div>
                      </li>
                    )}
                  </ul>

                  <div className="my-2 mx-4 h-px bg-linen/80" />

                  <div className="px-2 pb-1 flex flex-col gap-2">
                    {isLoading ? (
                      <div className="h-11 animate-pulse rounded-xl bg-sand" />
                    ) : profile ? (
                      <Link
                        href={dashboardHref}
                        onClick={() => setOpen(false)}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-charcoal text-[13.5px] font-medium tracking-wide text-cream shadow-[0_2px_8px_rgba(58,50,44,0.2)] transition-all duration-200 hover:bg-espresso active:scale-[0.98]"
                      >
                        {dashboardLabel}
                        <svg className="h-3.5 w-3.5 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          onClick={() => setOpen(false)}
                          className="flex h-11 items-center justify-center rounded-xl border border-linen bg-cream text-[13.5px] font-medium text-charcoal transition-all duration-200 hover:border-clay/40 hover:bg-sand active:scale-[0.98]"
                        >
                          Sign in
                        </Link>
                        <Link
                          href="/auth/signup"
                          onClick={() => setOpen(false)}
                          className="flex h-11 items-center justify-center rounded-xl bg-gradient-to-b from-terracotta to-[#a34e2d] text-[13.5px] font-medium text-cream shadow-[0_2px_8px_rgba(184,92,56,0.25)] transition-all duration-200 hover:shadow-[0_4px_12px_rgba(184,92,56,0.35)] active:scale-[0.98]"
                        >
                          Join Kalakriti
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className={cn(
          "h-px bg-gradient-to-r from-transparent via-linen/70 to-transparent transition-opacity duration-300",
          scrolled ? "opacity-100" : "opacity-60"
        )} />
      </header>

      {/* Backdrop overlay (separate from the panel so clicking it closes the drawer) */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-espresso/20 backdrop-blur-sm md:hidden"
          aria-hidden="true"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Feedback modal — controlled from navbar trigger buttons */}
      <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
    </>
  );
}