"use client";

import React from 'react';

interface HomepageHeroPreviewProps {
  hero_logo_url?: string;
  hero_text?: string;
  slogan?: string;
  subtitle?: string;
  background_image_url?: string;
  theme?: "dark" | "light" | "cinematic";
}

export function HomepageHeroPreview({
  hero_logo_url,
  hero_text = "ORYVON",
  slogan = "The Multiverse Archive",
  subtitle = "Explore infinite universes, characters, timelines, and stories",
  background_image_url,
  theme = "cinematic",
}: HomepageHeroPreviewProps) {
  const getTextColor = () => {
    switch (theme) {
      case "dark": return "text-white";
      case "light": return "text-gray-900";
      case "cinematic": return "text-white";
    }
  };

  const getSubtextColor = () => {
    switch (theme) {
      case "dark": return "text-white/70";
      case "light": return "text-gray-600";
      case "cinematic": return "text-white/70";
    }
  };

  const getSubtitleColor = () => {
    switch (theme) {
      case "dark": return "text-white/40";
      case "light": return "text-gray-500";
      case "cinematic": return "text-white/40";
    }
  };

  const getTitleColor = () => {
    switch (theme) {
      case "dark": return "text-amber-400";
      case "light": return "text-gray-900";
      case "cinematic": return "text-amber-400";
    }
  };

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center p-8">
      {/* Background */}
      {background_image_url && (
        <div className="absolute inset-0 opacity-20">
          <img src={background_image_url} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 md:space-y-8">
        {/* Logo */}
        {hero_logo_url && (
          <div className="flex justify-center">
            <img 
              src={hero_logo_url} 
              alt="Logo" 
              className="h-16 md:h-20 lg:h-24 object-contain" 
            />
          </div>
        )}

        {/* Hero Text */}
        <h1 className={`font-serif text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.35em] ${getTitleColor()}`}>
          {hero_text}
        </h1>

        {/* Slogan */}
        <p className={`font-mono text-xs md:text-sm lg:text-base tracking-widest ${getSubtextColor()}`}>
          {slogan}
        </p>

        {/* Subtitle */}
        <p className={`font-mono text-[9px] md:text-[10px] lg:text-xs tracking-wide max-w-2xl mx-auto ${getSubtitleColor()}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}
