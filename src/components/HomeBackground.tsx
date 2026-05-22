"use client";

import React, { useRef, useState, useEffect, useMemo, memo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { useParallaxMotion } from "@/hooks/useParallaxMotion";
import ParticleBackground from "./ParticleBackground";

// Module-level scroll cache — attached lazily after mount to avoid SSR crash
let _cachedScrollY = 0;
let _bgScrollListenerAttached = false;

function CinematicCamera() {
  useFrame((state) => {
    const targetZ = 5 - _cachedScrollY * 0.0018;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.04);
    state.camera.position.x = Math.sin(state.clock.elapsedTime * 0.05) * 0.25;
    state.camera.position.y = Math.cos(state.clock.elapsedTime * 0.04) * 0.2;
  });
  return null;
}

function AnimatedStars() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.0005;
    }
  });
  return (
    <group ref={groupRef}>
      <Stars radius={200} depth={80} count={2000} factor={3} saturation={0.05} fade speed={0.2} />
    </group>
  );
}

function HomeBackgroundInner({ activeTimeline }: { activeTimeline: string | null }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isTouch, setIsTouch] = useState(false);

  const nebulaRef = useRef<HTMLDivElement>(null);
  const ringsRef = useRef<HTMLDivElement>(null);
  const ruinsRef = useRef<HTMLDivElement>(null);
  const mistRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
    const touch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouch(touch);
    // Attach scroll listener here so it's browser-only, never SSR
    if (!_bgScrollListenerAttached && !touch) {
      _bgScrollListenerAttached = true;
      window.addEventListener("scroll", () => { _cachedScrollY = window.scrollY; }, { passive: true });
    }
  }, []);

  const active = !!activeTimeline;
  const isGaming = activeTimeline === "gaming" || activeTimeline === "graphics-history";
  const isCinema = activeTimeline === "cinema" || activeTimeline === "film-history" || activeTimeline === "got-lore";
  const isSport = activeTimeline === "sport" || activeTimeline === "football-history";

  const heroVisible = !activeTimeline;
  const landscapeVisible = !activeTimeline;

  useParallaxMotion(nebulaRef, { mouseX: -5, mouseY: -5, scrollY: 0.04, scaleScroll: 0.00006 }, heroVisible);
  useParallaxMotion(ringsRef, { mouseX: -14, mouseY: -14, scrollY: 0.08, scaleScroll: 0.00014 }, heroVisible);
  useParallaxMotion(ruinsRef, { mouseX: -22, mouseY: -22, scrollY: 0.16, scaleScroll: 0.00018 }, landscapeVisible);
  useParallaxMotion(mistRef, { mouseX: -32, mouseY: -32, scrollY: 0.28, scaleScroll: 0.00028 }, landscapeVisible);

  const runeLines = useMemo(
    () =>
      Array.from({ length: 12 }).map((_, i) => ({
        y: 350 + i * 24,
        width: 6 + (i % 4) * 3,
        opacity: 0.4 + (i % 3) * 0.12,
      })),
    []
  );

  if (!isMounted) {
    return <div className="absolute inset-0 z-0 bg-[#020101]" />;
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden bg-[#020101] select-none pointer-events-none oryvon-bg-root">
      {/* Layer 0 — gold space particles */}
      {heroVisible && (
        <div className="absolute inset-0 z-10 pointer-events-none opacity-85">
          <ParticleBackground />
        </div>
      )}
      {/* Layer 1 — COSMIC PHOTO BACKGROUND */}
      <div
        className="absolute inset-[-5%] z-0"
        style={{ opacity: heroVisible ? 1 : 0.08, transition: "opacity 1.5s ease-out" }}
      >
        {/* The user-provided cosmic nebula photo */}
        <img
          src="/Images/cosmic_bg.png"
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover oryvon-nebula-drift"
          style={{
            filter: "brightness(0.72) saturate(1.1)",
            transformOrigin: "center center",
            willChange: "transform",
          }}
        />
        {/* Radial vignette to blend edges into black */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, transparent 20%, rgba(2,1,1,0.55) 65%, rgba(2,1,1,0.95) 100%)",
          }}
        />
      </div>

      {/* Layer 1b — nebula gradient glow on top of photo */}
      <div
        ref={nebulaRef}
        className="absolute inset-[-8%] z-[1] oryvon-gpu-layer"
        style={{ opacity: heroVisible ? 1 : 0, transition: "opacity 1.2s ease-out" }}
      >
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(201,147,58,0.14) 0%, transparent 65%), radial-gradient(circle at 20% 70%, rgba(139,92,246,0.04) 0%, transparent 55%), radial-gradient(circle at 80% 30%, rgba(201,147,58,0.08) 0%, transparent 60%)",
            willChange: "transform",
          }}
        />
        {isMounted && !isTouch && (
          <div className="absolute inset-0 opacity-80">
            <Canvas
              camera={{ position: [0, 0, 5], fov: 60 }}
              gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
              dpr={[1, 1.2]}
            >
              <fog attach="fog" args={["#020101", 120, 320]} />
              <ambientLight intensity={0.01} color="#ffcc80" />
              <CinematicCamera />
              <AnimatedStars />
            </Canvas>
          </div>
        )}
      </div>


      {/* Layer 2 — orbit rings */}
      <div
        ref={ringsRef}
        className="absolute inset-[-18%] z-10 flex items-center justify-center oryvon-gpu-layer"
        style={{
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 1.2s ease-out",
          perspective: 1000,
          contain: "paint",
        }}
      >
        <div
          className="w-[min(1200px,95vw)] h-[min(1200px,95vw)] relative"
          style={{ transform: "rotateX(58deg) rotateY(10deg)" }}
        >
          <div
            className="absolute inset-0 rounded-full border border-amber-500/10 oryvon-spin-slow"
            style={{ boxShadow: "inset 0 0 40px rgba(245,158,11,0.02)" }}
          />
          <div className="absolute inset-[12%] rounded-full border border-dashed border-amber-500/8 oryvon-spin-reverse" />
          <div className="absolute inset-[22%] rounded-full border border-amber-500/12 oryvon-spin-mid" />
          <div
            className="absolute inset-[-12%] rounded-full opacity-70"
            style={{
              background: "radial-gradient(circle, rgba(238,150,20,0.1) 0%, transparent 72%)",
              filter: "blur(36px)",
            }}
          />
        </div>
      </div>

      {/* Layer 3 — ruins SVG */}
      <div
        ref={ruinsRef}
        className="absolute inset-[-15%] z-20 oryvon-gpu-layer"
        style={{
          opacity: landscapeVisible ? 1 : 0.14,
          transition: "opacity 1.2s ease-out",
        }}
      >
        <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 1000" aria-hidden>
          <defs>
            <linearGradient id="back-ruins-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#17120c" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#040302" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="mid-ruins-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0f0c08" stopOpacity="0.94" />
              <stop offset="100%" stopColor="#020101" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="front-ruins-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#080605" />
              <stop offset="100%" stopColor="#000000" />
            </linearGradient>
            <linearGradient id="monolith-glow-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffe9a3" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#c59635" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,1000 L0,360 L140,460 L280,590 L420,790 L500,890 L580,790 L720,590 L860,460 L1000,360 L1000,1000 Z"
            fill="url(#mid-ruins-grad)"
            opacity="0.9"
          />
          <path
            d="M0,1000 L0,540 L160,630 L320,810 L450,970 L500,994 L550,970 L680,810 L840,630 L1000,540 L1000,1000 Z"
            fill="url(#front-ruins-grad)"
          />
          <path
            d="M32,380 Q22,460 38,540 T30,680"
            stroke="url(#monolith-glow-grad)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            opacity="0.75"
          />
          <g fill="#ffeaad" opacity="0.55">
            {runeLines.map((line, idx) => (
              <rect key={idx} x="962" y={line.y} width={line.width} height="2" rx="1" opacity={line.opacity} />
            ))}
          </g>
        </svg>
      </div>

      {/* Layer 4 — mist */}
      <div
        ref={mistRef}
        className="absolute inset-[-20%] z-30 overflow-hidden oryvon-gpu-layer"
        style={{
          opacity: landscapeVisible ? 1 : 0.12,
          transition: "opacity 1.2s ease-out",
        }}
      >
        <div className="absolute top-[40%] left-[-10%] w-[120%] h-[30%] bg-[radial-gradient(ellipse_at_center,rgba(110,75,30,0.06)_0%,transparent_70%)] oryvon-mist-drift" style={{ willChange: 'transform' }} />
        <div className="absolute bottom-0 left-0 right-0 h-[38%] bg-gradient-to-t from-[#020101] via-[#020101]/80 to-transparent" />
      </div>

      {/* Genre tint overlays */}
      <div
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          opacity: isGaming ? 1 : 0,
          transition: "opacity 1s ease-out",
          background: "radial-gradient(circle at 50% 50%, rgba(34,211,238,0.12) 0%, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          opacity: isCinema ? 1 : 0,
          transition: "opacity 1s ease-out",
          background: "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.1) 0%, transparent 75%)",
        }}
      />
      <div
        className="absolute inset-0 z-40 pointer-events-none"
        style={{
          opacity: isSport ? 1 : 0,
          transition: "opacity 1s ease-out",
          background: "radial-gradient(circle at 50% 50%, rgba(16,185,129,0.1) 0%, transparent 75%)",
        }}
      />

      <div
        className="absolute inset-0 z-[45] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 18%, rgba(0,0,0,0.75) 72%, rgba(0,0,0,0.96) 100%)",
        }}
      />

      {active && (
        <div
          className="absolute inset-0 z-[48] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, rgba(197,150,53,0.04) 0%, transparent 75%)",
          }}
        />
      )}
    </div>
  );
}

export default memo(HomeBackgroundInner);
