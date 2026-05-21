"use client";

import React from "react";
import { useRouter } from "next/navigation";
import OryndorLogo from "./OryndorLogo";
import { useI18n } from "./I18nProvider";

interface SidebarProps {
  currentUniverseId?: string;
  currentUniverseTitle?: string;
  currentUniverseType?: string;
  currentUniverseImage?: string;
  activeTab?: string;
  onTabChange?: (tab: any) => void;
  selectedGenre?: string | null;
  onGenreSelect?: (genre: any) => void;
  playClick?: () => void;
  playHover?: () => void;
}

export default function Sidebar({
  currentUniverseId,
  currentUniverseTitle,
  currentUniverseType,
  currentUniverseImage,
  activeTab,
  onTabChange,
  selectedGenre,
  onGenreSelect,
  playClick = () => {},
  playHover = () => {},
}: SidebarProps) {
  const router = useRouter();
  const { t } = useI18n();

  // Navigation menu definitions — labels resolved via i18n
  const NAV_ITEMS = [
    { labelKey: "nav.home", href: "/", icon: "🪐" },
    { labelKey: "nav.explore", href: "/", icon: "🗺️", isExplore: true },
    { labelKey: "nav.library", tab: "overview", icon: "📚", universeOnly: true },
    { labelKey: "nav.timeline", tab: "timeline", icon: "⏳", universeOnly: true },
    { labelKey: "nav.map", tab: "map", icon: "🧭", universeOnly: true },
    { labelKey: "nav.factions", tab: "factions", icon: "🛡️", universeOnly: true },
    { labelKey: "nav.characters", tab: "characters", icon: "👤", universeOnly: true },
    { labelKey: "nav.lore", tab: "lore", icon: "📜", universeOnly: true },
    { labelKey: "nav.media", tab: "media", icon: "🖼️", universeOnly: true },
    { labelKey: "nav.community", href: "/", icon: "👥" },
    { labelKey: "nav.settings", href: "/", icon: "⚙️" },
  ];

  const handleItemClick = (item: typeof NAV_ITEMS[0]) => {
    playClick();
    if (item.href) {
      if (onGenreSelect && item.isExplore) {
        onGenreSelect(null);
      }
      router.push(item.href);
    } else if (item.tab && onTabChange) {
      onTabChange(item.tab);
    }
  };

  return (
    <aside className="w-[260px] hidden xl:flex flex-col justify-between border-r border-white/5 bg-[#030204]/95 backdrop-blur-2xl relative z-40 p-6 select-none shrink-0 h-screen sticky top-0">
      <div className="flex flex-col gap-6 overflow-y-auto scrollbar-none">
        {/* ORYVON Branding with Glowing Gold Logo */}
        <div
          className="flex flex-col cursor-none group"
          onClick={() => {
            playClick();
            if (onGenreSelect) onGenreSelect(null);
            router.push("/");
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg tracking-[0.25em] text-white font-normal group-hover:text-white/80 uni-text-hover transition-colors">
              O R Y V O N
            </span>
          </div>
          <span className="font-mono text-[7px] text-white/30 tracking-[0.4em] uppercase mt-1">
            THE DIMENSIONAL ARCHIVE
          </span>
        </div>

        {/* Global Navigation Menu */}
        <nav className="flex flex-col gap-0.5 mt-2">
          {NAV_ITEMS.map((item, idx) => {
            // If the item is marked as universe-only and we are not currently in a universe view, hide it
            if (item.universeOnly && !currentUniverseId) return null;

            const isTabActive = item.tab && activeTab === item.tab;
            const isHomeActive = !currentUniverseId && item.labelKey === "nav.home";

            const active = isTabActive || isHomeActive;

            return (
              <button
                key={idx}
                onClick={() => handleItemClick(item)}
                onMouseEnter={playHover}
                className={`sidebar-item group flex items-center gap-3.5 px-3 py-2 rounded text-[8px] font-mono tracking-[0.2em] uppercase transition-all duration-300 border border-transparent cursor-none text-left w-full ${
                  active
                    ? "uni-text uni-bg font-bold border-l uni-border-l"
                    : "text-white/40 hover:text-white hover:bg-white/[0.02]"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    active
                      ? "uni-bg-indicator uni-shadow"
                      : "bg-white/10 group-hover:uni-bg-indicator"
                  }`}
                />
                <span className="shrink-0">{item.icon}</span>
                <span>{t(item.labelKey)}</span>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Contextual Content (Current Universe Box) */}
        {currentUniverseId && currentUniverseTitle && (
          <>
            {/* Divider */}
            <div className="h-[1px] bg-gradient-to-r from-transparent via-[rgba(var(--uni-accent-rgb),0.2)] to-transparent" />

            <div className="flex flex-col gap-2.5">
              <span className="font-mono text-[7px] tracking-[0.35em] uppercase text-white/30 px-3">
                CURRENT REALM
              </span>
              <div
                className="relative rounded-xl overflow-hidden border border-white/5 uni-border bg-[#050406] p-3 flex flex-col gap-2.5 shadow-xl group cursor-none"
                onClick={() => {
                  playClick();
                  if (onTabChange) onTabChange("overview");
                }}
              >
                <div className="h-16 rounded overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                  {currentUniverseImage && (
                    <img
                      src={currentUniverseImage}
                      alt={currentUniverseTitle}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.7]"
                    />
                  )}
                </div>
                <div className="flex flex-col leading-none">
                  <span className="font-serif text-[10.5px] text-white/95 group-hover:uni-text transition-colors">
                    {currentUniverseTitle}
                  </span>
                  <span className="text-[7.5px] font-mono uni-text-dim tracking-widest mt-1 uppercase">
                    {currentUniverseType || "PORTAL"}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Elegant, Minimal Footer */}
      <div className="flex flex-col gap-2.5 pt-4 border-t border-white/5">
        <div className="text-center font-mono text-[6.5px] text-white/20 tracking-[0.3em] uppercase">
          ORYVON COGNITIVE PLATFORM
        </div>
        <div className="text-center font-mono text-[5.5px] text-white/10 tracking-[0.2em]">
          SECURE SEC-LEVEL 9 CORE // ENCRYPTED
        </div>
      </div>
    </aside>
  );
}
