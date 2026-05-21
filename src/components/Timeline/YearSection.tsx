"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { YearData } from '@/types/timeline';
import { useI18n } from '@/components/I18nProvider';
import Interactive3DModel from './Interactive3DModel';
import CinematicFilter from './CinematicFilter';
import ForegroundParticles from './ForegroundParticles';
import InteractiveLab from './InteractiveLab';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvolution } from './EvolutionEngine';

interface YearSectionProps {
  data: YearData;
  onActive: () => void;
}

export default function YearSection({ data }: YearSectionProps) {
  const { tLoc } = useI18n();
  const { setEvolution } = useEvolution();

  useEffect(() => {
    // Update theme and evolution state immediately when this year becomes active
    setEvolution(data.theme);
    
    gsap.to("body", {
      "--era-bg": data.theme.colors.background,
      "--era-text": data.theme.colors.text,
      "--era-primary": data.theme.colors.primary,
      "--era-secondary": data.theme.colors.secondary,
      duration: 1,
      ease: "power2.inOut"
    });
  }, [data, setEvolution]);

  const getYearWatermarkStyle = () => {
    const style = data.theme.uiStyle;
    switch (style) {
      case 'arcade': return "font-arcade text-yellow-500/10 blur-[2px] skew-x-[-10deg]";
      case 'terminal': return "font-mono text-green-500/10 tracking-[-0.1em]";
      case 'cyber': return "font-future text-fuchsia-500/10 drop-shadow-[0_0_30px_rgba(232,121,249,0.5)]";
      case 'tech': return "font-serif italic text-white/10 opacity-20";
      default: return "font-black text-white/5 opacity-10";
    }
  };

  const getHeroClass = () => {
    const style = data.theme.uiStyle;
    if (style === 'arcade') return "crt-screen shadow-[0_0_50px_rgba(255,255,0,0.2)]";
    if (style === 'cyber') return "hologram-effect shadow-[0_0_100px_rgba(34,211,238,0.3)]";
    return "";
  };

  return (
    <motion.section 
      initial={{ opacity: 0, scale: 0.95, filter: 'blur(10px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(20px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      id={`year-section-${data.year}`} 
      className="absolute inset-0 w-full h-screen overflow-hidden"
    >
      <CinematicFilter style={data.theme.uiStyle} year={data.year}>
        {/* Foreground Layer */}
        <ForegroundParticles type={data.theme.uiStyle} />

        {/* Background Year Watermark */}
        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none year-watermark z-0 ${getYearWatermarkStyle()}`}>
          <h2 className="text-[40vw] leading-none transition-all duration-1000">{data.year}</h2>
        </div>

      <div className="absolute inset-0 w-full h-full flex items-center justify-center z-10 pointer-events-none">
        
        {/* Main Evolution Panel */}
        <div className="relative w-full h-full flex items-center justify-start p-12 md:p-24 overflow-hidden">
          {/* Deep Cinematic Background */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
            <motion.img 
              src={data.tech.image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070'} 
              alt="Era BG" 
              className={`w-full h-full object-cover opacity-60 ${getHeroClass()}`}
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 0.5, 0]
              }}
              transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            />
          </div>

          <div className="relative z-20 max-w-5xl pointer-events-auto">
            <div className="flex flex-col gap-6">
              {/* Year Heading */}
              <div className="flex items-baseline gap-6">
                <h2 className="text-[12rem] md:text-[18rem] font-black tracking-tighter leading-none opacity-90" 
                    style={{ 
                      color: 'var(--era-primary)',
                      textShadow: `0 0 50px ${data.theme.colors.primary}44`
                    }}>
                  {data.year}
                </h2>
                <div className="h-[2px] w-48 bg-gradient-to-r from-white to-transparent mb-12 opacity-30" />
              </div>

              {/* Description & Story */}
              <div className="space-y-4 max-w-2xl">
                <h3 className="text-3xl md:text-5xl font-bold tracking-[0.1em] uppercase" style={{ color: 'var(--era-secondary)' }}>
                  {tLoc(data.intro.title)}
                </h3>
                <p className="text-xl md:text-2xl text-white/70 leading-relaxed font-light">
                  {tLoc(data.intro.description)}
                </p>
              </div>

              {/* Evolution Stats Bar */}
              <div className="mt-12 flex flex-wrap gap-12">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">Rendering Engine</span>
                  <span className="text-sm font-mono text-white/80">{data.theme.uiStyle.toUpperCase()}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">Pixel Density</span>
                  <span className="text-sm font-mono text-white/80">{data.theme.pixelation ? `${100 - Math.round(data.theme.pixelation * 10)}%` : '100%'}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">Light Model</span>
                  <span className="text-sm font-mono text-white/80">{data.theme.bloomIntensity ? 'DYNAMIC BLOOM' : 'STATIC'}</span>
                </div>
              </div>
            </div>
          </div>


        </div>

        {/* Floating Secondary Content (Images) */}
        {data.games.images.length > 0 && (
          <div className="absolute bottom-24 right-24 flex gap-4 pointer-events-auto">
             {data.games.images.map((img, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ scale: 1.1, rotate: -2 }}
                  className="w-48 aspect-video rounded-lg overflow-hidden border border-white/20 shadow-2xl"
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </motion.div>
             ))}
          </div>
        )}

      </div>
      </CinematicFilter>
    </motion.section>
  );
}
