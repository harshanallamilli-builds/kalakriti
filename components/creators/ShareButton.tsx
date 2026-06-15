"use client";

import { useState, useEffect } from "react";

type ShareButtonProps = {
  url: string;
  title: string;
  variant?: "default" | "ghost";
};

export function ShareButton({ title, variant = "default" }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  async function handleShare() {
    const shareUrl = currentUrl;
    if (navigator.share) {
      try {
        await navigator.share({ title, url: shareUrl });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isGhost = variant === "ghost";

  return (
    <button
      onClick={handleShare}
      className={`cp-share-btn ${isGhost ? "cp-share-btn--ghost" : ""}`}
      aria-label="Share this portfolio"
      title="Share this portfolio"
    >
      {copied ? (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path d="M2 7l3.5 3.5L12 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Copied!
        </>
      ) : (
        <>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="11" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
            <circle cx="11" cy="11.5" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
            <circle cx="3" cy="7" r="1.5" stroke="currentColor" strokeWidth="1.4"/>
            <path d="M4.4 6.2l5.2-3M4.4 7.8l5.2 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
          </svg>
          Share
        </>
      )}
    </button>
  );
}