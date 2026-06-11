"use client";

import Link from "next/link";
import { getInitials, cn } from "@/lib/utils";

// Deterministic avatar color (same palette as ConversationList)
function avatarColor(name: string) {
  const palette = [
    "bg-terracotta/25 text-terracotta",
    "bg-saffron/25 text-saffron",
    "bg-sage/25 text-sage",
    "bg-clay/25 text-clay",
    "bg-moss/25 text-moss",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return palette[hash % palette.length];
}

type Props = {
  displayName: string;
  initials: string;
  subtitle?: string;
  avatarUrl?: string;
};

export function ChatHeader({ displayName, initials, subtitle, avatarUrl }: Props) {
  const colorClass = avatarColor(displayName);

  return (
    <div
      className="relative z-10 flex shrink-0 items-center gap-3 px-2 py-2.5"
      style={{
        background: "linear-gradient(135deg, #2c2c2c 0%, #1a1a1a 100%)",
        paddingTop: "max(0.625rem, env(safe-area-inset-top))",
        boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
      }}
    >
      {/* Back button */}
      <Link
        href="/messages"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 active:bg-white/20"
        aria-label="Back to messages"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </Link>

      {/* Avatar */}
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={displayName}
          className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white/20"
        />
      ) : (
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm ring-2 ring-white/20",
            colorClass
          )}
        >
          {initials}
        </div>
      )}

      {/* Name + subtitle */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold leading-tight text-white">
          {displayName}
        </p>
        {subtitle && (
          <p className="truncate text-[11px] text-white/55 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Right side placeholder — add menu/call icons here if needed */}
      <div className="w-10 shrink-0" />
    </div>
  );
}