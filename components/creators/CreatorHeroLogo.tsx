"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";


export function CreatorHeroLogo() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    // check on mount in case page loads mid-scroll
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Link href="/" className={`cp-logo ${scrolled ? "cp-logo--scrolled" : ""}`} aria-label="Kalakriti home">
      <span className="cp-logo__badge">
        <Image src="/logo.png" alt="Kalakriti" width={32} height={32} className="rounded-full object-contain" />
      </span>
      <span className="cp-logo__wordmark">Kalakriti</span>
    </Link>
  );
}