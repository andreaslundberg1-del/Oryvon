"use client";

import React from 'react';

interface Portal {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  glow_color?: string;
}

interface PortalsPreviewProps {
  portals: Portal[];
  theme?: "dark" | "light" | "cinematic";
}

export function PortalsPreview({ portals, theme = "cinematic" }: PortalsPreviewProps) {
  const getCardBg = () => {
    switch (theme) {
      case "dark": return "bg-black/80";
      case "light": return "bg-white";
      case "cinematic": return "bg-gradient-to-b from-black/80 to-black/90";
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case "dark": return "text-white";
      case "light": return "text-gray-900";
      case "cinematic": return "text-white";
    }
  };

  const getDescColor = () => {
    switch (theme) {
      case "dark": return "text-white/60";
      case "light": return "text-gray-600";
      case "cinematic": return "text-white/60";
    }
  };

  return (
    <div className="w-full h-full p-8">
      <div className="mb-6">
        <h2 className={`font-mono text-2xl tracking-[0.3em] ${theme === "light" ? "text-gray-900" : "text-amber-400"}`}>
          PORTALS
        </h2>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {portals.map((portal) => (
          <div
            key={portal.id}
            className={`relative group rounded-xl overflow-hidden border border-white/10 transition-all duration-300 hover:scale-105 hover:border-amber-500/30 ${getCardBg()}`}
            style={{
              boxShadow: portal.glow_color ? `0 0 30px ${portal.glow_color}40` : undefined,
            }}
          >
            {/* Image */}
            {portal.image_url && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={portal.image_url}
                  alt={portal.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            )}
            
            {/* Content */}
            <div className="p-4">
              <h3 className={`font-mono text-sm tracking-widest mb-1 ${getTextColor()}`}>
                {portal.title}
              </h3>
              {portal.description && (
                <p className={`font-mono text-[10px] ${getDescColor()}`}>
                  {portal.description}
                </p>
              )}
              {portal.category && (
                <span className="inline-block mt-2 px-2 py-1 rounded-full bg-white/10 font-mono text-[8px] uppercase tracking-wider text-white/70">
                  {portal.category}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
