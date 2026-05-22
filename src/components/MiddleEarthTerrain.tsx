// ─── COMPLETE REWRITE — Gaussian-ridge terrain, no walls, proper Tolkien geo ──
'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sky } from '@react-three/drei';
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

// ─── Domain-warped fBm — organic shape distortion ───────────────────────────
function warpedFbm(x: number, y: number, octaves: number, seed: number, warp = 0.4): number {
  const wx = fbm(x + 0.3, y + 0.1, 3, seed + 5000) * warp;
  const wy = fbm(x + 1.7, y + 2.3, 3, seed + 6000) * warp;
  return fbm(x + wx, y + wy, octaves, seed);
}

// ─── Ridge fBm — sharp knife-edge crests like real mountain ridges ─────────────
// Each octave uses 1-|noise*2-1| which peaks sharply at 0.5 intervals.
// Creates the jagged silhouette of a real mountain chain.
function ridgeFbm(x: number, y: number, octaves: number, seed: number): number {
  let v = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    const n = valueNoise(x * freq, y * freq, seed + i * 1337);
    v   += amp * (1.0 - Math.abs(n * 2.0 - 1.0));  // ridge shape
    max += amp;
    amp *= 0.48;
    freq *= 2.2;
  }
  return v / max;
}

// ─── Turbulent fBm — erosion / gully simulation ─────────────────────────────
// Absolute value of noise — creates gully-like trenches and sharp erosion.
function turbulentFbm(x: number, y: number, octaves: number, seed: number): number {
  let v = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    const n = valueNoise(x * freq, y * freq, seed + i * 1337);
    v   += amp * Math.abs(n * 2.0 - 1.0);  // turbulence
    max += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return v / max;
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
// TECHNIQUE: Structural Gaussian envelope × ridgeFbm detail
//   • gaussRidge() defines WHERE mountains are (geography)
//   • ridgeFbm() defines WHAT they look like (geology)
//   • Envelope multiplies ridge noise — jagged peaks only ON the mountain chain,
//     smooth terrain everywhere else
//   • turbulentFbm() carves erosion gullies across slopes
//   • All geography coordinates from lotrproject.com canonical Tolkien atlas
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

  // ── 2. BASE ELEVATION ────────────────────────────────────────────────────────────
  // Low-freq warped base — gentle rolling hills across whole continent.
  const base = warpedFbm(nx * 2.8, ny * 2.8, 5, 11, 0.35) * 0.18 + 0.10;

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
  // Smooth Gaussian well centred on Mordor basin — NO hard box.
  const mordorBasin = gaussPeak(nx, ny, 0.665, 0.628, 0.075, 0.16)
    * clamp((nx - 0.590) / 0.03)
    * clamp((0.745 - nx) / 0.03)
    * clamp((ny - 0.542) / 0.02)
    * clamp((0.712 - ny) / 0.02);
  const mordorPlateau = mordorBasin * (1 + warpedFbm(nx * 9, ny * 9, 3, 99, 0.2) * 0.28);

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

  // ── 16. RIDGE NOISE DETAIL — modulated by structural envelope ─────────────────
  // This is the KEY to realistic mountains:
  // ridgeFbm produces sharp jagged crests (like real peaks)
  // but we MULTIPLY it by the Gaussian structural envelope,
  // so sharp detail only exists where mountains structurally are.
  // Plains stay smooth; mountains become rugged.
  const ridgeMax = Math.max(
    mmRidge, wmRidge, bmRidge, gmRidge, ironRidge,
    weatherRidge, emynRidge, ephelRidge, eredRidge
  );

  // High-detail ridge noise — large scale crest definition
  const ridgeDetail = ridgeFbm(nx * 18, ny * 18, 5, 31);
  // Medium erosion turbulence — gullies and cliff breaks
  const erosion = turbulentFbm(nx * 26, ny * 26, 4, 57) * 0.55;
  // Fine rocky breakup
  const rocky = ridgeFbm(nx * 44, ny * 44, 3, 83) * 0.38;

  // Mountain detail = ridge noise × envelope (jagged ONLY where mountains are)
  const mtnDetail = ridgeMax * (ridgeDetail * 0.32 + erosion * 0.08 + rocky * 0.05);

  // Mild global terrain variation — rolling everywhere
  const globalDetail = warpedFbm(nx * 8, ny * 8, 4, 42, 0.3) * 0.04;

  // Mordor-specific cracked volcanic surface
  const inMordorZone = mordorPlateau > 0.02;
  const mordorCrack = inMordorZone
    ? turbulentFbm(nx * 35, ny * 35, 3, 199) * mordorPlateau * 0.18
    : 0;

  // ── COMPOSITE ─────────────────────────────────────────────────────────────
  // Structure: mountains "grow from" base terrain as ridge-detailed peaks.
  // Max-blend prevents stacking; ridge detail gives geological realism.
  const structuralPeaks = Math.max(mmRidge, wmRidge, bmRidge, gmRidge, ironRidge,
    weatherRidge, emynRidge, ephelRidge, eredRidge, mountDoom, mindolluin);

  const terrainBody = base
    + structuralPeaks * 0.78    // mountain structure
    + mtnDetail                  // jagged ridge detail on mountain slopes
    + mordorPlateau              // volcanic basin
    + mordorCrack                // cracked volcanic surface
    + eastRise
    + globalDetail;

  // Valley suppressors — smooth Gaussian wells pulling plains flat:
  const plains = shireDip + rohanDip + anduinDip + lorienDip;

  const raw = landMask * terrainBody - plains * landMask;
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
// Uses both h (elevation) and slope proxy (via high-freq noise) for
// rock/cliff tinting — steep faces go bare grey rock, flats stay green.
function terrainColor(nx: number, ny: number, h: number): THREE.Color {
  const col = new THREE.Color();

  // ── OCEAN ──
  if (h <= 0.0) { col.setRGB(0.02, 0.07, 0.17); return col; }

  // ── SHALLOW WATER / BEACH TRANSITION ──
  if (h < 0.055) {
    const t = h / 0.055;
    col.setRGB(lerp(0.04, 0.26, t), lerp(0.12, 0.22, t), lerp(0.24, 0.16, t));
    return col;
  }
  if (h < 0.10) {
    const t = (h - 0.055) / 0.045;
    // sandy beach → coastal lowland
    col.setRGB(lerp(0.62, 0.38, t), lerp(0.56, 0.36, t), lerp(0.32, 0.22, t));
    return col;
  }

  // ── SLOPE PROXY — high-freq noise variation mimics local steepness ──
  // Real slope needs adjacent vertices; we approximate with high-freq noise
  // that correlates with ridgeFbm detail in the heightmap.
  const slopeProxy = ridgeFbm(nx * 44, ny * 44, 2, 83); // 0–1, high where steep
  const rockiness = clamp(slopeProxy * 1.4 - 0.3); // threshold: rocky above ~0.5

  // ── BIOME CLASSIFICATION ──
  const inMordor = inBox(nx, ny, 0.586, 0.744, 0.542, 0.712);
  const nearDoom  = inGauss(nx, ny, 0.670, 0.630, 0.040, 0.040);
  const mordorMtn = (
    gaussRidge(nx, ny, [[0.578,0.520],[0.578,0.600],[0.572,0.680]], 0.022, 1) > 0.15 ||
    gaussRidge(nx, ny, [[0.580,0.535],[0.660,0.524],[0.740,0.537]], 0.020, 1) > 0.15
  ) && !inMordor;

  const inShire    = inGauss(nx, ny, 0.165, 0.520, 0.082, 0.068);
  const inEriador  = nx < 0.37 && ny > 0.18 && ny < 0.61 && !inShire;
  const inRohan    = inBox(nx, ny, 0.25, 0.47, 0.570, 0.662) && !inMordor;
  const inFangorn  = inGauss(nx, ny, 0.372, 0.600, 0.030, 0.028);
  const inGondor   = inBox(nx, ny, 0.26, 0.575, 0.672, 0.835) && !inMordor;
  const inLorien   = inGauss(nx, ny, 0.400, 0.510, 0.040, 0.032);
  const inMirkwood = inBox(nx, ny, 0.440, 0.625, 0.190, 0.540) && nx > 0.39 && !inMordor && !inLorien;
  const inRhun     = nx > 0.73 && ny > 0.17 && ny < 0.62;
  const inHarad    = ny > 0.78 && !inGondor && !inMordor;

  // ── UNIVERSAL CLIFF/ROCK OVERRIDE — steep high terrain goes bare grey ──
  // This is what makes mountains look CARVED, not painted.
  // Any high + rocky area becomes stone regardless of biome.
  const isBareCrag = h > 0.46 && rockiness > 0.55 && !inMordor;
  const isSnowCap  = h > 0.68 && !inMordor;
  const isVolcanic = (inMordor || mordorMtn || nearDoom) && h > 0.38;

  if (isSnowCap) {
    const t = clamp((h - 0.68) / 0.14);
    // Grey rock fading to brilliant white snow
    col.setRGB(lerp(0.72, 0.95, t), lerp(0.70, 0.94, t), lerp(0.64, 0.93, t));
    return col;
  }
  if (isVolcanic) {
    // Volcanic dark rock with lava-crack orange glow in deepest areas
    const lavaGlow = nearDoom ? clamp((0.65 - h) / 0.3) : 0;
    const crack = turbulentFbm(nx * 32, ny * 32, 3, 199);
    col.setRGB(
      lerp(0.08, 0.35, lavaGlow * crack),
      lerp(0.03, 0.05, lavaGlow * crack),
      lerp(0.01, 0.01, 0)
    );
    return col;
  }
  if (isBareCrag) {
    const t = clamp((h - 0.46) / 0.22);
    // Wet grey-brown rock — darker in gullies, lighter on exposed ridges
    const v = lerp(0.38, 0.62, t) + (rockiness - 0.55) * 0.18;
    col.setRGB(v * 0.90, v * 0.85, v * 0.78);
    return col;
  }

  // ── HIGH ROCK BANDS — mountain flanks below snow line ──
  if (h > 0.52) {
    const t = clamp((h - 0.52) / 0.16);
    if (inMordor || mordorMtn) {
      col.setRGB(lerp(0.16, 0.10, t), lerp(0.04, 0.02, t), lerp(0.02, 0.01, t));
    } else {
      // Grey-blue alpine rock
      col.setRGB(lerp(0.40, 0.58, t), lerp(0.38, 0.54, t), lerp(0.30, 0.46, t));
    }
    return col;
  }

  // ── MID-ELEVATION BIOME COLOURS ──
  // Rock blending: on mountain flanks (h>0.38) mix in grey stone
  const rockBlend = clamp((h - 0.35) / 0.17) * rockiness * 0.6;
  const t = clamp((h - 0.10) / 0.42);

  let r: number, g: number, b: number;

  if (nearDoom) {
    // Lava-lit volcanic rock
    r = lerp(0.35, 0.18, t); g = lerp(0.07, 0.03, t); b = lerp(0.01, 0.01, t);
  } else if (inMordor) {
    // Ashy black volcanic plateau with texture variation
    const ashVar = fbm(nx * 22, ny * 22, 2, 77) * 0.06;
    r = lerp(0.12, 0.08, t) + ashVar; g = lerp(0.04, 0.03, t); b = lerp(0.02, 0.01, t);
  } else if (inShire) {
    // Vivid rolling green with pale-grass highlights
    r = lerp(0.14, 0.28, t); g = lerp(0.44, 0.54, t); b = lerp(0.09, 0.15, t);
  } else if (inFangorn) {
    // Ancient dark forest
    r = lerp(0.06, 0.12, t); g = lerp(0.16, 0.24, t); b = lerp(0.05, 0.09, t);
  } else if (inLorien) {
    // Golden-green woodland
    r = lerp(0.26, 0.38, t); g = lerp(0.48, 0.56, t); b = lerp(0.11, 0.17, t);
  } else if (inMirkwood) {
    // Near-black dense canopy with murky green
    r = lerp(0.05, 0.09, t); g = lerp(0.12, 0.19, t); b = lerp(0.04, 0.07, t);
  } else if (inRohan) {
    // Dry amber grassland, pale gold
    r = lerp(0.46, 0.56, t); g = lerp(0.43, 0.50, t); b = lerp(0.16, 0.21, t);
  } else if (inGondor) {
    // Grey-green stone foothills
    r = lerp(0.26, 0.38, t); g = lerp(0.31, 0.42, t); b = lerp(0.18, 0.28, t);
  } else if (inHarad) {
    // Hot desert sand + scrub
    r = lerp(0.56, 0.68, t); g = lerp(0.44, 0.50, t); b = lerp(0.18, 0.22, t);
  } else if (inRhun) {
    // Dry eastern steppe
    r = lerp(0.46, 0.54, t); g = lerp(0.40, 0.46, t); b = lerp(0.20, 0.26, t);
  } else if (inEriador) {
    // Temperate mixed woodland and moor
    r = lerp(0.22, 0.33, t); g = lerp(0.36, 0.46, t); b = lerp(0.13, 0.19, t);
  } else {
    r = lerp(0.20, 0.33, t); g = lerp(0.34, 0.44, t); b = lerp(0.13, 0.20, t);
  }

  // Blend in cliff rock on steep mountain flanks
  const rockR = 0.42, rockG = 0.38, rockB = 0.32;
  col.setRGB(
    lerp(r, rockR, rockBlend),
    lerp(g, rockG, rockBlend),
    lerp(b, rockB, rockBlend)
  );
  return col;
}

// ─── Terrain mesh component ────────────────────────────────────────────────────
const RES = 380; // vertex grid resolution — higher = sharper ridge silhouettes

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
      // Continuous elevation — no hard step at waterline.
      // Ocean (h=0) stays at 0; land rises smoothly.
      const elev = h * 1.2;
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
  const y = h * 1.2 + 0.06;

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

// ─── Ocean plane — fills below terrain level ─────────────────────────────────
function OceanPlane() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
      <planeGeometry args={[60, 60]} />
      <meshStandardMaterial
        color="#0a1e3c"
        roughness={0.05}
        metalness={0.1}
        transparent
        opacity={0.92}
      />
    </mesh>
  );
}

// ─── Haze / atmospheric fog layer ────────────────────────────────────────────
function AtmosphericHaze() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      (ref.current.material as THREE.MeshBasicMaterial).opacity =
        0.055 + Math.sin(clock.getElapsedTime() * 0.18) * 0.015;
    }
  });
  return (
    <mesh ref={ref} position={[0, 1.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[40, 30]} />
      <meshBasicMaterial color="#b8cce0" transparent opacity={0.06} depthWrite={false} />
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
      style={{ background: '#1a3a5c' }}
      camera={{ fov: 48, near: 0.1, far: 200 }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.FogExp2('#c8ddf0', 0.018);
      }}
    >
      <CameraRig />

      {/* ── Lighting ── */}
      {/* Ambient — cool sky fill */}
      <ambientLight color="#d0e4f8" intensity={0.70} />
      {/* Sun — matches Sky sunPosition, warm afternoon gold */}
      <directionalLight
        position={[-4, 8, -5]}
        color="#ffd090"
        intensity={2.4}
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

      {/* ── Cinematic sky — replaces black space background ── */}
      <Sky
        distance={45000}
        sunPosition={[-0.4, 0.18, -0.5]}
        inclination={0.52}
        azimuth={0.22}
        turbidity={8}
        rayleigh={1.8}
        mieCoefficient={0.006}
        mieDirectionalG={0.82}
      />

      {/* ── Terrain ── */}
      <TerrainMesh />

      {/* ── Ocean + atmospheric haze ── */}
      <OceanPlane />
      <AtmosphericHaze />

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
        minDistance={2.0}
        maxDistance={18}
        maxPolarAngle={Math.PI / 2.05}
        minPolarAngle={0.08}
        panSpeed={1.2}
        rotateSpeed={0.55}
        zoomSpeed={0.9}
        target={[0, 0, 0]}
        screenSpacePanning={false}
      />
    </Canvas>
  );
}
