"use client";
 
import React, { useState } from 'react';
import { useAudio } from './AudioManager';
import { motion, AnimatePresence } from 'framer-motion';
 
export default function GlobalAudioControl() {
  const { isMuted, toggleMute, volume, setVolume } = useAudio();
  const [isHovered, setIsHovered] = useState(false);
  
  const toggleMuteWithLog = (e: React.MouseEvent) => {
    // If it's a touch device, use the button to toggle the slider instead of muting
    if (typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0)) {
      e.preventDefault();
      setIsHovered(!isHovered);
      return;
    }
    toggleMute();
  };
 
  return (
    <div 
      className="relative flex items-center justify-center group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Invisible Hover Bridge */}
      {isHovered && <div className="absolute top-full right-0 w-32 h-6 z-40" />}
 
      {/* Volume Slider Dropdown */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-3 right-0 z-50 origin-top flex flex-col items-end pointer-events-auto"
          >
            <div className="relative group/slider overflow-hidden bg-black/85 backdrop-blur-3xl border border-white/10 px-5 py-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.8),inset_0_0_20px_rgba(245,158,11,0.05)] flex items-center gap-4 hover:border-amber-500/30 transition-colors duration-500">
              {/* Inner ambient glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500/5 to-transparent opacity-0 group-hover/slider:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>
 
              {/* Mute icon button */}
              <button onClick={() => setVolume(0)} className="text-white/40 hover:text-amber-400 transition-colors z-10 cursor-none" aria-label="Mute">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
              </button>
 
              <div className="relative flex items-center w-28 h-6 z-10">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="absolute inset-0 w-full h-1 my-auto bg-white/10 rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(245,158,11,0.8)] hover:[&::-webkit-slider-thumb]:scale-125 hover:[&::-webkit-slider-thumb]:bg-white transition-all"
                  style={{
                    background: `linear-gradient(to right, #eed078 ${volume * 100}%, rgba(255,255,255,0.1) ${volume * 100}%)`
                  }}
                />
              </div>
 
              {/* Max volume icon button */}
              <button onClick={() => setVolume(1)} className="text-amber-400/70 hover:text-amber-300 transition-colors z-10 drop-shadow-[0_0_6px_rgba(245,158,11,0.4)] cursor-none" aria-label="Max Volume">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
 
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleMuteWithLog}
        className="mute-button w-10 h-10 rounded-full flex items-center justify-center bg-black/60 backdrop-blur-2xl border border-white/20 hover:border-amber-400/50 text-white shadow-[0_4px_20px_rgba(0,0,0,0.5)] group transition-all pointer-events-auto relative overflow-visible cursor-none"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {/* Invisible Hit Area Expansion */}
        <div className="absolute inset-0 rounded-full" />
 
        <div className="relative w-5 h-5 pointer-events-none flex items-center justify-center">
          <AnimatePresence mode="wait">
            {isMuted ? (
              <motion.svg
                key="muted"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/40"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </motion.svg>
            ) : (
              <motion.svg
                key="unmuted"
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 45 }}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]"
              >
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
 
        {/* Pulsing rings when unmuted */}
        {!isMuted && (
          <div className="absolute inset-0 rounded-full border border-amber-400/20 animate-ping opacity-20 pointer-events-none" />
        )}
      </motion.button>
    </div>
  );
}
