export type LocalizedString = Record<string, string>;

export type Timeline = {
  id: string;
  title: LocalizedString;
  description: LocalizedString;
  years: YearData[];
};

export type YearData = {
  year: number;
  theme: EraTheme; // e.g., colors for this specific year or era
  
  // 1. Intro
  intro: {
    title: LocalizedString;
    description: LocalizedString;
  };
  
  // 2. Early Games
  games: {
    title: LocalizedString;
    images: { url: string; alt: string }[];
  };
  
  // 3. Pixel Graphics
  pixelArt: {
    title: LocalizedString;
    description: LocalizedString;
    images: { url: string; alt: string }[];
  };
  
  // 4. Arcade
  arcade: {
    title: LocalizedString;
    description: LocalizedString;
    images: { url: string; alt: string }[];
  };
  
  // 5. Tech
  tech: {
    title: LocalizedString;
    hardware: { name: LocalizedString; specs: LocalizedString }[];
    image: string;
  };
  
  // 6. Audio
  audio: {
    title: LocalizedString;
    description: LocalizedString;
  };
  
  // 7. Film & VFX
  filmVfx: {
    title: LocalizedString;
    description: LocalizedString;
    images: { url: string; alt: string }[];
  };
  
  // 8. Design & UI
  uiDesign: {
    title: LocalizedString;
    description: LocalizedString;
    image: string;
  };
  
  // 9. Summary
  summary: {
    title: LocalizedString;
    description: LocalizedString;
    icons: string[]; // e.g., 'gamepad', 'monitor'
  };

  // 10. Cinematic "Mini-Film" Events
  events?: {
    type: 'image-reveal' | 'text-write' | 'glitch' | 'morph' | 'rtx-on' | 'toy-story-render' | 'doom-climax';
    trigger?: string; // element id or step index
    data?: any;
  }[];

  // 11. Narrative Storytelling
  narrative?: {
    quote: LocalizedString;
    author: string;
  };
};

export type EraTheme = {
  uiStyle: 'terminal' | 'arcade' | 'cyber' | 'tech' | 'cinematic' | 'noir' | 'scifi' | 'lowpoly' | 'bloom' | 'photoreal' | 'holographic' | 'fantasy' | 'medieval' | 'retro' | 'vaporwave' | 'ice' | 'fire' | 'royal';
  ambience?: 'radar' | 'synthwave' | 'orchestral' | 'future' | 'modern' | 'epic' | 'ambient' | 'techno' | 'lore';
  scrollFeel?: 'clunky' | 'normal' | 'smooth' | 'hyper';
  
  // Evolutionary parameters for the engine
  pixelation?: number; // 0 to 10 (0 = sharp, 10 = blocky)
  colorDepth?: number; // 2, 4, 8, 16, 256, or 16777216
  bloomIntensity?: number; // 0 to 1
  scanlineIntensity?: number; // 0 to 1
  chromaticAberration?: number; // 0 to 1
  glitchIntensity?: number; // 0 to 1
  
  backgroundAnimation?: 'none' | 'grid' | 'stars' | 'matrix' | 'nebula' | 'scanlines' | 'circuits' | 'geometric';
  backgroundImage?: string;
  particles?: {
    type: 'points' | 'dust' | 'lines' | 'snow' | 'fireflies';
    count: number;
    color: string;
  };
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
};
