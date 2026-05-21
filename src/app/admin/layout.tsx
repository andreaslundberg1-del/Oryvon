"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AdminCommandPalette from '@/components/AdminCommandPalette';
import LanguageSelector from '@/components/LanguageSelector';
import GlobalAudioControl from '@/components/GlobalAudioControl';
import { SaveSystem } from '@/components/admin/SaveSystem';
import { getAdminStateManager, AdminState } from '@/lib/admin-state';
import { LivePreviewProvider } from '@/contexts/LivePreviewContext';
import { CursorProvider } from '@/contexts/CursorContext';
import '@/styles/cursor.css';
import {
  Home, Globe, Film, Users, Map, Clock, Shield, Image, Languages, Settings, LogOut, Menu, X, Activity, AlertTriangle, Network, Wand2
} from 'lucide-react';

export const dynamic = 'force-dynamic';

const NAV_ITEMS = [
  { id: 'homepage', label: 'Homepage', icon: Home, href: '/admin/homepage' },
  { id: 'portals', label: 'Portals', icon: Globe, href: '/admin/portals' },
  { id: 'universes', label: 'Universes', icon: Film, href: '/admin' },
  { id: 'characters', label: 'Characters', icon: Users, href: '/admin/characters' },
  { id: 'locations', label: 'Locations', icon: Map, href: '/admin/locations' },
  { id: 'timeline', label: 'Timeline', icon: Clock, href: '/admin/timeline' },
  { id: 'factions', label: 'Factions', icon: Shield, href: '/admin/factions' },
  { id: 'media', label: 'Media', icon: Image, href: '/admin/media' },
  { id: 'translations', label: 'Translations', icon: Languages, href: '/admin/translations' },
  { id: 'settings', label: 'Settings', icon: Settings, href: '/admin/settings' },
  { id: 'health', label: 'Health', icon: AlertTriangle, href: '/admin/health' },
  { id: 'activity', label: 'Activity', icon: Activity, href: '/admin/activity' },
  { id: 'visualizer', label: 'Visualizer', icon: Network, href: '/admin/visualizer' },
  { id: 'custom-fields', label: 'Custom Fields', icon: Wand2, href: '/admin/custom-fields' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const activeItem = NAV_ITEMS.find((item) => pathname === item.href || (item.href === '/admin' && pathname === '/admin'));
  
  // Admin state management
  const [adminState, setAdminState] = useState<AdminState | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const manager = getAdminStateManager();

    // Subscribe to state changes
    const unsubscribe = manager.subscribe((state) => {
      setAdminState(state);
    });

    // Load initial state
    setAdminState(manager.getState());

    return () => {
      unsubscribe();
    };
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    const manager = getAdminStateManager();
    const success = await manager.save();
    setIsSaving(false);
  };

  const handleUndo = () => {
    const manager = getAdminStateManager();
    manager.undo();
  };

  const handleReset = async () => {
    const manager = getAdminStateManager();
    await manager.reset();
  };

  const handleLogout = async () => {
    const { supabase } = await import('@/lib/supabase');
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <CursorProvider>
      <LivePreviewProvider>
        <div className="min-h-screen bg-[#020101] text-white selection:bg-amber-500/30 selection:text-amber-200 z-50 relative flex">
      {/* Enhanced Background with multiple radial glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(245,158,11,0.08),transparent_45%),radial-gradient(circle_at_100%_30%,rgba(124,81,160,0.05),transparent_50%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.04),transparent_40%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(0,0,0,0.3)_100%)]" />
        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />
      </div>
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-50 flex h-full flex-col overflow-hidden border-r border-amber-500/15 bg-[#030202]/90 backdrop-blur-3xl transition-all duration-300 ${
        sidebarOpen ? 'w-64' : 'w-16'
      }`}>
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_0%,rgba(245,158,11,0.12),transparent_35%),radial-gradient(circle_at_0%_70%,rgba(124,81,160,0.06),transparent_38%)]" />
        {/* Sidebar Top: Identity */}
        <div className="p-5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] text-white/55 transition-all hover:border-amber-500/30 hover:bg-amber-500/12 hover:text-amber-300"
            >
              {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
            {sidebarOpen && (
              <div className="min-w-0 flex-1">
                <h1 className="truncate font-serif text-base font-light tracking-[0.38em] text-amber-400">ORYVON</h1>
                <p className="mt-0.5 truncate font-mono text-[7px] uppercase tracking-[0.2em] text-white/35">CMS v4.0</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <Link
              href="/"
              className="mt-5 flex h-9 items-center justify-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/8 font-mono text-[8px] uppercase tracking-widest text-amber-300 shadow-[inset_0_0_20px_rgba(245,158,11,0.04),0_0_18px_rgba(245,158,11,0.06)] transition-all hover:border-amber-500/50 hover:bg-amber-500/14"
            >
              <Home size={12} /> View Site
            </Link>
          )}
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/8 to-transparent" />

        {/* Sidebar Center: Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5" style={{ scrollbarWidth: "thin" }}>
          {sidebarOpen && (
            <div className="mb-3 px-3 font-mono text-[7px] uppercase tracking-[0.24em] text-white/25">NAVIGATION</div>
          )}
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href === '/admin' && pathname === '/admin');
            
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg border px-3 py-2.5 transition-all duration-300 ${
                  isActive
                    ? 'border-amber-500/30 bg-amber-500/12 text-amber-300 shadow-[inset_0_0_22px_rgba(245,158,11,0.055)]'
                    : 'border-transparent text-white/55 hover:border-white/10 hover:bg-white/[0.045] hover:text-white'
                }`}
              >
                <Icon size={16} className="shrink-0 transition-transform duration-300 group-hover:scale-110" />
                {sidebarOpen && (
                  <span className="truncate font-mono text-[8px] tracking-widest uppercase">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Sidebar Bottom: System */}
        <div className="space-y-2 p-4">
          {sidebarOpen && (
            <div className="mb-3 font-mono text-[7px] uppercase tracking-[0.24em] text-white/25">SYSTEM</div>
          )}
          <Link
            href="/admin/settings"
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-white/55 transition-all hover:border-white/10 hover:bg-white/[0.045] hover:text-white"
          >
            <Settings size={16} />
            {sidebarOpen && (
              <span className="font-mono text-[8px] tracking-widest uppercase">Settings</span>
            )}
          </Link>
        </div>

        <div className="mx-4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Sidebar Bottom: Session */}
        <div className="space-y-2 p-4">
          {sidebarOpen && (
            <div className="mb-3 font-mono text-[7px] uppercase tracking-[0.24em] text-white/25">SESSION</div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-red-400 transition-all hover:border-red-500/20 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={16} />
            {sidebarOpen && (
              <span className="font-mono text-[8px] tracking-widest uppercase">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`min-w-0 flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-14 w-full overflow-hidden border-b border-amber-500/20 bg-[#050303]/75 px-4 backdrop-blur-3xl shadow-[0_8px_32px_rgba(0,0,0,0.45)] sm:px-6">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(245,158,11,0.08),transparent_40%),linear-gradient(90deg,transparent,rgba(245,158,11,0.025),transparent)]" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          <div className="relative flex h-full min-w-0 items-center justify-between gap-4">
            {/* Left: Logo + Subtitle */}
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="font-serif text-sm font-light tracking-[0.35em] text-amber-400">ORYVON</span>
                <span className="hidden sm:block h-3 w-px bg-white/10" />
                <span className="hidden sm:block font-mono text-[7px] uppercase tracking-[0.2em] text-white/30">The Multiverse Archive</span>
              </div>
            </div>
            
            {/* Center: System Status + Current Page */}
            <div className="hidden md:flex min-w-0 items-center justify-center flex-1">
              <div className="flex h-8 min-w-0 items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.02] px-3 shadow-[inset_0_0_14px_rgba(255,255,255,0.015)]">
                <div className="h-1 w-1 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] animate-pulse" />
                <span className="hidden lg:inline font-mono text-[7.5px] uppercase tracking-widest text-white/35">
                  System Online
                </span>
                <span className="hidden lg:block h-2 w-px bg-white/8" />
                <span className="truncate font-mono text-[7.5px] uppercase tracking-widest text-amber-300/80">
                  {activeItem?.label || 'Admin'}
                </span>
              </div>
            </div>
            
            {/* Right: Controls */}
            <div className="flex shrink-0 items-center justify-end gap-2">
              <AdminCommandPalette />
              <div className="hidden sm:block">
                <LanguageSelector />
              </div>
              <div className="hidden md:block">
                <GlobalAudioControl />
              </div>
              <Link
                href="/admin/settings"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-white/[0.03] text-white/55 shadow-[0_2px_12px_rgba(0,0,0,0.4)] backdrop-blur-2xl transition-all hover:border-amber-500/40 hover:bg-white/[0.06] hover:text-amber-300"
                aria-label="Admin settings"
              >
                <Settings size={15} />
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 max-w-[1800px] mx-auto">
          {children}
        </div>
      </main>

      {/* Save System */}
      {adminState && (
        <SaveSystem
          onSave={handleSave}
          onUndo={handleUndo}
          onReset={handleReset}
          hasUnsavedChanges={adminState.hasUnsavedChanges}
          isSaving={isSaving}
          lastSaveTime={adminState.lastSaveTime}
        />
      )}
    </div>
    </LivePreviewProvider>
    </CursorProvider>
  );
}
