"use client";

import React, { useState } from 'react';
import { 
  MousePointer2, Sparkles, Palette, Layers, ChevronDown, 
  Type, Square, Circle, Link as LinkIcon, Zap
} from 'lucide-react';

export interface ButtonSettings {
  text: string;
  variant: 'primary' | 'secondary' | 'ghost' | 'outline';
  size: 'sm' | 'md' | 'lg' | 'xl';
  borderRadius: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverEffect: 'none' | 'lift' | 'glow' | 'scale' | 'slide' | 'border-glow';
  glow: {
    enabled: boolean;
    color: string;
    intensity: string;
  };
  icon?: string;
  iconPosition: 'left' | 'right';
  animation: {
    enabled: boolean;
    type: 'pulse' | 'bounce' | 'shake' | 'spin';
    duration: number;
  };
  clickAnimation: {
    enabled: boolean;
    type: 'ripple' | 'shrink' | 'flash';
  };
}

const defaultSettings: ButtonSettings = {
  text: 'Button',
  variant: 'primary',
  size: 'md',
  borderRadius: '0.5rem',
  backgroundColor: '#f59e0b',
  textColor: '#000000',
  borderColor: '#f59e0b',
  hoverEffect: 'glow',
  glow: {
    enabled: true,
    color: '#f59e0b',
    intensity: '0 0 20px',
  },
  iconPosition: 'left',
  animation: {
    enabled: false,
    type: 'pulse',
    duration: 1000,
  },
  clickAnimation: {
    enabled: false,
    type: 'ripple',
  },
};

interface ButtonEditorProps {
  settings: ButtonSettings;
  onChange: (settings: ButtonSettings) => void;
  onClose?: () => void;
}

export function ButtonEditor({ settings, onChange, onClose }: ButtonEditorProps) {
  const [activeTab, setActiveTab] = useState<'design' | 'style' | 'effects' | 'animation'>('design');

  const handleSettingChange = <K extends keyof ButtonSettings>(key: K, value: ButtonSettings[K]) => {
    onChange({ ...settings, [key]: value });
  };

  const handleGlowChange = <K extends keyof ButtonSettings['glow']>(key: K, value: ButtonSettings['glow'][K]) => {
    onChange({ ...settings, glow: { ...settings.glow, [key]: value } });
  };

  const handleAnimationChange = <K extends keyof ButtonSettings['animation']>(key: K, value: ButtonSettings['animation'][K]) => {
    onChange({ ...settings, animation: { ...settings.animation, [key]: value } });
  };

  const handleClickAnimationChange = <K extends keyof ButtonSettings['clickAnimation']>(key: K, value: ButtonSettings['clickAnimation'][K]) => {
    onChange({ ...settings, clickAnimation: { ...settings.clickAnimation, [key]: value } });
  };

  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: settings.borderRadius,
      backgroundColor: settings.backgroundColor,
      color: settings.textColor,
      borderColor: settings.borderColor,
      ...(settings.glow.enabled && {
        boxShadow: `${settings.glow.intensity} ${settings.glow.color}`,
      }),
    };

    const sizeStyles = {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    };

    const variantStyles = {
      primary: 'border-2',
      secondary: 'border-2',
      ghost: 'border-2 border-transparent',
      outline: 'border-2 bg-transparent',
    };

    return { ...baseStyle, className: `${sizeStyles[settings.size]} ${variantStyles[settings.variant]}` };
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/60">
        <h3 className="text-sm font-mono uppercase tracking-widest text-white/80">Button Editor</h3>
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
        {(['design', 'style', 'effects', 'animation'] as const).map((tab) => (
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
          <button
            className="font-mono uppercase tracking-wider transition-all"
            style={{
              borderRadius: settings.borderRadius,
              backgroundColor: settings.variant === 'outline' ? 'transparent' : settings.backgroundColor,
              color: settings.textColor,
              borderColor: settings.borderColor,
              borderWidth: '2px',
              borderStyle: 'solid',
              ...(settings.glow.enabled && {
                boxShadow: `${settings.glow.intensity} ${settings.glow.color}`,
              }),
            }}
          >
            {settings.icon && settings.iconPosition === 'left' && <span className="mr-2">{settings.icon}</span>}
            {settings.text}
            {settings.icon && settings.iconPosition === 'right' && <span className="ml-2">{settings.icon}</span>}
          </button>
        </div>

        {/* Controls */}
        <div className="w-80 p-4 border-l border-white/10 bg-black/60 overflow-y-auto max-h-[500px]">
          {activeTab === 'design' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Button Text</label>
                <input
                  type="text"
                  value={settings.text}
                  onChange={(e) => handleSettingChange('text', e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                  placeholder="Button"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Variant</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['primary', 'secondary', 'ghost', 'outline'] as const).map((variant) => (
                    <button
                      key={variant}
                      onClick={() => handleSettingChange('variant', variant)}
                      className={`p-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                        settings.variant === variant
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Size</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                    <button
                      key={size}
                      onClick={() => handleSettingChange('size', size)}
                      className={`p-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                        settings.size === size
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40">Border Radius</label>
                <input
                  type="text"
                  value={settings.borderRadius}
                  onChange={(e) => handleSettingChange('borderRadius', e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                  placeholder="0.5rem"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <LinkIcon size={12} /> Icon
                </label>
                <input
                  type="text"
                  value={settings.icon || ''}
                  onChange={(e) => handleSettingChange('icon', e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-white text-xs"
                  placeholder="→"
                />
              </div>

              {settings.icon && (
                <div className="space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Icon Position</label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['left', 'right'] as const).map((position) => (
                      <button
                        key={position}
                        onClick={() => handleSettingChange('iconPosition', position)}
                        className={`p-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                          settings.iconPosition === position
                            ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                            : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        {position}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <Palette size={12} /> Background Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.backgroundColor}
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={settings.backgroundColor}
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                    className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <Type size={12} /> Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.textColor}
                    onChange={(e) => handleSettingChange('textColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={settings.textColor}
                    onChange={(e) => handleSettingChange('textColor', e.target.value)}
                    className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <Square size={12} /> Border Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={settings.borderColor}
                    onChange={(e) => handleSettingChange('borderColor', e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border-0"
                  />
                  <input
                    type="text"
                    value={settings.borderColor}
                    onChange={(e) => handleSettingChange('borderColor', e.target.value)}
                    className="flex-1 bg-black/60 border border-white/10 rounded px-3 py-2 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'effects' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                  <MousePointer2 size={12} /> Hover Effect
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['none', 'lift', 'glow', 'scale', 'slide', 'border-glow'] as const).map((effect) => (
                    <button
                      key={effect}
                      onClick={() => handleSettingChange('hoverEffect', effect)}
                      className={`p-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                        settings.hoverEffect === effect
                          ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                          : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                      }`}
                    >
                      {effect}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Sparkles size={12} /> Glow Effect
                  </label>
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
                </div>

                {settings.glow.enabled && (
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

          {activeTab === 'animation' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40 flex items-center gap-2">
                    <Zap size={12} /> Idle Animation
                  </label>
                  <button
                    onClick={() => handleAnimationChange('enabled', !settings.animation.enabled)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      settings.animation.enabled ? 'bg-amber-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                        settings.animation.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {settings.animation.enabled && (
                  <div className="space-y-3 mt-3 p-3 bg-black/40 rounded-lg">
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase tracking-wider text-white/30">Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['pulse', 'bounce', 'shake', 'spin'] as const).map((type) => (
                          <button
                            key={type}
                            onClick={() => handleAnimationChange('type', type)}
                            className={`p-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                              settings.animation.type === type
                                ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                                : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-mono uppercase tracking-wider text-white/30">Duration (ms)</label>
                        <span className="text-xs text-white/60 font-mono">{settings.animation.duration}ms</span>
                      </div>
                      <input
                        type="range"
                        min="500"
                        max="3000"
                        step="100"
                        value={settings.animation.duration}
                        onChange={(e) => handleAnimationChange('duration', parseInt(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/40">Click Animation</label>
                  <button
                    onClick={() => handleClickAnimationChange('enabled', !settings.clickAnimation.enabled)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 ${
                      settings.clickAnimation.enabled ? 'bg-amber-500' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-all duration-300 ${
                        settings.clickAnimation.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>

                {settings.clickAnimation.enabled && (
                  <div className="space-y-2 mt-3">
                    <label className="text-xs font-mono uppercase tracking-wider text-white/30">Type</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['ripple', 'shrink', 'flash'] as const).map((type) => (
                        <button
                          key={type}
                          onClick={() => handleClickAnimationChange('type', type)}
                          className={`p-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all ${
                            settings.clickAnimation.type === type
                              ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                              : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
