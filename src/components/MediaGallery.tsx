"use client";

import React from "react";

interface MediaItem {
  id: string;
  title?: string;
  type?: string;
  url?: string;
  thumbnail_url?: string;
  description?: string;
}

interface MediaGalleryProps {
  media: MediaItem[];
  accent_color?: string;
}

export function MediaGallery({
  media,
  accent_color = "#eed078",
}: MediaGalleryProps) {
  const hexToRgb = (hex: string): string => {
    const cleanHex = hex.replace('#', '');
    let r = 0, g = 0, b = 0;
    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }
    return `${r}, ${g}, ${b}`;
  };

  const rgbString = hexToRgb(accent_color);

  return (
    <div className="w-full min-h-screen flex flex-col relative overflow-hidden bg-[#020102] text-white select-none">
      {/* Scoped Dynamic Stylesheet */}
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --uni-accent: ${accent_color};
          --uni-accent-rgb: ${rgbString};
        }
        .uni-text { color: var(--uni-accent) !important; }
        .uni-border { border-color: rgba(var(--uni-accent-rgb), 0.2) !important; }
        .uni-bg { background-color: rgba(var(--uni-accent-rgb), 0.08) !important; }
        .uni-bg-solid { background-color: var(--uni-accent) !important; }
        .uni-gradient-line { background: linear-gradient(to right, transparent, rgba(var(--uni-accent-rgb), 0.3), transparent) !important; }
      ` }} />

      {/* Media Gallery Header */}
      <div className="relative w-full h-[35vh] md:h-[40vh] flex flex-col justify-end">
        {/* Dark atmospheric gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020102] via-[#020102]/70 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#020102]/90 via-transparent to-transparent z-10" />
        
        {/* Background image from first media item if available */}
        {media?.[0]?.thumbnail_url || media?.[0]?.url ? (
          <img 
            src={media[0].thumbnail_url || media[0].url} 
            alt="Media Gallery"
            className="absolute inset-0 w-full h-full object-cover filter brightness-[0.5] contrast-[1.1] saturate-[0.9]"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#0c0907] via-[#040302] to-[#000000]" />
        )}

        {/* Header Content */}
        <div className="w-full max-w-[1720px] mx-auto px-6 md:px-12 pb-8 relative z-20 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="uni-bg uni-border px-3 py-0.5 rounded font-mono text-[7.5px] uni-text tracking-[0.15em] uppercase">
              MEDIA ARCHIVE
            </span>
            <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded font-mono text-[7.5px] text-white/50 tracking-[0.1em]">
              {media?.length || 0} ITEMS
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal tracking-[0.22em] text-white mt-2 uppercase" style={{ fontFamily: "'Cinzel', serif", textShadow: '0 4px 20px rgba(0,0,0,0.9)' }}>
            MEDIA GALLERY
          </h1>
        </div>
      </div>

      {/* Media Gallery Content */}
      <div className="flex-1 w-full max-w-[1720px] mx-auto px-6 md:px-12 py-10 relative z-20">
        <div className="flex flex-col gap-8 w-full pb-10">
          
          {/* Media Stats */}
          <div className="grid grid-cols-4 gap-3 bg-black/45 border border-white/5 rounded-xl p-4">
            {[
              { label: 'IMAGES', val: media?.filter(m => m.type === 'image' || m.type === 'concept_art').length || 0, icon: '🖼️' },
              { label: 'VIDEOS', val: media?.filter(m => m.type === 'video' || m.type === 'trailer').length || 0, icon: '🎬' },
              { label: 'AUDIO', val: media?.filter(m => m.type === 'soundtrack' || m.type === 'ambience').length || 0, icon: '🎵' },
              { label: 'DOCS', val: media?.filter(m => m.type === 'document').length || 0, icon: '📄' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2.5 border-r border-white/5 last:border-0 pr-1">
                <span className="text-lg shrink-0">{item.icon}</span>
                <div className="flex flex-col">
                  <span className="font-mono text-[6.5px] text-white/30 uppercase tracking-widest leading-none">{item.label}</span>
                  <span className="text-xs font-semibold uni-text font-serif leading-none mt-1.5">{item.val}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Media Grid */}
          {media && media.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {media.map((item, idx) => (
                <div key={item.id || idx} className="rounded-2xl border border-white/5 uni-border bg-[#050406]/95 p-4 shadow-2xl relative group overflow-hidden">
                  <div className="absolute top-0 left-4 right-4 h-[1.5px] uni-gradient-line" />
                  
                  {/* Media Thumbnail */}
                  <div className="aspect-video rounded-lg overflow-hidden border border-white/5 relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050406] via-transparent to-transparent z-10" />
                    {item.thumbnail_url || item.url ? (
                      <img 
                        src={item.thumbnail_url || item.url} 
                        alt={item.title || "Media"} 
                        className="w-full h-full object-cover filter brightness-[0.75] group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#050406] flex items-center justify-center text-white/20">
                        No Image
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <span className="absolute top-2 right-2 uni-bg uni-border px-2 py-0.5 rounded font-mono text-[6px] uni-text tracking-wider uppercase">
                      {item.type || "media"}
                    </span>
                  </div>

                  {/* Media Info */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-sm font-serif text-white/90 font-semibold leading-tight line-clamp-2">
                      {item.title || "Untitled Media"}
                    </h3>
                    {item.description && (
                      <p className="font-serif text-[10px] text-white/50 leading-relaxed font-light line-clamp-2">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 flex flex-col items-center gap-4">
              <span className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase">
                NO MEDIA RECORDED
              </span>
              <span className="font-mono text-[7px] text-white/20 tracking-[0.2em] uppercase">
                Add media items to populate the gallery
              </span>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
