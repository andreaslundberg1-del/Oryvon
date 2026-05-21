"use client";

import React, { useState, useEffect, useRef } from 'react';
import { PreviewFrame } from './PreviewFrame';
import { ChevronUp, ChevronDown, Monitor, Tablet, Smartphone } from 'lucide-react';
import { useLivePreview } from '@/contexts/LivePreviewContext';

type PreviewDevice = "desktop" | "tablet" | "mobile";

type PreviewSize = "small" | "medium" | "large";

interface FloatingPreviewProps {
  route?: string;
  device?: PreviewDevice;
  previewData?: any;
  children?: React.ReactNode;
  useContext?: boolean; // New prop to enable context usage
  localPreview?: boolean; // If true, render children directly instead of iframe
}

const SIZE_PRESETS = {
  small: { width: 350, height: 350, label: "Small", value: 0 },
  medium: { width: 480, height: 450, label: "Medium", value: 50 },
  large: { width: 1400, height: 900, label: "Large", value: 100 },
};

export function FloatingPreview({ route, device: propDevice = "desktop", previewData, children, useContext: useContextEnabled = false }: FloatingPreviewProps) {
  const previewContext = useContextEnabled ? useLivePreview() : null;
  
  const [isExpanded, setIsExpanded] = useState(previewContext?.state.isOpen ?? true);
  const [currentDevice, setCurrentDevice] = useState<PreviewDevice>(previewContext?.state.device ?? propDevice);
  const [sliderValue, setSliderValue] = useState(previewContext?.state.size ?? 50);
  const [dimensions, setDimensions] = useState({ width: 480, height: 450 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Calculate panel dimensions based on slider value with viewport constraints
  const calculateDimensions = (value: number) => {
    const smallPreset = SIZE_PRESETS.small;
    const largePreset = SIZE_PRESETS.large;
    
    // Interpolate between small and large based on slider value (0-100)
    const t = value / 100;
    let width = smallPreset.width + (largePreset.width - smallPreset.width) * t;
    let height = smallPreset.height + (largePreset.height - smallPreset.height) * t;
    
    // Apply viewport constraints to keep preview within browser window
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const maxPanelWidth = viewportWidth - 100; // Leave some margin
    const maxPanelHeight = viewportHeight - 150; // Leave space for controls and margin
    
    // Clamp dimensions to viewport
    width = Math.min(width, maxPanelWidth);
    height = Math.min(height, maxPanelHeight);
    
    return { width, height };
  };

  // Update dimensions when slider value changes
  useEffect(() => {
    setDimensions(calculateDimensions(sliderValue));
  }, [sliderValue]);

  // Update dimensions when window resizes
  useEffect(() => {
    const handleResize = () => {
      setDimensions(calculateDimensions(sliderValue));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sliderValue]);

  const panelWidth = dimensions.width;
  const panelHeight = dimensions.height;

  // Sync state with context when context changes
  useEffect(() => {
    if (previewContext) {
      setIsExpanded(previewContext.state.isOpen);
      setCurrentDevice(previewContext.state.device);
      setSliderValue(previewContext.state.size);
    }
  }, [previewContext?.state.isOpen, previewContext?.state.device, previewContext?.state.size]);

  // Update context when local state changes
  const handleSetIsExpanded = (value: boolean) => {
    setIsExpanded(value);
    if (previewContext) {
      previewContext.setIsOpen(value);
    }
  };

  const handleSetDevice = (device: PreviewDevice) => {
    setCurrentDevice(device);
    if (previewContext) {
      previewContext.setDevice(device);
    }
  };

  const handleSetSliderValue = (value: number) => {
    setSliderValue(value);
    if (previewContext) {
      previewContext.setSize(value);
    }
  };

  // Get label based on slider value (snap to nearest preset for display)
  const getSizeLabel = (value: number) => {
    if (value < 33) return SIZE_PRESETS.small.label;
    if (value < 66) return SIZE_PRESETS.medium.label;
    return SIZE_PRESETS.large.label;
  };

  const sizeLabel = getSizeLabel(sliderValue);

  const getDeviceDimensions = () => {
    switch (currentDevice) {
      case "desktop":
        return { width: 1920, height: 1080 };
      case "tablet":
        return { width: 768, height: 1024 };
      case "mobile":
        return { width: 390, height: 844 };
    }
  };

  const deviceDims = getDeviceDimensions();
  const widgetPadding = 32; // p-4 = 16px padding on each side
  const availableWidth = panelWidth - widgetPadding;
  const availableHeight = panelHeight - 100; // Account for header and padding

  // Calculate scale to fit device preview in available space
  const widthScale = availableWidth / deviceDims.width;
  const heightScale = availableHeight / deviceDims.height;
  const scale = Math.max(0.2, Math.min(widthScale, heightScale)); // Clamp minimum scale to 0.2

  // Handle size slider change (continuous 0-100)
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSetSliderValue(parseInt(e.target.value, 10));
  };

  return (
    <>
      {/* Floating Arrow Button with Label and Size Slider */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
        {/* Live Preview Label (visible when collapsed) */}
        <div
          className={`transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            isExpanded ? 'opacity-0 translate-x-4 pointer-events-none' : 'opacity-100 translate-x-0'
          }`}
        >
          <span className="text-white/80 font-medium text-sm">Live Preview</span>
        </div>

        {/* Size Slider (visible when expanded) */}
        <div
          className={`transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] ${
            isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10" title="Preview size">
            <span className="text-white/60 text-xs font-medium">Size:</span>
            <div className="relative w-36 h-2">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={handleSliderChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-75"
                  style={{
                    width: `${sliderValue}%`,
                    background: "linear-gradient(90deg, rgba(245,158,11,0.8) 0%, rgba(245,158,11,1) 100%)",
                    boxShadow: "0 0 10px rgba(245,158,11,0.5)",
                  }}
                />
              </div>
              <div
                className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-75 cursor-grab active:cursor-grabbing hover:scale-110 hover:shadow-[0_0_15px_rgba(245,158,11,1)]`}
                style={{
                  left: `${sliderValue}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            </div>
            <span className="text-amber-400 text-xs font-semibold w-12">{sizeLabel}</span>
          </div>
        </div>

        {/* Arrow Button */}
        <button
          onClick={() => handleSetIsExpanded(!isExpanded)}
          className="w-12 h-12 rounded-full bg-black/80 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:border-amber-500/30 transition-all duration-300 flex items-center justify-center group"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.9) 0%, rgba(10,5,2,0.85) 100%)',
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-5 h-5 text-amber-500/80 group-hover:text-amber-400 transition-colors" />
          ) : (
            <ChevronUp className="w-5 h-5 text-amber-500/80 group-hover:text-amber-400 transition-colors" />
          )}
        </button>
      </div>

      {/* Floating Preview Panel */}
      <div
        ref={panelRef}
        className={`fixed bottom-24 right-6 z-40 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${
          isExpanded ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4 pointer-events-none'
        }`}
        style={{
          width: `${panelWidth}px`,
        }}
      >
        {/* Preview Container with Glassmorphism */}
        <div
          className="relative rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)] border border-white/10"
          style={{
            background: 'linear-gradient(135deg, rgba(0,0,0,0.95) 0%, rgba(10,5,2,0.9) 100%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Header with Device Selector */}
          <div className="px-4 py-3 border-b border-white/5 bg-black/40">
            <span className="text-xs font-mono text-amber-500/60 tracking-[0.2em] uppercase">
              Live Preview
            </span>

            {/* Device Selector */}
            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleSetDevice('desktop')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentDevice === 'desktop'
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    : 'bg-white/5 border border-white/5 text-white/40 hover:text-white/60'
                }`}
                title="Desktop"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSetDevice('tablet')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentDevice === 'tablet'
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    : 'bg-white/5 border border-white/5 text-white/40 hover:text-white/60'
                }`}
                title="Tablet"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleSetDevice('mobile')}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentDevice === 'mobile'
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    : 'bg-white/5 border border-white/5 text-white/40 hover:text-white/60'
                }`}
                title="Mobile"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Frame Container */}
          <div className="p-4 bg-black/20">
            <div
              className="relative rounded-lg overflow-y-auto flex items-center justify-center"
              style={{
                height: `${panelHeight - 100}px`, // Account for header and padding
                background: 'linear-gradient(135deg, rgba(2,1,2,0.8) 0%, rgba(0,0,0,0.95) 100%)',
              }}
            >
              {children ? (
                <div>
                  {children}
                </div>
              ) : route ? (
                <PreviewFrame
                  route={route}
                  device={currentDevice}
                  previewData={previewData}
                  explicitScale={scale}
                />
              ) : null}
            </div>
          </div>

          {/* Subtle Glow Effect */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl opacity-30"
            style={{
              background: 'radial-gradient(circle at top right, rgba(245,158,11,0.15) 0%, transparent 50%)',
            }}
          />
        </div>
      </div>
    </>
  );
}
