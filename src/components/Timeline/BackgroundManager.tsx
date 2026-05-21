"use client";

import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { YearData } from '@/types/timeline';
import gsap from 'gsap';
import { AnimatePresence, motion } from 'framer-motion';

interface BackgroundManagerProps {
  activeYearData: YearData;
}

function DynamicAtmosphere({ theme }: { theme: YearData['theme'] }) {
  const groupRef = useRef<THREE.Group>(null);
  const color = useMemo(() => new THREE.Color(theme.colors.primary), [theme.colors.primary]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Dynamic Background Elements based on Year Theme */}
      {theme.backgroundAnimation === 'stars' && (
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      )}
      
      {theme.backgroundAnimation === 'grid' && (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <Grid 
            infiniteGrid 
            fadeDistance={50} 
            fadeStrength={5} 
            sectionSize={3} 
            cellSize={1} 
            sectionColor={color} 
            cellColor={color} 
            position={[0, -5, 0]} 
          />
        </Float>
      )}

      {theme.backgroundAnimation === 'geometric' && (
        <group>
          {Array.from({ length: 20 }).map((_, i) => (
            <Float key={i} speed={1} rotationIntensity={2} floatIntensity={2}>
              <mesh position={[Math.random() * 40 - 20, Math.random() * 40 - 20, Math.random() * 40 - 20]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color={color} wireframe transparent opacity={0.2} />
              </mesh>
            </Float>
          ))}
        </group>
      )}

      {/* Dynamic Particles based on Year Theme */}
      {theme.particles && (
        <Sparkles 
          count={theme.particles.count} 
          scale={15} 
          size={theme.particles.type === 'dust' ? 2 : 4} 
          speed={0.3} 
          opacity={0.4} 
          color={theme.particles.color} 
        />
      )}

      {/* Global Ambient Glow */}
      <pointLight position={[10, 10, 10]} color={color} intensity={1} />
      <ambientLight intensity={0.2} />
    </group>
  );
}

export default function BackgroundManager({ activeYearData }: BackgroundManagerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme, year } = activeYearData;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none"
    >
      {/* Background Color Layer */}
      <motion.div 
        initial={false}
        animate={{ backgroundColor: theme.colors.background }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
        className="absolute inset-0"
      />

      {/* Optional Background Image with Crossfade */}
      <AnimatePresence mode="wait">
        {theme.backgroundImage && (
          <motion.div
            key={theme.backgroundImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 bg-cover bg-center mix-blend-screen"
            style={{ backgroundImage: `url(${theme.backgroundImage})` }}
          />
        )}
      </AnimatePresence>

      {/* 3D Scene Layer */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <DynamicAtmosphere theme={theme} />
        </Canvas>
      </div>
      
      {/* Visual Effects Overlays (Scanlines, Grain, etc.) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {theme.backgroundAnimation === 'scanlines' && (
          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
        )}
        
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
      </div>

      {/* Active Year Watermark (Subtle) */}
      <div className="absolute bottom-12 right-12 opacity-5 font-black text-[12vw] pointer-events-none select-none tracking-tighter">
        {year}
      </div>
    </div>
  );
}
