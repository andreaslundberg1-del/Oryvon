"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAudio } from '@/components/AudioManager';
import { getUniverseData } from '@/data/universeRegistry';

// ─── Accent color helper ───────────────────────────────────────────────────────
function hexToRgb(hex: string): string {
  const c = hex.replace('#', '');
  const full = c.length === 3 ? c.split('').map(x => x + x).join('') : c;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

// ─── Drag-scroll horizontal row ───────────────────────────────────────────────
function ScrollRow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const startX = useRef(0);
  const sl = useRef(0);
  return (
    <div
      ref={ref}
      className={`flex gap-4 overflow-x-auto pb-2 ${className}`}
      style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      onMouseDown={e => { drag.current = true; startX.current = e.pageX - (ref.current?.offsetLeft ?? 0); sl.current = ref.current?.scrollLeft ?? 0; }}
      onMouseMove={e => { if (!drag.current || !ref.current) return; e.preventDefault(); ref.current.scrollLeft = sl.current - (e.pageX - ref.current.offsetLeft - startX.current); }}
      onMouseUp={() => { drag.current = false; }}
      onMouseLeave={() => { drag.current = false; }}
    >
      {children}
    </div>
  );
}

// ─── Section title ─────────────────────────────────────────────────────────────
function SectionHeading({ title, sub, accent }: { title: string; sub?: string; accent: string }) {
  return (
    <div className="mb-7">
      {sub && <p className="font-mono text-[9px] tracking-[0.35em] uppercase mb-2" style={{ color: accent + '99' }}>{sub}</p>}
      <h2 className="text-2xl md:text-3xl font-normal tracking-[0.16em] uppercase text-white" style={{ fontFamily: "'Cinzel', serif" }}>{title}</h2>
      <div className="mt-3 h-px w-24 opacity-40" style={{ background: accent }} />
    </div>
  );
}

// ─── Tab definitions ──────────────────────────────────────────────────────────
type Tab = 'overview' | 'characters' | 'map' | 'timeline' | 'factions' | 'lore' | 'media';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',   label: 'Overview'   },
  { id: 'characters', label: 'Characters' },
  { id: 'map',        label: 'Map'        },
  { id: 'timeline',   label: 'Timeline'   },
  { id: 'factions',   label: 'Factions'   },
  { id: 'lore',       label: 'Lore'       },
  { id: 'media',      label: 'Media'      },
];

// ─── Character portrait card ───────────────────────────────────────────────────
function CharCard({ char, accent, active, onClick }: { char: any; accent: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="shrink-0 rounded-xl overflow-hidden relative cursor-pointer transition-all duration-300"
      style={{
        width: 'clamp(130px,15vw,165px)',
        aspectRatio: '2/3',
        scrollSnapAlign: 'start',
        border: active ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.07)',
        boxShadow: active ? `0 0 28px ${accent}55` : '0 4px 20px rgba(0,0,0,0.6)',
        transform: active ? 'scale(1.04) translateY(-3px)' : 'scale(1)',
      }}
    >
      <img src={char.image || '/Images/gandalf_portrait.png'} alt={char.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.78) saturate(0.88)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.97) 0%, rgba(2,1,2,0.3) 55%, transparent 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-[11px] font-semibold text-white leading-none truncate" style={{ fontFamily: "'Cinzel', serif" }}>{char.name}</p>
        <p className="font-mono text-[7.5px] mt-1 truncate opacity-80" style={{ color: accent }}>{char.role?.split(',')[0]}</p>
      </div>
    </div>
  );
}

// ─── Faction card ─────────────────────────────────────────────────────────────
function FactionCard({ fac, accent, active, onClick }: { fac: any; accent: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="shrink-0 rounded-xl overflow-hidden relative cursor-pointer transition-all duration-300"
      style={{
        width: 'clamp(190px,22vw,240px)',
        height: 155,
        scrollSnapAlign: 'start',
        border: active ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.07)',
        boxShadow: active ? `0 0 24px ${accent}44` : '0 4px 20px rgba(0,0,0,0.6)',
        transform: active ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      <img src={fac.image || '/Images/middle_earth_map.png'} alt={fac.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.5) saturate(0.75)' }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}18 0%, rgba(0,0,0,0.72) 100%)` }} />
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="text-2xl">{fac.emblem || '🛡️'}</div>
        <div>
          <p className="text-[13px] font-semibold text-white leading-snug" style={{ fontFamily: "'Cinzel', serif" }}>{fac.name}</p>
          <p className="font-mono text-[7.5px] mt-1 opacity-80" style={{ color: accent }}>{fac.alignment || fac.type || 'Faction'}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Timeline event card ──────────────────────────────────────────────────────
function EventCard({ ev, idx, accent, active, onClick }: { ev: any; idx: number; accent: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="shrink-0 rounded-xl overflow-hidden relative cursor-pointer transition-all duration-300"
      style={{
        width: 'clamp(210px,24vw,260px)',
        height: 190,
        scrollSnapAlign: 'start',
        border: active ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.07)',
        boxShadow: active ? `0 0 28px ${accent}44` : '0 4px 20px rgba(0,0,0,0.6)',
        transform: active ? 'scale(1.03)' : 'scale(1)',
      }}
    >
      <img src={ev.image || '/Images/fellowship_mountain.png'} alt={ev.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.48) saturate(0.8)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.97) 0%, transparent 60%)' }} />
      <div className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-black" style={{ background: accent }}>{idx + 1}</div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-mono text-[7.5px] mb-1.5" style={{ color: accent }}>{ev.date}</p>
        <p className="text-[12px] font-semibold text-white leading-snug" style={{ fontFamily: "'Cinzel', serif" }}>{ev.title}</p>
      </div>
    </div>
  );
}

// ─── Location card ─────────────────────────────────────────────────────────────
function LocCard({ loc, accent }: { loc: any; accent: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="shrink-0 rounded-xl overflow-hidden relative transition-all duration-300"
      style={{
        width: 'clamp(210px,26vw,280px)',
        height: 175,
        scrollSnapAlign: 'start',
        transform: hov ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hov ? `0 12px 36px rgba(0,0,0,0.8)` : '0 4px 20px rgba(0,0,0,0.55)',
      }}
    >
      <img src={loc.image} alt={loc.name}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
        style={{ filter: hov ? 'brightness(0.78)' : 'brightness(0.58)', transform: hov ? 'scale(1.06)' : 'scale(1)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.92) 0%, transparent 55%)' }} />
      <div className="absolute bottom-0 p-4">
        <p className="text-[13px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>{loc.name}</p>
        <p className="text-[10px] text-white/50 mt-0.5 line-clamp-1">{loc.desc}</p>
      </div>
      {hov && <div className="absolute inset-0 rounded-xl border" style={{ borderColor: accent + '55' }} />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function UniverseOverviewPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { playClick, playHover } = useAudio();

  const data = getUniverseData(id);
  const accent = data.accentColor || '#eed078';
  const rgb = hexToRgb(accent);

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [activeChar, setActiveChar] = useState<any>(data.characters?.[0] ?? null);
  const [charSubTab, setCharSubTab] = useState<'about' | 'abilities' | 'quotes'>('about');
  const [activeFaction, setActiveFaction] = useState<any>(data.factions?.[0] ?? null);
  const [activeTLIdx, setActiveTLIdx] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  // Detect scroll for top nav opacity
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const onScroll = () => setNavScrolled(el.scrollTop > 60);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll to tab bar when switching tabs (after hero)
  const switchTab = (tab: Tab) => {
    playClick();
    setActiveTab(tab);
    setTimeout(() => {
      tabBarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const activeEvent = data.events?.[activeTLIdx];

  return (
    <div
      ref={pageRef}
      className="w-full min-h-screen overflow-y-auto overflow-x-hidden bg-[#020102] text-white"
    >
      {/* ── Scoped accent vars + animations ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --ua: ${accent}; --ua-rgb: ${rgb}; }
        .ua  { color: var(--ua) !important; }
        .ua-b { border-color: rgba(var(--ua-rgb), 0.35) !important; }
        .ua-bg { background: rgba(var(--ua-rgb), 0.1) !important; }
        .ua-solid { background: var(--ua) !important; }
        @keyframes u-fog   { 0%,100%{opacity:.55;transform:translateX(-1%)} 50%{opacity:.72;transform:translateX(1%)} }
        @keyframes u-pulse { 0%,100%{opacity:.35} 50%{opacity:.7} }
        @keyframes u-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        .u-fog   { animation: u-fog   14s ease-in-out infinite; }
        .u-pulse { animation: u-pulse  3s ease-in-out infinite; }
        .u-float { animation: u-float  7s ease-in-out infinite; }
      `}} />

      {/* ════════════════════════════════════════════════════════════════════
          TOP TRANSPARENT NAV (back button + universe title on scroll)
      ════════════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 pointer-events-none"
        style={{
          background: navScrolled ? 'rgba(2,1,2,0.9)' : 'transparent',
          backdropFilter: navScrolled ? 'blur(18px)' : 'none',
          borderBottom: navScrolled ? `1px solid rgba(${rgb},0.1)` : 'none',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-14 h-14 flex items-center justify-between pointer-events-auto">
          <button
            onClick={() => { playClick(); router.push('/'); }}
            onMouseEnter={() => playHover()}
            className="flex items-center gap-2.5 group"
          >
            <span className="text-white/35 group-hover:text-white/80 transition-colors text-xl leading-none">‹</span>
            <span className="font-mono text-[8.5px] tracking-[0.32em] uppercase text-white/35 group-hover:text-white/75 transition-colors">ORYVON</span>
          </button>
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-400"
            style={{ opacity: navScrolled ? 1 : 0, transform: `translateX(-50%) translateY(${navScrolled ? 0 : -6}px)` }}
          >
            <span className="font-mono text-[9px] tracking-[0.38em] uppercase ua">{data.title}</span>
          </div>
          <div className="w-16" />
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════
          FULLSCREEN HERO
      ════════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Backdrop */}
        <img src={data.backdrop} alt={data.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.52) saturate(0.82)' }} />

        {/* Gradient layers */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 55% 25%, ${accent}1a 0%, transparent 62%)` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(2,1,2,0.2) 45%, rgba(2,1,2,0.98) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(2,1,2,0.72) 0%, transparent 52%)' }} />
        <div className="absolute bottom-0 left-0 right-0 h-56 u-fog pointer-events-none"
          style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.88) 0%, transparent 100%)' }} />

        {/* Ambient particles */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="absolute rounded-full pointer-events-none u-pulse"
            style={{
              width: 1.4 + (i % 3) * 0.7, height: 1.4 + (i % 3) * 0.7,
              left: `${(i * 19 + 3) % 100}%`, top: `${(i * 13 + 8) % 82}%`,
              background: accent, opacity: 0.25 + (i % 4) * 0.1,
              animationDelay: `${(i * 0.38).toFixed(1)}s`,
            }} />
        ))}

        {/* Hero text */}
        <div className="relative z-10 px-6 md:px-14 pb-16 md:pb-24 max-w-4xl">
          {/* Type + year badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="ua-bg ua-b border rounded font-mono text-[7.5px] tracking-[0.2em] uppercase ua px-3 py-1">{data.universeType}</span>
            <span className="bg-white/[0.06] border border-white/10 rounded font-mono text-[7.5px] text-white/45 px-3 py-1 tracking-wider">{data.releaseYears}</span>
            <span className="font-mono text-[9px] ua">★ {data.rating}</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl sm:text-7xl md:text-[90px] font-normal uppercase leading-none mb-5 text-white"
            style={{ fontFamily: "'Cinzel', serif", letterSpacing: '0.07em',
              textShadow: `0 0 90px ${accent}44, 0 4px 40px rgba(0,0,0,0.95)` }}>
            {data.title}
          </h1>

          {/* Subtitle */}
          {data.subtitle && (
            <p className="font-mono text-[10px] tracking-[0.38em] uppercase mb-4" style={{ color: accent + 'bb' }}>{data.subtitle}</p>
          )}

          {/* Tagline */}
          <p className="text-[15px] md:text-base text-white/65 italic font-light max-w-lg leading-relaxed mb-10"
            style={{ fontFamily: 'Georgia, serif' }}>
            &ldquo;{data.tagline}&rdquo;
          </p>

          {/* CTA row */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => switchTab('overview')}
              onMouseEnter={() => playHover()}
              className="px-8 py-3.5 rounded-lg font-mono text-[9.5px] tracking-[0.25em] uppercase text-black font-bold transition-all duration-300 hover:brightness-110 active:scale-95 ua-solid"
              style={{ boxShadow: `0 8px 32px ${accent}55` }}>
              Enter Universe
            </button>
            <button
              onClick={() => switchTab('timeline')}
              onMouseEnter={() => playHover()}
              className="px-8 py-3.5 rounded-lg font-mono text-[9.5px] tracking-[0.25em] uppercase border text-white/75 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] transition-all duration-300 ua-b">
              View Timeline
            </button>
            <button
              onClick={() => switchTab('characters')}
              onMouseEnter={() => playHover()}
              className="px-8 py-3.5 rounded-lg font-mono text-[9.5px] tracking-[0.25em] uppercase border text-white/75 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] transition-all duration-300 ua-b">
              Characters
            </button>
          </div>
        </div>

        {/* Bottom stats strip */}
        <div className="relative z-10 border-t border-b px-6 md:px-14 py-5 flex items-center gap-10 md:gap-16 overflow-x-auto"
          style={{ borderColor: `rgba(${rgb},0.14)`, background: 'rgba(2,1,2,0.55)', backdropFilter: 'blur(14px)' }}>
          {[
            { label: 'Characters', val: data.metrics?.characters || '?' },
            { label: 'Factions',   val: data.metrics?.factions   || '?' },
            { label: 'Races',      val: data.metrics?.races      || '?' },
            { label: 'Events',     val: data.metrics?.events     || '?' },
            { label: 'Locations',  val: data.locations?.length   || 0   },
          ].map((s, i) => (
            <div key={i} className="shrink-0 text-center">
              <p className="text-xl md:text-2xl font-bold ua" style={{ fontFamily: "'Cinzel', serif" }}>{s.val}</p>
              <p className="font-mono text-[7.5px] tracking-[0.28em] uppercase text-white/30 mt-1">{s.label}</p>
            </div>
          ))}
          <div className="hidden md:flex ml-auto shrink-0 flex-col items-center gap-1.5 u-float">
            <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, transparent, ${accent})` }} />
            <span className="font-mono text-[7px] tracking-[0.28em] uppercase text-white/25">Scroll</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          STICKY CINEMATIC TAB BAR
      ════════════════════════════════════════════════════════════════════ */}
      <div
        ref={tabBarRef}
        className="sticky top-0 z-40 w-full"
        style={{ background: 'rgba(4,2,6,0.92)', backdropFilter: 'blur(20px)', borderBottom: `1px solid rgba(${rgb},0.1)` }}
      >
        <div className="max-w-screen-2xl mx-auto px-4 md:px-10 flex overflow-x-auto"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              onMouseEnter={() => playHover()}
              className="relative shrink-0 py-5 px-5 md:px-6 font-mono text-[8.5px] tracking-[0.28em] uppercase transition-all duration-300"
              style={{ color: activeTab === tab.id ? accent : 'rgba(255,255,255,0.38)',
                       borderBottom: '2px solid transparent',
                       borderBottomColor: activeTab === tab.id ? accent : 'transparent' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-[18%] right-[18%] h-[2px] rounded-full ua-solid"
                  style={{ boxShadow: `0 0 10px ${accent}` }} />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          TAB CONTENT
      ════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-screen-2xl mx-auto px-6 md:px-14 py-12">

        {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-12">
            {/* Hero info grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Large showcase */}
              <div className="lg:col-span-7 relative h-80 md:h-96 rounded-2xl overflow-hidden group"
                style={{ border: `1px solid rgba(${rgb},0.2)` }}>
                <img src={data.backdrop} alt={data.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[6000ms] group-hover:scale-105"
                  style={{ filter: 'brightness(0.6) saturate(0.85)' }} />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.95) 0%, rgba(2,1,2,0.2) 60%, transparent 100%)' }} />
                <div className="absolute bottom-0 p-7">
                  <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase ua mb-2">Universe Portal</p>
                  <h3 className="text-3xl font-normal text-white uppercase" style={{ fontFamily: "'Cinzel', serif" }}>{data.title}</h3>
                  <p className="text-[13px] text-white/60 italic mt-2 max-w-md leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    &ldquo;{data.description?.split('.')[0]}.&rdquo;
                  </p>
                </div>
              </div>

              {/* Stats + quick nav */}
              <div className="lg:col-span-5 flex flex-col gap-4">
                {/* Metric grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Characters', val: data.metrics?.characters || '?', tab: 'characters' as Tab },
                    { label: 'Factions',   val: data.metrics?.factions   || '?', tab: 'factions'   as Tab },
                    { label: 'Races',      val: data.metrics?.races      || '?', tab: 'map'         as Tab },
                    { label: 'Events',     val: data.metrics?.events     || '?', tab: 'timeline'    as Tab },
                  ].map((m, i) => (
                    <button key={i} onClick={() => switchTab(m.tab)}
                      className="rounded-xl p-4 text-left transition-all duration-200 hover:brightness-125 group"
                      style={{ border: `1px solid rgba(${rgb},0.15)`, background: `rgba(${rgb},0.06)` }}>
                      <p className="text-2xl font-bold ua group-hover:scale-105 inline-block transition-transform" style={{ fontFamily: "'Cinzel', serif" }}>{m.val}</p>
                      <p className="font-mono text-[7.5px] tracking-[0.25em] uppercase text-white/35 mt-1">{m.label}</p>
                    </button>
                  ))}
                </div>

                {/* Description */}
                <div className="rounded-xl p-5 flex-1" style={{ border: `1px solid rgba(${rgb},0.12)`, background: 'rgba(6,4,8,0.7)' }}>
                  <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase ua mb-3">About this Universe</p>
                  <p className="text-[13px] text-white/60 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{data.description}</p>
                </div>
              </div>
            </div>

            {/* Quick-access nav cards */}
            <div>
              <SectionHeading title="Explore" sub="Navigate the Universe" accent={accent} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { tab: 'characters' as Tab, label: 'Characters', icon: '👤', desc: `${data.metrics?.characters || 'Many'} inhabitants` },
                  { tab: 'factions'   as Tab, label: 'Factions',   icon: '🛡️', desc: `${data.metrics?.factions   || 'Several'} powers` },
                  { tab: 'timeline'   as Tab, label: 'Timeline',   icon: '📜', desc: `${data.metrics?.events     || 'Many'} events` },
                  { tab: 'map'        as Tab, label: 'World Map',  icon: '🗺️', desc: `${data.locations?.length   || 0} locations` },
                  { tab: 'lore'       as Tab, label: 'Lore',       icon: '📖', desc: 'Codex & history' },
                  { tab: 'media'      as Tab, label: 'Media',      icon: '🎬', desc: 'Gallery & soundtrack' },
                ].map(item => (
                  <button key={item.tab} onClick={() => switchTab(item.tab)}
                    className="rounded-xl p-5 text-left transition-all duration-250 hover:scale-[1.03] group"
                    style={{ border: `1px solid rgba(${rgb},0.14)`, background: 'rgba(6,4,8,0.75)' }}>
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <p className="text-[13px] font-semibold text-white group-hover:ua transition-colors" style={{ fontFamily: "'Cinzel', serif" }}>{item.label}</p>
                    <p className="font-mono text-[8px] text-white/30 mt-1 tracking-wider uppercase">{item.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Featured characters preview */}
            <div>
              <SectionHeading title="Key Characters" sub="Inhabitants of the Realm" accent={accent} />
              <ScrollRow>
                {data.characters?.slice(0, 8).map((char: any) => (
                  <CharCard key={char.id} char={char} accent={accent} active={false}
                    onClick={() => { switchTab('characters'); setActiveChar(char); }} />
                ))}
              </ScrollRow>
            </div>

            {/* Timeline mini */}
            <div>
              <SectionHeading title="Timeline" sub="Ages & Turning Points" accent={accent} />
              <div className="relative py-6">
                <div className="absolute left-0 right-0 top-1/2 h-px" style={{ background: `linear-gradient(to right, transparent, rgba(${rgb},0.3), transparent)` }} />
                <div className="flex items-center justify-between overflow-x-auto pb-2 gap-0">
                  {data.events?.slice(0, 7).map((ev: any, i: number) => (
                    <button key={i} onClick={() => { switchTab('timeline'); setActiveTLIdx(i); }}
                      className="flex flex-col items-center gap-2.5 shrink-0 px-3 group">
                      <div className="w-3.5 h-3.5 rounded-full border-2 transition-all duration-300 group-hover:scale-150"
                        style={{ borderColor: accent, background: 'rgba(2,1,2,0.9)', boxShadow: `0 0 8px ${accent}55` }} />
                      <p className="font-mono text-[7.5px] text-white/50 group-hover:ua transition-colors text-center w-20 truncate">{ev.title}</p>
                      <p className="font-mono text-[6.5px] uppercase tracking-widest" style={{ color: accent + '99' }}>{ev.date}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CHARACTERS ───────────────────────────────────────────────── */}
        {activeTab === 'characters' && (
          <div className="flex flex-col gap-8">
            <SectionHeading title="Characters" sub="Inhabitants of the Realm" accent={accent} />

            {/* Portrait row */}
            <ScrollRow>
              {data.characters?.map((char: any) => (
                <CharCard key={char.id} char={char} accent={accent}
                  active={activeChar?.id === char.id}
                  onClick={() => { playClick(); setActiveChar(char); setCharSubTab('about'); }} />
              ))}
            </ScrollRow>

            {/* Detail panel */}
            {activeChar && (
              <div className="rounded-2xl overflow-hidden mt-2" style={{ border: `1px solid rgba(${rgb},0.22)`, background: 'rgba(5,3,8,0.95)' }}>
                <div className="grid grid-cols-1 md:grid-cols-12">
                  {/* Portrait */}
                  <div className="md:col-span-3 relative h-72 md:h-auto min-h-[260px]">
                    <img src={activeChar.image || '/Images/gandalf_portrait.png'} alt={activeChar.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: 'brightness(0.82) saturate(0.88)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 55%, rgba(5,3,8,0.98) 100%)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,3,8,0.95) 0%, transparent 35%)' }} />
                  </div>

                  {/* Info panel */}
                  <div className="md:col-span-9 p-7 md:p-9 flex flex-col gap-6">
                    <div>
                      <p className="font-mono text-[8px] tracking-[0.3em] uppercase ua mb-1">{activeChar.role}</p>
                      <h3 className="text-3xl md:text-4xl text-white font-normal" style={{ fontFamily: "'Cinzel', serif" }}>{activeChar.name}</h3>
                    </div>

                    {/* Stats */}
                    {activeChar.stats && (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(activeChar.stats).slice(0, 6).map(([k, v]) => (
                          <span key={k} className="px-3 py-1 rounded-full font-mono text-[8px] border"
                            style={{ borderColor: `rgba(${rgb},0.2)`, background: `rgba(${rgb},0.07)`, color: 'rgba(255,255,255,0.6)' }}>
                            <span className="ua">{k}:</span> {v as string}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Sub-tabs */}
                    <div className="flex gap-0 border-b" style={{ borderColor: `rgba(${rgb},0.15)` }}>
                      {(['about', 'abilities', 'quotes'] as const).map(t => (
                        <button key={t} onClick={() => setCharSubTab(t)}
                          className="px-5 py-2.5 font-mono text-[8.5px] tracking-[0.2em] uppercase relative transition-colors"
                          style={{ color: charSubTab === t ? accent : 'rgba(255,255,255,0.35)' }}>
                          {t}
                          {charSubTab === t && <span className="absolute bottom-0 left-0 right-0 h-[2px] ua-solid" />}
                        </button>
                      ))}
                    </div>

                    <div className="text-[13px] text-white/62 leading-relaxed" style={{ fontFamily: 'Georgia, serif', minHeight: 80 }}>
                      {charSubTab === 'about'     && (activeChar.tabs?.about || activeChar.desc || 'No data recorded.')}
                      {charSubTab === 'abilities' && (activeChar.tabs?.abilities || 'No ability records.')}
                      {charSubTab === 'quotes'    && <em>&ldquo;{activeChar.tabs?.quotes || activeChar.quote || 'No quotes recorded.'}&rdquo;</em>}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── MAP ──────────────────────────────────────────────────────── */}
        {activeTab === 'map' && (
          <div className="flex flex-col gap-8">
            <SectionHeading title="World Map" sub="Known Territories" accent={accent} />

            {/* Map canvas */}
            <div className="relative rounded-2xl overflow-hidden h-80 md:h-[480px]"
              style={{ border: `1px solid rgba(${rgb},0.18)` }}>
              <img src={data.locations?.[0]?.image || data.backdrop} alt="World"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.55) saturate(0.75)' }} />
              <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${accent}14 0%, rgba(2,1,2,0.55) 100%)` }} />
              {/* Location dots */}
              {data.locations?.slice(0, 6).map((_: any, i: number) => (
                <div key={i} className="absolute w-2.5 h-2.5 rounded-full border-2 u-pulse"
                  style={{
                    borderColor: accent,
                    background: `${accent}55`,
                    left: `${15 + i * 13}%`,
                    top: `${20 + (i % 3) * 22}%`,
                    boxShadow: `0 0 12px ${accent}`,
                    animationDelay: `${i * 0.4}s`,
                  }} />
              ))}
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                <div>
                  <p className="font-mono text-[9px] tracking-[0.35em] uppercase ua mb-1">World Atlas</p>
                  <p className="text-white/30 text-xs">{data.locations?.length || 0} locations mapped</p>
                </div>
                <p className="font-mono text-[8px] text-white/20">Interactive map — coming soon</p>
              </div>
            </div>

            {/* Location cards */}
            <SectionHeading title="Locations" sub="Places of Legend" accent={accent} />
            <ScrollRow>
              {data.locations?.map((loc: any, i: number) => (
                <LocCard key={i} loc={loc} accent={accent} />
              ))}
            </ScrollRow>

            {/* Location detail list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {data.locations?.map((loc: any, i: number) => (
                <div key={i} className="flex gap-4 rounded-xl p-4 transition-colors"
                  style={{ border: `1px solid rgba(${rgb},0.12)`, background: 'rgba(6,4,8,0.7)' }}>
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <img src={loc.image} alt={loc.name}
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.7)' }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>{loc.name}</p>
                    <p className="text-[11px] text-white/45 mt-1 leading-relaxed">{loc.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TIMELINE ─────────────────────────────────────────────────── */}
        {activeTab === 'timeline' && (
          <div className="flex flex-col gap-8">
            <SectionHeading title="Timeline of Events" sub="Ages & Turning Points" accent={accent} />

            {/* Event cards scroll */}
            <ScrollRow>
              {data.events?.map((ev: any, i: number) => (
                <EventCard key={ev.id || i} ev={ev} idx={i} accent={accent}
                  active={activeTLIdx === i}
                  onClick={() => { playClick(); setActiveTLIdx(i); }} />
              ))}
            </ScrollRow>

            {/* Active event detail */}
            {activeEvent && (
              <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid rgba(${rgb},0.2)`, background: 'rgba(5,3,8,0.92)' }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="p-8 md:p-10 flex flex-col gap-5 justify-center">
                    <div>
                      <p className="font-mono text-[8.5px] tracking-[0.3em] uppercase ua mb-3">{activeEvent.date}</p>
                      <h3 className="text-2xl md:text-3xl text-white font-normal" style={{ fontFamily: "'Cinzel', serif" }}>{activeEvent.title}</h3>
                    </div>
                    <p className="text-[13.5px] text-white/62 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{activeEvent.desc}</p>
                    {activeEvent.era && (
                      <div className="inline-flex items-center gap-2 ua-bg ua-b border rounded-full px-4 py-1.5 w-fit">
                        <span className="font-mono text-[7.5px] tracking-[0.25em] uppercase ua">{activeEvent.era}</span>
                      </div>
                    )}
                  </div>
                  <div className="relative h-64 md:h-auto min-h-[240px]">
                    <img src={activeEvent.image || data.backdrop} alt={activeEvent.title}
                      className="absolute inset-0 w-full h-full object-cover"
                      style={{ filter: 'brightness(0.6) saturate(0.78)' }} />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to left, transparent 55%, rgba(5,3,8,0.95) 100%)` }} />
                    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 50%, ${accent}14 0%, transparent 60%)` }} />
                  </div>
                </div>
              </div>
            )}

            {/* All events list */}
            <div className="flex flex-col gap-3 mt-2">
              {data.events?.map((ev: any, i: number) => (
                <button key={i} onClick={() => { playClick(); setActiveTLIdx(i); }}
                  className="flex items-center gap-5 rounded-xl p-4 text-left transition-all duration-250"
                  style={{
                    border: `1px solid ${activeTLIdx === i ? accent + '55' : `rgba(${rgb},0.1)`}`,
                    background: activeTLIdx === i ? `rgba(${rgb},0.08)` : 'rgba(6,4,8,0.7)',
                  }}>
                  <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-black"
                    style={{ background: activeTLIdx === i ? accent : `rgba(${rgb},0.25)` }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate" style={{ fontFamily: "'Cinzel', serif" }}>{ev.title}</p>
                    <p className="font-mono text-[7.5px] uppercase tracking-widest mt-0.5" style={{ color: accent + '99' }}>{ev.date}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── FACTIONS ─────────────────────────────────────────────────── */}
        {activeTab === 'factions' && (
          <div className="flex flex-col gap-8">
            <SectionHeading title="Factions &amp; Kingdoms" sub="Powers of the Realm" accent={accent} />

            <ScrollRow>
              {data.factions?.map((fac: any, i: number) => (
                <FactionCard key={i} fac={fac} accent={accent}
                  active={activeFaction?.name === fac.name}
                  onClick={() => { playClick(); setActiveFaction(fac); }} />
              ))}
            </ScrollRow>

            {/* Active faction detail */}
            {activeFaction && (
              <div className="rounded-2xl p-7 md:p-9" style={{ border: `1px solid rgba(${rgb},0.2)`, background: 'rgba(5,3,8,0.92)' }}>
                <div className="flex items-start gap-6 mb-6">
                  <div className="text-4xl">{activeFaction.emblem || '🛡️'}</div>
                  <div>
                    <p className="font-mono text-[8px] tracking-[0.3em] uppercase ua mb-1">{activeFaction.alignment || activeFaction.type || 'Faction'}</p>
                    <h3 className="text-2xl md:text-3xl text-white font-normal" style={{ fontFamily: "'Cinzel', serif" }}>{activeFaction.name}</h3>
                  </div>
                </div>
                <p className="text-[13.5px] text-white/60 leading-relaxed max-w-2xl" style={{ fontFamily: 'Georgia, serif' }}>
                  {activeFaction.desc || activeFaction.description || 'A powerful force within this universe.'}
                </p>
                {activeFaction.leader && (
                  <div className="mt-5 flex items-center gap-2">
                    <span className="font-mono text-[8px] tracking-[0.28em] uppercase text-white/30">Leader:</span>
                    <span className="font-mono text-[9px] ua">{activeFaction.leader}</span>
                  </div>
                )}
              </div>
            )}

            {/* Factions grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {data.factions?.map((fac: any, i: number) => (
                <button key={i} onClick={() => { playClick(); setActiveFaction(fac); }}
                  className="flex items-center gap-4 rounded-xl p-4 text-left transition-all duration-250"
                  style={{
                    border: `1px solid ${activeFaction?.name === fac.name ? accent + '55' : `rgba(${rgb},0.12)`}`,
                    background: activeFaction?.name === fac.name ? `rgba(${rgb},0.08)` : 'rgba(6,4,8,0.7)',
                  }}>
                  <div className="text-2xl shrink-0">{fac.emblem || '🛡️'}</div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-white truncate" style={{ fontFamily: "'Cinzel', serif" }}>{fac.name}</p>
                    <p className="font-mono text-[7.5px] uppercase tracking-widest mt-0.5" style={{ color: accent + '99' }}>{fac.alignment || fac.type || 'Faction'}</p>
                  </div>
                  {fac.leader && <p className="ml-auto font-mono text-[8px] text-white/25 shrink-0 truncate max-w-[100px]">{fac.leader}</p>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── LORE ─────────────────────────────────────────────────────── */}
        {activeTab === 'lore' && (
          <div className="flex flex-col gap-8">
            <SectionHeading title="Lore &amp; Codex" sub="Secrets of the Archive" accent={accent} />

            {data.lore && data.lore.length > 0 ? (
              <>
                <ScrollRow>
                  {data.lore.map((item: any, i: number) => (
                    <div key={i} className="shrink-0 rounded-xl p-6 flex flex-col gap-4 transition-all duration-250 hover:brightness-110"
                      style={{
                        width: 'clamp(230px,26vw,290px)',
                        scrollSnapAlign: 'start',
                        border: `1px solid rgba(${rgb},0.18)`,
                        background: 'rgba(7,4,10,0.92)',
                      }}>
                      <div className="text-2xl">{item.icon || '📜'}</div>
                      <div>
                        <p className="font-mono text-[8px] tracking-[0.28em] uppercase ua mb-2">{item.type || 'Lore'}</p>
                        <h4 className="text-[14px] font-semibold text-white leading-snug mb-3" style={{ fontFamily: "'Cinzel', serif" }}>{item.title}</h4>
                        <p className="text-[12px] text-white/50 leading-relaxed line-clamp-4" style={{ fontFamily: 'Georgia, serif' }}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </ScrollRow>

                {/* Full lore entries */}
                <div className="flex flex-col gap-4 mt-2">
                  {data.lore.map((item: any, i: number) => (
                    <div key={i} className="rounded-xl p-6"
                      style={{ border: `1px solid rgba(${rgb},0.12)`, background: 'rgba(6,4,8,0.75)' }}>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xl">{item.icon || '📜'}</span>
                        <div>
                          <p className="font-mono text-[7.5px] tracking-[0.28em] uppercase ua">{item.type || 'Lore Entry'}</p>
                          <h4 className="text-[15px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>{item.title}</h4>
                        </div>
                      </div>
                      <p className="text-[13px] text-white/55 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="rounded-2xl p-12 text-center" style={{ border: `1px solid rgba(${rgb},0.1)`, background: 'rgba(6,4,8,0.6)' }}>
                <div className="text-4xl mb-4">📜</div>
                <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30">Lore entries being transcribed…</p>
              </div>
            )}
          </div>
        )}

        {/* ── MEDIA ────────────────────────────────────────────────────── */}
        {activeTab === 'media' && (
          <div className="flex flex-col gap-10">
            <SectionHeading title="Media Archive" sub="Gallery, Soundtrack &amp; Documents" accent={accent} />

            {/* Gallery grid */}
            <div>
              <p className="font-mono text-[8.5px] tracking-[0.3em] uppercase text-white/35 mb-5">Gallery</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[...(data.locations || []), ...(data.events?.slice(0, 4) || [])].map((item: any, i: number) => (
                  <div key={i} className="relative rounded-xl overflow-hidden aspect-video group cursor-pointer">
                    <img src={item.image || data.backdrop} alt={item.name || item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      style={{ filter: 'brightness(0.62) saturate(0.82)' }} />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.85) 0%, transparent 60%)' }} />
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl border" style={{ borderColor: accent + '55' }} />
                    <p className="absolute bottom-2.5 left-3 right-3 font-mono text-[8px] tracking-wider uppercase text-white/55 truncate">{item.name || item.title}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Soundtrack */}
            {data.media?.soundtracks && data.media.soundtracks.length > 0 && (
              <div>
                <p className="font-mono text-[8.5px] tracking-[0.3em] uppercase text-white/35 mb-5">Soundtrack</p>
                <div className="flex flex-col gap-2">
                  {data.media.soundtracks.map((snd: any, i: number) => (
                    <div key={i} className="flex items-center justify-between rounded-xl px-5 py-3.5 group transition-all duration-200"
                      style={{ border: `1px solid rgba(${rgb},0.1)`, background: 'rgba(6,4,8,0.7)' }}>
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full border flex items-center justify-center text-[11px] ua group-hover:ua-solid group-hover:text-black transition-all duration-200"
                          style={{ borderColor: `rgba(${rgb},0.3)` }}>▶</div>
                        <div>
                          <p className="text-[12px] text-white/80 font-medium group-hover:ua transition-colors">{snd.title}</p>
                          {snd.composer && <p className="font-mono text-[7.5px] text-white/30 mt-0.5">{snd.composer}</p>}
                        </div>
                      </div>
                      {snd.duration && <p className="font-mono text-[8px] text-white/25">{snd.duration}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Documents */}
            {data.media?.documents && data.media.documents.length > 0 && (
              <div>
                <p className="font-mono text-[8.5px] tracking-[0.3em] uppercase text-white/35 mb-5">Documents &amp; Books</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {data.media.documents.map((doc: any, i: number) => (
                    <div key={i} className="flex items-center justify-between rounded-xl p-4"
                      style={{ border: `1px solid rgba(${rgb},0.1)`, background: 'rgba(6,4,8,0.7)' }}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">📄</span>
                        <p className="text-[12px] text-white/65">{doc.title}</p>
                      </div>
                      <p className="font-mono text-[7.5px] ua">{doc.count ? `${doc.count} copies` : 'Archive'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty state */}
            {(!data.media || (!data.media?.soundtracks?.length && !data.media?.documents?.length)) && (
              <div className="rounded-2xl p-12 text-center" style={{ border: `1px solid rgba(${rgb},0.1)`, background: 'rgba(6,4,8,0.6)' }}>
                <div className="text-4xl mb-4">🎬</div>
                <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/30">Media archive being compiled…</p>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Footer */}
      <footer className="px-6 md:px-14 py-8 flex items-center justify-between mt-8"
        style={{ borderTop: `1px solid rgba(${rgb},0.1)`, background: 'rgba(2,1,2,0.5)' }}>
        <div>
          <p className="font-mono text-[7.5px] tracking-[0.35em] uppercase ua mb-1">{data.universeType}</p>
          <p className="text-[14px] font-normal text-white/40" style={{ fontFamily: "'Cinzel', serif" }}>{data.title}</p>
        </div>
        <button
          onClick={() => { playClick(); pageRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="font-mono text-[8.5px] tracking-[0.25em] uppercase text-white/30 hover:text-white transition-colors">
          ↑ Top
        </button>
      </footer>
    </div>
  );
}
