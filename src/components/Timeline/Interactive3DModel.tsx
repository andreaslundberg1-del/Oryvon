"use client";

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';
import { useAudio } from '@/components/AudioManager';

function ModelPrimitive({ type }: { type: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const { playHover } = useAudio();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * (hovered ? 2 : 0.5);
    }
  });

  const handlePointerOver = () => {
    setHover(true);
    playHover();
  };

  if (type === 'football') {
    return (
      <Float speed={2} rotationIntensity={1} floatIntensity={2}>
        <mesh 
          ref={meshRef} 
          onPointerOver={handlePointerOver} 
          onPointerOut={() => setHover(false)}
          scale={hovered ? 1.2 : 1}
        >
          <sphereGeometry args={[1.5, 16, 16]} />
          <meshStandardMaterial color="#ffffff" metalness={0.2} roughness={0.8} wireframe={hovered} />
        </mesh>
      </Float>
    );
  }

  if (type === 'arcade') {
    return (
      <Float speed={3} rotationIntensity={2} floatIntensity={1}>
        <mesh 
          ref={meshRef} 
          onPointerOver={handlePointerOver} 
          onPointerOut={() => setHover(false)}
          scale={hovered ? 1.2 : 1}
        >
          <boxGeometry args={[1.5, 2.5, 1.5]} />
          <meshStandardMaterial color="#ff00ff" emissive={hovered ? "#ff00ff" : "#000"} emissiveIntensity={0.5} wireframe />
        </mesh>
      </Float>
    );
  }

  // Default Cyber shape
  return (
    <Float speed={1.5} rotationIntensity={2} floatIntensity={2}>
      <mesh 
        ref={meshRef} 
        onPointerOver={handlePointerOver} 
        onPointerOut={() => setHover(false)}
        scale={hovered ? 1.2 : 1}
      >
        <icosahedronGeometry args={[1.5, 0]} />
        <MeshDistortMaterial color="#00ffff" envMapIntensity={1} clearcoat={1} clearcoatRoughness={0} metalness={0.5} distort={hovered ? 0.4 : 0.1} speed={5} />
      </mesh>
    </Float>
  );
}

export default function Interactive3DModel({ type = 'cyber', className = '' }: { type?: string, className?: string }) {
  return (
    <div className={`w-64 h-64 cursor-grab active:cursor-grabbing ${className}`}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} color="#ff0000" intensity={2} />
        <ModelPrimitive type={type} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}
