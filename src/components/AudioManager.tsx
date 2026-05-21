"use client";

import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

interface AudioContextType {
  isMuted: boolean;
  volume: number;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  playHover: () => void;
  playClick: () => void;
  playEraTransition: (style?: string) => void;
  playPortalSound: () => void;
  playGlitchSound: () => void;
  setAmbience: (type: 'radar' | 'synthwave' | 'orchestral' | 'future' | 'modern') => void;
  setBackgroundMusic: (url: string) => void;
  playScrollTick: (newYear: number) => void;
  setAmbientTone: (intensity: number) => void;
}

const AudioContext = createContext<AudioContextType>({
  isMuted: false,
  volume: 0.1,
  toggleMute: () => {},
  setVolume: () => {},
  playHover: () => {},
  playClick: () => {},
  playEraTransition: () => {},
  playPortalSound: () => {},
  playGlitchSound: () => {},
  setAmbience: () => {},
  setBackgroundMusic: () => {},
  playScrollTick: () => {},
  setAmbientTone: () => {},
});

export const useAudio = () => useContext(AudioContext);

export function AudioManagerProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.1);
  
  const isMutedRef = useRef(false);
  const volumeRef = useRef(0.1);
  
  const audioCtxRef = useRef<globalThis.AudioContext | null>(null);
  
  const [activeAmbience, setActiveAmbience] = useState<'radar' | 'synthwave' | 'orchestral' | 'future' | 'modern'>('radar');
  const [ambientTone, setAmbientToneState] = useState(0.5);

  const setAmbientTone = (intensity: number) => {
    setAmbientToneState(intensity);
  };

  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('cinematic-muted', String(next));
      }
      return next;
    });
  };

  const setVolume = (v: number) => {
    setVolumeState(v);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cinematic-volume', String(v));
    }
    if (v > 0 && isMuted) {
      setIsMuted(false);
      if (typeof window !== 'undefined') localStorage.setItem('cinematic-muted', 'false');
    } else if (v === 0 && !isMuted) {
      setIsMuted(true);
      if (typeof window !== 'undefined') localStorage.setItem('cinematic-muted', 'true');
    }
  };
  
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const transitionAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let currentMuted = false;
    let currentVolume = 0.1;

    if (typeof window !== 'undefined') {
      const savedVol = localStorage.getItem('cinematic-volume');
      const savedMute = localStorage.getItem('cinematic-muted');
      if (savedVol !== null) {
        currentVolume = parseFloat(savedVol);
        setVolumeState(currentVolume);
      }
      if (savedMute !== null) {
        currentMuted = savedMute === 'true';
        setIsMuted(currentMuted);
      }
    }

    isMutedRef.current = currentMuted;
    volumeRef.current = currentVolume;

    const initAudio = () => {
      // 1. Initialize context
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }

      // 2. Initialize sound effects elements
      if (!bgAudioRef.current) {
        const bg = new Audio('/sound/Space.mp3');
        bg.loop = true;
        bg.volume = isMutedRef.current ? 0 : volumeRef.current;
        bgAudioRef.current = bg;
        
        const tr = new Audio('/sound/transe.mp3');
        tr.volume = isMutedRef.current ? 0 : Math.min(volumeRef.current * 1.5, 1);
        transitionAudioRef.current = tr;
      }

      if (bgAudioRef.current && bgAudioRef.current.paused) {
        bgAudioRef.current.play().catch(e => console.log("Audio play blocked", e));
      }
    };
    
    const events = ['click', 'mousemove', 'mousedown', 'keydown', 'touchstart'];
    events.forEach(e => window.addEventListener(e, initAudio, { once: true }));
    
    return () => {
      events.forEach(e => window.removeEventListener(e, initAudio));
      if (bgAudioRef.current) bgAudioRef.current.pause();
    };
  }, []);

  useEffect(() => {
    isMutedRef.current = isMuted;
    volumeRef.current = volume;
    if (bgAudioRef.current) {
      bgAudioRef.current.volume = isMuted ? 0 : volume;
    }
    if (transitionAudioRef.current) {
      transitionAudioRef.current.volume = isMuted ? 0 : Math.min(volume * 1.5, 1);
    }
  }, [isMuted, volume]);

  const setAmbience = (type: 'radar' | 'synthwave' | 'orchestral' | 'future' | 'modern') => {
    if (type !== activeAmbience) {
      setActiveAmbience(type);
    }
  };

  const playHover = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    const osc = ctx.createOscillator();
    const modulator = ctx.createOscillator();
    const modGain = ctx.createGain();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sine';
    modulator.type = 'square';
    
    modulator.frequency.setValueAtTime(50, ctx.currentTime);
    modGain.gain.setValueAtTime(300, ctx.currentTime);
    
    osc.frequency.setValueAtTime(750, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 0.1);
    
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, ctx.currentTime);
    
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.015, ctx.currentTime + 0.01);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

    modulator.connect(modGain);
    modGain.connect(osc.frequency);
    
    osc.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);

    modulator.start();
    osc.start();
    modulator.stop(ctx.currentTime + 0.15);
    osc.stop(ctx.currentTime + 0.15);
  };

  const playClick = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  };

  const playEraTransition = (style?: string) => {
    if (isMuted || !transitionAudioRef.current) return;
    transitionAudioRef.current.currentTime = 0;
    transitionAudioRef.current.play().catch(e => console.log("Transition audio play blocked", e));
    playPortalSound();
  };

  const playPortalSound = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(40, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 1.2);
    
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(5000, ctx.currentTime + 0.8);

    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(volume * 0.4, ctx.currentTime + 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);

    osc.connect(filter);
    filter.connect(g);
    g.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 1.5);
  };

  const playGlitchSound = () => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(Math.random() * 1000 + 100, ctx.currentTime);
    
    for(let i = 0; i < 10; i++) {
      osc.frequency.setValueAtTime(Math.random() * 2000, ctx.currentTime + (i * 0.02));
    }

    g.gain.setValueAtTime(0, ctx.currentTime);
    g.gain.linearRampToValueAtTime(volume * 0.2, ctx.currentTime + 0.01);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);

    osc.connect(g);
    g.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  const setBackgroundMusic = (url: string) => {
    if (bgAudioRef.current && bgAudioRef.current.src.includes(url)) return;
    
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      bgAudioRef.current.src = url;
      bgAudioRef.current.load();
      if (!isMuted) {
        bgAudioRef.current.play().catch(e => console.log("Music play blocked", e));
      }
    }
  };

  const playScrollTick = (newYear: number) => {
    if (isMuted || !audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const baseFreq = newYear < 1980 ? 150 : newYear < 2000 ? 440 : 880;
    osc.type = newYear < 1990 ? 'square' : 'sine';
    osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.05);
    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  return (
    <AudioContext.Provider value={{ isMuted, volume, toggleMute, setVolume, playHover, playClick, playEraTransition, playPortalSound, playGlitchSound, setAmbience, setBackgroundMusic, playScrollTick, setAmbientTone }}>
      {children}
    </AudioContext.Provider>
  );
}
