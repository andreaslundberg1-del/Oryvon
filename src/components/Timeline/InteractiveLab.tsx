"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface InteractiveLabProps {
  year: number;
}

export default function InteractiveLab({ year }: InteractiveLabProps) {
  const [active, setActive] = useState(false);

  if (year === 1958) {
    return (
      <div className="mt-12 p-8 rounded-3xl bg-black/40 border border-green-500/20 backdrop-blur-xl max-w-2xl mx-auto overflow-hidden relative group">
        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <h3 className="text-green-500 font-mono text-sm tracking-widest uppercase">Temporal Lab: Tennis for Two (1958)</h3>
          </div>
          <button 
            onClick={() => setActive(!active)}
            className="px-4 py-1 rounded-full border border-green-500/30 text-[10px] uppercase tracking-widest text-green-500 hover:bg-green-500/10 transition-all"
          >
            {active ? 'Terminate' : 'Initialize Simulation'}
          </button>
        </div>

        {active ? (
          <PongSimulation />
        ) : (
          <div className="aspect-video flex items-center justify-center border border-green-500/10 rounded-xl bg-black/20">
            <p className="text-green-500/40 font-mono text-xs uppercase tracking-[0.2em]">Awaiting User Initialization...</p>
          </div>
        )}
      </div>
    );
  }

  return null;
}

function PongSimulation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ball = { x: 150, y: 100, dx: 2, dy: 1.5, size: 4 };
    let paddleY = 80;
    let animationId: number;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      paddleY = e.clientY - rect.top - 20;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const draw = () => {
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Oscilloscope grid
      ctx.strokeStyle = 'rgba(74, 222, 128, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw Paddle
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(canvas.width - 10, paddleY, 4, 40);

      // Draw Ball with glow
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#4ade80';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Physics
      ball.x += ball.dx;
      ball.y += ball.dy;

      if (ball.y < 0 || ball.y > canvas.height) ball.dy *= -1;
      if (ball.x < 0) ball.dx *= -1;
      
      // Paddle Collision
      if (ball.x > canvas.width - 15 && ball.y > paddleY && ball.y < paddleY + 40) {
        ball.dx *= -1.1; // Speed up
      }

      if (ball.x > canvas.width) {
        ball.x = 150;
        ball.dx = -2;
      }

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={600} height={300} className="w-full aspect-video border border-green-500/30 rounded-xl cursor-none" />
      <div className="absolute top-4 right-4 text-[10px] font-mono text-green-500/50 uppercase tracking-widest">
        Mouse Control: Manual
      </div>
    </div>
  );
}
