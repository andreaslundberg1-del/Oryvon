"use client";

import React from 'react';

interface Character {
  id: string;
  name: string;
  biography?: string;
  species?: string;
  status?: string;
  image_url?: string;
  colors?: string[];
}

interface CharacterPreviewProps {
  character: Character;
  theme?: "dark" | "light" | "cinematic";
}

export function CharacterPreview({ character, theme = "cinematic" }: CharacterPreviewProps) {
  const getBgClass = () => {
    switch (theme) {
      case "dark": return "bg-black/90";
      case "light": return "bg-white";
      case "cinematic": return "bg-gradient-to-b from-black/95 via-black/90 to-black/95";
    }
  };

  const getNameColor = () => {
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

  const getStatusColor = (status?: string) => {
    if (!status) return "bg-white/20";
    switch (status.toLowerCase()) {
      case "alive": return "bg-emerald-500/40";
      case "deceased": return "bg-red-500/40";
      case "unknown": return "bg-amber-500/40";
      default: return "bg-white/20";
    }
  };

  return (
    <div className={`w-full h-full min-h-[400px] ${getBgClass()} relative overflow-hidden`}>
      {/* Background Image */}
      {character.image_url && (
        <div className="absolute inset-0 opacity-20">
          <img src={character.image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <div className="p-8 border-b border-white/10">
          <div className="flex items-start gap-6">
            {character.image_url && (
              <div className="w-24 h-24 rounded-xl overflow-hidden border border-white/20 shadow-[0_0_20px_rgba(0,0,0,0.5)] shrink-0">
                <img src={character.image_url} alt={character.name} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex-1">
              <h1 className={`font-serif text-3xl font-light tracking-[0.35em] mb-3 ${getNameColor()}`}>
                {character.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                {character.species && (
                  <span className={`font-mono text-[10px] uppercase tracking-widest ${getMetaColor()}`}>
                    {character.species}
                  </span>
                )}
                {character.status && (
                  <span className={`font-mono text-[10px] uppercase tracking-widest px-3 py-1 rounded-full ${getStatusColor(character.status)} text-white/90`}>
                    {character.status}
                  </span>
                )}
              </div>

              {character.colors && character.colors.length > 0 && (
                <div className="flex gap-2">
                  {character.colors.map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Biography */}
        <div className="flex-1 p-8">
          <h2 className={`font-mono text-[10px] uppercase tracking-[0.28em] mb-4 ${theme === "light" ? "text-gray-900" : "text-amber-400"}`}>
            BIOGRAPHY
          </h2>
          {character.biography ? (
            <p className={`font-mono text-sm leading-relaxed ${getTextColor()}`}>
              {character.biography}
            </p>
          ) : (
            <p className={`font-mono text-sm italic ${getMetaColor()}`}>
              No biography available
            </p>
          )}
        </div>

        {/* Related Content Preview */}
        <div className="border-t border-white/10 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px bg-white/20 flex-1" />
            <span className={`font-mono text-[8px] uppercase tracking-widest ${getMetaColor()}`}>RELATED CONTENT</span>
            <div className="h-px bg-white/20 flex-1" />
          </div>
          <div className="flex justify-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-white/10" />
            <div className="w-12 h-12 rounded-lg bg-white/10" />
            <div className="w-12 h-12 rounded-lg bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
