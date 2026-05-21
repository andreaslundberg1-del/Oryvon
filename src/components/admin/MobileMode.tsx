"use client";

import React, { useState } from 'react';
import { Monitor, Tablet, Smartphone, ChevronDown, Copy, Eye, EyeOff } from 'lucide-react';

export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface DeviceConfig {
  type: DeviceType;
  width: number;
  height: number;
  name: string;
  icon: React.ReactNode;
}

const DEVICE_CONFIGS: DeviceConfig[] = [
  {
    type: 'desktop',
    width: 1920,
    height: 1080,
    name: 'Desktop',
    icon: <Monitor size={20} />,
  },
  {
    type: 'tablet',
    width: 768,
    height: 1024,
    name: 'Tablet',
    icon: <Tablet size={20} />,
  },
  {
    type: 'mobile',
    width: 390,
    height: 844,
    name: 'Mobile',
    icon: <Smartphone size={20} />,
  },
];

export interface DeviceSpecificConfig {
  [key: string]: any;
}

interface MobileModeProps {
  activeDevice: DeviceType;
  onDeviceChange: (device: DeviceType) => void;
  deviceConfigs: Record<DeviceType, DeviceSpecificConfig>;
  onConfigChange: (device: DeviceType, config: DeviceSpecificConfig) => void;
  onCopyConfig?: (fromDevice: DeviceType, toDevice: DeviceType) => void;
}

export function MobileMode({ 
  activeDevice, 
  onDeviceChange, 
  deviceConfigs, 
  onConfigChange,
  onCopyConfig 
}: MobileModeProps) {
  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [showConfigPanel, setShowConfigPanel] = useState(false);
  const [selectedConfigDevice, setSelectedConfigDevice] = useState<DeviceType | null>(null);

  const activeConfig = deviceConfigs[activeDevice];
  const selectedConfig = selectedConfigDevice ? deviceConfigs[selectedConfigDevice] : null;

  const handleCopyFromDevice = (fromDevice: DeviceType) => {
    if (onCopyConfig && selectedConfigDevice) {
      onCopyConfig(fromDevice, selectedConfigDevice);
      setShowConfigPanel(false);
    }
  };

  const getConfigPreview = (device: DeviceType) => {
    const config = deviceConfigs[device];
    const deviceInfo = DEVICE_CONFIGS.find(d => d.type === device);
    
    return (
      <div className="flex items-center justify-between p-3 bg-black/40 border border-white/10 rounded-lg hover:border-white/20 transition-all">
        <div className="flex items-center gap-3">
          {deviceInfo?.icon}
          <div>
            <div className="text-xs font-mono text-white/80 uppercase tracking-wider">{device}</div>
            <div className="text-[10px] text-white/40 font-mono">
              {deviceInfo?.width}x{deviceInfo?.height}
            </div>
          </div>
        </div>
        <button
          onClick={() => setSelectedConfigDevice(device)}
          className="text-white/40 hover:text-white transition-colors"
        >
          <ChevronDown size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Device Selector */}
      <div className="flex items-center gap-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Device Mode</label>
        <div className="flex gap-1">
          {DEVICE_CONFIGS.map((config) => (
            <button
              key={config.type}
              onClick={() => onDeviceChange(config.type)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[10px] uppercase tracking-wider transition-all ${
                activeDevice === config.type
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'
              }`}
            >
              {config.icon}
              {config.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Device Info */}
      <div className="bg-black/40 border border-white/10 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {DEVICE_CONFIGS.find(d => d.type === activeDevice)?.icon}
            <span className="text-sm font-mono uppercase tracking-wider text-white/80">
              {activeDevice} Settings
            </span>
          </div>
          <button
            onClick={() => setShowConfigPanel(!showConfigPanel)}
            className="text-white/40 hover:text-white transition-colors"
          >
            <ChevronDown size={16} />
          </button>
        </div>

        <div className="space-y-2 text-xs font-mono text-white/60">
          <div className="flex justify-between">
            <span>Width:</span>
            <span className="text-white/80">{DEVICE_CONFIGS.find(d => d.type === activeDevice)?.width}px</span>
          </div>
          <div className="flex justify-between">
            <span>Height:</span>
            <span className="text-white/80">{DEVICE_CONFIGS.find(d => d.type === activeDevice)?.height}px</span>
          </div>
          <div className="flex justify-between">
            <span>Configured:</span>
            <span className={Object.keys(activeConfig || {}).length > 0 ? 'text-emerald-400' : 'text-white/40'}>
              {Object.keys(activeConfig || {}).length} properties
            </span>
          </div>
        </div>
      </div>

      {/* Config Panel */}
      {showConfigPanel && (
        <div className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-4">
          <h4 className="text-xs font-mono uppercase tracking-wider text-white/40">Device Configurations</h4>
          
          {Object.entries(deviceConfigs).map(([deviceType, config]) => (
            <div key={deviceType} className="space-y-2">
              {getConfigPreview(deviceType as DeviceType)}
              
              {selectedConfigDevice === deviceType && onCopyConfig && (
                <div className="ml-8 mt-2 p-3 bg-black/60 border border-white/10 rounded-lg space-y-2">
                  <label className="text-xs font-mono uppercase tracking-wider text-white/30">
                    Copy settings from:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(deviceConfigs)
                      .filter(([type]) => type !== deviceType)
                      .map(([otherType]) => (
                        <button
                          key={otherType}
                          onClick={() => handleCopyFromDevice(otherType as DeviceType)}
                          className="flex items-center justify-center gap-2 px-2 py-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 rounded-lg text-white/60 hover:text-amber-400 text-[10px] font-mono uppercase tracking-wider transition-all"
                        >
                          <Copy size={12} />
                          {otherType}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Quick Actions */}
          <div className="pt-4 border-t border-white/10">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  // Copy desktop to all devices
                  if (onCopyConfig) {
                    Object.entries(deviceConfigs).forEach(([deviceType]) => {
                      if (deviceType !== 'desktop') {
                        onCopyConfig('desktop', deviceType as DeviceType);
                      }
                    });
                  }
                }}
                className="flex-1 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 text-[10px] font-mono uppercase tracking-wider transition-all flex items-center justify-center gap-2"
              >
                <Copy size={12} />
                Sync All
              </button>
              <button
                onClick={() => {
                  // Reset all devices to default
                  Object.entries(deviceConfigs).forEach(([deviceType]) => {
                    onConfigChange(deviceType as DeviceType, {});
                  });
                }}
                className="flex-1 px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white/70 text-[10px] font-mono uppercase tracking-wider transition-all"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Device Visibility Toggle */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Device Visibility</label>
        <div className="space-y-2">
          {Object.entries(deviceConfigs).map(([deviceType, config]) => {
            const deviceInfo = DEVICE_CONFIGS.find(d => d.type === deviceType);
            const isVisible = config?.visible !== false;
            return (
              <div key={deviceType} className="flex items-center justify-between p-2 bg-black/40 border border-white/10 rounded-lg">
                <div className="flex items-center gap-2">
                  {deviceInfo?.icon}
                  <span className="text-xs font-mono text-white/60 uppercase tracking-wider">
                    {deviceType}
                  </span>
                </div>
                <button
                  onClick={() => {
                    const newConfig = { ...config, visible: !isVisible };
                    onConfigChange(deviceType as DeviceType, newConfig);
                  }}
                  className={`w-10 h-5 rounded-full transition-all duration-300 ${
                    isVisible ? 'bg-amber-500' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${
                      isVisible ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Responsive Breakpoints */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-white/40">Responsive Breakpoints</label>
        <div className="bg-black/40 border border-white/10 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/60">Mobile:</span>
            <span className="text-white/80">&lt; 768px</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/60">Tablet:</span>
            <span className="text-white/80">768px - 1024px</span>
          </div>
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-white/60">Desktop:</span>
            <span className="text-white/80">&gt; 1024px</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Hook for using device-specific configs
export function useDeviceConfig<T extends DeviceSpecificConfig>(
  activeDevice: DeviceType,
  deviceConfigs: Record<DeviceType, T>,
  defaultConfig: T
): T {
  return deviceConfigs[activeDevice] || defaultConfig;
}
