"use client";

import React from "react";

interface UniverseOverviewProps {
  title: string;
  backdrop?: string;
  poster_image?: string;
  universe_type?: string;
  release_years?: string;
  rating?: string;
  description?: string;
  accent_color?: string;
  locations?: Array<{ name?: string; desc?: string; image?: string }>;
  events?: Array<{ title?: string; desc?: string; image?: string }>;
  factions?: Array<{ name?: string; desc?: string }>;
  metrics?: {
    races?: string;
    factions?: string;
    characters?: string;
    events?: string;
  };
}

export function UniverseOverview({
  title,
  backdrop,
  poster_image,
  universe_type,
  release_years,
  rating,
  description,
  accent_color = "#eed078",
  locations = [],
  events = [],
  factions = [],
  metrics = {},
}: UniverseOverviewProps) {
  const hexToRgb = (hex: string): string => {
    const cleanHex = hex.replace('#', '');
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    return `${r}, ${g}, ${b}`;
  };

  const rgbString = hexToRgb(accent_color);

  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden bg-[#020102] text-white select-none">
      {/* Scoped Dynamic Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --uni-accent: ${accent_color};
          --uni-accent-rgb: ${rgbString};
        }
        .uni-text { color: var(--uni-accent) !important; }
        .uni-text-dim { color: rgba(var(--uni-accent-rgb), 0.55) !important; }
        .uni-border { border-color: rgba(var(--uni-accent-rgb), 0.2) !important; }
        .uni-border-hover:hover { border-color: rgba(var(--uni-accent-rgb), 0.45) !important; }
        .uni-bg { background-color: rgba(var(--uni-accent-rgb), 0.08) !important; }
        .uni-bg-solid { background-color: var(--uni-accent) !important; }
        .uni-shadow { box-shadow: 0 0 12px var(--uni-accent) !important; }
        .uni-gradient-line { background: linear-gradient(to right, transparent, rgba(var(--uni-accent-rgb), 0.3), transparent) !important; }
      ` }} />

      {/* Banner with widescreen scenery */}
      <div className="relative w-full h-[40vh] md:h-[48vh] flex flex-col justify-end">
        {/* Dark atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020102]/85 via-transparent to-transparent z-10" />
        {backdrop && (
          <img 
            src={backdrop} 
            alt={title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-[1.08] saturate-[0.92]"
          />
        )}

        {/* Epic Header Title */}
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 pb-6 relative z-20 flex flex-col gap-2.5">
          <div className="flex items-center gap-3">
            <span className="uni-bg uni-border px-3 py-0.5 rounded font-mono text-[7.5px] uni-text tracking-[0.15em] uppercase">
              {universe_type || 'Franchise'}
            </span>
            <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded font-mono text-[7.5px] text-white/50 tracking-[0.1em]">
              Release {release_years}
            </span>
            <span className="font-mono text-[7.5px] uni-text tracking-[0.1em]">
              ★ {rating}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[0.22em] text-white mt-1 uppercase" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 4px 20px rgba(0,0,0,0.85)' }}>
            {title}
          </h1>

          <p className="font-sans text-[12px] md:text-[13px] text-white/80 max-w-2xl leading-relaxed italic font-light tracking-wide mt-2">
            "{description || 'Explore this universe'}"
          </p>
        </div>
      </div>

      {/* ── OVERVIEW CONTENT ── */}
      <div className="flex-1 w-full max-w-[1720px] mx-auto px-6 md:px-12 py-10 relative z-20">
        <div className="flex flex-col gap-8 w-full pb-10">
          
          {/* ROW 1: Widescreen Hero Section (2/3 width) + Map Panel (1/3 width) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Hero Showcase Panel (8 cols) */}
            <div className="lg:col-span-8 relative h-[480px] rounded-2xl overflow-hidden border uni-border shadow-[0_24px_80px_rgba(0,0,0,0.65)] flex flex-col justify-between p-10 group bg-[#040605]">
              <div className="absolute inset-0 bg-gradient-to-t from-[#020302] via-[#020302]/35 to-transparent z-10" />
              {backdrop && (
                <img 
                  src={backdrop} 
                  alt={title} 
                  className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-[1.08] saturate-[0.88] group-hover:scale-102 transition-transform duration-[8000ms]"
                />
              )}
              
              {/* Top Breadcrumb & Title */}
              <div className="relative z-20 flex flex-col gap-1">
                <span className="font-mono text-[7px] uni-text tracking-[0.35em] uppercase opacity-80">REALMS › UNIVERSE PORTAL › {title.toUpperCase()}</span>
                <h2 className="text-4xl md:text-5xl font-normal text-white uppercase tracking-wide font-serif leading-none mt-3" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.95)' }}>
                  {title}
                </h2>
                <p className="font-serif text-[12px] text-white/70 italic leading-relaxed max-w-xl mt-3.5">
                  "{description ? description.split('.')[0] + '.' : 'Explore this universe'}"
                </p>
              </div>

              {/* Bottom Badges & Stats Counters */}
              <div className="relative z-20 flex flex-col gap-5">
                {/* Tags row */}
                <div className="flex flex-wrap gap-2">
                  <span className="uni-bg border uni-border px-2.5 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">LEGENDARY SAGA</span>
                  <span className="uni-bg border uni-border px-2.5 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">CINEMATIC DECK</span>
                  <span className="uni-bg border uni-border px-2.5 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">INTERACTIVE</span>
                  <span className="bg-black/55 border border-white/5 px-2.5 py-1 rounded font-mono text-[7.5px] text-white/40 tracking-wider">TYPE: {universe_type || 'Franchise'}</span>
                  <span className="bg-black/55 border border-white/5 px-2.5 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">AAA CINEMATIC</span>
                </div>

                {/* Statistical Counters Box */}
                <div className="grid grid-cols-5 gap-3 bg-black/45 backdrop-blur-md border border-white/5 rounded-xl p-4">
                  {[
                    { label: 'RACES', val: metrics?.races || '5+', icon: '🧬' },
                    { label: 'FACTIONS', val: metrics?.factions || '8+', icon: '🛡️' },
                    { label: 'CHARACTERS', val: metrics?.characters || '50+', icon: '👤' },
                    { label: 'EVENTS', val: metrics?.events || '30+', icon: '📜' },
                    { label: 'LOCATIONS', val: `${locations?.length || '12'}+`, icon: '📍' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2.5 border-r border-white/5 last:border-0 pr-1">
                      <span className="text-lg shrink-0">{item.icon}</span>
                      <div className="flex flex-col">
                        <span className="font-mono text-[6.5px] text-white/30 uppercase tracking-widest leading-none">{item.label}</span>
                        <span className="text-xs font-semibold uni-text font-serif leading-none mt-1.5">{item.val}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Map Panel (4 cols) */}
            <div className="lg:col-span-4 h-[480px] rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
              
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[7px] uni-text tracking-[0.3em] uppercase">{title.toUpperCase()} ARCHIVE</span>
                <div className="h-[210px] rounded-xl overflow-hidden border border-white/5 relative mt-1.5 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050406] via-transparent to-transparent z-10" />
                  {locations?.[0]?.image || backdrop ? (
                    <img 
                      src={locations?.[0]?.image || backdrop} 
                      alt="World map preview" 
                      className="w-full h-full object-cover brightness-[0.72] group-hover:scale-105 transition-transform duration-1000"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#050406] flex items-center justify-center text-white/20">
                      No Image
                    </div>
                  )}
                </div>
                <p className="font-serif text-[11.5px] text-white/55 leading-relaxed font-light mt-2">
                  {description || 'Explore the key landmarks that define the boundary of this legendary world.'}
                </p>
              </div>

              <button className="w-full py-2.5 rounded border uni-border uni-border-hover uni-bg uni-text font-mono text-[8px] tracking-[0.25em] uppercase cursor-none transition-colors">
                VIEW WORLD MAP
              </button>
            </div>

          </div>

          {/* ROW 2: The Story (1/3) + Featured Location (1/3) + Latest Event (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full">
            
            {/* Card 1: Story So Far */}
            <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative min-h-[220px]">
              <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[7px] uni-text uppercase tracking-widest block">STORY SO FAR</span>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <p className="col-span-2 font-serif text-[11px] text-white/60 leading-relaxed font-light">
                    {description?.split('.')?.[1] ? `${description.split('.')[1]}.` : description || 'The epic journey through this universe.'}
                  </p>
                  {backdrop && (
                    <div className="h-[90px] rounded-lg overflow-hidden border border-white/5 relative">
                      <img src={backdrop} alt="Story visual" className="w-full h-full object-cover filter brightness-[0.7]" />
                    </div>
                  )}
                </div>
              </div>
              <button className="w-fit py-1.5 px-4 rounded border border-white/10 uni-border-hover bg-white/[0.01] hover:uni-bg text-white/70 hover:uni-text font-mono text-[8.5px] tracking-wider cursor-none transition-colors">
                EXPLORE TIMELINE ›
              </button>
            </div>

            {/* Card 2: Featured Location */}
            <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative min-h-[220px]">
              <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[7px] uni-text uppercase tracking-widest block">FEATURED LOCATION</span>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <p className="col-span-2 font-serif text-[11px] text-white/60 leading-relaxed font-light">
                    {locations?.[0] ? `${locations[0].name}: ${locations[0].desc}` : 'Explore the key landmarks that define the boundary of this legendary world.'}
                  </p>
                  <div className="h-[90px] rounded-lg overflow-hidden border border-white/5 relative">
                    {locations?.[0]?.image || backdrop ? (
                      <img src={locations?.[0]?.image || backdrop} alt="Featured Location" className="w-full h-full object-cover filter brightness-[0.7]" />
                    ) : (
                      <div className="w-full h-full bg-[#050406] flex items-center justify-center text-white/20">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button className="w-fit py-1.5 px-4 rounded border border-white/10 uni-border-hover bg-white/[0.01] hover:uni-bg text-white/70 hover:uni-text font-mono text-[8.5px] tracking-wider cursor-none transition-colors">
                EXPLORE LOCATION ›
              </button>
            </div>

            {/* Card 3: Latest Event */}
            <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative min-h-[220px]">
              <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[7px] uni-text uppercase tracking-widest block">LATEST EVENT</span>
                <div className="grid grid-cols-3 gap-4 items-center">
                  <p className="col-span-2 font-serif text-[11px] text-white/60 leading-relaxed font-light">
                    {events?.[0] ? `${events[0].title}: ${events[0].desc?.substring(0, 80) || ''}...` : 'The turning points of history that defined eras and shaped the current realm.'}
                  </p>
                  <div className="h-[90px] rounded-lg overflow-hidden border border-white/5 relative">
                    {events?.[0]?.image || backdrop ? (
                      <img src={events?.[0]?.image || backdrop} alt="Event visual" className="w-full h-full object-cover filter brightness-[0.7]" />
                    ) : (
                      <div className="w-full h-full bg-[#050406] flex items-center justify-center text-white/20">
                        No Image
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <button className="w-fit py-1.5 px-4 rounded border border-white/10 uni-border-hover bg-white/[0.01] hover:uni-bg text-white/70 hover:uni-text font-mono text-[8.5px] tracking-wider cursor-none transition-colors">
                VIEW EVENT ›
              </button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
