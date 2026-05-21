"use client";

import React from 'react';
import { Sparkles, MousePointer2, Activity, Layers } from 'lucide-react';
import { HomepageAnimationConfig } from '@/lib/admin-config';

interface HomepageAnimationSectionProps {
  config: HomepageAnimationConfig;
  onChange: (config: HomepageAnimationConfig) => void;
}

export function HomepageAnimationSection({ config, onChange }: HomepageAnimationSectionProps) {
  const handleChange = (field: keyof HomepageAnimationConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Animation</h3>
      </div>

      {/* Hero Animation */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Animation</label>
        <select
          value={config.heroAnimation}
          onChange={(e) => handleChange('heroAnimation', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
        >
          <option value="fadeIn">Fade In</option>
          <option value="slideUp">Slide Up</option>
          <option value="scaleIn">Scale In</option>
          <option value="none">None</option>
        </select>
      </div>

      {/* Hero Animation Duration */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Animation Duration (ms)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="2000"
            step="100"
            value={config.heroAnimationDuration}
            onChange={(e) => handleChange('heroAnimationDuration', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-white/60 text-sm w-16 text-right">{config.heroAnimationDuration}ms</span>
        </div>
      </div>

      {/* Hero Animation Delay */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Animation Delay (ms)</label>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max="1000"
            step="50"
            value={config.heroAnimationDelay}
            onChange={(e) => handleChange('heroAnimationDelay', parseInt(e.target.value))}
            className="flex-1"
          />
          <span className="text-white/60 text-sm w-16 text-right">{config.heroAnimationDelay}ms</span>
        </div>
      </div>

      {/* Glow Effects Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Glow Effects</label>
        </div>

        {/* Hero Glow Enabled */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Glow Enabled</label>
          <button
            onClick={() => handleChange('heroGlowEnabled', !config.heroGlowEnabled)}
            className={`w-12 h-6 rounded-full transition-all duration-300 ${
              config.heroGlowEnabled ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                config.heroGlowEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Hero Glow Color */}
        {config.heroGlowEnabled && (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Glow Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.heroGlowColor}
                onChange={(e) => handleChange('heroGlowColor', e.target.value)}
                className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={config.heroGlowColor}
                onChange={(e) => handleChange('heroGlowColor', e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
                placeholder="#f59e0b"
              />
            </div>
          </div>
        )}

        {/* Hero Glow Intensity */}
        {config.heroGlowEnabled && (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Glow Intensity</label>
            <input
              type="text"
              value={config.heroGlowIntensity}
              onChange={(e) => handleChange('heroGlowIntensity', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
              placeholder="0 0 30px rgba(245,158,11,0.5)"
            />
          </div>
        )}
      </div>

      {/* Hover Effects Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <MousePointer2 className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hover Effects</label>
        </div>

        {/* Button Hover Effect */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Button Hover Effect</label>
          <select
            value={config.buttonHoverEffect}
            onChange={(e) => handleChange('buttonHoverEffect', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
          >
            <option value="glow">Glow</option>
            <option value="scale">Scale</option>
            <option value="slide">Slide</option>
            <option value="none">None</option>
          </select>
        </div>
      </div>

      {/* Background Movement Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Background Movement</label>
        </div>

        {/* Background Movement Enabled */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Background Movement Enabled</label>
          <button
            onClick={() => handleChange('backgroundMovementEnabled', !config.backgroundMovementEnabled)}
            className={`w-12 h-6 rounded-full transition-all duration-300 ${
              config.backgroundMovementEnabled ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                config.backgroundMovementEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Background Movement Speed */}
        {config.backgroundMovementEnabled && (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/30">Background Movement Speed</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.1"
                max="3"
                step="0.1"
                value={config.backgroundMovementSpeed}
                onChange={(e) => handleChange('backgroundMovementSpeed', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-white/60 text-sm w-12 text-right">{config.backgroundMovementSpeed}x</span>
            </div>
          </div>
        )}
      </div>

      {/* Parallax Section */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Parallax</label>
        </div>

        {/* Parallax Enabled */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Parallax Enabled</label>
          <button
            onClick={() => handleChange('parallaxEnabled', !config.parallaxEnabled)}
            className={`w-12 h-6 rounded-full transition-all duration-300 ${
              config.parallaxEnabled ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                config.parallaxEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Parallax Intensity */}
        {config.parallaxEnabled && (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/30">Parallax Intensity</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={config.parallaxIntensity}
                onChange={(e) => handleChange('parallaxIntensity', parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-white/60 text-sm w-12 text-right">{config.parallaxIntensity}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
