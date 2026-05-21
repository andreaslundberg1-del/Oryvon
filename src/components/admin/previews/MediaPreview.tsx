"use client";

import React from 'react';

interface MediaItem {
  id: string;
  title: string;
  type?: 'image' | 'video';
  url?: string;
  thumbnail_url?: string;
  description?: string;
}

interface MediaPreviewProps {
  media: MediaItem[];
  theme?: "dark" | "light" | "cinematic";
}

export function MediaPreview({ media, theme = "cinematic" }: MediaPreviewProps) {
  const getBgClass = () => {
    switch (theme) {
      case "dark": return "bg-black/90";
      case "light": return "bg-white";
      case "cinematic": return "bg-gradient-to-b from-black/95 via-black/90 to-black/95";
    }
  };

  const getCardBg = () => {
    switch (theme) {
      case "dark": return "bg-black/60";
      case "light": return "bg-gray-100";
      case "cinematic": return "bg-black/40";
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
      case "dark": return "text-white/70";
      case "light": return "text-gray-600";
      case "cinematic": return "text-white/70";
    }
  };

  const getTypeColor = () => {
    switch (theme) {
      case "dark": return "text-white/40";
      case "light": return "text-gray-500";
      case "cinematic": return "text-white/40";
    }
  };

  return (
    <div className={`w-full h-full min-h-[400px] ${getBgClass()} p-8`}>
      <div className="mb-6">
        <h2 className={`font-mono text-2xl tracking-[0.3em] ${theme === "light" ? "text-gray-900" : "text-amber-400"}`}>
          MEDIA GALLERY
        </h2>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className={`group relative rounded-xl overflow-hidden border border-white/10 transition-all duration-300 hover:scale-105 hover:border-amber-500/30 ${getCardBg()}`}
          >
            {/* Thumbnail */}
            <div className="aspect-video overflow-hidden">
              {item.thumbnail_url ? (
                <img
                  src={item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : item.url ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-white/5">
                  <span className={`font-mono text-[10px] ${getTypeColor()}`}>NO PREVIEW</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className={`font-mono text-sm tracking-widest mb-1 ${getTitleColor()}`}>
                {item.title}
              </h3>
              
              <div className="flex items-center gap-2 mb-2">
                {item.type && (
                  <span className={`font-mono text-[8px] uppercase tracking-wider ${getTypeColor()}`}>
                    {item.type}
                  </span>
                )}
              </div>

              {item.description && (
                <p className={`font-mono text-[10px] line-clamp-2 ${getTextColor()}`}>
                  {item.description}
                </p>
              )}
            </div>

            {/* Play Button for Videos */}
            {item.type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {media.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className={`font-mono text-sm ${getTypeColor()}`}>
              No media items yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
