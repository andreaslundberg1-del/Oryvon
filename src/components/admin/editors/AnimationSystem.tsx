"use client";

import React, { useState } from 'react';
import { 
  ArrowUp, ArrowRight, ArrowDown, ArrowLeft, ZoomIn, RotateCw, 
  Sparkles, Clock, Play, ChevronDown, Layers
} from 'lucide-react';

export interface AnimationSettings {
  type: 'fade' | 'slide' | 'zoom' | 'rotate' | 'floating' | 'none';
  direction: 'up' | 'down' | 'left' | 'right' | 'none';
  duration: number;
  delay: number;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'cubic-bezier';
  scrollTriggered: boolean;
  infinite: boolean;
  floating: {
    enabled: boolean;
    amplitude: number;
    speed: number;
  };
}

const defaultSettings: AnimationSettings = {
  type: 'fade',
  direction: 'up',
  duration: 500,
  delay: 0,
  easing: 'ease-out',
  scrollTriggered: false,
  infinite: false,
  floating: {
    enabled: false,
    amplitude: 10,
    speed: 2,
  },
};

interface AnimationSystemProps {
  settings: AnimationSettings;
  onChange: (settings: AnimationSettings) => void;
  onClose?: () => void;
}

export function AnimationSystem({ settings, onChange, onClose }: AnimationSystemProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'floating'>('basic');

  const handleSettingChange = <K extends keyof AnimationSettings>(key: K, value: AnimationSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const handleFloatingChange = <K extends keyof AnimationSettings['floating']>(key: K, value: AnimationSettings['floating'][K]) => {
    onChange({ ...settings, floating: { ...settings.floating, [key]: value } });
  };

  const getAnimationPreview = () => {
    const style: React.CSSProperties = {
      animationDuration: `${settings.duration}ms`,
      animationDelay: `${settings.delay}ms`,
      animationTimingFunction: settings.easing,
      animationIterationCount: settings.infinite ? 'infinite' : '1',
    };

    let animationName = '';
    switch (settings.type) {
      case 'fade':
        animationName = 'fadeIn';
        break;
      case 'slide':
        animationName = `slide${settings.direction.charAt(0).toUpperCase() + settings.direction.slice(1)}`;
        break;
      case 'zoom':
        animationName = 'zoomIn';
        break;
      case 'rotate':
        animationName = 'rotateIn';
        break;
      case 'floating':
        animationName = 'floating';
        break;
      case 'none':
        animationName = '';
        break;
    }

    if (animationName) {
      style.animationName = animationName;
    }

    if (settings.floating.enabled) {
      style.animationName = 'floating';
      style.animationDuration = `${settings.floating.speed}s`;
      style.animationIterationCount = 'infinite';
    }

    return style;
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60">
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Animation System</h3>
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
      <div className="flex gap-1 p-2 border-b border-white/10 bg-black/60">
        {(['basic', 'advanced', 'floating'] as const).map((tab) => (
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
          <div
            className="w-32 h-32 bg-amber-500/20 border-2 border-amber-500/50 rounded-lg flex items-center justify-center"
            style={getAnimationPreview()}
          >
            <span className="text-amber-400 font-mono text-sm uppercase tracking-wider">Preview</span>
          </div>
        </div>

        {/* Controls */}
        <div className="w-80 p-4 border-l border-white/10 bg-black/60 overflow-y-auto max-h-[500px]">
          {activeTab === 'basic' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Animation Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['fade', 'slide', 'zoom', 'rotate', 'floating', 'none'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => handleSettingChange('type', type)}
                      className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
                        settings.type === type
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {type === 'fade' && <Sparkles size={20} />}
                      {type === 'slide' && <ArrowUp size={20} />}
                      {type === 'zoom' && <ZoomIn size={20} />}
                      {type === 'rotate' && <RotateCw size={20} />}
                      {type === 'floating' && <Layers size={20} />}
                      {type === 'none' && <Play size={20} />}
                      <span className="text-[10px] font-mono uppercase tracking-wider">{type}</span>
                    </button>
                  ))}
                </div>
              </div>

              {settings.type === 'slide' && (
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Direction</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['up', 'down', 'left', 'right'] as const).map((direction) => (
                      <button
                        key={direction}
                        onClick={() => handleSettingChange('direction', direction)}
                        className={`p-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
                          settings.direction === direction
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {direction === 'up' && <ArrowUp size={16} />}
                        {direction === 'down' && <ArrowDown size={16} />}
                        {direction === 'left' && <ArrowLeft size={16} />}
                        {direction === 'right' && <ArrowRight size={16} />}
                        <span className="text-[10px] font-mono uppercase tracking-wider">{direction}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Clock size={12} /> Duration
                  </label>
                  <span className="text-xs text-white/60 font-mono">{settings.duration}ms</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="3000"
                  step="50"
                  value={settings.duration}
                  onChange={(e) => handleSettingChange('duration', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Delay</label>
                  <span className="text-xs text-white/60 font-mono">{settings.delay}ms</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  step="50"
                  value={settings.delay}
                  onChange={(e) => handleSettingChange('delay', parseInt(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Easing</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['linear', 'ease-in', 'ease-out', 'ease-in-out', 'cubic-bezier'] as const).map((easing) => (
                    <button
                      key={easing}
                      onClick={() => handleSettingChange('easing', easing)}
                      className={`p-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                        settings.easing === easing
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {easing}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Scroll Triggered</label>
                <button
                  onClick={() => handleSettingChange('scrollTriggered', !settings.scrollTriggered)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.scrollTriggered ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                      settings.scrollTriggered ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Infinite Loop</label>
                <button
                  onClick={() => handleSettingChange('infinite', !settings.infinite)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.infinite ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                      settings.infinite ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'floating' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <Layers size={12} /> Enable Floating
                </label>
                <button
                  onClick={() => handleFloatingChange('enabled', !settings.floating.enabled)}
                  className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    settings.floating.enabled ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                      settings.floating.enabled ? 'translate-x-6' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>

              {settings.floating.enabled && (
                <div className="space-y-3 pt-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Amplitude</label>
                      <span className="text-xs text-white/60 font-mono">{settings.floating.amplitude}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={settings.floating.amplitude}
                      onChange={(e) => handleFloatingChange('amplitude', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Speed</label>
                      <span className="text-xs text-white/60 font-mono">{settings.floating.speed}s</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="5"
                      step="0.1"
                      value={settings.floating.speed}
                      onChange={(e) => handleFloatingChange('speed', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Animation Keyframes */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes slideLeft {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideRight {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes rotateIn {
          from { transform: rotate(-10deg); opacity: 0; }
          to { transform: rotate(0deg); opacity: 1; }
        }
        @keyframes floating {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-${settings.floating.amplitude}px); }
        }
      `}</style>
    </div>
  );
}
