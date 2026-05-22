"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import OryndorLogo from "./OryndorLogo";
import LanguageSelector from "./LanguageSelector";
import GlobalAudioControl from "./GlobalAudioControl";
import { useAudio } from "./AudioManager";
import { useI18n } from "./I18nProvider";

export default function TopNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { playClick, playHover, volume, setVolume } = useAudio();
  const { t } = useI18n();
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [customCursorEnabled, setCustomCursorEnabled] = useState(true);
  
  const drawerRef = useRef<HTMLDivElement>(null);
  const [activeGenre, setActiveGenre] = useState<string | null>(null);
  const isAdminRoute = pathname.startsWith("/admin");

  // Synchronize the landing page's selected portal category for Home Button rendering
  useEffect(() => {
    const handleGenreUpdated = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveGenre(customEvent.detail.genre);
      }
    };
    window.addEventListener("oryvon-genre-updated", handleGenreUpdated);
    return () => window.removeEventListener("oryvon-genre-updated", handleGenreUpdated);
  }, []);

  // Monitor scroll for glassmorphism background transitions — throttled via RAF
  useEffect(() => {
    let rafId = 0;
    const handleScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        setIsScrolled(window.scrollY > 30);
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // Sync settings with localStorage and apply classes to document.body
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedCrt = localStorage.getItem("oryvon-crt-enabled");
      const savedCursor = localStorage.getItem("oryvon-custom-cursor-enabled");

      if (savedCrt !== null) {
        const enabled = savedCrt === "true";
        setCrtEnabled(enabled);
        if (!enabled) document.body.classList.add("no-crt");
      } else {
        // Default to enabled
        localStorage.setItem("oryvon-crt-enabled", "true");
      }

      if (savedCursor !== null) {
        const enabled = savedCursor === "true";
        setCustomCursorEnabled(enabled);
        if (!enabled) document.body.classList.add("no-custom-cursor");
      } else {
        // Default to enabled
        localStorage.setItem("oryvon-custom-cursor-enabled", "true");
      }
    }
  }, []);

  const toggleCrt = () => {
    playClick();
    setCrtEnabled(prev => {
      const next = !prev;
      localStorage.setItem("oryvon-crt-enabled", String(next));
      if (next) {
        document.body.classList.remove("no-crt");
      } else {
        document.body.classList.add("no-crt");
      }
      return next;
    });
  };

  const toggleCustomCursor = () => {
    playClick();
    setCustomCursorEnabled(prev => {
      const next = !prev;
      localStorage.setItem("oryvon-custom-cursor-enabled", String(next));
      if (next) {
        document.body.classList.remove("no-custom-cursor");
      } else {
        document.body.classList.add("no-custom-cursor");
      }
      return next;
    });
  };

  const handleHomeClick = () => {
    playClick();
    if (pathname === "/") {
      // Trigger a window event so that the landing page can scroll to top and reset genres
      window.dispatchEvent(new CustomEvent("oryvon-reset-genre"));
    } else {
      router.push("/");
    }
  };

  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDrawerOpen &&
        drawerRef.current &&
        !drawerRef.current.contains(event.target as Node)
      ) {
        setIsDrawerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDrawerOpen]);

  // Hide TopNavbar when we are in a Universe Experience if we want,
  // but wait! The user says "The top navigation should stay visible while scrolling" for Layer 1.
  // In Layer 2, do we show it? Yes! A elegant minimal topbar looks spectacular everywhere, especially if Layer 2 has its own sidebar.
  // Let's make it look clean on both layers! On Universe page, it sits perfectly at the top.

  if (isAdminRoute) return null;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-4 flex items-center justify-between transition-all duration-500 border-b border-transparent ${
          isScrolled
            ? "bg-black/60 backdrop-blur-md border-white/[0.06] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-gradient-to-b from-black/50 to-transparent"
        }`}
      >
        {/* Left Side: Logo & Home Button */}
        <div className="flex items-center gap-6">
          <div
            onClick={handleHomeClick}
            onMouseEnter={playHover}
            className="cursor-none flex items-center gap-2 group pointer-events-auto"
          >
            <OryndorLogo size={32} variant="horizontal" />
          </div>

          {(pathname !== "/" || activeGenre !== null) && (
            <button
              onClick={handleHomeClick}
              onMouseEnter={playHover}
              className="hidden sm:flex px-4 py-1.5 rounded-full border border-white/10 hover:border-amber-500/40 bg-white/5 hover:bg-amber-500/10 text-white/60 hover:text-amber-200 transition-all duration-300 font-mono text-[8px] tracking-[0.25em] uppercase cursor-none pointer-events-auto items-center gap-1.5"
            >
              <span className="w-1 h-1 rounded-full bg-amber-400 group-hover:animate-ping" />
              {t('nav.homePortalBtn')}
            </button>
          )}
        </div>

        {/* Right Side: Language switcher, Audio toggle, Menu/Settings icon */}
        <div className="flex items-center gap-3.5 pointer-events-auto">
          <LanguageSelector />
          
          <GlobalAudioControl />
 
          {/* settings/menu icon */}
          <button
            onClick={() => {
              playClick();
              setIsDrawerOpen(true);
            }}
            onMouseEnter={playHover}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-2xl border border-white/20 hover:border-amber-400/50 hover:shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-all duration-300 group cursor-none relative"
            aria-label="System Settings"
          >
            <svg
              className="w-5 h-5 text-white/50 group-hover:text-amber-300 transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.43l-1.003.828c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.43l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
            </svg>
            <span className="absolute inset-0 rounded-full border border-amber-400/20 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300" />
          </button>
        </div>
      </header>

      {/* AAA Calibration Panel Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Dark Overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.65 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#020102] z-[190] pointer-events-auto"
              onClick={() => setIsDrawerOpen(false)}
            />

            {/* Slider Drawer Panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: "100%", opacity: 0.95 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full sm:w-[480px] bg-[#050406]/98 border-l border-white/[0.08] backdrop-blur-3xl z-[200] p-8 flex flex-col justify-between shadow-[-10px_0_50px_rgba(0,0,0,0.9)] overflow-y-auto"
            >
              {/* Top Section */}
              <div className="flex flex-col gap-8">
                {/* Header */}
                <div className="flex justify-between items-start border-b border-white/5 pb-5">
                  <div className="flex flex-col gap-1.5">
                    <span className="font-mono text-[7px] text-amber-400/60 tracking-[0.40em] uppercase">
                      SYSTEM UTILITY PORT PORT-09
                    </span>
                    <h2
                      className="text-lg font-normal tracking-[0.2em] text-white uppercase font-serif"
                      style={{ fontFamily: "'Cinzel', serif" }}
                    >
                      {t('settings.title')}
                    </h2>
                  </div>
                  
                  <button
                    onClick={() => {
                      playClick();
                      setIsDrawerOpen(false);
                    }}
                    onMouseEnter={playHover}
                    className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/35 transition-all duration-300 group cursor-none"
                  >
                    <svg
                      className="w-4 h-4 text-white/40 group-hover:text-red-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18 18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                {/* Calibration Section 1: Dynamic Audios */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3 bg-amber-400 rounded-full" />
                    <span className="font-mono text-[9px] tracking-[0.25em] text-white/80 uppercase">
                      {t('settings.audioSection')}
                    </span>
                  </div>

                  <div className="flex flex-col gap-5 bg-white/[0.02] border border-white/5 rounded-xl p-5">
                    {/* Volume Slider */}
                    <div className="flex flex-col gap-2">
                      <div className="flex justify-between items-center text-[8px] font-mono tracking-widest text-white/50">
                        <span>{t('settings.masterVolume')}</span>
                        <span className="text-cyan-400 font-semibold">{Math.round(volume * 100)}%</span>
                      </div>
                      <div className="relative flex items-center w-full h-8">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={volume}
                          onChange={(e) => setVolume(parseFloat(e.target.value))}
                          className="absolute inset-0 w-full h-1 my-auto bg-white/10 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(34,211,238,1)] hover:[&::-webkit-slider-thumb]:scale-125 transition-all"
                          style={{
                            background: `linear-gradient(to right, #22d3ee ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[7.5px] font-mono text-white/30 tracking-widest border-t border-white/5 pt-3">
                      <span>{t('settings.audioStatus')}</span>
                      <span className="text-emerald-400">{t('settings.audioOnline')}</span>
                    </div>
                  </div>
                </div>

                {/* Calibration Section 2: Visual Adjustments */}
                <div className="flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <span className="w-1 h-3 bg-amber-400 rounded-full" />
                    <span className="font-mono text-[9px] tracking-[0.25em] text-white/80 uppercase">
                      {t('settings.visualSection')}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 bg-white/[0.02] border border-white/5 rounded-xl p-5">
                    {/* Toggle CRT overlays */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] text-white/80 tracking-widest leading-none">
                          {t('settings.crtLabel')}
                        </span>
                        <span className="font-mono text-[6.5px] text-white/35 tracking-wider mt-1.5 leading-none">
                          {t('settings.crtDesc')}
                        </span>
                      </div>
                      <button
                        onClick={toggleCrt}
                        onMouseEnter={playHover}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-none ${
                          crtEnabled ? "bg-amber-400" : "bg-white/10"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-[#050406] shadow-md transform transition-transform duration-300 ${
                            crtEnabled ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="h-[1px] bg-white/5 my-1" />

                    {/* Toggle custom cursor */}
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="font-mono text-[9px] text-white/80 tracking-widest leading-none">
                          {t('settings.cursorLabel')}
                        </span>
                        <span className="font-mono text-[6.5px] text-white/35 tracking-wider mt-1.5 leading-none">
                          {t('settings.cursorDesc')}
                        </span>
                      </div>
                      <button
                        onClick={toggleCustomCursor}
                        onMouseEnter={playHover}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 focus:outline-none cursor-none ${
                          customCursorEnabled ? "bg-amber-400" : "bg-white/10"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-[#050406] shadow-md transform transition-transform duration-300 ${
                            customCursorEnabled ? "translate-x-6" : "translate-x-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section */}
              <div className="flex flex-col gap-5 border-t border-white/5 pt-6 mt-8">
                <div className="flex justify-between items-center text-[7px] font-mono text-white/30 tracking-widest leading-none">
                  <span>{t('settings.version')}</span>
                  <span>{t('settings.calibration')}</span>
                </div>
                
                <button
                  onClick={() => {
                    playClick();
                    setIsDrawerOpen(false);
                  }}
                  onMouseEnter={playHover}
                  className="w-full py-3.5 rounded font-mono text-[9px] tracking-[0.25em] bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/35 text-white/80 hover:text-amber-200 transition-all duration-300 uppercase cursor-none"
                >
                  {t('settings.save')}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
