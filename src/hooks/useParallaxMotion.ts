"use client";

import { useEffect, type RefObject } from "react";

type ParallaxFactors = {
  mouseX: number;
  mouseY: number;
  scrollY: number;
  scaleScroll?: number;
};

// Module-level scroll cache shared across all parallax instances — one listener, zero getComputedStyle calls
let _parallaxScrollY = 0;
let _mouseTargetX = 0;
let _mouseTargetY = 0;
let _parallaxListenersAttached = false;

function attachParallaxListeners() {
  if (typeof window === "undefined" || _parallaxListenersAttached) return;
  // Skip on touch devices — no mouse parallax needed, saves battery
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;
  _parallaxListenersAttached = true;
  window.addEventListener("scroll", () => { _parallaxScrollY = window.scrollY; }, { passive: true });
  window.addEventListener("mousemove", (e: MouseEvent) => {
    _mouseTargetX = e.clientX / window.innerWidth - 0.5;
    _mouseTargetY = e.clientY / window.innerHeight - 0.5;
  }, { passive: true });
}

/**
 * Applies transform directly to a DOM node each frame — no React state updates.
 */
export function useParallaxMotion(
  ref: RefObject<HTMLElement | null>,
  factors: ParallaxFactors,
  enabled = true
) {
  useEffect(() => {
    attachParallaxListeners();
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let mouseX = 0;
    let mouseY = 0;
    let rafId = 0;

    const tick = () => {
      mouseX += (_mouseTargetX - mouseX) * 0.06;
      mouseY += (_mouseTargetY - mouseY) * 0.06;

      const scrollY = _parallaxScrollY;
      const scale = factors.scaleScroll ? 1 + scrollY * factors.scaleScroll : 1;

      el.style.transform = `translate3d(${mouseX * factors.mouseX}px, ${mouseY * factors.mouseY + scrollY * factors.scrollY}px, 0) scale(${scale})`;

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafId); };
  }, [enabled, factors.mouseX, factors.mouseY, factors.scrollY, factors.scaleScroll, ref]);
}
