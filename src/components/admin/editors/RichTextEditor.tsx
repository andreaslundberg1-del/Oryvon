"use client";

import React, { useState } from 'react';
import { 
  Type, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, 
  Palette, Sparkles, ChevronDown, Image as ImageIcon, Link as LinkIcon, 
  List, ListOrdered, Quote, Code, Strikethrough, Heading1, Heading2, Heading3
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSize, setShowFontSize] = useState(false);
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [showTextGradient, setShowTextGradient] = useState(false);

  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [selectedFontSize, setSelectedFontSize] = useState('16px');
  const [selectedFontFamily, setSelectedFontFamily] = useState('Outfit');
  const [textGradient, setTextGradient] = useState({ enabled: false, from: '#ffffff', to: '#c9933a' });
  const [textGlow, setTextGlow] = useState({ enabled: false, color: '#f59e0b', intensity: '0 0 20px' });

  const fontSizes = ['12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px'];
  const fontFamilies = ['Outfit', 'Inter', 'Geist Sans', 'Space Grotesk', 'Playfair Display', 'Roboto Mono'];
  const colors = ['#ffffff', '#c9933a', '#eed078', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];

  const applyFormat = (format: string) => {
    // In a real implementation, this would apply text formatting
    // For now, we'll just log it
    console.log('Applying format:', format);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    setShowColorPicker(false);
    // Apply color to selected text
    applyFormat(`color: ${color}`);
  };

  const handleFontSizeChange = (size: string) => {
    setSelectedFontSize(size);
    setShowFontSize(false);
    applyFormat(`font-size: ${size}`);
  };

  const handleFontFamilyChange = (family: string) => {
    setSelectedFontFamily(family);
    setShowFontFamily(false);
    applyFormat(`font-family: ${family}`);
  };

  const toggleTextGradient = () => {
    setTextGradient(prev => ({ ...prev, enabled: !prev.enabled }));
    if (textGradient.enabled) {
      applyFormat(`background: linear-gradient(to right, ${textGradient.from}, ${textGradient.to})`);
      applyFormat('-webkit-background-clip: text');
      applyFormat('-webkit-text-fill-color: transparent');
    } else {
      applyFormat('background: none');
      applyFormat('-webkit-background-clip: unset');
      applyFormat('-webkit-text-fill-color: unset');
    }
  };

  const toggleTextGlow = () => {
    setTextGlow(prev => ({ ...prev, enabled: !prev.enabled }));
    if (textGlow.enabled) {
      applyFormat(`text-shadow: ${textGlow.intensity} ${textGlow.color}`);
    } else {
      applyFormat('text-shadow: none');
    }
  };

  return (
    <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-white/10 bg-black/60">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-white/10">
          <button onClick={() => applyFormat('bold')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Bold size={14} />
          </button>
          <button onClick={() => applyFormat('italic')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Italic size={14} />
          </button>
          <button onClick={() => applyFormat('underline')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Underline size={14} />
          </button>
          <button onClick={() => applyFormat('strikethrough')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Strikethrough size={14} />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-white/10">
          <button onClick={() => applyFormat('h1')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Heading1 size={14} />
          </button>
          <button onClick={() => applyFormat('h2')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Heading2 size={14} />
          </button>
          <button onClick={() => applyFormat('h3')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Heading3 size={14} />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-white/10">
          <button onClick={() => applyFormat('align-left')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <AlignLeft size={14} />
          </button>
          <button onClick={() => applyFormat('align-center')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <AlignCenter size={14} />
          </button>
          <button onClick={() => applyFormat('align-right')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <AlignRight size={14} />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 pr-2 border-r border-white/10">
          <button onClick={() => applyFormat('ul')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <List size={14} />
          </button>
          <button onClick={() => applyFormat('ol')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <ListOrdered size={14} />
          </button>
        </div>

        {/* Other */}
        <div className="flex items-center gap-1 pr-2 border-r border-white/10">
          <button onClick={() => applyFormat('quote')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Quote size={14} />
          </button>
          <button onClick={() => applyFormat('code')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <Code size={14} />
          </button>
          <button onClick={() => applyFormat('link')} className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors">
            <LinkIcon size={14} />
          </button>
        </div>

        {/* Color Picker */}
        <div className="relative">
          <button
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors"
          >
            <Palette size={14} />
          </button>
          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-black/90 border border-white/10 rounded-lg shadow-xl z-50">
              <div className="grid grid-cols-4 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(color)}
                    className="w-6 h-6 rounded border border-white/20 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Font Size */}
        <div className="relative">
          <button
            onClick={() => setShowFontSize(!showFontSize)}
            className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors flex items-center gap-1"
          >
            <Type size={14} />
            <span className="text-xs text-white/60">{selectedFontSize}</span>
            <ChevronDown size={12} className="text-white/40" />
          </button>
          {showFontSize && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-black/90 border border-white/10 rounded-lg shadow-xl z-50 min-w-[80px]">
              {fontSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => handleFontSizeChange(size)}
                  className="block w-full text-left px-3 py-2 text-white/70 hover:bg-white/10 rounded text-xs font-mono"
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Family */}
        <div className="relative">
          <button
            onClick={() => setShowFontFamily(!showFontFamily)}
            className="p-2 hover:bg-white/10 rounded text-white/70 hover:text-white transition-colors flex items-center gap-1"
          >
            <span className="text-xs text-white/60 font-mono">Aa</span>
            <ChevronDown size={12} className="text-white/40" />
          </button>
          {showFontFamily && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-black/90 border border-white/10 rounded-lg shadow-xl z-50 min-w-[150px]">
              {fontFamilies.map((family) => (
                <button
                  key={family}
                  onClick={() => handleFontFamilyChange(family)}
                  className="block w-full text-left px-3 py-2 text-white/70 hover:bg-white/10 rounded text-xs"
                  style={{ fontFamily: family }}
                >
                  {family}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Text Gradient */}
        <div className="relative">
          <button
            onClick={toggleTextGradient}
            className={`p-2 hover:bg-white/10 rounded transition-colors ${
              textGradient.enabled ? 'text-amber-400 bg-amber-500/10' : 'text-white/70'
            }`}
          >
            <Sparkles size={14} />
          </button>
          {textGradient.enabled && (
            <div className="absolute top-full right-0 mt-1 p-3 bg-black/90 border border-white/10 rounded-lg shadow-xl z-50">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-white/40">From:</label>
                  <input
                    type="color"
                    value={textGradient.from}
                    onChange={(e) => setTextGradient(prev => ({ ...prev, from: e.target.value }))}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-white/40">To:</label>
                  <input
                    type="color"
                    value={textGradient.to}
                    onChange={(e) => setTextGradient(prev => ({ ...prev, to: e.target.value }))}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Text Glow */}
        <div className="relative">
          <button
            onClick={toggleTextGlow}
            className={`p-2 hover:bg-white/10 rounded transition-colors ${
              textGlow.enabled ? 'text-amber-400 bg-amber-500/10' : 'text-white/70'
            }`}
          >
            <div className="w-4 h-4 rounded-full bg-current blur-[2px]" />
          </button>
          {textGlow.enabled && (
            <div className="absolute top-full right-0 mt-1 p-3 bg-black/90 border border-white/10 rounded-lg shadow-xl z-50">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-xs font-mono text-white/40">Color:</label>
                  <input
                    type="color"
                    value={textGlow.color}
                    onChange={(e) => setTextGradient(prev => ({ ...prev, color: e.target.value }))}
                    className="w-8 h-8 rounded cursor-pointer border-0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-white/40">Intensity:</label>
                  <input
                    type="text"
                    value={textGlow.intensity}
                    onChange={(e) => setTextGradient(prev => ({ ...prev, intensity: e.target.value }))}
                    className="w-full bg-black/60 border border-white/10 rounded px-2 py-1 text-white text-xs"
                    placeholder="0 0 20px"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Area */}
      <div className="p-4">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder || "Enter your text here..."}
          className="w-full min-h-[200px] bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none transition-all resize-none"
          style={{
            fontFamily: selectedFontFamily,
            fontSize: selectedFontSize,
            color: selectedColor,
            ...(textGradient.enabled && {
              background: `linear-gradient(to right, ${textGradient.from}, ${textGradient.to})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }),
            ...(textGlow.enabled && {
              textShadow: `${textGlow.intensity} ${textGlow.color}`,
            }),
          }}
        />
      </div>
    </div>
  );
}
