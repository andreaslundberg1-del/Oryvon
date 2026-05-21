"use client";

import { useEffect, useState } from "react";
import { FloatingPreview } from "@/components/admin/FloatingPreview";
import { PortalsContentSection } from "@/components/admin/sections/PortalsContentSection";
import { PortalsDesignSection } from "@/components/admin/sections/PortalsDesignSection";
import { PortalsLayoutSection } from "@/components/admin/sections/PortalsLayoutSection";
import { PortalsAnimationSection } from "@/components/admin/sections/PortalsAnimationSection";
import { getAdminStateManager } from "@/lib/admin-state";
import { PortalsConfig, defaultPortalsConfig } from "@/lib/admin-config";
import { RefreshCw } from "lucide-react";

export default function PortalManager() {
  const [config, setConfig] = useState<PortalsConfig>(defaultPortalsConfig);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'layout' | 'animation'>('content');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const manager = getAdminStateManager();
    
    // Subscribe to state changes
    const unsubscribe = manager.subscribe((state) => {
      setConfig(state.config.portals);
      setLoading(false);
    });

    // Load initial state
    const state = manager.getState();
    setConfig(state.config.portals);
    setLoading(false);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleContentChange = (contentConfig: PortalsConfig['content']) => {
    const manager = getAdminStateManager();
    // Update local state immediately for live preview
    setConfig(prev => ({ ...prev, content: contentConfig }));
    // Also update admin state manager for persistence
    manager.updateSectionConfig('portals', (config) => ({
      ...config,
      content: contentConfig,
    }));
  };

  const handleDesignChange = (designConfig: PortalsConfig['design']) => {
    const manager = getAdminStateManager();
    // Update local state immediately for live preview
    setConfig(prev => ({ ...prev, design: designConfig }));
    // Also update admin state manager for persistence
    manager.updateSectionConfig('portals', (config) => ({
      ...config,
      design: designConfig,
    }));
  };

  const handleLayoutChange = (layoutConfig: PortalsConfig['layout']) => {
    const manager = getAdminStateManager();
    // Update local state immediately for live preview
    setConfig(prev => ({ ...prev, layout: layoutConfig }));
    // Also update admin state manager for persistence
    manager.updateSectionConfig('portals', (config) => ({
      ...config,
      layout: layoutConfig,
    }));
  };

  const handleAnimationChange = (animationConfig: PortalsConfig['animation']) => {
    const manager = getAdminStateManager();
    // Update local state immediately for live preview
    setConfig(prev => ({ ...prev, animation: animationConfig }));
    // Also update admin state manager for persistence
    manager.updateSectionConfig('portals', (config) => ({
      ...config,
      animation: animationConfig,
    }));
  };

  const handleReset = async () => {
    const manager = getAdminStateManager();
    await manager.reset();
  };

  return (
    <>
      <div className="h-full flex flex-col">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-2xl font-light tracking-[0.35em] text-amber-400">PORTALS EDITOR</h1>
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35 mt-2">
              Manage portal cards and settings
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-lg font-mono text-[8px] tracking-widest transition-all hover:border-white/25"
            >
              <RefreshCw size={12} /> RESET
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {(['content', 'design', 'layout', 'animation'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-lg font-mono text-[8px] tracking-widest uppercase transition-all ${
                activeTab === tab
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                  : 'bg-white/[0.04] border-white/15 text-white/60 hover:border-white/25 hover:bg-white/[0.08]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-2" style={{ scrollbarWidth: "thin" }}>
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6 shadow-[inset_0_0_30px_rgba(0,0,0,0.3)] max-w-4xl mx-auto">
            {activeTab === 'content' && (
              <PortalsContentSection
                config={config.content}
                onChange={handleContentChange}
              />
            )}
            {activeTab === 'design' && (
              <PortalsDesignSection
                config={config.design}
                onChange={handleDesignChange}
              />
            )}
            {activeTab === 'layout' && (
              <PortalsLayoutSection
                config={config.layout}
                onChange={handleLayoutChange}
              />
            )}
            {activeTab === 'animation' && (
              <PortalsAnimationSection
                config={config.animation}
                onChange={handleAnimationChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Preview */}
      <FloatingPreview route="/" previewData={{ portalsConfig: config }} />
    </>
  );
}
