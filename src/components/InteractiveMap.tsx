'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useAudio } from '@/components/AudioManager';
import { getWorldMap, type MapMarker, type WorldMapConfig } from '@/data/worldMaps';
import { getUniverseData } from '@/data/universeRegistry';

interface InteractiveMapProps {
  universeId: string;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function getMarkerIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'castle': return '🏰';
    case 'city': return '🏢';
    case 'ruin': return '💀';
    case 'school': return '🔮';
    case 'planet': return '🪐';
    case 'landmark': return '⌖';
    default: return '📍';
  }
}

function altitudeLabel(scale: number, fitScale: number): string {
  const ratio = scale / fitScale;
  if (ratio < 0.85) return 'Orbital view';
  if (ratio < 1.15) return 'Continental view';
  if (ratio < 1.8) return 'Regional view';
  return 'Local terrain';
}

function computeFitScale(
  containerW: number,
  containerH: number,
  mapW: number,
  mapH: number
): number {
  if (containerW <= 0 || containerH <= 0) return 0.5;
  return Math.min(containerW / mapW, containerH / mapH) * 0.94;
}

export default function InteractiveMap({ universeId }: InteractiveMapProps) {
  const { playClick, playHover } = useAudio();
  const config = getWorldMap(universeId);

  const [fitScale, setFitScale] = useState(config.initialScale);
  const [scale, setScale] = useState(config.initialScale);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapLoaded, setMapLoaded] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const applyFitView = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const fit = computeFitScale(
      el.clientWidth,
      el.clientHeight,
      config.mapSize.w,
      config.mapSize.h
    );
    setFitScale(fit);
    setScale(fit);
    setPosition({ x: 0, y: 0 });
  }, [config.mapSize.w, config.mapSize.h]);

  useEffect(() => {
    setSelectedMarker(null);
    setMapLoaded(false);
    applyFitView();
  }, [universeId, applyFitView]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;

    const ro = new ResizeObserver(() => {
      const fit = computeFitScale(
        el.clientWidth,
        el.clientHeight,
        config.mapSize.w,
        config.mapSize.h
      );
      setFitScale(fit);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [config.mapSize.w, config.mapSize.h]);

  const minScale = Math.max(config.minScale, fitScale * 0.75);
  const maxScale = Math.max(config.maxScale, fitScale * 4);

  const resetView = useCallback(() => {
    playClick();
    applyFitView();
    setSelectedMarker(null);
  }, [applyFitView, playClick]);

  const zoomAt = useCallback(
    (delta: number, clientX?: number, clientY?: number) => {
      const el = containerRef.current;
      if (!el) {
        setScale((s) => clamp(s + delta, minScale, maxScale));
        return;
      }
      const rect = el.getBoundingClientRect();
      const px = clientX != null ? clientX - rect.left - rect.width / 2 : 0;
      const py = clientY != null ? clientY - rect.top - rect.height / 2 : 0;

      setScale((prev) => {
        const next = clamp(prev + delta, minScale, maxScale);
        const ratio = next / prev;
        setPosition((p) => ({
          x: px - (px - p.x) * ratio,
          y: py - (py - p.y) * ratio,
        }));
        return next;
      });
    },
    [minScale, maxScale]
  );

  const handleZoomButton = (dir: 'in' | 'out') => {
    playClick();
    zoomAt(dir === 'in' ? fitScale * 0.15 : -fitScale * 0.15);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? fitScale * 0.06 : -fitScale * 0.06;
    zoomAt(delta, e.clientX, e.clientY);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const endDrag = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: t.clientX - position.x, y: t.clientY - position.y });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const t = e.touches[0];
    setPosition({ x: t.clientX - dragStart.x, y: t.clientY - dragStart.y });
  };

  const labelThreshold = fitScale * 1.12;
  const detailThreshold = fitScale * 1.45;
  const showLabels = (marker: MapMarker) => scale >= (marker.labelZoom ?? 1) * labelThreshold;
  const showMarkerDetail = scale >= detailThreshold;
  const markerPinScale = clamp(0.65 + (scale / fitScale) * 0.25, 0.7, 1.25);

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-4">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[8px] uni-text tracking-[0.3em] uppercase">
            ORYVON World Atlas
          </span>
          <h2
            className="text-xl md:text-2xl font-normal tracking-wide text-white uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {config.title}
          </h2>
          <p className="font-mono text-[9px] text-white/45 tracking-wider">{config.subtitle}</p>
          <p className="font-sans text-[11px] text-white/50 max-w-lg mt-1 leading-relaxed">
            {config.description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col text-right font-mono text-[8px] text-white/35 mr-1 uppercase">
            <span>{altitudeLabel(scale, fitScale)}</span>
            <span className="uni-text-dim">
              {Math.round((scale / fitScale) * 100)}% magnification
            </span>
          </div>
          <MapControlBtn label="Zoom in" onClick={() => handleZoomButton('in')} onHover={playHover}>
            ＋
          </MapControlBtn>
          <MapControlBtn label="Zoom out" onClick={() => handleZoomButton('out')} onHover={playHover}>
            －
          </MapControlBtn>
          <MapControlBtn label="Reset view" onClick={resetView} onHover={playHover} wide>
            Reset
          </MapControlBtn>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <div className="lg:col-span-2 relative h-[min(72vh,620px)] min-h-[420px] rounded-xl border border-white/5 uni-border overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.65)] bg-[#0a0806]">
          <div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              boxShadow: 'inset 0 0 80px rgba(0,0,0,0.55), inset 0 0 24px rgba(0,0,0,0.25)',
            }}
          />

          <div className="absolute bottom-4 left-4 z-30 pointer-events-none flex flex-col gap-0.5">
            <span className="font-mono text-[7px] text-white/25 tracking-widest uppercase">
              Scroll to zoom · Drag to pan · Double-click to zoom in
            </span>
          </div>

          <div
            ref={containerRef}
            className={`w-full h-full relative flex items-center justify-center overflow-hidden ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={endDrag}
            onWheel={handleWheel}
            onDoubleClick={(e) => {
              e.preventDefault();
              playClick();
              zoomAt(fitScale * 0.2, e.clientX, e.clientY);
            }}
          >
            {!mapLoaded && (
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <span className="font-mono text-[9px] uni-text-dim tracking-[0.3em] uppercase animate-pulse">
                  Loading atlas chart…
                </span>
              </div>
            )}

            <div
              className="relative origin-center oryvon-gpu-layer"
              style={{
                width: config.mapSize.w,
                height: config.mapSize.h,
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transition: isDragging ? 'none' : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <div className="relative w-full h-full rounded-sm overflow-hidden shadow-[0_8px_48px_rgba(0,0,0,0.7)]">
                <Image
                  src={config.mapImage}
                  alt={`${config.title} — cartographic chart`}
                  width={config.mapSize.w}
                  height={config.mapSize.h}
                  className={`block w-full h-full object-contain pointer-events-none select-none transition-opacity duration-700 ${mapLoaded ? 'opacity-100' : 'opacity-0'}`}
                  draggable={false}
                  priority
                  onLoad={() => setMapLoaded(true)}
                  sizes={`${config.mapSize.w}px`}
                />
              </div>

              <div className="absolute inset-0 z-10 pointer-events-none">
                {config.markers.map((marker) => {
                  const active = selectedMarker?.id === marker.id;
                  const labelsVisible = showLabels(marker);

                  return (
                    <button
                      key={marker.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClick();
                        setSelectedMarker(marker);
                      }}
                      onMouseEnter={() => playHover()}
                      className="absolute flex flex-col items-center focus:outline-none cursor-none group/marker pointer-events-auto"
                      style={{
                        left: `${marker.x}%`,
                        top: `${marker.y}%`,
                        transform: `translate(-50%, -50%) scale(${markerPinScale})`,
                        transition: 'transform 0.35s ease',
                      }}
                    >
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`rounded-full border transition-all duration-300 ${
                            active
                              ? 'w-5 h-5 uni-border-active-full bg-[rgba(var(--uni-accent-rgb),0.3)] shadow-[0_0_20px_rgba(var(--uni-accent-rgb),0.55)]'
                              : 'w-3.5 h-3.5 border border-[rgba(var(--uni-accent-rgb),0.6)] bg-[rgba(var(--uni-accent-rgb),0.2)] group-hover/marker:w-4 group-hover/marker:h-4 uni-border-hover-solid'
                          }`}
                        />
                        <div
                          className={`absolute w-2 h-2 rounded-full uni-bg-indicator ${active ? 'opacity-100' : 'opacity-80'}`}
                        />
                      </div>

                      {labelsVisible && (
                        <div
                          className={`mt-1.5 px-2 py-0.5 rounded border text-[8px] font-sans font-medium tracking-wide whitespace-nowrap transition-all duration-400 backdrop-blur-sm ${
                            active
                              ? 'uni-bg border border-[rgba(var(--uni-accent-rgb),0.5)] text-white opacity-100'
                              : 'bg-black/80 border-white/10 text-white/70 opacity-0 group-hover/marker:opacity-100'
                          } ${showMarkerDetail || active ? 'opacity-100' : ''}`}
                        >
                          <span className="mr-1">{getMarkerIcon(marker.type)}</span>
                          {marker.name}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <LocationPanel
          universeId={universeId}
          config={config}
          selected={selectedMarker}
          scale={scale}
          fitScale={fitScale}
          playHover={playHover}
          playClick={playClick}
        />
      </div>
    </div>
  );
}

function MapControlBtn({
  children,
  onClick,
  onHover,
  label,
  wide,
}: {
  children: React.ReactNode;
  onClick: () => void;
  onHover: () => void;
  label: string;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      title={label}
      onClick={onClick}
      onMouseEnter={onHover}
      className={`${wide ? 'px-4' : 'w-10'} h-10 rounded-lg border border-white/10 uni-border-hover bg-black/50 text-white/70 uni-text-hover transition-colors duration-300 font-mono text-sm cursor-none flex items-center justify-center`}
    >
      {children}
    </button>
  );
}

function LocationPanel({
  universeId,
  config,
  selected,
  scale,
  fitScale,
  playHover,
  playClick,
}: {
  universeId: string;
  config: WorldMapConfig;
  selected: MapMarker | null;
  scale: number;
  fitScale: number;
  playHover: () => void;
  playClick: () => void;
}) {
  const registryData = getUniverseData(universeId);
  
  // Find location image matching landmark name
  let locationImage = registryData.backdrop;
  if (selected) {
    const match = registryData.locations.find(
      (loc: any) => loc.name.toLowerCase().includes(selected.name.toLowerCase()) || selected.name.toLowerCase().includes(loc.name.toLowerCase())
    );
    if (match) {
      locationImage = match.image;
    }
  }

  return (
    <div className="h-[min(72vh,620px)] min-h-[440px] rounded-xl border border-white/5 bg-[#050407]/95 flex flex-col overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 bg-black/40">
        <span className="font-mono text-[7.5px] uni-text-dim tracking-[0.3em] uppercase">
          Location archive
        </span>
        <h3 className="font-sans text-[11px] font-semibold text-white/90 tracking-[0.1em] uppercase mt-1">
          {selected ? selected.name : 'Select a landmark'}
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-5 scrollbar-none">
        {selected ? (
          <div className="flex flex-col gap-5">
            {/* Cinematic landscape preview inside panel */}
            <div className="relative w-full h-[130px] rounded-lg overflow-hidden border border-white/5">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent z-10" />
              <img 
                src={locationImage} 
                alt={selected.name} 
                className="w-full h-full object-cover filter brightness-[0.72] contrast-[1.05]"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <span className="px-2.5 py-0.5 rounded font-mono text-[7px] tracking-[0.15em] uppercase border uni-border uni-text uni-bg">
                {selected.type}
              </span>
              <span className="font-mono text-[7px] text-white/35">
                {Math.round((scale / fitScale) * 100)}% zoom
              </span>
            </div>

            <p className="font-sans text-[12px] text-white/65 leading-relaxed font-light">{selected.desc}</p>

            {selected.details && (
              <div className="flex flex-col gap-2">
                <span className="font-mono text-[7px] text-white/35 tracking-widest uppercase">
                  Archive details
                </span>
                {Object.entries(selected.details).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between gap-3 text-[10px] border-b border-white/5 pb-2"
                  >
                    <span className="text-white/40">{k}</span>
                    <span className="text-white/80 font-mono text-[9px] text-right">{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3 py-8 opacity-50">
            <span className="text-3xl opacity-60">🌍</span>
            <p className="font-sans text-[11px] text-white/45 max-w-[220px] leading-relaxed">
              Zoom in on the atlas chart and click a golden marker to read lore about cities,
              regions, and landmarks.
            </p>
            <span className="font-mono text-[7px] uni-text-dim tracking-wider uppercase">
              Labels appear when zoomed in
            </span>
          </div>
        )}
      </div>

      <div className="p-5 border-t border-white/5 bg-[#030205]">
        {selected ? (
          <button
            type="button"
            onClick={() => playClick()}
            onMouseEnter={() => playHover()}
            className="w-full py-2.5 rounded border uni-border uni-border-hover-solid uni-bg uni-text uni-text-hover font-mono text-[8px] tracking-[0.25em] uppercase cursor-none transition-colors"
          >
            EXPLORE LORE SCROLLS ›
          </button>
        ) : (
          <span className="font-mono text-[7px] text-white/20 tracking-wider block text-center">
            ORYVON Atlas · {config.title}
          </span>
        )}
      </div>
    </div>
  );
}
