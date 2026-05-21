"use client";

import React from 'react';
import { Type, Link as LinkIcon, Image as ImageIcon, ToggleLeft, ToggleRight } from 'lucide-react';
import { HomepageContentConfig } from '@/lib/admin-config';

interface HomepageContentSectionProps {
  config: HomepageContentConfig;
  onChange: (config: HomepageContentConfig) => void;
}

export function HomepageContentSection({ config, onChange }: HomepageContentSectionProps) {
  const handleChange = (field: keyof HomepageContentConfig, value: any) => {
    onChange({ ...config, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <Type className="w-5 h-5 text-amber-500" />
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Content</h3>
      </div>

      {/* Hero Title */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Title</label>
        <input
          type="text"
          value={config.heroTitle}
          onChange={(e) => handleChange('heroTitle', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="ORYVON"
        />
      </div>

      {/* Hero Subtitle */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Subtitle</label>
        <input
          type="text"
          value={config.heroSubtitle}
          onChange={(e) => handleChange('heroSubtitle', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="Worlds Evolve. Stories Endure."
        />
      </div>

      {/* Hero Slogan */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Hero Slogan</label>
        <input
          type="text"
          value={config.heroSlogan}
          onChange={(e) => handleChange('heroSlogan', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="Choose a realm and open the archive"
        />
      </div>

      {/* Hero Button Text */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Button Text</label>
        <input
          type="text"
          value={config.heroButtonText}
          onChange={(e) => handleChange('heroButtonText', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
          placeholder="Explore"
        />
      </div>

      {/* Hero Button Link */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Button Link</label>
        <div className="relative">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={config.heroButtonLink}
            onChange={(e) => handleChange('heroButtonLink', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="/explore"
          />
        </div>
      </div>

      {/* Hero Description */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Description</label>
        <textarea
          value={config.heroDescription}
          onChange={(e) => handleChange('heroDescription', e.target.value)}
          className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all min-h-[100px] resize-none"
          placeholder="Optional description..."
        />
      </div>

      {/* Logo URL */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Logo URL</label>
        <div className="relative">
          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={config.logoUrl}
            onChange={(e) => handleChange('logoUrl', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="/logo.png"
          />
        </div>
      </div>

      {/* Symbol URL */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Symbol URL</label>
        <div className="relative">
          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            value={config.symbolUrl}
            onChange={(e) => handleChange('symbolUrl', e.target.value)}
            className="w-full bg-black/40 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all"
            placeholder="/symbol.png"
          />
        </div>
      </div>

      {/* Show Logo Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Show Logo</label>
        <button
          onClick={() => handleChange('showLogo', !config.showLogo)}
          className={`w-12 h-6 rounded-full transition-all duration-300 ${
            config.showLogo ? 'bg-amber-500' : 'bg-white/10'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
              config.showLogo ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Show Symbol Toggle */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Show Symbol</label>
        <button
          onClick={() => handleChange('showSymbol', !config.showSymbol)}
          className={`w-12 h-6 rounded-full transition-all duration-300 ${
            config.showSymbol ? 'bg-amber-500' : 'bg-white/10'
          }`}
        >
          <div
            className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
              config.showSymbol ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
