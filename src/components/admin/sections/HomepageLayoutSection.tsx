"use client";

import React from 'react';
import { Layout, Smartphone, Monitor, Layers } from 'lucide-react';
import { HomepageLayoutConfig } from '@/lib/admin-config';

interface HomepageLayoutSectionProps {
  config: HomepageLayoutConfig;
  onChange: (config: HomepageLayoutConfig) => void;
}

export function HomepageLayoutSection({ config, onChange }: HomepageLayoutSectionProps) {
  const handleChange = (field: keyof HomepageLayoutConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Layout className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Layout</h3>
      </div>

      {/* Hero Alignment */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Alignment</label>
        <div className="grid grid-cols-3 gap-2">
          {(['left', 'center', 'right'] as const).map((alignment) => (
            <button
              key={alignment}
              onClick={() => handleChange('heroAlignment', alignment)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                config.heroAlignment === alignment
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
              }`}
            >
              {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Vertical Alignment */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Vertical Alignment</label>
        <div className="grid grid-cols-3 gap-2">
          {(['top', 'center', 'bottom'] as const).map((alignment) => (
            <button
              key={alignment}
              onClick={() => handleChange('heroVerticalAlignment', alignment)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                config.heroVerticalAlignment === alignment
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
              }`}
            >
              {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Padding */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Padding</label>
        <input
          type="text"
          value={config.heroPadding}
          onChange={(e) => handleChange('heroPadding', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="4rem"
        />
      </div>

      {/* Hero Spacing */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Spacing</label>
        <input
          type="text"
          value={config.heroSpacing}
          onChange={(e) => handleChange('heroSpacing', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="2rem"
        />
      </div>

      {/* Button Position */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Button Position</label>
        <div className="grid grid-cols-2 gap-2">
          {(['inline', 'block'] as const).map((position) => (
            <button
              key={position}
              onClick={() => handleChange('buttonPosition', position)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                config.buttonPosition === position
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
              }`}
            >
              {position.charAt(0).toUpperCase() + position.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Layout Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Mobile Layout</label>
        </div>

        {/* Mobile Hero Alignment */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Alignment</label>
          <div className="grid grid-cols-2 gap-2">
            {(['left', 'center'] as const).map((alignment) => (
              <button
                key={alignment}
                onClick={() => handleChange('mobileHeroAlignment', alignment)}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  config.mobileHeroAlignment === alignment
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                    : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
                }`}
              >
                {alignment.charAt(0).toUpperCase() + alignment.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Mobile Hero Padding */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Padding</label>
          <input
            type="text"
            value={config.mobileHeroPadding}
            onChange={(e) => handleChange('mobileHeroPadding', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="2rem"
          />
        </div>

        {/* Mobile Hero Spacing */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Spacing</label>
          <input
            type="text"
            value={config.mobileHeroSpacing}
            onChange={(e) => handleChange('mobileHeroSpacing', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="1rem"
          />
        </div>
      </div>

      {/* Effects Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Effects</label>
        </div>

        {/* Backdrop Blur */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Backdrop Blur</label>
          <input
            type="text"
            value={config.backdropBlur}
            onChange={(e) => handleChange('backdropBlur', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="20px"
          />
        </div>

        {/* Backdrop Opacity */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Backdrop Opacity</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.backdropOpacity}
              onChange={(e) => handleChange('backdropOpacity', parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-white/60 text-sm w-12 text-right">{config.backdropOpacity}</span>
          </div>
        </div>

        {/* Shadow Intensity */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Shadow Intensity</label>
          <input
            type="text"
            value={config.shadowIntensity}
            onChange={(e) => handleChange('shadowIntensity', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="0 0 60px rgba(0,0,0,0.8)"
          />
        </div>

        {/* Border Radius */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Border Radius</label>
          <input
            type="text"
            value={config.borderRadius}
            onChange={(e) => handleChange('borderRadius', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="1rem"
          />
        </div>
      </div>
    </div>
  );
}
