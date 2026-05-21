"use client";

import React from 'react';

interface CinematicFilterProps {
  style: string;
  year: number;
  children: React.ReactNode;
}

import { motion } from 'framer-motion';

export default function CinematicFilter({ style, year, children }: CinematicFilterProps) {
  // Base filters updated by the Evolution Engine
  const baseFilter = "contrast(1.1) brightness(1.05)";
  
  return (
    <div className={`relative w-full h-full overflow-hidden transition-all duration-1000 pointer-events-none`}
         style={{ 
           filter: `var(--evo-pixel-filter, none) ${baseFilter}`,
           backdropFilter: `blur(calc(var(--evo-pixelation) * 0.5))`
         }}>
      <div className="w-full h-full pointer-events-auto">
        {children}
      </div>
      
      {/* Dynamic Evolution Overlay */}
      <div className="absolute inset-0 pointer-events-none z-[100] overflow-hidden">
        {/* Dynamic Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-[var(--evo-scanlines)] pointer-events-none" />
        
        {/* Dynamic Bloom/Glow Overlay */}
        <div className="absolute inset-0 bg-white/5 blur-3xl opacity-[var(--evo-bloom)] pointer-events-none" />
        
        {/* Chromatic Aberration */}
        <div className="absolute inset-0 mix-blend-screen opacity-[var(--evo-chromatic)] blur-[1px] translate-x-[2px] bg-red-500/5 pointer-events-none" />
        <div className="absolute inset-0 mix-blend-screen opacity-[var(--evo-chromatic)] blur-[1px] -translate-x-[2px] bg-blue-500/5 pointer-events-none" />

        {/* Temporal Fog Layer (The "Mysterious" vibe) */}
        <motion.div 
          animate={{ 
            x: [-10, 10, -10],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute inset-[-10%] bg-gradient-radial from-white/10 to-transparent blur-[80px] pointer-events-none" 
        />

        {/* Glitch Flicker Overlay */}
        <motion.div 
          animate={{ 
            opacity: [0, 0.1, 0, 0.05, 0],
            backgroundColor: ['transparent', 'rgba(255,255,255,0.05)', 'transparent']
          }}
          transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 8 }}
          className="absolute inset-0 pointer-events-none z-[110]"
          style={{ opacity: 'var(--evo-glitch, 0)' }}
        />
      </div>

      <style jsx global>{`
        :root {
          --evo-pixelation: 0px;
          --evo-bloom: 0;
          --evo-scanlines: 0;
          --evo-chromatic: 0;
          --evo-glitch: 0;
        }

        @keyframes radar-sweep {
          from { transform: translateY(100vh); }
          to { transform: translateY(-100vh); }
        }

        .pixelated {
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
      
      {/* SVG filter for pixelation effect (if CSS image-rendering isn't enough) */}
      <svg width="0" height="0" className="absolute">
        <defs>
          <filter id="evolution-pixelate" x="0" y="0">
            <feFlood x="4" y="4" height="2" width="2" />
            <feComposite width="8" height="8" />
            <feTile result="a" />
            <feComposite in="SourceGraphic" in2="a" operator="in" />
            <feMorphology operator="dilate" radius="2" />
          </filter>
        </defs>
      </svg>
    </div>
  );
}
