"use client";

import React from "react";
import { useI18n } from "./I18nProvider";

export interface UniverseCardProps {
  uni: any;
  genreColor: string;
  onEnter: () => void;
  onCardHover: (id: string | null) => void;
  hoveredCardId: string | null;
  startTransition: (url: string, id: string) => void;
}

export function UniverseCard({
  uni,
  genreColor,
  onEnter,
  onCardHover,
  hoveredCardId,
  startTransition,
}: UniverseCardProps) {
  const { t } = useI18n();
  const isHovered = hoveredCardId === uni.id;
  
  const titleKey = uni.titleKey || `universeData.${uni.id}.title`;
  const teaserKey = uni.teaserKey || `universeData.${uni.id}.teaser`;
  
  const title = t(titleKey) !== `[MISSING: ${titleKey}]` ? t(titleKey) : uni.title;
  const teaser = t(teaserKey) !== `[MISSING: ${teaserKey}]` ? t(teaserKey) : uni.teaser;
  const tags = uni.categoryTags.map((tag: string) => {
    const tagKey = `tags.${tag.toLowerCase().replace(/\\s+/g, '_')}`;
    return t(tagKey) !== `[MISSING: ${tagKey}]` ? t(tagKey) : tag;
  });

  return (
    <div
      className="timeline-card group relative rounded-lg overflow-hidden flex flex-col justify-between transition-all duration-500 cursor-none w-full"
      style={{
        height: 395,
        border: "1px solid rgba(255, 255, 255, 0.05)",
        background: "linear-gradient(180deg, rgba(8,7,12,0.92) 0%, rgba(3,2,5,0.98) 100%)",
        backdropFilter: "blur(16px)",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.65)",
        transform: isHovered ? "translateY(-6px)" : "none",
      }}
      onClick={() => {
        onEnter();
        if (uni.href) {
          startTransition(uni.href, uni.id);
        } else {
          startTransition(`/universe/${uni.id}`, uni.id);
        }
      }}
      onMouseEnter={() => onCardHover(uni.id)}
      onMouseLeave={() => onCardHover(null)}
    >
      {/* Dynamic Gold/Genre Glow Box */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700 opacity-0 group-hover:opacity-100"
        style={{
          border: `1.5px solid ${genreColor}77`,
          boxShadow: `0 0 35px ${genreColor}25, inset 0 0 15px ${genreColor}08`,
        }}
      />

      {/* Image Container with Zoom */}
      <div className="relative w-full h-[185px] overflow-hidden">
        {/* Gradient overlay to dark bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#030205] via-[#030205]/40 to-transparent z-10" />

        {/* Widescreen image */}
        <img
          src={uni.image || uni.backdrop || "/Images/portal_cinema.png"}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110 filter brightness-[0.82] group-hover:brightness-[0.95]"
          loading="lazy"
        />

        {/* Floating Rating Tag */}
        <div className="absolute top-3 right-3 z-20 bg-black/80 backdrop-blur-[6px] border border-amber-500/35 px-2.5 py-0.5 rounded font-mono text-[7.5px] text-amber-300 tracking-[0.1em]">
          ★ {uni.rating || "N/A"}
        </div>

        {/* Floating Primary Tag */}
        <div className="absolute bottom-3 left-3 z-20 flex gap-1">
          {tags.slice(0, 1).map((tag: string, idx: number) => (
            <span
              key={idx}
              className="bg-black/40 backdrop-blur-[4px] border border-white/15 px-2.5 py-0.5 rounded-full font-mono text-[6.5px] text-white/80 tracking-[0.12em] uppercase"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Description / Metadata Body */}
      <div className="p-5 flex-1 flex flex-col justify-between relative z-20">
        <div className="flex flex-col gap-2.5">
          {/* Title */}
          <h3
            className="text-white text-base font-normal tracking-[0.12em] group-hover:text-amber-200 transition-colors duration-300"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {title || "Untitled Universe"}
          </h3>

          {/* Release years & dynamic category tags list */}
          <div className="flex items-center gap-2 font-mono text-[8px] text-white/40">
            <span>{uni.releaseYears || "TBD"}</span>
            <span className="text-white/10">•</span>
            <span>{tags.slice(1).join(" / ")}</span>
          </div>

          {/* Immersive Lore Teaser */}
          <p className="text-[10px] text-white/55 leading-relaxed font-sans mt-1 line-clamp-3">
            {teaser || t('uni.storySoFar')}
          </p>
        </div>

        {/* Interactive Button showing on Hover */}
        <div className="mt-4 pt-3.5 border-t border-white/5 flex items-center justify-between">
          <span className="font-mono text-[7px] text-white/30 tracking-[0.3em] uppercase group-hover:text-white/60 transition-colors duration-300">
            SECTOR // {(uni.id || "NEW").toUpperCase()}
          </span>

          <div
            className="flex items-center gap-1 bg-white/5 group-hover:bg-white/10 border border-white/10 px-3 py-1 rounded transition-all duration-300"
            style={{
              borderColor: isHovered ? `${genreColor}77` : "rgba(255,255,255,0.1)",
              backgroundColor: isHovered ? `${genreColor}15` : undefined,
            }}
          >
            <span
              className="font-mono text-[7.5px] text-white/60 tracking-[0.2em] uppercase"
              style={{ color: isHovered ? "#ffffff" : undefined }}
            >
              {t('universe.enterUniverse')}
            </span>
            <svg
              className="w-2.5 h-2.5 text-white/40"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
