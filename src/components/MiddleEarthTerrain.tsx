'use client';

import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';

// ─── Seeded pseudo-random (deterministic, no Math.random in render) ───────────
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

// ─── Smoothstep / interpolation helpers ───────────────────────────────────────
function smoothstep(t: number) { return t * t * (3 - 2 * t); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

// ─── Simple value-noise (deterministic) ───────────────────────────────────────
function valueNoise(x: number, y: number, seed: number): number {
  const rng = seededRandom(seed);
  const table: number[] = [];
  for (let i = 0; i < 256; i++) table.push(rng());
  const hash = (xi: number, yi: number) => {
    const idx = ((xi & 255) + (yi & 255) * 57) & 255;
    return table[idx];
  };
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const tx = smoothstep(xf), ty = smoothstep(yf);
  return lerp(
    lerp(hash(xi, yi), hash(xi + 1, yi), tx),
    lerp(hash(xi, yi + 1), hash(xi + 1, yi + 1), tx),
    ty,
  );
}

// ─── Fractal brownian motion ───────────────────────────────────────────────────
function fbm(x: number, y: number, octaves: number, seed: number): number {
  let v = 0, amp = 0.5, freq = 1, max = 0;
  for (let i = 0; i < octaves; i++) {
    v += amp * valueNoise(x * freq, y * freq, seed + i * 1337);
    max += amp;
    amp *= 0.5;
    freq *= 2.1;
  }
  return v / max;
}

// ─── Signed-distance ridge helper ─────────────────────────────────────────────
// Returns height contribution for a ridge defined by a polyline of control points.
// Each segment contributes a ridge falloff; the max across segments is returned.
function polylineRidge(
  nx: number, ny: number,
  pts: [number, number][],
  width: number,     // half-width in normalised coords
  height: number,    // peak height contribution
  taper = 0.0,       // 0=uniform, >0 narrows toward end
): number {
  let best = 0;
  for (let i = 0; i < pts.length - 1; i++) {
    const [ax, ay] = pts[i];
    const [bx, by] = pts[i + 1];
    const dx = bx - ax, dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = Math.max(0, Math.min(1, ((nx - ax) * dx + (ny - ay) * dy) / len2));
    const px = ax + t * dx, py = ay + t * dy;
    const dist = Math.sqrt((nx - px) * (nx - px) + (ny - py) * (ny - py));
    const segW = width * (1 - taper * t);
    const v = Math.max(0, 1 - dist / segW);
    best = Math.max(best, v * v * height);
  }
  return best;
}

// ─── Point-ridge helper (isolated peak) ───────────────────────────────────────
function pointRidge(nx: number, ny: number, px: number, py: number, radius: number, h: number): number {
  const d = Math.sqrt((nx - px) * (nx - px) + (ny - py) * (ny - py));
  return Math.max(0, 1 - d / radius) * h;
}

// ─── Middle-earth heightmap — geographically accurate ─────────────────────────
//
// Coordinate system (matches MAP_LOCATIONS x/y percentages):
//   nx = x/100  (0=west, 1=east)
//   ny = y/100  (0=north, 1=south)
//
// Key landmarks calibrated to MAP_LOCATIONS:
//   Shire       (0.17, 0.52)  — NW lowlands
//   Bree        (0.22, 0.46)  — Weatherhills foothills
//   Rivendell   (0.31, 0.40)  — notch in Misty Mtns west side
//   Misty Mtns  spine ~nx=0.37 from ny=0.18 to ny=0.70
//   Lothlórien  (0.40, 0.51)  — east of MM, river confluence, low wooded
//   Rohan       (0.33, 0.62)  — wide plains south of MM
//   Minas Tirith(0.45, 0.65)  — foot of White Mtns, Gondor
//   Mirkwood    (0.55, 0.33)  — long N-S dark forest east of MM
//   Mordor      (0.63, 0.60)  — SE, volcanic plateau ringed by mountains
//   Mount Doom  (0.67, 0.63)  — inside Mordor
//   Barad-dûr   (0.63, 0.57)  — NW inside Mordor ring

function middleEarthHeight(nx: number, ny: number): number {

  // ── 1. Continent / ocean mask ──────────────────────────────────────────────
  // The landmass occupies roughly nx 0.10–0.82, ny 0.08–0.88
  // Western coast curves in at north and south; eastern edge is rougher.
  // We approximate with a rounded polygon via SDF.
  const coastNoise = fbm(nx * 4.5, ny * 4.5, 3, 7) * 0.045;
  const coastX = nx + coastNoise;
  const coastY = ny + coastNoise * 0.6;

  // West coast: roughly at nx=0.10–0.13, curving in
  const westEdge = 0.10 + Math.sin(coastY * Math.PI) * 0.03;
  // East edge: rougher, at nx~0.80
  const eastEdge = 0.80 + coastNoise * 0.5;
  // North edge: ny~0.08
  const northEdge = 0.07 + coastNoise * 0.3;
  // South edge: ny~0.88
  const southEdge = 0.89 + coastNoise * 0.3;

  const onLand = coastX > westEdge && coastX < eastEdge
    && coastY > northEdge && coastY < southEdge;
  if (!onLand) return 0.0;

  // Distance-from-coast falloff so shores are low
  const distW = Math.max(0, coastX - westEdge);
  const distE = Math.max(0, eastEdge - coastX);
  const distN = Math.max(0, coastY - northEdge);
  const distS = Math.max(0, southEdge - coastY);
  const coastDist = Math.min(distW, distE, distN, distS);
  const coastFalloff = Math.min(1, coastDist / 0.08);

  // Gulf of Lhûn — indent from west coast around ny=0.26–0.34
  const gulfY = ny - 0.30, gulfX = nx - 0.14;
  const gulfDepth = Math.max(0, 0.07 - Math.abs(gulfY) * 1.8) * Math.max(0, 0.06 - gulfX);
  const gulfMask = 1 - Math.min(1, gulfDepth * 20);

  // Bay of Belfalas — southern indent around nx=0.30–0.45, ny~0.82
  const bayX = nx - 0.37, bayY = ny - 0.83;
  const bayDepth = Math.max(0, 0.06 - Math.sqrt(bayX * bayX * 2 + bayY * bayY * 3)) * 12;
  const bayMask = 1 - Math.min(1, bayDepth);

  const landBase = coastFalloff * gulfMask * bayMask;

  // ── 2. Large-scale macro terrain (gentle rolling) ─────────────────────────
  const macro = fbm(nx * 3.2, ny * 3.2, 5, 11) * 0.28 + 0.12;

  // ── 3. MISTY MOUNTAINS — long N-S spine, nx≈0.36–0.40, ny=0.16 to 0.72 ──
  // Slightly curved — bows east in the middle (around Moria/Lothlórien)
  const mmPts: [number, number][] = [
    [0.375, 0.17], [0.373, 0.23], [0.368, 0.30],
    [0.370, 0.37], // near Rivendell — a notch/pass
    [0.375, 0.43], [0.382, 0.50], [0.385, 0.57],
    [0.382, 0.63], [0.375, 0.70],
  ];
  // Add Rivendell pass notch: lower the ridge slightly at the pass latitude
  const rivendellPassFactor = 1 - Math.max(0, 1 - Math.abs(ny - 0.38) / 0.04) * 0.55;
  const mmRidge = polylineRidge(nx, ny, mmPts, 0.038, 0.78) * rivendellPassFactor;

  // ── 4. WHITE MOUNTAINS — E-W arc, southern Gondor, ny≈0.66–0.69 ──────────
  // Curve from nx=0.27 (west coast foothills) arcing slightly north to nx=0.58
  const wmPts: [number, number][] = [
    [0.27, 0.68], [0.32, 0.67], [0.38, 0.665],
    [0.44, 0.663], [0.50, 0.665], [0.56, 0.67],
  ];
  const wmRidge = polylineRidge(nx, ny, wmPts, 0.030, 0.62);

  // ── 5. GREY MOUNTAINS — E-W, far north, ny≈0.15–0.18, nx=0.44 to 0.70 ──
  const gmPts: [number, number][] = [
    [0.44, 0.17], [0.52, 0.155], [0.60, 0.15], [0.68, 0.16],
  ];
  const gmRidge = polylineRidge(nx, ny, gmPts, 0.028, 0.55);

  // ── 6. ERED MITHRIN / Iron Hills fringe — NE of Mirkwood ─────────────────
  const ironPts: [number, number][] = [
    [0.64, 0.20], [0.70, 0.22], [0.75, 0.25],
  ];
  const ironRidge = polylineRidge(nx, ny, ironPts, 0.025, 0.42);

  // ── 7. MORDOR RING — three mountain chains surrounding Mordor ─────────────
  // Ephel Dúath (west wall): N-S, nx≈0.57, ny=0.50–0.72
  const ephelPts: [number, number][] = [
    [0.575, 0.50], [0.578, 0.55], [0.580, 0.60],
    [0.578, 0.65], [0.574, 0.70],
  ];
  const ephelRidge = polylineRidge(nx, ny, ephelPts, 0.026, 0.68);

  // Ered Lithui (north wall): E-W, ny≈0.52, nx=0.58–0.76
  const eredPts: [number, number][] = [
    [0.585, 0.520], [0.62, 0.515], [0.66, 0.512],
    [0.70, 0.516], [0.74, 0.522],
  ];
  const eredRidge = polylineRidge(nx, ny, eredPts, 0.022, 0.60);

  // ── 8. MORDOR INTERIOR — ash plateau ──────────────────────────────────────
  const mordorInside =
    nx > 0.585 && nx < 0.75 &&
    ny > 0.525 && ny < 0.73 &&
    nx > 0.585 + (ny - 0.525) * 0.15; // diagonal SE corner cutoff
  const mordorPlateau = mordorInside ? 0.22 + fbm(nx * 8, ny * 8, 3, 99) * 0.06 : 0;

  // ── 9. MOUNT DOOM — spike inside Mordor ───────────────────────────────────
  const mountDoom = pointRidge(nx, ny, 0.670, 0.630, 0.022, 1.05);

  // ── 10. RHÛN / Eastern highlands — gentle rise toward east ───────────────
  const eastRise = Math.max(0, nx - 0.72) * 0.8 * smoothstep(Math.min(1, Math.max(0, (ny - 0.15) / 0.6)));

  // ── 11. WEATHER HILLS — small range east of Bree/Shire ───────────────────
  const whPts: [number, number][] = [
    [0.24, 0.38], [0.27, 0.41], [0.28, 0.44],
  ];
  const weatherRidge = polylineRidge(nx, ny, whPts, 0.018, 0.30);

  // ── 12. EMYN MUIL — rocky hills above Rohan/Lothlórien ───────────────────
  const emynPts: [number, number][] = [
    [0.42, 0.56], [0.44, 0.57], [0.46, 0.575],
  ];
  const emynRidge = polylineRidge(nx, ny, emynPts, 0.020, 0.28);

  // ── 13. MINAS TIRITH / Mount Mindolluin ───────────────────────────────────
  const mindollin = pointRidge(nx, ny, 0.453, 0.648, 0.018, 0.38);

  // ── 14. DEPRESSION ZONES — valleys, plains ────────────────────────────────
  // The Shire: gentle rolling lowlands
  const shireDip = Math.max(0, 0.10 - Math.sqrt(
    (nx - 0.17) * (nx - 0.17) * 2.5 + (ny - 0.52) * (ny - 0.52) * 2.0
  ) * 1.6);

  // Rohan plains — very flat
  const rohanDip = Math.max(0, 0.12 - Math.sqrt(
    (nx - 0.33) * (nx - 0.33) * 1.6 + (ny - 0.62) * (ny - 0.62) * 2.2
  ) * 1.4);

  // Anduin vale — narrow low corridor between MM and Mordor ring
  const anduinX = nx - 0.455, anduinY = ny - 0.58;
  const anduinVale = Math.max(0, 0.08 - Math.abs(anduinX) * 5) * Math.max(0, 1 - Math.abs(anduinY) * 3);

  // Lothlórien — the golden wood, flat wooded
  const lórienDip = Math.max(0, 0.06 - Math.sqrt(
    (nx - 0.40) * (nx - 0.40) * 3 + (ny - 0.51) * (ny - 0.51) * 3
  ) * 2.0);

  // ── 15. FINE DETAIL ───────────────────────────────────────────────────────
  const detail = fbm(nx * 14, ny * 14, 3, 42) * 0.055;
  const medDetail = fbm(nx * 7, ny * 7, 2, 77) * 0.04;

  // ── Composite ─────────────────────────────────────────────────────────────
  const ridges = mmRidge + wmRidge + gmRidge + gmRidge * 0.3
    + ironRidge + ephelRidge + eredRidge
    + weatherRidge + emynRidge + mindollin;

  const raw = landBase * (macro + ridges * 0.15 + mordorPlateau * 0.5)
    + ridges
    + mordorPlateau
    + mountDoom
    + eastRise * landBase
    - shireDip - rohanDip - anduinVale - lórienDip
    + detail + medDetail;

  return Math.max(0, Math.min(1, raw));
}

// ─── Biome helpers ────────────────────────────────────────────────────────────
function inEllipse(nx: number, ny: number, cx: number, cy: number, rx: number, ry: number): boolean {
  const dx = (nx - cx) / rx, dy = (ny - cy) / ry;
  return dx * dx + dy * dy < 1;
}

// ─── Terrain colour function — geographically accurate biomes ────────────────
function terrainColor(nx: number, ny: number, h: number): THREE.Color {
  const col = new THREE.Color();

  // ── Ocean & shore ──
  if (h <= 0.0) {
    col.setRGB(0.02, 0.07, 0.16);
    return col;
  }
  if (h < 0.055) {
    const t = h / 0.055;
    col.setRGB(lerp(0.03, 0.22, t), lerp(0.10, 0.20, t), lerp(0.22, 0.14, t));
    return col;
  }
  if (h < 0.10) {
    const t = (h - 0.055) / 0.045;
    col.setRGB(lerp(0.32, 0.29, t), lerp(0.27, 0.25, t), lerp(0.16, 0.14, t));
    return col;
  }

  // ── Biome detection (geographic zones, not height-only) ──
  // Mordor interior — SE volcanic plateau
  const inMordor = nx > 0.590 && nx < 0.750 && ny > 0.530 && ny < 0.730
    && nx > 0.590 + (ny - 0.530) * 0.12;

  // Near Mount Doom
  const nearDoom = Math.sqrt((nx - 0.670) * (nx - 0.670) + (ny - 0.630) * (ny - 0.630)) < 0.045;

  // Ephel Dúath / Mordor mountain ring (dark volcanic rock)
  const nearMordorMtn = Math.sqrt((nx - 0.580) * (nx - 0.580) * 1.5 + (ny - 0.61) * (ny - 0.61)) < 0.15
    && !inMordor;

  // The Shire — lush green rolling hills
  const inShire = inEllipse(nx, ny, 0.165, 0.520, 0.080, 0.070);

  // Arnor / Eriador — temperate north-west
  const inEriador = nx < 0.38 && ny > 0.20 && ny < 0.62 && !inShire;

  // Rohan — wide open amber plains
  const inRohan = nx > 0.24 && nx < 0.48 && ny > 0.595 && ny < 0.695
    && !inMordor
    // keep south of White Mountains
    && !(nx > 0.27 && nx < 0.56 && ny > 0.655 && ny < 0.695);

  // Gondor — grey-green foothills south of White Mtns
  const inGondor = nx > 0.27 && nx < 0.58 && ny > 0.68 && ny < 0.84 && !inMordor;

  // Lothlórien — flat golden wooded vale
  const inLórien = inEllipse(nx, ny, 0.400, 0.510, 0.045, 0.038);

  // Mirkwood — long dark forest
  const inMirkwood = nx > 0.47 && nx < 0.63 && ny > 0.18 && ny < 0.53
    && !inMordor
    // avoid the mountains
    && !(nx < 0.39);

  // Rhûn / far east steppe
  const inRhun = nx > 0.73 && ny > 0.18 && ny < 0.62;

  // Harad — hot southern desert
  const inHarad = ny > 0.78 && !inGondor;

  // ── Snow / high rock (height-based, overrides biome) ──
  if (h > 0.75) {
    const t = Math.min(1, (h - 0.75) / 0.10);
    if (inMordor || nearDoom) {
      col.setRGB(lerp(0.40, 0.10, t), lerp(0.08, 0.03, t), lerp(0.02, 0.01, t));
    } else {
      col.setRGB(lerp(0.75, 0.96, t), lerp(0.73, 0.95, t), lerp(0.65, 0.94, t));
    }
    return col;
  }
  if (h > 0.54) {
    const t = (h - 0.54) / 0.21;
    if (inMordor || nearDoom || nearMordorMtn) {
      col.setRGB(lerp(0.20, 0.10, t), lerp(0.06, 0.03, t), lerp(0.03, 0.01, t));
    } else {
      col.setRGB(lerp(0.44, 0.60, t), lerp(0.40, 0.55, t), lerp(0.32, 0.46, t));
    }
    return col;
  }

  // ── Mid-elevation biome colours ──
  const t = Math.max(0, Math.min(1, (h - 0.10) / 0.44));

  if (nearDoom) {
    col.setRGB(lerp(0.42, 0.26, t), lerp(0.10, 0.06, t), lerp(0.02, 0.01, t));
    return col;
  }
  if (inMordor) {
    col.setRGB(lerp(0.16, 0.10, t), lerp(0.06, 0.04, t), lerp(0.03, 0.01, t));
    return col;
  }
  if (inShire) {
    col.setRGB(lerp(0.18, 0.30, t), lerp(0.44, 0.54, t), lerp(0.10, 0.16, t));
    return col;
  }
  if (inLórien) {
    col.setRGB(lerp(0.30, 0.42, t), lerp(0.48, 0.56, t), lerp(0.12, 0.18, t));
    return col;
  }
  if (inMirkwood) {
    col.setRGB(lerp(0.06, 0.11, t), lerp(0.13, 0.20, t), lerp(0.05, 0.08, t));
    return col;
  }
  if (inRohan) {
    col.setRGB(lerp(0.50, 0.60, t), lerp(0.46, 0.52, t), lerp(0.18, 0.24, t));
    return col;
  }
  if (inGondor) {
    col.setRGB(lerp(0.28, 0.40, t), lerp(0.32, 0.44, t), lerp(0.20, 0.30, t));
    return col;
  }
  if (inHarad) {
    col.setRGB(lerp(0.60, 0.70, t), lerp(0.48, 0.55, t), lerp(0.22, 0.28, t));
    return col;
  }
  if (inRhun) {
    col.setRGB(lerp(0.50, 0.58, t), lerp(0.44, 0.50, t), lerp(0.24, 0.30, t));
    return col;
  }
  if (inEriador) {
    col.setRGB(lerp(0.24, 0.36, t), lerp(0.38, 0.48, t), lerp(0.14, 0.20, t));
    return col;
  }
  // Default temperate
  col.setRGB(lerp(0.22, 0.36, t), lerp(0.35, 0.46, t), lerp(0.14, 0.22, t));
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
      const elev = h < 0.05 ? 0 : h * 2.4;
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

      {/* Mount Doom emissive cone overlay — position matches nx=0.670,ny=0.630 */}
      <mesh position={[1.70, 2.40, 0.595]} castShadow>
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
      <pointLight position={[1.70, 2.85, 0.595]} color="#ff6600" intensity={3.5} distance={1.8} decay={2} />
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
  const y = (h < 0.05 ? 0 : h * 2.4) + 0.08;

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
    camera.position.set(0, 6.5, 4.8);
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
      <pointLight position={[1.55, 0.5, 0.53]} color="#ff5500" intensity={1.2} distance={3.0} decay={2} />

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
