"use client";

import React from 'react';
import { Sparkles, MousePointer2, Activity } from 'lucide-react';
import { PortalsAnimationConfig } from '@/lib/admin-config';

interface PortalsAnimationSectionProps {
  config: PortalsAnimationConfig;
  onChange: (config: PortalsAnimationConfig) => void;
}

export function PortalsAnimationSection({ config, onChange }: PortalsAnimationSectionProps) {
  const handleChange = (field: keyof PortalsAnimationConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Animation</h3>
      </div>

      {/* Card Hover Effect */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Card Hover Effect</label>
        <select
          value={config.cardHoverEffect}
          onChange={(e) => handleChange('cardHoverEffect', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
        >
          <option value="lift">Lift</option>
          <option value="glow">Glow</option>
          <option value="scale">Scale</option>
          <option value="none">None</option>
        </select>
      </div>

      {/* Card Animation Duration */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Card Animation Duration (ms)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={config.cardAnimationDuration}
            onChange={(e) => handleChange('cardAnimationDuration', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-white/60 text-sm w-16 text-right">{config.cardAnimationDuration}ms</span>
        </div>
      </div>

      {/* Stagger Animation */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Stagger Animation</label>
        <button
          onClick={() => handleChange('staggerAnimation', !config.staggerAnimation)}
          className={`w-12 h-6 rounded-full transition-all duration-300 ${
            config.staggerAnimation ? 'bg-amber-500' : 'bg-white/10'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
              config.staggerAnimation ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Stagger Delay */}
      {config.staggerAnimation && (
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Stagger Delay (ms)</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="500"
              step="25"
              value={config.staggerDelay}
              onChange={(e) => handleChange('staggerDelay', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-white/60 text-sm w-16 text-right">{config.staggerDelay}ms</span>
          </div>
        </div>
      )}

      {/* Image Hover Effect */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <MousePointer2 className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Image Hover Effect</label>
        </div>
        <select
          value={config.imageHoverEffect}
          onChange={(e) => handleChange('imageHoverEffect', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
        >
          <option value="zoom">Zoom</option>
          <option value="pan">Pan</option>
          <option value="none">None</option>
        </select>
      </div>

      {/* Image Animation Duration */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/30">Image Animation Duration (ms)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="2000"
            step="100"
            value={config.imageAnimationDuration}
            onChange={(e) => handleChange('imageAnimationDuration', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-white/60 text-sm w-16 text-right">{config.imageAnimationDuration}ms</span>
        </div>
      </div>
    </div>
  );
}
