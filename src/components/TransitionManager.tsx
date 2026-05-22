"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '@/components/AudioManager';

const TransitionContext = createContext<{
  startTransition: (href: string, type: string) => void;
}>({ startTransition: () => {} });

export const useTransitionPortal = () => useContext(TransitionContext);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isMuted } = useAudio();
  const [isActive, setIsActive] = useState(false);
  const [type, setType] = useState('graphics-history');
  
  const startTransition = (href: string, transitionType: string) => {
    setType(transitionType);
    setIsActive(true);
    
    // Play a synthetic whoosh/warp sound using AudioContext manually for immediate response
    if (!isMuted) {
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        if (transitionType === 'graphics-history') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(50, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(800, audioCtx.currentTime + 2);
        } else if (transitionType === 'film-history') {
          osc.type = 'square';
          osc.frequency.setValueAtTime(24, audioCtx.currentTime); // projector flap
        } else if (transitionType === 'football-history') {
          // Crowd noise simulation
          const bufferSize = audioCtx.sampleRate * 2.5;
          const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noise = audioCtx.createBufferSource();
          noise.buffer = buffer;
          const filter = audioCtx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(100, audioCtx.currentTime);
          filter.frequency.exponentialRampToValueAtTime(1000, audioCtx.currentTime + 2);
          noise.connect(filter);
          filter.connect(gain);
          noise.start();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2500, audioCtx.currentTime);
        } else {
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, audioCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 2);
        }
        
        gain.gain.setValueAtTime(0, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 2.5);

        // Auto-close context after playing to prevent resource leakage
        setTimeout(() => {
          audioCtx.close().catch(() => {});
        }, 3000);
      } catch (e) {
        console.log('Audio playback prevented by browser');
      }
    }

    // Wait for the animation to peak, then change route
    setTimeout(() => {
      router.push(href);
      
      // Keep the overlay up while Next.js handles the client-side load, then fade out
      setTimeout(() => {
        setIsActive(false);
      }, 400);
    }, 900);
  };

  return (
    <TransitionContext.Provider value={{ startTransition }}>
      {children}
      <AnimatePresence>
        {isActive && <TransitionOverlay type={type} />}
      </AnimatePresence>
    </TransitionContext.Provider>
  );
}

function TransitionOverlay({ type }: { type: string }) {
  // Pre-generate random values to avoid Math.random() during render
  const blackHoleParticles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    w: Math.random() * 3 + 1,
    h: Math.random() * 3 + 1,
    left: Math.random() * 100,
    top: Math.random() * 100,
    dur: Math.random() * 1.5 + 0.5,
  })), []);

  const gamingLines = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    height: Math.random() * 50 + 10,
    rotate: Math.random() * 360,
    translateY: Math.random() * 100,
  })), []);

  const stadiumFlashes = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 1.5,
  })), []);

  // === 1. Graphics History (Black Hole Portal) ===
  if (type === 'graphics-history') {
    return (
      <motion.div 
        className="fixed inset-0 z-[5000] flex items-center justify-center overflow-hidden pointer-events-none"
        initial={{ backgroundColor: 'rgba(2,1,1,0)' }} 
        animate={{ backgroundColor: 'rgba(2,1,1,0.96)' }} 
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
        transition={{ duration: 0.85, ease: 'easeInOut' }}
      >
        {/* Stars/Particles — capped at 20 to prevent iOS memory crash */}
        <motion.div className="absolute inset-0" initial={{ scale: 1.5 }} animate={{ scale: 0 }} transition={{ duration: 2.2, ease: "easeIn" }}>
          {blackHoleParticles.map((p) => (
            <motion.div 
              key={p.id} 
              className="absolute bg-white rounded-full"
              style={{
                width: p.w + 'px',
                height: p.h + 'px',
                left: `${p.left}%`,
                top: `${p.top}%`,
              }}
              animate={{
                left: '50%',
                top: '50%',
                opacity: [1, 1, 0]
              }}
              transition={{ duration: p.dur, ease: "easeIn" }}
            />
          ))}
        </motion.div>

        {/* Accretion Disk — mix-blend-screen removed (crashes iOS GPU compositor) */}
        <motion.div
          className="absolute rounded-full"
          style={{
            background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,150,50,0.6) 20%, transparent 40%, rgba(100,200,255,0.6) 60%, transparent 80%)',
            filter: 'blur(20px)',
          }}
          initial={{ width: '10vw', height: '10vw', opacity: 0, rotate: 0 }}
          animate={{ width: '300vw', height: '300vw', opacity: 0.85, rotate: 720 }}
          transition={{ duration: 2.5, ease: "easeIn" }}
        />
        
        {/* The Event Horizon (Expanding pure black void) */}
        <motion.div
          className="absolute rounded-full bg-black shadow-[0_0_150px_rgba(0,0,0,1)]"
          initial={{ width: '0vw', height: '0vw' }}
          animate={{ width: '250vw', height: '250vw' }}
          transition={{ duration: 2.5, ease: "easeIn", delay: 0.1 }}
        />
      </motion.div>
    );
  }

  // === 2. Film History (Projector, Countdown & Fade) ===
  if (type === 'film-history') {
    return (
      <motion.div 
        className="fixed inset-0 z-[5000] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 1 } }}
      >
        {/* Film grain effect */}
        <motion.div 
          className="absolute inset-0 opacity-30 pointer-events-none mix-blend-screen bg-[url('https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2000')] bg-cover grayscale"
          initial={{ filter: 'blur(0px) contrast(1)' }} animate={{ filter: 'blur(5px) contrast(3)' }} transition={{ duration: 2.5 }}
        />
        
        <motion.div
          className="absolute inset-0 bg-amber-100/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.08, 0, 0.12, 0, 0.18, 0] }}
          transition={{ duration: 1.2, ease: "linear" }}
        />

        {/* Countdown Circle */}
        <motion.div 
          className="relative w-64 h-64 rounded-full border-4 border-white/50 flex items-center justify-center"
          initial={{ scale: 1, opacity: 1 }} animate={{ scale: 5, opacity: 0 }} transition={{ duration: 2.5, ease: "easeIn" }}
        >
          <div className="absolute w-full h-px bg-white/50"></div>
          <div className="absolute h-full w-px bg-white/50"></div>
          
          <CountdownSequence />
        </motion.div>
      </motion.div>
    );
  }

  // === 3. Gaming History (Retro Warp & CRT) ===
  if (type === 'gaming-history') {
    return (
      <motion.div 
        className="fixed inset-0 z-[5000] flex items-center justify-center bg-black overflow-hidden pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 1 } }}
      >
        {/* Hyperspace Lines */}
        <motion.div 
          className="absolute inset-0"
          initial={{ scale: 1 }} animate={{ scale: 15 }} transition={{ duration: 2.5, ease: "easeIn" }}
        >
          {gamingLines.map((l) => (
            <div 
              key={l.id} 
              className="absolute w-1 bg-white"
              style={{
                height: `${l.height}%`,
                left: '50%', top: '50%',
                transformOrigin: 'top center',
                transform: `rotate(${l.rotate}deg) translateY(${l.translateY}px)`,
                boxShadow: '0 0 10px #ff00ff, 0 0 20px #00ffff'
              }}
            />
          ))}
        </motion.div>
        
        <motion.div
          className="absolute inset-0 bg-cyan-400/15"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0, 0.35] }}
          transition={{ duration: 0.9, times: [0, 0.85, 1] }}
        />
      </motion.div>
    );
  }

  // === 4. Football History (Stadium Lights & Crowd) ===
  if (type === 'football-history') {
    return (
      <motion.div 
        className="fixed inset-0 z-[5000] flex items-center justify-center overflow-hidden bg-[#0a1f0a] pointer-events-none"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 1 } }}
      >
        {/* Stadium Grass Pattern */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 100px)' }}></div>

        {/* Stadium Lights Flashing */}
        <motion.div 
          className="absolute inset-0 bg-emerald-200/10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.25, 0, 0.35, 0] }}
          transition={{ duration: 1, ease: "linear" }}
        />
        
        {/* Camera Flashes (Crowd) */}
        <motion.div className="absolute inset-0">
          {stadiumFlashes.map((f) => (
            <motion.div 
              key={f.id} 
              className="absolute w-3 h-3 bg-white rounded-full shadow-[0_0_15px_#fff]"
              style={{
                left: `${f.left}%`,
                top: `${f.top}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
              transition={{ delay: f.delay, duration: 0.2 }}
            />
          ))}
        </motion.div>

        {/* TV Broadcast Scanline Transition */}
        <motion.div
          className="absolute inset-0 bg-black"
          initial={{ height: '0%' }}
          animate={{ height: '100%' }}
          transition={{ delay: 1.5, duration: 0.5, ease: "easeIn" }}
        />
      </motion.div>
    );
  }

  // Fallback — dark crossfade (no white flash)
  return (
    <motion.div
      className="fixed inset-0 z-[5000] bg-[#020101] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.92 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    />
  );
}

// Small component to handle the film countdown numbers
function CountdownSequence() {
  const [num, setNum] = useState(3);
  
  useEffect(() => {
    const int1 = setTimeout(() => setNum(2), 700);
    const int2 = setTimeout(() => setNum(1), 1400);
    return () => { clearTimeout(int1); clearTimeout(int2); };
  }, []);
  
  return <div className="text-9xl font-serif font-black text-white mix-blend-difference">{num}</div>;
}
