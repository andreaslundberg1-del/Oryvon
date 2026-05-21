'use client';

import React, { useState, useRef, useEffect } from 'react';
import { type FamilyNode } from '@/data/universeRegistry';

interface CinematicFamilyTreeProps {
  title: string;
  members: FamilyNode[];
  onViewCharacter: (charId: string) => void;
  accentColor: string;
}

export default function CinematicFamilyTree({
  title,
  members,
  onViewCharacter,
  accentColor,
}: CinematicFamilyTreeProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedMember, setSelectedMember] = useState<FamilyNode | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Set default selected member on load (typically Tier 2 or first member)
  useEffect(() => {
    if (members.length > 0) {
      const main = members.find((m) => m.tier === 2) || members[0];
      setSelectedMember(main);
    }
  }, [members]);

  const handleZoom = (dir: 'in' | 'out') => {
    setZoom((z) => Math.max(0.6, Math.min(1.8, dir === 'in' ? z + 0.15 : z - 0.15)));
  };

  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Mouse Dragging to Pan
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Touch panning support
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - pan.x, y: t.clientY - pan.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    setPan({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  // Tiers grouping
  const tier1 = members.filter((m) => m.tier === 1);
  const tier2 = members.filter((m) => m.tier === 2);
  const tier3 = members.filter((m) => m.tier === 3);

  // Render a visual connector lines layer
  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Tab Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[8px] uni-text tracking-[0.3em] uppercase">
            ORYVON GENEALOGY ARCHIVE
          </span>
          <h2
            className="text-xl md:text-2xl font-normal tracking-wide text-white uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {title}
          </h2>
          <p className="font-mono text-[9px] text-white/45 tracking-wider">
            Interconnected lineages & royal house bloodlines
          </p>
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right font-mono text-[8px] text-white/35 mr-1 uppercase">
            <span>Dynamic Viewport</span>
            <span className="uni-text-dim">{Math.round(zoom * 100)}% scale</span>
          </div>
          <button
            onClick={() => handleZoom('in')}
            className="w-10 h-10 rounded-lg border border-white/10 uni-border-hover bg-black/50 text-white/70 uni-text-hover transition-colors flex items-center justify-center font-mono text-sm cursor-none"
            title="Zoom In"
          >
            ＋
          </button>
          <button
            onClick={() => handleZoom('out')}
            className="w-10 h-10 rounded-lg border border-white/10 uni-border-hover bg-black/50 text-white/70 uni-text-hover transition-colors flex items-center justify-center font-mono text-sm cursor-none"
            title="Zoom Out"
          >
            －
          </button>
          <button
            onClick={handleReset}
            className="px-4 h-10 rounded-lg border border-white/10 uni-border-hover bg-black/50 text-white/70 uni-text-hover transition-colors flex items-center justify-center font-mono text-xs cursor-none"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        {/* Tree viewport panel */}
        <div
          ref={containerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleMouseUpOrLeave}
          className={`lg:col-span-2 relative h-[560px] rounded-xl border border-white/5 uni-border overflow-hidden bg-[#070608] shadow-[0_24px_80px_rgba(0,0,0,0.65)] ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
        >
          {/* Subtle atmosphere dust overlays */}
          <div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7), inset 0 0 24px rgba(0,0,0,0.4)',
            }}
          />

          {/* Guidelines info */}
          <div className="absolute bottom-4 left-4 z-30 pointer-events-none flex flex-col gap-0.5">
            <span className="font-mono text-[7px] text-white/25 tracking-widest uppercase">
              Drag to pan · Hover for stats · Click to inspect bloodline
            </span>
          </div>

          {/* Interactive Tree Root Container */}
          <div
            className="absolute w-full h-full flex flex-col items-center justify-center origin-center"
            style={{
              transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
              transition: isDragging ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)',
            }}
          >
            {/* Beautiful node connections (SVG overlay lines) */}
            <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center">
              <svg className="w-full h-full absolute inset-0 opacity-20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--uni-accent)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="var(--uni-accent)" stopOpacity="0.9" />
                  </linearGradient>
                </defs>
                {/* Connectors tier 1 to tier 2 */}
                <line x1="50%" y1="28%" x2="50%" y2="40%" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3,3" />
                {/* Spouse tier 1 link */}
                {tier1.length >= 2 && (
                  <line x1="38%" y1="18%" x2="62%" y2="18%" stroke="url(#goldGrad)" strokeWidth="1.5" />
                )}
                {/* Connectors tier 2 to tier 3 */}
                <line x1="50%" y1="62%" x2="50%" y2="70%" stroke="url(#goldGrad)" strokeWidth="1.5" strokeDasharray="3,3" />
                {/* Spouse tier 2 link */}
                {tier2.length >= 2 && (
                  <line x1="38%" y1="50%" x2="62%" y2="50%" stroke="url(#goldGrad)" strokeWidth="1.5" />
                )}
                {/* Children horizontal branch line */}
                {tier3.length > 1 && (
                  <line x1="22%" y1="70%" x2="78%" y2="70%" stroke="url(#goldGrad)" strokeWidth="1.5" />
                )}
                {/* Verticals to children */}
                {tier3.map((child, idx) => {
                  const pct = 22 + (idx / (tier3.length - 1 || 1)) * 56;
                  return (
                    <line
                      key={child.id}
                      x1={`${pct}%`}
                      y1="70%"
                      x2={`${pct}%`}
                      y2="80%"
                      stroke="url(#goldGrad)"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            </div>

            {/* Tree Nodes Columns layout */}
            <div className="relative z-10 flex flex-col gap-24 items-center w-full">
              {/* TIER 1: Parents / Grandparents */}
              <div className="flex gap-16 justify-center items-center">
                {tier1.map((node) => (
                  <FamilyNodeCard
                    key={node.id}
                    node={node}
                    selected={selectedMember?.id === node.id}
                    onClick={() => setSelectedMember(node)}
                    accentColor={accentColor}
                  />
                ))}
              </div>

              {/* TIER 2: Main / Active Level */}
              <div className="flex gap-16 justify-center items-center">
                {tier2.map((node) => (
                  <FamilyNodeCard
                    key={node.id}
                    node={node}
                    selected={selectedMember?.id === node.id}
                    onClick={() => setSelectedMember(node)}
                    accentColor={accentColor}
                  />
                ))}
              </div>

              {/* TIER 3: Descendants / Children */}
              <div className="flex gap-10 justify-center items-center flex-wrap max-w-xl">
                {tier3.map((node) => (
                  <FamilyNodeCard
                    key={node.id}
                    node={node}
                    selected={selectedMember?.id === node.id}
                    onClick={() => setSelectedMember(node)}
                    accentColor={accentColor}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info Card Panel */}
        <div className="h-[560px] rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 bg-black/40">
            <span className="font-mono text-[7.5px] uni-text-dim tracking-[0.3em] uppercase">
              Ancestry Ledger
            </span>
            <h3 className="font-sans text-[11px] font-semibold text-white/90 tracking-[0.1em] uppercase mt-1">
              {selectedMember ? selectedMember.name : 'Select a member'}
            </h3>
          </div>

          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scrollbar-none">
            {selectedMember ? (
              <div className="flex flex-col gap-5">
                {/* Character preview */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full border border-white/5 uni-border flex items-center justify-center text-xl bg-black/50"
                  >
                    {selectedMember.image || '👤'}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] text-white font-medium">{selectedMember.name}</span>
                    <span className="font-mono text-[7px] text-white/40 uppercase tracking-widest mt-0.5">
                      {selectedMember.role || 'Bloodline Member'}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-white/5" />

                {/* Relatives details */}
                <div className="flex flex-col gap-2.5">
                  <span className="font-mono text-[7px] text-white/35 tracking-widest uppercase">
                    Lineage Connection
                  </span>
                  {selectedMember.spouseName && (
                    <div className="flex justify-between text-[10px] border-b border-white/5 pb-2">
                      <span className="text-white/40">Union Spouse</span>
                      <span className="text-white/80 font-mono text-[9px]">{selectedMember.spouseName}</span>
                    </div>
                  )}
                  {selectedMember.details &&
                    Object.entries(selectedMember.details).map(([k, v]) => (
                      <div
                        key={k}
                        className="flex justify-between text-[10px] border-b border-white/5 pb-2"
                      >
                        <span className="text-white/40">{k}</span>
                        <span className="text-white/80 font-mono text-[9px]">{v}</span>
                      </div>
                    ))}
                </div>

                {/* Narrative bloodline description */}
                <p className="font-sans text-[11px] text-white/50 leading-relaxed mt-2">
                  Part of the ancient lineage that shaped {title}. Bloodlines carry key alignments,
                  shaping historical outcomes across critical eras.
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8 opacity-50">
                <span className="text-3xl opacity-60">👑</span>
                <p className="font-sans text-[11px] text-white/45 max-w-[200px] leading-relaxed">
                  Select a family node in the visual pedigree to browse ancestry history.
                </p>
              </div>
            )}
          </div>

          <div className="p-5 border-t border-white/5 bg-[#030205]">
            {selectedMember ? (
              <button
                type="button"
                onClick={() => onViewCharacter(selectedMember.id)}
                className="w-full py-2.5 rounded border uni-border uni-border-hover-solid uni-bg uni-text uni-text-hover font-mono text-[8px] tracking-[0.25em] uppercase cursor-none transition-colors"
              >
                Inspect full profile
              </button>
            ) : (
              <span className="font-mono text-[7px] text-white/20 tracking-wider block text-center">
                ORYVON Chronicle Ledgers
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Mini Component for Nodes inside SVG Tree
function FamilyNodeCard({
  node,
  selected,
  onClick,
  accentColor,
}: {
  node: FamilyNode;
  selected: boolean;
  onClick: () => void;
  accentColor: string;
}) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`px-3 py-2.5 rounded-lg border text-left min-w-[125px] transition-all duration-300 backdrop-blur-md focus:outline-none flex items-center gap-3 cursor-none relative ${
        selected
          ? 'uni-bg uni-shadow-sm uni-border-active-full'
          : 'border-white/5 bg-black/85 hover:bg-black/95 hover:border-white/20'
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm bg-black/60 shrink-0 ${selected ? 'uni-border-active-full' : 'border-white/10'}`}
      >
        {node.image || '👤'}
      </div>
      <div className="flex flex-col overflow-hidden">
        <span className="text-[10px] text-white/95 font-medium truncate block leading-tight">
          {node.name}
        </span>
        <span className="text-[7.5px] text-white/35 font-mono uppercase tracking-wider truncate mt-0.5">
          {node.role || 'Bloodline'}
        </span>
      </div>

      {/* Selected Indicator dot */}
      {selected && (
        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full uni-bg-indicator animate-ping" />
      )}
    </button>
  );
}
