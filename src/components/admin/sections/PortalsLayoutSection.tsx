"use client";

import React from 'react';
import { Layout, Smartphone, Monitor } from 'lucide-react';
import { PortalsLayoutConfig } from '@/lib/admin-config';

interface PortalsLayoutSectionProps {
  config: PortalsLayoutConfig;
  onChange: (config: PortalsLayoutConfig) => void;
}

export function PortalsLayoutSection({ config, onChange }: PortalsLayoutSectionProps) {
  const handleChange = (field: keyof PortalsLayoutConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Layout className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Layout</h3>
      </div>

      {/* Grid Columns */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Grid Columns</label>
        <input
          type="number"
          min="1"
          max="6"
          value={config.gridColumns}
          onChange={(e) => handleChange('gridColumns', parseInt(e.target.value) || 3)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
        />
      </div>

      {/* Grid Gap */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Grid Gap</label>
        <input
          type="text"
          value={config.gridGap}
          onChange={(e) => handleChange('gridGap', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="2rem"
        />
      </div>

      {/* Card Aspect Ratio */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Card Aspect Ratio</label>
        <input
          type="text"
          value={config.cardAspectRatio}
          onChange={(e) => handleChange('cardAspectRatio', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="16/9"
        />
      </div>

      {/* Card Padding */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Card Padding</label>
        <input
          type="text"
          value={config.cardPadding}
          onChange={(e) => handleChange('cardPadding', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="1rem"
        />
      </div>

      {/* Scroll Direction */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Scroll Direction</label>
        <div className="grid grid-cols-2 gap-2">
          {(['horizontal', 'vertical'] as const).map((direction) => (
            <button
              key={direction}
              onClick={() => handleChange('scrollDirection', direction)}
              className={`px-4 py-2 rounded-lg border transition-all ${
                config.scrollDirection === direction
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-black/40 border-white/10 text-white/60 hover:border-white/20'
              }`}
            >
              {direction.charAt(0).toUpperCase() + direction.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Show Scrollbar */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Show Scrollbar</label>
        <button
          onClick={() => handleChange('showScrollbar', !config.showScrollbar)}
          className={`w-12 h-6 rounded-full transition-all duration-300 ${
            config.showScrollbar ? 'bg-amber-500' : 'bg-white/10'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
              config.showScrollbar ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Mobile Layout Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Mobile Layout</label>
        </div>

        {/* Mobile Grid Columns */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Grid Columns</label>
          <input
            type="number"
            min="1"
            max="3"
            value={config.mobileGridColumns}
            onChange={(e) => handleChange('mobileGridColumns', parseInt(e.target.value) || 1)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
          />
        </div>

        {/* Mobile Card Padding */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Card Padding</label>
          <input
            type="text"
            value={config.mobileCardPadding}
            onChange={(e) => handleChange('mobileCardPadding', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="1rem"
          />
        </div>
      </div>
    </div>
  );
}
