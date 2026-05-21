"use client";

import React, { useState } from 'react';
import { useCursor, CURSOR_THEMES, CURSOR_EFFECTS, CursorTheme, CursorEffect } from '@/contexts/CursorContext';
import { RotateCcw, Sparkles, Zap, MousePointer2, Target, Radio, Activity } from 'lucide-react';

export default function CursorSettings() {
  const { settings, setTheme, addEffect, removeEffect, resetToDefault, isDesktop } = useCursor();
  const [previewTheme, setPreviewTheme] = useState<CursorTheme | null>(null);

  if (!isDesktop) {
    return (
      <div className="bg-black/40 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <MousePointer2 size={14} className="text-amber-400" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-light tracking-[0.2em] text-white">Cursor Settings</h3>
            <p className="font-mono text-[7px] text-white/30 tracking-widest uppercase mt-0.5">Customization</p>
          </div>
        </div>
        <p className="font-mono text-[8px] text-white/40 text-center py-4">
          Cursor customization is available on desktop only.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/8">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <MousePointer2 size={14} className="text-amber-400" />
        </div>
        <div>
          <h3 className="font-serif text-sm font-light tracking-[0.2em] text-white">Cursor Settings</h3>
          <p className="font-mono text-[7px] text-white/30 tracking-widest uppercase mt-0.5">Customization & Effects</p>
        </div>
        <button
          onClick={resetToDefault}
          className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 hover:bg-amber-500/10 hover:border-amber-500/30 text-white/50 hover:text-amber-400 transition-all font-mono text-[8px] tracking-widest uppercase"
        >
          <RotateCcw size={10} /> Reset to Default
        </button>
      </div>

      {/* Cursor Theme Selector */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={12} className="text-amber-400" />
          <h4 className="font-mono text-[9px] tracking-widest uppercase text-white/60">Cursor Style</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {CURSOR_THEMES.map((theme) => {
            const isSelected = settings.theme === theme.id;
            const isPreviewing = previewTheme === theme.id;

            return (
              <button
                key={theme.id}
                onMouseEnter={() => setPreviewTheme(theme.id)}
                onMouseLeave={() => setPreviewTheme(null)}
                onClick={() => {
                  setTheme(theme.id);
                  setPreviewTheme(null);
                }}
                className={`group relative p-4 rounded-xl border transition-all duration-300 ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15),inset_0_0_16px_rgba(245,158,11,0.05)]'
                    : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                {/* Cursor Preview Icon */}
                <div className="flex items-center justify-center h-16 mb-3">
                  <div
                    className={`transition-all duration-300 ${
                      isSelected || isPreviewing ? 'scale-110' : 'scale-100'
                    }`}
                    style={{
                      width: getCursorSize(theme.id),
                      height: getCursorSize(theme.id),
                      borderRadius: getCursorShape(theme.id) === '50%' ? '50%' : getCursorShape(theme.id) === 'square' ? '2px' : '50%',
                      background: isSelected ? '#f59e0b' : isPreviewing ? '#f59e0b' : '#eed078',
                      boxShadow: `0 0 ${isSelected ? 15 : 8}px ${isSelected || isPreviewing ? 'rgba(245,158,11,0.6)' : 'rgba(238,208,120,0.4)'}`,
                      clipPath: getCursorShape(theme.id) === 'polygon' ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' : 'none',
                      transform: getCursorShape(theme.id) === 'square' ? 'rotate(45deg)' : 'none',
                    }}
                  />
                </div>

                {/* Theme Name */}
                <p className="font-mono text-[8px] tracking-widest uppercase text-white/70 text-center leading-tight">
                  {theme.name}
                </p>
                <p className="font-mono text-[7px] text-white/30 text-center mt-1 leading-tight">
                  {theme.description}
                </p>

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cursor Effects */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Zap size={12} className="text-purple-400" />
          <h4 className="font-mono text-[9px] tracking-widest uppercase text-white/60">Effects</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CURSOR_EFFECTS.map((effect) => {
            const isSelected = settings.effects.includes(effect.id);

            return (
              <button
                key={effect.id}
                onClick={() => isSelected ? removeEffect(effect.id) : addEffect(effect.id)}
                className={`group p-3 rounded-lg border transition-all duration-300 ${
                  isSelected
                    ? 'bg-purple-500/10 border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                    : 'bg-black/40 border-white/10 hover:border-white/20 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {getEffectIcon(effect.id)}
                  <p className="font-mono text-[8px] tracking-widest uppercase text-white/70">
                    {effect.name}
                  </p>
                </div>
                <p className="font-mono text-[7px] text-white/30 leading-tight">
                  {effect.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Effect Intensity Sliders */}
      {settings.effects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Target size={12} className="text-blue-400" />
            <h4 className="font-mono text-[9px] tracking-widest uppercase text-white/60">Intensity</h4>
          </div>

          {/* Glow Intensity */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-mono text-[8px] text-white/50 tracking-widest uppercase">Glow Intensity</label>
              <span className="font-mono text-[8px] text-amber-400">{settings.glowIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.glowIntensity}
              onChange={(e) => {
                const { setSettings } = useCursor();
                setSettings({ ...settings, glowIntensity: parseInt(e.target.value) });
              }}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            />
          </div>

          {/* Trail Duration */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-mono text-[8px] text-white/50 tracking-widest uppercase">Trail Duration</label>
              <span className="font-mono text-[8px] text-amber-400">{settings.trailDuration}ms</span>
            </div>
            <input
              type="range"
              min="100"
              max="1000"
              step="50"
              value={settings.trailDuration}
              onChange={(e) => {
                const { setSettings } = useCursor();
                setSettings({ ...settings, trailDuration: parseInt(e.target.value) });
              }}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            />
          </div>

          {/* Hover Scale */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-mono text-[8px] text-white/50 tracking-widest uppercase">Hover Scale</label>
              <span className="font-mono text-[8px] text-amber-400">{settings.hoverScale}x</span>
            </div>
            <input
              type="range"
              min="1.0"
              max="2.0"
              step="0.1"
              value={settings.hoverScale}
              onChange={(e) => {
                const { setSettings } = useCursor();
                setSettings({ ...settings, hoverScale: parseFloat(e.target.value) });
              }}
              className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-400 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(245,158,11,0.8)]"
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getCursorSize(theme: CursorTheme): number {
  const sizes: Record<CursorTheme, number> = {
    'default': 12,
    'minimal-gold-dot': 8,
    'sci-fi-ring': 24,
    'hollow-circle': 20,
    'energy-pulse': 14,
    'mythic-rune': 18,
    'cyber': 16,
    'elegant-thin': 16,
    'glow-trail': 12,
    'orbit': 20,
  };
  return sizes[theme];
}

function getCursorShape(theme: CursorTheme): string {
  const shapes: Record<CursorTheme, string> = {
    'default': '50%',
    'minimal-gold-dot': '50%',
    'sci-fi-ring': '50%',
    'hollow-circle': '50%',
    'energy-pulse': '50%',
    'mythic-rune': 'polygon',
    'cyber': 'polygon',
    'elegant-thin': 'square',
    'glow-trail': '50%',
    'orbit': '50%',
  };
  return shapes[theme];
}

function getEffectIcon(effect: CursorEffect) {
  const icons: Record<CursorEffect, React.ReactNode> = {
    'none': <Radio size={12} className="text-white/40" />,
    'smooth-trail': <Activity size={12} className="text-blue-400" />,
    'glow-intensity': <Sparkles size={12} className="text-amber-400" />,
    'hover-expand': <Target size={12} className="text-purple-400" />,
    'click-ripple': <Radio size={12} className="text-green-400" />,
    'magnetic-hover': <MousePointer2 size={12} className="text-cyan-400" />,
    'particle-trail': <Sparkles size={12} className="text-pink-400" />,
    'cinematic-smooth': <Activity size={12} className="text-orange-400" />,
  };
  return icons[effect];
}
