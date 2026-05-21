"use client";

import React, { useState } from "react";

interface GenreDef {
  id: string;
  label: string;
  system: string;
  sub: string;
  color: string;
  glow: string;
  count: string;
  bgImage: string;
  goldIcon: React.ReactNode;
}

interface PortalsSectionProps {
  portals: GenreDef[];
  onPortalClick?: (id: string) => void;
}

export function PortalsSection({ portals, onPortalClick }: PortalsSectionProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-center justify-center gap-0.5 w-full relative z-20 my-0.5 md:my-1 px-4 sm:px-6">
      <div className="flex items-center justify-center gap-4 w-full max-w-xl">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c9933a]/60 to-[#c9933a]/90" />
        <div className="w-2.5 h-2.5 rotate-45 border border-amber-500 bg-[#020101] shadow-[0_0_15px rgba(245,158,11,0.9)] flex items-center justify-center">
          <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0 0 5px_#fff]" />
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#c9933a]/60 to-[#c9933a]/90" />
      </div>
      
      <h2
        className="text-sm sm:text-base md:text-lg font-normal tracking-[0.35em] sm:tracking-[0.45em] text-center block select-none text-white mr-[-0.35em] sm:mr-[-0.45em]"
        style={{
          fontFamily: "'Cinzel', 'Times New Roman', serif",
          background: 'linear-gradient(135deg, #ffffff 0%, #ffe9a3 40%, #c9933a 75%, #ffffff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          filter: 'drop-shadow(0 2px 10px rgba(197,150,53,0.15))',
        }}
      >
        EXPLORE THE ARCHIVE
      </h2>
      
      <span
        className="font-mono text-[6.5px] sm:text-[7px] md:text-[7.5px] text-[#eed078]/55 tracking-[0.4em] sm:tracking-[0.48em] uppercase mr-[-0.4em] sm:mr-[-0.48em]"
      >
        Choose a realm and open the archive
      </span>

      {/* ── Portal Cards Row ── */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-3.5 md:gap-3.5 lg:gap-4.5 xl:gap-5.5 w-full max-w-[1450px] relative z-20 pb-3 md:pb-5 px-4 sm:px-0">
        {portals.map((g) => (
          <EraPortal
            key={g.id}
            g={g}
            hovered={hoveredItem === g.id}
            onClick={() => {
              onPortalClick?.(g.id);
            }}
            onEnter={() => {
              setHoveredItem(g.id);
            }}
            onLeave={() => {
              setHoveredItem(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Era Portal Card Component ── */
function EraPortal({ 
  g, 
  hovered, 
  onClick, 
  onEnter, 
  onLeave 
}: { 
  g: GenreDef; 
  hovered: boolean; 
  onClick: () => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <div 
      className="relative shrink-0 cursor-pointer group w-full sm:w-auto"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      <div
        className={`w-[140px] h-[140px] sm:w-[140px] sm:h-[140px] md:w-[165px] md:h-[165px] lg:w-[190px] lg:h-[190px] xl:w-[220px] xl:h-[220px] rounded-full relative overflow-hidden transition-all duration-700 mx-auto`}
        style={{
          border: hovered 
            ? `2px solid ${g.color}` 
            : `1px solid rgba(201, 147, 58, 0.25)`,
          boxShadow: hovered 
            ? `0 0 35px ${g.glow}, inset 0 0 25px ${g.glow}25` 
            : `0 0 15px rgba(201, 147, 58, 0.15), inset 0 0 8px rgba(201, 147, 58, 0.08)`,
        }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{
            backgroundImage: `url(${g.bgImage})`,
            backgroundSize: "200% 200%",
            opacity: hovered ? 0.55 : 0.20,
            filter: "blur(5px)",
            animation: "shimmer-rays 9s linear infinite reverse",
          }}
        />

        {/* Top atmospheric colored light spotlight beam */}
        <div
          className="absolute inset-x-0 top-0 h-2/3 z-5 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at 50% 0%, rgba(238, 208, 120, 0.22) 0%, transparent 75%)`,
            opacity: hovered ? 1 : 0.45,
          }}
        />

        {/* Elegant Golden Engraved Inner Trim Frame */}
        <div 
          className="absolute inset-[5px] rounded-[175px_175px_11px_11px] pointer-events-none transition-all duration-700 z-10"
          style={{
            border: hovered 
              ? `1.2px solid rgba(238, 208, 120, 0.55)` 
              : `1px solid rgba(201, 147, 58, 0.15)`,
            boxShadow: hovered 
              ? `0 0 15px rgba(238, 208, 120, 0.25), inset 0 0 10px rgba(238, 208, 120, 0.15)` 
              : `0 0 8px rgba(201, 147, 58, 0.08), inset 0 0 5px rgba(201, 147, 58, 0.05)`,
          }}
        />

        {/* Bottom soft colored light mist rising up */}
        <div 
          className="absolute bottom-0 inset-x-0 h-36 pointer-events-none transition-all duration-700 z-10"
          style={{
            background: hovered
              ? `linear-gradient(to top, ${g.color}25 0%, ${g.color}08 50%, transparent 100%)`
              : `linear-gradient(to top, ${g.color}15 0%, ${g.color}04 40%, transparent 100%)`,
            opacity: hovered ? 0.90 : 0.70,
          }}
        />

        {/* Dark Vignette Overlay to ensure text readability */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: hovered
              ? "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.85) 100%)"
              : "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.22) 65%, rgba(0,0,0,0.92) 100%)",
          }}
        />

        {/* Inner Content (Icon, Label, Count stacked vertically) */}
        <div className="relative z-20 flex flex-col items-center gap-3 w-full text-center mt-auto pb-1">
          {/* Realm Icon */}
          <div 
            className="transition-all duration-[750ms] ease-out pb-0.5"
            style={{
              transform: hovered ? "scale(1.18) translateY(-6px)" : "scale(1)",
              filter: hovered 
                ? `drop-shadow(0 0 12px ${g.color})` 
                : `drop-shadow(0 0 4px ${g.color}60)`,
            }}
          >
            {g.goldIcon}
          </div>

          <div className="flex flex-col gap-0.5">
            {/* Title */}
            <h3
              style={{
                fontFamily: "'Cinzel', 'Times New Roman', serif",
                fontSize: "clamp(11px, 0.82vw, 12.5px)",
                letterSpacing: "0.24em",
                color: hovered ? "#ffffff" : "rgba(255,255,255,0.88)",
                textShadow: hovered
                  ? `0 0 10px rgba(238, 208, 120, 0.75), 0 0 18px ${g.color}45`
                  : `0 0 4px rgba(0,0,0,0.9)`,
                transition: "all 0.5s",
                whiteSpace: "nowrap",
              }}
              className="font-normal"
            >
              {g.label}
            </h3>

            {/* Realm Count */}
            <span 
              className="font-mono text-[7px] tracking-[0.18em] transition-colors duration-500 font-semibold uppercase"
              style={{
                color: hovered ? g.color : "rgba(238,208,120,0.45)"
              }}
            >
              {g.count.split(' ')[0]} REALMS
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
