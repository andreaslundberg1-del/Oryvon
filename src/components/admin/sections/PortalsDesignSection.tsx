"use client";

import React from 'react';
import { Palette, Image as ImageIcon, Sparkles } from 'lucide-react';
import { PortalsDesignConfig } from '@/lib/admin-config';

interface PortalsDesignSectionProps {
  config: PortalsDesignConfig;
  onChange: (config: PortalsDesignConfig) => void;
}

export function PortalsDesignSection({ config, onChange }: PortalsDesignSectionProps) {
  const handleChange = (field: keyof PortalsDesignConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Design</h3>
      </div>

      {/* Card Style */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Card Style</label>
        <select
          value={config.cardStyle}
          onChange={(e) => handleChange('cardStyle', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
        >
          <option value="glass">Glass</option>
          <option value="solid">Solid</option>
          <option value="minimal">Minimal</option>
        </select>
      </div>

      {/* Card Background Color */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Card Background Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.cardBackgroundColor}
            onChange={(e) => handleChange('cardBackgroundColor', e.target.value)}
            className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={config.cardBackgroundColor}
            onChange={(e) => handleChange('cardBackgroundColor', e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="rgba(0,0,0,0.6)"
          />
        </div>
      </div>

      {/* Card Border Color */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Card Border Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.cardBorderColor}
            onChange={(e) => handleChange('cardBorderColor', e.target.value)}
            className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={config.cardBorderColor}
            onChange={(e) => handleChange('cardBorderColor', e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="rgba(255,255,255,0.1)"
          />
        </div>
      </div>

      {/* Card Border Radius */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Card Border Radius</label>
        <input
          type="text"
          value={config.cardBorderRadius}
          onChange={(e) => handleChange('cardBorderRadius', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="1rem"
        />
      </div>

      {/* Card Shadow */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Card Shadow</label>
        <input
          type="text"
          value={config.cardShadow}
          onChange={(e) => handleChange('cardShadow', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="0 0 30px rgba(0,0,0,0.5)"
        />
      </div>

      {/* Glow Effects */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Glow Effects</label>
        </div>

        {/* Card Glow Enabled */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Card Glow Enabled</label>
          <button
            onClick={() => handleChange('cardGlowEnabled', !config.cardGlowEnabled)}
            className={`w-12 h-6 rounded-full transition-all duration-300 ${
              config.cardGlowEnabled ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                config.cardGlowEnabled ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Card Glow Color */}
        {config.cardGlowEnabled && (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/30">Card Glow Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.cardGlowColor}
                onChange={(e) => handleChange('cardGlowColor', e.target.value)}
                className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={config.cardGlowColor}
                onChange={(e) => handleChange('cardGlowColor', e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
                placeholder="#f59e0b"
              />
            </div>
          </div>
        )}

        {/* Card Glow Intensity */}
        {config.cardGlowEnabled && (
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/30">Card Glow Intensity</label>
            <input
              type="text"
              value={config.cardGlowIntensity}
              onChange={(e) => handleChange('cardGlowIntensity', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
              placeholder="0 0 20px rgba(245,158,11,0.3)"
            />
          </div>
        )}
      </div>

      {/* Image Settings */}
      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Image Settings</label>
        </div>

        {/* Image Fit */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Image Fit</label>
          <select
            value={config.imageFit}
            onChange={(e) => handleChange('imageFit', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
          >
            <option value="cover">Cover</option>
            <option value="contain">Contain</option>
            <option value="fill">Fill</option>
          </select>
        </div>

        {/* Image Grayscale */}
        <div className="flex items-center justify-between">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Image Grayscale</label>
          <button
            onClick={() => handleChange('imageGrayscale', !config.imageGrayscale)}
            className={`w-12 h-6 rounded-full transition-all duration-300 ${
              config.imageGrayscale ? 'bg-amber-500' : 'bg-white/10'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                config.imageGrayscale ? 'translate-x-6' : 'translate-x-0.5'
              }`}
            />
          </button>
        </div>

        {/* Image Blur */}
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Image Blur</label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={config.imageBlur}
              onChange={(e) => handleChange('imageBlur', parseFloat(e.target.value))}
              className="flex-1"
            />
            <span className="text-white/60 text-sm w-12 text-right">{config.imageBlur}px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
