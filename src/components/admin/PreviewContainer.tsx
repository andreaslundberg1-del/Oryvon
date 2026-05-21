"use client";

import React, { ReactNode, useState } from 'react';
import { Monitor, Tablet, Smartphone, Moon, Sun, Sparkles } from 'lucide-react';
import { PreviewFrame } from './PreviewFrame';

type PreviewDevice = "desktop" | "tablet" | "mobile";
type PreviewTheme = "dark" | "light" | "cinematic";

interface PreviewContainerProps {
  children?: ReactNode;
  className?: string;
  route?: string; // New prop for iframe-based preview
  previewData?: any; // Draft state to send to iframe
}

export function PreviewContainer({ children, className = "", route, previewData }: PreviewContainerProps) {
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [theme, setTheme] = useState<PreviewTheme>("cinematic");
  const [scale, setScale] = useState(1);

  const getViewportConfig = () => {
    switch (device) {
      case "desktop": 
        return { label: "DESKTOP (1920x1080)" };
      case "tablet": 
        return { label: "TABLET (768x1024)" };
      case "mobile": 
        return { label: "MOBILE (390x844)" };
    }
  };

  const viewportConfig = getViewportConfig();

  const getThemeClasses = () => {
    switch (theme) {
      case "dark": return "bg-black/90 text-white";
      case "light": return "bg-white text-gray-900";
      case "cinematic": return "bg-gradient-to-b from-black/95 via-black/90 to-black/95 text-white";
    }
  };

  // If route is provided, use iframe-based preview
  if (route) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        {/* Preview Header */}
        <div className="mb-4">
          <h2 className="font-mono text-[9px] uppercase tracking-[0.28em] text-amber-400 mb-2">LIVE PREVIEW</h2>
          <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">
            Real-time page preview • {viewportConfig.label} • Scale: {(scale * 100).toFixed(0)}%
            {previewData && <span className="ml-2 text-amber-500/60">• LIVE DRAFT PREVIEW</span>}
          </p>
        </div>
        
        {/* Preview Content - Iframe Based */}
        <div className="flex-1 flex items-start justify-start min-h-[400px] bg-black/60 rounded-xl border border-white/5 overflow-auto relative">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.06),transparent_45%)]" />
          
          <div className="relative z-10 p-4 w-full">
            <PreviewFrame 
              route={route} 
              device={device} 
              onScaleChange={setScale}
              previewData={previewData}
            />
          </div>
        </div>

        {/* Preview Controls */}
        <div className="mt-6 space-y-4">
          {/* Device Controls */}
          <div>
            <label className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/30 mb-3 block">DEVICE MODE</label>
            <div className="flex gap-2">
              {(["desktop", "tablet", "mobile"] as PreviewDevice[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={`flex-1 flex items-center justify-center gap-2 border rounded-lg py-2.5 font-mono text-[8px] tracking-widest transition-all ${
                    device === d
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                      : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  {d === "desktop" && <Monitor size={14} />}
                  {d === "tablet" && <Tablet size={14} />}
                  {d === "mobile" && <Smartphone size={14} />}
                  {d.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Controls */}
          <div>
            <label className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/30 mb-3 block">THEME MODE</label>
            <div className="flex gap-2">
              {(["dark", "light", "cinematic"] as PreviewTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`flex-1 flex items-center justify-center gap-2 border rounded-lg py-2.5 font-mono text-[8px] tracking-widest transition-all ${
                    theme === t
                      ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                      : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:bg-white/[0.06]"
                  }`}
                >
                  {t === "dark" && <Moon size={14} />}
                  {t === "light" && <Sun size={14} />}
                  {t === "cinematic" && <Sparkles size={14} />}
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fallback to component-based preview (for backward compatibility)
  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Preview Header */}
      <div className="mb-4">
        <h2 className="font-mono text-[9px] uppercase tracking-[0.28em] text-amber-400 mb-2">LIVE PREVIEW</h2>
        <p className="font-mono text-[7px] uppercase tracking-[0.15em] text-white/25">Real-time page preview • {viewportConfig.label}</p>
      </div>
      
      {/* Preview Content - Component Based */}
      <div className="flex-1 flex items-start justify-start min-h-[400px] bg-black/60 rounded-xl border border-white/5 overflow-auto relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.06),transparent_45%)]" />
        
        <div className={`w-full ${getThemeClasses()} p-4`}>
          {children}
        </div>
      </div>

      {/* Preview Controls */}
      <div className="mt-6 space-y-4">
        {/* Device Controls */}
        <div>
          <label className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/30 mb-3 block">DEVICE MODE</label>
          <div className="flex gap-2">
            {(["desktop", "tablet", "mobile"] as PreviewDevice[]).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={`flex-1 flex items-center justify-center gap-2 border rounded-lg py-2.5 font-mono text-[8px] tracking-widest transition-all ${
                  device === d
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                {d === "desktop" && <Monitor size={14} />}
                {d === "tablet" && <Tablet size={14} />}
                {d === "mobile" && <Smartphone size={14} />}
                {d.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Theme Controls */}
        <div>
          <label className="font-mono text-[7px] uppercase tracking-[0.2em] text-white/30 mb-3 block">THEME MODE</label>
          <div className="flex gap-2">
            {(["dark", "light", "cinematic"] as PreviewTheme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`flex-1 flex items-center justify-center gap-2 border rounded-lg py-2.5 font-mono text-[8px] tracking-widest transition-all ${
                  theme === t
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-300"
                    : "border-white/10 bg-white/[0.03] text-white/50 hover:border-white/20 hover:bg-white/[0.06]"
                }`}
              >
                {t === "dark" && <Moon size={14} />}
                {t === "light" && <Sun size={14} />}
                {t === "cinematic" && <Sparkles size={14} />}
                {t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
