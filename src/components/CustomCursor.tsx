"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useCursor, CursorTheme } from "@/contexts/CursorContext";

type HoverType = "none" | "gaming" | "cinema" | "sport" | "standard";

export default function CustomCursor() {
  const { settings, isDesktop } = useCursor();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [hoverType, setHoverType] = useState<HoverType>("none");
  const [isHidden, setIsHidden] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const checkCursor = () => {
      setDisabled(document.body.classList.contains("no-custom-cursor"));
    };
    checkCursor();
    const observer = new MutationObserver(checkCursor);
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Mutable refs for raw position tracking — no React state, no re-renders
  const mouse = useRef({ x: -200, y: -200 });
  const ring = useRef({ x: -200, y: -200 });
  const trail = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (!isDesktop || "ontouchstart" in window || navigator.maxTouchPoints > 0) return;
    setIsHidden(false);

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const monolith = target.closest(".genre-portal") as HTMLElement | null;
      const timeline = target.closest(".timeline-portal");
      const btn = target.closest("button") || target.closest("a") || target.tagName === "BUTTON" || target.tagName === "A";

      if (monolith) {
        const id = monolith.getAttribute("data-genre") || "";
        if (id === "gaming") setHoverType("gaming");
        else if (id === "cinema") setHoverType("cinema");
        else if (id === "sport") setHoverType("sport");
        else setHoverType("standard");
      } else if (timeline || btn) {
        setHoverType("standard");
      } else {
        setHoverType("none");
      }

      // Set hovering state for effects
      setIsHovering(!!(monolith || timeline || btn));
    };

    const onDown = () => setIsClicking(true);
    const onUp = () => setIsClicking(false);

    const onClick = (e: MouseEvent) => {
      setClicks(prev => [...prev, { id: Date.now() + Math.random(), x: e.clientX, y: e.clientY }]);
    };

    // RAF loop — runs at 60-120fps, bypasses React entirely
    const loop = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // Dot: 1:1 instant, direct DOM write
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
      }

      // Ring: fast lerp (smooth but snappy, ~8 frames to catch up)
      ring.current.x += (mx - ring.current.x) * 0.28;
      ring.current.y += (my - ring.current.y) * 0.28;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px) translate(-50%, -50%)`;
      }

      // Trail glow: slow lerp (heavy trailing fog effect)
      trail.current.x += (mx - trail.current.x) * 0.1;
      trail.current.y += (my - trail.current.y) * 0.1;
      if (trailRef.current) {
        trailRef.current.style.transform = `translate(${trail.current.x}px, ${trail.current.y}px) translate(-50%, -50%)`;
      }

      rafId.current = requestAnimationFrame(loop);
    };

    rafId.current = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("mousedown", onClick, { passive: true });

    return () => {
      cancelAnimationFrame(rafId.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousedown", onClick);
    };
  }, [isDesktop]);

  const removeClick = (id: number) => setClicks(prev => prev.filter(c => c.id !== id));

  // Get cursor style based on theme and hover type
  const cursorStyle = useMemo(() => {
    const baseStyle = {
      color: "#eed078",
      glow: "rgba(238,208,120,0.2)",
      ringSize: 40,
      dotSize: 4,
      shape: "50%" as string,
    };

    // Override with hover type colors
    switch (hoverType) {
      case "gaming":  return { ...baseStyle, color: "#22d3ee", glow: "rgba(34,211,238,0.6)",  ringSize: 48, dotSize: 6 };
      case "cinema":  return { ...baseStyle, color: "#f59e0b", glow: "rgba(245,158,11,0.6)",  ringSize: 56, dotSize: 8 };
      case "sport":   return { ...baseStyle, color: "#10b981", glow: "rgba(16,185,129,0.6)", ringSize: 48, dotSize: 6 };
      case "standard":return { ...baseStyle, color: "#ffffff", glow: "rgba(255,255,255,0.4)", ringSize: 36, dotSize: 5 };
      default:        return baseStyle;
    }
  }, [hoverType]);

  // Apply theme-specific modifications
  const themeStyle = useMemo(() => {
    const theme = settings.theme;
    
    switch (theme) {
      case 'minimal-gold-dot':
        return { ringSize: 0, dotSize: 8, shape: "50%" };
      case 'sci-fi-ring':
        return { ringSize: 50, dotSize: 6, shape: "50%" };
      case 'hollow-circle':
        return { ringSize: 30, dotSize: 0, shape: "50%" };
      case 'energy-pulse':
        return { ringSize: 35, dotSize: 10, shape: "50%" };
      case 'mythic-rune':
        return { ringSize: 0, dotSize: 12, shape: "polygon" };
      case 'cyber':
        return { ringSize: 0, dotSize: 10, shape: "polygon" };
      case 'elegant-thin':
        return { ringSize: 24, dotSize: 0, shape: "square" };
      case 'glow-trail':
        return { ringSize: 0, dotSize: 10, shape: "50%" };
      case 'orbit':
        return { ringSize: 45, dotSize: 8, shape: "50%" };
      default:
        return { ringSize: 40, dotSize: 4, shape: "50%" };
    }
  }, [settings.theme]);

  const style = { ...cursorStyle, ...themeStyle };

  // Apply effects
  const hasHoverExpand = settings.effects.includes('hover-expand');
  const hasClickRipple = settings.effects.includes('click-ripple');
  const hasGlowIntensity = settings.effects.includes('glow-intensity');
  const hasSmoothTrail = settings.effects.includes('smooth-trail');
  const hasCinematicSmooth = settings.effects.includes('cinematic-smooth');

  // Calculate transform based on effects
  const dotTransform = useMemo(() => {
    let scale = 1;
    if (hasHoverExpand && isHovering) {
      scale = settings.hoverScale;
    }
    if (isClicking) {
      scale *= 0.8;
    }
    return scale;
  }, [hasHoverExpand, isHovering, isClicking, settings.hoverScale]);

  // Calculate glow based on effects
  const glowIntensity = useMemo(() => {
    let intensity = 1;
    if (hasGlowIntensity) {
      intensity = 1 + (settings.glowIntensity / 50);
    }
    return intensity;
  }, [hasGlowIntensity, settings.glowIntensity]);

  // Calculate trail duration
  const trailDuration = useMemo(() => {
    if (hasSmoothTrail || hasCinematicSmooth) {
      return settings.trailDuration;
    }
    return 300;
  }, [hasSmoothTrail, hasCinematicSmooth, settings.trailDuration]);

  if (disabled || isHidden || !isDesktop) return null;

  return (
    <>
      {/* Click shockwave ripples */}
      {hasClickRipple && clicks.map(click => (
        <ClickRipple key={click.id} x={click.x} y={click.y} color={style.color} onDone={() => removeClick(click.id)} />
      ))}

      {/* Trail glow — slowest, heaviest blur */}
      {style.ringSize > 0 && (
        <div
          ref={trailRef}
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: 90, height: 90,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${style.glow} 0%, transparent 75%)`,
            filter: `blur(${14 * glowIntensity}px)`,
            pointerEvents: "none",
            zIndex: 99999998,
            mixBlendMode: "screen",
            opacity: hoverType !== "none" ? 0.45 : 0.18,
            transition: hasCinematicSmooth ? `opacity 0.4s ease, background 0.4s ease, filter ${trailDuration}ms ease` : "opacity 0.4s ease, background 0.4s ease",
            willChange: "transform",
          }}
        />
      )}

      {/* Outer ring — lerp-follows cursor */}
      {style.ringSize > 0 && (
        <div
          ref={ringRef}
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: style.ringSize, height: style.ringSize,
            borderRadius: style.shape === "50%" ? "50%" : style.shape === "square" ? "2px" : style.shape === "polygon" ? "50%" : "50%",
            border: `1px solid ${style.color}`,
            pointerEvents: "none",
            zIndex: 99999999,
            mixBlendMode: "screen",
            opacity: 0.7,
            transition: hasCinematicSmooth ? `width 0.25s ease, height 0.25s ease, border-color 0.3s ease, opacity 0.3s ease, transform ${trailDuration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)` : "width 0.25s ease, height 0.25s ease, border-color 0.3s ease, opacity 0.3s ease",
            willChange: "transform",
            boxShadow: hoverType !== "none" ? `0 0 10px ${style.color}55` : "none",
            transform: hasHoverExpand && isHovering ? `scale(${settings.hoverScale})` : undefined,
          }}
        >
          {/* Inner rotating compass ring */}
          {hoverType === "none" && settings.theme === 'default' && (
            <>
              <div style={{
                position: "absolute", inset: 4, borderRadius: "50%",
                border: "1px solid rgba(238,208,120,0.3)",
                animation: "cursor-spin-slow 30s linear infinite",
              }}/>
              <div style={{
                position: "absolute", top: "50%", left: "50%",
                width: 4, height: 4, borderRadius: "50%",
                background: "#eed078",
                transform: "translate(-50%,-50%)",
                boxShadow: "0 0 6px #eed078",
              }}/>
            </>
          )}
          {hoverType === "gaming" && (
            <div style={{
              position: "absolute", inset: 5, borderRadius: 3,
              border: "1px solid rgba(34,211,238,0.5)",
              animation: "cursor-spin-med 8s linear infinite reverse",
            }}/>
          )}
          {hoverType === "cinema" && (
            <div style={{
              position: "absolute", inset: 5, borderRadius: "50%",
              border: "1px dashed rgba(245,158,11,0.5)",
              animation: "cursor-spin-med 10s linear infinite",
            }}/>
          )}
          {hoverType === "sport" && (
            <div style={{
              position: "absolute", inset: 5, borderRadius: "50%",
              border: "1px solid rgba(16,185,129,0.4)",
              animation: "cursor-spin-med 4s linear infinite",
            }}/>
          )}
        </div>
      )}

      {/* Core dot — instant 1:1, no lag whatsoever */}
      {style.dotSize > 0 && (
        <div
          ref={dotRef}
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: style.dotSize, height: style.dotSize,
            borderRadius: style.shape === "50%" ? "50%" : style.shape === "square" ? "2px" : style.shape === "polygon" ? "50%" : "50%",
            background: style.color,
            pointerEvents: "none",
            zIndex: 99999999,
            mixBlendMode: "screen",
            boxShadow: `0 0 ${8 * glowIntensity}px ${style.color}, 0 0 ${16 * glowIntensity}px ${style.color}88`,
            transition: hasCinematicSmooth ? `width 0.2s ease, height 0.2s ease, background 0.3s ease, box-shadow 0.3s ease, transform ${trailDuration}ms cubic-bezier(0.34, 1.56, 0.64, 1)` : "width 0.2s ease, height 0.2s ease, background 0.3s ease, box-shadow 0.3s ease",
            willChange: "transform",
            transform: `scale(${dotTransform})`,
          }}
        />
      )}

      <style>{`
        @keyframes cursor-spin-slow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes cursor-spin-med  { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </>
  );
}

// Click ripple as a self-animating component using CSS animation
function ClickRipple({ x, y, color, onDone }: { x: number; y: number; color: string; onDone: () => void }) {
  return (
    <div
      onAnimationEnd={onDone}
      style={{
        position: "fixed",
        top: y, left: x,
        width: 16, height: 16,
        borderRadius: "50%",
        border: `1px solid ${color}`,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 99999998,
        mixBlendMode: "screen",
        animation: "cursor-ripple 0.65s ease-out forwards",
      }}
    >
      <style>{`
        @keyframes cursor-ripple {
          0%   { transform: translate(-50%,-50%) scale(0.5); opacity: 0.9; }
          100% { transform: translate(-50%,-50%) scale(8);   opacity: 0; }
        }
      `}</style>
    </div>
  );
}
