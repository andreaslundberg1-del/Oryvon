"use client";

import React, { useState } from 'react';
import { 
  Crop, Sun, Contrast, Layers, Image as ImageIcon, 
  Sparkles, RotateCw, Maximize2, Droplet, Palette, Upload, Circle
} from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  onChange: (imageUrl: string, settings: ImageSettings) => void;
  onClose?: () => void;
}

export interface ImageSettings {
  blur: number;
  brightness: number;
  contrast: number;
  saturation: number;
  hue: number;
  grayscale: number;
  sepia: number;
  rounded: number;
  glow: {
    enabled: boolean;
    color: string;
    intensity: string;
  };
  filter: 'none' | 'vintage' | 'cold' | 'warm' | 'dramatic' | 'b&w';
}

const defaultSettings: ImageSettings = {
  blur: 0,
  brightness: 100,
  contrast: 100,
  saturation: 100,
  hue: 0,
  grayscale: 0,
  sepia: 0,
  rounded: 0,
  glow: {
    enabled: false,
    color: '#f59e0b',
    intensity: '0 0 20px',
  },
  filter: 'none',
};

export function ImageEditor({ imageUrl, onChange, onClose }: ImageEditorProps) {
  const [settings, setSettings] = useState<ImageSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'adjust' | 'effects' | 'style'>('adjust');
  const [showGlowSettings, setShowGlowSettings] = useState(false);

  const handleSettingChange = <K extends keyof ImageSettings>(key: K, value: ImageSettings[K]) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    onChange(imageUrl, newSettings);
  };

  const handleGlowChange = (key: keyof ImageSettings['glow'], value: any) => {
    const newSettings = { ...settings, glow: { ...settings.glow, [key]: value } };
    setSettings(newSettings);
    onChange(imageUrl, newSettings);
  };

  const applyFilter = (filter: ImageSettings['filter']) => {
    const filterSettings: Partial<ImageSettings> = { filter };
    
    switch (filter) {
      case 'vintage':
        filterSettings.sepia = 30;
        filterSettings.contrast = 90;
        filterSettings.brightness = 95;
        break;
      case 'cold':
        filterSettings.hue = 180;
        filterSettings.saturation = 80;
        break;
      case 'warm':
        filterSettings.hue = 20;
        filterSettings.saturation = 110;
        filterSettings.brightness = 105;
        break;
      case 'dramatic':
        filterSettings.contrast = 130;
        filterSettings.saturation = 80;
        filterSettings.brightness = 90;
        break;
      case 'b&w':
        filterSettings.grayscale = 100;
        filterSettings.contrast = 110;
        break;
      case 'none':
        filterSettings.sepia = 0;
        filterSettings.hue = 0;
        filterSettings.saturation = 100;
        filterSettings.brightness = 100;
        filterSettings.contrast = 100;
        filterSettings.grayscale = 0;
        break;
    }

    const newSettings = { ...settings, ...filterSettings };
    setSettings(newSettings);
    onChange(imageUrl, newSettings);
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    onChange(imageUrl, defaultSettings);
  };

  const getImageStyle = () => {
    return {
      filter: `
        blur(${settings.blur}px) 
        brightness(${settings.brightness}%) 
        contrast(${settings.contrast}%) 
        saturate(${settings.saturation}%) 
        hue-rotate(${settings.hue}deg) 
        grayscale(${settings.grayscale}%) 
        sepia(${settings.sepia}%)
      `,
      borderRadius: `${settings.rounded}px`,
      ...(settings.glow.enabled && {
        boxShadow: `${settings.glow.intensity} ${settings.glow.color}`,
      }),
    };
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60">
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Image Editor</h3>
        <div className="flex gap-2">
          <button
            onClick={resetSettings}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 text-xs font-mono uppercase tracking-wider transition-all"
          >
            Reset
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-xs font-mono uppercase tracking-wider transition-all"
            >
              Done
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-2 border-b border-white/10 bg-black/60">
        {(['adjust', 'effects', 'style'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all ${
              activeTab === tab
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex">
        {/* Preview */}
        <div className="flex-1 p-6 flex items-center justify-center bg-black/80 min-h-[400px]">
          <div className="relative">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-full max-h-[300px] object-contain"
              style={getImageStyle()}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="w-80 p-4 border-l border-white/10 bg-black/60 overflow-y-auto max-h-[500px]">
          {activeTab === 'adjust' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Circle size={12} /> Blur
                  </label>
                  <span className="text-xs text-white/60 font-mono">{settings.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.1"
                  value={settings.blur}
                  onChange={(e) => handleSettingChange('blur', parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Sun size={12} /> Brightness
                  </label>
                  <span className="text-xs text-white/60 font-mono">{settings.brightness}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={settings.brightness}
                  onChange={(e) => handleSettingChange('brightness', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Contrast size={12} /> Contrast
                  </label>
                  <span className="text-xs text-white/60 font-mono">{settings.contrast}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={settings.contrast}
                  onChange={(e) => handleSettingChange('contrast', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Droplet size={12} /> Saturation
                  </label>
                  <span className="text-xs text-white/60 font-mono">{settings.saturation}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200"
                  step="1"
                  value={settings.saturation}
                  onChange={(e) => handleSettingChange('saturation', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Palette size={12} /> Hue
                  </label>
                  <span className="text-xs text-white/60 font-mono">{settings.hue}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="1"
                  value={settings.hue}
                  onChange={(e) => handleSettingChange('hue', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Grayscale</label>
                  <span className="text-xs text-white/60 font-mono">{settings.grayscale}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={settings.grayscale}
                  onChange={(e) => handleSettingChange('grayscale', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Sepia</label>
                  <span className="text-xs text-white/60 font-mono">{settings.sepia}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={settings.sepia}
                  onChange={(e) => handleSettingChange('sepia', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <Maximize2 size={12} /> Rounded Corners
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={settings.rounded}
                  onChange={(e) => handleSettingChange('rounded', parseInt(e.target.value))}
                  className="w-full"
                />
                <span className="text-xs text-white/60 font-mono">{settings.rounded}px</span>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <Sparkles size={12} /> Glow Effect
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleGlowChange('enabled', !settings.glow.enabled)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      settings.glow.enabled ? 'bg-amber-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                        settings.glow.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setShowGlowSettings(!showGlowSettings)}
                    className="text-white/40 hover:text-white/70"
                  >
                    <Palette size={16} />
                  </button>
                </div>

                {showGlowSettings && settings.glow.enabled && (
                  <div className="space-y-3 mt-3 p-3 bg-black/40 rounded-lg">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Color</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={settings.glow.color}
                          onChange={(e) => handleGlowChange('color', e.target.value)}
                          className="w-10 h-10 rounded cursor-pointer border-0"
                        />
                        <input
                          type="text"
                          value={settings.glow.color}
                          onChange={(e) => handleGlowChange('color', e.target.value)}
                          className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-white text-xs"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Intensity</label>
                      <input
                        type="text"
                        value={settings.glow.intensity}
                        onChange={(e) => handleGlowChange('intensity', e.target.value)}
                        className="w-full bg-black/60 border border-white/10 rounded px-3 py-2 text-white text-xs"
                        placeholder="0 0 20px"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-3">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40">Presets</label>
              <div className="grid grid-cols-2 gap-2">
                {(['none', 'vintage', 'cold', 'warm', 'dramatic', 'b&w'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => applyFilter(filter)}
                    className={`px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                      settings.filter === filter
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-white/10">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 mb-2 block">Upload New Image</label>
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded-lg cursor-pointer transition-all text-white/60 hover:text-amber-400 text-xs font-mono uppercase tracking-wider">
                  <Upload size={14} />
                  Choose File
                  <input type="file" accept="image/*" className="hidden" />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
