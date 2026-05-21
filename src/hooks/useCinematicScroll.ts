"use client";

import { useEffect } from "react";

/**
 * Pushes scroll position to --oryvon-scroll-y on <html> once per frame.
 * Avoids React re-renders from scroll listeners (major flicker source with Lenis).
 */
export function useCinematicScroll() {
  useEffect(() => {
    let rafId = 0;
    let latestY = 0;

    const commit = () => {
      rafId = 0;
      document.documentElement.style.setProperty("--oryvon-scroll-y", String(latestY));
    };

    const schedule = (y: number) => {
      latestY = y;
      if (!rafId) rafId = requestAnimationFrame(commit);
    };

    const onScroll = (e: Event) => {
      let y = 0;
      if (e.target === document) {
        y = window.scrollY || document.documentElement.scrollTop;
      } else if (e.target instanceof HTMLElement) {
        y = e.target.scrollTop;
      }
      schedule(y);
    };

    // Use capture: true so scroll events from nested scroll containers (like <main>) are intercepted
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    
    // Initial check
    const mainEl = document.querySelector("main");
    const initialY = window.scrollY || document.documentElement.scrollTop || (mainEl ? mainEl.scrollTop : 0);
    schedule(initialY);

    return () => {
      window.removeEventListener("scroll", onScroll, { capture: true });
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);
}
