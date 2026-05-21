"use client";
import React, { useEffect, useRef } from "react";

export type PortalTheme = "gaming" | "cinema" | "sport";

function drawGaming(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  // Deep night city bg
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#000818");
  bg.addColorStop(1, "#001428");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Rain streaks
  ctx.strokeStyle = "rgba(34,211,238,0.18)";
  ctx.lineWidth = 0.5;
  for (let i = 0; i < 40; i++) {
    const x = ((i * 73 + t * 80) % w);
    const y = ((i * 37 + t * 200) % h);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x - 1, y + 14);
    ctx.stroke();
  }

  // Neon building silhouettes
  ctx.fillStyle = "#000f1e";
  const buildings = [0.05,0.12,0.2,0.3,0.38,0.5,0.6,0.72,0.82,0.9];
  buildings.forEach((bx, i) => {
    const bh = 0.25 + (i % 3) * 0.12;
    const bw = 0.06 + (i % 2) * 0.04;
    ctx.fillRect(bx * w, h * (1 - bh), bw * w, h * bh);
    // neon window lights
    ctx.fillStyle = `rgba(34,211,238,${0.4 + Math.sin(t + i) * 0.2})`;
    for (let wy = 0; wy < 5; wy++) {
      ctx.fillRect(bx * w + 4, h * (1 - bh) + 8 + wy * 12, 3, 4);
    }
    ctx.fillStyle = "#000f1e";
  });

  // Central glow
  const glow = ctx.createRadialGradient(w/2, h*0.7, 0, w/2, h*0.7, w*0.5);
  glow.addColorStop(0, "rgba(34,211,238,0.12)");
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, w, h);

  // Floating energy orbs
  for (let i = 0; i < 6; i++) {
    const ox = w * (0.2 + 0.12 * i) + Math.sin(t * 0.8 + i) * 8;
    const oy = h * 0.5 + Math.cos(t * 0.6 + i * 1.3) * 20;
    const og = ctx.createRadialGradient(ox, oy, 0, ox, oy, 5);
    og.addColorStop(0, "rgba(34,211,238,0.9)");
    og.addColorStop(1, "transparent");
    ctx.fillStyle = og;
    ctx.beginPath();
    ctx.arc(ox, oy, 5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawCinema(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0d0500");
  bg.addColorStop(1, "#1a0800");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Lava glow at base
  const lava = ctx.createRadialGradient(w/2, h, 0, w/2, h, w * 0.8);
  lava.addColorStop(0, "rgba(255,80,0,0.35)");
  lava.addColorStop(0.4, "rgba(200,40,0,0.15)");
  lava.addColorStop(1, "transparent");
  ctx.fillStyle = lava;
  ctx.fillRect(0, 0, w, h);

  // Volcanic smoke particles
  for (let i = 0; i < 20; i++) {
    const px = w * (0.1 + 0.04 * i) + Math.sin(t * 0.3 + i) * 12;
    const py = h - (((t * 18 + i * 25) % h));
    const pr = 6 + (i % 4) * 4;
    const smoke = ctx.createRadialGradient(px, py, 0, px, py, pr);
    smoke.addColorStop(0, `rgba(120,60,20,${0.2 - (py / h) * 0.15})`);
    smoke.addColorStop(1, "transparent");
    ctx.fillStyle = smoke;
    ctx.beginPath();
    ctx.arc(px, py, pr, 0, Math.PI * 2);
    ctx.fill();
  }

  // Ancient pillar silhouettes
  ctx.fillStyle = "#0a0300";
  [[0.08, 0.6], [0.22, 0.45], [0.75, 0.5], [0.88, 0.65]].forEach(([bx, bh]) => {
    ctx.fillRect(bx * w, h * (1 - bh), w * 0.06, h * bh);
  });

  // Embers floating up
  for (let i = 0; i < 15; i++) {
    const ex = w * (0.15 + 0.05 * i) + Math.sin(t + i * 2.1) * 10;
    const ey = h - ((t * 30 + i * 20) % h);
    ctx.fillStyle = `rgba(255,${100 + i * 5},0,${0.6 + Math.sin(t + i) * 0.3})`;
    ctx.beginPath();
    ctx.arc(ex, ey, 1.5, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSport(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  ctx.clearRect(0, 0, w, h);
  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#000d06");
  bg.addColorStop(1, "#001a0a");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Forest glow
  const forest = ctx.createRadialGradient(w/2, h*0.6, 0, w/2, h*0.6, w*0.7);
  forest.addColorStop(0, "rgba(16,185,129,0.15)");
  forest.addColorStop(1, "transparent");
  ctx.fillStyle = forest;
  ctx.fillRect(0, 0, w, h);

  // Ancient ruins silhouette
  ctx.fillStyle = "#000f05";
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(0, h * 0.55);
  ctx.lineTo(w * 0.15, h * 0.4);
  ctx.lineTo(w * 0.18, h * 0.3);
  ctx.lineTo(w * 0.21, h * 0.4);
  ctx.lineTo(w * 0.35, h * 0.5);
  ctx.lineTo(w * 0.5, h * 0.35);
  ctx.lineTo(w * 0.65, h * 0.5);
  ctx.lineTo(w * 0.79, h * 0.4);
  ctx.lineTo(w * 0.82, h * 0.3);
  ctx.lineTo(w * 0.85, h * 0.4);
  ctx.lineTo(w, h * 0.55);
  ctx.lineTo(w, h);
  ctx.closePath();
  ctx.fill();

  // Glowing spores / fireflies
  for (let i = 0; i < 25; i++) {
    const fx = w * (0.1 + 0.035 * i) + Math.sin(t * 0.5 + i) * 15;
    const fy = h * 0.3 + Math.cos(t * 0.4 + i * 1.7) * h * 0.3;
    const alpha = 0.4 + Math.sin(t * 1.5 + i) * 0.35;
    const fg = ctx.createRadialGradient(fx, fy, 0, fx, fy, 4);
    fg.addColorStop(0, `rgba(52,211,153,${alpha})`);
    fg.addColorStop(1, "transparent");
    ctx.fillStyle = fg;
    ctx.beginPath();
    ctx.arc(fx, fy, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Mist ground layer
  const mist = ctx.createLinearGradient(0, h * 0.75, 0, h);
  mist.addColorStop(0, "transparent");
  mist.addColorStop(1, "rgba(16,185,129,0.08)");
  ctx.fillStyle = mist;
  ctx.fillRect(0, h * 0.75, w, h * 0.25);
}

export default function PortalWorld({ theme, className = "" }: { theme: PortalTheme; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;
    let start: number | null = null;

    const frame = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      if (theme === "gaming") drawGaming(ctx, t, w, h);
      else if (theme === "cinema") drawCinema(ctx, t, w, h);
      else drawSport(ctx, t, w, h);
      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={420}
      className={`absolute inset-0 w-full h-full object-cover ${className}`}
      style={{ borderRadius: "inherit" }}
    />
  );
}
