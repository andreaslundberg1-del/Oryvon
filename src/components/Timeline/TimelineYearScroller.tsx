"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Timeline } from '@/types/timeline';
import { useI18n } from '@/components/I18nProvider';
import { useAudio } from '@/components/AudioManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useLenis } from 'lenis/react';

interface TimelineYearScrollerProps {
  timeline: Timeline;
  activeYear: number;
}

export default function TimelineYearScroller({ timeline, activeYear }: TimelineYearScrollerProps) {
  const { t, tLoc } = useI18n();
  const { playHover, playClick } = useAudio();
  const lenis = useLenis();
  
  const startYear = 1950;
  const endYear = 2026;
  const allYears = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i);
  
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);
  const [isHoveringSidebar, setIsHoveringSidebar] = useState(false);

  // Stop Lenis when hovering the sidebar
  useEffect(() => {
    if (isHoveringSidebar) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
    return () => {
      lenis?.start();
    };
  }, [isHoveringSidebar, lenis]);

  // Center active year on mount or when activeYear changes, but only if not interacting
  useEffect(() => {
    if (isHoveringSidebar) return;
    const activeEl = document.getElementById(`scroller-year-${activeYear}`);
    if (activeEl && scrollContainerRef.current) {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeYear, isHoveringSidebar]);

  const teleportToYear = (year: number) => {
    playClick();
    window.dispatchEvent(new CustomEvent('timeline-teleport', { detail: { year } }));
  };

  const handleWheel = (e: React.WheelEvent) => {
    // Explicitly stop propagation to prevent main page scrolling
    e.stopPropagation();
  };

  const activeYearData = timeline.years.find(y => y.year === activeYear);
  const themeColor = activeYearData?.theme?.colors?.primary || '#22d3ee';

  return (
    <aside 
      className="timelinePanel"
      onMouseEnter={() => setIsHoveringSidebar(true)}
      onMouseLeave={() => setIsHoveringSidebar(false)}
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '170px',
        overflow: 'hidden',
        flexShrink: 0,
        backgroundColor: '#050a0e',
        borderRight: `1px solid ${themeColor}22`,
        boxShadow: `10px 0 50px rgba(0,0,0,0.8)`,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Integrated Home Button - Now at the Top */}
      <div className="px-4 py-6 border-b border-white/5 bg-white/5">
        <Link 
          href="/" 
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl hover:bg-white/10 hover:border-cyan-500/50 transition-all group"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-cyan-400 transition-colors">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          <span className="text-[9px] font-black tracking-[0.2em] uppercase group-hover:text-cyan-400 transition-colors">Home</span>
        </Link>
      </div>


      {/* Scrollable Area */}
      <div 
        ref={scrollContainerRef}
        className="timelineScrollArea relative flex-1"
        onWheel={handleWheel}
        data-lenis-prevent
        style={{
          height: 'calc(100vh - 120px)',
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          pointerEvents: 'auto'
        }}
      >
        {/* Progress Line */}
        <div className="absolute left-[24px] top-0 bottom-0 w-px bg-white/5">
          <motion.div 
            className="absolute top-0 left-0 w-px shadow-[0_0_15px_#fff]"
            style={{ backgroundColor: themeColor }}
            animate={{ height: `${((activeYear - 1950) / (2026 - 1950)) * 100}%` }}
            transition={{ type: "spring", stiffness: 40, damping: 20 }}
          />
        </div>

        <div className="relative py-12">
          {allYears.map((year) => {
            const isActive = year === activeYear;
            const yearData = timeline.years.find(y => y.year === year);
            const isMilestone = !!yearData;
            const isDecade = year % 10 === 0;
            
            return (
              <React.Fragment key={year}>
                {isDecade && (
                  <div className="pl-10 py-4 opacity-20">
                    <span className="text-[8px] font-black text-white uppercase tracking-[0.4em]">{year}s</span>
                  </div>
                )}
                
                <div 
                  id={`scroller-year-${year}`}
                  className={`relative h-11 flex items-center group/year cursor-pointer pl-5 transition-all duration-300
                    ${isActive ? 'mx-2 my-1 pr-3 z-20' : 'hover:bg-white/5'}`}
                  onClick={() => teleportToYear(year)}
                  onMouseEnter={() => setHoveredYear(year)}
                  onMouseLeave={() => setHoveredYear(null)}
                  style={isActive ? {
                    backgroundImage: `linear-gradient(90deg, ${themeColor}15, transparent)`,
                    backgroundColor: 'rgba(255,255,255,0.02)',
                    borderLeft: `2px solid ${themeColor}`,
                    borderRadius: '4px',
                  } : {}}
                >
                  {/* Energy Node */}
                  <div className="w-[10px] flex items-center justify-center z-10">
                    <motion.div 
                      className={`rounded-full transition-all duration-500
                        ${isActive ? 'w-2.5 h-2.5 bg-white shadow-[0_0_20px_white]' : isMilestone ? 'w-1.5 h-1.5 bg-white/30' : 'w-0.5 h-0.5 bg-white/10 group-hover/year:bg-white/40'}`} 
                      style={isActive ? { backgroundColor: themeColor } : {}}
                    />
                  </div>

                  {/* Year Label */}
                  <div className={`ml-6 transition-all duration-300 font-mono tracking-tighter
                    ${isActive ? 'text-white text-xl font-black' : isMilestone ? 'text-white/50 text-[10px] font-bold' : 'text-white/10 text-[9px]'}`}
                  >
                    {year}
                  </div>

                  {/* Milestone status */}
                  {isMilestone && !isActive && (
                    <div className="absolute right-4 w-1 h-1 rounded-full opacity-30" style={{ backgroundColor: themeColor }} />
                  )}

                  {/* Hover Preview Card */}
                  <AnimatePresence>
                    {hoveredYear === year && !isActive && (
                      <motion.div
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        className="absolute left-full ml-6 p-5 rounded-2xl bg-[#0a0f14]/98 border border-white/10 shadow-3xl z-[2000] pointer-events-none min-w-[220px] backdrop-blur-3xl"
                      >
                         <div className="flex justify-between items-center mb-3">
                           <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">Coordinates: {year}</span>
                           {isMilestone && <span className="text-[7px] px-2 py-0.5 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-full">DATA_LINK</span>}
                         </div>
                         <div className="h-px bg-white/5 mb-4" />
                         <div className="flex flex-col gap-2">
                           <h4 className="text-[11px] font-black text-white uppercase line-clamp-1">
                             {yearData?.intro?.title ? tLoc(yearData.intro.title) : "Temporal Void"}
                           </h4>
                           <p className="text-[9px] text-white/40 leading-relaxed italic">
                              {yearData?.intro?.description ? tLoc(yearData.intro.description) : "Sensors detecting no major historical anomalies at this point."}
                           </p>
                         </div>
                         {/* Visual Placeholder */}
                         <div className="mt-4 h-16 rounded-lg bg-white/5 border border-white/5 overflow-hidden relative">
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${themeColor} 2px, ${themeColor} 3px)` }} />
                            <div className="w-full h-full flex items-center justify-center opacity-20">
                               <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12H3m12-6l6 6-6 6"/></svg>
                            </div>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Footer Stats */}
      <div className="p-6 border-t border-white/5 bg-black/60">
         <div className="flex justify-between items-center text-[8px] font-black text-white/10 uppercase tracking-[0.4em] mb-3">
            <span>Link.Sync</span>
            <span className="animate-pulse" style={{ color: themeColor }}>Linked</span>
         </div>
         <div className="flex gap-1 h-0.5">
            {[1,2,3,4,5,6].map(i => (
              <div 
                key={i} 
                className="flex-1 rounded-full bg-white/5" 
                style={i <= 4 ? { backgroundColor: themeColor, opacity: 0.15 } : {}}
              />
            ))}
         </div>
      </div>

      <style jsx global>{`
        .timelineScrollArea::-webkit-scrollbar {
          width: 4px;
        }
        .timelineScrollArea::-webkit-scrollbar-track {
          background: transparent;
        }
        .timelineScrollArea::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 10px;
        }
        .timelineScrollArea::-webkit-scrollbar-thumb:hover {
          background: ${themeColor}22;
        }
      `}</style>
    </aside>
  );
}
