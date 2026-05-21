"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Timeline } from '@/types/timeline';
import TimelineYearScroller from './TimelineYearScroller';
import BackgroundManager from './BackgroundManager';
import YearSection from './YearSection';
import TransitionOverlay from './TransitionOverlay';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useI18n } from '@/components/I18nProvider';
import { useAudio } from '@/components/AudioManager';
import { AnimatePresence } from 'framer-motion';

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface YearScrollerEngineProps {
  timeline: Timeline;
}

export default function YearScrollerEngine({ timeline }: YearScrollerEngineProps) {
  const [activeYear, setActiveYear] = useState<number>(timeline.years[0]?.year || 1950);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const { playEraTransition, setAmbience, setAmbientTone, setBackgroundMusic, playScrollTick } = useAudio();
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);

  // Set background music based on timeline
  useEffect(() => {
    if (timeline.id === 'got-lore') {
      // Custom GoT track provided by user
      setBackgroundMusic('/sound/Brother.mp3'); 
    } else {
      // Default ambient music
      setBackgroundMusic('/sound/Background.mp3');
    }
  }, [timeline.id, setBackgroundMusic]);
  const autoPlayRef = useRef<number | null>(null);

  // Calculate timeline range for ambient tone intensity
  const startYear = timeline.years[0]?.year || 1900;
  const endYear = timeline.years[timeline.years.length - 1]?.year || 2026;

  const handleSetActiveYear = (year: number) => {
    if (year !== activeYear) {
      setActiveYear(year);
      const eraData = timeline.years.find(y => y.year === year);
      if (eraData) {
        playEraTransition(eraData.theme.uiStyle);
        if ((eraData.theme as any).ambience) {
          setAmbience((eraData.theme as any).ambience);
        }
      }
    }
  };

  // Update ambient tone whenever active year changes
  useEffect(() => {
    let intensity = 0;
    if (endYear > startYear) {
      intensity = Math.max(0, Math.min(1, (activeYear - startYear) / (endYear - startYear)));
    }
    setAmbientTone(intensity);
  }, [activeYear, startYear, endYear, setAmbientTone]);

  // Auto-Play Logic
  useEffect(() => {
    if (!isAutoPlaying) {
      if (autoPlayRef.current !== null) {
        cancelAnimationFrame(autoPlayRef.current);
      }
      return;
    }

    const scrollLoop = () => {
      window.scrollBy({ top: 1.5, behavior: 'instant' });
      // Stop at the bottom
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        setIsAutoPlaying(false);
      } else {
        autoPlayRef.current = requestAnimationFrame(scrollLoop);
      }
    };

    autoPlayRef.current = requestAnimationFrame(scrollLoop);

    // Pause auto-play if user manually scrolls with mouse wheel
    const handleWheel = () => setIsAutoPlaying(false);
    window.addEventListener('wheel', handleWheel, { passive: true });

    return () => {
      if (autoPlayRef.current !== null) cancelAnimationFrame(autoPlayRef.current);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [isAutoPlaying]);

  const activeYearRef = useRef(activeYear);
  useEffect(() => {
    activeYearRef.current = activeYear;
  }, [activeYear]);

  useEffect(() => {
    const totalYears = timeline.years.length;
    if (totalYears === 0) return;
    
    // Master ScrollTrigger to track progress through all years
    const masterST = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: `+=${(totalYears - 1) * 1000}`, 
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        const yearIndex = Math.round(self.progress * (totalYears - 1));
        const newYear = timeline.years[yearIndex]?.year;
        
        if (newYear && newYear !== activeYearRef.current) {
          handleSetActiveYear(newYear);
          
          // Procedural Scroll Tick Sound via shared AudioManager
          playScrollTick(newYear);
        }
      },
      pin: true,
      scrub: 0.5,
      invalidateOnRefresh: true
    });

    const handleNavigate = (e: any) => {
      const year = e.detail?.year;
      const isTeleport = e.type === 'timeline-teleport';
      
      // Find the closest year in our data if the exact year doesn't exist
      let targetYearData = timeline.years.find(y => y.year === year);
      let yearIndex = timeline.years.findIndex(y => y.year === year);

      if (yearIndex === -1) {
        // Find the index of the closest year with actual data
        const closest = timeline.years.reduce((prev, curr) => {
          return (Math.abs(curr.year - year) < Math.abs(prev.year - year) ? curr : prev);
        });
        yearIndex = timeline.years.indexOf(closest);
      }
      
      if (yearIndex !== -1) {
        const targetScroll = (yearIndex / (totalYears - 1)) * (totalYears * 1000);
        
        if (isTeleport) {
          window.scrollTo({ top: targetScroll, behavior: 'instant' });
          handleSetActiveYear(timeline.years[yearIndex].year);
        } else {
          window.scrollTo({ top: targetScroll, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('timeline-navigate', handleNavigate);
    window.addEventListener('timeline-teleport', handleNavigate);

    return () => {
      window.removeEventListener('timeline-navigate', handleNavigate);
      window.removeEventListener('timeline-teleport', handleNavigate);
      masterST.kill();
    };
  }, [timeline.years]);

  const activeYearData = timeline.years.find(y => y.year === activeYear) || timeline.years[0];
  const [containerHeight, setContainerHeight] = useState<string | number>('20000px'); // Realistic default

  useEffect(() => {
    const height = timeline.years.length * 1000 + window.innerHeight;
    setContainerHeight(`${height}px`);
    
    // Refresh ScrollTrigger after height update
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [timeline.years.length]);

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white" style={{ height: containerHeight }}>
      {/* Background Manager - Always full screen as the canvas for everything */}
      <BackgroundManager activeYearData={activeYearData} />

      {/* Overlays - Shifted to match main content area */}
      <div className="fixed inset-0 left-[160px] w-[calc(100%-160px)] z-[50] pointer-events-none">
        <TransitionOverlay activeYear={activeYear} />
      </div>

      {/* 1. LEFT COLUMN: Dedicated Compact Chronos Panel */}
      <div className="fixed left-0 top-0 bottom-0 w-[160px] z-[100] border-r border-white/5">
        <TimelineYearScroller timeline={timeline} activeYear={activeYear} />
      </div>

      {/* 2. RIGHT COLUMN: Expanded Cinematic Content Viewport */}
      <div className="fixed inset-0 left-[160px] w-[calc(100%-160px)] h-full overflow-hidden pointer-events-none z-10">
        <AnimatePresence mode="wait">
          <YearSection 
            key={activeYear} 
            data={activeYearData} 
            onActive={() => {}} 
          />
        </AnimatePresence>
      </div>

      {/* Decorative HUD Elements - Shifted to center of main content */}
      <div className="fixed bottom-10 left-[calc(160px+(100%-160px)/2)] -translate-x-1/2 z-50 mix-blend-difference pointer-events-none opacity-20">
        <div className="w-[1px] h-24 bg-white/50 mx-auto"></div>
      </div>
    </div>
  );
}
