"use client";

import React from "react";
import OryndorLogo from "@/components/OryndorLogo";

interface HeroSectionProps {
  hero_logo_url?: string;
  hero_text?: string;
  slogan?: string;
  subtitle?: string;
  background_image_url?: string;
  fullHeight?: boolean;
}

export function HeroSection({
  hero_logo_url,
  hero_text = "ORYVON",
  slogan = "Worlds Evolve. Stories Endure.",
  subtitle = "Choose a realm and open the archive",
  background_image_url,
  fullHeight = true,
}: HeroSectionProps) {
  return (
    <div className={`flex flex-col items-center justify-between w-full ${fullHeight ? 'h-full max-h-screen' : 'h-auto'} relative z-20 px-4 sm:px-6 py-3 sm:py-4`}>
      {/* Layered Space/Fantasy Backdrop & Particles Behind Portals */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-black">
        {/* Deep Cosmic space dark base */}
        <div 
          className="absolute inset-0 opacity-100"
          style={{
            background: "radial-gradient(circle at 50% 50%, #0c0907 0%, #040302 65%, #000000 100%)",
          }}
        />

        {/* Left golden/bronze nebula cloud */}
        <div 
          className="absolute top-[-10%] -left-[15%] w-[75vw] h-[95vh] rounded-full filter blur-[130px] opacity-30 mix-blend-screen"
          style={{
            background: "radial-gradient(circle at center, rgba(168, 118, 42, 0.38) 0%, rgba(80, 50, 10, 0.18) 50%, transparent 80%)",
            animation: "nebula-drift-left 32s ease-in-out infinite alternate",
          }}
        />
        
        {/* Right golden/bronze nebula cloud */}
        <div 
          className="absolute top-[10%] -right-[15%] w-[75vw] h-[95vh] rounded-full filter blur-[130px] opacity-28 mix-blend-screen"
          style={{
            background: "radial-gradient(circle at center, rgba(238, 208, 120, 0.35) 0%, rgba(138, 88, 12, 0.15) 50%, transparent 80%)",
            animation: "nebula-drift-right 36s ease-in-out infinite alternate",
          }}
        />

        {/* Additional Layered Golden Core Nebula Behind Logo */}
        <div 
          className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[98vw] h-[72vh] rounded-full filter blur-[110px] opacity-85 mix-blend-screen"
          style={{
            background: "radial-gradient(circle, rgba(255, 223, 130, 0.28) 0%, rgba(201, 147, 58, 0.15) 45%, rgba(138, 88, 12, 0.05) 70%, transparent 100%)",
          }}
        />

        {/* Soft Indigo/Purple backdrop hue for chromatic depth around the edges */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-color-dodge"
          style={{
            background: `
              radial-gradient(circle at 10% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 90% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
            `,
            filter: "blur(60px)",
          }}
        />

        {/* Dark Volumetric Space Dust/Clouds Layer 1 (Smoky atmosphere) */}
        <div 
          className="absolute top-[5%] left-[5%] w-[65vw] h-[60vh] rounded-full filter blur-[130px] opacity-[0.88] mix-blend-multiply pointer-events-none"
          style={{
            background: "radial-gradient(circle, #18110b 0%, #070504 60%, transparent 95%)",
            animation: "nebula-drift-left 45s ease-in-out infinite alternate",
          }}
        />

        {/* Dark Volumetric Space Dust/Clouds Layer 2 */}
        <div 
          className="absolute top-[20%] right-[5%] w-[60vw] h-[60vh] rounded-full filter blur-[120px] opacity-[0.82] mix-blend-multiply pointer-events-none"
          style={{
            background: "radial-gradient(circle, #140f09 0%, #050403 65%, transparent 95%)",
            animation: "nebula-drift-right 52s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* Dark Volumetric Space Dust/Clouds Layer 3 - Centered */}
        <div 
          className="absolute top-[35%] left-[25%] w-[65vw] h-[45vh] rounded-full filter blur-[130px] opacity-[0.85] mix-blend-multiply pointer-events-none"
          style={{
            background: "radial-gradient(circle, #120d08 0%, #040302 60%, transparent 95%)",
            animation: "nebula-drift-left 48s ease-in-out infinite alternate-reverse",
          }}
        />

        {/* Dense Golden Dust Lane behind Explore Realms and Portals */}
        <div 
          className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[98vw] h-[40vh] rounded-full filter blur-[100px] opacity-65 mix-blend-screen"
          style={{
            background: "radial-gradient(ellipse at center, rgba(238, 208, 120, 0.15) 0%, rgba(201, 147, 58, 0.05) 50%, transparent 80%)",
          }}
        />

        {/* Heavy Film Vignette overlay for rich contrast and edge depth */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none select-none"
          style={{
            background: "radial-gradient(circle at center, transparent 15%, rgba(0, 0, 0, 0.75) 60%, rgba(0, 0, 0, 1) 100%)",
          }}
        />

        {/* Subtle dynamic noise overlay for high-end film grain texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuOCIgbnVtT2N0YXZlcz0iMSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] mix-blend-overlay z-20" />
      </div>

      {/* Thin Vertical Golden Needle Ray */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#c9933a]/20 to-transparent pointer-events-none z-10"
        style={{ height: "100%" }}
      />

      {/* ── 1. Top Cinematic Hero Area ── */}
      <div className="flex flex-col items-center relative z-20 w-full pt-1 md:pt-2">
        <div className="mb-0.5 md:mb-1 font-mono text-[6px] sm:text-[7px] text-amber-500/35 tracking-[0.3em] sm:tracking-[0.4em] uppercase hero-sub">
          [ LAT: 59.3293° N // LNG: 18.0686° E // ALT: 850m ]
        </div>

        {/* Majestic Center Oryndor Symbol Emblem (Centered above O R Y V O N logo) */}
        <div 
          className="mb-1 md:mb-2 relative z-20 pointer-events-auto transition-transform duration-700 hover:scale-[1.04]"
          style={{ filter: "drop-shadow(0 0 70px rgba(255, 233, 163, 0.85)) drop-shadow(0 0 35px rgba(201, 147, 58, 0.7)) drop-shadow(0 4px 20px rgba(0,0,0,0.9))" }}
        >
          {hero_logo_url ? (
            <img
              src={hero_logo_url}
              alt={hero_text || "ORYVON"}
              className="oryvon-logo-float pointer-events-auto object-contain"
              style={{ width: 200, height: 200 }}
            />
          ) : (
            <OryndorLogo 
              size={200} 
              variant="icon" 
              className="oryvon-logo-float pointer-events-auto"
            />
          )}
        </div>

        {/* Elegant Golden Serif Title O R Y V O N */}
        <h1
          className="text-2xl sm:text-3xl md:text-4xl lg:text-[46px] font-normal tracking-[0.35em] sm:tracking-[0.45em] md:tracking-[0.55em] text-center block mr-[-0.35em] sm:mr-[-0.45em] md:mr-[-0.55em] transition-all duration-700 text-white z-20 hero-logo"
          style={{
            fontFamily: "'Cinzel', 'Times New Roman', serif",
            background: 'linear-gradient(135deg, #ffffff 0%, #ffe9a3 40%, #c9933a 75%, #ffffff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.6))',
          }}
        >
          {hero_text}
        </h1>

        {/* Styled Diamond Separator Line */}
        <div className="flex items-center justify-center w-[140px] sm:w-[180px] my-1 sm:my-1.5 relative z-20 hero-sub">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/35 to-transparent" />
          <div 
            className="w-1.5 h-1.5 rotate-45 border border-amber-500 bg-[#020101] shadow-[0_0_10px_rgba(245,158,11,0.7)] flex items-center justify-center" 
          >
            <div className="w-0.5 h-0.5 bg-white rounded-full" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/35 to-transparent" />
        </div>

        {/* Tagline */}
        <p
          className="tracking-[0.35em] sm:tracking-[0.4em] md:tracking-[0.45em] uppercase text-center font-light block font-mono text-[7px] sm:text-[8px] md:text-[9px] text-amber-500/60 z-20 mr-[-0.35em] sm:mr-[-0.4em] md:mr-[-0.45em] hero-sub"
        >
          {slogan}
        </p>

        {/* Descend to Explore Archive indicator */}
        <div className="flex flex-col items-center gap-1 mt-2 sm:mt-3 md:mt-4 relative z-20 pointer-events-none hero-sub">
          <span 
            className="font-mono text-[6px] sm:text-[6.5px] md:text-[7.5px] text-amber-500/40 tracking-[0.35em] sm:tracking-[0.45em] uppercase"
            style={{
              textShadow: "0 0 8px rgba(245,158,11,0.2)"
            }}
          >
            {subtitle}
          </span>
          <svg 
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500/35 animate-bounce-slow" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      {/* Global CSS for animations */}
      <style jsx global>{`
        @keyframes nebula-drift-left {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(25px, -15px, 0) scale(1.06);
          }
        }
        @keyframes nebula-drift-right {
          0% {
            transform: translate3d(0, 0, 0) scale(1);
          }
          100% {
            transform: translate3d(-25px, 15px, 0) scale(1.05);
          }
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(6px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}
