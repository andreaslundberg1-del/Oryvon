import React from "react";

/** Static vignette only — animated grain/glitch removed to prevent flicker (see layout noise-overlay). */
export default function CinematicOverlay() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[200] overflow-hidden oryvon-gpu-layer"
      aria-hidden
    >
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle, transparent 42%, rgba(0,0,0,0.55) 100%)",
        }}
      />
    </div>
  );
}
