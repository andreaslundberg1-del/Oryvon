"use client";
 
import React, { useState, useRef, useEffect } from 'react';
import { useI18n } from './I18nProvider';
import { languages } from '@/i18n/translations';
import { motion, AnimatePresence } from 'framer-motion';
 
export default function LanguageSelector() {
  const { locale, setLocale } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
 
  const currentLang = languages[locale];
 
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
 
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
 
  return (
    <div className="language-selector relative pointer-events-auto" ref={dropdownRef}>
      {/* Main Flag Pill Button */}
      <button
        onClick={toggleOpen}
        className="h-10 px-3.5 flex items-center gap-2.5 bg-black/60 hover:bg-white/5 border border-white/20 hover:border-amber-400/50 rounded-full backdrop-blur-2xl transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] text-white/80 hover:text-white cursor-none group"
        aria-label="Select Language"
      >
        {currentLang?.flag && (
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={currentLang.flag} 
            alt={currentLang.name} 
            className="w-4.5 h-3 object-cover rounded-sm drop-shadow-md brightness-90 group-hover:brightness-100 transition-all" 
          />
        )}
        <span className="font-mono text-[10px] font-semibold tracking-wider text-white/70 group-hover:text-white transition-colors uppercase">
          {locale}
        </span>
        <svg 
          width="8" 
          height="5" 
          viewBox="0 0 8 5" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          className="text-white/40 group-hover:text-amber-400 group-hover:translate-y-[0.5px] transition-all duration-300"
        >
          <path d="m1 1 3 3 3-3" />
        </svg>
      </button>
 
      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-3 p-3.5 bg-[#070609]/95 backdrop-blur-3xl border border-white/[0.08] rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] w-[85vw] md:w-80 max-h-[70vh] overflow-y-auto z-[200] scrollbar-thin scrollbar-thumb-white/20"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
              {Object.values(languages).map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLocale(lang.code);
                    setIsOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-lg transition-all duration-300 group cursor-none ${
                    locale === lang.code
                      ? 'bg-amber-500/10 border border-amber-500/35 shadow-[0_0_15px_rgba(245,158,11,0.1)] scale-105'
                      : 'bg-white/[0.02] border border-white/5 hover:bg-white/5 hover:border-amber-400/25 hover:scale-105'
                  }`}
                  title={lang.name}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={lang.flag} alt={lang.name} className="w-8 h-auto drop-shadow-md mb-1.5 group-hover:scale-110 transition-transform" />
                  <span className={`text-[9px] uppercase font-bold tracking-widest ${locale === lang.code ? 'text-amber-400' : 'text-white/40 group-hover:text-white/80'}`}>
                    {lang.code}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
