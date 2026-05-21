"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RefreshCw, Share2, Globe, User, MapPin, Shield, Clock, Sparkles } from "lucide-react";

const SOURCES = [
  { table: "portals", type: "portal", title: (row: any) => row.name, color: "#f59e0b", icon: Globe },
  { table: "universes", type: "universe", title: (row: any) => row.title, color: "#a855f7", icon: Sparkles },
  { table: "characters", type: "character", title: (row: any) => row.name, color: "#3b82f6", icon: User },
  { table: "locations", type: "location", title: (row: any) => row.name, color: "#14b8a6", icon: MapPin },
  { table: "factions", type: "faction", title: (row: any) => row.name, color: "#f97316", icon: Shield },
  { table: "timeline_events", type: "event", title: (row: any) => row.title, color: "#ec4899", icon: Clock },
];

export default function VisualizerPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<any | null>(null);
  const [hoveredNode, setHoveredNode] = useState<any | null>(null);

  const load = async () => {
    setLoading(true);
    const results = await Promise.all(SOURCES.map(async (source) => {
      const { data } = await supabase.from(source.table).select("*").limit(28);
      return (data || []).map((row: any) => ({
        id: `${source.type}-${row.id}`,
        rawId: row.id,
        type: source.type,
        title: source.title(row) || row.id,
        universeId: row.universe_id,
        portalId: row.portal_id || row.universe_type,
        color: source.color,
        icon: source.icon,
      }));
    }));
    setNodes(results.flat());
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const positioned = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    
    // Group nodes by type for orbital arrangement
    const portals = nodes.filter(n => n.type === 'portal');
    const universes = nodes.filter(n => n.type === 'universe');
    const others = nodes.filter(n => !['portal', 'universe'].includes(n.type));
    
    const arranged: any[] = [];
    
    // Add central ORYVON node (largest)
    arranged.push({
      id: 'oryvon-central',
      type: 'central',
      title: 'ORYVON',
      color: '#f59e0b',
      icon: Sparkles,
      x: centerX,
      y: centerY,
      isCentral: true,
      rawId: 0,
    });
    
    // Arrange portals in inner orbit
    portals.forEach((node, index) => {
      const angle = (index / Math.max(portals.length, 1)) * Math.PI * 2;
      arranged.push({
        ...node,
        x: centerX + Math.cos(angle) * 20,
        y: centerY + Math.sin(angle) * 20,
      });
    });
    
    // Arrange universes in middle orbit
    universes.forEach((node, index) => {
      const angle = (index / Math.max(universes.length, 1)) * Math.PI * 2 + (Math.PI / universes.length);
      arranged.push({
        ...node,
        x: centerX + Math.cos(angle) * 32,
        y: centerY + Math.sin(angle) * 32,
      });
    });
    
    // Arrange others in outer orbit
    others.forEach((node, index) => {
      const angle = (index / Math.max(others.length, 1)) * Math.PI * 2 + (Math.PI / 2);
      arranged.push({
        ...node,
        x: centerX + Math.cos(angle) * 42,
        y: centerY + Math.sin(angle) * 42,
      });
    });
    
    return arranged;
  }, [nodes]);

  const links = useMemo(() => {
    const all: any[] = [];
    positioned.forEach((node) => {
      if (node.type === "universe" && node.portalId) {
        const target = positioned.find((n) => n.type === "portal" && (n.rawId === node.portalId || n.title?.toLowerCase() === String(node.portalId).toLowerCase()));
        if (target) all.push({ from: node, to: target, type: 'universe-portal' });
      }
      if (!["portal", "universe", "central"].includes(node.type) && node.universeId) {
        const target = positioned.find((n) => n.type === "universe" && n.rawId === node.universeId);
        if (target) all.push({ from: node, to: target, type: 'content-universe' });
      }
    });
    return all;
  }, [positioned]);

  const getNodeCount = () => {
    const counts: any = {};
    nodes.forEach(node => {
      counts[node.type] = (counts[node.type] || 0) + 1;
    });
    return counts;
  };

  const getConnectedNodes = (node: any) => {
    return links.filter(l => l.from.id === node.id || l.to.id === node.id).length;
  };

  const createCurvedPath = (x1: number, y1: number, x2: number, y2: number) => {
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const controlX = midX + (y2 - y1) * 0.1;
    const controlY = midY - (x2 - x1) * 0.1;
    return `M ${x1} ${y1} Q ${controlX} ${controlY} ${x2} ${y2}`;
  };

  return (
    <div className="flex h-screen bg-[#020101]">
      {/* Main Graph Area */}
      <div className="flex-1 relative overflow-hidden">
        {/* Dark Grid Background */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(245, 158, 11, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 158, 11, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }} />

        {/* Atmospheric Glow Behind Central Node */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-purple-500/5 blur-2xl" />

        {/* Graph Container */}
        <div className="absolute inset-0">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-sm uppercase tracking-widest text-amber-400 animate-pulse">
              Generating neural map...
            </div>
          ) : (
            <>
              {/* Connection Lines */}
              <svg className="absolute inset-0 h-full w-full">
                <defs>
                  <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#fcd34d" stopOpacity="0.8" />
                  </linearGradient>
                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#c084fc" stopOpacity="0.8" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                {links.map((link, index) => (
                  <g key={index}>
                    <path
                      d={createCurvedPath(link.from.x, link.from.y, link.to.x, link.to.y)}
                      fill="none"
                      stroke={link.type === 'universe-portal' ? 'url(#goldGradient)' : 'url(#purpleGradient)'}
                      strokeWidth="1.5"
                      opacity="0.6"
                      filter="url(#glow)"
                    />
                    {/* Particle on line */}
                    {index % 3 === 0 && (
                      <circle
                        r="2"
                        fill={link.type === 'universe-portal' ? '#f59e0b' : '#a855f7'}
                        opacity="0.8"
                      >
                        <animateMotion
                          dur="3s"
                          repeatCount="indefinite"
                          path={createCurvedPath(link.from.x, link.from.y, link.to.x, link.to.y)}
                        />
                      </circle>
                    )}
                  </g>
                ))}
              </svg>

              {/* Nodes */}
              {positioned.map((node) => {
                const Icon = node.icon;
                const isSelected = selected?.id === node.id;
                const isHovered = hoveredNode?.id === node.id;
                const nodeSize = node.isCentral ? 120 : node.type === 'portal' ? 70 : node.type === 'universe' ? 56 : 40;
                
                return (
                  <button
                    key={node.id}
                    onClick={() => setSelected(node)}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group transition-all duration-300"
                    style={{
                      left: `${node.x}%`,
                      top: `${node.y}%`,
                    }}
                  >
                    {/* Node Glow */}
                    <div
                      className="absolute inset-0 rounded-full transition-all duration-300"
                      style={{
                        width: nodeSize,
                        height: nodeSize,
                        background: node.isCentral 
                          ? 'radial-gradient(circle, rgba(245,158,11,0.3) 0%, transparent 70%)'
                          : `radial-gradient(circle, ${node.color}40 0%, transparent 70%)`,
                        transform: isSelected || isHovered ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                    
                    {/* Node Circle */}
                    <div
                      className="relative rounded-full border-2 bg-black/80 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
                      style={{
                        width: nodeSize,
                        height: nodeSize,
                        borderColor: isSelected ? '#f59e0b' : node.color,
                        boxShadow: isSelected 
                          ? `0 0 30px ${node.color}, 0 0 60px ${node.color}40`
                          : isHovered 
                            ? `0 0 20px ${node.color}`
                            : `0 0 10px ${node.color}40`,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                      }}
                    >
                      <Icon 
                        size={node.isCentral ? 32 : node.type === 'portal' ? 20 : node.type === 'universe' ? 16 : 12}
                        color={node.color}
                        className={node.isCentral ? 'text-amber-400' : ''}
                      />
                    </div>

                    {/* Node Label */}
                    <div
                      className="absolute mt-2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        top: nodeSize / 2 + 8,
                      }}
                    >
                      <div className="bg-black/90 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-sm">
                        <div className="text-xs font-mono text-white font-semibold">{node.title}</div>
                        <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider">{node.type}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </>
          )}
        </div>

        {/* Header */}
        <div className="absolute top-6 left-6">
          <h1 className="font-mono text-2xl tracking-widest text-amber-500 font-bold">DATABASE VISUALIZER</h1>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/40">
            Dimensional observatory graph for portals, universes and linked archive entities
          </p>
        </div>

        {/* Rebuild Button */}
        <button 
          onClick={load} 
          className="absolute top-6 right-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-black/60 px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-amber-400 hover:bg-amber-500/10 transition-all backdrop-blur-sm"
        >
          <RefreshCw size={14} /> Rebuild Graph
        </button>

        {/* Bottom Left Stats */}
        <div className="absolute bottom-6 left-6 rounded-xl border border-white/10 bg-black/70 p-4 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-300">
            <Share2 size={14} /> Graph Signal
          </div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-white/35">
            {nodes.length} nodes · {links.length} links
          </div>
        </div>
      </div>

      {/* Right Side Panel - Node Details */}
      {selected && (
        <div className="absolute right-6 top-6 bottom-6 w-80 rounded-2xl border border-amber-500/30 bg-black/80 p-6 backdrop-blur-xl shadow-2xl flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
              Node Details
            </div>
            <button
              onClick={() => setSelected(null)}
              className="text-white/40 hover:text-white transition-colors"
            >
              ×
            </button>
          </div>

          {/* Node Icon */}
          <div className="flex justify-center mb-6">
            <div
              className="w-24 h-24 rounded-full border-2 bg-black/60 backdrop-blur-sm flex items-center justify-center"
              style={{
                borderColor: selected.color,
                boxShadow: `0 0 30px ${selected.color}40`,
              }}
            >
              {React.createElement(selected.icon, { 
                size: 48, 
                color: selected.color 
              })}
            </div>
          </div>

          {/* Node Name */}
          <div className="text-center mb-6">
            <div className="text-2xl font-mono text-white font-semibold tracking-wider">
              {selected.title}
            </div>
            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-white/40">
              {selected.type}
            </div>
          </div>

          {/* Node Stats */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Node ID
              </span>
              <span className="font-mono text-[10px] text-white">
                {selected.rawId}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                Connections
              </span>
              <span className="font-mono text-[10px] text-amber-400">
                {getConnectedNodes(selected)}
              </span>
            </div>
          </div>

          {/* Node Type Counts */}
          <div className="mt-auto">
            <div className="font-mono text-[10px] uppercase tracking-widest text-white/40 mb-3">
              Database Overview
            </div>
            <div className="space-y-2">
              {Object.entries(getNodeCount()).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/10">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
                    {type}
                  </span>
                  <span className="font-mono text-[10px] text-white">
                    {count as number}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
