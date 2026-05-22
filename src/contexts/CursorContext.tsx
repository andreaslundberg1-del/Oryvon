"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CursorTheme = 
  | 'default' 
  | 'minimal-gold-dot'
  | 'sci-fi-ring'
  | 'hollow-circle'
  | 'energy-pulse'
  | 'mythic-rune'
  | 'cyber'
  | 'elegant-thin'
  | 'glow-trail'
  | 'orbit';

export type CursorEffect = 
  | 'none'
  | 'smooth-trail'
  | 'glow-intensity'
  | 'hover-expand'
  | 'click-ripple'
  | 'magnetic-hover'
  | 'particle-trail'
  | 'cinematic-smooth';

export interface CursorSettings {
  theme: CursorTheme;
  effects: CursorEffect[];
  glowIntensity: number; // 0-100
  trailDuration: number; // 100-1000ms
  hoverScale: number; // 1.0-2.0
}

export const DEFAULT_CURSOR_SETTINGS: CursorSettings = {
  theme: 'default',
  effects: [],
  glowIntensity: 50,
  trailDuration: 300,
  hoverScale: 1.2,
};

const CURSOR_THEMES: { id: CursorTheme; name: string; description: string }[] = [
  { id: 'default', name: 'Default Oryvon Cursor', description: 'Classic cinematic cursor' },
  { id: 'minimal-gold-dot', name: 'Minimal Gold Dot', description: 'Simple gold point cursor' },
  { id: 'sci-fi-ring', name: 'Sci-Fi Ring Cursor', description: 'Futuristic ring design' },
  { id: 'hollow-circle', name: 'Hollow Circle Cursor', description: 'Elegant hollow circle' },
  { id: 'energy-pulse', name: 'Energy Pulse Cursor', description: 'Pulsing energy effect' },
  { id: 'mythic-rune', name: 'Mythic Rune Cursor', description: 'Ancient rune design' },
  { id: 'cyber', name: 'Cyber Cursor', description: 'Digital cyber aesthetic' },
  { id: 'elegant-thin', name: 'Elegant Thin Cursor', description: 'Thin elegant line' },
  { id: 'glow-trail', name: 'Glow Trail Cursor', description: 'Luminous trail effect' },
  { id: 'orbit', name: 'Orbit Cursor', description: 'Orbiting particles' },
];

const CURSOR_EFFECTS: { id: CursorEffect; name: string; description: string }[] = [
  { id: 'none', name: 'None', description: 'No additional effects' },
  { id: 'smooth-trail', name: 'Smooth Trail', description: 'Smooth trailing animation' },
  { id: 'glow-intensity', name: 'Glow Intensity', description: 'Enhanced glow effect' },
  { id: 'hover-expand', name: 'Hover Expand', description: 'Cursor expands on hover' },
  { id: 'click-ripple', name: 'Click Ripple', description: 'Ripple animation on click' },
  { id: 'magnetic-hover', name: 'Magnetic Hover', description: 'Magnetic effect on buttons' },
  { id: 'particle-trail', name: 'Particle Trail', description: 'Soft particle trail' },
  { id: 'cinematic-smooth', name: 'Cinematic Smooth', description: 'Motion smoothing' },
];

interface CursorContextType {
  settings: CursorSettings;
  setSettings: (settings: CursorSettings) => void;
  setTheme: (theme: CursorTheme) => void;
  addEffect: (effect: CursorEffect) => void;
  removeEffect: (effect: CursorEffect) => void;
  resetToDefault: () => void;
  isDesktop: boolean;
}

const CursorContext = createContext<CursorContextType | undefined>(undefined);

export function CursorProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<CursorSettings>(DEFAULT_CURSOR_SETTINGS);
  // Start false — safe for SSR and mobile. Prevents hydration mismatch on iPhone.
  const [isDesktop, setIsDesktop] = useState(false);

  // Check if desktop — runs only in browser after hydration
  useEffect(() => {
    const checkDesktop = () => {
      const isDesktopDevice = window.innerWidth >= 1024 &&
        !('ontouchstart' in window) &&
        navigator.maxTouchPoints === 0;
      setIsDesktop(isDesktopDevice);
    };

    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('oryvon-cursor-settings');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettingsState(parsed);
      } catch (e) {
        console.error('Failed to parse cursor settings:', e);
      }
    }
  }, []);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('oryvon-cursor-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply cursor settings to document
  useEffect(() => {
    if (!isDesktop) {
      document.body.classList.remove('cursor-custom');
      document.body.style.cursor = '';
      return;
    }

    document.body.classList.add('cursor-custom');
    
    // Set data attributes for CSS
    document.body.dataset.cursorTheme = settings.theme;
    document.body.dataset.cursorEffects = settings.effects.join(',');
    document.body.dataset.cursorGlow = settings.glowIntensity.toString();
    document.body.dataset.cursorTrail = settings.trailDuration.toString();
    document.body.dataset.cursorScale = settings.hoverScale.toString();

    return () => {
      document.body.classList.remove('cursor-custom');
      delete document.body.dataset.cursorTheme;
      delete document.body.dataset.cursorEffects;
      delete document.body.dataset.cursorGlow;
      delete document.body.dataset.cursorTrail;
      delete document.body.dataset.cursorScale;
    };
  }, [settings, isDesktop]);

  const setSettings = (newSettings: CursorSettings) => {
    setSettingsState(newSettings);
  };

  const setTheme = (theme: CursorTheme) => {
    setSettingsState(prev => ({ ...prev, theme }));
  };

  const addEffect = (effect: CursorEffect) => {
    setSettingsState(prev => ({
      ...prev,
      effects: prev.effects.includes(effect) ? prev.effects : [...prev.effects, effect]
    }));
  };

  const removeEffect = (effect: CursorEffect) => {
    setSettingsState(prev => ({
      ...prev,
      effects: prev.effects.filter(e => e !== effect)
    }));
  };

  const resetToDefault = () => {
    setSettingsState(DEFAULT_CURSOR_SETTINGS);
  };

  return (
    <CursorContext.Provider value={{
      settings,
      setSettings,
      setTheme,
      addEffect,
      removeEffect,
      resetToDefault,
      isDesktop,
    }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursor() {
  const context = useContext(CursorContext);
  if (context === undefined) {
    throw new Error('useCursor must be used within a CursorProvider');
  }
  return context;
}

export { CURSOR_THEMES, CURSOR_EFFECTS };
