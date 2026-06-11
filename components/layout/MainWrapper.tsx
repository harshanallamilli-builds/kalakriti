"use client";

/**
 * MainWrapper — wraps all non-chat pages in the app shell.
 * Chat pages (/messages/[id]) are handled by their own layout.tsx
 * which uses `fixed inset-0` so they are completely removed from
 * the normal flow — no navbar, no footer, no scroll bleed.
 */
export function MainWrapper({ children }: { children: React.ReactNode }) {
  return <main className="flex-1 pb-16 md:pb-0">{children}</main>;
}