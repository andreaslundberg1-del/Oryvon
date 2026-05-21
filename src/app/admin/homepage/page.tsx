"use client";

import { useEffect, useState } from "react";
import { FloatingPreview } from "@/components/admin/FloatingPreview";
import { HomepageContentSection } from "@/components/admin/sections/HomepageContentSection";
import { HomepageDesignSection } from "@/components/admin/sections/HomepageDesignSection";
import { HomepageLayoutSection } from "@/components/admin/sections/HomepageLayoutSection";
import { HomepageAnimationSection } from "@/components/admin/sections/HomepageAnimationSection";
import { getAdminStateManager, AdminState } from "@/lib/admin-state";
import { HomepageConfig, defaultHomepageConfig } from "@/lib/admin-config";
import { RefreshCw } from "lucide-react";

export default function HomepageEditor() {
  const [config, setConfig] = useState<HomepageConfig>(defaultHomepageConfig);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'layout' | 'animation'>('content');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const manager = getAdminStateManager();
    
    // Subscribe to state changes
    const unsubscribe = manager.subscribe((state) => {
      setConfig(state.config.homepage);
      setLoading(false);
    });

    // Load initial state
    const state = manager.getState();
    setConfig(state.config.homepage);
    setLoading(false);

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleContentChange = (contentConfig: HomepageConfig['content']) => {
    const manager = getAdminStateManager();
    manager.updateSectionConfig('homepage', (config) => ({
      ...config,
      content: contentConfig,
    }));
  };

  const handleDesignChange = (designConfig: HomepageConfig['design']) => {
    const manager = getAdminStateManager();
    manager.updateSectionConfig('homepage', (config) => ({
      ...config,
      design: designConfig,
    }));
  };

  const handleLayoutChange = (layoutConfig: HomepageConfig['layout']) => {
    const manager = getAdminStateManager();
    manager.updateSectionConfig('homepage', (config) => ({
      ...config,
      layout: layoutConfig,
    }));
  };

  const handleAnimationChange = (animationConfig: HomepageConfig['animation']) => {
    const manager = getAdminStateManager();
    manager.updateSectionConfig('homepage', (config) => ({
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
            <h1 className="font-serif text-2xl font-light tracking-[0.35em] text-amber-400">HOMEPAGE EDITOR</h1>
            <p className="font-mono text-[8px] uppercase tracking-[0.2em] text-white/35 mt-2">
              Customize the landing page appearance
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
              <HomepageContentSection
                config={config.content}
                onChange={handleContentChange}
              />
            )}
            {activeTab === 'design' && (
              <HomepageDesignSection
                config={config.design}
                onChange={handleDesignChange}
              />
            )}
            {activeTab === 'layout' && (
              <HomepageLayoutSection
                config={config.layout}
                onChange={handleLayoutChange}
              />
            )}
            {activeTab === 'animation' && (
              <HomepageAnimationSection
                config={config.animation}
                onChange={handleAnimationChange}
              />
            )}
          </div>
        </div>
      </div>

      {/* Floating Preview */}
      <FloatingPreview route="/" previewData={{ homepageSettings: config }} />
    </>
  );
}
