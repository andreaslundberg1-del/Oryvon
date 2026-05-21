"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { EraTheme } from '@/types/timeline';

interface EvolutionState {
  pixelation: number;
  colorDepth: number;
  bloom: number;
  scanlines: number;
  chromatic: number;
  glitch: number;
  uiStyle: string;
}

const EvolutionContext = createContext<{
  state: EvolutionState;
  setEvolution: (theme: EraTheme) => void;
}>({
  state: {
    pixelation: 0,
    colorDepth: 16777216,
    bloom: 0,
    scanlines: 0,
    chromatic: 0,
    glitch: 0,
    uiStyle: 'cinematic'
  },
  setEvolution: () => {}
});

export const useEvolution = () => useContext(EvolutionContext);

export function EvolutionProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<EvolutionState>({
    pixelation: 0,
    colorDepth: 16777216,
    bloom: 0,
    scanlines: 0,
    chromatic: 0,
    glitch: 0,
    uiStyle: 'cinematic'
  });

  const setEvolution = useCallback((theme: EraTheme) => {
    setState({
      pixelation: theme.pixelation ?? 0,
      colorDepth: theme.colorDepth ?? 16777216,
      bloom: theme.bloomIntensity ?? 0,
      scanlines: theme.scanlineIntensity ?? 0,
      chromatic: theme.chromaticAberration ?? 0,
      glitch: theme.glitchIntensity ?? (theme.pixelation ? theme.pixelation / 10 : 0),
      uiStyle: theme.uiStyle
    });
  }, []);

  useEffect(() => {
    // Update global CSS variables for the engine
    const root = document.documentElement;
    root.style.setProperty('--evo-pixelation', `${state.pixelation}px`);
    root.style.setProperty('--evo-bloom', `${state.bloom}`);
    root.style.setProperty('--evo-scanlines', `${state.scanlines}`);
    root.style.setProperty('--evo-chromatic', `${state.chromatic}`);
    root.style.setProperty('--evo-glitch', `${state.glitch}`);
    
    // Handle color depth via CSS/Filter logic if needed
    root.style.setProperty('--evo-color-depth', `${state.colorDepth}`);
  }, [state]);

  return (
    <EvolutionContext.Provider value={{ state, setEvolution }}>
      {children}
    </EvolutionContext.Provider>
  );
}
