"use client";

import Link from "next/link";

// Shown to non-logged-in users instead of actual links
export function LockedLinksPlaceholder({ creatorName }: { creatorName: string }) {
  return (
    <div className="cp-links-locked">
      <div className="cp-links-locked__pills" aria-hidden="true">
        {/* Fake blurred pills */}
        <div className="cp-links-locked__pill cp-links-locked__pill--ig">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <rect x="2" y="2" width="20" height="20" rx="5" stroke="currentColor" strokeWidth="1.6"/>
            <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6"/>
            <circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>
          </svg>
          Instagram
        </div>
        <div className="cp-links-locked__pill cp-links-locked__pill--wa">
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 0 1 8.66 15L22 22l-5.17-1.35A10 10 0 1 1 12 2Z" stroke="currentColor" strokeWidth="1.6"/>
          </svg>
          WhatsApp
        </div>
      </div>

      <div className="cp-links-locked__gate">
        <div className="cp-links-locked__icon" aria-hidden="true">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="3" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="cp-links-locked__text">
          Sign in to contact {creatorName}
        </p>
        <Link href="/auth/login" className="cp-links-locked__cta">
          Sign in
        </Link>
      </div>
    </div>
  );
}