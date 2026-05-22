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

// ─── Middle-earth heightmap generator ─────────────────────────────────────────
// Returns height 0–1 for a normalised (nx, ny) coordinate in [0,1]²
function middleEarthHeight(nx: number, ny: number): number {
  // Base continent shape — falloff from the central landmass
  const cx = nx - 0.48, cy = ny - 0.52;
  const continent = Math.max(0, 1 - Math.sqrt(cx * cx * 1.6 + cy * cy * 1.2) * 1.55);

  // Large-scale terrain
  const macro = fbm(nx * 2.8, ny * 2.8, 5, 0) * 0.55;

  // Misty Mountains — vertical ridge around x=0.48–0.52
  const mmDist = Math.abs(nx - 0.49) * 12 - Math.abs(ny - 0.52) * 0.4;
  const mmRidge = Math.max(0, 1 - mmDist * mmDist * 2.2) * 0.72
    * smoothstep(Math.max(0, Math.min(1, (ny - 0.12) / 0.55)))
    * smoothstep(Math.max(0, Math.min(1, (0.75 - ny) / 0.55)));

  // White Mountains — east-west ridge around y=0.65
  const wmDist = Math.abs(ny - 0.644) * 14 - Math.abs(nx - 0.46) * 0.3;
  const wmRidge = Math.max(0, 1 - wmDist * wmDist * 3.5) * 0.58
    * smoothstep(Math.max(0, Math.min(1, (nx - 0.32) / 0.3)))
    * smoothstep(Math.max(0, Math.min(1, (0.68 - nx) / 0.3)));

  // Grey Mountains — north ridge
  const gmDist = Math.abs(ny - 0.14) * 16;
  const gmRidge = Math.max(0, 1 - gmDist * gmDist * 4) * 0.55
    * smoothstep(Math.max(0, Math.min(1, (nx - 0.38) / 0.32)))
    * smoothstep(Math.max(0, Math.min(1, (0.78 - nx) / 0.32)));

  // Mountains of Mordor — ring around Mordor
  const mordorCx = nx - 0.62, mordorCy = ny - 0.60;
  const mordorRing = Math.abs(Math.sqrt(mordorCx * mordorCx * 2.5 + mordorCy * mordorCy * 2.0) - 0.13);
  const mordorMtn = Math.max(0, 1 - mordorRing * 22) * 0.65;

  // Mordor interior depression (volcanic plateau, slightly elevated)
  const mordorFloor = Math.max(0, 0.28 - Math.sqrt(mordorCx * mordorCx * 3 + mordorCy * mordorCy * 2.5) * 2.2);

  // Mount Doom spike
  const mdx = nx - 0.648, mdy = ny - 0.620;
  const mountDoom = Math.max(0, 1 - Math.sqrt(mdx * mdx + mdy * mdy) * 55) * 1.1;

  // Shire depression (gentle valley)
  const shireCx = nx - 0.205, shireCy = ny - 0.505;
  const shireLow = Math.max(0, 0.12 - Math.sqrt(shireCx * shireCx * 3 + shireCy * shireCy * 3.5) * 1.8);

  // Rohan plain (low elevation)
  const rohanCx = nx - 0.385, rohanCy = ny - 0.585;
  const rohanLow = Math.max(0, 0.08 - Math.sqrt(rohanCx * rohanCx * 2 + rohanCy * rohanCy * 2.5) * 1.2);

  // Fine detail noise
  const detail = fbm(nx * 12, ny * 12, 3, 42) * 0.09;

  const raw = continent * (macro + 0.3)
    + mmRidge + wmRidge + gmRidge + mordorMtn + mordorFloor
    + mountDoom - shireLow - rohanLow + detail;

  return Math.max(0, Math.min(1, raw));
}

// ─── Terrain colour function (height + regional biome) ───────────────────────
function terrainColor(nx: number, ny: number, h: number): THREE.Color {
  const col = new THREE.Color();

  // Ocean
  if (h < 0.05) {
    col.setRGB(
      lerp(0.02, 0.05, h / 0.05),
      lerp(0.06, 0.15, h / 0.05),
      lerp(0.14, 0.30, h / 0.05),
    );
    return col;
  }

  // Shore / beach
  if (h < 0.10) {
    const t = (h - 0.05) / 0.05;
    col.setRGB(lerp(0.30, 0.28, t), lerp(0.26, 0.24, t), lerp(0.16, 0.15, t));
    return col;
  }

  // Regional biome detection
  const mordorCx = nx - 0.62, mordorCy = ny - 0.60;
  const inMordor = Math.sqrt(mordorCx * mordorCx * 2.5 + mordorCy * mordorCy * 2.0) < 0.16;
  const mdx = nx - 0.648, mdy = ny - 0.620;
  const nearDoom = Math.sqrt(mdx * mdx + mdy * mdy) < 0.055;
  const shireCx = nx - 0.205, shireCy = ny - 0.505;
  const inShire = Math.sqrt(shireCx * shireCx * 3 + shireCy * shireCy * 3.5) < 0.19;
  const rohanCx = nx - 0.385, rohanCy = ny - 0.585;
  const inRohan = Math.sqrt(rohanCx * rohanCx * 2 + rohanCy * rohanCy * 2.5) < 0.22;
  const mirkCx = nx - 0.55, mirkCy = ny - 0.345;
  const inMirkwood = Math.sqrt(mirkCx * mirkCx * 2 + mirkCy * mirkCy * 0.9) < 0.16;
  const gondCx = nx - 0.45, gondCy = ny - 0.665;
  const inGondor = Math.sqrt(gondCx * gondCx * 2 + gondCy * gondCy * 2.5) < 0.19;

  // Snow line
  if (h > 0.72) {
    const t = Math.min(1, (h - 0.72) / 0.12);
    if (nearDoom) {
      col.setRGB(lerp(0.45, 0.15, t), lerp(0.12, 0.04, t), lerp(0.04, 0.01, t));
    } else {
      col.setRGB(lerp(0.72, 0.95, t), lerp(0.70, 0.93, t), lerp(0.62, 0.92, t));
    }
    return col;
  }

  // High rock
  if (h > 0.52) {
    const t = (h - 0.52) / 0.20;
    if (inMordor || nearDoom) {
      col.setRGB(lerp(0.22, 0.12, t), lerp(0.08, 0.04, t), lerp(0.04, 0.02, t));
    } else {
      col.setRGB(lerp(0.42, 0.56, t), lerp(0.38, 0.52, t), lerp(0.30, 0.44, t));
    }
    return col;
  }

  // Mid-elevation terrain — biome blends
  const t = (h - 0.10) / 0.42;

  if (inMordor) {
    // Volcanic black/ash plateau
    if (nearDoom) {
      col.setRGB(lerp(0.35, 0.18, t), lerp(0.10, 0.05, t), lerp(0.03, 0.01, t));
    } else {
      col.setRGB(lerp(0.20, 0.12, t), lerp(0.08, 0.05, t), lerp(0.04, 0.02, t));
    }
    return col;
  }

  if (inShire) {
    // Rich greens
    col.setRGB(lerp(0.20, 0.28, t), lerp(0.42, 0.52, t), lerp(0.12, 0.16, t));
    return col;
  }

  if (inRohan) {
    // Amber grasslands
    col.setRGB(lerp(0.48, 0.56, t), lerp(0.44, 0.50, t), lerp(0.18, 0.22, t));
    return col;
  }

  if (inMirkwood) {
    // Dense dark forest
    col.setRGB(lerp(0.08, 0.12, t), lerp(0.16, 0.22, t), lerp(0.06, 0.10, t));
    return col;
  }

  if (inGondor) {
    // Stone grey-green
    col.setRGB(lerp(0.30, 0.40, t), lerp(0.34, 0.44, t), lerp(0.22, 0.32, t));
    return col;
  }

  // Default — temperate land
  col.setRGB(lerp(0.22, 0.38, t), lerp(0.34, 0.46, t), lerp(0.14, 0.22, t));
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

      {/* Mount Doom emissive cone overlay */}
      <mesh position={[1.48, 2.35, 0.54]} castShadow>
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
      <pointLight position={[1.48, 2.7, 0.54]} color="#ff6600" intensity={3.5} distance={1.8} decay={2} />
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
      {/* Mordor underlight — very subtle orange bleed */}
      <pointLight position={[1.5, 0.5, 0.6]} color="#ff5500" intensity={1.2} distance={3.0} decay={2} />

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
