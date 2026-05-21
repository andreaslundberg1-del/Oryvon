"use client";

import React from "react";

interface CharacterDetailProps {
  name?: string;
  biography?: string;
  image_url?: string;
  species_race?: string;
  status?: string;
  accent_color?: string;
  role?: string;
  affiliations?: string[];
  abilities?: string[];
}

export function CharacterDetail({
  name,
  biography,
  image_url,
  species_race,
  status,
  accent_color = "#eed078",
  role,
  affiliations = [],
  abilities = [],
}: CharacterDetailProps) {
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
        .uni-border { border-color: rgba(var(--uni-accent-rgb), 0.2) !important; }
        .uni-bg { background-color: rgba(var(--uni-accent-rgb), 0.08) !important; }
        .uni-bg-solid { background-color: var(--uni-accent) !important; }
        .uni-gradient-line { background: linear-gradient(to right, transparent, rgba(var(--uni-accent-rgb), 0.3), transparent) !important; }
      ` }} />

      {/* Character Banner */}
      <div className="relative w-full h-[45vh] md:h-[50vh] flex flex-col justify-end">
        {/* Dark atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020102]/90 via-transparent to-transparent z-10" />
        {image_url && (
          <img 
            src={image_url} 
            alt={name || "Character"}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.6] contrast-[1.1] saturate-[0.95]"
          />
        )}

        {/* Character Header */}
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 pb-8 relative z-20 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="uni-bg uni-border px-3 py-0.5 rounded font-mono text-[7.5px] uni-text tracking-[0.15em] uppercase">
              {species_race || "Unknown Species"}
            </span>
            <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded font-mono text-[7.5px] text-white/50 tracking-[0.1em]">
              {role || "Character"}
            </span>
            {status && (
              <span className="font-mono text-[7.5px] uni-text tracking-[0.1em]">
                ● {status}
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-normal tracking-[0.22em] text-white mt-2 uppercase" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
            {name || "Character Name"}
          </h1>
        </div>
      </div>

      {/* Character Content */}
      <div className="flex-1 w-full max-w-[1720px] mx-auto px-6 md:px-12 py-10 relative z-20">
        <div className="flex flex-col gap-8 w-full pb-10">
          
          {/* ROW 1: Biography (2/3) + Character Stats (1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            
            {/* Biography Panel (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-8 shadow-2xl relative">
              <div className="absolute top-0 left-8 right-8 h-[1.5px] uni-gradient-line" />
              
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[7.5px] uni-text uppercase tracking-widest block">BIOGRAPHY</span>
                <p className="font-serif text-[13px] text-white/70 leading-relaxed font-light">
                  {biography || "No biography available for this character."}
                </p>
              </div>
            </div>

            {/* Character Stats Panel (4 cols) */}
            <div className="lg:col-span-4 rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between shadow-2xl relative">
              <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
              
              <div className="flex flex-col gap-4">
                <span className="font-mono text-[7.5px] uni-text uppercase tracking-widest block">CHARACTER STATS</span>
                
                {/* Character Portrait */}
                <div className="h-[180px] rounded-xl overflow-hidden border border-white/5 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050406] via-transparent to-transparent z-10" />
                  {image_url ? (
                    <img 
                      src={image_url} 
                      alt={name || "Character"} 
                      className="w-full h-full object-cover brightness-[0.75]"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#050406] flex items-center justify-center text-white/20">
                      No Image
                    </div>
                  )}
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-3 bg-black/45 border border-white/5 rounded-lg p-3">
                  <div className="flex flex-col">
                    <span className="font-mono text-[6px] text-white/30 uppercase tracking-widest leading-none">SPECIES</span>
                    <span className="text-[9px] font-semibold uni-text font-serif leading-none mt-1.5">{species_race || "Unknown"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[6px] text-white/30 uppercase tracking-widest leading-none">STATUS</span>
                    <span className="text-[9px] font-semibold uni-text font-serif leading-none mt-1.5">{status || "Unknown"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[6px] text-white/30 uppercase tracking-widest leading-none">ROLE</span>
                    <span className="text-[9px] font-semibold text-white/70 font-serif leading-none mt-1.5">{role || "Unknown"}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[6px] text-white/30 uppercase tracking-widest leading-none">AFFILIATIONS</span>
                    <span className="text-[9px] font-semibold text-white/70 font-serif leading-none mt-1.5">{affiliations?.length || 0}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* ROW 2: Affiliations (1/2) + Abilities (1/2) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch w-full">
            
            {/* Affiliations Card */}
            <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative">
              <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[7px] uni-text uppercase tracking-widest block">AFFILIATIONS</span>
                <div className="flex flex-wrap gap-2">
                  {affiliations && affiliations.length > 0 ? (
                    affiliations.map((affiliation, idx) => (
                      <span key={idx} className="uni-bg border uni-border px-3 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">
                        {affiliation}
                      </span>
                    ))
                  ) : (
                    <span className="font-serif text-[11px] text-white/50 italic">No affiliations recorded</span>
                  )}
                </div>
              </div>
            </div>

            {/* Abilities Card */}
            <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative">
              <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
              <div className="flex flex-col gap-3">
                <span className="font-mono text-[7px] uni-text uppercase tracking-widest block">ABILITIES</span>
                <div className="flex flex-wrap gap-2">
                  {abilities && abilities.length > 0 ? (
                    abilities.map((ability, idx) => (
                      <span key={idx} className="uni-bg border uni-border px-3 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">
                        {ability}
                      </span>
                    ))
                  ) : (
                    <span className="font-serif text-[11px] text-white/50 italic">No abilities recorded</span>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
