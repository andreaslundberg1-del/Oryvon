"use client";

import React, { useState } from 'react';

interface CinematicCompassProps {
  size?: number;
  color?: string;
  className?: string;
}

export default function CinematicCompass({ size = 130, color = "#c9933a", className = "" }: CinematicCompassProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Mysterious ancient cosmic runes for the orbiting ring
  const RUNES = "ᛟ ᚦ ᚲ ᛒ ᚫ ᚵ ᚹ ᚺ ᛏ ᛒ ᛖ ᛗ ᛚ ᛜ ᛞ ᚨ ᚱ ᛋ ᛏ ᚛ ᚚ ᚙ ᚘ ᚗ";

  return (
    <div 
      className={`relative flex items-center justify-center select-none cursor-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: size,
        height: size,
        transition: 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)',
        transform: isHovered ? 'scale(1.08) rotate(15deg)' : 'scale(1) rotate(0deg)',
        willChange: 'transform',
      }}
    >
      {/* ── Volumetric Golden Light Rays (Soft moving background) ── */}
      <div 
        className="absolute inset-[-40px] pointer-events-none transition-opacity duration-700 ease-in-out"
        style={{
          opacity: isHovered ? 0.75 : 0.45,
          zIndex: 1,
        }}
      >
        <div 
          className="absolute left-1/2 top-[-10%] -translate-x-1/2 w-[160px] h-[160%] bg-gradient-to-b from-amber-400/18 via-amber-500/4 to-transparent"
          style={{
            clipPath: 'polygon(35% 0%, 65% 0%, 95% 100%, 5% 100%)',
            filter: 'blur(10px)',
            animation: 'volumetric-breathe 8s ease-in-out infinite alternate',
          }}
        />
      </div>

      {/* ── Outer Golden Ring Halo & Subtle Ambient Pulses ── */}
      <div 
        className="absolute inset-[-12px] rounded-full pointer-events-none mix-blend-screen"
        style={{
          border: '1px solid rgba(245, 158, 11, 0.08)',
          boxShadow: isHovered 
            ? `0 0 50px rgba(201, 147, 58, 0.32), inset 0 0 25px rgba(201, 147, 58, 0.16)`
            : `0 0 30px rgba(201, 147, 58, 0.12), inset 0 0 15px rgba(201, 147, 58, 0.06)`,
          animation: 'halo-pulse 4s ease-in-out infinite alternate',
          zIndex: 2,
          willChange: 'transform, opacity',
          transform: 'translate3d(0, 0, 0)',
          transition: 'box-shadow 0.6s ease-out',
        }}
      />

      {/* ── Main SVG Compass & Rings ── */}
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 100 100" 
        className="relative pointer-events-none drop-shadow-[0_0_25px_rgba(201,147,58,0.3)]"
        style={{ zIndex: 3 }}
      >
        <defs>
          {/* Glowing Filters */}
          <filter id="compass-core-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="1.8" result="blur1" />
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Central Radial Gradient */}
          <radialGradient id="compass-center-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="35%" stopColor="#ffe28a" stopOpacity="0.95" />
            <stop offset="70%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── LAYER 1: Orbiting Ancient Glyphs (Runic Outer Ring) ── */}
        <path 
          id="rune-orbit-path" 
          d="M 50,50 m -45,0 a 45,45 0 1,1 90,0 a 45,45 0 1,1 -90,0" 
          fill="none" 
          stroke="none" 
        />
        <text 
          fill={color} 
          fontSize="3" 
          fontWeight="light" 
          letterSpacing="0.44em" 
          opacity={isHovered ? 0.85 : 0.55}
          className="transition-all duration-700"
          style={{
            fontFamily: "monospace, serif",
            textShadow: isHovered ? '0 0 8px rgba(245,158,11,0.8)' : 'none',
            transformOrigin: '50px 50px',
            animation: `rune-spin ${isHovered ? '16s' : '26s'} linear infinite`,
          }}
        >
          <textPath href="#rune-orbit-path" startOffset="0%">
            {RUNES}
          </textPath>
        </text>

        {/* ── LAYER 2: Outer Dashed Gear Ring (Counter-rotating) ── */}
        <circle 
          cx="50" 
          cy="50" 
          r="41" 
          fill="none" 
          stroke={color} 
          strokeWidth="0.45" 
          strokeOpacity={isHovered ? 0.55 : 0.3} 
          strokeDasharray="1.5 5"
          className="transition-all duration-700"
          style={{
            transformOrigin: '50px 50px',
            animation: `rune-spin ${isHovered ? '20s' : '35s'} linear infinite reverse`,
          }}
        />

        {/* ── LAYER 3: Main Concentric Ring ── */}
        <circle 
          cx="50" 
          cy="50" 
          r="36" 
          fill="none" 
          stroke={color} 
          strokeWidth={isHovered ? "0.95" : "0.7"} 
          strokeOpacity={isHovered ? 0.85 : 0.5}
          className="transition-all duration-700"
        />

        {/* ── LAYER 4: Inner Astrolabe Dash Ring (Clockwise rotating) ── */}
        <circle 
          cx="50" 
          cy="50" 
          r="30" 
          fill="none" 
          stroke={color} 
          strokeWidth="0.5" 
          strokeOpacity={isHovered ? 0.65 : 0.3} 
          strokeDasharray="6 3 2 3"
          className="transition-all duration-700"
          style={{
            transformOrigin: '50px 50px',
            animation: `rune-spin ${isHovered ? '12s' : '22s'} linear infinite`,
          }}
        />

        {/* ── LAYER 5: Coordinate Star Crosshairs ── */}
        <line x1="50" y1="9" x2="50" y2="91" stroke={color} strokeWidth="0.35" strokeOpacity={isHovered ? 0.6 : 0.3} />
        <line x1="9" y1="50" x2="91" y2="50" stroke={color} strokeWidth="0.35" strokeOpacity={isHovered ? 0.6 : 0.3} />

        {/* Decorative central cross ticks */}
        <circle cx="50" cy="30" r="0.75" fill={color} opacity={isHovered ? 0.85 : 0.45} />
        <circle cx="50" cy="70" r="0.75" fill={color} opacity={isHovered ? 0.85 : 0.45} />
        <circle cx="30" cy="50" r="0.75" fill={color} opacity={isHovered ? 0.85 : 0.45} />
        <circle cx="70" cy="50" r="0.75" fill={color} opacity={isHovered ? 0.85 : 0.45} />

        {/* ── LAYER 6: Grand Cardinal Star Arrows (North, South, East, West) ── */}
        {/* North Arrow (Levitating & glowing) */}
        <polygon 
          points="50,6 53.5,20 50,24 46.5,20" 
          fill={color} 
          filter="url(#compass-core-glow)"
          opacity={isHovered ? 1.0 : 0.8}
          className="transition-all duration-500"
          style={{
            transformOrigin: '50px 50px',
            animation: isHovered ? 'north-levitate 0.8s ease-in-out infinite alternate' : 'none',
          }}
        />
        {/* South Arrow */}
        <polygon points="50,94 53,80 50,76 47,80" fill={color} opacity={isHovered ? 0.75 : 0.45} className="transition-opacity duration-500" />
        {/* West Arrow */}
        <polygon points="6,50 20,47 24,50 20,53" fill={color} opacity={isHovered ? 0.75 : 0.45} className="transition-opacity duration-500" />
        {/* East Arrow */}
        <polygon points="94,50 80,47 76,50 80,53" fill={color} opacity={isHovered ? 0.75 : 0.45} className="transition-opacity duration-500" />

        {/* ── LAYER 7: Living Central Core Node ── */}
        {/* Radiant center glow */}
        <circle 
          cx="50" 
          cy="50" 
          r={isHovered ? 14 : 9.5} 
          fill="url(#compass-center-grad)" 
          filter="url(#compass-core-glow)"
          className="transition-all duration-700"
          style={{ mixBlendMode: 'screen' }}
        />
        {/* Solid center white spark */}
        <circle 
          cx="50" 
          cy="50" 
          r={isHovered ? 3.5 : 2.5} 
          fill="#ffffff" 
          className="transition-all duration-700"
          style={{
            boxShadow: '0 0 10px #ffffff',
          }}
        />
      </svg>

      {/* ── Radiating Mini Spark Particles (Activated on hover) ── */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {Array.from({ length: 12 }).map((_, i) => {
            const angle = (i * 30 * Math.PI) / 180;
            const x = Math.cos(angle) * 35;
            const y = Math.sin(angle) * 35;
            
            return (
              <div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-amber-400"
                style={{
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 4px #ffe48e, 0 0 8px #d4a030',
                  animation: `compass-particle-emit 1.2s cubic-bezier(0.1, 0.8, 0.2, 1) infinite`,
                  animationDelay: `${i * 0.08}s`,
                  // Custom variables for keyframe animations
                  ['--tx' as any]: `${x * 1.6}px`,
                  ['--ty' as any]: `${y * 1.6}px`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Global Embedded Styles specific to CinematicCompass */}
      <style jsx>{`
        @keyframes rune-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes volumetric-breathe {
          0% { opacity: 0.25; transform: translateX(-50%) scaleX(0.85) scaleY(0.92); }
          100% { opacity: 0.85; transform: translateX(-50%) scaleX(1.15) scaleY(1.08); }
        }
        @keyframes halo-pulse {
          0% { transform: scale(0.96); opacity: 0.65; }
          100% { transform: scale(1.04); opacity: 1.0; }
        }
        @keyframes north-levitate {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-1.5px); }
        }
        @keyframes compass-particle-emit {
          0% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
