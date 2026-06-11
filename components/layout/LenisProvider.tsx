"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * LenisProvider — adds Lenis smooth scrolling globally,
 * but automatically disables it on /messages routes
 * so the chat's internal scroll container isn't interfered with.
 */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<unknown>(null);
  const rafRef = useRef<number>(0);
  const pathname = usePathname();

  // Disable Lenis on all messages pages — they have their own scroll container
  const isChat = pathname.startsWith("/messages");

  useEffect(() => {
    if (isChat) return;

    let destroyed = false;

    async function init() {
      const { default: Lenis } = await import("lenis");

      if (destroyed) return;

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
        infinite: false,
      });

      lenisRef.current = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }
      rafRef.current = requestAnimationFrame(raf);
    }

    init();

    return () => {
      destroyed = true;
      cancelAnimationFrame(rafRef.current);
      if (lenisRef.current) {
        (lenisRef.current as { destroy: () => void }).destroy();
        lenisRef.current = null;
      }
    };
  }, [isChat]);

  return <>{children}</>;
}