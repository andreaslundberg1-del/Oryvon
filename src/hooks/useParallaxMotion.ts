"use client";

import { useEffect, type RefObject } from "react";

type ParallaxFactors = {
  mouseX: number;
  mouseY: number;
  scrollY: number;
  scaleScroll?: number;
};

/**
 * Applies transform directly to a DOM node each frame — no React state updates.
 */
export function useParallaxMotion(
  ref: RefObject<HTMLElement | null>,
  factors: ParallaxFactors,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let targetX = 0;
    let targetY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let scrollY = 0;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    };

    const readScroll = () => {
      const raw = getComputedStyle(document.documentElement).getPropertyValue("--oryvon-scroll-y");
      scrollY = raw ? parseFloat(raw) : window.scrollY;
    };

    const tick = () => {
      readScroll();
      mouseX += (targetX - mouseX) * 0.06;
      mouseY += (targetY - mouseY) * 0.06;

      const scale = factors.scaleScroll
        ? 1 + scrollY * factors.scaleScroll
        : 1;

      el.style.transform = `translate3d(${mouseX * factors.mouseX}px, ${mouseY * factors.mouseY + scrollY * factors.scrollY}px, 0) scale(${scale})`;

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [enabled, factors.mouseX, factors.mouseY, factors.scrollY, factors.scaleScroll, ref]);
}
