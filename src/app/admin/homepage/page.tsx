"use client";

import { useEffect, useState } from "react";
import { FloatingPreview } from "@/components/admin/FloatingPreview";
import { HomepageContentSection } from "@/components/admin/sections/HomepageContentSection";
import { HomepageDesignSection } from "@/components/admin/sections/HomepageDesignSection";
import { HomepageLayoutSection } from "@/components/admin/sections/HomepageLayoutSection";
import { HomepageAnimationSection } from "@/components/admin/sections/HomepageAnimationSection";
import { getAdminStateManager, AdminState } from "@/lib/admin-state";
import { HomepageConfig, defaultHomepageConfig } from "@/lib/admin-config";
import { RefreshCw, Save, Undo, RotateCcw } from "lucide-react";

export default function HomepageEditor() {
  const [config, setConfig] = useState<HomepageConfig>(defaultHomepageConfig);
  const [activeTab, setActiveTab] = useState<'content' | 'design' | 'layout' | 'animation'>('content');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'unsaved' | 'saving' | 'saved'>('saved');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

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
    // Update local state immediately for live preview
    setConfig(prev => ({ ...prev, content: contentConfig }));
    // Mark as unsaved
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
    // Also update admin state manager for persistence
    manager.updateSectionConfig('homepage', (config) => ({
      ...config,
      content: contentConfig,
    }));
  };

  const handleDesignChange = (designConfig: HomepageConfig['design']) => {
    const manager = getAdminStateManager();
    // Update local state immediately for live preview
    setConfig(prev => ({ ...prev, design: designConfig }));
    // Mark as unsaved
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
    // Also update admin state manager for persistence
    manager.updateSectionConfig('homepage', (config) => ({
      ...config,
      design: designConfig,
    }));
  };

  const handleLayoutChange = (layoutConfig: HomepageConfig['layout']) => {
    const manager = getAdminStateManager();
    // Update local state immediately for live preview
    setConfig(prev => ({ ...prev, layout: layoutConfig }));
    // Mark as unsaved
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
    // Also update admin state manager for persistence
    manager.updateSectionConfig('homepage', (config) => ({
      ...config,
      layout: layoutConfig,
    }));
  };

  const handleAnimationChange = (animationConfig: HomepageConfig['animation']) => {
    const manager = getAdminStateManager();
    // Update local state immediately for live preview
    setConfig(prev => ({ ...prev, animation: animationConfig }));
    // Mark as unsaved
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
    // Also update admin state manager for persistence
    manager.updateSectionConfig('homepage', (config) => ({
      ...config,
      animation: animationConfig,
    }));
  };

  const handleSave = async () => {
    const manager = getAdminStateManager();
    setSaveStatus('saving');
    try {
      await manager.save();
      setSaveStatus('saved');
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Save failed:', error);
      setSaveStatus('unsaved');
    }
  };

  const handleUndo = async () => {
    const manager = getAdminStateManager();
    await manager.undo();
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
  };

  const handleReset = async () => {
    const manager = getAdminStateManager();
    await manager.reset();
    setHasUnsavedChanges(true);
    setSaveStatus('unsaved');
  };

  // Get the current saved homepage state from Supabase/CMS to preserve existing data
  const [savedHomepageState, setSavedHomepageState] = useState<any>(null);

  useEffect(() => {
    // Load saved homepage state to preserve portals and other data
    const loadSavedState = async () => {
      try {
        const { supabase } = await import('@/lib/supabase');
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
          return;
        }

        const { data } = await supabase
          .from("homepage_settings")
          .select("*")
          .eq("id", "homepage")
          .maybeSingle();

        if (data) {
          setSavedHomepageState(data);
        }
      } catch (error) {
        console.error('Error loading saved homepage state:', error);
      }
    };

    loadSavedState();
  }, []);

  // Transform admin config to homepage structure for preview
  const transformConfigForPreview = (adminConfig: HomepageConfig) => {
    // Start with saved state to preserve portals and other existing data
    const baseState = savedHomepageState || {};

    return {
      ...baseState, // Preserve all existing data (portals, etc.)
      // Override with admin config fields
      hero_text: adminConfig.content.heroTitle,
      slogan: adminConfig.content.heroSlogan,
      subtitle: adminConfig.content.heroSubtitle,
      hero_button_text: adminConfig.content.heroButtonText,
      hero_button_link: adminConfig.content.heroButtonLink,
      hero_description: adminConfig.content.heroDescription,
      hero_logo_url: adminConfig.content.logoUrl,
      hero_symbol_url: adminConfig.content.symbolUrl,
      show_logo: adminConfig.content.showLogo,
      show_symbol: adminConfig.content.showSymbol,
      background_image_url: adminConfig.design.backgroundUrl,
      background_type: adminConfig.design.backgroundType,
      background_color: adminConfig.design.backgroundColor,
      primary_color: adminConfig.design.primaryColor,
      accent_color: adminConfig.design.accentColor,
      hero_alignment: adminConfig.layout.heroAlignment,
      hero_vertical_alignment: adminConfig.layout.heroVerticalAlignment,
      hero_padding: adminConfig.layout.heroPadding,
      animations_enabled: adminConfig.animation.heroAnimation !== 'none',
      hero_animation: adminConfig.animation.heroAnimation,
      hero_animation_duration: adminConfig.animation.heroAnimationDuration,
      hero_glow_enabled: adminConfig.animation.heroGlowEnabled,
      hero_glow_color: adminConfig.animation.heroGlowColor,
    };
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
          <div className="flex items-center gap-3">
            {/* Save Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/40 border border-white/10">
              {saveStatus === 'unsaved' && (
                <span className="font-mono text-[8px] uppercase tracking-widest text-amber-400">Unsaved changes</span>
              )}
              {saveStatus === 'saving' && (
                <span className="font-mono text-[8px] uppercase tracking-widest text-white/60">Saving...</span>
              )}
              {saveStatus === 'saved' && (
                <span className="font-mono text-[8px] uppercase tracking-widest text-green-400">Saved</span>
              )}
            </div>
            {/* Action Buttons */}
            <button
              onClick={handleUndo}
              disabled={!hasUnsavedChanges}
              className="flex items-center gap-2 border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-lg font-mono text-[8px] tracking-widest transition-all hover:border-white/25 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Undo size={12} /> UNDO
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving' || !hasUnsavedChanges}
              className="flex items-center gap-2 border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 px-4 py-2.5 rounded-lg font-mono text-[8px] tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={12} /> SAVE
            </button>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] text-white/70 px-4 py-2.5 rounded-lg font-mono text-[8px] tracking-widest transition-all hover:border-white/25"
            >
              <RotateCcw size={12} /> RESET
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
      <FloatingPreview route="/" previewData={{ homepageSettings: transformConfigForPreview(config) }} />
    </>
  );
}
