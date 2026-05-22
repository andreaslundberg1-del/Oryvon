"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAudio } from '@/components/AudioManager';
import { getUniverseData } from '@/data/universeRegistry';

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
      style={{ scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
               msOverflowStyle: 'none', scrollbarWidth: 'none' }}
      onMouseDown={e => { drag.current = true; startX.current = e.pageX - (ref.current?.offsetLeft ?? 0); sl.current = ref.current?.scrollLeft ?? 0; }}
      onMouseMove={e => { if (!drag.current || !ref.current) return; e.preventDefault(); ref.current.scrollLeft = sl.current - (e.pageX - (ref.current.offsetLeft) - startX.current); }}
      onMouseUp={() => { drag.current = false; }}
      onMouseLeave={() => { drag.current = false; }}
    >
      {children}
    </div>
  );
}

// ─── Section header ───────────────────────────────────────────────────────────
function RowHeader({ title, sub, accent, onMore }: { title: string; sub?: string; accent: string; onMore?: () => void }) {
  return (
    <div className="flex items-center justify-between px-6 md:px-16 mb-5">
      <div>
        {sub && <p className="font-mono text-[9px] tracking-[0.32em] uppercase mb-1.5" style={{ color: accent + '99' }}>{sub}</p>}
        <h2 className="text-xl md:text-2xl font-normal tracking-[0.16em] uppercase text-white" style={{ fontFamily: "'Cinzel', serif" }}>{title}</h2>
      </div>
      {onMore && (
        <button onClick={onMore} className="font-mono text-[9px] tracking-[0.22em] uppercase text-white/40 hover:text-white/80 transition-colors">
          See All ›
        </button>
      )}
    </div>
  );
}

// ─── Character card ───────────────────────────────────────────────────────────
function CharCard({ char, accent, onClick }: { char: any; accent: string; onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="shrink-0 rounded-xl overflow-hidden relative cursor-pointer"
      style={{
        width: 'clamp(140px,18vw,180px)',
        aspectRatio: '2/3',
        scrollSnapAlign: 'start',
        transform: hov ? 'scale(1.05) translateY(-4px)' : 'scale(1)',
        boxShadow: hov ? `0 20px 50px rgba(0,0,0,0.9),0 0 30px ${accent}33` : '0 6px 24px rgba(0,0,0,0.7)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <img src={char.image || '/Images/gandalf_portrait.png'} alt={char.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.75) saturate(0.9)' }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(2,1,2,0.97) 0%, rgba(2,1,2,0.45) 55%, transparent 100%)` }} />
      {hov && <div className="absolute inset-0 rounded-xl border-2" style={{ borderColor: accent + '88' }} />}
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <p className="text-[11px] font-semibold text-white leading-none truncate" style={{ fontFamily: "'Cinzel', serif" }}>{char.name}</p>
        <p className="font-mono text-[8px] mt-1 truncate" style={{ color: accent + 'cc' }}>{char.role?.split(',')[0]}</p>
      </div>
    </div>
  );
}

// ─── Faction card ─────────────────────────────────────────────────────────────
function FactionCard({ fac, accent }: { fac: any; accent: string }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="shrink-0 rounded-xl overflow-hidden relative"
      style={{
        width: 'clamp(200px,24vw,260px)',
        height: 160,
        scrollSnapAlign: 'start',
        transform: hov ? 'scale(1.03)' : 'scale(1)',
        boxShadow: hov ? `0 16px 48px rgba(0,0,0,0.85), 0 0 20px ${accent}22` : '0 4px 20px rgba(0,0,0,0.6)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <img src={fac.image || '/Images/middle_earth_map.png'} alt={fac.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.55) saturate(0.8)' }} />
      <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}22 0%, rgba(0,0,0,0.7) 100%)` }} />
      <div className="absolute inset-0 p-4 flex flex-col justify-between">
        <div className="text-2xl">{fac.emblem || '🛡️'}</div>
        <div>
          <p className="text-[13px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>{fac.name}</p>
          <p className="font-mono text-[8px] mt-1" style={{ color: accent + 'cc' }}>{fac.alignment || 'Faction'}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Location/gallery card ────────────────────────────────────────────────────
function LocCard({ loc }: { loc: any }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="shrink-0 rounded-xl overflow-hidden relative"
      style={{
        width: 'clamp(220px,28vw,300px)',
        height: 180,
        scrollSnapAlign: 'start',
        transform: hov ? 'scale(1.03)' : 'scale(1)',
        transition: 'transform 0.3s ease',
      }}
    >
      <img src={loc.image} alt={loc.name}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: hov ? 'brightness(0.75)' : 'brightness(0.6)', transition: 'filter 0.3s ease' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.92) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="text-[13px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>{loc.name}</p>
        <p className="text-[10px] text-white/55 mt-0.5 line-clamp-1">{loc.desc}</p>
      </div>
    </div>
  );
}

// ─── Timeline event card ──────────────────────────────────────────────────────
function TimelineCard({ ev, idx, accent, active, onClick }: { ev: any; idx: number; accent: string; active: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="shrink-0 rounded-xl overflow-hidden relative cursor-pointer"
      style={{
        width: 'clamp(220px,26vw,280px)',
        height: 200,
        scrollSnapAlign: 'start',
        border: active ? `2px solid ${accent}` : '2px solid rgba(255,255,255,0.06)',
        boxShadow: active ? `0 0 30px ${accent}44` : '0 4px 20px rgba(0,0,0,0.6)',
        transition: 'border-color 0.3s, box-shadow 0.3s',
      }}
    >
      <img src={ev.image || '/Images/fellowship_mountain.png'} alt={ev.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.5) saturate(0.8)' }} />
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.95) 0%, transparent 60%)' }} />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <p className="font-mono text-[8px] mb-1.5" style={{ color: accent }}>{ev.date}</p>
        <p className="text-[13px] font-semibold text-white leading-snug" style={{ fontFamily: "'Cinzel', serif" }}>{ev.title}</p>
      </div>
      <div className="absolute top-3 left-3 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-black" style={{ background: accent }}>{idx + 1}</div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function UniverseOverviewPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { playClick, playHover } = useAudio();

  const data = getUniverseData(id);
  const accent = data.accentColor || '#eed078';
  const rgb = hexToRgb(accent);

  const [navScrolled, setNavScrolled] = useState(false);
  const [activeChar, setActiveChar] = useState<any>(data.characters?.[0] ?? null);
  const [charTab, setCharTab] = useState<'about' | 'abilities' | 'quotes'>('about');
  const [activeTLIdx, setActiveTLIdx] = useState(0);
  const [navOpen, setNavOpen] = useState(false);

  const pageRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<HTMLDivElement>(null);
  const factionsRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<HTMLDivElement>(null);
  const loreRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Floating nav scroll detection
  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const onScroll = () => setNavScrolled(el.scrollTop > 80);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setNavOpen(false);
    playClick();
  };

  type NavKey = 'hero'|'characters'|'factions'|'timeline'|'lore'|'map'|'gallery';
  const NAV_LABELS: { key: NavKey; label: string }[] = [
    { key: 'hero', label: 'Hero' },
    { key: 'characters', label: 'Characters' },
    { key: 'factions', label: 'Factions' },
    { key: 'timeline', label: 'Timeline' },
    { key: 'lore', label: 'Lore' },
    { key: 'map', label: 'Map' },
    { key: 'gallery', label: 'Gallery' },
  ];
  const sectionRefs: Record<NavKey, React.RefObject<HTMLDivElement | null>> = {
    hero: heroRef, characters: charsRef, factions: factionsRef,
    timeline: tlRef, lore: loreRef, map: mapRef, gallery: galleryRef,
  };

  const activeEvent = data.events?.[activeTLIdx];

  return (
    <div
      ref={pageRef}
      className="w-full min-h-screen overflow-y-auto overflow-x-hidden bg-[#020102] text-white"
      style={{ fontFamily: 'sans-serif' }}
    >
      {/* ── SCOPED ACCENT CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --ua: ${accent}; --ua-rgb: ${rgb}; }
        .ua { color: var(--ua) !important; }
        .ua-border { border-color: rgba(var(--ua-rgb), 0.35) !important; }
        .ua-bg { background: rgba(var(--ua-rgb), 0.1) !important; }
        .ua-solid { background: var(--ua) !important; }
        .ua-glow { box-shadow: 0 0 20px rgba(var(--ua-rgb), 0.35) !important; }
        @keyframes uni-fog { 0%,100% { opacity:0.55; transform:translateX(-1%); } 50% { opacity:0.75; transform:translateX(1%); } }
        @keyframes uni-float { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-10px); } }
        @keyframes uni-pulse { 0%,100% { opacity:0.4; } 50% { opacity:0.75; } }
        .uni-fog { animation: uni-fog 14s ease-in-out infinite; }
        .uni-float { animation: uni-float 7s ease-in-out infinite; }
        .uni-pulse { animation: uni-pulse 3s ease-in-out infinite; }
      ` }} />

      {/* ══════════════════════════════════════════════════════════════════════
          FLOATING NAV
      ══════════════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: navScrolled ? 'rgba(2,1,2,0.92)' : 'transparent',
          backdropFilter: navScrolled ? 'blur(16px)' : 'none',
          borderBottom: navScrolled ? `1px solid rgba(${rgb},0.12)` : 'none',
        }}
      >
        <div className="max-w-screen-2xl mx-auto px-6 md:px-12 h-14 flex items-center justify-between">
          {/* Back to portal */}
          <button
            onClick={() => { playClick(); router.push('/'); }}
            onMouseEnter={() => playHover()}
            className="flex items-center gap-2 group"
          >
            <span className="text-white/40 group-hover:text-white/80 transition-colors text-lg leading-none">‹</span>
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/40 group-hover:text-white/80 uppercase transition-colors">ORYVON</span>
          </button>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => scrollTo(sectionRefs[key])}
                onMouseEnter={() => playHover()}
                className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/45 hover:text-white transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Universe title (center, appears after scroll) */}
          <div
            className="absolute left-1/2 -translate-x-1/2 transition-all duration-500"
            style={{ opacity: navScrolled ? 1 : 0, transform: `translateX(-50%) translateY(${navScrolled ? '0' : '-8px'})` }}
          >
            <span className="font-mono text-[10px] tracking-[0.35em] uppercase ua">{data.title}</span>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setNavOpen(v => !v)}
          >
            {[0,1,2].map(i => (
              <span key={i} className="block w-5 h-[1.5px] bg-white/60" />
            ))}
          </button>
        </div>

        {/* Mobile dropdown */}
        {navOpen && (
          <div className="md:hidden bg-[#020102]/96 border-t border-white/5 py-4">
            {NAV_LABELS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => scrollTo(sectionRefs[key])}
                className="block w-full text-left px-6 py-3 font-mono text-[10px] tracking-[0.25em] uppercase text-white/55 hover:text-white"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO — FULLSCREEN
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative w-full min-h-screen flex flex-col justify-end overflow-hidden">
        {/* Background image */}
        <img
          src={data.backdrop}
          alt={data.title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) saturate(0.85)' }}
        />

        {/* Depth layers */}
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${accent}18 0%, transparent 65%)` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 0%, rgba(2,1,2,0.3) 50%, rgba(2,1,2,0.97) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(2,1,2,0.7) 0%, transparent 55%)' }} />

        {/* Fog layer */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none uni-fog"
          style={{ background: `linear-gradient(to top, rgba(2,1,2,0.85) 0%, transparent 100%)` }}
        />

        {/* Floating particles */}
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none uni-pulse"
            style={{
              width: 1.5 + (i % 3) * 0.8,
              height: 1.5 + (i % 3) * 0.8,
              left: `${(i * 17 + 5) % 100}%`,
              top: `${(i * 23 + 10) % 80}%`,
              background: accent,
              opacity: 0.3 + (i % 4) * 0.1,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}

        {/* Hero content */}
        <div className="relative z-10 px-6 md:px-16 pb-20 md:pb-28 max-w-5xl">
          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-6">
            <span className="ua-bg ua-border border rounded font-mono text-[8px] tracking-[0.2em] uppercase ua px-3 py-1">{data.universeType}</span>
            <span className="bg-white/5 border border-white/10 rounded font-mono text-[8px] text-white/50 px-3 py-1 tracking-wider">{data.releaseYears}</span>
            <span className="font-mono text-[9px] ua">★ {data.rating}</span>
          </div>

          {/* Title */}
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-normal uppercase leading-none mb-6 text-white"
            style={{ fontFamily: "'Cinzel', serif", textShadow: `0 0 80px ${accent}55, 0 4px 32px rgba(0,0,0,0.9)`, letterSpacing: '0.08em' }}
          >
            {data.title}
          </h1>

          {/* Subtitle */}
          {data.subtitle && (
            <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-5" style={{ color: accent + 'bb' }}>{data.subtitle}</p>
          )}

          {/* Tagline */}
          <p className="text-base md:text-lg text-white/70 italic font-light max-w-xl leading-relaxed mb-10" style={{ fontFamily: 'Georgia, serif' }}>
            &ldquo;{data.tagline}&rdquo;
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => { playClick(); scrollTo(charsRef); }}
              onMouseEnter={() => playHover()}
              className="px-8 py-3.5 rounded-lg font-mono text-[10px] tracking-[0.25em] uppercase text-black font-bold transition-all duration-300 hover:scale-105 ua-solid"
              style={{ boxShadow: `0 8px 30px ${accent}55` }}
            >
              Enter Universe
            </button>
            <button
              onClick={() => { playClick(); scrollTo(tlRef); }}
              onMouseEnter={() => playHover()}
              className="px-8 py-3.5 rounded-lg font-mono text-[10px] tracking-[0.25em] uppercase border text-white/80 hover:text-white bg-white/5 hover:bg-white/10 transition-all duration-300 ua-border"
            >
              View Timeline
            </button>
          </div>
        </div>

        {/* Stats strip */}
        <div
          className="relative z-10 border-t border-b px-6 md:px-16 py-5 flex items-center gap-8 md:gap-16 overflow-x-auto"
          style={{ borderColor: `rgba(${rgb},0.15)`, background: 'rgba(2,1,2,0.6)', backdropFilter: 'blur(12px)' }}
        >
          {[
            { label: 'Characters', val: data.metrics?.characters || '50+' },
            { label: 'Factions', val: data.metrics?.factions || '8+' },
            { label: 'Races', val: data.metrics?.races || '5+' },
            { label: 'Events', val: data.metrics?.events || '30+' },
            { label: 'Locations', val: `${data.locations?.length || 0}` },
          ].map((s, i) => (
            <div key={i} className="shrink-0 flex flex-col items-center text-center">
              <span className="text-2xl font-bold ua" style={{ fontFamily: "'Cinzel', serif" }}>{s.val}</span>
              <span className="font-mono text-[8px] tracking-[0.25em] uppercase text-white/35 mt-1">{s.label}</span>
            </div>
          ))}
          {/* Scroll hint */}
          <div className="hidden md:flex ml-auto shrink-0 flex-col items-center gap-1.5 uni-float">
            <div className="w-[1px] h-8 ua-solid" style={{ background: `linear-gradient(to bottom, transparent, ${accent})` }} />
            <span className="font-mono text-[7px] tracking-[0.3em] uppercase text-white/30">Scroll</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CHARACTERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={charsRef} className="pt-20 pb-10">
        <RowHeader title="Characters" sub="Inhabitants of the Realm" accent={accent} />

        {/* Scroll row */}
        <ScrollRow className="px-6 md:px-16">
          {data.characters?.map((char: any) => (
            <CharCard
              key={char.id}
              char={char}
              accent={accent}
              onClick={() => { playClick(); setActiveChar(char); setCharTab('about'); }}
            />
          ))}
        </ScrollRow>

        {/* Active character detail panel */}
        {activeChar && (
          <div
            className="mx-6 md:mx-16 mt-8 rounded-2xl overflow-hidden"
            style={{ border: `1px solid rgba(${rgb},0.2)`, background: 'rgba(6,4,8,0.92)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Portrait */}
              <div className="md:col-span-3 relative h-72 md:h-auto">
                <img
                  src={activeChar.image || '/Images/gandalf_portrait.png'}
                  alt={activeChar.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: 'brightness(0.8) saturate(0.85)' }}
                />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to right, transparent 60%, rgba(6,4,8,0.95) 100%)` }} />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, rgba(6,4,8,0.95) 0%, transparent 40%)` }} />
              </div>

              {/* Info */}
              <div className="md:col-span-9 p-8 flex flex-col gap-6">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-mono text-[8px] tracking-[0.3em] uppercase ua">{activeChar.role}</p>
                  </div>
                  <h3 className="text-3xl md:text-4xl text-white font-normal" style={{ fontFamily: "'Cinzel', serif" }}>{activeChar.name}</h3>
                </div>

                {/* Stat chips */}
                {activeChar.stats && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(activeChar.stats).slice(0, 6).map(([k, v]) => (
                      <span key={k} className="px-3 py-1 rounded-full font-mono text-[8px] border" style={{ borderColor: `rgba(${rgb},0.2)`, background: `rgba(${rgb},0.07)`, color: 'rgba(255,255,255,0.65)' }}>
                        <span style={{ color: accent }}>{k}:</span> {v as string}
                      </span>
                    ))}
                  </div>
                )}

                {/* Tab strip */}
                <div className="flex gap-0 border-b" style={{ borderColor: `rgba(${rgb},0.15)` }}>
                  {(['about', 'abilities', 'quotes'] as const).map(t => (
                    <button
                      key={t}
                      onClick={() => setCharTab(t)}
                      className="px-5 py-2.5 font-mono text-[9px] tracking-[0.2em] uppercase transition-colors relative"
                      style={{ color: charTab === t ? accent : 'rgba(255,255,255,0.4)' }}
                    >
                      {t}
                      {charTab === t && <div className="absolute bottom-0 left-0 right-0 h-[2px] ua-solid" />}
                    </button>
                  ))}
                </div>

                {/* Tab content */}
                <div className="text-[13px] text-white/65 leading-relaxed font-light" style={{ fontFamily: 'Georgia, serif', minHeight: 80 }}>
                  {charTab === 'about' && (activeChar.tabs?.about || activeChar.desc || '')}
                  {charTab === 'abilities' && (activeChar.tabs?.abilities || 'No ability data recorded.')}
                  {charTab === 'quotes' && <em>&ldquo;{activeChar.tabs?.quotes || activeChar.quote || 'No quotes recorded.'}&rdquo;</em>}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FACTIONS
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={factionsRef} className="pt-16 pb-10">
        <RowHeader title="Factions &amp; Kingdoms" sub="Powers of the Realm" accent={accent} />
        <ScrollRow className="px-6 md:px-16">
          {data.factions?.map((fac: any, i: number) => (
            <FactionCard key={i} fac={fac} accent={accent} />
          ))}
        </ScrollRow>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          TIMELINE
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={tlRef} className="pt-16 pb-16" style={{ background: `linear-gradient(180deg, transparent 0%, rgba(${rgb},0.04) 50%, transparent 100%)` }}>
        <RowHeader title="Timeline of Events" sub="Ages &amp; Turning Points" accent={accent} />

        {/* Event cards scroll */}
        <ScrollRow className="px-6 md:px-16 mb-8">
          {data.events?.map((ev: any, i: number) => (
            <TimelineCard
              key={ev.id || i}
              ev={ev}
              idx={i}
              accent={accent}
              active={activeTLIdx === i}
              onClick={() => { playClick(); setActiveTLIdx(i); }}
            />
          ))}
        </ScrollRow>

        {/* Active event detail */}
        {activeEvent && (
          <div className="mx-6 md:mx-16 rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
            style={{ border: `1px solid rgba(${rgb},0.18)`, background: 'rgba(6,4,8,0.88)' }}
          >
            <div>
              <p className="font-mono text-[9px] tracking-[0.3em] uppercase ua mb-3">{activeEvent.date}</p>
              <h3 className="text-2xl md:text-3xl text-white font-normal mb-4" style={{ fontFamily: "'Cinzel', serif" }}>{activeEvent.title}</h3>
              <p className="text-[14px] text-white/65 leading-relaxed font-light" style={{ fontFamily: 'Georgia, serif' }}>{activeEvent.desc}</p>
            </div>
            <div className="relative h-56 rounded-xl overflow-hidden">
              <img
                src={activeEvent.image || data.backdrop}
                alt={activeEvent.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.65) saturate(0.8)' }}
              />
              <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}22 0%, transparent 60%)` }} />
              <div className="absolute bottom-3 left-3 font-mono text-[8px] tracking-[0.25em] uppercase ua">{activeEvent.era || 'Age of Legend'}</div>
            </div>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          LORE
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={loreRef} className="pt-16 pb-10">
        <RowHeader title="Lore &amp; Codex" sub="Secrets of the Archive" accent={accent} />
        <ScrollRow className="px-6 md:px-16">
          {data.lore?.map((item: any, i: number) => (
            <div
              key={i}
              className="shrink-0 rounded-xl p-6 flex flex-col gap-4"
              style={{
                width: 'clamp(240px,28vw,300px)',
                scrollSnapAlign: 'start',
                border: `1px solid rgba(${rgb},0.18)`,
                background: 'rgba(8,5,10,0.9)',
              }}
            >
              <div className="text-2xl">{item.icon || '📜'}</div>
              <div>
                <p className="font-mono text-[8px] tracking-[0.3em] uppercase ua mb-2">{item.type || 'Lore'}</p>
                <h4 className="text-[15px] font-semibold text-white leading-snug mb-3" style={{ fontFamily: "'Cinzel', serif" }}>{item.title}</h4>
                <p className="text-[12px] text-white/55 leading-relaxed line-clamp-4" style={{ fontFamily: 'Georgia, serif' }}>{item.desc}</p>
              </div>
            </div>
          ))}
          {(!data.lore || data.lore.length === 0) && (
            <p className="font-mono text-[11px] text-white/25 px-1">No lore entries recorded.</p>
          )}
        </ScrollRow>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          MAP / LOCATIONS
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={mapRef} className="pt-16 pb-10">
        <RowHeader title="World Map &amp; Locations" sub="Known Territories" accent={accent} />

        {/* Featured map image */}
        <div className="mx-6 md:mx-16 mb-8 relative rounded-2xl overflow-hidden h-72 md:h-96">
          <img
            src={data.locations?.[0]?.image || data.backdrop}
            alt="World Map"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.6) saturate(0.8)' }}
          />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${accent}18 0%, rgba(2,1,2,0.6) 100%)` }} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/40 mb-2">Interactive Map</p>
              <p className="text-sm text-white/25">Zoomable world map — coming soon</p>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.9) 0%, transparent 100%)' }} />
        </div>

        {/* Location cards */}
        <ScrollRow className="px-6 md:px-16">
          {data.locations?.map((loc: any, i: number) => (
            <LocCard key={i} loc={loc} />
          ))}
        </ScrollRow>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          GALLERY
      ══════════════════════════════════════════════════════════════════════ */}
      <section ref={galleryRef} className="pt-16 pb-24">
        <RowHeader title="Gallery" sub="Visual Archive" accent={accent} />
        <ScrollRow className="px-6 md:px-16">
          {[...( data.locations || []), ...(data.events?.slice(0,4) || [])].map((item: any, i: number) => (
            <div
              key={i}
              className="shrink-0 rounded-xl overflow-hidden relative"
              style={{ width: 'clamp(200px,22vw,260px)', height: 160, scrollSnapAlign: 'start' }}
            >
              <img
                src={item.image || data.backdrop}
                alt={item.name || item.title}
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.65) saturate(0.85)' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(2,1,2,0.8) 0%, transparent 60%)' }} />
              <p className="absolute bottom-3 left-3 right-3 font-mono text-[9px] tracking-[0.2em] uppercase text-white/60 truncate">{item.name || item.title}</p>
            </div>
          ))}
        </ScrollRow>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <footer
        className="px-6 md:px-16 py-10 flex items-center justify-between border-t"
        style={{ borderColor: `rgba(${rgb},0.12)`, background: 'rgba(2,1,2,0.6)' }}
      >
        <div>
          <p className="font-mono text-[8px] tracking-[0.35em] uppercase ua mb-1">{data.universeType}</p>
          <p className="text-[15px] font-normal text-white/50" style={{ fontFamily: "'Cinzel', serif" }}>{data.title}</p>
        </div>
        <button
          onClick={() => { playClick(); pageRef.current?.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/35 hover:text-white transition-colors"
        >
          ↑ Back to top
        </button>
      </footer>
    </div>
  );
}
