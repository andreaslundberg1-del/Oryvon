"use client";

import React from "react";

interface TimelineEvent {
  id: string;
  title: string;
  date?: string;
  year?: string;
  description?: string;
  image_url?: string;
}

interface TimelineVisualizationProps {
  events: TimelineEvent[];
  accent_color?: string;
}

export function TimelineVisualization({
  events,
  accent_color = "#eed078",
}: TimelineVisualizationProps) {
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

      {/* Timeline Header */}
      <div className="relative w-full h-[35vh] md:h-[40vh] flex flex-col justify-end">
        {/* Dark atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020102]/90 via-transparent to-transparent z-10" />
        
        {/* Background image from first event if available */}
        {events?.[0]?.image_url && (
          <img 
            src={events[0].image_url} 
            alt="Timeline"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.5] contrast-[1.1] saturate-[0.9]"
          />
        )}

        {/* Header Content */}
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 pb-8 relative z-20 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="uni-bg uni-border px-3 py-0.5 rounded font-mono text-[7.5px] uni-text tracking-[0.15em] uppercase">
              TIMELINE
            </span>
            <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded font-mono text-[7.5px] text-white/50 tracking-[0.1em]">
              {events?.length || 0} EVENTS
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-[0.22em] text-white mt-2 uppercase" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
            CHRONOLOGICAL EVENTS
          </h1>
        </div>
      </div>

      {/* Timeline Content */}
      <div className="flex-1 w-full max-w-[1720px] mx-auto px-6 md:px-12 py-10 relative z-20">
        <div className="flex flex-col gap-6 w-full pb-10">
          
          {/* Timeline Events */}
          <div className="relative">
            {/* Vertical Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-rgba(var(--uni-accent-rgb), 0.3) to-transparent" />
            
            {events && events.length > 0 ? (
              events.map((event, idx) => (
                <div key={event.id || idx} className="relative pl-20 pb-8 last:pb-0">
                  {/* Timeline Dot */}
                  <div className="absolute left-[21px] top-4 w-4 h-4 rounded-full uni-bg-solid uni-shadow z-10" />
                  
                  {/* Event Card */}
                  <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 shadow-2xl relative">
                    <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
                    
                    <div className="flex flex-col gap-4">
                      {/* Event Header */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-2">
                          <span className="font-mono text-[7.5px] uni-text uppercase tracking-widest block">
                            {event.date || event.year || "Unknown Date"}
                          </span>
                          <h3 className="text-2xl md:text-3xl font-normal text-white uppercase tracking-wide font-serif leading-none">
                            {event.title || "Event Title"}
                          </h3>
                        </div>
                        {event.image_url && (
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-white/5 shrink-0">
                            <img src={event.image_url} alt={event.title} className="w-full h-full object-cover filter brightness-[0.75]" />
                          </div>
                        )}
                      </div>

                      {/* Event Description */}
                      {event.description && (
                        <p className="font-serif text-[12px] text-white/70 leading-relaxed font-light">
                          {event.description}
                        </p>
                      )}

                      {/* Event Meta */}
                      <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                        <span className="font-mono text-[7px] text-white/30 uppercase tracking-widest">
                          EVENT #{idx + 1}
                        </span>
                        <span className="uni-text font-mono text-[7px] uppercase tracking-widest">
                          CHRONOLOGICAL ENTRY
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 flex flex-col items-center gap-4">
                <span className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase">
                  NO EVENTS RECORDED
                </span>
                <span className="font-mono text-[7px] text-white/20 tracking-[0.2em] uppercase">
                  Add timeline events to visualize the chronology
                </span>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
