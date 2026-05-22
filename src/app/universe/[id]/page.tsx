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
//  MAP TAB  — Premium Middle-earth Atlas
// ══════════════════════════════════════════════════════════════════════════════
const MAP_LOCATIONS = [
  { id: 'shire',      name: 'The Shire',   region: 'Eriador',   x: 17,  y: 52,  type: 'City',       races: 'Hobbits',    govt: 'Shire Thain',  age: 'Before TA 1601', area: 'Approx. 1,000 sq mi', desc: 'The Shire is a peaceful region located in the northwest of Middle-earth, home to the Hobbits. Known for its rolling green hills, fertile lands, and secluded way of life.', locations: ['Hobbiton','Bag End','Bywater','Crickhollow'], img: '/Images/middle_earth_rivendell.png' },
  { id: 'rivendell',  name: 'Rivendell',   region: 'Eriador',   x: 31,  y: 40,  type: 'Stronghold', races: 'Elves',      govt: 'Lord Elrond',  age: 'Second Age',     area: 'Hidden valley',       desc: 'A hidden Elven sanctuary founded by Elrond Half-elven, nestled in a steep valley by the River Bruinen. A refuge of wisdom, healing, and ancient lore.',              locations: ['Hall of Fire','Library','Forge'], img: '/Images/middle_earth_rivendell.png' },
  { id: 'bree',       name: 'Bree',        region: 'Eriador',   x: 22,  y: 46,  type: 'City',       races: 'Men, Hobbits',govt: 'Bree-moot',   age: 'First Age',      area: 'Small township',      desc: 'An ancient crossroads town where the Great East Road meets the North Road. Home to both Men and Hobbits, known for the Prancing Pony inn.',                           locations: ['Prancing Pony','Bree-gate'], img: '/Images/middle_earth_rivendell.png' },
  { id: 'rohan',      name: 'Rohan',       region: 'Rohan',     x: 33,  y: 62,  type: 'Region',     races: 'Rohirrim',   govt: 'King of Rohan',age: 'Third Age',      area: '50,000 sq mi',        desc: 'The great horse-lords of the Riddermark. A sweeping plains kingdom famed for its cavalry, the Mearas, and the golden hall of Meduseld at Edoras.',                  locations: ['Edoras','Helm\'s Deep','Meduseld'], img: '/Images/middle_earth_rivendell.png' },
  { id: 'minastirith',name: 'Minas Tirith',region: 'Gondor',    x: 45,  y: 65,  type: 'Stronghold', races: 'Men',        govt: 'Steward/King', age: 'Third Age',      area: 'Seven-tiered city',   desc: 'The seven-tiered citadel of Gondor, carved into the slopes of Mount Mindolluin, the last great fortress of Men against the shadow of Mordor.',                       locations: ['White Tower','Pelennor Fields','Minas Morgul'], img: '/Images/middle_earth_rivendell.png' },
  { id: 'baradudr',   name: 'Barad-dûr',   region: 'Mordor',    x: 63,  y: 57,  type: 'Stronghold', races: 'Orcs, Nazgûl',govt: 'Dark Lord',   age: 'Second Age',     area: 'Black fortress',      desc: 'The Dark Tower, fortress of Sauron, built upon a spur of the Ered Lithui. Its foundations were laid with the power of the One Ring itself.',                        locations: ['Tower of Sauron','Dark Gate'], img: '/Images/middle_earth_rivendell.png' },
  { id: 'mountdoom',  name: 'Mount Doom',  region: 'Mordor',    x: 67,  y: 63,  type: 'Landmark',   races: '—',          govt: '—',            age: 'Before First Age',area: 'Volcanic mountain',   desc: 'The fiery volcano of Orodruin, the Crack of Doom. Here the One Ring was forged in the fires of Sauron\'s will, and here it was ultimately destroyed by Frodo and Gollum.', locations: ['Sammath Naur','Cracks of Doom'], img: '/Images/middle_earth_rivendell.png' },
  { id: 'lothlórien', name: 'Lothlórien',  region: 'Rhovanion', x: 40,  y: 51,  type: 'Stronghold', races: 'Elves',      govt: 'Lady Galadriel',age: 'Second Age',    area: 'Golden wood',         desc: 'The golden wood ruled by Galadriel and Celeborn. Time seems to stand still here; the Elves who dwell within have maintained it since the Elder Days.',               locations: ['Caras Galadhon','Mirror of Galadriel'], img: '/Images/middle_earth_rivendell.png' },
];

// Region labels drawn directly on the map canvas
const REGION_LABELS = [
  { name: 'GREY MOUNTAINS',  sub: '',               x: 51,  y: 11,  size: 10 },
  { name: 'ARNOR',           sub: 'The Northern Realm', x: 30, y: 22, size: 13 },
  { name: 'ERIADOR',         sub: 'The Lonely Land', x: 19, y: 33,  size: 15 },
  { name: 'MIRKWOOD',        sub: 'The Great Forest', x: 55, y: 33, size: 13 },
  { name: 'RHÛN',            sub: 'The East',        x: 78,  y: 30,  size: 13 },
  { name: 'RED MOUNTAINS',   sub: '',               x: 70,  y: 42,  size: 9,  vertical: true },
  { name: 'ROHAN',           sub: 'The Mark',        x: 33,  y: 58,  size: 15 },
  { name: 'GONDOR',          sub: 'The Southern Realm', x: 41, y: 70, size: 15 },
  { name: 'MORDOR',          sub: 'The Land of Shadow', x: 63, y: 60, size: 17 },
  { name: 'BELEGAER',        sub: 'The Great Sea',   x: 5,   y: 55,  size: 11 },
  { name: 'FORLINDOND',      sub: '',               x: 10,  y: 42,  size: 9  },
  { name: 'UMBAR',           sub: '',               x: 27,  y: 81,  size: 9  },
  { name: 'HARADWAITH',      sub: 'The Southlands',  x: 50,  y: 82,  size: 11 },
];

// Small city/place labels always visible on map
const PLACE_LABELS = [
  { name: 'The Shire', x: 17, y: 52 },
  { name: 'Rivendell', x: 31, y: 40 },
  { name: 'Bree',      x: 22, y: 46 },
  { name: 'Minas Tirith', x: 45, y: 65 },
  { name: 'Barad-dûr', x: 63, y: 57 },
  { name: 'Mount Doom',x: 67, y: 63 },
];

function MapTab({ data, accent, rgb }: { data: any; accent: string; rgb: string }) {
  const [selected, setSelected] = useState(MAP_LOCATIONS[0]);
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [view, setView] = useState('Political');
  const [viewOpen, setViewOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>(['Cities','Strongholds','Landmarks','Regions']);
  const [showLocations, setShowLocations] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [isDraggingState, setIsDraggingState] = useState(false);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  const filterDefs = [
    { id: 'Cities',      icon: '●', types: ['City'] },
    { id: 'Strongholds', icon: '◆', types: ['Stronghold'] },
    { id: 'Landmarks',   icon: '⬟', types: ['Landmark'] },
    { id: 'Regions',     icon: '○', types: ['Region'] },
  ];

  const toggleFilter = (f: string) =>
    setActiveFilters(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const visibleLocs = MAP_LOCATIONS.filter(l => {
    const fd = filterDefs.find(f => f.types.includes(l.type));
    return fd ? activeFilters.includes(fd.id) : true;
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    setIsDraggingState(true);
    dragStart.current = { x: e.clientX, y: e.clientY, px: panX, py: panY };
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    setPanX(dragStart.current.px + (e.clientX - dragStart.current.x));
    setPanY(dragStart.current.py + (e.clientY - dragStart.current.y));
  };
  const handleMouseUp = () => { isDragging.current = false; setIsDraggingState(false); };

  const panelLoc = selected;

  return (
    <div className="flex h-full overflow-hidden bg-[#0e0c09]">

      {/* ══ MAP CANVAS ══ */}
      <div
        ref={mapRef}
        className="flex-1 relative overflow-hidden select-none"
        style={{ cursor: isDraggingState ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* ── Base map image ── */}
        <div
          className="absolute inset-0"
          style={{
            transform: `scale(${zoom}) translate(${panX / zoom}px, ${panY / zoom}px)`,
            transformOrigin: 'center center',
            transition: isDraggingState ? 'none' : 'transform 0.25s ease',
          }}
        >
          {/* ═══════════════════════════════════════════════════════════════
               LAYERED SVG TERRAIN — 3D depth illusion via elevation bands
               All coordinates are % of the 1400×900 SVG viewport
          ═══════════════════════════════════════════════════════════════ */}
          <svg
            viewBox="0 0 1400 900"
            preserveAspectRatio="xMidYMid slice"
            className="absolute inset-0 w-full h-full"
            style={{ display: 'block' }}
          >
            <defs>
              {/* ── Lighting / shadow filters ── */}
              <filter id="terrain-shadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="4" dy="8" stdDeviation="6" floodColor="rgba(0,0,0,0.6)" floodOpacity="1"/>
              </filter>
              <filter id="mountain-shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="6" dy="12" stdDeviation="10" floodColor="rgba(0,0,0,0.75)" floodOpacity="1"/>
              </filter>
              <filter id="glow-warm" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="glow-fire" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="14" result="blur"/>
                <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
              </filter>
              <filter id="fog-blur">
                <feGaussianBlur stdDeviation="18"/>
              </filter>
              <filter id="soft-blur">
                <feGaussianBlur stdDeviation="4"/>
              </filter>
              <filter id="emboss">
                <feConvolveMatrix order="3" kernelMatrix="-2 -1 0 -1 1 1 0 1 2"/>
              </filter>

              {/* ── Ocean gradient ── */}
              <radialGradient id="ocean-grad" cx="15%" cy="55%" r="55%">
                <stop offset="0%" stopColor="#1a3a5c"/>
                <stop offset="40%" stopColor="#0d2035"/>
                <stop offset="100%" stopColor="#060f1a"/>
              </radialGradient>

              {/* ── Landmass base gradient (north=cold, south=warm) ── */}
              <linearGradient id="land-base" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"   stopColor="#2a3a2a"/>
                <stop offset="30%"  stopColor="#3d5230"/>
                <stop offset="60%"  stopColor="#4a5e35"/>
                <stop offset="100%" stopColor="#3a4a28"/>
              </linearGradient>

              {/* ── Shire — lush green ── */}
              <radialGradient id="shire-grad" cx="50%" cy="40%" r="60%">
                <stop offset="0%"  stopColor="#4a7a35" stopOpacity="0.9"/>
                <stop offset="70%" stopColor="#3a6228" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#2d4d20" stopOpacity="0"/>
              </radialGradient>

              {/* ── Rohan — amber grasslands ── */}
              <radialGradient id="rohan-grad" cx="50%" cy="50%" r="60%">
                <stop offset="0%"  stopColor="#8a7a35" stopOpacity="0.85"/>
                <stop offset="60%" stopColor="#6a6028" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#4a4a1a" stopOpacity="0"/>
              </radialGradient>

              {/* ── Gondor — grey stone ── */}
              <radialGradient id="gondor-grad" cx="50%" cy="50%" r="60%">
                <stop offset="0%"  stopColor="#5a6a5a" stopOpacity="0.85"/>
                <stop offset="60%" stopColor="#4a5548" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#363d32" stopOpacity="0"/>
              </radialGradient>

              {/* ── Mordor — volcanic black/orange ── */}
              <radialGradient id="mordor-grad" cx="50%" cy="60%" r="65%">
                <stop offset="0%"  stopColor="#1a0a02" stopOpacity="1"/>
                <stop offset="50%" stopColor="#2a1004" stopOpacity="0.92"/>
                <stop offset="100%" stopColor="#1a0a02" stopOpacity="0"/>
              </radialGradient>

              {/* ── Mirkwood — dark forest ── */}
              <radialGradient id="mirkwood-grad" cx="50%" cy="50%" r="60%">
                <stop offset="0%"  stopColor="#1a2a12" stopOpacity="0.95"/>
                <stop offset="70%" stopColor="#253520" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#1a2212" stopOpacity="0"/>
              </radialGradient>

              {/* ── Mountain snow caps ── */}
              <linearGradient id="mountain-snow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#e8e4dc" stopOpacity="0.95"/>
                <stop offset="30%" stopColor="#c4bfb5" stopOpacity="0.85"/>
                <stop offset="70%" stopColor="#8a8070" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#5a5248" stopOpacity="0.2"/>
              </linearGradient>

              {/* ── Mountain rock face ── */}
              <linearGradient id="mountain-rock" x1="0.2" y1="0" x2="1" y2="1">
                <stop offset="0%"  stopColor="#6a6058" stopOpacity="0.9"/>
                <stop offset="40%" stopColor="#4a4440" stopOpacity="0.85"/>
                <stop offset="100%" stopColor="#2a2824" stopOpacity="0.7"/>
              </linearGradient>

              {/* ── Mountain shadow side ── */}
              <linearGradient id="mountain-dark" x1="1" y1="0" x2="0" y2="1">
                <stop offset="0%"  stopColor="#1a1816" stopOpacity="0.9"/>
                <stop offset="100%" stopColor="#0a0806" stopOpacity="0.7"/>
              </linearGradient>

              {/* ── Elevation rim light (NW sun) ── */}
              <linearGradient id="rim-light" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%"  stopColor="#d4b87a" stopOpacity="0.45"/>
                <stop offset="100%" stopColor="#d4b87a" stopOpacity="0"/>
              </linearGradient>

              {/* ── Lava glow ── */}
              <radialGradient id="lava-grad" cx="67%" cy="65%" r="12%">
                <stop offset="0%"  stopColor="#ff6a00" stopOpacity="0.9"/>
                <stop offset="40%" stopColor="#cc3300" stopOpacity="0.6"/>
                <stop offset="100%" stopColor="#440000" stopOpacity="0"/>
              </radialGradient>

              {/* ── Atmospheric fog ── */}
              <radialGradient id="fog-north" cx="50%" cy="0%" r="60%">
                <stop offset="0%"  stopColor="#b4c8d8" stopOpacity="0.55"/>
                <stop offset="100%" stopColor="#b4c8d8" stopOpacity="0"/>
              </radialGradient>
              <radialGradient id="fog-west" cx="0%" cy="55%" r="40%">
                <stop offset="0%"  stopColor="#8090a8" stopOpacity="0.5"/>
                <stop offset="100%" stopColor="#8090a8" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* ════ LAYER 0: Deep ocean ════ */}
            <rect width="1400" height="900" fill="url(#ocean-grad)"/>
            {/* Ocean sheen */}
            <ellipse cx="200" cy="480" rx="320" ry="220" fill="#1e4870" opacity="0.25"/>
            <ellipse cx="100" cy="350" rx="180" ry="140" fill="#2a5580" opacity="0.18"/>

            {/* ════ LAYER 1: Main landmass — base shape ════ */}
            {/* Western landmass (Eriador + Rohan + Gondor) */}
            <path d="
              M 310,40 C 360,30 500,25 580,40 C 650,55 700,70 740,90
              C 800,120 850,140 880,170
              C 920,210 940,240 950,270
              C 960,300 955,330 940,360
              C 920,400 900,420 880,450
              C 860,480 840,510 830,540
              C 820,570 815,600 810,630
              C 805,660 790,690 760,720
              C 730,750 680,770 630,780
              C 580,790 520,785 470,775
              C 420,765 370,745 330,720
              C 290,695 260,660 240,625
              C 220,590 215,555 220,520
              C 225,485 240,455 250,420
              C 260,385 265,350 260,310
              C 255,270 240,235 230,195
              C 220,155 215,115 225,80
              C 235,45 285,50 310,40 Z
            " fill="url(#land-base)" filter="url(#terrain-shadow)"/>

            {/* Eastern landmass (Rhovanion + Mordor) */}
            <path d="
              M 700,80 C 760,70 850,80 920,100
              C 980,120 1040,150 1090,190
              C 1130,220 1150,260 1140,300
              C 1130,340 1100,370 1060,400
              C 1020,430 970,455 940,490
              C 910,525 905,560 910,590
              C 915,620 930,650 920,680
              C 905,720 860,750 810,760
              C 760,770 710,760 680,740
              C 650,720 640,690 645,660
              C 650,630 665,600 670,565
              C 675,530 665,495 650,460
              C 635,425 620,390 630,355
              C 640,320 670,290 680,255
              C 690,220 685,180 690,145
              C 695,110 700,95 700,80 Z
            " fill="url(#land-base)" filter="url(#terrain-shadow)"/>

            {/* ════ LAYER 2: Region color zones ════ */}

            {/* The Shire — vivid green */}
            <ellipse cx="240" cy="480" rx="110" ry="80" fill="url(#shire-grad)" opacity="0.9"/>
            <ellipse cx="220" cy="490" rx="70" ry="55" fill="#5a8840" opacity="0.35"/>
            {/* Shire soft highlight */}
            <ellipse cx="210" cy="465" rx="55" ry="35" fill="#7aaa55" opacity="0.2"/>

            {/* Eriador — muted green-grey */}
            <ellipse cx="310" cy="360" rx="160" ry="120" fill="#3d5530" opacity="0.55"/>

            {/* Rohan — amber grasslands */}
            <ellipse cx="430" cy="570" rx="160" ry="100" fill="url(#rohan-grad)" opacity="0.85"/>
            <ellipse cx="400" cy="560" rx="90" ry="60" fill="#9a8a3a" opacity="0.3"/>

            {/* Gondor — stone grey with green valleys */}
            <ellipse cx="560" cy="640" rx="150" ry="100" fill="url(#gondor-grad)" opacity="0.8"/>
            <ellipse cx="540" cy="650" rx="80" ry="55" fill="#6a7a60" opacity="0.3"/>

            {/* Mordor — dark volcanic */}
            <ellipse cx="820" cy="590" rx="170" ry="120" fill="url(#mordor-grad)" opacity="0.95"/>
            <ellipse cx="840" cy="580" rx="100" ry="75" fill="#1a0800" opacity="0.7"/>

            {/* Mirkwood — dense dark forest */}
            <ellipse cx="720" cy="340" rx="130" ry="160" fill="url(#mirkwood-grad)" opacity="0.85"/>

            {/* Rhovanion — open plains */}
            <ellipse cx="760" cy="430" rx="140" ry="100" fill="#4a5a30" opacity="0.4"/>

            {/* ════ LAYER 3: Terrain elevation — high-altitude rock ════ */}

            {/* Misty Mountains — main spine (vertical NW-SE chain) */}
            {/* Shadow layer first */}
            <path d="
              M 540,160 L 560,120 L 580,155 L 600,110 L 620,150 L 640,115 L 660,155
              L 670,190 L 655,230 L 640,270 L 620,310 L 605,350 L 590,390
              L 575,430 L 565,470 L 555,420 L 545,380 L 535,340 L 525,295
              L 520,250 L 525,205 L 535,175 Z
            " fill="url(#mountain-dark)" opacity="0.85"/>
            {/* Rock face */}
            <path d="
              M 530,160 L 550,115 L 570,150 L 590,105 L 610,145 L 630,110 L 650,148
              L 660,185 L 645,225 L 630,265 L 615,305 L 600,345 L 585,385
              L 575,425 L 565,465 L 548,420 L 538,378 L 528,335 L 518,290
              L 515,245 L 520,200 L 530,160 Z
            " fill="url(#mountain-rock)" filter="url(#mountain-shadow)" opacity="0.9"/>
            {/* Snow caps */}
            <path d="
              M 530,160 L 545,130 L 555,148 L 570,118 L 583,142 L 595,112 L 610,145
              L 628,115 L 645,148 L 655,185 L 640,210 L 620,200 L 600,195
              L 580,192 L 560,188 L 540,192 L 525,200 L 518,190 Z
            " fill="url(#mountain-snow)" opacity="0.95"/>
            {/* Rim light highlight on peaks */}
            <path d="
              M 530,160 L 545,130 L 555,148 L 562,138 L 570,118 L 576,130 L 583,142
              L 590,118 L 598,112 L 605,125 L 610,145 L 620,125 L 628,115 L 637,130 L 645,148
            " fill="none" stroke="#e8e0cc" strokeWidth="2.5" strokeOpacity="0.7" strokeLinecap="round"/>

            {/* White Mountains (Gondor) — east-west chain */}
            <path d="
              M 440,590 L 460,550 L 490,580 L 510,545 L 535,572 L 555,538 L 575,565
              L 595,530 L 615,558 L 625,590 L 610,620 L 585,610 L 560,615
              L 535,612 L 510,618 L 485,615 L 460,622 L 442,610 Z
            " fill="url(#mountain-dark)" opacity="0.8"/>
            <path d="
              M 435,592 L 455,548 L 485,578 L 505,542 L 530,570 L 552,534 L 572,562
              L 593,528 L 613,555 L 623,588 L 608,618 L 583,607 L 558,613
              L 533,610 L 508,616 L 483,613 L 458,620 L 436,608 Z
            " fill="url(#mountain-rock)" filter="url(#mountain-shadow)" opacity="0.88"/>
            <path d="
              M 435,592 L 452,554 L 468,572 L 482,548 L 498,568 L 512,544 L 528,570
              L 545,536 L 558,558 L 570,532 L 582,555 L 594,530 L 607,552 L 615,580
            " fill="none" stroke="#ddd8cc" strokeWidth="2" strokeOpacity="0.65" strokeLinecap="round"/>
            <path d="
              M 435,592 L 452,554 L 462,566 L 475,548 L 488,565 L 498,548
              L 508,568 L 518,544 L 528,570 L 540,540 L 552,560 L 562,534
              L 575,558 L 588,532 L 600,552 L 608,572 L 614,585
            " fill="url(#mountain-snow)" opacity="0.75"/>

            {/* Mountains of Shadow (Mordor west wall) */}
            <path d="
              M 685,440 L 705,400 L 720,435 L 740,395 L 755,430 L 768,400 L 780,438
              L 785,470 L 775,505 L 760,540 L 745,570 L 730,600 L 715,625
              L 700,600 L 695,570 L 700,540 L 695,505 L 685,470 Z
            " fill="url(#mountain-dark)" opacity="0.9"/>
            <path d="
              M 680,445 L 700,402 L 716,436 L 736,398 L 752,432 L 765,402 L 778,440
              L 783,472 L 773,507 L 758,542 L 743,572 L 727,602 L 712,627
              L 697,602 L 692,572 L 697,542 L 692,507 L 680,472 Z
            " fill="url(#mountain-rock)" filter="url(#mountain-shadow)" opacity="0.88"/>
            {/* Dark volcanic tint on Mordor mountains */}
            <path d="
              M 680,445 L 700,402 L 716,436 L 736,398 L 752,432 L 765,402 L 778,440
              L 783,472 L 773,507 L 758,542 L 743,572 L 727,602 L 712,627
              L 697,602 L 692,572 L 697,542 L 692,507 L 680,472 Z
            " fill="#3a1500" opacity="0.45"/>

            {/* Grey Mountains (far north) */}
            <path d="
              M 560,55 L 590,25 L 615,55 L 640,20 L 668,52 L 695,22 L 720,55
              L 740,28 L 760,58 L 770,80 L 750,100 L 720,90 L 695,95
              L 668,90 L 640,92 L 612,88 L 588,95 L 562,90 L 545,80 Z
            " fill="url(#mountain-dark)" opacity="0.8"/>
            <path d="
              M 555,58 L 585,28 L 610,58 L 635,22 L 663,55 L 690,24 L 717,57
              L 737,30 L 757,60 L 767,82 L 747,100 L 718,92 L 692,97
              L 665,92 L 637,94 L 610,90 L 586,97 L 560,92 L 544,82 Z
            " fill="url(#mountain-rock)" filter="url(#mountain-shadow)" opacity="0.85"/>
            <path d="
              M 555,58 L 578,30 L 595,50 L 612,24 L 628,48 L 645,22 L 663,55
              L 680,26 L 698,54 L 715,28 L 733,56 L 748,34 L 760,58 L 766,78
            " fill="none" stroke="#e0dcd4" strokeWidth="2" strokeOpacity="0.7" strokeLinecap="round"/>
            <path d="
              M 555,58 L 575,32 L 588,50 L 600,28 L 615,52 L 628,24 L 642,52 L 655,26
              L 670,52 L 683,28 L 698,55 L 712,30 L 727,55 L 740,32 L 752,58 L 762,76
            " fill="url(#mountain-snow)" opacity="0.8"/>

            {/* Red Mountains (far east) */}
            <path d="
              M 1050,200 L 1075,165 L 1095,200 L 1115,168 L 1132,205
              L 1140,235 L 1128,270 L 1110,300 L 1090,330 L 1068,300
              L 1052,265 L 1045,232 Z
            " fill="url(#mountain-dark)" opacity="0.78"/>
            <path d="
              M 1045,205 L 1070,168 L 1090,204 L 1110,170 L 1128,208
              L 1136,238 L 1124,272 L 1106,303 L 1085,332 L 1063,303
              L 1047,268 L 1040,235 Z
            " fill="#5a3020" filter="url(#mountain-shadow)" opacity="0.82"/>

            {/* ════ LAYER 4: Forests as density clusters ════ */}

            {/* Mirkwood — dense dark canopy clusters */}
            {[
              [705,255],[730,270],[720,290],[745,285],[710,310],[740,310],[760,295],[750,325],
              [715,335],[740,345],[760,340],[775,320],[770,355],[745,370],[720,360],
              [695,345],[690,320],[698,295],[725,380],[750,390],[768,375],
            ].map(([cx,cy],i) => (
              <ellipse key={`mw${i}`} cx={cx} cy={cy} rx={18+i%3*4} ry={14+i%2*3}
                fill={i%3===0?"#1a2e14":i%3===1?"#243818":"#1e3010"} opacity={0.82+i%3*0.04}/>
            ))}
            {/* Mirkwood canopy highlights */}
            {[[710,258],[735,272],[725,292],[758,298],[718,312],[748,313]].map(([cx,cy],i) => (
              <ellipse key={`mwh${i}`} cx={cx-3} cy={cy-3} rx={7} ry={5} fill="#3a5228" opacity={0.4}/>
            ))}

            {/* Old Forest / Shire forests */}
            {[
              [190,450],[210,460],[200,475],[225,455],[215,478],[235,468],
              [250,460],[240,475],[260,470],
            ].map(([cx,cy],i) => (
              <ellipse key={`sf${i}`} cx={cx} cy={cy} rx={16+i%2*4} ry={12+i%3*3}
                fill={i%2===0?"#3a6228":"#4a7535"} opacity={0.75}/>
            ))}

            {/* Fangorn forest */}
            {[[448,510],[465,520],[458,535],[478,515],[472,532],[490,520]].map(([cx,cy],i) => (
              <ellipse key={`fg${i}`} cx={cx} cy={cy} rx={15+i%2*3} ry={12} fill="#2a4018" opacity={0.8}/>
            ))}

            {/* ════ LAYER 5: Rivers ════ */}

            {/* Anduin — great river flowing south */}
            <path d="M 580,180 C 570,220 562,260 558,300 C 554,340 556,380 560,420
                     C 564,460 570,500 565,540 C 560,580 548,610 530,640
                     C 512,670 488,695 465,710"
              fill="none" stroke="#3a6a8a" strokeWidth="3.5" strokeOpacity="0.75" strokeLinecap="round"/>
            {/* Anduin highlight */}
            <path d="M 580,180 C 570,220 562,260 558,300 C 554,340 556,380 560,420
                     C 564,460 570,500 565,540 C 560,580 548,610 530,640"
              fill="none" stroke="#6aaccc" strokeWidth="1.2" strokeOpacity="0.45" strokeLinecap="round"/>

            {/* Baranduin (Brandywine) */}
            <path d="M 290,320 C 280,355 268,390 255,420 C 242,450 228,475 215,500
                     C 202,525 190,548 178,560"
              fill="none" stroke="#3a6a8a" strokeWidth="2.5" strokeOpacity="0.65" strokeLinecap="round"/>

            {/* Isen river */}
            <path d="M 470,510 C 465,535 455,560 442,578 C 430,596 415,610 398,620"
              fill="none" stroke="#3a6a8a" strokeWidth="2" strokeOpacity="0.6" strokeLinecap="round"/>

            {/* Bruinen (Rivendell river) */}
            <path d="M 415,350 C 400,360 385,368 370,372 C 355,376 340,375 325,372"
              fill="none" stroke="#4a7a9a" strokeWidth="1.8" strokeOpacity="0.6" strokeLinecap="round"/>

            {/* ════ LAYER 6: Mordor volcanic details ════ */}

            {/* Mordor black rock floor */}
            <ellipse cx="820" cy="595" rx="165" ry="118" fill="#100500" opacity="0.88"/>

            {/* Ashen plains texture */}
            {[[780,570],[820,555],[860,575],[800,600],[840,590],[870,608],[790,618],[830,622]].map(([cx,cy],i) => (
              <ellipse key={`ash${i}`} cx={cx} cy={cy} rx={22+i%3*6} ry={10+i%2*4}
                fill="#1e0c04" opacity={0.55}/>
            ))}

            {/* Lava cracks */}
            <path d="M 840,555 C 845,565 843,575 848,582 C 853,589 858,592 855,600"
              fill="none" stroke="#cc4400" strokeWidth="2" strokeOpacity="0.7"/>
            <path d="M 810,575 C 818,580 822,590 820,600 C 818,610 812,615 815,622"
              fill="none" stroke="#cc3300" strokeWidth="1.5" strokeOpacity="0.6"/>
            <path d="M 860,590 C 855,598 856,608 862,612 C 868,616 875,614 878,622"
              fill="none" stroke="#bb4400" strokeWidth="1.5" strokeOpacity="0.55"/>

            {/* Mount Doom — volcanic cone */}
            {/* Base shadow */}
            <ellipse cx="938" cy="612" rx="62" ry="28" fill="#000000" opacity="0.7"/>
            {/* Cone body */}
            <path d="M 878,610 L 938,510 L 998,610 Z" fill="#2a1005" filter="url(#mountain-shadow)"/>
            {/* Lit face */}
            <path d="M 878,610 L 938,510 L 958,610 Z" fill="#3d1a08" opacity="0.9"/>
            {/* Dark shadow face */}
            <path d="M 938,510 L 998,610 L 960,610 Z" fill="#150800" opacity="0.95"/>
            {/* Lava glow at crater */}
            <ellipse cx="938" cy="515" rx="18" ry="12" fill="#ff6a00" filter="url(#glow-fire)" opacity="0.8"/>
            <ellipse cx="938" cy="518" rx="10" ry="7" fill="#ffaa00" opacity="0.9"/>
            {/* Lava flow trails */}
            <path d="M 938,515 C 930,535 922,558 915,580 C 908,600 902,610 895,618"
              fill="none" stroke="#cc4400" strokeWidth="3" strokeOpacity="0.6"/>
            <path d="M 938,515 C 945,538 950,562 956,582 C 962,602 965,612 968,620"
              fill="none" stroke="#cc3300" strokeWidth="2.5" strokeOpacity="0.5"/>
            {/* Smoke plume */}
            <ellipse cx="938" cy="488" rx="22" ry="15" fill="#3a2a1a" opacity="0.6" filter="url(#soft-blur)"/>
            <ellipse cx="932" cy="462" rx="18" ry="12" fill="#2a1e10" opacity="0.45" filter="url(#soft-blur)"/>
            <ellipse cx="940" cy="440" rx="14" ry="10" fill="#1e1410" opacity="0.35" filter="url(#soft-blur)"/>

            {/* Mordor lava glow light-bleed */}
            <ellipse cx="920" cy="590" rx="110" ry="80" fill="url(#lava-grad)" opacity="0.4"
              style={{ mixBlendMode: 'screen' } as React.CSSProperties}/>

            {/* ════ LAYER 7: Coastal elevation cliffs ════ */}

            {/* Western coast cliff shadow */}
            <path d="
              M 175,310 C 170,350 162,390 158,430 C 154,470 155,510 158,550
              C 161,590 168,620 165,650 C 162,680 155,700 152,720
            " fill="none" stroke="#1a1208" strokeWidth="14" strokeOpacity="0.55"
              strokeLinecap="round" filter="url(#soft-blur)"/>
            {/* Coast line */}
            <path d="
              M 182,308 C 177,348 169,388 165,428 C 161,468 162,508 165,548
              C 168,588 175,618 172,648 C 169,678 162,698 159,718
            " fill="none" stroke="#2a3a5a" strokeWidth="2.5" strokeOpacity="0.6" strokeLinecap="round"/>

            {/* ════ LAYER 8: Global lighting — NW sun angle ════ */}
            <rect width="1400" height="900" fill="url(#rim-light)" opacity="0.7"
              style={{ mixBlendMode: 'overlay' } as React.CSSProperties}/>

            {/* Warm sun catch on central highland */}
            <ellipse cx="420" cy="380" rx="280" ry="180" fill="#c8a060" opacity="0.12"
              style={{ mixBlendMode: 'overlay' } as React.CSSProperties}/>

            {/* ════ LAYER 9: Atmospheric fog / depth haze ════ */}

            {/* Northern horizon fog */}
            <rect x="0" y="0" width="1400" height="130" fill="url(#fog-north)"
              filter="url(#fog-blur)" opacity="0.7"/>

            {/* Western sea haze */}
            <rect x="0" y="200" width="200" height="500" fill="url(#fog-west)"
              filter="url(#fog-blur)" opacity="0.65"/>

            {/* Mid-distance blue haze (depth) */}
            <rect x="0" y="0" width="1400" height="900" fill="#1a2a3a" opacity="0.12"/>

            {/* ════ LAYER 10: Edge vignette + border ════ */}
            <radialGradient id="vignette" cx="45%" cy="52%" r="65%">
              <stop offset="45%" stopColor="transparent"/>
              <stop offset="80%" stopColor="rgba(5,3,1,0.65)"/>
              <stop offset="100%" stopColor="rgba(2,1,0,0.95)"/>
            </radialGradient>
            <rect width="1400" height="900" fill="url(#vignette)"/>

            {/* Top/bottom cloud bleeds */}
            <linearGradient id="top-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#080604" stopOpacity="0.75"/>
              <stop offset="100%" stopColor="#080604" stopOpacity="0"/>
            </linearGradient>
            <rect width="1400" height="160" fill="url(#top-fade)"/>
            <linearGradient id="bot-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"  stopColor="#080604" stopOpacity="0"/>
              <stop offset="100%" stopColor="#080604" stopOpacity="0.8"/>
            </linearGradient>
            <rect y="740" width="1400" height="160" fill="url(#bot-fade)"/>
          </svg>
          {/* ─── end SVG terrain ─── */}

          {/* ── Region labels ── */}
          {REGION_LABELS.map(r => (
            <div
              key={r.name}
              className="absolute pointer-events-none select-none"
              style={{ left: `${r.x}%`, top: `${r.y}%`, transform: 'translate(-50%,-50%)', textAlign: 'center' }}
            >
              <p
                className="uppercase tracking-[0.22em] leading-none text-white/80 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]"
                style={{
                  fontFamily: "'Cinzel', Georgia, serif",
                  fontSize: r.size,
                  fontWeight: 600,
                  textShadow: '0 0 20px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)',
                }}
              >
                {r.name}
              </p>
              {r.sub && (
                <p className="text-white/45 tracking-[0.12em] mt-0.5"
                  style={{ fontFamily: 'Georgia, serif', fontSize: r.size * 0.62, fontStyle: 'italic', textShadow: '0 1px 4px rgba(0,0,0,0.9)' }}>
                  {r.sub}
                </p>
              )}
            </div>
          ))}

          {/* ── Location markers + always-visible labels ── */}
          {showLocations && visibleLocs.map(loc => {
            const isActive = selected.id === loc.id;
            return (
              <button
                key={loc.id}
                onClick={e => { e.stopPropagation(); setSelected(loc); setPanelOpen(true); }}
                className="absolute group"
                style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%,-50%)', zIndex: 20 }}
              >
                {/* Outer glow pulse on active */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full animate-ping"
                    style={{ width: 28, height: 28, margin: -8, background: `${accent}30` }} />
                )}
                {/* Marker dot */}
                <div
                  className="relative z-10 transition-transform duration-150 group-hover:scale-125"
                  style={{
                    width: isActive ? 12 : 9,
                    height: isActive ? 12 : 9,
                    borderRadius: '50%',
                    background: isActive ? accent : `rgba(${rgb},0.9)`,
                    border: `2px solid ${accent}`,
                    boxShadow: isActive
                      ? `0 0 0 3px ${accent}55, 0 0 18px ${accent}bb`
                      : `0 0 8px ${accent}88`,
                  }}
                />
                {/* Always-visible label below marker */}
                <div
                  className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none z-20"
                  style={{ opacity: isActive ? 1 : 0.82 }}
                >
                  <p
                    className="font-mono text-[9px] tracking-[0.1em] leading-none"
                    style={{
                      color: isActive ? accent : 'rgba(255,255,255,0.85)',
                      textShadow: '0 0 8px rgba(0,0,0,1), 0 1px 3px rgba(0,0,0,1)',
                      fontWeight: isActive ? 700 : 400,
                    }}
                  >
                    {loc.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>{/* end transform wrapper */}

        {/* ══ TOP-LEFT: VIEW dropdown ══ */}
        <div className="absolute top-3 left-3 z-30">
          <div className="relative">
            <button
              onClick={() => setViewOpen(v => !v)}
              className="flex items-center gap-2 px-3 py-2 rounded-sm font-mono text-[8px] tracking-[0.2em] uppercase transition-colors"
              style={{ background: 'rgba(10,8,5,0.88)', border: `1px solid rgba(${rgb},0.28)`, color: accent }}
            >
              <span className="text-[7px] text-white/40 tracking-[0.35em]">VIEW</span>
              <span className="text-white/80">{view}</span>
              <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><path d="M1 2.5L4 5.5L7 2.5" stroke="currentColor" strokeWidth="1.2"/></svg>
            </button>
            {viewOpen && (
              <div className="absolute top-full mt-1 left-0 rounded-sm overflow-hidden z-50"
                style={{ background: 'rgba(10,8,5,0.96)', border: `1px solid rgba(${rgb},0.25)`, minWidth: 110 }}>
                {['Political','Terrain','Historical','Military'].map(v => (
                  <button key={v} onClick={() => { setView(v); setViewOpen(false); }}
                    className="w-full text-left px-3 py-2 font-mono text-[8px] tracking-[0.15em] transition-colors hover:bg-white/5"
                    style={{ color: view === v ? accent : 'rgba(255,255,255,0.55)' }}>
                    {view === v && <span className="mr-1.5">✓</span>}{v}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ══ LEFT CONTROLS: Compass + Zoom + Center ══ */}
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-1.5">
          {/* Compass rose */}
          <div className="w-9 h-9 flex items-center justify-center rounded-full mb-1"
            style={{ background: 'rgba(10,8,5,0.88)', border: `1px solid rgba(${rgb},0.3)` }}>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="10" stroke={accent} strokeOpacity="0.35" strokeWidth="0.8"/>
              <polygon points="11,1 12.5,10 11,9 9.5,10" fill={accent} opacity="0.9"/>
              <polygon points="11,21 12.5,12 11,13 9.5,12" fill="white" opacity="0.3"/>
              <polygon points="1,11 10,12.5 9,11 10,9.5" fill="white" opacity="0.3"/>
              <polygon points="21,11 12,12.5 13,11 12,9.5" fill="white" opacity="0.3"/>
              <circle cx="11" cy="11" r="1.5" fill={accent} opacity="0.8"/>
              <text x="11" y="5.5" textAnchor="middle" fill={accent} fontSize="3" fontFamily="monospace" opacity="0.9">N</text>
            </svg>
          </div>
          {/* Zoom in */}
          {[
            { lbl: '+', fn: () => setZoom(z => Math.min(z + 0.2, 3)) },
            { lbl: '−', fn: () => setZoom(z => Math.max(z - 0.2, 0.6)) },
            { lbl: '⊙', fn: () => { setZoom(1); setPanX(0); setPanY(0); } },
          ].map(b => (
            <button key={b.lbl} onClick={b.fn}
              className="w-8 h-8 flex items-center justify-center font-mono text-sm rounded-sm transition-all hover:scale-110"
              style={{ background: 'rgba(10,8,5,0.88)', border: `1px solid rgba(${rgb},0.28)`, color: accent }}>
              {b.lbl}
            </button>
          ))}
        </div>

        {/* ══ BOTTOM-LEFT: Scale bar ══ */}
        <div className="absolute bottom-14 left-4 z-30 flex items-end gap-0 pointer-events-none">
          <div className="flex flex-col items-start gap-0.5">
            <div className="flex">
              <div className="w-14 h-1.5 border-l border-t border-b" style={{ borderColor: `${accent}cc` }} />
              <div className="w-14 h-1.5 border" style={{ borderColor: `${accent}cc`, background: `${accent}33` }} />
            </div>
            <p className="font-mono text-[7px] tracking-[0.15em]" style={{ color: `${accent}99` }}>200 km</p>
          </div>
        </div>

        {/* ══ BOTTOM-CENTER: Show Locations button ══ */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => setShowLocations(s => !s)}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-sm font-mono text-[9px] tracking-[0.22em] uppercase transition-all duration-200"
            style={{
              background: showLocations ? `rgba(${rgb},0.18)` : 'rgba(10,8,5,0.88)',
              border: `1px solid ${showLocations ? accent + '88' : `rgba(${rgb},0.3)`}`,
              color: showLocations ? accent : 'rgba(255,255,255,0.5)',
              boxShadow: showLocations ? `0 0 14px ${accent}33` : 'none',
            }}
          >
            SHOW LOCATIONS
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d={showLocations ? 'M2 6.5L5 3.5L8 6.5' : 'M2 3.5L5 6.5L8 3.5'} stroke="currentColor" strokeWidth="1.4"/>
            </svg>
          </button>
        </div>

        {/* ══ BOTTOM-RIGHT: Filter legend ══ */}
        <div className="absolute bottom-3 right-3 z-30 flex items-center gap-1.5"
          style={{ right: panelOpen ? 'calc(var(--panel-w, 19rem) + 12px)' : 12 }}>
          <div className="flex items-center gap-1 px-3 py-2 rounded-sm"
            style={{ background: 'rgba(10,8,5,0.88)', border: `1px solid rgba(${rgb},0.22)` }}>
            {filterDefs.map(f => (
              <button key={f.id} onClick={() => toggleFilter(f.id)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm font-mono text-[8px] tracking-[0.15em] transition-all duration-150"
                style={{
                  background: activeFilters.includes(f.id) ? `rgba(${rgb},0.15)` : 'transparent',
                  color: activeFilters.includes(f.id) ? accent : 'rgba(255,255,255,0.35)',
                }}>
                <span style={{ color: activeFilters.includes(f.id) ? accent : 'rgba(255,255,255,0.25)', fontSize: 9 }}>{f.icon}</span>
                {f.id}
              </button>
            ))}
            <div className="w-px h-4 mx-1 bg-white/10" />
            <button className="flex items-center gap-1 px-1 text-white/25 hover:text-white/50 transition-colors">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 7.5L5 4.5L8 7.5" stroke="currentColor" strokeWidth="1.3"/></svg>
            </button>
          </div>
        </div>
      </div>{/* end map canvas */}

      {/* ══ RIGHT PANEL ══ */}
      {panelOpen && (
        <div className="w-72 shrink-0 flex flex-col border-l"
          style={{ background: 'rgba(8,6,4,0.97)', borderColor: `rgba(${rgb},0.18)` }}>

          {/* Panel header with close button */}
          <div className="flex items-start justify-between p-4 pb-0">
            <div className="flex-1 min-w-0 pr-2">
              <p className="font-mono text-[7px] tracking-[0.35em] uppercase mb-1" style={{ color: `${accent}99` }}>
                {panelLoc.region}
              </p>
              <h3 className="text-[17px] font-semibold leading-tight text-white uppercase tracking-[0.08em]"
                style={{ fontFamily: "'Cinzel', serif" }}>
                {panelLoc.name}
              </h3>
              <p className="font-mono text-[7.5px] tracking-[0.2em] mt-0.5" style={{ color: `${accent}77` }}>
                {PLACE_LABELS.find(p => p.name === panelLoc.name) ? panelLoc.region + ', ' : ''}{panelLoc.region}
              </p>
            </div>
            <button onClick={() => setPanelOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded-sm text-white/30 hover:text-white/70 font-mono text-xs transition-colors shrink-0 mt-0.5"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>✕</button>
          </div>

          {/* Location image */}
          <div className="relative mx-3 mt-3 rounded-sm overflow-hidden" style={{ height: 130 }}>
            <img
              src={panelLoc.img || data.backdrop}
              alt={panelLoc.name}
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.72) saturate(1.1)' }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.55) 0%, transparent 60%)' }} />
            <div className="absolute inset-0 rounded-sm" style={{ border: `1px solid rgba(${rgb},0.25)` }} />
          </div>

          {/* Description + details */}
          <div className="flex flex-col gap-3.5 p-4 overflow-y-auto flex-1" style={{ scrollbarWidth: 'none' }}>
            <p className="text-[11px] leading-relaxed text-white/55" style={{ fontFamily: 'Georgia, serif' }}>
              {panelLoc.desc}
            </p>

            <GoldLine accent={accent} />

            {/* Details grid */}
            <div>
              <SLabel accent={accent}>DETAILS</SLabel>
              <div className="flex flex-col gap-2">
                {[
                  { icon: '○', label: 'Type',       val: panelLoc.type },
                  { icon: '◈', label: 'Races',      val: panelLoc.races },
                  { icon: '✦', label: 'Government', val: panelLoc.govt },
                  { icon: '⊕', label: 'First Age',  val: panelLoc.age },
                  { icon: '⬡', label: 'Area',       val: panelLoc.area },
                ].map(d => (
                  <div key={d.label} className="flex items-baseline gap-2">
                    <span className="text-[8px] w-3 shrink-0" style={{ color: `${accent}66` }}>{d.icon}</span>
                    <p className="font-mono text-[7.5px] text-white/30 tracking-wider uppercase w-20 shrink-0">{d.label}</p>
                    <p className="font-mono text-[8px] text-white/65 truncate">{d.val}</p>
                  </div>
                ))}
              </div>
            </div>

            <GoldLine accent={accent} />

            {/* Important locations */}
            <div>
              <SLabel accent={accent}>IMPORTANT LOCATIONS</SLabel>
              <div className="flex flex-col gap-1.5">
                {panelLoc.locations.map((loc, i) => (
                  <div key={loc} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full border shrink-0"
                      style={{ borderColor: i === 0 ? accent : `${accent}44`, background: i === 0 ? accent : 'transparent' }} />
                    <p className="font-mono text-[8.5px] text-white/55">{loc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* View full entry button */}
            <button className="w-full flex items-center justify-between px-4 py-2.5 rounded-sm font-mono text-[8px] tracking-[0.22em] uppercase transition-all duration-200 hover:bg-white/5 mt-auto"
              style={{ border: `1px solid rgba(${rgb},0.25)`, color: accent }}>
              VIEW FULL ENTRY
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.4"/></svg>
            </button>
          </div>

          {/* Divider + location list */}
          <div className="border-t px-3 pt-3 pb-2 shrink-0" style={{ borderColor: `rgba(${rgb},0.15)` }}>
            <div className="flex flex-col gap-0.5 max-h-36 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
              {MAP_LOCATIONS.map(loc => (
                <button key={loc.id} onClick={() => setSelected(loc)}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-sm text-left transition-all group"
                  style={{ background: selected.id === loc.id ? `rgba(${rgb},0.14)` : 'transparent' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors"
                    style={{ background: selected.id === loc.id ? accent : `${accent}44` }} />
                  <span className="font-mono text-[8px] tracking-wider text-white/55 group-hover:text-white/80 transition-colors flex-1 truncate">{loc.name}</span>
                  <span className="font-mono text-[7px] text-white/20 shrink-0">{loc.type}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Re-open panel button when closed */}
      {!panelOpen && (
        <button onClick={() => setPanelOpen(true)}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-6 h-16 flex items-center justify-center rounded-sm transition-colors hover:bg-white/5"
          style={{ background: 'rgba(10,8,5,0.88)', border: `1px solid rgba(${rgb},0.25)`, color: accent }}>
          ‹
        </button>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
//  CHARACTERS TAB  — Interactive Character Archive
// ══════════════════════════════════════════════════════════════════════════════

// Extended LOTR roster — supplements whatever is in data.characters
const LOTR_EXTRA_CHARS = [
  { id:'aragorn',  name:'Aragorn',   race:'Man',    faction:'Fellowship', role:'Ranger / King of Gondor', status:'Alive', actor:'Viggo Mortensen',  appearance:'The Fellowship of the Ring', filter:'Men',      img:'/Images/gandalf_portrait.png', desc:'Heir of Isildur and rightful King of Gondor, raised in secret as Strider. A Ranger of the North, he led the Fellowship and claimed the throne after the War of the Ring.' },
  { id:'gandalf',  name:'Gandalf',   race:'Maia',   faction:'Fellowship', role:'Wizard / Istari',         status:'Alive', actor:'Ian McKellen',      appearance:'The Fellowship of the Ring', filter:'Men',      img:'/Images/gandalf_portrait.png', desc:'One of the five Istari, Gandalf the Grey became Gandalf the White after his death and resurrection. Instrumental in guiding the Fellowship and igniting the fires of resistance.' },
  { id:'frodo',    name:'Frodo',     race:'Hobbit', faction:'Fellowship', role:'Ring-bearer',              status:'Alive', actor:'Elijah Wood',       appearance:'The Fellowship of the Ring', filter:'Hobbits',  img:'/Images/gandalf_portrait.png', desc:'Frodo Baggins of the Shire bore the One Ring from Bag End to the fires of Mount Doom. His courage, tested beyond all measure, ultimately saved Middle-earth.' },
  { id:'sam',      name:'Samwise',   race:'Hobbit', faction:'Fellowship', role:'Gardener / Ring-bearer',   status:'Alive', actor:'Sean Astin',        appearance:'The Fellowship of the Ring', filter:'Hobbits',  img:'/Images/gandalf_portrait.png', desc:'Samwise Gamgee, loyal companion to Frodo, carried both the Ring-bearer and his hope when strength failed. His love of the Shire sustained him through Mordor itself.' },
  { id:'legolas',  name:'Legolas',   race:'Elf',    faction:'Fellowship', role:'Prince of Mirkwood',       status:'Alive', actor:'Orlando Bloom',     appearance:'The Fellowship of the Ring', filter:'Elves',    img:'/Images/gandalf_portrait.png', desc:'Prince of the Woodland Realm, Legolas joined the Fellowship as its Elven representative. His elven sight, archery, and bond with Gimli became legendary across Middle-earth.' },
  { id:'gimli',    name:'Gimli',     race:'Dwarf',  faction:'Fellowship', role:'Son of Glóin',             status:'Alive', actor:'John Rhys-Davies',  appearance:'The Fellowship of the Ring', filter:'Dwarves',  img:'/Images/gandalf_portrait.png', desc:'Gimli son of Glóin represented the Dwarves of Erebor in the Fellowship. Fierce in battle, his unlikely friendship with Legolas bridged the ancient rift between Elves and Dwarves.' },
  { id:'boromir',  name:'Boromir',   race:'Man',    faction:'Fellowship', role:'Captain of Gondor',        status:'Fallen',actor:'Sean Bean',          appearance:'The Fellowship of the Ring', filter:'Men',      img:'/Images/gandalf_portrait.png', desc:'Eldest son of Denethor and Captain of Gondor\'s forces, Boromir fell under the Ring\'s influence but redeemed himself defending Merry and Pippin at Amon Hen.' },
  { id:'galadriel',name:'Galadriel', race:'Elf',    faction:'Lothlórien', role:'Lady of the Golden Wood',  status:'Sailed',actor:'Cate Blanchett',     appearance:'The Fellowship of the Ring', filter:'Elves',    img:'/Images/gandalf_portrait.png', desc:'The mightiest of the remaining Elves in Middle-earth, Galadriel was keeper of Nenya, the Ring of Water. She tested each member of the Fellowship and provided crucial gifts for their quest.' },
  { id:'elrond',   name:'Elrond',    race:'Half-elf',faction:'Rivendell', role:'Lord of Rivendell',        status:'Sailed',actor:'Hugo Weaving',       appearance:'The Fellowship of the Ring', filter:'Elves',    img:'/Images/gandalf_portrait.png', desc:'Elrond Half-elven, Lord of Rivendell, held the Ring of Air, Vilya. He hosted the Council where the fate of the Ring was decided, and forged Andúril for Aragorn.' },
  { id:'sauron',   name:'Sauron',    race:'Maia',   faction:'Mordor',     role:'Dark Lord',                status:'Destroyed',actor:'Sala Baker',      appearance:'The Fellowship of the Ring', filter:'Villains', img:'/Images/gandalf_portrait.png', desc:'The Dark Lord Sauron forged the One Ring in the fires of Mount Doom to dominate all of Middle-earth. Though defeated by the Last Alliance, he rebuilt his power over millennia.' },
  { id:'saruman',  name:'Saruman',   race:'Maia',   faction:'Isengard',   role:'Wizard / Traitor',         status:'Destroyed',actor:'Christopher Lee', appearance:'The Fellowship of the Ring', filter:'Villains', img:'/Images/gandalf_portrait.png', desc:'Saruman the White, head of the Istari order, was corrupted by his study of Sauron\'s arts. He betrayed the Council of the Wise and built an army at Isengard before his downfall at Orthanc.' },
  { id:'gollum',   name:'Gollum',    race:'Hobbit', faction:'None',       role:'Former Ring-bearer',       status:'Destroyed',actor:'Andy Serkis',     appearance:'The Fellowship of the Ring', filter:'Villains', img:'/Images/gandalf_portrait.png', desc:'Sméagol, once a Stoor Hobbit, was consumed by the One Ring over five centuries. As Gollum he guided Frodo and Sam through Emyn Muil into Mordor, and ultimately fulfilled the Ring\'s destruction.' },
  { id:'arwen',    name:'Arwen',     race:'Elf',    faction:'Rivendell',  role:'Evenstar of her people',   status:'Alive', actor:'Liv Tyler',         appearance:'The Fellowship of the Ring', filter:'Elves',    img:'/Images/gandalf_portrait.png', desc:'Arwen Undómiel, daughter of Elrond, chose a mortal life to be with Aragorn. Known as the Evenstar, she forged the standard of the King and surrendered her immortality for love.' },
  { id:'faramir',  name:'Faramir',   race:'Man',    faction:'Gondor',     role:'Captain of Ithilien',      status:'Alive', actor:'David Wenham',      appearance:'The Two Towers',             filter:'Men',      img:'/Images/gandalf_portrait.png', desc:'Faramir, younger son of Denethor, was the just and wise captain of Gondor\'s rangers in Ithilien. Unlike his brother, he resisted the Ring\'s temptation and aided Frodo\'s quest.' },
  { id:'eowyn',    name:'Éowyn',     race:'Man',    faction:'Rohan',      role:'Shieldmaiden of Rohan',    status:'Alive', actor:'Miranda Otto',      appearance:'The Two Towers',             filter:'Men',      img:'/Images/gandalf_portrait.png', desc:'Éowyn, niece of King Théoden, disguised herself as a Rider of Rohan to fight at Pelennor Fields. She slew the Witch-king of Angmar, fulfilling the prophecy that "no man" could kill him.' },
  { id:'theoden',  name:'Théoden',   race:'Man',    faction:'Rohan',      role:'King of Rohan',            status:'Fallen',actor:'Bernard Hill',      appearance:'The Two Towers',             filter:'Men',      img:'/Images/gandalf_portrait.png', desc:'Théoden King of Rohan was enslaved by Saruman through Gríma Wormtongue before being freed by Gandalf. He rode to Gondor\'s aid and fell heroically at the Battle of Pelennor Fields.' },
];

const CHAR_FILTERS = ['All','Fellowship','Elves','Men','Hobbits','Dwarves','Villains'];
const CHAR_SORTS   = ['Name','Race','Faction','Status'];

function CharactersTab({ data, accent, rgb }: { data: any; accent: string; rgb: string }) {
  // Merge registry chars with extended LOTR roster, deduplicate by id
  const registryChars = (data.characters || []) as any[];
  const merged = [...LOTR_EXTRA_CHARS.map(e => {
    const reg = registryChars.find((r: any) => r.id === e.id || r.name.toLowerCase() === e.name.toLowerCase());
    return reg ? { ...e, ...reg, filter: e.filter, actor: e.actor, appearance: e.appearance, filter2: e.filter } : e;
  })];

  const [search, setSearch] = useState('');
  const [filterGroup, setFilterGroup] = useState('All');
  const [sortBy, setSortBy] = useState('Name');
  const [active, setActive] = useState<any>(merged[0]);
  const [subTab, setSubTab] = useState<'about'|'abilities'|'quotes'|'relationships'>('about');

  const displayed = merged
    .filter(c => filterGroup === 'All' || c.filter === filterGroup)
    .filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.race?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'Name')    return a.name.localeCompare(b.name);
      if (sortBy === 'Race')    return (a.race||'').localeCompare(b.race||'');
      if (sortBy === 'Faction') return (a.faction||'').localeCompare(b.faction||'');
      if (sortBy === 'Status')  return (a.status||'').localeCompare(b.status||'');
      return 0;
    });

  const statusColor = (s: string) => {
    if (!s) return 'rgba(255,255,255,0.3)';
    if (s === 'Alive')    return '#4ade80';
    if (s === 'Fallen')   return '#f87171';
    if (s === 'Sailed')   return '#93c5fd';
    return '#fbbf24';
  };

  return (
    <div className="flex h-full overflow-hidden" style={{ background: '#0a0806' }}>

      {/* ══ LEFT: Filter + Character Grid ══ */}
      <div className="flex flex-col border-r" style={{ width: 320, borderColor: `rgba(${rgb},0.15)` }}>

        {/* Search + sort bar */}
        <div className="p-3 border-b flex flex-col gap-2" style={{ borderColor: `rgba(${rgb},0.12)` }}>
          <div className="relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search characters…"
              className="w-full rounded-sm px-3 py-2 font-mono text-[9px] text-white/65 placeholder-white/20 outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(${rgb},0.2)` }}
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/20 text-[11px]">⌕</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[6.5px] tracking-[0.3em] uppercase text-white/20 shrink-0">SORT</span>
            <div className="flex gap-1 flex-1">
              {CHAR_SORTS.map(s => (
                <button key={s} onClick={() => setSortBy(s)}
                  className="flex-1 py-1 rounded-sm font-mono text-[7px] tracking-[0.1em] transition-all"
                  style={{
                    background: sortBy === s ? `rgba(${rgb},0.2)` : 'transparent',
                    border: `1px solid ${sortBy === s ? accent + '66' : 'rgba(255,255,255,0.06)'}`,
                    color: sortBy === s ? accent : 'rgba(255,255,255,0.3)',
                  }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1 px-3 py-2.5 border-b" style={{ borderColor: `rgba(${rgb},0.1)` }}>
          {CHAR_FILTERS.map(f => (
            <button key={f} onClick={() => setFilterGroup(f)}
              className="px-2.5 py-1 rounded-sm font-mono text-[7.5px] tracking-[0.12em] uppercase transition-all duration-150"
              style={{
                background: filterGroup === f ? `rgba(${rgb},0.22)` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${filterGroup === f ? accent + '77' : 'rgba(255,255,255,0.06)'}`,
                color: filterGroup === f ? accent : 'rgba(255,255,255,0.38)',
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Count label */}
        <div className="px-3 py-1.5 flex items-center justify-between">
          <p className="font-mono text-[6.5px] tracking-[0.3em] uppercase text-white/20">
            {displayed.length} CHARACTER{displayed.length !== 1 ? 'S' : ''}
          </p>
          <p className="font-mono text-[6.5px] text-white/15 tracking-wider">MIDDLE-EARTH ARCHIVE</p>
        </div>

        {/* Character grid — 2 columns of portrait cards */}
        <div className="flex-1 overflow-y-auto px-2.5 pb-3" style={{ scrollbarWidth: 'none' }}>
          <div className="grid grid-cols-2 gap-2">
            {displayed.map(char => {
              const isActive = active?.id === char.id;
              return (
                <button
                  key={char.id}
                  onClick={() => { setActive(char); setSubTab('about'); }}
                  className="flex flex-col text-left rounded-sm overflow-hidden transition-all duration-150 group relative"
                  style={{
                    background: isActive ? `rgba(${rgb},0.16)` : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${isActive ? accent + '77' : 'rgba(255,255,255,0.07)'}`,
                    boxShadow: isActive ? `0 0 14px ${accent}22` : 'none',
                  }}
                >
                  {/* Portrait */}
                  <div className="relative w-full overflow-hidden" style={{ height: 96 }}>
                    <img
                      src={char.image || char.img || '/Images/gandalf_portrait.png'}
                      alt={char.name}
                      className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                      style={{ filter: isActive ? 'brightness(0.72) saturate(1.1)' : 'brightness(0.6) saturate(0.85)' }}
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,8,6,0.92) 0%, transparent 55%)' }} />
                    {/* Status dot */}
                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border border-black/40"
                      style={{ background: statusColor(char.status) }} />
                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: accent }} />
                    )}
                  </div>
                  {/* Info */}
                  <div className="px-2 py-1.5">
                    <p className="font-mono text-[9.5px] font-semibold text-white/85 leading-tight truncate"
                      style={{ color: isActive ? accent : undefined }}>
                      {char.name}
                    </p>
                    <p className="font-mono text-[7px] text-white/35 truncate mt-0.5">{char.race}</p>
                    <p className="font-mono text-[6.5px] truncate mt-0.5" style={{ color: `${accent}88` }}>
                      {char.faction}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ RIGHT: Character Detail ══ */}
      {active && (
        <div className="flex-1 flex min-w-0 overflow-hidden">

          {/* ── Center: portrait + identity + tabs ── */}
          <div className="flex flex-col flex-1 overflow-y-auto min-w-0" style={{ scrollbarWidth: 'none' }}>

            {/* Hero strip — medium height, not full screen */}
            <div className="relative shrink-0 overflow-hidden" style={{ height: 220 }}>
              <img
                src={active.image || active.img || '/Images/gandalf_portrait.png'}
                alt={active.name}
                className="absolute inset-0 w-full h-full object-cover object-top"
                style={{ filter: 'brightness(0.55) saturate(0.9)' }}
              />
              <div className="absolute inset-0" style={{
                background: 'linear-gradient(to bottom, rgba(10,8,6,0.15) 0%, transparent 30%, transparent 50%, rgba(10,8,6,0.98) 100%)',
              }} />
              <div className="absolute inset-0" style={{
                background: `radial-gradient(ellipse at 30% 50%, ${accent}0a 0%, transparent 65%)`,
              }} />
              {/* Identity overlay at bottom of strip */}
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 flex items-end gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-mono text-[7px] tracking-[0.38em] uppercase" style={{ color: accent }}>
                      {active.race}
                    </p>
                    <div className="h-px flex-1" style={{ background: `${accent}33` }} />
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: statusColor(active.status) }} />
                      <p className="font-mono text-[7px] text-white/40">{active.status}</p>
                    </div>
                  </div>
                  <h2 className="text-[30px] font-bold leading-none text-white uppercase tracking-[0.06em]"
                    style={{ fontFamily: "'Cinzel', serif", textShadow: `0 0 40px ${accent}44` }}>
                    {active.name}
                  </h2>
                  <p className="font-mono text-[8px] tracking-[0.18em] mt-1 text-white/45">{active.role}</p>
                </div>
                {/* Faction badge */}
                <div className="shrink-0 px-3 py-1.5 rounded-sm mb-1"
                  style={{ background: `rgba(${rgb},0.18)`, border: `1px solid ${accent}55` }}>
                  <p className="font-mono text-[7px] tracking-[0.25em] uppercase" style={{ color: accent }}>{active.faction}</p>
                </div>
              </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex border-b px-6 shrink-0" style={{ borderColor: `rgba(${rgb},0.15)` }}>
              {(['about','abilities','quotes','relationships'] as const).map(t => (
                <button key={t} onClick={() => setSubTab(t)}
                  className="relative py-3 pr-6 font-mono text-[7.5px] tracking-[0.2em] uppercase transition-colors"
                  style={{ color: subTab === t ? accent : 'rgba(255,255,255,0.28)' }}>
                  {t.toUpperCase()}
                  {subTab === t && <span className="absolute bottom-0 left-0 right-4 h-[1.5px]" style={{ background: accent }} />}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 px-6 py-5">
              {subTab === 'about' && (
                <div className="flex flex-col gap-4">
                  <p className="text-[12.5px] text-white/58 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    {active.tabs?.about || active.desc || active.description || '—'}
                  </p>
                  {/* Quick stats chips */}
                  <div className="flex flex-wrap gap-2">
                    {[
                      { label: 'FIRST APPEARANCE', val: active.appearance || active.stats?.['First Appearance'] || '—' },
                      { label: 'PLAYED BY',         val: active.actor || active.stats?.['PlayedBy'] || '—' },
                      { label: 'RACE',              val: active.race || '—' },
                      { label: 'FACTION',           val: active.faction || '—' },
                    ].map(s => (
                      <div key={s.label} className="px-3 py-2 rounded-sm"
                        style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid rgba(${rgb},0.18)` }}>
                        <p className="font-mono text-[6.5px] tracking-[0.25em] uppercase text-white/25 mb-0.5">{s.label}</p>
                        <p className="font-mono text-[9px] text-white/65">{s.val}</p>
                      </div>
                    ))}
                  </div>
                  {/* Registry stats */}
                  {active.stats && Object.keys(active.stats).length > 0 && (
                    <div>
                      <GoldLine accent={accent} />
                      <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-1.5">
                        {Object.entries(active.stats).map(([k, v]) => (
                          <div key={k} className="flex justify-between items-baseline border-b py-1"
                            style={{ borderColor: 'rgba(180,140,60,0.07)' }}>
                            <p className="font-mono text-[7.5px] uppercase tracking-wider text-white/25">{k}</p>
                            <p className="font-mono text-[8.5px] text-white/60 text-right">{v as string}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {subTab === 'abilities' && (
                <p className="text-[12.5px] text-white/55 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  {active.tabs?.abilities || 'Abilities record for this character is being compiled into the archive…'}
                </p>
              )}
              {subTab === 'quotes' && (
                <div className="flex flex-col gap-4">
                  <p className="text-[14px] text-white/60 italic leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                    &ldquo;{active.tabs?.quotes || active.quote || '—'}&rdquo;
                  </p>
                  {active.tabs?.appearance && (
                    <>
                      <GoldLine accent={accent} />
                      <p className="text-[11.5px] text-white/45 leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                        {active.tabs.appearance}
                      </p>
                    </>
                  )}
                </div>
              )}
              {subTab === 'relationships' && (
                <div>
                  {active.relationships && active.relationships.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {active.relationships.map((r: any) => (
                        <div key={r.name} className="flex items-center gap-2.5 p-2.5 rounded-sm"
                          style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(${rgb},0.12)` }}>
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-base shrink-0"
                            style={{ background: `rgba(${rgb},0.2)`, border: `1px solid ${accent}44` }}>
                            {r.avatar}
                          </div>
                          <div className="min-w-0">
                            <p className="font-mono text-[8.5px] text-white/72 truncate">{r.name}</p>
                            <p className="font-mono text-[7px] truncate" style={{ color: accent + '88' }}>{r.role}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-mono text-[9px] text-white/20 tracking-wider">
                      Relationship data for this character is being compiled…
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ── Right sidebar: compact info + relationships ── */}
          <div className="w-56 shrink-0 border-l flex flex-col overflow-y-auto" style={{ borderColor: `rgba(${rgb},0.15)`, scrollbarWidth: 'none' }}>

            {/* Character portrait thumbnail */}
            <div className="relative overflow-hidden shrink-0" style={{ height: 160 }}>
              <img
                src={active.image || active.img || '/Images/gandalf_portrait.png'}
                alt={active.name}
                className="w-full h-full object-cover object-top"
                style={{ filter: 'brightness(0.65) saturate(1)' }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(10,8,6,0.85) 0%, transparent 55%)' }} />
              <div className="absolute bottom-2.5 left-3">
                <p className="font-mono text-[7px] tracking-[0.2em] uppercase" style={{ color: accent + 'cc' }}>{active.race}</p>
              </div>
            </div>

            {/* Key stats */}
            <div className="p-3 border-b flex flex-col gap-1.5" style={{ borderColor: `rgba(${rgb},0.1)` }}>
              <SLabel accent={accent}>CHARACTER INFO</SLabel>
              {[
                { label: 'Status',    val: active.status },
                { label: 'Race',      val: active.race },
                { label: 'Faction',   val: active.faction },
                { label: 'Actor',     val: active.actor || active.stats?.PlayedBy || '—' },
                { label: 'Debut',     val: active.appearance || active.stats?.['First Appearance'] || '—' },
              ].map(d => (
                <div key={d.label} className="flex justify-between items-start gap-2 py-0.5 border-b last:border-0"
                  style={{ borderColor: 'rgba(180,140,60,0.06)' }}>
                  <p className="font-mono text-[7px] uppercase tracking-wider text-white/25 shrink-0">{d.label}</p>
                  <p className="font-mono text-[8px] text-white/58 text-right leading-tight">{d.val}</p>
                </div>
              ))}
            </div>

            {/* Relationships list */}
            {active.relationships && active.relationships.length > 0 && (
              <div className="p-3 flex flex-col gap-1.5">
                <SLabel accent={accent}>RELATIONSHIPS</SLabel>
                {active.relationships.map((r: any) => (
                  <div key={r.name} className="flex items-center gap-2 py-1 px-1.5 rounded-sm transition-colors hover:bg-white/[0.03]">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
                      style={{ background: `rgba(${rgb},0.18)`, border: `1px solid ${accent}33` }}>
                      {r.avatar}
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-[8px] text-white/62 truncate">{r.name}</p>
                      <p className="font-mono text-[6.5px] truncate" style={{ color: accent + '77' }}>{r.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
