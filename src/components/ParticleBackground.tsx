"use client";

import React, { useRef, useEffect, useState } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  baseSize: number;
  color: string;
  baseOpacity: number;
  speedX: number;
  speedY: number;
  seed: number;
}

/** Lightweight starfield for non-home routes. Homepage uses HomeBackground only. */
export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX / window.innerWidth - 0.5;
      mouseRef.current.targetY = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animationFrameId = 0;
    let particles: Particle[] = [];
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 180; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.2 + Math.random() * 0.6,
          baseSize: 0.7 + Math.random() * 1.2,
          color: i % 5 === 0 ? "#ffffff" : "#d4a030",
          baseOpacity: 0.1 + Math.random() * 0.2,
          speedX: (Math.random() - 0.5) * 0.04,
          speedY: -(0.04 + Math.random() * 0.08),
          seed: Math.random() * 100,
        });
      }
    };

    initParticles();

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };
    window.addEventListener("resize", handleResize);

    let time = 0;

    const render = () => {
      time += 0.008;
      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.04;
      mouse.y += (mouse.targetY - mouse.y) * 0.04;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const parallaxX = mouse.x * p.z * 40;
        const parallaxY = mouse.y * p.z * 30;
        const finalX = p.x + parallaxX;
        const finalY = p.y + parallaxY;

        const twinkle = 0.92 + Math.sin(time * 1.2 + p.seed) * 0.08;
        const size = p.baseSize * twinkle;
        const opacity = p.baseOpacity * twinkle;

        ctx.beginPath();
        ctx.arc(finalX, finalY, size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = opacity;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [isMounted]);

  if (!isMounted) return null;

  return (
    <div className="fixed inset-0 z-0 pointer-events-none oryvon-gpu-layer opacity-90">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.2) 100%)",
        }}
      />
    </div>
  );
}
