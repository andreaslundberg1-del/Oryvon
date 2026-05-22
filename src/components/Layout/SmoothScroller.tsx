"use client";

import { ReactLenis } from 'lenis/react';
import { ReactNode, useState, useEffect } from 'react';

export default function SmoothScroller({ children }: { children: ReactNode }) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // Disable Lenis on touch/mobile devices — causes body collapse + white screen on iOS Safari
    const touch = typeof window !== 'undefined' && (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth < 1024
    );
    setIsTouch(touch);
  }, []);

  // On mobile: render children directly with native scroll
  if (isTouch) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1.0, smoothWheel: true, syncTouch: false }}>
      {children}
    </ReactLenis>
  );
}
