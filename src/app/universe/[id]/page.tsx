"use client";

import React, { useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAudio } from '@/components/AudioManager';
import { getUniverseData } from '@/data/universeRegistry';

// ─── helpers ──────────────────────────────────────────────────────────────────
function hex2rgb(hex: string) {
  const c = hex.replace('#', '');
  const f = c.length === 3 ? c.split('').map(x => x + x).join('') : c;
  const n = parseInt(f, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

// ─── tab types ─────────────────────────────────────────────────────────────────
type Tab = 'overview' | 'timeline' | 'map' | 'characters' | 'familytree' | 'factions' | 'lore' | 'events' | 'media';
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',    label: 'OVERVIEW'     },
  { id: 'timeline',    label: 'TIMELINE'     },
  { id: 'map',         label: 'MAP'          },
  { id: 'characters',  label: 'CHARACTERS'   },
  { id: 'familytree',  label: 'FAMILY TREE'  },
  { id: 'factions',    label: 'FACTIONS'     },
  { id: 'lore',        label: 'LORE'         },
  { id: 'events',      label: 'EVENTS'       },
  { id: 'media',       label: 'MEDIA'        },
];

// ─── reusable drag-scroll row ─────────────────────────────────────────────────
function HScroll({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const ox = useRef(0);
  const sl = useRef(0);
  return (
    <div ref={ref} className={`flex gap-3 overflow-x-auto ${className}`}
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      onMouseDown={e => { drag.current = true; ox.current = e.pageX - (ref.current?.offsetLeft ?? 0); sl.current = ref.current?.scrollLeft ?? 0; }}
      onMouseMove={e => { if (!drag.current || !ref.current) return; e.preventDefault(); ref.current.scrollLeft = sl.current - (e.pageX - ref.current.offsetLeft - ox.current); }}
      onMouseUp={() => { drag.current = false; }}
      onMouseLeave={() => { drag.current = false; }}>
      {children}
    </div>
  );
}

// ─── gold divider line ────────────────────────────────────────────────────────
function GoldLine({ accent }: { accent: string }) {
  return <div className="w-full h-px" style={{ background: `linear-gradient(to right, transparent, ${accent}66, transparent)` }} />;
}

// ─── section label ────────────────────────────────────────────────────────────
function SLabel({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <p className="font-mono text-[7.5px] tracking-[0.32em] uppercase mb-2.5" style={{ color: accent + 'aa' }}>{children}</p>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  OVERVIEW TAB
// ══════════════════════════════════════════════════════════════════════════════
function OverviewTab({ data, accent, rgb, onTab }: { data: any; accent: string; rgb: string; onTab: (t: Tab) => void }) {
  const featured = [
    { label: 'THE FELLOWSHIP', img: data.backdrop },
    { label: 'THE TWO TOWERS', img: data.locations?.[2]?.image || data.backdrop },
    { label: 'THE RETURN OF THE KING', img: data.locations?.[4]?.image || data.backdrop },
    { label: 'THE HOBBIT', img: data.locations?.[3]?.image || data.backdrop },
  ];
  return (
    <div className="flex flex-col gap-0 h-full">
      {/* ── Main split ── */}
      <div className="flex gap-0 flex-1 min-h-0">
        {/* Left text panel */}
        <div className="w-72 shrink-0 flex flex-col gap-5 p-7 border-r border-[#b48c3c]/15">
          <div>
            <h1 className="text-[28px] font-bold leading-none text-white tracking-[0.06em] uppercase mb-1"
              style={{ fontFamily: "'Cinzel', serif", textShadow: `0 0 40px ${accent}55` }}>
              {data.title === 'The Lord of the Rings' ? 'MIDDLE-EARTH' : data.title?.toUpperCase()}
            </h1>
            <p className="font-mono text-[7.5px] tracking-[0.35em] uppercase mb-4" style={{ color: accent + 'cc' }}>
              A WORLD OF LEGEND
            </p>
            <p className="text-[11.5px] text-white/50 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
              {data.description}
            </p>
          </div>

          {/* Metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'RACES',      val: data.metrics?.races      || '?' },
              { label: 'FACTIONS',   val: data.metrics?.factions   || '?' },
              { label: 'CHARACTERS', val: data.metrics?.characters || '?' },
              { label: 'EVENTS',     val: data.metrics?.events     || '?' },
            ].map(m => (
              <div key={m.label}>
                <p className="text-[22px] font-bold leading-none" style={{ color: accent, fontFamily: "'Cinzel', serif" }}>{m.val}</p>
                <p className="font-mono text-[7px] tracking-[0.22em] uppercase text-white/30 mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button onClick={() => onTab('map')}
            className="w-full py-2.5 rounded-sm font-mono text-[8px] tracking-[0.28em] uppercase border transition-all duration-200 hover:bg-[#b48c3c]/15"
            style={{ borderColor: accent + '66', color: accent }}>
            EXPLORE {data.title === 'The Lord of the Rings' ? 'MIDDLE-EARTH' : data.title?.toUpperCase()} ›
          </button>

          {/* Category tags */}
          <div className="flex flex-wrap gap-1.5">
            {data.categoryTags?.map((t: string) => (
              <span key={t} className="font-mono text-[6.5px] tracking-[0.2em] px-2 py-1 rounded-sm"
                style={{ background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.2)`, color: accent + 'bb' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Center big image */}
        <div className="flex-1 relative overflow-hidden">
          <img src={data.backdrop} alt={data.title}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.65) saturate(0.82)' }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to right, rgba(8,6,4,0.95) 0%, transparent 22%, transparent 75%, rgba(8,6,4,0.8) 100%)` }} />
          <div className="absolute inset-0" style={{ background: `linear-gradient(to bottom, transparent 50%, rgba(8,6,4,0.97) 100%)` }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 55% 35%, ${accent}12 0%, transparent 65%)` }} />
        </div>
      </div>

      {/* ── FEATURED strip ── */}
      <div className="border-t border-[#b48c3c]/12 px-7 pt-4 pb-5">
        <SLabel accent={accent}>FEATURED</SLabel>
        <HScroll className="gap-3">
          {featured.map((f, i) => (
            <div key={i} className="shrink-0 relative rounded-sm overflow-hidden cursor-pointer group"
              style={{ width: 160, height: 88, border: '1px solid rgba(180,140,60,0.15)' }}>
              <img src={f.img} alt={f.label}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: 'brightness(0.52) saturate(0.75)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,3,2,0.95) 0%, transparent 55%)' }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ border: `1px solid ${accent}55`, borderRadius: 2 }} />
              <p className="absolute bottom-0 left-0 right-0 p-2 font-mono text-[7px] tracking-[0.18em] text-white/60">{f.label}</p>
            </div>
          ))}
        </HScroll>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAP TAB
// ══════════════════════════════════════════════════════════════════════════════
const MAP_LOCATIONS = [
  { id: 'shire',     name: 'The Shire',     region: 'ERIADOR',    x: 18, y: 55, type: 'City',        desc: 'A peaceful, lush countryside inhabited by Hobbits. The home of Frodo and Bilbo Baggins, untouched by the outside world for centuries.' },
  { id: 'rivendell', name: 'Rivendell',     region: 'ERIADOR',    x: 28, y: 42, type: 'Stronghold',  desc: 'A hidden Elven sanctuary in Eriador, ruled by Elrond Half-elven. A place of wisdom, healing, and ancient lore.' },
  { id: 'lorien',    name: 'Lothlórien',    region: 'RHOVANION',  x: 38, y: 50, type: 'Stronghold',  desc: 'The golden wood of Galadriel and Celeborn, where time seems to stand still and magic permeates every leaf.' },
  { id: 'rohan',     name: 'Rohan',         region: 'ROHAN',      x: 34, y: 63, type: 'Region',      desc: 'The great horse-lords of the Riddermark. A plains kingdom known for its cavalry and the golden hall of Meduseld at Edoras.' },
  { id: 'gondor',    name: 'Gondor',        region: 'GONDOR',     x: 42, y: 70, type: 'City',        desc: 'The southern kingdom of Men, guardian of the White Tree and last great bastion against Mordor\'s darkness.' },
  { id: 'minastirith',name:'Minas Tirith',  region: 'GONDOR',     x: 46, y: 67, type: 'Stronghold',  desc: 'The seven-tiered citadel of Gondor, carved into Mount Mindolluin, guarding the fertile plains of the Pelennor.' },
  { id: 'mordor',    name: 'Mordor',        region: 'MORDOR',     x: 60, y: 62, type: 'Region',      desc: 'The black wasteland of Sauron, bounded by the Mountains of Shadow. A land of ash, fire, and ceaseless shadow.' },
  { id: 'mountdoom', name: 'Mount Doom',    region: 'MORDOR',     x: 65, y: 65, type: 'Landmark',    desc: 'The fiery volcano of Orodruin where the One Ring was forged and ultimately destroyed by Frodo and Gollum.' },
];

function MapTab({ data, accent, rgb }: { data: any; accent: string; rgb: string }) {
  const [selected, setSelected] = useState(MAP_LOCATIONS[1]);
  const [zoom, setZoom] = useState(1);
  const [filter, setFilter] = useState<string>('All');
  const filters = ['All', 'City', 'Stronghold', 'Region', 'Landmark'];
  const visible = filter === 'All' ? MAP_LOCATIONS : MAP_LOCATIONS.filter(l => l.type === filter);

  return (
    <div className="flex h-full">
      {/* Map area */}
      <div className="flex-1 relative overflow-hidden bg-[#0a0907]">
        <img src={data.locations?.[0]?.image || data.backdrop} alt="Map"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.38) saturate(0.5) sepia(0.4)', transform: `scale(${zoom})`, transformOrigin: 'center', transition: 'transform 0.3s' }} />

        {/* tint overlay */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${accent}08 0%, rgba(0,0,0,0.3) 100%)` }} />

        {/* Region labels */}
        {[
          { name: 'FORODWAITH', x: 35, y: 8 },
          { name: 'ERIADOR',    x: 20, y: 32 },
          { name: 'RHOVANION',  x: 55, y: 30 },
          { name: 'RHUN',       x: 78, y: 28 },
          { name: 'THE SHIRE',  x: 14, y: 56 },
          { name: 'LORIEN',     x: 37, y: 48 },
          { name: 'ROHAN',      x: 30, y: 64 },
          { name: 'GONDOR',     x: 43, y: 73 },
          { name: 'MORDOR',     x: 62, y: 60 },
        ].map(r => (
          <p key={r.name} className="absolute font-mono text-[8px] tracking-[0.35em] uppercase text-white/20 pointer-events-none select-none"
            style={{ left: `${r.x}%`, top: `${r.y}%`, transform: 'translate(-50%,-50%)', letterSpacing: '0.4em' }}>{r.name}</p>
        ))}

        {/* Location markers */}
        {visible.map(loc => (
          <button key={loc.id} onClick={() => setSelected(loc)}
            className="absolute group"
            style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%,-50%)' }}>
            <div className="relative flex items-center justify-center">
              {/* Pulse ring */}
              {selected.id === loc.id && (
                <div className="absolute w-7 h-7 rounded-full animate-ping opacity-30" style={{ background: accent }} />
              )}
              <div className="w-2.5 h-2.5 rounded-full border-2 relative z-10 transition-all duration-200 group-hover:scale-150"
                style={{
                  borderColor: accent,
                  background: selected.id === loc.id ? accent : 'rgba(8,6,4,0.9)',
                  boxShadow: selected.id === loc.id ? `0 0 12px ${accent}` : `0 0 6px ${accent}55`,
                }} />
            </div>
            {/* Label */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none z-20">
              <div className="px-2 py-1 rounded-sm font-mono text-[7.5px] text-white/90 tracking-wider"
                style={{ background: 'rgba(8,6,4,0.92)', border: `1px solid ${accent}44` }}>
                {loc.name}
              </div>
            </div>
          </button>
        ))}

        {/* Zoom controls */}
        <div className="absolute bottom-5 left-4 flex flex-col gap-1">
          {[
            { label: '+', fn: () => setZoom(z => Math.min(z + 0.25, 2.5)) },
            { label: '–', fn: () => setZoom(z => Math.max(z - 0.25, 0.75)) },
          ].map(b => (
            <button key={b.label} onClick={b.fn}
              className="w-7 h-7 font-mono text-sm flex items-center justify-center rounded-sm transition-colors hover:text-white"
              style={{ background: 'rgba(8,6,4,0.88)', border: `1px solid rgba(${rgb},0.25)`, color: accent }}>
              {b.label}
            </button>
          ))}
        </div>

        {/* Scale bar */}
        <div className="absolute bottom-5 left-16 flex items-center gap-2">
          <div className="h-px w-14" style={{ background: `${accent}88` }} />
          <p className="font-mono text-[7px] text-white/25">200 km</p>
        </div>

        {/* Filter legend */}
        <div className="absolute bottom-5 right-[304px] flex items-center gap-2">
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="font-mono text-[7px] tracking-[0.2em] uppercase px-2 py-1 rounded-sm transition-all duration-150"
              style={{
                background: filter === f ? `rgba(${rgb},0.18)` : 'rgba(8,6,4,0.7)',
                border: `1px solid ${filter === f ? accent + '66' : 'rgba(180,140,60,0.15)'}`,
                color: filter === f ? accent : 'rgba(255,255,255,0.3)',
              }}>
              {f === 'All' ? '● Cities' : f === 'Stronghold' ? '■ Strongholds' : f === 'Landmark' ? '◆ Landmarks' : `▲ ${f}`}
            </button>
          ))}
        </div>
      </div>

      {/* Right info panel */}
      <div className="w-72 shrink-0 border-l border-[#b48c3c]/15 flex flex-col">
        {/* Selected location header */}
        <div className="relative h-36 overflow-hidden shrink-0">
          <img src={data.locations?.find((l: any) => l.name.toLowerCase().includes(selected.id)) ?.image || data.backdrop}
            alt={selected.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.5) saturate(0.7)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,6,4,1) 0%, transparent 60%)' }} />
          <button className="absolute top-2.5 right-2.5 w-5 h-5 flex items-center justify-center text-white/40 hover:text-white font-mono text-xs"
            style={{ background: 'rgba(8,6,4,0.7)' }}>✕</button>
          <div className="absolute bottom-3 left-4">
            <p className="font-mono text-[7px] tracking-[0.3em] uppercase mb-0.5" style={{ color: accent + 'aa' }}>{selected.region}</p>
            <h3 className="text-[15px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>{selected.name}</h3>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 flex flex-col gap-4 overflow-y-auto flex-1">
          <p className="text-[11.5px] text-white/55 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{selected.desc}</p>
          <GoldLine accent={accent} />

          {/* Details */}
          <div>
            <SLabel accent={accent}>DETAILS</SLabel>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Type',      val: selected.type },
                { label: 'Race',      val: selected.type === 'Stronghold' ? 'Elves' : 'Mixed' },
                { label: 'Region',    val: selected.region },
                { label: 'Founded',   val: 'Second Age' },
                { label: 'Population',val: 'Unknown' },
              ].map(d => (
                <div key={d.label} className="flex justify-between items-baseline">
                  <p className="font-mono text-[8px] text-white/30 tracking-wider uppercase">{d.label}</p>
                  <p className="font-mono text-[9px] text-white/65">{d.val}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-2 font-mono text-[7.5px] tracking-[0.25em] uppercase border rounded-sm transition-colors hover:bg-[#b48c3c]/10"
            style={{ borderColor: accent + '44', color: accent }}>
            VIEW DETAILS ›
          </button>
        </div>

        {/* Location list */}
        <div className="border-t border-[#b48c3c]/12 p-3">
          <SLabel accent={accent}>LOCATIONS</SLabel>
          <div className="flex flex-col gap-0.5 max-h-40 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            {MAP_LOCATIONS.map(loc => (
              <button key={loc.id} onClick={() => setSelected(loc)}
                className="flex items-center gap-2.5 px-2 py-1.5 rounded-sm text-left transition-colors group"
                style={{ background: selected.id === loc.id ? `rgba(${rgb},0.12)` : 'transparent' }}>
                <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: selected.id === loc.id ? accent : 'rgba(180,140,60,0.3)' }} />
                <span className="font-mono text-[8.5px] tracking-wider text-white/55 group-hover:text-white/80 transition-colors truncate">{loc.name}</span>
                <span className="ml-auto font-mono text-[7px] text-white/20 shrink-0">{loc.type}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  CHARACTERS TAB
// ══════════════════════════════════════════════════════════════════════════════
function CharactersTab({ data, accent, rgb }: { data: any; accent: string; rgb: string }) {
  const chars = data.characters || [];
  const [search, setSearch] = useState('');
  const [active, setActive] = useState(chars[0] ?? null);
  const [subTab, setSubTab] = useState<'about' | 'relationships' | 'appearance' | 'abilities' | 'events' | 'quotes'>('about');
  const filtered = chars.filter((c: any) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex h-full">
      {/* Left character list */}
      <div className="w-52 shrink-0 border-r border-[#b48c3c]/15 flex flex-col">
        <div className="p-3 border-b border-[#b48c3c]/12">
          <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-white/30 mb-2">◂ CHARACTERS</p>
          <div className="relative">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search characters..."
              className="w-full bg-[#0d0b08] border rounded-sm px-2.5 py-1.5 font-mono text-[9px] text-white/60 placeholder-white/20 outline-none"
              style={{ borderColor: `rgba(${rgb},0.2)` }} />
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white/25 text-[10px]">⌕</span>
          </div>
        </div>
        <p className="font-mono text-[7px] tracking-[0.25em] uppercase text-white/25 px-3 pt-3 pb-1.5">FEATURED CHARACTERS</p>
        <div className="flex flex-col overflow-y-auto flex-1" style={{ scrollbarWidth: 'none' }}>
          {filtered.map((char: any) => (
            <button key={char.id} onClick={() => { setActive(char); setSubTab('about'); }}
              className="flex items-center gap-2.5 px-3 py-2.5 text-left transition-colors border-b"
              style={{
                background: active?.id === char.id ? `rgba(${rgb},0.14)` : 'transparent',
                borderColor: 'rgba(180,140,60,0.08)',
                borderLeft: active?.id === char.id ? `2px solid ${accent}` : '2px solid transparent',
              }}>
              <div className="w-7 h-7 rounded-sm overflow-hidden shrink-0">
                <img src={char.image || '/Images/gandalf_portrait.png'} alt={char.name}
                  className="w-full h-full object-cover" style={{ filter: 'brightness(0.75)' }} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[9px] text-white/80 truncate font-medium">{char.name}</p>
                <p className="font-mono text-[7px] truncate" style={{ color: accent + '99' }}>{char.role?.split(',')[0]}</p>
              </div>
            </button>
          ))}
        </div>
        <div className="border-t border-[#b48c3c]/12 p-3">
          <button className="w-full font-mono text-[7.5px] tracking-[0.25em] uppercase text-white/25 hover:text-white/60 transition-colors">
            VIEW ALL CHARACTERS ›
          </button>
        </div>
      </div>

      {/* Center hero */}
      {active && (
        <div className="flex-1 relative overflow-hidden">
          <img src={active.image || '/Images/gandalf_portrait.png'} alt={active.name}
            className="absolute inset-0 w-full h-full object-cover object-top"
            style={{ filter: 'brightness(0.5) saturate(0.75)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(8,6,4,0.7) 0%, transparent 35%, transparent 65%, rgba(8,6,4,0.85) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.98) 0%, transparent 50%)' }} />
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 40% 30%, ${accent}10 0%, transparent 60%)` }} />

          {/* Name + subtitle */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <p className="font-mono text-[8px] tracking-[0.35em] uppercase mb-1" style={{ color: accent }}>{active.role}</p>
            <h2 className="text-[36px] font-bold text-white leading-none mb-1.5 uppercase"
              style={{ fontFamily: "'Cinzel', serif", textShadow: `0 0 60px ${accent}44` }}>
              {active.name.toUpperCase()}
            </h2>
            <p className="text-[11px] text-white/45 italic mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              &ldquo;{active.quote || active.tabs?.quotes?.split('·')[0]?.trim()?.replace(/^"|"$/g, '')}&rdquo;
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-x-6 gap-y-1.5 mb-5">
              {Object.entries(active.stats || {}).slice(0, 6).map(([k, v]) => (
                <div key={k}>
                  <p className="font-mono text-[7px] uppercase tracking-widest text-white/30">{k}</p>
                  <p className="font-mono text-[10px] text-white/75">{v as string}</p>
                </div>
              ))}
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-0 border-b mb-4" style={{ borderColor: `rgba(${rgb},0.18)` }}>
              {(['about','relationships','appearance','abilities','events','quotes'] as const).map(t => (
                <button key={t} onClick={() => setSubTab(t)}
                  className="relative pb-2.5 pr-5 font-mono text-[7.5px] tracking-[0.22em] uppercase transition-colors"
                  style={{ color: subTab === t ? accent : 'rgba(255,255,255,0.3)' }}>
                  {t.toUpperCase()}
                  {subTab === t && <span className="absolute bottom-0 left-0 right-3 h-[1.5px]" style={{ background: accent }} />}
                </button>
              ))}
            </div>

            {/* Sub-tab content */}
            <div className="text-[12.5px] text-white/55 leading-relaxed max-w-xl" style={{ fontFamily: 'Georgia, serif', minHeight: 52 }}>
              {subTab === 'about'         && (active.tabs?.about       || active.desc || '—')}
              {subTab === 'relationships' && (active.tabs?.relationships || '—')}
              {subTab === 'appearance'    && (active.tabs?.appearance    || '—')}
              {subTab === 'abilities'     && (active.tabs?.abilities     || '—')}
              {subTab === 'events'        && 'Key events for this character are being compiled into the archive…'}
              {subTab === 'quotes'        && <em>&ldquo;{active.tabs?.quotes || active.quote || '—'}&rdquo;</em>}
            </div>
          </div>
        </div>
      )}

      {/* Right detail panel */}
      {active && (
        <div className="w-64 shrink-0 border-l border-[#b48c3c]/15 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          {/* Relationships */}
          {active.relationships && active.relationships.length > 0 && (
            <div className="p-4 border-b border-[#b48c3c]/12">
              <SLabel accent={accent}>RELATIONSHIPS</SLabel>
              <div className="flex flex-col gap-1.5">
                {active.relationships.map((r: any) => (
                  <div key={r.name} className="flex items-center gap-2.5 py-1.5 px-2 rounded-sm cursor-pointer hover:bg-white/[0.03] transition-colors">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm shrink-0"
                      style={{ background: `rgba(${rgb},0.2)`, border: `1px solid rgba(${rgb},0.3)` }}>
                      {r.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[9px] text-white/70 truncate">{r.name}</p>
                      <p className="font-mono text-[7px] truncate" style={{ color: accent + '88' }}>{r.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats detail */}
          <div className="p-4 border-b border-[#b48c3c]/12">
            <SLabel accent={accent}>CHARACTER INFO</SLabel>
            {Object.entries(active.stats || {}).map(([k, v]) => (
              <div key={k} className="flex justify-between items-baseline py-1 border-b last:border-0" style={{ borderColor: 'rgba(180,140,60,0.06)' }}>
                <p className="font-mono text-[7.5px] uppercase tracking-wider text-white/28">{k}</p>
                <p className="font-mono text-[9px] text-white/60 text-right max-w-[120px]">{v as string}</p>
              </div>
            ))}
          </div>

          {/* PlayedBy */}
          {active.stats?.PlayedBy && (
            <div className="p-4">
              <SLabel accent={accent}>PLAYED BY</SLabel>
              <p className="font-mono text-[10px] text-white/60">
                {active.stats.PlayedBy}<br />
                <span className="text-[7.5px] text-white/25">FULL NAME</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  FAMILY TREE TAB
// ══════════════════════════════════════════════════════════════════════════════
function FamilyTreeTab({ data, accent }: { data: any; accent: string }) {
  const ft = data.familyTree;
  const [selected, setSelected] = useState(ft?.members?.find((m: any) => m.role === 'Selected Character') ?? ft?.members?.[0]);
  if (!ft) return (
    <div className="flex-1 flex items-center justify-center">
      <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20">No family tree data available</p>
    </div>
  );
  const byTier: Record<number, any[]> = {};
  ft.members.forEach((m: any) => { (byTier[m.tier] = byTier[m.tier] || []).push(m); });
  const tiers = Object.keys(byTier).map(Number).sort();

  return (
    <div className="flex h-full">
      {/* Tree area */}
      <div className="flex-1 relative overflow-auto p-8">
        {/* Title */}
        <div className="mb-8">
          <p className="font-mono text-[7.5px] tracking-[0.35em] uppercase mb-1" style={{ color: accent + 'aa' }}>◉ {ft.title}</p>
          <GoldLine accent={accent} />
        </div>

        {/* Tier rows */}
        <div className="flex flex-col gap-10">
          {tiers.map(tier => (
            <div key={tier} className="flex items-start justify-center gap-8 flex-wrap">
              {byTier[tier].map((m: any) => {
                const isSel = selected?.id === m.id;
                return (
                  <button key={m.id} onClick={() => setSelected(m)}
                    className="flex flex-col items-center gap-2 group"
                    style={{ minWidth: 90 }}>
                    {/* Portrait node */}
                    <div className="relative w-[60px] h-[60px] rounded-sm overflow-hidden transition-all duration-200"
                      style={{
                        border: isSel ? `2px solid ${accent}` : `1px solid rgba(180,140,60,0.25)`,
                        boxShadow: isSel ? `0 0 20px ${accent}55` : 'none',
                      }}>
                      <img src={data.characters?.find((c: any) => c.id === m.id)?.image || '/Images/gandalf_portrait.png'}
                        alt={m.name} className="w-full h-full object-cover"
                        style={{ filter: 'brightness(0.7) saturate(0.8)' }} />
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.8) 0%, transparent 60%)' }} />
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-[8px] text-white/70 font-medium leading-tight max-w-[80px] text-center group-hover:text-white transition-colors">{m.name}</p>
                      <p className="font-mono text-[6.5px] mt-0.5" style={{ color: accent + '88' }}>{m.role}</p>
                    </div>
                    {/* Spouse indicator */}
                    {m.spouseName && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <div className="h-px w-4" style={{ background: accent + '55' }} />
                        <p className="font-mono text-[6px] text-white/30">+ {m.spouseName}</p>
                        <div className="h-px w-4" style={{ background: accent + '55' }} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <p className="font-mono text-[8px] text-white/20">100%</p>
          <div className="h-px w-10" style={{ background: accent + '33' }} />
          <p className="font-mono text-[8px]" style={{ color: accent + '66' }}>+ LEGEND</p>
        </div>

        {/* Lineage path indicator */}
        {selected && (
          <div className="absolute bottom-4 right-[280px] max-w-[160px]">
            <SLabel accent={accent}>LINEAGE PATH</SLabel>
            <div className="flex flex-col gap-0.5">
              {ft.members.filter((m: any) => m.parentIds?.includes(selected.id) || selected.parentIds?.includes(m.id)).slice(0,5).map((m: any) => (
                <p key={m.id} className="font-mono text-[8px] text-white/40">• {m.name}</p>
              ))}
              {selected && <p className="font-mono text-[8px]" style={{ color: accent }}>● {selected.name}</p>}
            </div>
          </div>
        )}
      </div>

      {/* Right panel */}
      {selected && (
        <div className="w-64 shrink-0 border-l border-[#b48c3c]/15 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="relative h-28 overflow-hidden shrink-0">
            <img src={data.characters?.find((c: any) => c.id === selected.id)?.image || data.backdrop}
              alt={selected.name} className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.45) saturate(0.7)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,6,4,1) 0%, transparent 55%)' }} />
            <div className="absolute bottom-3 left-4">
              <p className="font-mono text-[7px] uppercase tracking-widest mb-0.5" style={{ color: accent + 'aa' }}>{selected.role}</p>
              <h3 className="text-[14px] font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>{selected.name}</h3>
            </div>
          </div>
          <div className="p-4 flex flex-col gap-4">
            {selected.details && (
              <div>
                <SLabel accent={accent}>DETAILS</SLabel>
                {Object.entries(selected.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1 border-b last:border-0 text-[9px]" style={{ borderColor: 'rgba(180,140,60,0.06)' }}>
                    <span className="font-mono text-white/28 uppercase tracking-wider text-[7.5px]">{k}</span>
                    <span className="font-mono text-white/60">{v as string}</span>
                  </div>
                ))}
              </div>
            )}
            <button className="w-full py-2 font-mono text-[7.5px] tracking-[0.25em] uppercase border rounded-sm hover:bg-[#b48c3c]/10 transition-colors"
              style={{ borderColor: accent + '44', color: accent }}>
              VIEW CHARACTER ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  TIMELINE TAB
// ══════════════════════════════════════════════════════════════════════════════
function TimelineTab({ data, accent, rgb }: { data: any; accent: string; rgb: string }) {
  const events = data.events || [];
  const [active, setActive] = useState(events[0] ?? null);
  return (
    <div className="flex h-full">
      {/* Left event list */}
      <div className="w-64 shrink-0 border-r border-[#b48c3c]/15 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="p-4 border-b border-[#b48c3c]/12">
          <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-white/30">ALL EVENTS</p>
        </div>
        <div className="flex flex-col">
          {events.map((ev: any, i: number) => (
            <button key={ev.id || i} onClick={() => setActive(ev)}
              className="flex items-start gap-3 px-4 py-3.5 text-left border-b transition-colors group"
              style={{
                borderColor: 'rgba(180,140,60,0.08)',
                background: active?.id === ev.id ? `rgba(${rgb},0.12)` : 'transparent',
                borderLeft: active?.id === ev.id ? `2px solid ${accent}` : '2px solid transparent',
              }}>
              <div className="shrink-0 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: active?.id === ev.id ? accent : `rgba(${rgb},0.4)` }} />
              </div>
              <div className="min-w-0">
                <p className="font-mono text-[7px] uppercase tracking-widest mb-0.5" style={{ color: accent + '88' }}>{ev.date}</p>
                <p className="font-mono text-[9px] text-white/65 leading-snug group-hover:text-white/85 transition-colors">{ev.title}</p>
                <p className="font-mono text-[7.5px] text-white/28 mt-1 line-clamp-2 leading-snug">{ev.desc?.substring(0, 70)}…</p>
              </div>
            </button>
          ))}
        </div>
        <div className="border-t border-[#b48c3c]/12 p-3 mt-auto">
          <button className="w-full font-mono text-[7.5px] tracking-[0.25em] uppercase text-white/25 hover:text-white/60 transition-colors">
            SEW ALL EVENTS ›
          </button>
        </div>
      </div>

      {/* Active event detail */}
      {active ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Event hero image */}
          <div className="relative h-56 shrink-0 overflow-hidden">
            <img src={active.image || data.backdrop} alt={active.title}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.48) saturate(0.72)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(8,6,4,0.98) 100%)' }} />
            <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 40%, ${accent}0e 0%, transparent 70%)` }} />
          </div>

          {/* Event info */}
          <div className="p-7 flex flex-col gap-5 overflow-y-auto flex-1" style={{ scrollbarWidth: 'none' }}>
            <div>
              <p className="font-mono text-[8px] tracking-[0.32em] uppercase mb-2" style={{ color: accent }}>{active.date} {active.era ? `· ${active.era}` : ''}</p>
              <h2 className="text-[24px] font-bold text-white uppercase leading-tight mb-4"
                style={{ fontFamily: "'Cinzel', serif" }}>
                {active.title.toUpperCase()}
              </h2>
              <GoldLine accent={accent} />
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{active.desc}</p>
            <button className="w-fit font-mono text-[8px] tracking-[0.28em] uppercase px-5 py-2.5 rounded-sm border transition-all hover:bg-[#b48c3c]/10"
              style={{ borderColor: accent + '55', color: accent }}>
              READ FULL ARTICLE ›
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20">Select an event</p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  FACTIONS TAB
// ══════════════════════════════════════════════════════════════════════════════
function FactionsTab({ data, accent, rgb }: { data: any; accent: string; rgb: string }) {
  const factions = data.factions || [];
  const [active, setActive] = useState(factions[0] ?? null);
  return (
    <div className="flex h-full">
      {/* Left list */}
      <div className="w-52 shrink-0 border-r border-[#b48c3c]/15 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="p-3 border-b border-[#b48c3c]/12">
          <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-white/30">ALL FACTIONS</p>
        </div>
        {factions.map((f: any) => (
          <button key={f.id} onClick={() => setActive(f)}
            className="flex items-center gap-2.5 px-3 py-3 border-b text-left transition-colors"
            style={{
              borderColor: 'rgba(180,140,60,0.08)',
              background: active?.id === f.id ? `rgba(${rgb},0.12)` : 'transparent',
              borderLeft: active?.id === f.id ? `2px solid ${accent}` : '2px solid transparent',
            }}>
            <span className="text-lg shrink-0">{f.emblem || '🛡️'}</span>
            <div className="min-w-0">
              <p className="font-mono text-[9px] text-white/70 font-medium truncate">{f.name}</p>
              <p className="font-mono text-[7px] truncate" style={{ color: accent + '88' }}>{f.leader}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Center detail */}
      {active && (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="relative h-52 shrink-0 overflow-hidden">
            <img src={data.backdrop} alt={active.name}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.4) saturate(0.65)' }} />
            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${accent}12 0%, rgba(8,6,4,0.85) 100%)` }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(8,6,4,1) 100%)' }} />
            <div className="absolute bottom-0 left-0 p-6 flex items-end gap-4">
              <span className="text-4xl">{active.emblem || '🛡️'}</span>
              <div>
                <p className="font-mono text-[7.5px] uppercase tracking-widest mb-1" style={{ color: accent + 'aa' }}>
                  {active.alignment || active.type || 'Faction'}
                </p>
                <h2 className="text-[26px] font-bold text-white uppercase" style={{ fontFamily: "'Cinzel', serif" }}>{active.name}</h2>
              </div>
            </div>
          </div>

          <div className="p-7 flex flex-col gap-5 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
            <p className="text-[13px] text-white/55 leading-relaxed max-w-2xl" style={{ fontFamily: 'Georgia, serif' }}>{active.desc}</p>
            <GoldLine accent={accent} />

            {active.leader && (
              <div>
                <SLabel accent={accent}>LEADER</SLabel>
                <p className="font-mono text-[11px] text-white/65">{active.leader}</p>
              </div>
            )}

            {active.base && (
              <div>
                <SLabel accent={accent}>BASE</SLabel>
                <p className="font-mono text-[11px] text-white/65">{active.base}</p>
              </div>
            )}

            {active.members && (
              <div>
                <SLabel accent={accent}>IMPORTANT FIGURES</SLabel>
                <div className="flex flex-wrap gap-2">
                  {active.members.map((m: any) => (
                    <div key={m.name} className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm"
                      style={{ border: `1px solid rgba(${rgb},0.2)`, background: `rgba(${rgb},0.07)` }}>
                      <span className="text-xs">{m.avatar}</span>
                      <span className="font-mono text-[8px] text-white/60">{m.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Right panel — map thumbnail */}
      <div className="w-64 shrink-0 border-l border-[#b48c3c]/15 flex flex-col">
        <div className="relative h-40 overflow-hidden shrink-0">
          <img src={data.backdrop} alt="map" className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'brightness(0.35) saturate(0.5) sepia(0.3)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 50%, rgba(8,6,4,1) 100%)' }} />
          <p className="absolute bottom-3 left-4 font-mono text-[7.5px] tracking-widest uppercase" style={{ color: accent + '88' }}>TERRITORY MAP</p>
        </div>
        <div className="p-4 flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <SLabel accent={accent}>ALL FACTIONS</SLabel>
          <div className="flex flex-col gap-1">
            {factions.map((f: any) => (
              <button key={f.id} onClick={() => setActive(f)}
                className="flex items-center gap-2 py-1.5 px-2 rounded-sm hover:bg-white/[0.03] text-left transition-colors">
                <span className="text-sm shrink-0">{f.emblem || '🛡️'}</span>
                <p className="font-mono text-[8.5px] text-white/50 truncate">{f.name}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  LORE TAB
// ══════════════════════════════════════════════════════════════════════════════
function LoreTab({ data, accent, rgb }: { data: any; accent: string; rgb: string }) {
  const items = data.lore || [];
  const [active, setActive] = useState(items[0] ?? null);
  return (
    <div className="flex h-full">
      <div className="w-52 shrink-0 border-r border-[#b48c3c]/15 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="p-3 border-b border-[#b48c3c]/12">
          <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-white/30">LORE ENTRIES</p>
        </div>
        {items.length > 0 ? items.map((it: any) => (
          <button key={it.id} onClick={() => setActive(it)}
            className="px-3 py-3 border-b text-left transition-colors"
            style={{
              borderColor: 'rgba(180,140,60,0.08)',
              background: active?.id === it.id ? `rgba(${rgb},0.12)` : 'transparent',
              borderLeft: active?.id === it.id ? `2px solid ${accent}` : '2px solid transparent',
            }}>
            <p className="font-mono text-[9px] text-white/65">{it.title}</p>
          </button>
        )) : <div className="p-4"><p className="font-mono text-[8px] text-white/25">No entries yet</p></div>}
      </div>
      <div className="flex-1 overflow-y-auto p-7" style={{ scrollbarWidth: 'none' }}>
        {active ? (
          <div className="flex flex-col gap-5 max-w-2xl">
            <div>
              <p className="font-mono text-[8px] tracking-[0.32em] uppercase mb-2" style={{ color: accent }}>LORE ENTRY</p>
              <h2 className="text-[22px] font-bold text-white uppercase mb-4" style={{ fontFamily: "'Cinzel', serif" }}>{active.title?.toUpperCase()}</h2>
              <GoldLine accent={accent} />
            </div>
            <p className="text-[13px] text-white/55 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{active.desc}</p>
          </div>
        ) : (
          <p className="font-mono text-[9px] tracking-[0.3em] uppercase text-white/20 mt-20 text-center">Select a lore entry</p>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  EVENTS TAB
// ══════════════════════════════════════════════════════════════════════════════
function EventsTab({ data, accent, rgb }: { data: any; accent: string; rgb: string }) {
  const events = data.events || [];
  const [active, setActive] = useState(events[0] ?? null);
  return (
    <div className="flex h-full">
      {/* upcoming list */}
      <div className="w-60 shrink-0 border-r border-[#b48c3c]/15 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="p-3 border-b border-[#b48c3c]/12">
          <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-white/30">UPCOMING EVENTS</p>
        </div>
        {events.map((ev: any, i: number) => (
          <button key={i} onClick={() => setActive(ev)}
            className="flex items-start gap-3 px-3 py-3 border-b text-left transition-colors"
            style={{
              borderColor: 'rgba(180,140,60,0.08)',
              background: active?.id === ev.id ? `rgba(${rgb},0.12)` : 'transparent',
              borderLeft: active?.id === ev.id ? `2px solid ${accent}` : '2px solid transparent',
            }}>
            <div className="w-10 h-10 rounded-sm overflow-hidden shrink-0">
              <img src={ev.image || data.backdrop} alt={ev.title} className="w-full h-full object-cover" style={{ filter: 'brightness(0.6)' }} />
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[9px] text-white/65 leading-snug truncate">{ev.title}</p>
              <p className="font-mono text-[7px] mt-0.5" style={{ color: accent + '88' }}>{ev.date}</p>
            </div>
          </button>
        ))}
        <div className="border-t border-[#b48c3c]/12 p-3 mt-auto">
          <button className="w-full font-mono text-[7.5px] tracking-[0.25em] uppercase text-white/25">SHOW ALL EVENTS ›</button>
        </div>
      </div>

      {/* event detail */}
      {active && (
        <div className="flex-1 overflow-y-auto p-7 flex flex-col gap-5" style={{ scrollbarWidth: 'none' }}>
          <div className="relative h-48 rounded-sm overflow-hidden shrink-0" style={{ border: `1px solid rgba(${rgb},0.18)` }}>
            <img src={active.image || data.backdrop} alt={active.title}
              className="absolute inset-0 w-full h-full object-cover" style={{ filter: 'brightness(0.5) saturate(0.75)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 40%, rgba(8,6,4,0.95) 100%)' }} />
            <div className="absolute bottom-0 p-5">
              <p className="font-mono text-[7.5px] uppercase tracking-widest mb-1" style={{ color: accent }}>{active.date}</p>
              <h3 className="text-[20px] font-bold text-white uppercase" style={{ fontFamily: "'Cinzel', serif" }}>{active.title.toUpperCase()}</h3>
            </div>
          </div>
          <p className="text-[13px] text-white/55 leading-relaxed max-w-2xl" style={{ fontFamily: 'Georgia, serif' }}>{active.desc}</p>
        </div>
      )}

      {/* right media library */}
      <div className="w-56 shrink-0 border-l border-[#b48c3c]/15 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        <div className="p-3 border-b border-[#b48c3c]/12">
          <p className="font-mono text-[7.5px] tracking-[0.3em] uppercase text-white/30">MEDIA LIBRARY</p>
        </div>
        <div className="p-3 flex flex-col gap-2">
          {[
            { label: 'Images',    count: data.media?.images?.length    || 0, icon: '🖼' },
            { label: 'Artifacts', count: data.media?.artifacts?.length || 0, icon: '🏺' },
            { label: 'Videos',    count: data.media?.videos?.length    || 0, icon: '🎬' },
            { label: 'Documents', count: data.media?.documents?.length || 0, icon: '📄' },
          ].map(m => (
            <div key={m.label} className="flex items-center justify-between px-2 py-2 rounded-sm"
              style={{ border: `1px solid rgba(${rgb},0.12)`, background: `rgba(${rgb},0.04)` }}>
              <div className="flex items-center gap-2">
                <span className="text-sm">{m.icon}</span>
                <p className="font-mono text-[8.5px] text-white/50">{m.label}</p>
              </div>
              <p className="font-mono text-[9px]" style={{ color: accent + '99' }}>{m.count}</p>
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-[#b48c3c]/12 mt-auto">
          <button className="w-full font-mono text-[7.5px] tracking-[0.25em] uppercase text-white/25">BROWSE LIBRARY ›</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MEDIA TAB
// ══════════════════════════════════════════════════════════════════════════════
function MediaTab({ data, accent, rgb }: { data: any; accent: string; rgb: string }) {
  const media = data.media || {};
  const allItems = [
    ...(media.images || []).map((i: any) => ({ ...i, type: 'Image', src: i.url })),
    ...(data.locations || []).map((l: any) => ({ title: l.name, src: l.image, type: 'Location' })),
    ...(data.events || []).map((e: any) => ({ title: e.title, src: e.image || data.backdrop, type: 'Event' })),
  ];

  return (
    <div className="flex h-full">
      {/* Gallery grid */}
      <div className="flex-1 overflow-y-auto p-5" style={{ scrollbarWidth: 'none' }}>
        <SLabel accent={accent}>GALLERY</SLabel>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {allItems.map((item, i) => (
            <div key={i} className="relative rounded-sm overflow-hidden aspect-video group cursor-pointer"
              style={{ border: '1px solid rgba(180,140,60,0.12)' }}>
              <img src={item.src || data.backdrop} alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: 'brightness(0.58) saturate(0.75)' }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(4,3,2,0.88) 0%, transparent 55%)' }} />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{ border: `1px solid ${accent}44`, borderRadius: 2 }} />
              <div className="absolute bottom-0 left-0 right-0 p-2">
                <p className="font-mono text-[7px] tracking-wider uppercase text-white/45 truncate">{item.title}</p>
                <p className="font-mono text-[6px] text-white/20">{item.type}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right sidebar */}
      <div className="w-56 shrink-0 border-l border-[#b48c3c]/15 flex flex-col overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {/* Soundtracks */}
        {media.soundtracks && (
          <div className="p-4 border-b border-[#b48c3c]/12">
            <SLabel accent={accent}>SOUNDTRACK</SLabel>
            {media.soundtracks.map((s: any, i: number) => (
              <div key={i} className="flex items-center gap-2 py-2 border-b last:border-0" style={{ borderColor: 'rgba(180,140,60,0.06)' }}>
                <div className="w-6 h-6 rounded-full border flex items-center justify-center text-[9px]"
                  style={{ borderColor: `rgba(${rgb},0.3)`, color: accent }}>▶</div>
                <div className="min-w-0">
                  <p className="font-mono text-[8px] text-white/55 truncate">{s.title}</p>
                  {s.duration && <p className="font-mono text-[6.5px] text-white/25">{s.duration}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Artifacts */}
        {media.artifacts && (
          <div className="p-4 border-b border-[#b48c3c]/12">
            <SLabel accent={accent}>ARTIFACTS</SLabel>
            {media.artifacts.map((a: any, i: number) => (
              <div key={i} className="flex items-center gap-2 py-1.5 text-[8.5px]">
                <span className="text-white/20">🏺</span>
                <span className="font-mono text-white/45 truncate">{a.title}</span>
              </div>
            ))}
          </div>
        )}

        {/* Documents */}
        {media.documents && (
          <div className="p-4">
            <SLabel accent={accent}>DOCUMENTS</SLabel>
            {media.documents.map((d: any, i: number) => (
              <div key={i} className="flex items-center gap-2 py-1.5 text-[8.5px]">
                <span className="text-white/20">📄</span>
                <span className="font-mono text-white/45 truncate">{d.title}</span>
              </div>
            ))}
          </div>
        )}

        <div className="p-3 border-t border-[#b48c3c]/12 mt-auto">
          <button className="w-full font-mono text-[7.5px] tracking-[0.25em] uppercase text-white/25">BROWSE ARCHIVE ›</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  MAIN PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function UniverseOverviewPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { playClick, playHover } = useAudio();
  const data = getUniverseData(id);
  const accent = data.accentColor || '#d4a030';
  const rgb = hex2rgb(accent);

  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const switchTab = useCallback((t: Tab) => { playClick(); setActiveTab(t); }, [playClick]);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-[#050403] text-white">
      {/* ── Global scoped CSS ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root { --ua: ${accent}; --ua-rgb: ${rgb}; }
        .ua  { color: ${accent} !important; }
        * { box-sizing: border-box; }
        /* hide scrollbars globally for this page */
        .hide-scroll::-webkit-scrollbar { display: none; }
      `}} />

      {/* ══════════════════════════════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════════════════════════════ */}
      <header className="shrink-0 border-b" style={{ background: 'rgba(4,3,2,0.97)', borderColor: 'rgba(180,140,60,0.14)', backdropFilter: 'blur(20px)' }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-2.5">
          {/* Logo */}
          <button onClick={() => { playClick(); router.push('/'); }}
            onMouseEnter={() => playHover()}
            className="flex items-center gap-2 group shrink-0">
            <div className="w-5 h-5 flex items-center justify-center">
              <svg viewBox="0 0 20 20" className="w-4 h-4 fill-current" style={{ color: accent }}>
                <polygon points="10,1 13,7 19,7 14.5,11 16.5,17 10,13 3.5,17 5.5,11 1,7 7,7" />
              </svg>
            </div>
            <span className="font-mono text-[9px] tracking-[0.35em] uppercase" style={{ color: accent }}>ORYVON</span>
          </button>

          {/* Universe title centered */}
          <div className="absolute left-1/2 -translate-x-1/2 text-center pointer-events-none">
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/90 font-medium" style={{ fontFamily: "'Cinzel', serif" }}>
              {data.title?.toUpperCase()}
            </p>
            <p className="font-mono text-[7px] tracking-[0.35em] uppercase" style={{ color: accent + '99' }}>
              {data.subtitle || data.universeType}
            </p>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative">
              <input placeholder="Search..." className="bg-[#0d0b07] border rounded-sm pl-6 pr-3 py-1.5 font-mono text-[8.5px] text-white/50 placeholder-white/20 outline-none w-32"
                style={{ borderColor: 'rgba(180,140,60,0.2)' }} />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/25 text-[9px]">⌕</span>
            </div>
            {['★', '🔊', '☰'].map(ic => (
              <button key={ic} className="w-7 h-7 flex items-center justify-center rounded-sm text-[11px] text-white/35 hover:text-white transition-colors"
                style={{ border: '1px solid rgba(180,140,60,0.15)' }}>
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* Tab nav */}
        <div className="flex items-center px-5" style={{ borderTop: 'none' }}>
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => switchTab(tab.id)} onMouseEnter={() => playHover()}
              className="relative py-2.5 px-4 font-mono text-[8px] tracking-[0.26em] uppercase shrink-0 transition-colors duration-200"
              style={{ color: activeTab === tab.id ? accent : 'rgba(255,255,255,0.32)' }}>
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-[1.5px]" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
              )}
            </button>
          ))}
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          CONTENT AREA — fills remaining screen height
      ══════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 min-h-0 overflow-hidden" style={{ background: '#050403' }}>
        {activeTab === 'overview'   && <OverviewTab   data={data} accent={accent} rgb={rgb} onTab={switchTab} />}
        {activeTab === 'map'        && <MapTab        data={data} accent={accent} rgb={rgb} />}
        {activeTab === 'characters' && <CharactersTab data={data} accent={accent} rgb={rgb} />}
        {activeTab === 'familytree' && <FamilyTreeTab data={data} accent={accent} />}
        {activeTab === 'timeline'   && <TimelineTab   data={data} accent={accent} rgb={rgb} />}
        {activeTab === 'factions'   && <FactionsTab   data={data} accent={accent} rgb={rgb} />}
        {activeTab === 'lore'       && <LoreTab       data={data} accent={accent} rgb={rgb} />}
        {activeTab === 'events'     && <EventsTab     data={data} accent={accent} rgb={rgb} />}
        {activeTab === 'media'      && <MediaTab      data={data} accent={accent} rgb={rgb} />}
      </main>
    </div>
  );
}
