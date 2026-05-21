"use client";

import React, { useEffect, useRef } from 'react';

interface ForegroundParticlesProps {
  type: string;
}

export default function ForegroundParticles({ type }: ForegroundParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    let mouse = { x: -100, y: -100 };
    
    const onMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', onMouseMove);

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        originX: 0,
        originY: 0,
        size: Math.random() * 2 + 0.5,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: type === 'terminal' ? 'rgba(74, 222, 128, 0.3)' : 
               type === 'arcade' ? 'rgba(234, 179, 8, 0.3)' : 
               type === 'cyber' ? 'rgba(168, 85, 247, 0.3)' :
               'rgba(34, 211, 238, 0.2)'
      };
    };

    for (let i = 0; i < 100; i++) {
      particles.push(createParticle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        // Basic movement
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Mouse interaction (repulsion)
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.x -= dx * force * 0.05;
          p.y -= dy * force * 0.05;
        }

        // Screen wrap
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        if (type === 'terminal') {
          // Monospace feel: little squares
          ctx.fillRect(p.x, p.y, p.size, p.size);
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [type]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none opacity-50" />;
}
