"use client";

import React, { useState } from 'react';
import { 
  Video, Layers, Sparkles, Image as ImageIcon, 
  Palette, Upload, Play, Pause, ChevronDown, Sun, Mountain, Droplet
} from 'lucide-react';

export interface BackgroundSettings {
  type: 'image' | 'video' | 'gradient' | 'particle' | 'parallax' | 'layered';
  imageUrl?: string;
  videoUrl?: string;
  videoAutoplay?: boolean;
  videoMuted?: boolean;
  videoLoop?: boolean;
  gradient: {
    type: 'linear' | 'radial' | 'conic';
    colors: string[];
    angle?: number;
  };
  particle: {
    enabled: boolean;
    count: number;
    color: string;
    size: number;
    speed: number;
  };
  parallax: {
    enabled: boolean;
    intensity: number;
  };
  overlay: {
    enabled: boolean;
    color: string;
    opacity: number;
  };
  blur: number;
  brightness: number;
}

const defaultSettings: BackgroundSettings = {
  type: 'image',
  gradient: {
    type: 'linear',
    colors: ['#020102', '#1a0f0a'],
    angle: 135,
  },
  particle: {
    enabled: false,
    count: 50,
    color: '#f59e0b',
    size: 2,
    speed: 1,
  },
  parallax: {
    enabled: false,
    intensity: 0.5,
  },
  overlay: {
    enabled: false,
    color: '#000000',
    opacity: 0.5,
  },
  blur: 0,
  brightness: 100,
};

interface BackgroundEditorProps {
  settings: BackgroundSettings;
  onChange: (settings: BackgroundSettings) => void;
  onClose?: () => void;
}

export function BackgroundEditor({ settings, onChange, onClose }: BackgroundEditorProps) {
  const [activeTab, setActiveTab] = useState<'type' | 'gradient' | 'particle' | 'parallax' | 'overlay' | 'adjust'>('type');
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleSettingChange = <K extends keyof BackgroundSettings>(key: K, value: BackgroundSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const handleGradientChange = <K extends keyof BackgroundSettings['gradient']>(key: K, value: BackgroundSettings['gradient'][K]) => {
    onChange({ ...settings, gradient: { ...settings.gradient, [key]: value } });
  };

  const handleParticleChange = <K extends keyof BackgroundSettings['particle']>(key: K, value: BackgroundSettings['particle'][K]) => {
    onChange({ ...settings, particle: { ...settings.particle, [key]: value } });
  };

  const handleParallaxChange = <K extends keyof BackgroundSettings['parallax']>(key: K, value: BackgroundSettings['parallax'][K]) => {
    onChange({ ...settings, parallax: { ...settings.parallax, [key]: value } });
  };

  const handleOverlayChange = <K extends keyof BackgroundSettings['overlay']>(key: K, value: BackgroundSettings['overlay'][K]) => {
    onChange({ ...settings, overlay: { ...settings.overlay, [key]: value } });
  };

  const addGradientColor = () => {
    handleGradientChange('colors', [...settings.gradient.colors, '#ffffff']);
  };

  const removeGradientColor = (index: number) => {
    const newColors = settings.gradient.colors.filter((_, i) => i !== index);
    handleGradientChange('colors', newColors);
  };

  const updateGradientColor = (index: number, color: string) => {
    const newColors = [...settings.gradient.colors];
    newColors[index] = color;
    handleGradientChange('colors', newColors);
  };

  const getBackgroundPreview = () => {
    switch (settings.type) {
      case 'gradient':
        if (settings.gradient.type === 'linear') {
          return `linear-gradient(${settings.gradient.angle}deg, ${settings.gradient.colors.join(', ')})`;
        } else if (settings.gradient.type === 'radial') {
          return `radial-gradient(circle, ${settings.gradient.colors.join(', ')})`;
        } else {
          return `conic-gradient(from 0deg, ${settings.gradient.colors.join(', ')})`;
        }
      case 'image':
        return settings.imageUrl || 'transparent';
      case 'video':
        return 'transparent';
      default:
        return '#020102';
    }
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60">
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Background Editor</h3>
        <div className="flex gap-2">
          <button
            onClick={() => onChange(defaultSettings)}
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
      <div className="flex gap-1 p-2 border-b border-white/10 bg-black/60 overflow-x-auto">
        {(['type', 'gradient', 'particle', 'parallax', 'overlay', 'adjust'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all whitespace-nowrap ${
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
          <div
            className="w-full h-64 rounded-lg relative overflow-hidden"
            style={{
              background: getBackgroundPreview(),
              filter: `blur(${settings.blur}px) brightness(${settings.brightness}%)`,
            }}
          >
            {settings.overlay.enabled && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: settings.overlay.color,
                  opacity: settings.overlay.opacity,
                }}
              />
            )}
            {settings.type === 'video' && settings.videoUrl && (
              <video
                className="w-full h-full object-cover"
                autoPlay={settings.videoAutoplay}
                muted={settings.videoMuted}
                loop={settings.videoLoop}
                src={settings.videoUrl}
              />
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="w-80 p-4 border-l border-white/10 bg-black/60 overflow-y-auto max-h-[500px]">
          {activeTab === 'type' && (
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40">Background Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(['image', 'video', 'gradient', 'particle', 'parallax', 'layered'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSettingChange('type', type)}
                    className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      settings.type === type
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {type === 'image' && <ImageIcon size={20} />}
                    {type === 'video' && <Video size={20} />}
                    {type === 'gradient' && <Palette size={20} />}
                    {type === 'particle' && <Sparkles size={20} />}
                    {type === 'parallax' && <Layers size={20} />}
                    {type === 'layered' && <Mountain size={20} />}
                    <span className="text-[10px] font-mono uppercase tracking-wider">{type}</span>
                  </button>
                ))}
              </div>

              {settings.type === 'image' && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Image URL</label>
                  <input
                    type="text"
                    value={settings.imageUrl || ''}
                    onChange={(e) => handleSettingChange('imageUrl', e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                    placeholder="/Images/background.jpg"
                  />
                  <label className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded-lg cursor-pointer transition-all text-white/60 hover:text-amber-400 text-xs font-mono uppercase tracking-wider">
                    <Upload size={14} />
                    Upload Image
                    <input type="file" accept="image/*" className="hidden" />
                  </label>
                </div>
              )}

              {settings.type === 'video' && (
                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/40">Video URL</label>
                    <input
                      type="text"
                      value={settings.videoUrl || ''}
                      onChange={(e) => handleSettingChange('videoUrl', e.target.value)}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                      placeholder="/Videos/background.mp4"
                    />
                  </div>
                  <label className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded-lg cursor-pointer transition-all text-white/60 hover:text-amber-400 text-xs font-mono uppercase tracking-wider">
                    <Upload size={14} />
                    Upload Video
                    <input type="file" accept="video/*" className="hidden" />
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Autoplay</label>
                      <button
                        onClick={() => handleSettingChange('videoAutoplay', !settings.videoAutoplay)}
                        className={`w-10 h-5 rounded-full transition-all duration-300 ${
                          settings.videoAutoplay ? 'bg-amber-500' : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                            settings.videoAutoplay ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Muted</label>
                      <button
                        onClick={() => handleSettingChange('videoMuted', !settings.videoMuted)}
                        className={`w-10 h-5 rounded-full transition-all duration-300 ${
                          settings.videoMuted ? 'bg-amber-500' : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                            settings.videoMuted ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Loop</label>
                      <button
                        onClick={() => handleSettingChange('videoLoop', !settings.videoLoop)}
                        className={`w-10 h-5 rounded-full transition-all duration-300 ${
                          settings.videoLoop ? 'bg-amber-500' : 'bg-white/10'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                            settings.videoLoop ? 'translate-x-5' : 'translate-x-0.5'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'gradient' && (
            <div className="space-y-4">
              <label className="text-xs font-mono uppercase tracking-wider text-white/40">Gradient Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'radial', 'conic'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleGradientChange('type', type)}
                    className={`p-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                      settings.gradient.type === type
                        ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {settings.gradient.type === 'linear' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/40">Angle</label>
                    <span className="text-xs text-white/60 font-mono">{settings.gradient.angle}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="1"
                    value={settings.gradient.angle || 0}
                    onChange={(e) => handleGradientChange('angle', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Colors</label>
                  <button
                    onClick={addGradientColor}
                    className="text-amber-400 hover:text-amber-300 text-xs font-mono uppercase tracking-wider"
                  >
                    + Add
                  </button>
                </div>
                <div className="space-y-2">
                  {settings.gradient.colors.map((color, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="color"
                        value={color}
                        onChange={(e) => updateGradientColor(index, e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => updateGradientColor(index, e.target.value)}
                        className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-white text-xs"
                      />
                      <button
                        onClick={() => removeGradientColor(index)}
                        className="text-red-400/60 hover:text-red-400"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'particle' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <Sparkles size={12} /> Enable Particles
                </label>
                <button
                  onClick={() => handleParticleChange('enabled', !settings.particle.enabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.particle.enabled ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                      settings.particle.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {settings.particle.enabled && (
                <div className="space-y-3 pt-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Count</label>
                      <span className="text-xs text-white/60 font-mono">{settings.particle.count}</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="200"
                      step="10"
                      value={settings.particle.count}
                      onChange={(e) => handleParticleChange('count', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/30">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.particle.color}
                        onChange={(e) => handleParticleChange('color', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={settings.particle.color}
                        onChange={(e) => handleParticleChange('color', e.target.value)}
                        className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Size</label>
                      <span className="text-xs text-white/60 font-mono">{settings.particle.size}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={settings.particle.size}
                      onChange={(e) => handleParticleChange('size', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Speed</label>
                      <span className="text-xs text-white/60 font-mono">{settings.particle.speed}x</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="3"
                      step="0.1"
                      value={settings.particle.speed}
                      onChange={(e) => handleParticleChange('speed', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'parallax' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <Layers size={12} /> Enable Parallax
                </label>
                <button
                  onClick={() => handleParallaxChange('enabled', !settings.parallax.enabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.parallax.enabled ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                      settings.parallax.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {settings.parallax.enabled && (
                <div className="space-y-3 pt-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Intensity</label>
                      <span className="text-xs text-white/60 font-mono">{settings.parallax.intensity}</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2"
                      step="0.1"
                      value={settings.parallax.intensity}
                      onChange={(e) => handleParallaxChange('intensity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'overlay' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Enable Overlay</label>
                <button
                  onClick={() => handleOverlayChange('enabled', !settings.overlay.enabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.overlay.enabled ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                      settings.overlay.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {settings.overlay.enabled && (
                <div className="space-y-3 pt-3">
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/30">Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={settings.overlay.color}
                        onChange={(e) => handleOverlayChange('color', e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0"
                      />
                      <input
                        type="text"
                        value={settings.overlay.color}
                        onChange={(e) => handleOverlayChange('color', e.target.value)}
                        className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-white text-xs"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Opacity</label>
                      <span className="text-xs text-white/60 font-mono">{Math.round(settings.overlay.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={settings.overlay.opacity}
                      onChange={(e) => handleOverlayChange('opacity', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'adjust' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Droplet size={12} /> Blur
                  </label>
                  <span className="text-xs text-white/60 font-mono">{settings.blur}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="20"
                  step="1"
                  value={settings.blur}
                  onChange={(e) => handleSettingChange('blur', parseInt(e.target.value))}
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
                  step="5"
                  value={settings.brightness}
                  onChange={(e) => handleSettingChange('brightness', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
