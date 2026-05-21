"use client";

import React from 'react';
import { Palette, Image, Video, Type, Zap } from 'lucide-react';
import { HomepageDesignConfig } from '@/lib/admin-config';

interface HomepageDesignSectionProps {
  config: HomepageDesignConfig;
  onChange: (config: HomepageDesignConfig) => void;
}

export function HomepageDesignSection({ config, onChange }: HomepageDesignSectionProps) {
  const handleChange = (field: keyof HomepageDesignConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  const handleFontSizeChange = (field: keyof typeof config.fontSize, value: string) => {
    onChange({
      ...config,
      fontSize: { ...config.fontSize, [field]: value },
    });
  };

  const handleTextColorChange = (field: keyof typeof config.textColors, value: string) => {
    onChange({
      ...config,
      textColors: { ...config.textColors, [field]: value },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Design</h3>
      </div>

      {/* Background Type */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Background Type</label>
        <select
          value={config.backgroundType}
          onChange={(e) => handleChange('backgroundType', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
          <option value="color">Color</option>
          <option value="gradient">Gradient</option>
        </select>
      </div>

      {/* Background URL */}
      {config.backgroundType === 'image' || config.backgroundType === 'video' ? (
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">
            {config.backgroundType === 'video' ? 'Video URL' : 'Background URL'}
          </label>
          <div className="relative">
            <Image className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              value={config.backgroundType === 'video' ? config.backgroundVideoUrl : config.backgroundUrl}
              onChange={(e) => handleChange(config.backgroundType === 'video' ? 'backgroundVideoUrl' : 'backgroundUrl', e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
              placeholder="/Images/background.jpg"
            />
          </div>
        </div>
      ) : null}

      {/* Background Color */}
      {config.backgroundType === 'color' ? (
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={config.backgroundColor}
              onChange={(e) => handleChange('backgroundColor', e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
              placeholder="#020102"
            />
          </div>
        </div>
      ) : null}

      {/* Gradient Colors */}
      {config.backgroundType === 'gradient' ? (
        <>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/40">Gradient Start</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.gradientStart}
                onChange={(e) => handleChange('gradientStart', e.target.value)}
                className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={config.gradientStart}
                onChange={(e) => handleChange('gradientStart', e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
                placeholder="#020102"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-mono uppercase tracking-wider text-white/40">Gradient End</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={config.gradientEnd}
                onChange={(e) => handleChange('gradientEnd', e.target.value)}
                className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
              />
              <input
                type="text"
                value={config.gradientEnd}
                onChange={(e) => handleChange('gradientEnd', e.target.value)}
                className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
                placeholder="#1a0a0a"
              />
            </div>
          </div>
        </>
      ) : null}

      {/* Primary Color */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Primary Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={config.primaryColor}
            onChange={(e) => handleChange('primaryColor', e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="#c9933a"
          />
        </div>
      </div>

      {/* Secondary Color */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Secondary Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
            className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={config.secondaryColor}
            onChange={(e) => handleChange('secondaryColor', e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="#eed078"
          />
        </div>
      </div>

      {/* Accent Color */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Accent Color</label>
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={config.accentColor}
            onChange={(e) => handleChange('accentColor', e.target.value)}
            className="w-12 h-12 rounded-lg border border-white/10 bg-transparent cursor-pointer"
          />
          <input
            type="text"
            value={config.accentColor}
            onChange={(e) => handleChange('accentColor', e.target.value)}
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="#f59e0b"
          />
        </div>
      </div>

      {/* Font Family */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Font Family</label>
        <select
          value={config.fontFamily}
          onChange={(e) => handleChange('fontFamily', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-amber-500/50 focus:outline-none transition-all"
        >
          <option value="Outfit">Outfit</option>
          <option value="Inter">Inter</option>
          <option value="Geist Sans">Geist Sans</option>
          <option value="Space Grotesk">Space Grotesk</option>
        </select>
      </div>

      {/* Font Sizes */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Font Sizes</label>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Title</label>
          <input
            type="text"
            value={config.fontSize.heroTitle}
            onChange={(e) => handleFontSizeChange('heroTitle', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="4rem"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Subtitle</label>
          <input
            type="text"
            value={config.fontSize.heroSubtitle}
            onChange={(e) => handleFontSizeChange('heroSubtitle', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="1.5rem"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Slogan</label>
          <input
            type="text"
            value={config.fontSize.heroSlogan}
            onChange={(e) => handleFontSizeChange('heroSlogan', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="1rem"
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Description</label>
          <input
            type="text"
            value={config.fontSize.heroDescription}
            onChange={(e) => handleFontSizeChange('heroDescription', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="1rem"
          />
        </div>
      </div>

      {/* Text Colors */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-white/40" />
          <label className="text-xs font-mono uppercase tracking-wider text-white/40">Text Colors</label>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Title</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.textColors.heroTitle}
              onChange={(e) => handleTextColorChange('heroTitle', e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={config.textColors.heroTitle}
              onChange={(e) => handleTextColorChange('heroTitle', e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all"
              placeholder="#ffffff"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Subtitle</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.textColors.heroSubtitle}
              onChange={(e) => handleTextColorChange('heroSubtitle', e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={config.textColors.heroSubtitle}
              onChange={(e) => handleTextColorChange('heroSubtitle', e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all"
              placeholder="#ffffff"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Hero Slogan</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.textColors.heroSlogan}
              onChange={(e) => handleTextColorChange('heroSlogan', e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={config.textColors.heroSlogan}
              onChange={(e) => handleTextColorChange('heroSlogan', e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all"
              placeholder="#ffffff"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-xs font-mono uppercase tracking-wider text-white/30">Description</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.textColors.heroDescription}
              onChange={(e) => handleTextColorChange('heroDescription', e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer"
            />
            <input
              type="text"
              value={config.textColors.heroDescription}
              onChange={(e) => handleTextColorChange('heroDescription', e.target.value)}
              className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-amber-500/50 focus:outline-none transition-all"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
