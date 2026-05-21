"use client";

import React from 'react';

interface Universe {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  category?: string;
  releaseYears?: string;
  rating?: number;
}

interface UniversePreviewProps {
  universe: Universe;
  theme?: "dark" | "light" | "cinematic";
}

export function UniversePreview({ universe, theme = "cinematic" }: UniversePreviewProps) {
  const getBgClass = () => {
    switch (theme) {
      case "dark": return "bg-black/90";
      case "light": return "bg-white";
      case "cinematic": return "bg-gradient-to-b from-black/95 via-black/90 to-black/95";
    }
  };

  const getTitleColor = () => {
    switch (theme) {
      case "dark": return "text-white";
      case "light": return "text-gray-900";
      case "cinematic": return "text-amber-400";
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case "dark": return "text-white/80";
      case "light": return "text-gray-700";
      case "cinematic": return "text-white/80";
    }
  };

  const getMetaColor = () => {
    switch (theme) {
      case "dark": return "text-white/50";
      case "light": return "text-gray-500";
      case "cinematic": return "text-white/50";
    }
  };

  return (
    <div className={`w-full h-full min-h-[400px] ${getBgClass()} relative overflow-hidden`}>
      {/* Background Image */}
      {universe.image_url && (
        <div className="absolute inset-0 opacity-30">
          <img src={universe.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-6">
            {universe.image_url && (
              <div className="w-32 h-32 mx-auto rounded-xl overflow-hidden border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                <img src={universe.image_url} alt={universe.title} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div>
              <h1 className={`font-serif text-4xl font-light tracking-[0.35em] mb-3 ${getTitleColor()}`}>
                {universe.title}
              </h1>
              
              <div className="flex items-center justify-center gap-4 mb-4">
                {universe.category && (
                  <span className="font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-white/10 text-white/70">
                    {universe.category}
                  </span>
                )}
                {universe.releaseYears && (
                  <span className={`font-mono text-[10px] ${getMetaColor()}`}>
                    {universe.releaseYears}
                  </span>
                )}
                {universe.rating && (
                  <span className={`font-mono text-[10px] ${getMetaColor()}`}>
                    ★ {universe.rating}
                  </span>
                )}
              </div>
              
              {universe.description && (
                <p className={`font-mono text-sm max-w-lg mx-auto ${getTextColor()}`}>
                  {universe.description}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Timeline Preview */}
        <div className="border-t border-white/10 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px bg-white/20 flex-1" />
            <span className={`font-mono text-[8px] uppercase tracking-widest ${getMetaColor()}`}>TIMELINE</span>
            <div className="h-px bg-white/20 flex-1" />
          </div>
          <div className="flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-amber-500/60" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
            <div className="w-2 h-2 rounded-full bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  );
}
