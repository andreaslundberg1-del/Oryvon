"use client";

import { ReactLenis } from 'lenis/react';
import { ReactNode } from 'react';

export default function SmoothScroller({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1.0, smoothWheel: true, syncTouch: false }}>
      {children}
    </ReactLenis>
  );
}
