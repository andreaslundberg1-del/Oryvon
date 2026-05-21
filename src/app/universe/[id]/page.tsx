"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import OryndorLogo from '@/components/OryndorLogo';
import ParticleBackground from '@/components/ParticleBackground';
import { useTransitionPortal } from '@/components/TransitionManager';
import { useAudio } from '@/components/AudioManager';
import { useI18n } from '@/components/I18nProvider';
import InteractiveMap from '@/components/InteractiveMap';
import CinematicFamilyTree from '@/components/CinematicFamilyTree';
import Sidebar from '@/components/Sidebar';
import { getUniverseData } from '@/data/universeRegistry';

function hexToRgb(hex: string): string {
  const cleanHex = hex.replace('#', '');
  let r = 0, g = 0, b = 0;
  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  }
  return `${r}, ${g}, ${b}`;
}

export default function UniverseOverviewPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { playClick, playHover, playEraTransition } = useAudio();
  const { t } = useI18n();

  const data = getUniverseData(id);

  // Core Active Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'map' | 'characters' | 'familyTree' | 'factions' | 'lore' | 'events' | 'media'>('overview');

  // Master-Detail States
  const [activeCharacterId, setActiveCharacterId] = useState('');
  const [charSearch, setCharSearch] = useState('');
  const [activeCharTab, setActiveCharTab] = useState<'about' | 'relationships' | 'appearance' | 'abilities' | 'quotes'>('about');

  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const [activeFactionIndex, setActiveFactionIndex] = useState(0);
  const [activeLoreIndex, setActiveLoreIndex] = useState(0);
  const [activeEventIndex, setActiveEventIndex] = useState(0);

  // Set default active character on data load
  useEffect(() => {
    if (data.characters && data.characters.length > 0) {
      setActiveCharacterId(data.characters[0].id);
    }
  }, [data]);

  // Tab configurations — labels resolved via i18n
  const TABS = [
    { id: 'overview', labelKey: 'tab.overview' },
    { id: 'timeline', labelKey: 'tab.timeline' },
    { id: 'map', labelKey: 'tab.map' },
    { id: 'characters', labelKey: 'tab.characters' },
    { id: 'familyTree', labelKey: 'tab.familyTree' },
    { id: 'factions', labelKey: 'tab.factions' },
    { id: 'lore', labelKey: 'tab.lore' },
    { id: 'events', labelKey: 'tab.events' },
    { id: 'media', labelKey: 'tab.media' }
  ] as const;

  // Selected Active Character Data
  const activeChar = data.characters.find((c: any) => c.id === activeCharacterId) || data.characters[0];

  // Selected Active Faction Data
  const activeFaction = data.factions[activeFactionIndex] || data.factions[0];

  // Selected Active Lore Data
  const activeLore = data.lore[activeLoreIndex] || data.lore[0];

  // Selected Active Event Data
  const activeEvent = data.events[activeEventIndex] || data.events[0];

  // Filtered Characters based on search input
  const filteredCharacters = data.characters.filter((c: any) => 
    c.name.toLowerCase().includes(charSearch.toLowerCase()) || 
    c.role.toLowerCase().includes(charSearch.toLowerCase())
  );

  const accentHex = data.accentColor || '#eed078';
  const rgbString = hexToRgb(accentHex);

  return (
    <main className="w-full min-h-screen flex relative overflow-hidden bg-[#020102] text-white select-none">
      {/* Scoped Dynamic Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --uni-accent: ${accentHex};
          --uni-accent-rgb: ${rgbString};
        }
        .uni-text { color: var(--uni-accent) !important; }
        .uni-text-dim { color: rgba(var(--uni-accent-rgb), 0.55) !important; }
        .uni-text-hover:hover { color: var(--uni-accent) !important; }
        .uni-border { border-color: rgba(var(--uni-accent-rgb), 0.2) !important; }
        .uni-border-focus:focus { border-color: var(--uni-accent) !important; }
        .uni-border-hover:hover { border-color: rgba(var(--uni-accent-rgb), 0.45) !important; }
        .uni-border-hover-solid:hover { border-color: var(--uni-accent) !important; }
        .uni-border-active-full { border-color: var(--uni-accent) !important; }
        .uni-border-b { border-bottom-color: var(--uni-accent) !important; }
        .uni-bg { background-color: rgba(var(--uni-accent-rgb), 0.08) !important; }
        .uni-bg-solid { background-color: var(--uni-accent) !important; }
        .uni-bg-indicator { background-color: var(--uni-accent) !important; }
        .uni-bg-hover:hover { background-color: rgba(var(--uni-accent-rgb), 0.15) !important; }
        .uni-shadow { box-shadow: 0 0 12px var(--uni-accent) !important; }
        .uni-shadow-sm { box-shadow: 0 0 12px rgba(var(--uni-accent-rgb), 0.08) !important; }
        .uni-gradient-line { background: linear-gradient(to right, transparent, rgba(var(--uni-accent-rgb), 0.3), transparent) !important; }
        .uni-border-l { border-left-color: var(--uni-accent) !important; }
        .uni-timeline-track { background: linear-gradient(to right, rgba(var(--uni-accent-rgb), 0.1), rgba(var(--uni-accent-rgb), 0.3), transparent) !important; }
        .uni-border-dashed-1 { border-color: rgba(var(--uni-accent-rgb), 0.15) !important; }
        .uni-border-dashed-2 { border-color: rgba(var(--uni-accent-rgb), 0.08) !important; }
        .uni-gradient-bg { background-image: linear-gradient(to top right, rgba(var(--uni-accent-rgb), 0.15), transparent) !important; }
        .group:hover .uni-border-hover-solid { border-color: var(--uni-accent) !important; }
        .group\\/avatar:hover .uni-avatar-border { border-color: var(--uni-accent) !important; }
        .group\\/avatar:hover .uni-avatar-text { color: var(--uni-accent) !important; }
        .group\\/reel:hover .uni-reel-text { color: var(--uni-accent) !important; }
        .group\\/snd:hover .uni-snd-text { color: var(--uni-accent) !important; }
      ` }} />

      {/* Dynamic Ambient Background Spores */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <ParticleBackground />
      </div>

      {/* ── LEFT SIDEBAR (ORYVON Global Theme) ── */}
      <Sidebar 
        currentUniverseId={data.id}
        currentUniverseTitle={data.title}
        currentUniverseType={data.universeType}
        currentUniverseImage={data.locations[0]?.image || data.backdrop}
        activeTab={activeTab}
        onTabChange={(tab: any) => {
          playClick();
          setActiveTab(tab);
        }}
        playClick={playClick}
        playHover={playHover}
      />

      {/* ── MAIN CONTENT ZONE ── */}
      <div className="flex-1 min-h-screen flex flex-col relative z-20 overflow-y-auto">
        {/* Banner with widescreen scenery */}
        <div className="relative w-full h-[40vh] md:h-[48vh] flex flex-col justify-end">
          {/* Dark atmospheric gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020102]/85 via-transparent to-transparent z-10" />
          <img 
            src={data.backdrop} 
            alt={data.title}
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-[1.08] saturate-[0.92]"
          />

          {/* Top Breadcrumb Navigation */}
          <div className="absolute top-8 left-6 md:left-12 z-20 flex items-center gap-2.5 font-mono text-[7.5px] text-white/40 tracking-[0.3em] uppercase">
            <span className="cursor-none hover:text-white" onClick={() => router.push('/')}>ORYVON</span>
            <span>/</span>
            <span className="cursor-none hover:text-white" onClick={() => router.push('/')}>{t('uni.realms')}</span>
            <span className="uni-text font-semibold">{data.title}</span>
          </div>

          {/* Leave Realm Button */}
          <button 
            onClick={() => { playClick(); router.push('/'); }}
            className="absolute top-6 right-6 md:right-12 z-20 px-4 py-1.5 rounded-full border border-white/10 uni-border-hover bg-black/40 backdrop-blur-md font-mono text-[8px] tracking-[0.25em] text-white/60 uni-text-hover transition-all duration-300 cursor-none"
            onMouseEnter={() => playHover()}
          >
            {t('uni.leaveRealm')}
          </button>

          {/* Epic Header Title */}
          <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 pb-6 relative z-20 flex flex-col gap-2.5">
            <div className="flex items-center gap-3">
              <span className="uni-bg uni-border px-3 py-0.5 rounded font-mono text-[7.5px] uni-text tracking-[0.15em] uppercase">
                {data.universeType}
              </span>
              <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded font-mono text-[7.5px] text-white/50 tracking-[0.1em]">
                {t('uni.release')} {data.releaseYears}
              </span>
              <span className="font-mono text-[7.5px] uni-text tracking-[0.1em]">
                ★ {data.rating}
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-normal tracking-[0.22em] text-white mt-1 uppercase" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 4px 20px rgba(0,0,0,0.85)' }}>
              {data.title}
            </h1>

            <p className="font-sans text-[12px] md:text-[13px] text-white/80 max-w-2xl leading-relaxed italic font-light tracking-wide mt-2">
              "{data.tagline}"
            </p>
          </div>
        </div>

        {/* ── STICKY TAB BAR CONSOLE ── */}
        <div className="w-full border-y border-white/5 bg-[#040306]/85 backdrop-blur-md sticky top-0 z-30">
          <div className="w-full max-w-[1720px] mx-auto px-4 overflow-x-auto flex justify-between scrollbar-none">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => { playClick(); setActiveTab(tab.id); }}
                onMouseEnter={() => playHover()}
                className={`py-5 px-5 font-mono text-[8.5px] tracking-[0.25em] uppercase transition-all duration-300 border-b relative whitespace-nowrap cursor-none ${
                  activeTab === tab.id 
                    ? 'uni-text uni-border-b' 
                    : 'text-white/40 border-transparent hover:text-white/85'
                }`}
              >
                {t(tab.labelKey)}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-[20%] right-[20%] h-[1.5px] uni-bg-solid uni-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── TABS CONTENT DOCK ── */}
        <div className="flex-1 w-full max-w-[1720px] mx-auto px-6 md:px-12 py-10 relative z-20">
          <div className="w-full animate-fade-in transition-opacity duration-500">
            
            {/* ── TAB 1: OVERVIEW (Fullscreen centerpiece panel) ── */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-8 animate-fade-in w-full pb-10">
                
                {/* ROW 1: Widescreen Hero Section (2/3 width) + Map Panel (1/3 width) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                  
                  {/* Hero Showcase Panel (8 cols) */}
                  <div className="lg:col-span-8 relative h-[480px] rounded-2xl overflow-hidden border uni-border shadow-[0_24px_80px_rgba(0,0,0,0.65)] flex flex-col justify-between p-10 group bg-[#040605]">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020302] via-[#020302]/35 to-transparent z-10" />
                    <img 
                      src={data.backdrop} 
                      alt={data.title} 
                      className="absolute inset-0 w-full h-full object-cover filter brightness-[0.65] contrast-[1.08] saturate-[0.88] group-hover:scale-102 transition-transform duration-[8000ms]"
                    />
                    
                    {/* Top Breadcrumb & Title */}
                    <div className="relative z-20 flex flex-col gap-1">
                      <span className="font-mono text-[7px] uni-text tracking-[0.35em] uppercase opacity-80">REALMS › UNIVERSE PORTAL › {data.title.toUpperCase()}</span>
                      <h2 className="text-4xl md:text-5xl font-normal text-white uppercase tracking-wide font-serif leading-none mt-3" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.95)' }}>
                        {data.title}
                      </h2>
                      <p className="font-serif text-[12px] text-white/70 italic leading-relaxed max-w-xl mt-3.5">
                        "{data.description.split('.')[0]}."
                      </p>
                    </div>

                    {/* Bottom Badges & Stats Counters */}
                    <div className="relative z-20 flex flex-col gap-5">
                      {/* Tags row */}
                      <div className="flex flex-wrap gap-2">
                        <span className="uni-bg border uni-border px-2.5 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">{t('uni.legendarySaga')}</span>
                        <span className="uni-bg border uni-border px-2.5 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">{t('uni.cinematicDeck')}</span>
                        <span className="uni-bg border uni-border px-2.5 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">{t('uni.interactive')}</span>
                        <span className="bg-black/55 border border-white/5 px-2.5 py-1 rounded font-mono text-[7.5px] text-white/40 tracking-wider">{t('common.type')}: {data.universeType || 'Franchise'}</span>
                        <span className="bg-black/55 border border-white/5 px-2.5 py-1 rounded font-mono text-[7.5px] uni-text tracking-wider">{t('uni.aaaCinematic')}</span>
                      </div>

                      {/* Statistical Counters Box */}
                      <div className="grid grid-cols-5 gap-3 bg-black/45 backdrop-blur-md border border-white/5 rounded-xl p-4">
                        {[
                          { labelKey: 'stats.races', val: data.metrics?.races || '5+', icon: '🧬' },
                          { labelKey: 'stats.factions', val: data.metrics?.factions || '8+', icon: '🛡️' },
                          { labelKey: 'stats.characters', val: data.metrics?.characters || '50+', icon: '👤' },
                          { labelKey: 'stats.events', val: data.metrics?.events || '30+', icon: '📜' },
                          { labelKey: 'stats.locations', val: `${data.locations?.length || '12'}+`, icon: '📍' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2.5 border-r border-white/5 last:border-0 pr-1">
                            <span className="text-lg shrink-0">{item.icon}</span>
                            <div className="flex flex-col">
                              <span className="font-mono text-[6.5px] text-white/30 uppercase tracking-widest leading-none">{t(item.labelKey)}</span>
                              <span className="text-xs font-semibold uni-text font-serif leading-none mt-1.5">{item.val}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Map Panel (4 cols) */}
                  <div className="lg:col-span-4 h-[480px] rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between shadow-2xl relative">
                    <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
                    
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[7px] uni-text tracking-[0.3em] uppercase">{data.title.toUpperCase()} {t('map.archive')}</span>
                      <div className="h-[210px] rounded-xl overflow-hidden border border-white/5 relative mt-1.5 group">
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050406] via-transparent to-transparent z-10" />
                        <img 
                          src={data.locations[0]?.image || data.backdrop} 
                          alt="World map preview" 
                          className="w-full h-full object-cover brightness-[0.72] group-hover:scale-105 transition-transform duration-1000"
                        />
                      </div>
                      <p className="font-serif text-[11.5px] text-white/55 leading-relaxed font-light mt-2">
                        {data.description}
                      </p>
                    </div>

                    <button 
                      onClick={() => { playClick(); setActiveTab('map'); }}
                      className="w-full py-2.5 rounded border uni-border uni-border-hover uni-bg uni-text font-mono text-[8px] tracking-[0.25em] uppercase cursor-none transition-colors"
                    >
                      {t('uni.viewWorldMap')}
                    </button>
                  </div>

                </div>

                {/* ROW 2: The Story (1/3) + Featured Location (1/3) + Latest Event (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full">
                  
                  {/* Card 1: Story So Far */}
                  <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative min-h-[220px]">
                    <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[7px] uni-text uppercase tracking-widest block">{t('uni.storySoFar')}</span>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <p className="col-span-2 font-serif text-[11px] text-white/60 leading-relaxed font-light">
                          {data.description.split('.')[1] ? `${data.description.split('.')[1]}.` : data.description}
                        </p>
                        <div className="h-[90px] rounded-lg overflow-hidden border border-white/5 relative">
                          <img src={data.backdrop} alt="Story visual" className="w-full h-full object-cover filter brightness-[0.7]" />
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { playClick(); setActiveTab('timeline'); }}
                      className="w-fit py-1.5 px-4 rounded border border-white/10 uni-border-hover bg-white/[0.01] hover:uni-bg text-white/70 hover:uni-text font-mono text-[8.5px] tracking-wider cursor-none transition-colors"
                    >
                      {t('uni.exploreTimeline')}
                    </button>
                  </div>

                  {/* Card 2: Featured Location */}
                  <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative min-h-[220px]">
                    <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[7px] uni-text uppercase tracking-widest block">{t('uni.featuredLocation')}</span>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <p className="col-span-2 font-serif text-[11px] text-white/60 leading-relaxed font-light">
                          {data.locations[0]?.name ? `${data.locations[0].name}: ${data.locations[0].desc}` : 'Explore the key landmarks that define the boundary of this legendary world.'}
                        </p>
                        <div className="h-[90px] rounded-lg overflow-hidden border border-white/5 relative">
                          <img src={data.locations[0]?.image || data.backdrop} alt="Featured Location" className="w-full h-full object-cover filter brightness-[0.7]" />
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { playClick(); setActiveTab('map'); }}
                      className="w-fit py-1.5 px-4 rounded border border-white/10 uni-border-hover bg-white/[0.01] hover:uni-bg text-white/70 hover:uni-text font-mono text-[8.5px] tracking-wider cursor-none transition-colors"
                    >
                      EXPLORE LOCATION ›
                    </button>
                  </div>

                  {/* Card 3: Latest Event */}
                  <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative min-h-[220px]">
                    <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
                    <div className="flex flex-col gap-3">
                      <span className="font-mono text-[7px] uni-text uppercase tracking-widest block">{t('uni.latestEvent')}</span>
                      <div className="grid grid-cols-3 gap-4 items-center">
                        <p className="col-span-2 font-serif text-[11px] text-white/60 leading-relaxed font-light">
                          {data.events[0]?.title ? `${data.events[0].title}: ${data.events[0].desc.substring(0, 80)}...` : 'The turning points of history that defined eras and shaped the current realm.'}
                        </p>
                        <div className="h-[90px] rounded-lg overflow-hidden border border-white/5 relative">
                          <img src={data.events[0]?.image || data.backdrop} alt="Event visual" className="w-full h-full object-cover filter brightness-[0.7]" />
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => { playClick(); setActiveTab('timeline'); }}
                      className="w-fit py-1.5 px-4 rounded border border-white/10 uni-border-hover bg-white/[0.01] hover:uni-bg text-white/70 hover:uni-text font-mono text-[8.5px] tracking-wider cursor-none transition-colors"
                    >
                      VIEW EVENT ›
                    </button>
                  </div>

                </div>

                {/* ROW 3: Main Factions (1/3) + Popular Characters (1/3) + Media Gallery (1/3) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch w-full">
                  
                  {/* Card 1: Main Factions */}
                  <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative">
                    <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
                    
                    <div className="flex flex-col gap-4">
                      <span className="font-mono text-[7.5px] uni-text uppercase tracking-widest block">MAIN FACTIONS</span>
                      <div className="flex flex-col gap-3">
                        {data.factions?.slice(0, 4).map((fac: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded border border-white/5 bg-black/40">
                            <div className="flex items-center gap-3">
                              <span className="text-xl shrink-0">{fac.emblem || '🛡️'}</span>
                              <div className="flex flex-col">
                                <span className="text-[10px] font-semibold text-white/90 font-serif leading-none">{fac.name}</span>
                                <span className="font-mono text-[6.5px] text-white/30 uppercase tracking-widest leading-none mt-1">{fac.leader || 'Realm Leader'}</span>
                              </div>
                            </div>
                            <span className="font-mono text-[7px] uni-text uppercase opacity-70">ACTIVE</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => { playClick(); setActiveTab('factions'); }}
                      className="w-full py-2 rounded border border-white/10 uni-border-hover bg-white/[0.01] hover:uni-bg text-white/70 hover:uni-text font-mono text-[8.5px] tracking-wider cursor-none transition-colors"
                    >
                      VIEW ALL FACTIONS ›
                    </button>
                  </div>

                  {/* Card 2: Popular Characters */}
                  <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative">
                    <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
                    
                    <div className="flex flex-col gap-4">
                      <span className="font-mono text-[7.5px] uni-text uppercase tracking-widest block">POPULAR CHARACTERS</span>
                      <div className="grid grid-cols-5 gap-2 pb-1">
                        {data.characters?.slice(0, 5).map((char: any, idx: number) => (
                          <button
                            key={idx}
                            onClick={() => { playClick(); setActiveCharacterId(char.id); setActiveTab('characters'); }}
                            className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none cursor-none"
                          >
                            <div className="w-10 h-10 rounded-lg border border-white/10 uni-border-hover-solid bg-black/60 overflow-hidden relative shadow-[0_2px_8px_rgba(0,0,0,0.5)] transition-all duration-300 flex items-center justify-center">
                              <img src={char.image || data.backdrop} alt={char.name} className="w-full h-full object-cover filter brightness-[0.8] group-hover:scale-105 transition-transform animate-fade-in" />
                            </div>
                            <div className="flex flex-col items-center leading-none text-center">
                              <span className="text-[7.5px] font-serif text-white/80 group-hover:uni-text truncate w-14 font-semibold">{char.name.split(' ')[0]}</span>
                              <span className="text-[6px] font-mono text-white/30 truncate w-14 block mt-0.5">{char.role.split(',')[0]}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => { playClick(); setActiveTab('characters'); }}
                      className="w-full py-2 rounded border border-white/10 uni-border-hover bg-white/[0.01] hover:uni-bg text-white/70 hover:uni-text font-mono text-[8.5px] tracking-wider cursor-none transition-colors"
                    >
                      VIEW ALL CHARACTERS ›
                    </button>
                  </div>

                  {/* Card 3: Media Gallery */}
                  <div className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex flex-col justify-between gap-5 shadow-2xl relative">
                    <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
                    
                    <div className="flex flex-col gap-4">
                      <span className="font-mono text-[7.5px] uni-text uppercase tracking-widest block">MEDIA GALLERY</span>
                      <div className="grid grid-cols-4 gap-2.5 h-[100px] overflow-hidden">
                        {data.locations?.slice(0, 8).map((loc: any, idx: number) => (
                          <div key={idx} className="h-10 rounded border border-white/5 overflow-hidden relative shadow group">
                            <img src={loc.image} alt={loc.name} className="w-full h-full object-cover filter brightness-[0.7] group-hover:scale-105 transition-transform" />
                          </div>
                        ))}
                      </div>
                      {/* Media counter row */}
                      <div className="grid grid-cols-4 gap-2 text-center bg-black/45 border border-white/5 rounded-lg py-1.5 px-1">
                        <div className="flex flex-col">
                          <span className="font-mono text-[6px] text-white/30">IMAGES</span>
                          <span className="text-[8px] font-semibold uni-text leading-none mt-1">450+</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-[6px] text-white/30">VIDEOS</span>
                          <span className="text-[8px] font-semibold uni-text leading-none mt-1">80+</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-[6px] text-white/30">DOCS</span>
                          <span className="text-[8px] font-semibold uni-text leading-none mt-1">94+</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="font-mono text-[6px] text-white/30">AUDIO</span>
                          <span className="text-[8px] font-semibold uni-text leading-none mt-1">12+</span>
                        </div>
                      </div>
                    </div>

                    <button 
                      onClick={() => { playClick(); setActiveTab('media'); }}
                      className="w-full py-2 rounded border border-white/10 uni-border-hover bg-white/[0.01] hover:uni-bg text-white/70 hover:uni-text font-mono text-[8.5px] tracking-wider cursor-none transition-colors"
                    >
                      BROWSE GALLERY ›
                    </button>
                  </div>

                </div>

                {/* ROW 4: Horizontal Timeline Axis */}
                <div className="col-span-12 rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-6 flex items-center justify-between gap-8 shadow-2xl relative">
                  <div className="absolute top-0 left-6 right-6 h-[1.5px] uni-gradient-line" />
                  
                  <div className="flex flex-col gap-1 w-full max-w-4xl">
                    <span className="font-mono text-[7.5px] uni-text uppercase tracking-widest">THE TIMELINE OF {data.title.toUpperCase()}</span>
                    <p className="font-serif text-[11px] text-white/45">Explore the milestones that defined the trajectory of this universe.</p>
                    
                    {/* Timeline track */}
                    <div className="flex items-center justify-between relative mt-5 py-4 w-full">
                      <div className="absolute left-0 right-0 h-[1.5px] uni-timeline-track z-0" />
                      {data.events?.slice(0, 7).map((node: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-center gap-2 relative z-10 group">
                          <div className="w-3.5 h-3.5 rounded-full border border-white/15 bg-neutral-900 group-hover:uni-border-hover-solid group-hover:scale-110 flex items-center justify-center transition-all duration-300 shadow-[0_0_8px_rgba(var(--uni-accent-rgb),0.1)]">
                            <div className="w-1.5 h-1.5 rounded-full uni-bg-solid" />
                          </div>
                          <div className="flex flex-col items-center leading-none text-center">
                            <span className="text-[7.5px] font-serif text-white/70 group-hover:uni-text w-20 truncate">{node.title}</span>
                            <span className="text-[6.5px] font-mono uni-text-dim mt-1 uppercase tracking-widest">{node.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button 
                    onClick={() => { playClick(); setActiveTab('timeline'); }}
                    className="shrink-0 py-3.5 px-6 rounded border border-white/15 uni-border-hover uni-bg uni-text font-mono text-[8.5px] tracking-widest uppercase cursor-none transition-colors"
                  >
                    VIEW FULL TIMELINE ›
                  </button>
                </div>

              </div>
            )}

            {/* ── TAB 2: TIMELINE (Interactive Master-Detail) ── */}
            {activeTab === 'timeline' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                {/* Left Event list scroll */}
                <div className="lg:col-span-1 flex flex-col gap-3 max-h-[560px] overflow-y-auto pr-2 scrollbar-thin">
                  {data.events.map((ev: any, idx: number) => (
                    <button
                      key={ev.id}
                      onClick={() => { playClick(); setActiveTimelineIndex(idx); }}
                      className={`p-4 rounded-lg border text-left transition-all duration-300 flex flex-col gap-1.5 cursor-none ${
                        activeTimelineIndex === idx 
                          ? 'uni-border-active-full uni-bg uni-text uni-shadow-sm' 
                          : 'border-white/5 bg-[#050407] text-white/60 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <span className="font-mono text-[7px] uni-text uppercase tracking-widest">{ev.date}</span>
                      <span className="text-[11px] font-semibold tracking-wide truncate block">{ev.title}</span>
                    </button>
                  ))}
                </div>

                {/* Right detailed landscape slide */}
                <div className="lg:col-span-2 p-8 rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col gap-6 min-h-[460px] shadow-2xl">
                  {data.events[activeTimelineIndex] && (
                    <>
                      <div className="relative w-full h-[280px] rounded-lg overflow-hidden border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                        <img 
                          src={data.events[activeTimelineIndex].image} 
                          alt={data.events[activeTimelineIndex].title} 
                          className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
                        />
                        <span className="absolute bottom-4 left-4 z-20 font-mono text-[8px] uni-text tracking-[0.2em] uppercase">
                          {data.events[activeTimelineIndex].date}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-normal tracking-wide text-white uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                          {data.events[activeTimelineIndex].title}
                        </h3>
                        <p className="font-sans text-[13px] text-white/65 leading-relaxed font-light mt-1">
                          {data.events[activeTimelineIndex].desc}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 3: GEOGRAPHIC MAP ── */}
            {activeTab === 'map' && (
              <InteractiveMap universeId={data.id} />
            )}

            {/* ── TAB 4: CHARACTERS (Immersive Widescreen 3-Pane Layout) ── */}
            {activeTab === 'characters' && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch w-full min-h-[580px]">
                {/* 1. Left Sidebar List (Width: 20%) */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  {/* Search input */}
                  <div className="relative">
                    <input 
                      type="text" 
                      value={charSearch}
                      onChange={(e) => setCharSearch(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-lg border border-white/10 bg-black/60 font-mono text-[9px] tracking-wider text-white focus:outline-none focus:uni-border-focus"
                      placeholder={t('char.search')}
                    />
                    <span className="absolute right-3.5 top-3 text-[10px] opacity-40">🔍</span>
                  </div>

                  {/* Character scroll list */}
                  <div className="flex flex-col gap-2 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin">
                    {filteredCharacters.map((char: any) => (
                      <button
                        key={char.id}
                        onClick={() => { playClick(); setActiveCharacterId(char.id); }}
                        className={`p-3.5 rounded-lg border text-left transition-all duration-300 flex items-center gap-3.5 cursor-none ${
                          activeCharacterId === char.id
                            ? 'uni-border-active-full uni-bg uni-text uni-shadow-sm'
                            : 'border-white/5 bg-[#050407] text-white/60 hover:text-white hover:bg-white/[0.02]'
                        }`}
                      >
                        <div 
                          className="w-8 h-8 rounded-full border flex items-center justify-center text-sm bg-black/50 shrink-0"
                          style={{ borderColor: activeCharacterId === char.id ? 'var(--uni-accent)' : 'rgba(255,255,255,0.08)' }}
                        >
                          {char.relationships[0]?.avatar || '👤'}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-[11.5px] font-semibold truncate block leading-tight">{char.name}</span>
                          <span className="font-mono text-[7px] uni-text-dim uppercase tracking-widest truncate block mt-0.5">{char.role}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Middle Panel: Massive Portrait Card (Width: 45%) */}
                <div className="lg:col-span-2 relative rounded-xl overflow-hidden border border-white/5 uni-border shadow-[0_24px_80px_rgba(0,0,0,0.65)] bg-[#09080a] flex flex-col justify-end p-8 group">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/30 to-transparent z-10" />
                  <img 
                    src={data.backdrop} 
                    alt={activeChar?.name} 
                    className="absolute inset-0 w-full h-full object-cover filter brightness-[0.72] contrast-[1.08] saturate-[0.88] group-hover:scale-102 transition-transform duration-1000"
                  />
                  <div className="relative z-20 flex flex-col gap-2">
                    <span className="font-mono text-[8px] uni-text uppercase tracking-[0.25em]">{activeChar?.role}</span>
                    <h3 className="text-3xl font-normal text-white uppercase tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                      {activeChar?.name}
                    </h3>
                  </div>
                </div>

                {/* 3. Right Panel: Comprehensive Stats & Bio (Width: 35%) */}
                <div className="lg:col-span-2 p-6 rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col justify-between gap-5 shadow-2xl">
                  {activeChar && (
                    <>
                      {/* Quote section */}
                      <div className="p-4 rounded-lg bg-black/40 border border-white/5 uni-border-l border-l-2">
                        <p className="font-sans text-[11px] text-white/70 italic leading-relaxed">
                          "{activeChar.quote}"
                        </p>
                      </div>

                      {/* Stats Table */}
                      <div className="grid grid-cols-2 gap-3.5 bg-black/35 p-4 rounded-lg border border-white/5">
                        {Object.entries(activeChar.stats).map(([k, v]) => (
                          <div key={k} className="flex flex-col gap-0.5 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                            <span className="font-mono text-[7px] text-white/35 uppercase tracking-widest">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-[10px] text-white/85 font-medium">{v as any}</span>
                          </div>
                        ))}
                      </div>

                      {/* Sub-tabs Row */}
                      <div className="flex border-b border-white/5">
                        {(['about', 'relationships', 'appearance', 'abilities', 'quotes'] as const).map(tabKey => (
                          <button
                            key={tabKey}
                            onClick={() => setActiveCharTab(tabKey)}
                            className={`pb-2.5 px-3 font-mono text-[7.5px] uppercase tracking-widest cursor-none border-b transition-colors ${
                              activeCharTab === tabKey 
                                ? 'uni-text uni-border-b' 
                                : 'text-white/30 border-transparent hover:text-white/60'
                            }`}
                          >
                            {t(`char.${tabKey}`)}
                          </button>
                        ))}
                      </div>

                      {/* Content bio */}
                      <div className="p-1 min-h-[100px]">
                        <p className="font-sans text-[11.5px] text-white/60 leading-relaxed font-light">
                          {activeChar.tabs[activeCharTab]}
                        </p>
                      </div>

                      {/* Key relationships avatars */}
                      <div className="flex flex-col gap-2.5 mt-2">
                        <span className="font-mono text-[7px] text-white/35 tracking-widest uppercase">Key Connections</span>
                        <div className="flex gap-3">
                          {activeChar.relationships.map((rel: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (rel.charId) {
                                  playClick();
                                  setActiveCharacterId(rel.charId);
                                }
                              }}
                              className="group/avatar flex flex-col items-center gap-1 cursor-none focus:outline-none"
                            >
                              <div className="w-8 h-8 rounded-full border border-white/10 uni-avatar-border bg-black/50 flex items-center justify-center text-sm transition-colors duration-300">
                                {rel.avatar}
                              </div>
                              <span className="text-[7.5px] text-white/50 uni-avatar-text truncate max-w-[50px] font-sans">{rel.name.split(' ')[0]}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 5: FAMILY TREE ── */}
            {activeTab === 'familyTree' && (
              <CinematicFamilyTree
                title={data.familyTree.title}
                members={data.familyTree.members}
                accentColor={data.accentColor}
                onViewCharacter={(charId) => {
                  setActiveCharacterId(charId);
                  setActiveTab('characters');
                }}
              />
            )}

            {/* ── TAB 6: FACTIONS (Master-Detail Sidebar) ── */}
            {activeTab === 'factions' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                {/* Left Factions list */}
                <div className="lg:col-span-1 flex flex-col gap-3">
                  {data.factions.map((fac: any, idx: number) => (
                    <button
                      key={fac.id}
                      onClick={() => { playClick(); setActiveFactionIndex(idx); }}
                      className={`p-4 rounded-lg border text-left transition-all duration-300 flex items-center justify-between cursor-none ${
                        activeFactionIndex === idx 
                          ? 'uni-border-active-full uni-bg uni-text uni-shadow-sm' 
                          : 'border-white/5 bg-[#050407] text-white/60 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="flex flex-col gap-1">
                        <span className="text-[12px] font-semibold tracking-wide block">{fac.name}</span>
                        <span className="font-mono text-[7px] uni-text-dim uppercase tracking-widest block">OPERATIONAL LEDGER</span>
                      </div>
                      <span className="text-xl shrink-0">{fac.emblem}</span>
                    </button>
                  ))}
                </div>

                {/* Right detailed information */}
                <div className="lg:col-span-2 p-6 rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col gap-6 shadow-2xl">
                  {activeFaction && (
                    <>
                      {/* Crest & header block */}
                      <div className="flex flex-col md:flex-row items-center gap-6 border-b border-white/5 pb-5">
                        <div className="w-16 h-16 rounded-full border uni-border-active-full uni-bg flex items-center justify-center text-3xl shadow-[0_0_20px_rgba(var(--uni-accent-rgb),0.15)] animate-pulse shrink-0">
                          {activeFaction.emblem}
                        </div>
                        <div className="flex flex-col gap-1 text-center md:text-left">
                          <h3 className="text-xl font-normal text-white uppercase tracking-wide" style={{ fontFamily: "'Cinzel', serif" }}>
                            {activeFaction.name}
                          </h3>
                          <span className="font-mono text-[7.5px] uni-text tracking-[0.2em] uppercase">Sovereign alignment</span>
                        </div>
                      </div>

                      {/* Description info */}
                      <p className="font-sans text-[12.5px] text-white/65 leading-relaxed font-light">
                        {activeFaction.desc}
                      </p>

                      {/* Leader details */}
                      <div className="grid grid-cols-2 gap-4 bg-black/40 p-4 rounded-lg border border-white/5">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[7px] text-white/35 uppercase tracking-widest">Grand Commander / Leader</span>
                          <span className="text-[10px] text-white/80 font-medium">{activeFaction.leader}</span>
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-[7px] text-white/35 uppercase tracking-widest">Base coordinates</span>
                          <span className="text-[10px] text-white/80 font-medium">{activeFaction.base}</span>
                        </div>
                      </div>

                      {/* Key members avatars */}
                      <div className="flex flex-col gap-2.5">
                        <span className="font-mono text-[7px] text-white/35 tracking-widest uppercase">Prominent Members</span>
                        <div className="flex gap-3">
                          {activeFaction.members.map((mem: any, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => {
                                if (mem.charId) {
                                  playClick();
                                  setActiveCharacterId(mem.charId);
                                  setActiveTab('characters');
                                }
                              }}
                              className="group/avatar flex items-center gap-2 p-2 rounded border border-white/5 uni-border-hover-solid bg-black/30 cursor-none transition-colors"
                            >
                              <div className="w-6 h-6 rounded-full border border-white/10 uni-avatar-border flex items-center justify-center text-xs bg-black/60 shrink-0">
                                {mem.avatar}
                              </div>
                              <div className="flex flex-col max-w-[80px]">
                                <span className="text-[8px] text-white/70 uni-avatar-text truncate font-semibold">{mem.name.split(' ')[0]}</span>
                                <span className="text-[6.5px] text-white/30 truncate font-mono uppercase mt-0.5">{mem.role}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 7: LORE STUDIES (Interactive Relic Showcase with Dashed Radar) ── */}
            {activeTab === 'lore' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                {/* Left Lore list */}
                <div className="lg:col-span-1 flex flex-col gap-3">
                  {data.lore.map((l: any, idx: number) => (
                    <button
                      key={l.id}
                      onClick={() => { playClick(); setActiveLoreIndex(idx); }}
                      className={`p-4 rounded-lg border text-left transition-all duration-300 flex flex-col gap-1 cursor-none ${
                        activeLoreIndex === idx 
                          ? 'uni-border-active-full uni-bg uni-text uni-shadow-sm' 
                          : 'border-white/5 bg-[#050407] text-white/60 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <span className="text-[12px] font-semibold tracking-wide block">{l.title}</span>
                      <span className="font-mono text-[7px] uni-text-dim uppercase tracking-widest block">Scroll Manuscript</span>
                    </button>
                  ))}
                </div>

                {/* Right detailed narrative relic card */}
                <div className="lg:col-span-2 p-8 rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col gap-6 shadow-2xl items-center relative overflow-hidden min-h-[480px]">
                  {activeLore && (
                    <>
                      {/* Decorative glowing circular radar background */}
                      {activeLore.circularRadar && (
                        <div className="absolute top-[10%] w-80 h-80 border border-dashed uni-border-dashed-1 rounded-full animate-spin [animation-duration:45s] pointer-events-none flex items-center justify-center z-0">
                          <div className="w-[85%] h-[85%] border border-dashed uni-border-dashed-2 rounded-full" />
                        </div>
                      )}

                      {/* Glowing relic show */}
                      <div className="w-36 h-36 rounded-full border uni-border uni-gradient-bg flex items-center justify-center text-5xl shadow-[0_0_40px_rgba(var(--uni-accent-rgb),0.15)] relative z-10 mt-6">
                        👑
                      </div>

                      {/* Lore text info */}
                      <div className="flex flex-col gap-2 text-center relative z-10 max-w-lg mt-2">
                        <span className="font-mono text-[7.5px] uni-text uppercase tracking-[0.3em]">Featured Relic / Chronicle</span>
                        <h3 className="text-2xl font-normal text-white uppercase tracking-wide mt-1" style={{ fontFamily: "'Cinzel', serif" }}>
                          {activeLore.title}
                        </h3>
                        <p className="font-sans text-[13px] text-white/60 leading-relaxed font-light mt-3">
                          {activeLore.desc}
                        </p>
                      </div>

                      <div className="w-full h-px bg-white/5 mt-4 relative z-10" />

                      <span className="font-mono text-[7px] text-white/25 tracking-widest uppercase relative z-10">
                        Manuscript Record // ORYVON-LORE-{activeLore.id.toUpperCase()}
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 8: HISTORICAL EVENTS ── */}
            {activeTab === 'events' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start w-full">
                {/* Left Event list scroll */}
                <div className="lg:col-span-1 flex flex-col gap-3">
                  {data.events.map((ev: any, idx: number) => (
                    <button
                      key={ev.id}
                      onClick={() => { playClick(); setActiveEventIndex(idx); }}
                      className={`p-4 rounded-lg border text-left transition-all duration-300 flex flex-col gap-1 cursor-none ${
                        activeEventIndex === idx 
                          ? 'uni-border-active-full uni-bg uni-text uni-shadow-sm' 
                          : 'border-white/5 bg-[#050407] text-white/60 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      <span className={`font-mono text-[7px] uppercase tracking-widest ${activeEventIndex === idx ? 'uni-text' : 'uni-text-dim'}`}>{ev.date}</span>
                      <span className="text-[11px] font-semibold tracking-wide truncate block">{ev.title}</span>
                    </button>
                  ))}
                </div>

                {/* Right detailed landscape slide */}
                <div className="lg:col-span-2 p-8 rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col gap-5 min-h-[460px] shadow-2xl w-full">
                  {activeEvent && (
                    <>
                      <div className="relative w-full h-[280px] rounded-lg overflow-hidden border border-white/5">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                        <img 
                          src={activeEvent.image} 
                          alt={activeEvent.title} 
                          className="w-full h-full object-cover filter brightness-[0.7] contrast-[1.05]"
                        />
                        <span className="absolute bottom-4 left-4 z-20 font-mono text-[8px] uni-text tracking-[0.2em] uppercase font-semibold">
                          {activeEvent.date}
                        </span>
                      </div>

                      <div className="flex flex-col gap-2">
                        <h3 className="text-2xl font-normal tracking-wide text-white uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                          {activeEvent.title}
                        </h3>
                        <p className="font-sans text-[13px] text-white/65 leading-relaxed font-light mt-1">
                          {activeEvent.desc}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* ── TAB 9: MEDIA ARCHIVES (High density structured columns) ── */}
            {activeTab === 'media' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch w-full">
                {/* Column 1: Cinematic Images & Artifacts */}
                <div className="p-6 rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col gap-5 shadow-2xl">
                  <div className="border-b border-white/5 pb-3">
                    <span className="font-mono text-[7px] uni-text uppercase tracking-widest">Images & Relics</span>
                    <h4 className="text-[11.5px] font-semibold text-white/90 tracking-wide mt-0.5 uppercase">MANUSCRIPT VISUALS</h4>
                  </div>

                  <div className="flex flex-col gap-4 flex-1 overflow-y-auto max-h-[380px] scrollbar-none">
                    {data.media.images.map((img: any, idx: number) => (
                      <div key={idx} className="group/item relative h-32 rounded-lg overflow-hidden border border-white/5 flex flex-col justify-end p-4">
                        <img src={img.url} alt={img.title} className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover/item:opacity-55 transition-opacity duration-300" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent z-10" />
                        <span className="relative z-20 text-[9.5px] font-medium text-white/90 truncate leading-snug">{img.title}</span>
                      </div>
                    ))}
                    {data.media.artifacts.map((art: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 rounded bg-white/[0.01] border border-white/5 text-[9.5px]">
                        <span className="text-white/65 font-sans">Relic: {art.title}</span>
                        <span className="font-mono uni-text font-semibold text-[8px]">{art.count} Unit</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 2: Video Broadcasts & reels */}
                <div className="p-6 rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col gap-5 shadow-2xl">
                  <div className="border-b border-white/5 pb-3">
                    <span className="font-mono text-[7px] uni-text uppercase tracking-widest">Broadcast Reels</span>
                    <h4 className="text-[11.5px] font-semibold text-white/90 tracking-wide mt-0.5 uppercase">VIDEO ARCHIVES</h4>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[380px] scrollbar-none">
                    {data.media.videos.map((vid: any, idx: number) => (
                      <div key={idx} className="group/reel p-4 rounded-lg border border-white/5 uni-border-hover bg-black/40 hover:bg-black/60 flex items-center justify-between transition-all duration-300">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-white/80 font-medium group-hover/reel:text-amber-200 uni-reel-text truncate max-w-[150px] block">{vid.title}</span>
                          <span className="font-mono text-[7px] text-white/35">Duration: {vid.duration}</span>
                        </div>
                        <button onClick={() => playClick()} className="w-7 h-7 rounded-full border border-white/10 uni-border-hover-solid bg-black/60 flex items-center justify-center text-[10px] uni-text-hover cursor-none transition-colors">
                          ▶
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Column 3: Soundtracks & Book scroll details */}
                <div className="p-6 rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col gap-5 shadow-2xl">
                  <div className="border-b border-white/5 pb-3">
                    <span className="font-mono text-[7px] uni-text uppercase tracking-widest">Orchestral Flutes</span>
                    <h4 className="text-[11.5px] font-semibold text-white/90 tracking-wide mt-0.5 uppercase">SOUNDTRACKS & MANUSCRIPTS</h4>
                  </div>

                  <div className="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[380px] scrollbar-none">
                    {data.media.soundtracks.map((snd: any, idx: number) => (
                      <div key={idx} className="group/snd p-4 rounded-lg border border-white/5 uni-border-hover bg-black/40 hover:bg-black/60 flex items-center justify-between transition-all duration-300">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] text-white/80 font-medium group-hover/snd:text-amber-200 uni-snd-text truncate max-w-[150px] block">{snd.title}</span>
                          <span className="font-mono text-[7px] text-white/35">Duration: {snd.duration}</span>
                        </div>
                        <button onClick={() => playClick()} className="w-7 h-7 rounded-full border border-white/10 uni-border-hover-solid bg-black/60 flex items-center justify-center text-[10px] uni-text-hover cursor-none transition-colors">
                          ▶
                        </button>
                      </div>
                    ))}
                    {data.media.documents.map((doc: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-3.5 rounded bg-white/[0.01] border border-white/5 text-[9.5px] mt-2">
                        <span className="text-white/60 font-sans truncate max-w-[130px] block">Book: {doc.title}</span>
                        <span className="font-mono uni-text font-semibold text-[7px]">{doc.count} copy</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
