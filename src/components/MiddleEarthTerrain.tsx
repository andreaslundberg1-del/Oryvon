// ─── COMPLETE REWRITE — Gaussian-ridge terrain, no walls, proper Tolkien geo ──
'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── Seeded pseudo-random (deterministic) ────────────────────────────────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function smoothstep(t: number) { return t * t * (3 - 2 * t); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function clamp(v: number, lo = 0, hi = 1) { return Math.max(lo, Math.min(hi, v)); }

// ─── Value noise ──────────────────────────────────────────────────────────────
function valueNoise(x: number, y: number, seed: number): number {
  const rng = seededRandom(seed);
  const table: number[] = [];
  for (let i = 0; i < 256; i++) table.push(rng());
  const hash = (xi: number, yi: number) => table[((xi & 255) + (yi & 255) * 57) & 255];
  const xi = Math.floor(x), yi = Math.floor(y);
  const tx = smoothstep(x - xi), ty = smoothstep(y - yi);
  return lerp(
    lerp(hash(xi, yi), hash(xi + 1, yi), tx),
    lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), tx),
    ty,
  );
}

// ─── fBm (fractal brownian motion) ────────────────────────────────────────────
function fbm(x: number, y: number, octaves: number, seed: number): number {
  let v = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    v   += amp * valueNoise(x * freq, y * freq, seed + i * 1337);
    max += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return v / max;
}

// ─── Domain-warped fBm — gives organic, eroded look ──────────────────────────
function warpedFbm(x: number, y: number, octaves: number, seed: number, warp = 0.4): number {
  const wx = fbm(x + 0.3, y + 0.1, 3, seed + 5000) * warp;
  const wy = fbm(x + 1.7, y + 2.3, 3, seed + 6000) * warp;
  return fbm(x + wx, y + wy, octaves, seed);
}

// ─── Gaussian ridge — smooth bell curve, NO hard walls ───────────────────────
// width = sigma in normalised coords; falloff is e^(-d²/2σ²)
function gaussRidge(
  nx: number, ny: number,
  pts: [number, number][],
  sigma: number,
  height: number,
): number {
  let best = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = clamp(((nx - ax) * dx + (ny - ay) * dy) / (len2 || 1));
    const px = ax + t * dx, py = ay + t * dy;
    const d2 = (nx - px) * (nx - px) + (ny - py) * (ny - py);
    const g = Math.exp(-d2 / (2 * sigma * sigma)) * height;
    if (g > best) best = g;
  }
  return best;
}

// ─── Gaussian point peak ──────────────────────────────────────────────────────
function gaussPeak(nx: number, ny: number, px: number, py: number, sigma: number, h: number): number {
  const d2 = (nx - px) * (nx - px) + (ny - py) * (ny - py);
  return Math.exp(-d2 / (2 * sigma * sigma)) * h;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MIDDLE-EARTH HEIGHTMAP
// ═══════════════════════════════════════════════════════════════════════════════
//
// COORDINATE SYSTEM — matches MAP_LOCATIONS x/y percentages divided by 100:
//   nx = 0 (west/Belegaer) → 1 (east/Rhûn)
//   ny = 0 (north)         → 1 (south/Harad)
//
// SOURCE: lotrproject.com canonical map, cross-referenced with Tolkien atlas.
// VERIFIED positions (from map):
//   The Shire      (0.17, 0.52)  — NW, rolling hills
//   Bree           (0.22, 0.46)  — crossroads town, Weather Hills east
//   Rivendell      (0.31, 0.40)  — hidden valley, west foot of Misty Mtns
//   Misty Mountains spine nx≈0.37, ny 0.17→0.70 (N-S chain)
//   Fangorn Forest (0.37, 0.60)  — south end of Misty Mtns
//   Lothlórien     (0.40, 0.51)  — east of MM at Moria latitude
//   Rohan (Edoras) (0.33, 0.62)  — south of Fangorn, west of Anduin,
//                                   north of White Mountains
//   White Mountains arc: nx 0.25→0.56, ny ≈0.66
//   Minas Tirith   (0.45, 0.65)  — north foot of White Mtns
//   Mirkwood       (0.55, 0.33)  — long N-S dark forest east of MM
//   Mordor basin   nx 0.59→0.75, ny 0.54→0.72
//   Ephel Dúath    west wall of Mordor, N-S at nx≈0.58
//   Ered Lithui    north wall of Mordor, E-W at ny≈0.54
//   Mount Doom     (0.67, 0.63)
//   Barad-dûr      (0.63, 0.57)
//   Blue Mountains nx≈0.12–0.15, ny 0.22→0.42 (western coastal chain)
//   Grey Mountains nx 0.43→0.68, ny≈0.16
//   Bay of Belfalas: southern sea inlet ny≈0.82, nx 0.28→0.42
//   Gulf of Lhûn:  western sea inlet ny≈0.28–0.34
//
// DESIGN PRINCIPLES:
//   1. gaussRidge() — Gaussian (bell-curve) falloff, NO hard walls
//   2. Ridges are low amplitude (max 0.42); base terrain carries the weight
//   3. warpedFbm() adds organic erosion on top of structural ridges
//   4. Final vertical scale is 1.15 (was 2.4) — realistic slope angles
//   5. Plains are subtracted to stay flat (Rohan, Shire, Anduin vale)
// ═══════════════════════════════════════════════════════════════════════════════

function middleEarthHeight(nx: number, ny: number): number {

  // ── 1. CONTINENT MASK ─────────────────────────────────────────────────────
  // Gaussian-edged landmass so coasts are never hard walls.
  // Slight noise offsets to make coastline organic.
  const cNoise = fbm(nx * 5, ny * 5, 2, 13) * 0.03;
  const cx = nx + cNoise, cy = ny + cNoise * 0.7;

  // West coast  ~nx=0.11 (bows inward slightly north/south)
  const westEdge  = 0.11 + Math.sin(cy * Math.PI) * 0.025 + cNoise * 0.4;
  // East edge   ~nx=0.81
  const eastEdge  = 0.81 + cNoise * 0.6;
  // North/south edges
  const northEdge = 0.08 + cNoise * 0.4;
  const southEdge = 0.88 + cNoise * 0.3;

  if (cx < westEdge || cx > eastEdge || cy < northEdge || cy > southEdge) return 0.0;

  // Smooth shore falloff — no cliff edge at waterline
  const dW = clamp((cx - westEdge)  / 0.06);
  const dE = clamp((eastEdge  - cx) / 0.07);
  const dN = clamp((cy - northEdge) / 0.06);
  const dS = clamp((southEdge  - cy) / 0.07);
  const shore = smoothstep(Math.min(dW, dE, dN, dS));

  // Gulf of Lhûn — sea inlet west coast, ny≈0.26–0.35
  // Cuts eastward from the coast around the Blue Mountains gap
  const glY = ny - 0.305, glX = nx - 0.135;
  const gulfCut = clamp(1 - (Math.abs(glY) / 0.048 + Math.max(0, glX) / 0.055));
  const gulfMask = 1 - smoothstep(gulfCut);

  // Bay of Belfalas — southern sea indentation
  const bbX = nx - 0.35, bbY = ny - 0.825;
  const bayCut = clamp(1 - Math.sqrt(bbX * bbX / (0.07 * 0.07) + bbY * bbY / (0.04 * 0.04)));
  const bayMask = 1 - smoothstep(bayCut);

  const landMask = shore * gulfMask * bayMask;

  // ── 2. BASE ELEVATION — domain-warped macro terrain ───────────────────────
  // Low-frequency warped noise gives rolling hills everywhere.
  // Amplitude kept low so ridges don't get buried or over-amplified.
  const base = warpedFbm(nx * 2.8, ny * 2.8, 5, 11, 0.35) * 0.22 + 0.13;

  // ── 3. MISTY MOUNTAINS ────────────────────────────────────────────────────
  // N-S spine, nx≈0.37, ny 0.17→0.70.
  // Bows very slightly east at Moria latitude (ny≈0.48).
  // Rivendell pass: gentle saddle at ny≈0.39 (sigma=0.025 dip).
  const mmPts: [number, number][] = [
    [0.370, 0.17], [0.372, 0.22], [0.370, 0.28],
    [0.368, 0.34], [0.370, 0.40],
    [0.376, 0.46], [0.380, 0.52], [0.381, 0.58],
    [0.379, 0.63], [0.374, 0.69],
  ];
  const mmRaw = gaussRidge(nx, ny, mmPts, 0.028, 0.42);
  // Carve a gentle Rivendell pass (saddle) — subtract a Gaussian dip
  const passDepth = gaussPeak(nx, ny, 0.369, 0.390, 0.012, 0.14);
  const mmRidge = Math.max(0, mmRaw - passDepth);

  // ── 4. WHITE MOUNTAINS (Ered Nimrais) ─────────────────────────────────────
  // E-W arc from west coast foothills to junction with Ephel Dúath.
  // Arc bows NORTH slightly at centre — Minas Tirith (0.45,0.65) sits at
  // the northern foot; Rohan (0.33,0.62) is NORTH of this chain.
  const wmPts: [number, number][] = [
    [0.255, 0.685], [0.30, 0.675], [0.36, 0.668],
    [0.42, 0.664], [0.48, 0.665], [0.535, 0.668],
    [0.565, 0.673],
  ];
  const wmRidge = gaussRidge(nx, ny, wmPts, 0.022, 0.38);

  // ── 5. BLUE MOUNTAINS (Ered Luin) ─────────────────────────────────────────
  // Western coastal chain, nx≈0.12–0.15, ny 0.22→0.42.
  // Straddles the Gulf of Lhûn (gap at ny≈0.305).
  const bmNPts: [number, number][] = [[0.145, 0.22], [0.140, 0.28], [0.134, 0.300]]; // north spur
  const bmSPts: [number, number][] = [[0.134, 0.312], [0.138, 0.35], [0.143, 0.42]]; // south spur
  const bmRidge = gaussRidge(nx, ny, bmNPts, 0.018, 0.28)
                + gaussRidge(nx, ny, bmSPts, 0.018, 0.28);

  // ── 6. GREY MOUNTAINS (Ered Mithrin) ──────────────────────────────────────
  // E-W chain far north, ny≈0.15–0.17, nx 0.42→0.68.
  const gmPts: [number, number][] = [
    [0.42, 0.165], [0.50, 0.155], [0.58, 0.150], [0.66, 0.158],
  ];
  const gmRidge = gaussRidge(nx, ny, gmPts, 0.020, 0.32);

  // ── 7. IRON HILLS — NE fringe, east of Mirkwood ───────────────────────────
  const ironPts: [number, number][] = [
    [0.63, 0.21], [0.68, 0.23], [0.73, 0.26],
  ];
  const ironRidge = gaussRidge(nx, ny, ironPts, 0.016, 0.22);

  // ── 8. WEATHER HILLS — small N-S chain east of Bree ──────────────────────
  const whPts: [number, number][] = [
    [0.255, 0.37], [0.265, 0.41], [0.268, 0.45],
  ];
  const weatherRidge = gaussRidge(nx, ny, whPts, 0.014, 0.16);

  // ── 9. EMYN MUIL — rocky knolls above Anduin bend ────────────────────────
  const emynPts: [number, number][] = [
    [0.435, 0.565], [0.450, 0.572],
  ];
  const emynRidge = gaussRidge(nx, ny, emynPts, 0.016, 0.15);

  // ── 10. MORDOR RING MOUNTAINS ─────────────────────────────────────────────
  // Ephel Dúath — western wall, N-S, nx≈0.578, ny 0.52→0.70
  const ephelPts: [number, number][] = [
    [0.578, 0.520], [0.578, 0.560], [0.578, 0.600],
    [0.576, 0.640], [0.572, 0.680], [0.568, 0.715],
  ];
  const ephelRidge = gaussRidge(nx, ny, ephelPts, 0.020, 0.38);

  // Ered Lithui — northern wall, E-W, ny≈0.535, nx 0.580→0.750
  const eredPts: [number, number][] = [
    [0.580, 0.535], [0.620, 0.528], [0.660, 0.524],
    [0.700, 0.528], [0.740, 0.537],
  ];
  const eredRidge = gaussRidge(nx, ny, eredPts, 0.018, 0.35);

  // ── 11. MORDOR INTERIOR — low volcanic ash plateau ────────────────────────
  // Inside the ring, slightly elevated above sea level but BELOW the walls.
  // Uses warped noise so it doesn't look flat.
  const inMordorBasin =
    nx > 0.585 && nx < 0.745 && ny > 0.540 && ny < 0.715;
  const mordorPlateau = inMordorBasin
    ? 0.18 + warpedFbm(nx * 9, ny * 9, 3, 99, 0.2) * 0.05
    : 0.0;

  // ── 12. MOUNT DOOM ────────────────────────────────────────────────────────
  // Gaussian peak, sigma=0.016 → very localised, realistic volcanic cone.
  const mountDoom = gaussPeak(nx, ny, 0.670, 0.630, 0.016, 0.58);

  // ── 13. MINAS TIRITH / MOUNT MINDOLLUIN ───────────────────────────────────
  const mindolluin = gaussPeak(nx, ny, 0.452, 0.648, 0.013, 0.20);

  // ── 14. RHÛN EASTERN RISE — gentle highlands far east ────────────────────
  const eastRise = clamp((nx - 0.74) / 0.12) * 0.15
    * smoothstep(clamp((ny - 0.18) / 0.5));

  // ── 15. PLAINS / VALLEY SUPPRESSORS ──────────────────────────────────────
  // These subtract from the composite to keep flatlands flat.
  // Uses smooth Gaussian wells — no hard edges.

  // The Shire — rolling but LOW
  const shireDip = gaussPeak(nx, ny, 0.165, 0.520, 0.062, 0.10);

  // Rohan — wide flat plains between White Mtns (south) and Fangorn/MM (north)
  // Bounded: nx 0.25–0.46, ny 0.57–0.66
  const rohanDip = gaussPeak(nx, ny, 0.340, 0.618, 0.075, 0.13)
                 * clamp((nx - 0.25) / 0.04)
                 * clamp((0.47 - nx) / 0.04)
                 * clamp((ny - 0.565) / 0.03)
                 * clamp((0.665 - ny) / 0.03);

  // Anduin Vale — river corridor between MM and Ephel Dúath
  const anduinDip = gaussPeak(nx, ny, 0.455, 0.575, 0.022, 0.09)
                  + gaussPeak(nx, ny, 0.470, 0.620, 0.018, 0.07);

  // Lothlórien — flat golden wood east of MM at Moria latitude
  const lorienDip = gaussPeak(nx, ny, 0.400, 0.510, 0.030, 0.07);

  // ── 16. FINE EROSION DETAIL ───────────────────────────────────────────────
  // High-freq warped noise for micro-terrain detail (cliffs, gullies)
  const detail = warpedFbm(nx * 11, ny * 11, 3, 42, 0.25) * 0.045;

  // ── COMPOSITE ─────────────────────────────────────────────────────────────
  const structuralRidges =
    mmRidge + wmRidge + bmRidge + gmRidge + ironRidge
    + weatherRidge + emynRidge + ephelRidge + eredRidge
    + mordorPlateau + mountDoom + mindolluin;

  const raw = landMask * (base + eastRise + detail)
    + structuralRidges
    - shireDip - rohanDip - anduinDip - lorienDip;

  return clamp(raw);
}

// ─── Biome zone tests ─────────────────────────────────────────────────────────
function inBox(nx: number, ny: number, x0: number, x1: number, y0: number, y1: number) {
  return nx > x0 && nx < x1 && ny > y0 && ny < y1;
}
function inGauss(nx: number, ny: number, cx: number, cy: number, rx: number, ry: number) {
  return ((nx - cx) / rx) ** 2 + ((ny - cy) / ry) ** 2 < 1;
}

// ─── Terrain colour ───────────────────────────────────────────────────────────
function terrainColor(nx: number, ny: number, h: number): THREE.Color {
  const col = new THREE.Color();

  // ── OCEAN ──
  if (h <= 0.0) { col.setRGB(0.02, 0.07, 0.17); return col; }

  // ── SHALLOW WATER / SHORE GRADIENT ──
  if (h < 0.06) {
    const t = h / 0.06;
    col.setRGB(lerp(0.03, 0.24, t), lerp(0.10, 0.21, t), lerp(0.23, 0.15, t));
    return col;
  }
  if (h < 0.11) {
    const t = (h - 0.06) / 0.05;
    col.setRGB(lerp(0.30, 0.28, t), lerp(0.26, 0.24, t), lerp(0.15, 0.14, t));
    return col;
  }

  // ── BIOME CLASSIFICATION ──
  // Mordor basin (inside the ring walls)
  const inMordor = inBox(nx, ny, 0.586, 0.744, 0.542, 0.712);
  // Near Mount Doom
  const nearDoom = inGauss(nx, ny, 0.670, 0.630, 0.040, 0.040);
  // Dark Mordor mountain rock (ring walls themselves)
  const mordorMtn = (gaussRidge(nx, ny,
    [[0.578, 0.520],[0.578, 0.600],[0.572, 0.680]], 0.022, 1) > 0.18
    || gaussRidge(nx, ny,
    [[0.580, 0.535],[0.660, 0.524],[0.740, 0.537]], 0.020, 1) > 0.18)
    && !inMordor;

  // The Shire
  const inShire = inGauss(nx, ny, 0.165, 0.520, 0.082, 0.068);
  // Eriador / Arnor
  const inEriador = nx < 0.37 && ny > 0.18 && ny < 0.61 && !inShire;
  // Rohan — SOUTH of MM/Fangorn, NORTH of White Mtns
  const inRohan = inBox(nx, ny, 0.25, 0.47, 0.570, 0.662) && !inMordor;
  // Fangorn — dense old-growth forest south end of MM
  const inFangorn = inGauss(nx, ny, 0.372, 0.600, 0.030, 0.028);
  // Gondor — south of White Mountains
  const inGondor = inBox(nx, ny, 0.26, 0.575, 0.672, 0.835) && !inMordor;
  // Lothlórien
  const inLorien = inGauss(nx, ny, 0.400, 0.510, 0.040, 0.032);
  // Mirkwood — long N-S forest east of MM
  const inMirkwood = inBox(nx, ny, 0.440, 0.625, 0.190, 0.540)
    && nx > 0.39 && !inMordor && !inLorien;
  // Rhûn eastern steppe
  const inRhun = nx > 0.73 && ny > 0.17 && ny < 0.62;
  // Harad southern desert/savanna
  const inHarad = ny > 0.78 && !inGondor && !inMordor;

  // ── HEIGHT-BASED OVERRIDES (snow caps, bare rock) ──
  if (h > 0.72) {
    const t = clamp((h - 0.72) / 0.12);
    if (inMordor || nearDoom) {
      col.setRGB(lerp(0.38, 0.08, t), lerp(0.07, 0.02, t), lerp(0.02, 0.01, t));
    } else {
      col.setRGB(lerp(0.78, 0.96, t), lerp(0.76, 0.95, t), lerp(0.68, 0.94, t));
    }
    return col;
  }
  if (h > 0.50) {
    const t = clamp((h - 0.50) / 0.22);
    if (mordorMtn || inMordor || nearDoom) {
      col.setRGB(lerp(0.18, 0.10, t), lerp(0.05, 0.02, t), lerp(0.02, 0.01, t));
    } else {
      col.setRGB(lerp(0.44, 0.60, t), lerp(0.40, 0.55, t), lerp(0.32, 0.46, t));
    }
    return col;
  }

  // ── MID-ELEVATION BIOME COLOURS ──
  const t = clamp((h - 0.11) / 0.39);

  if (nearDoom) {
    col.setRGB(lerp(0.40, 0.22, t), lerp(0.09, 0.04, t), lerp(0.02, 0.01, t));
    return col;
  }
  if (inMordor) {
    col.setRGB(lerp(0.15, 0.09, t), lerp(0.05, 0.03, t), lerp(0.03, 0.01, t));
    return col;
  }
  if (inShire) {
    col.setRGB(lerp(0.18, 0.30, t), lerp(0.46, 0.56, t), lerp(0.10, 0.16, t));
    return col;
  }
  if (inFangorn) {
    col.setRGB(lerp(0.07, 0.13, t), lerp(0.18, 0.26, t), lerp(0.06, 0.10, t));
    return col;
  }
  if (inLorien) {
    col.setRGB(lerp(0.28, 0.40, t), lerp(0.50, 0.58, t), lerp(0.12, 0.18, t));
    return col;
  }
  if (inMirkwood) {
    col.setRGB(lerp(0.06, 0.10, t), lerp(0.14, 0.21, t), lerp(0.05, 0.08, t));
    return col;
  }
  if (inRohan) {
    col.setRGB(lerp(0.48, 0.58, t), lerp(0.45, 0.52, t), lerp(0.17, 0.23, t));
    return col;
  }
  if (inGondor) {
    col.setRGB(lerp(0.28, 0.40, t), lerp(0.33, 0.44, t), lerp(0.20, 0.30, t));
    return col;
  }
  if (inHarad) {
    col.setRGB(lerp(0.58, 0.70, t), lerp(0.46, 0.52, t), lerp(0.20, 0.26, t));
    return col;
  }
  if (inRhun) {
    col.setRGB(lerp(0.48, 0.56, t), lerp(0.42, 0.48, t), lerp(0.22, 0.28, t));
    return col;
  }
  if (inEriador) {
    col.setRGB(lerp(0.23, 0.34, t), lerp(0.37, 0.47, t), lerp(0.14, 0.20, t));
    return col;
  }
  col.setRGB(lerp(0.22, 0.35, t), lerp(0.35, 0.46, t), lerp(0.14, 0.21, t));
  return col;
}

// ─── Terrain mesh component ────────────────────────────────────────────────────
const RES = 320; // vertex grid resolution

function TerrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  const { geometry } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(10, 6.5, RES - 1, RES - 1);
    geo.rotateX(-Math.PI / 2);

    const pos = geo.attributes.position as THREE.BufferAttribute;
    const count = pos.count;
    const colorArr = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const nx = (x + 5) / 10;
      const ny = (z + 3.25) / 6.5;
      const h = middleEarthHeight(nx, ny);
      // Scale: 1.15 gives realistic mountain slopes without walls
      const elev = h < 0.055 ? 0 : h * 1.15;
      pos.setY(i, elev);
      const c = terrainColor(nx, ny, h);
      colorArr[i * 3]     = c.r;
      colorArr[i * 3 + 1] = c.g;
      colorArr[i * 3 + 2] = c.b;
    }

    geo.computeVertexNormals();
    geo.setAttribute('color', new THREE.BufferAttribute(colorArr, 3));

    return { geometry: geo };
  }, []);

  // Lava pulse on Mount Doom
  const lavaMatRef = useRef<THREE.MeshStandardMaterial>(null);
  useFrame(({ clock }) => {
    if (lavaMatRef.current) {
      const t = clock.getElapsedTime();
      lavaMatRef.current.emissiveIntensity = 0.6 + Math.sin(t * 1.8) * 0.35;
    }
  });

  return (
    <group>
      {/* Main terrain mesh */}
      <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
        <meshStandardMaterial
          vertexColors
          roughness={0.88}
          metalness={0.0}
          envMapIntensity={0.3}
        />
      </mesh>

      {/* Mount Doom emissive cone overlay — nx=0.670,ny=0.630, elev≈h*1.15 */}
      <mesh position={[1.70, 0.82, 0.595]} castShadow>
        <coneGeometry args={[0.22, 0.55, 24]} />
        <meshStandardMaterial
          ref={lavaMatRef}
          color="#1a0800"
          emissive="#ff4400"
          emissiveIntensity={0.7}
          roughness={0.95}
        />
      </mesh>

      {/* Crater glow */}
      <pointLight position={[1.70, 1.20, 0.595]} color="#ff6600" intensity={3.5} distance={1.8} decay={2} />
    </group>
  );
}

// ─── Location marker (3D billboard pin) ───────────────────────────────────────
function MapPin({ nx, ny, active, accent, onClick }: {
  nx: number; ny: number;
  active: boolean; accent: string;
  onClick: () => void;
}) {
  const x = nx * 10 - 5;
  const z = ny * 6.5 - 3.25;
  const h = middleEarthHeight(nx, ny);
  const y = (h < 0.055 ? 0 : h * 1.15) + 0.06;

  const pinRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (pinRef.current && active) {
      pinRef.current.rotation.y = clock.getElapsedTime() * 1.5;
    }
  });

  const accentColor = new THREE.Color(accent);

  return (
    <group position={[x, y, z]} onClick={onClick}>
      {/* Pin sphere */}
      <mesh ref={pinRef}>
        <sphereGeometry args={[active ? 0.075 : 0.055, 12, 12]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={active ? 1.2 : 0.5}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
      {/* Glow ring for active */}
      {active && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.10, 0.16, 32]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.55} side={THREE.DoubleSide} />
        </mesh>
      )}
      {/* Ground dot */}
      <mesh position={[0, -y + 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.06, 16]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

// ─── Atmosphere / fog plane ────────────────────────────────────────────────────
function AtmosphereFog() {
  const fogRef = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (fogRef.current) {
      const mat = fogRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(clock.getElapsedTime() * 0.25) * 0.02;
    }
  });
  return (
    <mesh ref={fogRef} position={[0, 3.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 14]} />
      <meshBasicMaterial color="#8090b0" transparent opacity={0.10} side={THREE.DoubleSide} />
    </mesh>
  );
}

// ─── Camera rig ───────────────────────────────────────────────────────────────
function CameraRig() {
  const { camera } = useThree();
  useEffect(() => {
    camera.position.set(0, 5.0, 4.2);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  return null;
}

// ─── Main exported component ──────────────────────────────────────────────────
export interface TerrainLocation {
  id: string;
  name: string;
  x: number; // percent 0–100
  y: number; // percent 0–100
}

interface MiddleEarthTerrainProps {
  locations: TerrainLocation[];
  selectedId: string;
  accent: string;
  onSelectLocation: (id: string) => void;
}

export default function MiddleEarthTerrain({
  locations,
  selectedId,
  accent,
  onSelectLocation,
}: MiddleEarthTerrainProps) {
  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      style={{ background: '#060d16' }}
      camera={{ fov: 42, near: 0.1, far: 80 }}
    >
      <CameraRig />

      {/* ── Lighting ── */}
      {/* Ambient — cool sky fill */}
      <ambientLight color="#c8d8f0" intensity={0.55} />
      {/* Sun — NW angle, warm gold */}
      <directionalLight
        position={[-4, 9, -3]}
        color="#ffe8c0"
        intensity={2.1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0008}
      />
      {/* Fill light from east — cooler */}
      <directionalLight position={[5, 4, 2]} color="#90a8d0" intensity={0.4} />
      {/* Mordor underlight — very subtle orange bleed, centered on Mordor nx≈0.655,ny≈0.620 */}
      <pointLight position={[1.55, 0.3, 0.53]} color="#ff5500" intensity={1.2} distance={3.0} decay={2} />

      {/* ── Stars (visible at map edges) ── */}
      <Stars radius={30} depth={8} count={800} factor={2} saturation={0.4} fade />

      {/* ── Terrain ── */}
      <TerrainMesh />

      {/* ── Atmosphere ── */}
      <AtmosphereFog />

      {/* ── Location pins ── */}
      {locations.map(loc => (
        <MapPin
          key={loc.id}
          nx={loc.x / 100}
          ny={loc.y / 100}
          active={loc.id === selectedId}
          accent={accent}
          onClick={() => onSelectLocation(loc.id)}
        />
      ))}

      {/* ── Camera controls — restricted to atlas-style panning/orbit ── */}
      <OrbitControls
        enablePan
        enableRotate
        enableZoom
        minDistance={2.5}
        maxDistance={14}
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={0.18}
        panSpeed={1.2}
        rotateSpeed={0.55}
        zoomSpeed={0.9}
        target={[0, 0, 0]}
        screenSpacePanning={false}
      />
    </Canvas>
  );
}
