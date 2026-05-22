"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useTransitionPortal } from "@/components/TransitionManager";
import { useAudio } from "@/components/AudioManager";
import { useI18n } from "@/components/I18nProvider";
import InteractiveMap from "@/components/InteractiveMap";
import { UniverseCard } from "@/components/UniverseCard";
import { supabase } from "@/lib/supabase";
import HomeBackground from "@/components/HomeBackground";
import { useCinematicScroll } from "@/hooks/useCinematicScroll";
import OryndorLogo from "@/components/OryndorLogo";
import CinematicCompass from "@/components/CinematicCompass";
import PortalWorld, { PortalTheme } from "@/components/PortalWorld";
import Sidebar from "@/components/Sidebar";
import gsap from "gsap";

type Genre = string | null;

interface GenreDef {
  id: string;
  label: string;
  system: string;
  sub: string;
  color: string;
  glow: string;
  canvasTheme: PortalTheme;
  count: string;
  bgImage: string;
  goldIcon: React.ReactNode;
}

interface HomepageSettings {
  id: string;
  background_image_url?: string;
  hero_logo_url?: string;
  hero_text?: string;
  slogan?: string;
  subtitle?: string;
  portal_cards?: any[];
  animations_enabled?: boolean;
  effects_config?: any;
}

const DEFAULT_HOMEPAGE_SETTINGS: HomepageSettings = {
  id: "homepage",
  hero_text: "ORYVON",
  slogan: "Worlds Evolve. Stories Endure.",
  subtitle: "Choose a realm and open the archive",
  animations_enabled: true,
};

const GENRES: GenreDef[] = [
  {
    id: "movies",
    label: "MOVIES",
    system: "//001 CINEMA CORE//",
    sub: "Stories through the lens & blockbusters",
    color: "#c59635",
    glow: "rgba(197, 150, 53, 0.65)",
    canvasTheme: "cinema",
    count: "1,248 REALMS",
    bgImage: "/Images/harrypotter_castle.png",
    goldIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eed078" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M4 18h16a2 2 0 0 0 2-2V8H2v8a2 2 0 0 0 2 2z" />
        <path d="M2 8V4a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v4H2z" />
        <path d="m6 2 4 6" />
        <path d="m11 2 4 6" />
        <path d="m16 2 4 6" />
      </svg>
    ),
  },
  {
    id: "series",
    label: "SERIES",
    system: "//002 CHRONICLE CORE//",
    sub: "Binge-worthy sagas & TV chronicles",
    color: "#7c51a0",
    glow: "rgba(124, 81, 160, 0.65)",
    canvasTheme: "cinema",
    count: "832 REALMS",
    bgImage: "/Images/got_throne.png",
    goldIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eed078" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="2" y="6" width="20" height="15" rx="2" />
        <path d="m17 2-5 4-5-4" />
        <line x1="17" y1="10" x2="17" y2="17" />
        <circle cx="17" cy="11" r="0.5" fill="#eed078" />
        <circle cx="17" cy="14" r="0.5" fill="#eed078" />
        <circle cx="17" cy="17" r="0.5" fill="#eed078" />
      </svg>
    ),
  },
  {
    id: "games",
    label: "GAMES",
    system: "//003 VIRTUAL CORE//",
    sub: "Immersive worlds & interactive epics",
    color: "#3a65b0",
    glow: "rgba(58, 101, 176, 0.65)",
    canvasTheme: "gaming",
    count: "1,572 REALMS",
    bgImage: "/Images/elden_ring_tree.png",
    goldIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eed078" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M6 12h4m-2-2v4" />
        <circle cx="15" cy="11" r="1.2" fill="#eed078" />
        <circle cx="18" cy="13" r="1.2" fill="#eed078" />
        <path d="M21 16V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4z" />
      </svg>
    ),
  },
  {
    id: "sports",
    label: "SPORTS",
    system: "//004 ARENA CORE//",
    sub: "Legends of the arena & historical eras",
    color: "#2a7556",
    glow: "rgba(42, 117, 86, 0.65)",
    canvasTheme: "sport",
    count: "620 REALMS",
    bgImage: "/Images/portal_sport.png",
    goldIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eed078" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
        <path d="M12 2a6 6 0 0 1 6 6v5a6 6 0 0 1-6 6 6 6 0 0 1-6-6V8a6 6 0 0 1 6-6z" />
      </svg>
    ),
  },
  {
    id: "anime",
    label: "ANIME",
    system: "//005 SHONEN CORE//",
    sub: "Animated masterpieces & grand realms",
    color: "#a63e62",
    glow: "rgba(166, 62, 98, 0.65)",
    canvasTheme: "gaming",
    count: "540 REALMS",
    bgImage: "/Images/witcher_forest.png",
    goldIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eed078" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="m5 12-2-6 6 2.5M19 12l2-6-6 2.5" />
        <path d="M12 21c-3.5-3-7-7-7-11a7 7 0 0 1 14 0c0 4-3.5 8-7 11z" />
        <path d="m8 11 2 1M16 11l-2 1" />
        <circle cx="12" cy="15" r="0.8" fill="#eed078" />
      </svg>
    ),
  },
  {
    id: "history",
    label: "HISTORY",
    system: "//006 ANNAL CORE//",
    sub: "Realms of the past & ancient empires",
    color: "#b47833",
    glow: "rgba(180, 120, 51, 0.65)",
    canvasTheme: "cinema",
    count: "1,120 REALMS",
    bgImage: "/Images/assassins_creed_dome.png",
    goldIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eed078" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="m2 7 10-5 10 5" />
        <path d="M4 7v10M8 7v10M12 7v10M16 7v10M20 7v10" />
        <path d="M2 17h20M2 21h20" />
      </svg>
    ),
  },
  {
    id: "mythology",
    label: "MYTHOLOGY",
    system: "//007 COSMOS CORE//",
    sub: "Pantheons of gods & legendary beasts",
    color: "#2d787a",
    glow: "rgba(45, 120, 122, 0.65)",
    canvasTheme: "sport",
    count: "980 REALMS",
    bgImage: "/Images/god_of_war_axe.png",
    goldIcon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#eed078" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 22V12" />
        <path d="M12 12c-2-1-4-3-4-6 0-3 2-4 4-4s4 1 4 4c0 3-2 5-4 6z" />
        <path d="M8 14c-1.5-1.5-2.5-3.5-2.5-5 0-2 1-3.5 2.5-3.5S10.5 7 10.5 9c0 1.5-1 3.5-2.5 5z" />
        <path d="M16 14c1.5-1.5 2.5-3.5 2.5-5 0-2-1-3.5-2.5-3.5S13.5 7 13.5 9c0 1.5-1 3.5-2.5 5z" />
      </svg>
    ),
  },
];

const UNIVERSES = [
  // === MOVIES ===
  {
    id: "lotr",
    category: "movies",
    title: "The Lord of the Rings",
    releaseYears: "2001–Present",
    rating: "9.5/10",
    categoryTags: ["FANTASY", "LORE", "MYSTIQUE"],
    image: "/Images/middle_earth_rivendell.png",
    href: "/universe/lotr",
    teaser:
      "Explore the vast chronology of Arda, from the creation of the Rings to the War of the Ring and beyond.",
    featured: true,
  },
  {
    id: "thehobbit",
    category: "movies",
    title: "The Hobbit",
    releaseYears: "2012–2014",
    rating: "8.8/10",
    categoryTags: ["HIGH FANTASY", "ADVENTURE", "DRAGONS"],
    image: "/Images/hobbit_erebor.png",
    href: "/universe/thehobbit",
    teaser:
      "Reclaim the Lonely Mountain from Smaug the Golden alongside Thorin Oakenshield and Bilbo Baggins.",
    featured: false,
  },
  {
    id: "harrypotter",
    category: "movies",
    title: "Harry Potter",
    releaseYears: "2001–2011",
    rating: "9.2/10",
    categoryTags: ["MAGIC", "ADVENTURE", "WIZARDS"],
    image: "/Images/harrypotter_castle.png",
    href: "/universe/harrypotter",
    teaser:
      "Unlock the historical annals of Hogwarts and the magical artifacts of the Wizarding World.",
    featured: true,
  },
  {
    id: "starwars",
    category: "movies",
    title: "Star Wars",
    releaseYears: "1977–Present",
    rating: "8.6/10",
    categoryTags: ["SCI-FI", "SPACE OPERA", "FORCE"],
    image: "/Images/starwars_sunset.png",
    href: "/universe/starwars",
    teaser:
      "Chronicle the eternal clash between Light and Dark across space, stars, and intergalactic history.",
    featured: true,
  },
  {
    id: "dune",
    category: "movies",
    title: "Dune",
    releaseYears: "2021–Present",
    rating: "8.5/10",
    categoryTags: ["SCI-FI", "DESERT", "PROPHECY"],
    image: "/Images/dune_desert.png",
    href: "/universe/dune",
    teaser:
      "Decipher the spice prophecy on Arrakis and study the deep history of the Great Houses.",
    featured: false,
  },
  {
    id: "avatar",
    category: "movies",
    title: "Avatar",
    releaseYears: "2009–Present",
    rating: "7.8/10",
    categoryTags: ["SCI-FI", "BIOLUMINESCENT", "NATURE"],
    image: "/Images/avatar_jungle.png",
    href: "/universe/avatar",
    teaser:
      "Access Pandora’s biological database and the rich history of the Na’vi clans.",
    featured: false,
  },
  {
    id: "interstellar",
    category: "movies",
    title: "Interstellar",
    releaseYears: "2014",
    rating: "8.7/10",
    categoryTags: ["SCI-FI", "SPACE", "RELATIVITY"],
    image: "/Images/cosmic_nebula.png",
    href: "/universe/interstellar",
    teaser:
      "Journey through a cosmic wormhole to find a new home for humanity across relativistic time.",
    featured: false,
  },
  {
    id: "bladerunner",
    category: "movies",
    title: "Blade Runner",
    releaseYears: "1982–2017",
    rating: "8.4/10",
    categoryTags: ["SCI-FI", "NEO-NOIR", "CYBERPUNK"],
    image: "/Images/bladerunner_spinner.png",
    href: "/universe/bladerunner",
    teaser:
      "Explore the neon-lit, rain-soaked streets of Los Angeles and trace the boundary of human and replicant.",
    featured: false,
  },
  {
    id: "alien",
    category: "movies",
    title: "Alien",
    releaseYears: "1979–Present",
    rating: "8.5/10",
    categoryTags: ["SCI-FI", "HORROR", "XENOMORPH"],
    image: "/Images/alien_xenomorph.png",
    href: "/universe/alien",
    teaser:
      "Survive the deep space terror of Weyland-Yutani expeditions and the lethal Xenomorph strain.",
    featured: false,
  },
  {
    id: "predator",
    category: "movies",
    title: "Predator",
    releaseYears: "1987–Present",
    rating: "7.8/10",
    categoryTags: ["SCI-FI", "ACTION", "HUNTER"],
    image: "/Images/predator_mask.png",
    href: "/universe/predator",
    teaser:
      "Study the hunting codes of the intergalactic Yautja warriors across Earth and the stars.",
    featured: false,
  },
  {
    id: "matrix",
    category: "movies",
    title: "The Matrix",
    releaseYears: "1999–Present",
    rating: "8.7/10",
    categoryTags: ["SCI-FI", "CYBERPUNK", "SIMULATION"],
    image: "/Images/matrix_code.png",
    href: "/universe/matrix",
    teaser:
      "Wake up from the simulated matrix to join the human resistance in Zion against the machine core.",
    featured: false,
  },
  {
    id: "marvel",
    category: "movies",
    title: "Marvel MCU",
    releaseYears: "2008–Present",
    rating: "8.4/10",
    categoryTags: ["SUPERHERO", "COSMIC", "ACTION"],
    image: "/Images/cosmic_sphere.png",
    href: "/universe/marvel",
    teaser:
      "Navigate the multiverse timeline and trace the origin coordinates of the infinity anomalies.",
    featured: false,
  },
  {
    id: "dcuniverse",
    category: "movies",
    title: "DC Universe",
    releaseYears: "2013–Present",
    rating: "7.9/10",
    categoryTags: ["SUPERHERO", "ACTION", "METAHUMAN"],
    image: "/Images/cosmic_nebula.png",
    href: "/universe/dcuniverse",
    teaser:
      "Explore the metropolitan battlegrounds of Gotham and Metropolis with Earth's Metahuman gods.",
    featured: false,
  },
  {
    id: "batman",
    category: "movies",
    title: "Batman",
    releaseYears: "1989–Present",
    rating: "9.0/10",
    categoryTags: ["ACTION", "CRIME", "VIGILANTE"],
    image: "/Images/portal_cinema.png",
    href: "/universe/batman",
    teaser:
      "Guard the shadow-drenched streets of Gotham City from Arkham Aslyum's chaotic inmates.",
    featured: false,
  },
  {
    id: "spiderverse",
    category: "movies",
    title: "Spider-Verse",
    releaseYears: "2018–Present",
    rating: "9.1/10",
    categoryTags: ["ANIMATION", "SUPERHERO", "MULTIVERSE"],
    image: "/Images/cosmic_nebula.png",
    href: "/universe/spiderverse",
    teaser:
      "Leap across parallel realities of the spider-web arachnid network with Miles Morales.",
    featured: false,
  },
  {
    id: "johnwick",
    category: "movies",
    title: "John Wick",
    releaseYears: "2014–Present",
    rating: "8.0/10",
    categoryTags: ["ACTION", "HITMAN", "HIGH TABLE"],
    image: "/Images/portal_gaming.png",
    href: "/universe/johnwick",
    teaser:
      "Enter the secretive assassin underworld of the Continental Hotel and the deadly High Table.",
    featured: false,
  },
  {
    id: "madmax",
    category: "movies",
    title: "Mad Max",
    releaseYears: "1979–Present",
    rating: "8.1/10",
    categoryTags: ["POST-APOCALYPSE", "CARS", "DESERT"],
    image: "/Images/dune_desert.png",
    href: "/universe/madmax",
    teaser:
      "Ride the radioactive, high-octane desert Wasteland with Max Rockatansky and Imperator Furiosa.",
    featured: false,
  },
  {
    id: "pirates",
    category: "movies",
    title: "Pirates of the Caribbean",
    releaseYears: "2003–Present",
    rating: "8.0/10",
    categoryTags: ["PIRATES", "MYTHOLOGY", "ADVENTURE"],
    image: "/Images/middle_earth_rivendell.png",
    href: "/universe/pirates",
    teaser:
      "Sail the cursed high seas of the Caribbean with the eccentric Captain Jack Sparrow.",
    featured: false,
  },

  // === SERIES ===
  {
    id: "got",
    category: "series",
    title: "Game of Thrones",
    releaseYears: "2011–2019",
    rating: "9.2/10",
    categoryTags: ["DARK FANTASY", "POLITICS", "EPIC"],
    image: "/Images/got_throne.png",
    href: "/universe/got",
    teaser:
      "Dive into the political schemes of Westeros and the frozen chronologies of the lands beyond the Wall.",
    featured: true,
  },
  {
    id: "houseofthedragon",
    category: "series",
    title: "House of the Dragon",
    releaseYears: "2022–Present",
    rating: "8.9/10",
    categoryTags: ["DARK FANTASY", "DRAGONS", "WAR"],
    image: "/Images/hotd_dragon.png",
    href: "/universe/houseofthedragon",
    teaser:
      "Witness the heights and tragic descent of the Targaryen dynasty during the historic Dance of Dragons.",
    featured: true,
  },
  {
    id: "ringsofpower",
    category: "series",
    title: "Rings of Power",
    releaseYears: "2022–Present",
    rating: "7.8/10",
    categoryTags: ["EPIC FANTASY", "SECOND AGE", "RINGS"],
    image: "/Images/rop_forging.png",
    href: "/universe/ringsofpower",
    teaser:
      "Witness the forging of the Rings of Power and the rising shadow of Sauron in the Second Age of Arda.",
    featured: false,
  },
  {
    id: "witcher-series",
    category: "series",
    title: "The Witcher (Series)",
    releaseYears: "2019–Present",
    rating: "8.0/10",
    categoryTags: ["DARK FANTASY", "MONSTERS", "MAGIC"],
    image: "/Images/witcher_forest.png",
    href: "/universe/witcher",
    teaser:
      "Trace the lineage of the mutant hunters and the cataclysmic events of the Conjunction of Spheres.",
    featured: false,
  },
  {
    id: "peakyblinders",
    category: "series",
    title: "Peaky Blinders",
    releaseYears: "2013–2022",
    rating: "8.8/10",
    categoryTags: ["CRIME", "DRAMA", "GANGS"],
    image: "/Images/portal_cinema.png",
    href: "/universe/peakyblinders",
    teaser:
      "Rule the industrial streets of Birmingham with the Shelby crime family and their peaky caps.",
    featured: false,
  },
  {
    id: "breakingbad",
    category: "series",
    title: "Breaking Bad",
    releaseYears: "2008–2013",
    rating: "9.5/10",
    categoryTags: ["CRIME", "EMPIRE", "DRAMA"],
    image: "/Images/breaking_bad_rv.png",
    href: "/universe/breakingbad",
    teaser:
      "Witness the chemical descent of Walter White from high school teacher into the drug kingpin Heisenberg.",
    featured: true,
  },
  {
    id: "strangerthings",
    category: "series",
    title: "Stranger Things",
    releaseYears: "2016–Present",
    rating: "8.7/10",
    categoryTags: ["SCI-FI", "MYSTERY", "RETRO"],
    image: "/Images/witcher_forest.png",
    href: "/universe/strangerthings",
    teaser:
      "Uncover the top-secret government laboratory tests in Hawkins and the terror of the Upside Down.",
    featured: false,
  },
  {
    id: "walkingdead",
    category: "series",
    title: "The Walking Dead",
    releaseYears: "2010–2022",
    rating: "8.2/10",
    categoryTags: ["ZOMBIES", "SURVIVAL", "DRAMA"],
    image: "/Images/witcher_forest.png",
    href: "/universe/walkingdead",
    teaser:
      "Navigate the post-apocalyptic walker wasteland, surviving hostile factions of survivors.",
    featured: false,
  },

  // === GAMES ===
  {
    id: "tes",
    category: "games",
    title: "The Elder Scrolls",
    releaseYears: "1994–Present",
    rating: "9.6/10",
    categoryTags: ["RPG", "OPEN WORLD", "LORE"],
    image: "/Images/tes_skyrim.png",
    href: "/universe/tes",
    teaser:
      "Explore the vast scrolls of Tamriel, from the shores of Morrowind to the snowy peaks of Skyrim.",
    featured: true,
  },
  {
    id: "eldenring",
    category: "games",
    title: "Elden Ring",
    releaseYears: "2022–Present",
    rating: "9.6/10",
    categoryTags: ["RPG", "SOULSLIKE", "RUNES"],
    image: "/Images/elden_ring_tree.png",
    href: "/universe/eldenring",
    teaser:
      "Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring in the Lands Between.",
    featured: true,
  },
  {
    id: "darksouls",
    category: "games",
    title: "Dark Souls",
    releaseYears: "2011–Present",
    rating: "9.5/10",
    categoryTags: ["RPG", "SOULSLIKE", "DARK FANTASY"],
    image: "/Images/rop_forging.png",
    href: "/universe/darksouls",
    teaser:
      "Link the fading First Flame in Lordran or embrace the age of Dark as the Chosen Undead.",
    featured: false,
  },
  {
    id: "bloodborne",
    category: "games",
    title: "Bloodborne",
    releaseYears: "2015",
    rating: "9.7/10",
    categoryTags: ["RPG", "SOULSLIKE", "LOVECRAFT"],
    image: "/Images/bloodborne_yharnam.png",
    href: "/universe/bloodborne",
    teaser:
      "Hunt beasts and ancient cosmic entities through the blood-drenched gothic streets of Yharnam.",
    featured: true,
  },
  {
    id: "gow",
    category: "games",
    title: "God of War",
    releaseYears: "2005–Present",
    rating: "9.7/10",
    categoryTags: ["ACTION", "MYTHOLOGY", "GODS"],
    image: "/Images/god_of_war_axe.png",
    href: "/universe/gow",
    teaser:
      "Embark on a gritty, emotional journey through the nine realms of Norse legend with Kratos and Atreus.",
    featured: false,
  },
  {
    id: "halo",
    category: "games",
    title: "Halo",
    releaseYears: "2001–Present",
    rating: "9.3/10",
    categoryTags: ["FPS", "SCI-FI", "SPARTAN"],
    image: "/Images/halo_ringworld.png",
    href: "/universe/halo",
    teaser:
      "Defend humanity against the Covenant forces on ancient, colossal ringworlds as the Master Chief.",
    featured: false,
  },
  {
    id: "diablo",
    category: "games",
    title: "Diablo",
    releaseYears: "1997–Present",
    rating: "9.0/10",
    categoryTags: ["ARPG", "HACK & SLASH", "DEMONS"],
    image: "/Images/diablo_cavern.png",
    href: "/universe/diablo",
    teaser:
      "Fight the hordes of the Burning Hells in Sanctuary and prevent the Lord of Terror from rising.",
    featured: false,
  },
  {
    id: "wow",
    category: "games",
    title: "World of Warcraft",
    releaseYears: "2004–Present",
    rating: "9.2/10",
    categoryTags: ["MMORPG", "MULTIPLAYER", "WAR"],
    image: "/Images/portal_gaming.png",
    href: "/universe/wow",
    teaser:
      "Join the struggle between Alliance and Horde in the ever-evolving world of Azeroth.",
    featured: false,
  },
  {
    id: "zelda",
    category: "games",
    title: "The Legend of Zelda",
    releaseYears: "1986–Present",
    rating: "9.7/10",
    categoryTags: ["ADVENTURE", "PUZZLE", "QUEST"],
    image: "/Images/witcher_forest.png",
    href: "/universe/zelda",
    teaser:
      "Embark on a timeless quest to save the kingdom of Hyrule and protect the legendary Triforce.",
    featured: false,
  },
  {
    id: "lol",
    category: "games",
    title: "League of Legends",
    releaseYears: "2009–Present",
    rating: "8.8/10",
    categoryTags: ["MOBA", "COMPETITIVE", "ARENA"],
    image: "/Images/portal_sport.png",
    href: "/universe/lol",
    teaser:
      "Enter the battle arenas of Runeterra and discover the epic histories of its diverse champions.",
    featured: false,
  },
  {
    id: "ac",
    category: "games",
    title: "Assassin’s Creed",
    releaseYears: "2007–Present",
    rating: "8.9/10",
    categoryTags: ["ACTION", "STEALTH", "HISTORY"],
    image: "/Images/assassins_creed_dome.png",
    href: "/universe/ac",
    teaser:
      "Relive the genetic memories of historical assassins in their secret war against the Templar Order.",
    featured: false,
  },
  {
    id: "cyberpunk",
    category: "games",
    title: "Cyberpunk 2077",
    releaseYears: "2020–Present",
    rating: "9.1/10",
    categoryTags: ["RPG", "SCI-FI", "NEON"],
    image: "/Images/cyberpunk_neon.png",
    href: "/universe/cyberpunk",
    teaser:
      "Navigate the high-tech, low-life streets of Night City as V, searching for a unique cybernetic implant.",
    featured: false,
  },
  {
    id: "masseffect",
    category: "games",
    title: "Mass Effect",
    releaseYears: "2007–Present",
    rating: "9.6/10",
    categoryTags: ["RPG", "SCI-FI", "SPACE OPERA"],
    image: "/Images/mass_effect_normandy.png",
    href: "/universe/masseffect",
    teaser:
      "Unite the species of the Milky Way as Commander Shepard to defeat the ancient machine Reaper menace.",
    featured: false,
  },
  {
    id: "reddead",
    category: "games",
    title: "Red Dead Redemption",
    releaseYears: "2010–2018",
    rating: "9.8/10",
    categoryTags: ["ACTION", "WESTERN", "OPEN WORLD"],
    image: "/Images/red_dead_sunset.png",
    href: "/universe/reddead",
    teaser:
      "Ride with the outlaw Van der Linde gang across the fading American Wild West frontier.",
    featured: false,
  },

  // === SPORTS ===
  {
    id: "football-history",
    category: "sports",
    title: "History of Football",
    releaseYears: "1930–Present",
    rating: "9.4/10",
    categoryTags: ["SPORTS", "FOOTBALL", "LEGENDS"],
    image: "/Images/portal_sport.png",
    href: "/universe/football-history",
    teaser:
      "Trace the greatest teams, legendary matches, and historic goalscorers from the first World Cup to the modern era.",
    featured: true,
  },
  {
    id: "nba-eras",
    category: "sports",
    title: "NBA Dynasties & Eras",
    releaseYears: "1946–Present",
    rating: "9.3/10",
    categoryTags: ["SPORTS", "BASKETBALL", "CHAMPIONS"],
    image: "/Images/portal_sport.png",
    href: "/universe/nba-eras",
    teaser:
      "Explore the golden eras of basketball: from the Celtics dominance to the Jordan dynasty and the modern superteams.",
    featured: false,
  },
  {
    id: "f1-history",
    category: "sports",
    title: "Formula 1 Racing Eras",
    releaseYears: "1950–Present",
    rating: "9.1/10",
    categoryTags: ["SPORTS", "RACING", "SPEED"],
    image: "/Images/portal_sport.png",
    href: "/universe/f1-history",
    teaser:
      "Journey through the high-octane history of motorsport, celebrating legendary drivers and revolutionary engineering breakthroughs.",
    featured: false,
  },
  {
    id: "olympics-ancient",
    category: "sports",
    title: "Ancient Olympic Games",
    releaseYears: "776 BC–393 AD",
    rating: "9.0/10",
    categoryTags: ["SPORTS", "OLYMPICS", "MYTHOLOGY"],
    image: "/Images/portal_sport.png",
    href: "/universe/olympics-ancient",
    teaser:
      "Uncover the sacred athletic and religious festivals of ancient Greece, celebrating pure physical excellence under the gods.",
    featured: false,
  },

  // === ANIME ===
  {
    id: "naruto",
    category: "anime",
    title: "Naruto",
    releaseYears: "2002–2017",
    rating: "8.7/10",
    categoryTags: ["ANIME", "NINJA", "CHAKRA"],
    image: "/Images/avatar_jungle.png",
    href: "/universe/naruto",
    teaser:
      "Follow the epic path of Naruto Uzumaki to become Hokage, tracing chakra, shinobi clans, and devastating ninja wars.",
    featured: true,
  },
  {
    id: "onepiece",
    category: "anime",
    title: "One Piece",
    releaseYears: "1999–Present",
    rating: "9.0/10",
    categoryTags: ["ANIME", "PIRATES", "ADVENTURE"],
    image: "/Images/middle_earth_map.png",
    href: "/universe/onepiece",
    teaser:
      "Set sail across the dangerous Grand Line with the Straw Hat crew to discover Gol D. Roger's ultimate treasure.",
    featured: true,
  },
  {
    id: "bleach",
    category: "anime",
    title: "Bleach",
    releaseYears: "2004–Present",
    rating: "8.2/10",
    categoryTags: ["ANIME", "SOUL REAPER", "MYSTICAL"],
    image: "/Images/cosmic_nebula.png",
    href: "/universe/bleach",
    teaser:
      "Guard the borders between the living world, Soul Society, and Hueco Mundo alongside Ichigo Kurosaki.",
    featured: false,
  },
  {
    id: "attackontitan",
    category: "anime",
    title: "Attack on Titan",
    releaseYears: "2013–2023",
    rating: "9.1/10",
    categoryTags: ["ANIME", "TITANS", "MILITARY"],
    image: "/Images/fellowship_mountain.png",
    href: "/universe/attackontitan",
    teaser:
      "Breach the massive walls of Paradis Island and uncover the ancient, tragic history of Eldia and Marley.",
    featured: false,
  },
  {
    id: "deathnote",
    category: "anime",
    title: "Death Note",
    releaseYears: "2006–2007",
    rating: "9.0/10",
    categoryTags: ["ANIME", "THRILLER", "SHINIGAMI"],
    image: "/Images/portal_cinema.png",
    href: "/universe/deathnote",
    teaser:
      "Engage in the high-stakes intellectual battle between Light Yagami and L over the notebook of death.",
    featured: false,
  },
  {
    id: "demonslayer",
    category: "anime",
    title: "Demon Slayer",
    releaseYears: "2019–Present",
    rating: "8.7/10",
    categoryTags: ["ANIME", "DEMONS", "SWORDSMAN"],
    image: "/Images/witcher_forest.png",
    href: "/universe/demonslayer",
    teaser:
      "Hunt deadly demons under the Taisho era moon with Tanjiro Kamado and the elite Demon Slayer Corps.",
    featured: false,
  },

  // === HISTORY ===
  {
    id: "roman-empire",
    category: "history",
    title: "The Roman Empire",
    releaseYears: "27 BC–476 AD",
    rating: "9.5/10",
    categoryTags: ["HISTORY", "ROME", "CONQUEST"],
    image: "/Images/assassins_creed_dome.png",
    href: "/universe/roman-empire",
    teaser:
      "Trace the legacy of Rome: from Julius Caesar's rise to Pax Romana, mighty legion tactics, and eventual fall.",
    featured: true,
  },
  {
    id: "ancient-egypt",
    category: "history",
    title: "Ancient Egypt Dynasties",
    releaseYears: "3100 BC–30 BC",
    rating: "9.4/10",
    categoryTags: ["HISTORY", "EGYPT", "PHARAOHS"],
    image: "/Images/dune_desert.png",
    href: "/universe/ancient-egypt",
    teaser:
      "Uncover the construction of the Great Pyramids, dynamic pharaoh lineages, and religious death rituals of the Nile.",
    featured: false,
  },
  {
    id: "feudal-japan",
    category: "history",
    title: "Feudal Japan",
    releaseYears: "1185–1868 AD",
    rating: "9.2/10",
    categoryTags: ["HISTORY", "SAMURAI", "SHOGUN"],
    image: "/Images/witcher_forest.png",
    href: "/universe/feudal-japan",
    teaser:
      "Study the Sengoku Jidai period, Bushido battle codes of the Samurai, and powerful Shogunate unification.",
    featured: false,
  },
  {
    id: "viking-age",
    category: "history",
    title: "The Viking Age",
    releaseYears: "793–1066 AD",
    rating: "9.0/10",
    categoryTags: ["HISTORY", "VIKINGS", "SHIPS"],
    image: "/Images/fellowship_mountain.png",
    href: "/universe/viking-age",
    teaser:
      "Sail the longships across the Baltic and North Sea, chronicling raids, Norse settlements, and legendary voyages.",
    featured: false,
  },

  // === MYTHOLOGY ===
  {
    id: "greek-myth",
    category: "mythology",
    title: "Greek Mythology",
    releaseYears: "Ancient Era",
    rating: "9.6/10",
    categoryTags: ["MYTHOLOGY", "OLYMPUS", "GODS"],
    image: "/Images/assassins_creed_dome.png",
    href: "/universe/greek-myth",
    teaser:
      "Enter Mount Olympus, cataloging the epic feuds of Zeus, Poseidon, Hades, and the heroic demigod trials.",
    featured: true,
  },
  {
    id: "norse-myth",
    category: "mythology",
    title: "Norse Mythology",
    releaseYears: "Viking Era",
    rating: "9.6/10",
    categoryTags: ["MYTHOLOGY", "NINE REALMS", "YGGDRASIL"],
    image: "/Images/god_of_war_axe.png",
    href: "/universe/norse-myth",
    teaser:
      "Explore the branches of Yggdrasil: from Valhalla banquets to the apocalyptic doom of Ragnarok with Odin and Thor.",
    featured: true,
  },
  {
    id: "egyptian-myth",
    category: "mythology",
    title: "Egyptian Mythology",
    releaseYears: "Pharaonic Era",
    rating: "9.3/10",
    categoryTags: ["MYTHOLOGY", "GODS", "AFTERLIFE"],
    image: "/Images/dune_desert.png",
    href: "/universe/egyptian-myth",
    teaser:
      "Decipher the Weighing of the Heart ritual, the voyage of Ra's sun boat, and the eternal clash of Horus and Set.",
    featured: false,
  },
  {
    id: "arthurian-legend",
    category: "mythology",
    title: "Arthurian Legend",
    releaseYears: "Medieval Era",
    rating: "9.1/10",
    categoryTags: ["MYTHOLOGY", "KNIGHTS", "CAMELOT"],
    image: "/Images/middle_earth_rivendell.png",
    href: "/universe/arthurian-legend",
    teaser:
      "Join the Round Table at Camelot, pursuing the Holy Grail alongside King Arthur, Merlin, and Lancelot.",
    featured: false,
  },
];

/* ── Standard simple compass for mini-cards ── */
function Compass({
  size = 40,
  color = "#c9933a",
  pulse = false,
}: {
  size?: number;
  color?: string;
  pulse?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      style={{
        animation: pulse
          ? "compass-pulse 3s ease-in-out infinite alternate"
          : undefined,
      }}
    >
      <defs>
        <radialGradient id="cg" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="1" />
          <stop offset="100%" stopColor={color} stopOpacity="0.1" />
        </radialGradient>
        <filter id="compass-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx="50"
        cy="50"
        r="47"
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.35"
        strokeDasharray="3 8"
      />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke={color}
        strokeWidth="1"
        strokeOpacity="0.7"
      />
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke={color}
        strokeWidth="0.5"
        strokeOpacity="0.35"
      />
      <line
        x1="50"
        y1="3"
        x2="50"
        y2="97"
        stroke={color}
        strokeWidth="0.6"
        strokeOpacity="0.4"
      />
      <line
        x1="3"
        y1="50"
        x2="97"
        y2="50"
        stroke={color}
        strokeWidth="0.6"
        strokeOpacity="0.4"
      />
      <polygon
        points="50,5 53.5,22 50,27 46.5,22"
        fill={color}
        opacity="1"
        filter="url(#compass-glow)"
      />
      <polygon points="50,95 53.5,78 50,73 46.5,78" fill={color} opacity="0.45" />
      <circle cx="50" cy="50" r="6" fill="url(#cg)" filter="url(#compass-glow)" />
      <circle cx="50" cy="50" r="2.8" fill="#fff" opacity="1" />
      <style>{`@keyframes compass-pulse{0%{opacity:.75;transform:scale(.97)}100%{opacity:1;transform:scale(1.04)}}`}</style>
    </svg>
  );
}

/* ── Ornate card corner ── */
function Corner({ rot = 0, color = "#c9933a" }: { rot?: number; color?: string }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      style={{ transform: `rotate(${rot}deg)`, opacity: 0.75 }}
    >
      <line x1="2" y1="2" x2="22" y2="2" stroke={color} strokeWidth="1" />
      <line x1="2" y1="2" x2="2" y2="22" stroke={color} strokeWidth="1" />
      <rect
        x="6"
        y="6"
        width="5"
        height="5"
        fill="none"
        stroke={color}
        strokeWidth="0.7"
        opacity="0.65"
      />
      <circle cx="2" cy="2" r="1.5" fill={color} opacity="0.7" />
    </svg>
  );
}

/* ── Interactive Era Portal Card (Magical Dimensional Gateways) ── */
function EraPortal({
  g,
  hovered,
  onClick,
  onEnter,
  onLeave,
}: {
  g: GenreDef;
  hovered: boolean;
  onClick: () => void;
  onEnter: () => void;
  onLeave: () => void;
}) {
  const { t } = useI18n();
  return (
    <div 
      className="relative cursor-none select-none transition-all duration-[750ms] ease-[cubic-bezier(0.25,1,0.5,1)] group w-full sm:w-auto"
      style={{ 
        width: "clamp(140px, 13.5vw, 215px)",
        height: "clamp(280px, 30vw, 470px)",
        transform: hovered ? "translateY(-18px) scale(1.06)" : "translateY(0) scale(1)",
      }}
      onClick={onClick}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* ── ATMOSPHERIC COLOURED BACK-GLOW (Bypasses overflow clipping) ── */}
      <div
        className="absolute pointer-events-none transition-all duration-700 ease-out z-0 filter blur-[40px] rounded-[180px_180px_24px_24px]"
        style={{
          inset: hovered ? "-55px" : "-25px",
          background: hovered 
            ? `radial-gradient(circle, rgba(238, 208, 120, 0.35) 0%, ${g.color}30 40%, transparent 75%)` 
            : `radial-gradient(circle, rgba(201, 147, 58, 0.15) 0%, ${g.color}10 60%, transparent 80%)`,
          opacity: hovered ? 1.0 : 0.60,
        }}
      />

      {/* ── SOLID ARCHED CINEMATIC PORTAL WINDOW ── */}
      <div
        className="relative w-full h-full rounded-[180px_180px_16px_16px] overflow-hidden z-10 flex flex-col justify-between items-center p-4 pb-6 border transition-all duration-700 ease-in-out"
        style={{
          border: hovered 
            ? "2px solid rgba(238, 208, 120, 0.95)" 
            : "1.5px solid rgba(201, 147, 58, 0.45)",
          boxShadow: hovered 
            ? `0 30px 80px rgba(0,0,0,0.99), inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 30px rgba(238, 208, 120, 0.18), 0 0 40px ${g.color}30` 
            : `0 16px 50px rgba(0,0,0,0.95), inset 0 0 40px rgba(0,0,0,0.9), inset 0 0 15px rgba(197, 147, 53, 0.18)`,
          background: "linear-gradient(180deg, rgba(15, 10, 4, 0.2) 0%, rgba(0, 0, 0, 0.95) 100%)",
        }}
      >
        {/* Cinematic Background Image (Recessed, mysterious gateway scenery) */}
        <div 
          className="absolute inset-0 z-0 transition-transform duration-[2000ms] ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none"
          style={{
            backgroundImage: `url(${g.bgImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 1.0,
            transform: hovered ? "scale(1.16)" : "scale(1.04)",
            filter: hovered 
              ? "brightness(0.85) contrast(1.2) saturate(1.0)" 
              : "brightness(0.65) contrast(1.15) saturate(0.85)",
          }}
        />

        {/* Dynamic color tint flare (magical portal interior atmosphere) */}
        <div
          className="absolute inset-0 z-5 pointer-events-none transition-opacity duration-700"
          style={{
            background: `radial-gradient(circle at center, ${g.color}15 0%, transparent 75%)`,
            opacity: hovered ? 1 : 0.50,
          }}
        />

        {/* Magical mist inside each card - Layer 1 (Clockwise) */}
        <div 
          className="absolute inset-0 opacity-40 z-5 pointer-events-none mix-blend-screen transition-opacity duration-1000"
          style={{
            background: `radial-gradient(circle at center, ${g.color}35 0%, transparent 60%)`,
            filter: "blur(20px)",
            transform: "translateY(20%) scale(1.5)",
            animation: hovered ? "mist-swirl 12s infinite linear" : "none",
          }}
        />

        {/* Magical mist inside each card - Layer 2 (Counter-clockwise) */}
        <div 
          className="absolute inset-0 z-5 pointer-events-none mix-blend-screen"
          style={{
            background: `radial-gradient(circle at 45% 65%, ${g.color}12 0%, transparent 60%)`,
            opacity: hovered ? 0.65 : 0.25,
            filter: "blur(8px)",
            animation: "portal-mist-swirl-reverse 18s linear infinite",
          }}
        />

        {/* Subtle light rays inside each card - Layer 1 */}
        <div 
          className="absolute inset-0 z-5 mix-blend-screen pointer-events-none transition-all duration-700"
          style={{
            backgroundImage: `
              linear-gradient(135deg, transparent 30%, ${g.color}18 45%, ${g.color}25 50%, ${g.color}18 55%, transparent 70%)
            `,
            backgroundSize: "200% 200%",
            opacity: hovered ? 0.70 : 0.30,
            filter: "blur(4px)",
            animation: "shimmer-rays 6s linear infinite",
          }}
        />

        {/* Subtle light rays inside each card - Layer 2 */}
        <div 
          className="absolute inset-0 z-5 mix-blend-color-dodge pointer-events-none transition-all duration-700"
          style={{
            backgroundImage: `
              linear-gradient(45deg, transparent 25%, ${g.color}12 45%, ${g.color}20 50%, ${g.color}12 55%, transparent 75%)
            `,
            backgroundSize: "200% 200%",
            opacity: hovered ? 0.55 : 0.20,
            filter: "blur(5px)",
            animation: "shimmer-rays 9s linear infinite reverse",
          }}
        />

        {/* Top atmospheric colored light spotlight beam */}
        <div
          className="absolute inset-x-0 top-0 h-2/3 z-5 pointer-events-none transition-opacity duration-700"
          style={{
            backgroundImage: `radial-gradient(ellipse at 50% 0%, rgba(238, 208, 120, 0.35) 0%, rgba(201,147,58,0.12) 50%, transparent 80%)`,
            opacity: hovered ? 1 : 0.60,
          }}
        />

        {/* Arch top golden rim light */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none z-10 transition-opacity duration-700"
          style={{
            height: '35%',
            background: `linear-gradient(180deg, ${g.color}18 0%, transparent 100%)`,
            opacity: hovered ? 1 : 0.55,
          }}
        />

        {/* Elegant Golden Engraved Inner Trim Frame */}
        <div 
          className="absolute inset-[6px] rounded-[175px_175px_11px_11px] pointer-events-none transition-all duration-700 z-10"
          style={{
            border: hovered 
              ? `1.5px solid rgba(238, 208, 120, 0.70)` 
              : `1px solid rgba(201, 147, 58, 0.30)`,
            boxShadow: hovered 
              ? `0 0 20px rgba(238, 208, 120, 0.30), inset 0 0 15px rgba(238, 208, 120, 0.15)` 
              : `0 0 10px rgba(201, 147, 58, 0.12), inset 0 0 8px rgba(201, 147, 58, 0.08)`,
          }}
        />

        {/* Bottom soft colored light mist rising up */}
        <div 
          className="absolute bottom-0 inset-x-0 h-36 pointer-events-none transition-all duration-700 z-10"
          style={{
            background: hovered
              ? `linear-gradient(to top, ${g.color}25 0%, ${g.color}08 50%, transparent 100%)`
              : `linear-gradient(to top, ${g.color}15 0%, ${g.color}04 40%, transparent 100%)`,
            opacity: hovered ? 0.90 : 0.70,
          }}
        />

        {/* Dark Vignette Overlay to ensure text readability */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: hovered
              ? "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.12) 65%, rgba(0,0,0,0.85) 100%)"
              : "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.22) 65%, rgba(0,0,0,0.92) 100%)",
          }}
        />

        {/* Inner Content (Icon, Label, Count stacked vertically) */}
        <div className="relative z-20 flex flex-col items-center gap-3 w-full text-center mt-auto pb-4">
          {/* Realm Icon */}
          <div 
            className="transition-all duration-[750ms] ease-out pb-0.5"
            style={{
              transform: hovered ? "scale(1.18) translateY(-6px)" : "scale(1)",
              filter: hovered 
                ? `drop-shadow(0 0 12px ${g.color})` 
                : `drop-shadow(0 0 4px ${g.color}60)`,
            }}
          >
            {g.goldIcon}
          </div>

          <div className="flex flex-col gap-0.5">
            {/* Title */}
            <h3
              style={{
                fontFamily: "'Cinzel', 'Times New Roman', serif",
                fontSize: "clamp(12px, 1vw, 14px)",
                letterSpacing: "0.28em",
                color: hovered ? "#ffffff" : "rgba(255,255,255,0.92)",
                textShadow: hovered
                  ? `0 0 12px rgba(238, 208, 120, 0.90), 0 0 22px ${g.color}60, 0 2px 4px rgba(0,0,0,0.8)`
                  : `0 0 8px rgba(238,208,120,0.25), 0 2px 6px rgba(0,0,0,0.9)`,
                transition: "all 0.5s",
                whiteSpace: "nowrap",
              }}
              className="font-normal"
            >
              {t('genre.' + g.id) !== `[MISSING: genre.${g.id}]` ? t('genre.' + g.id) : g.label}
            </h3>

            {/* Realm Count */}
            <span 
              className="font-mono tracking-[0.22em] transition-colors duration-500 font-semibold uppercase"
              style={{
                fontSize: 'clamp(7px, 0.65vw, 9px)',
                color: hovered ? g.color : "rgba(238,208,120,0.55)",
                textShadow: hovered ? `0 0 8px ${g.color}80` : 'none',
              }}
            >
              {g.count.split(' ')[0]} {t('uni.realms')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Ticker ── */
function Ticker() {
  const { t } = useI18n();
  const items = [
    t('ticker.archiveRemembers'),
    "⊕",
    t('ticker.futureAwaits'),
    "⊕",
    t('ticker.worldsEvolve'),
    "⊕",
    t('ticker.storiesEndure'),
    "⊕",
  ];
  const doubled = [...items, ...items];
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none overflow-hidden"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(2,1,5,0.85)",
        backdropFilter: "blur(16px)",
        padding: "9px 0",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          whiteSpace: "nowrap",
          animation: "marquee 35s linear infinite",
        }}
      >
        {doubled.map((w, i) => (
          <span
            key={i}
            style={{
              fontSize: 7,
              letterSpacing: "0.55em",
              color: "rgba(201,147,58,0.25)",
              margin: "0 1.5rem",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            {w}
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
    </div>
  );
}

/* ── Reusable Netflix-Style Scrolling Row Wrapper with Hover Chevrons ── */
function NetflixScrollRow({ children }: { children: React.ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const scrollAmount = 560;
      rowRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/row w-full">
      {/* Left scroll chevron - hidden on tablet, shown on desktop */}
      <button
        onClick={() => scroll("left")}
        className="hidden md:flex absolute left-1 top-[45%] -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/10 bg-black/80 hover:bg-amber-500/20 text-white hover:text-amber-200 opacity-0 group-hover/row:opacity-100 transition-all duration-300 items-center justify-center cursor-none focus:outline-none"
        style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.8)" }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {/* Row container - horizontal scroll on desktop, 2-column grid on tablet */}
      <div
        ref={rowRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:flex gap-4 md:gap-6 scrollbar-none pb-4 scroll-smooth w-full px-2 snap-x snap-mandatory pt-2"
        style={{ scrollbarWidth: "none" }}
      >
        {children}
      </div>

      {/* Right scroll chevron - hidden on tablet, shown on desktop */}
      <button
        onClick={() => scroll("right")}
        className="hidden md:flex absolute right-1 top-[45%] -translate-y-1/2 z-30 w-11 h-11 rounded-full border border-white/10 bg-black/80 hover:bg-amber-500/20 text-white hover:text-amber-200 opacity-0 group-hover/row:opacity-100 transition-all duration-300 items-center justify-center cursor-none focus:outline-none"
        style={{ boxShadow: "0 4px 15px rgba(0,0,0,0.8)" }}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.25 4.5l7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}

/* ── Main Homepage ── */
export default function Home() {
  const { startTransition } = useTransitionPortal();
  const {
    playHover,
    playClick,
    playEraTransition,
    setBackgroundMusic,
    setAmbientTone,
  } = useAudio();
  const { t } = useI18n();
  const [selectedGenre, setSelectedGenre] = useState<Genre>(null);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // ── Live Supabase Data ─────────────────────────────────────
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings>(DEFAULT_HOMEPAGE_SETTINGS);
  const [liveGenres, setLiveGenres] = useState<GenreDef[]>(GENRES);
  const [liveUniverses, setLiveUniverses] = useState<any[]>([]);
  // Static logo symbol asset - never affected by admin edits
  const staticLogoSymbolUrl = "/Images/oryndor_symbol.png";
  // Track if static logo image loaded successfully
  const [staticLogoLoaded, setStaticLogoLoaded] = useState(false);

  useEffect(() => {
    const loadCmsContent = async () => {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.log('Supabase not configured, using default data');
        return;
      }

      try {
        const [homepageRes, portalsRes, universesRes] = await Promise.all([
          supabase.from("homepage_settings").select("*").eq("id", "homepage").maybeSingle(),
          supabase.from("portals").select("*").eq("visibility", true).order("sort_order", { ascending: true }),
          supabase
            .from("universes")
            .select("id,title,description,rating,release_years,category_tags,backdrop,poster_image,accent_color,button_text,slug,status,featured_hero,universe_type,portal_id,tags,translations,sort_order")
            .neq("status", "hidden")
            .neq("status", "draft")
            .order("sort_order", { ascending: true }),
        ]);

      if (homepageRes.data) {
        setHomepageSettings({
          ...DEFAULT_HOMEPAGE_SETTINGS,
          ...homepageRes.data,
          portal_cards: homepageRes.data.portal_cards || [],
          effects_config: homepageRes.data.effects_config || {},
        });
      }

      const portalSlugById = new Map<string, string>();
      if (portalsRes.data && portalsRes.data.length > 0) {
        setLiveGenres(
          portalsRes.data.map((portal: any, index: number) => {
            const fallback = GENRES.find((g) => g.id === portal.id || g.id === portal.slug) || GENRES[index % GENRES.length];
            const portalSlug = portal.slug || fallback.id || portal.id;
            if (portal.id) portalSlugById.set(portal.id, portalSlug);
            if (portal.slug) portalSlugById.set(portal.slug, portalSlug);
            return {
              id: portalSlug,
              label: (portal.name || portal.slug || "Portal").toUpperCase(),
              system: portal.system_label || fallback.system,
              sub: portal.subtitle || portal.description || fallback.sub,
              color: portal.color_theme || fallback.color,
              glow: portal.glow_color || fallback.glow,
              canvasTheme: fallback.canvasTheme,
              count: portal.count_label || fallback.count,
              bgImage: portal.background_image || fallback.bgImage,
              goldIcon: fallback.goldIcon,
            };
          })
        );
      }

      if (universesRes.data && universesRes.data.length > 0) {
        const cmsUniverses = universesRes.data.map((db: any) => {
          const normalizedCategory = portalSlugById.get(db.portal_id) || db.portal_id || db.universe_type || "movies";
          return {
            id: db.id,
            category: normalizedCategory,
            title: db.title || "Untitled",
            releaseYears: db.release_years || "",
            rating: db.rating || "",
            categoryTags: Array.isArray(db.category_tags) ? db.category_tags : [],
            image: db.backdrop || db.poster_image || "",
            href: db.slug?.startsWith("/") ? db.slug : `/universe/${db.slug || db.id}`,
            teaser: db.description || "",
            featured: db.featured_hero || false,
            accentColor: db.accent_color,
            buttonText: db.button_text,
          };
        });
        const cmsUniverseKeys = new Set(cmsUniverses.map((u: any) => String(u.id || u.title).toLowerCase()));
        const fallbackUniverses = UNIVERSES.filter((u) => !cmsUniverseKeys.has(String(u.id || u.title).toLowerCase()));
        setLiveUniverses([...cmsUniverses, ...fallbackUniverses]);
      } else {
        setLiveUniverses(UNIVERSES);
      }
      } catch (error) {
        console.error('Error loading CMS content:', error);
        // Use default data on error
        setLiveUniverses(UNIVERSES);
      }
    };

    loadCmsContent();
  }, []);

  // Listen for preview updates from admin editor
  // DISABLED: PostMessage listener was overriding CSS/layout changes
  // Only content fields should be updated, layout is controlled by hardcoded CSS
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Temporarily disabled to allow CSS/layout changes to take effect
      // Re-enable after fixing the merge logic to only update content fields
      /*
      if (event.data?.type === "ORYVON_PREVIEW_UPDATE" && event.data.payload?.homepageSettings) {
        const draftSettings = event.data.payload.homepageSettings;

        console.log("savedHomepage", homepageSettings);
        console.log("draftHomepage", draftSettings);

        // Deep merge: only override fields that are present in draft
        setHomepageSettings(prev => {
          const merged = { ...prev };

          // Only update fields that exist in draftSettings and are not undefined
          Object.keys(draftSettings).forEach(key => {
            if (draftSettings[key] !== undefined && draftSettings[key] !== null) {
              merged[key as keyof typeof merged] = draftSettings[key];
            }
          });

          // Explicitly preserve critical fields if not in draft or if empty string
          if (draftSettings.portal_cards === undefined) {
            merged.portal_cards = prev.portal_cards;
          }
          // Never accept empty hero_logo_url from preview - preserve previous value
          if (draftSettings.hero_logo_url === undefined || draftSettings.hero_logo_url === "" || draftSettings.hero_logo_url === null) {
            merged.hero_logo_url = prev.hero_logo_url;
          }
          if (draftSettings.background_image_url === undefined || draftSettings.background_image_url === "") {
            merged.background_image_url = prev.background_image_url;
          }

          console.log("mergedPreviewHomepage", merged);
          return merged;
        });

        // Only update genres if portal cards are explicitly provided in draft
        if (draftSettings.portal_cards && draftSettings.portal_cards.length > 0) {
          const previewPortals = draftSettings.portal_cards;
          const portalSlugById = new Map<string, string>();

          const mergedGenres = previewPortals.map((portal: any, index: number) => {
            const fallback = GENRES.find((g) => g.id === portal.id || g.id === portal.slug) || GENRES[index % GENRES.length];
            const portalSlug = portal.slug || fallback.id || portal.id;
            if (portal.id) portalSlugById.set(portal.id, portalSlug);
            if (portal.slug) portalSlugById.set(portal.slug, portalSlug);
            return {
              id: portalSlug,
              label: (portal.name || portal.slug || "Portal").toUpperCase(),
              system: portal.system_label || fallback.system,
              sub: portal.subtitle || portal.description || fallback.sub,
              color: portal.color_theme || fallback.color,
              glow: portal.glow_color || fallback.glow,
              canvasTheme: fallback.canvasTheme,
              count: portal.count_label || fallback.count,
              bgImage: portal.background_image || fallback.bgImage,
              goldIcon: fallback.goldIcon,
            };
          });

          setLiveGenres(mergedGenres);
        }
      }
      */
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const [stardust, setStardust] = useState<{ id: number; style: React.CSSProperties }[]>([]);

  useEffect(() => {
    const particles = Array.from({ length: 28 }).map((_, i) => {
      const size = Math.random() * 2.2 + 0.8;
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const duration = Math.random() * 18 + 12;
      const delay = Math.random() * -20;
      const opacity = Math.random() * 0.55 + 0.20;

      return {
        id: i,
        style: {
          position: "absolute" as const,
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: "#eed078",
          borderRadius: "50%",
          left: `${left}%`,
          top: `${top}%`,
          opacity: opacity,
          animation: `gold-float ${duration}s ease-in-out ${delay}s infinite alternate`,
          pointerEvents: "none" as const,
          boxShadow: size > 1.8 ? "0 0 6px rgba(255, 233, 163, 0.75)" : "none",
        },
      };
    });
    setStardust(particles);
  }, []);

  // Search & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  // Hero Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselTimerRef = useRef<NodeJS.Timeout | null>(null);

  useCinematicScroll();

  useEffect(() => {
    setBackgroundMusic("/sound/Space.mp3");
  }, [setBackgroundMusic]);

  // Stagger entrance — opacity/transform only
  useEffect(() => {
    gsap.fromTo(
      mainRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.6, ease: "power2.inOut" }
    );
    gsap.fromTo(
      ".hero-logo",
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: 1.8, delay: 0.35, ease: "expo.out" }
    );
    gsap.fromTo(
      ".hero-sub",
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 1.4, delay: 0.9, ease: "power3.out" }
    );
  }, []);

  // Listen to TopNavbar home button click to reset genre selection and scroll back to top
  useEffect(() => {
    const handleReset = () => {
      setSelectedGenre(null);
      setSearchQuery("");
      setSelectedTag(null);
      setActiveSlide(0);
      setAmbientTone(0.0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    window.addEventListener("oryvon-reset-genre", handleReset);
    return () => window.removeEventListener("oryvon-reset-genre", handleReset);
  }, [setAmbientTone]);

  // Sync selectedGenre status with global TopNavbar component
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("oryvon-genre-updated", {
        detail: { genre: selectedGenre },
      })
    );
    if (typeof window !== "undefined") {
      if (selectedGenre === null) {
        document.body.classList.add("home-page-active");
      } else {
        document.body.classList.remove("home-page-active");
      }
    }
    return () => {
      if (typeof window !== "undefined") {
        document.body.classList.remove("home-page-active");
      }
    };
  }, [selectedGenre]);

  const handleGenreClick = useCallback(
    (id: Genre) => {
      playEraTransition();
      setSelectedGenre(id);
      setSearchQuery("");
      setSelectedTag(null);
      setActiveSlide(0);
      setAmbientTone(0.0);

      // Smooth scroll back to the top of the page to reset the view for the new portal
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      setTimeout(() => {
        gsap.fromTo(
          ".timeline-card",
          { opacity: 0, scale: 0.9, y: 25 },
          {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power2.out",
          }
        );
        gsap.fromTo(
          ".carousel-container",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }
        );
      }, 50);
    },
    [playEraTransition, setAmbientTone]
  );

  // Filter Active Universes list
  const defaultGenreInfo = {
    id: null as any,
    label: "ALL",
    system: "//000 DIMENSIONAL MATRIX//",
    sub: "Explore all realms in the multiverse",
    color: "#eed078",
    glow: "rgba(238,208,120,0.55)",
    canvasTheme: "cinema" as any,
    count: `${liveUniverses.length || UNIVERSES.length} REALMS`,
  };
  const activeGenreInfo = liveGenres.find((g) => g.id === selectedGenre) || defaultGenreInfo;
  const fallbackGenreUniverses = selectedGenre
    ? UNIVERSES.filter((u) => u.category === selectedGenre)
    : UNIVERSES;
  const liveGenreUniverses = selectedGenre
    ? liveUniverses.filter((u) => {
        const category = String(u.category || "").toLowerCase();
        const selected = String(selectedGenre).toLowerCase();
        return category === selected || category.includes(selected) || selected.includes(category);
      })
    : liveUniverses;
  const genreUniverses = liveGenreUniverses.length > 0 ? liveGenreUniverses : fallbackGenreUniverses;

  // Gather all unique tags inside the current genre dynamically
  const dynamicTags = Array.from(
    new Set(genreUniverses.flatMap((u) => u.categoryTags))
  );

  // Apply search query and tag filter
  const filteredUniverses = genreUniverses.filter((uni) => {
    const matchesSearch =
      uni.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.teaser.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.categoryTags.some((tag: string) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesTag = selectedTag ? uni.categoryTags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  // Carousel universes: find featured ones, fallback to first 3 if none
  const carouselUniverses = genreUniverses.filter((u) => u.featured).slice(0, 3);
  const featuredSlides =
    carouselUniverses.length > 0
      ? carouselUniverses
      : genreUniverses.slice(0, 3);

  const activeSlideColor = liveGenres.find((g) => g.id === featuredSlides[activeSlide]?.category)?.color || "#eed078";

  // Setup carousel automatic cycle
  useEffect(() => {
    if (featuredSlides.length <= 1) return;

    const startTimer = () => {
      carouselTimerRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % featuredSlides.length);
      }, 6500);
    };

    startTimer();
    return () => {
      if (carouselTimerRef.current) clearInterval(carouselTimerRef.current);
    };
  }, [selectedGenre, featuredSlides.length]);

  const handleSlideChange = (index: number) => {
    playHover();
    setActiveSlide(index);
    if (carouselTimerRef.current) {
      clearInterval(carouselTimerRef.current);
      // Restart cycle
      carouselTimerRef.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % featuredSlides.length);
      }, 6500);
    }
  };

  // Group cards into cinematic sections
  const trendingUniverses = selectedGenre
    ? filteredUniverses.slice(0, 8)
    : filteredUniverses.slice(0, 6);

  const topRatedUniverses = selectedGenre
    ? filteredUniverses.filter((u) => parseFloat(u.rating.split("/")[0]) >= 8.8)
    : filteredUniverses.filter((u) => parseFloat(u.rating.split("/")[0]) >= 9.0);

  const popularUniverses = selectedGenre
    ? filteredUniverses.slice().reverse().slice(0, 8)
    : filteredUniverses.slice(3, 9);
  
  const recentlyUpdatedUniverses = selectedGenre
    ? filteredUniverses.slice(1, 7)
    : filteredUniverses.slice().reverse().slice(0, 6);

  const continueExploringUniverses = selectedGenre
    ? filteredUniverses.slice(Math.max(0, filteredUniverses.length - 6)).reverse()
    : filteredUniverses.slice(6, 14);

  const activeBgTimeline = selectedGenre
    ? featuredSlides[activeSlide]?.id || null
    : hoveredItem;

  // Read previewWidth query parameter for admin preview
  const [previewWidth, setPreviewWidth] = useState<number | null>(null);
  
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const width = urlParams.get("previewWidth");
      if (width) {
        setPreviewWidth(parseInt(width, 10));
        
        // Dynamically set viewport meta tag for correct CSS media query triggering
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta) {
          viewportMeta.setAttribute('content', `width=${width}, initial-scale=1.0`);
        } else {
          const meta = document.createElement('meta');
          meta.name = 'viewport';
          meta.content = `width=${width}, initial-scale=1.0`;
          document.head.appendChild(meta);
        }
      }
    }
  }, []);

  return (
    <div 
      className="w-full bg-[#020101] text-white"
      style={previewWidth ? { width: `${previewWidth}px`, margin: "0 auto" } : undefined}
    >
      <main
        ref={mainRef}
        className="w-full flex flex-col items-center justify-start relative bg-[#020101]"
      >
        {/* Background canvas layers (WebGL stars, nebula mist, and colossal 3D orbit rings) */}
        <div className="fixed inset-0 z-0 pointer-events-none oryvon-bg-root">
          <HomeBackground activeTimeline={activeBgTimeline} />
          {homepageSettings.background_image_url && !selectedGenre && (
            <div
              className="absolute inset-0 bg-cover bg-center opacity-45"
              style={{ backgroundImage: `url(${homepageSettings.background_image_url})` }}
            />
          )}
        </div>

        <div
          className={`absolute top-0 left-0 w-full h-[100vh] pointer-events-none oryvon-gpu-layer transition-opacity duration-700 ease-out ${
            selectedGenre ? "opacity-0" : "hero-scroll-fade"
          }`}
          style={{ zIndex: 2 }}
        >
          <div
            className="god-ray-stable absolute left-1/2 top-0 -translate-x-1/2"
            style={{
              width: 700,
              height: "75%",
              background:
                "linear-gradient(180deg, rgba(201,147,58,0.12) 0%, rgba(180,120,20,0.035) 60%, transparent 100%)",
              clipPath: "polygon(38% 0, 62% 0, 80% 100%, 20% 100%)",
            }}
          />
        </div>

        {/* Content wrapper */}
        <div 
          className="w-full flex flex-col justify-between items-center relative z-30"
          style={{
            paddingTop: 'clamp(1rem, 2vw, 2rem)',
            paddingBottom: 'clamp(3rem, 6vw, 6rem)',
            paddingLeft: 'clamp(1rem, 2vw, 2.5rem)',
            paddingRight: 'clamp(1rem, 2vw, 2.5rem)',
          }}
        >
          {selectedGenre && activeGenreInfo ? (
            /* ── Immersive Unified Netflix/IMDb Multiverse Portal (Layer 1) ── */
            <div 
              className="flex flex-col items-center w-full"
              style={{
                paddingTop: 'clamp(2rem, 4vw, 4rem)',
                gap: 'clamp(1.5rem, 3vw, 3rem)',
              }}
            >
              {/* Top Navigation Bar */}
              <div 
                className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/10"
                style={{
                  maxWidth: 'clamp(1400px, 90vw, 1920px)',
                  width: '100%',
                  paddingBottom: 'clamp(1rem, 1.5vw, 1.5rem)',
                  paddingLeft: 'clamp(1rem, 2vw, 2.5rem)',
                  paddingRight: 'clamp(1rem, 2vw, 2.5rem)',
                }}
              >
                <div className="flex flex-col items-center md:items-start gap-1">
                  <span
                    className="font-mono text-[7px] md:text-[8px] tracking-[0.4em] uppercase"
                    style={{ color: activeGenreInfo.color }}
                  >
                    {t('common.systemActive')} // {activeGenreInfo.system}
                  </span>
                  <h2
                    className="font-normal tracking-[0.2em] text-white uppercase"
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: 'clamp(1.25rem, 2vw, 2rem)',
                    }}
                  >
                    {activeGenreInfo.label} {t('uni.realms').toUpperCase()}
                  </h2>
                </div>

                <div className="flex items-center gap-4 md:gap-6">
                  <OryndorLogo size={160} variant="horizontal" />
                  <button
                    onClick={() => handleGenreClick(null)}
                    className="px-5 py-2.5 md:px-6 md:py-3 rounded-full border font-mono uppercase text-white/50 hover:text-white transition-all duration-300 bg-white/5 cursor-none flex items-center gap-2 text-[9px] md:text-[10px] tracking-[0.3em]"
                    style={{
                      borderColor: "rgba(255,255,255,0.1)",
                    }}
                    onMouseEnter={playHover}
                  >
                    ← {t('home.leavePortal')}
                  </button>
                </div>
              </div>



              {/* Widescreen Hero Carousel (Cinema grade overview) */}
              {featuredSlides.length > 0 && (
                <div 
                  className="relative rounded-xl overflow-hidden mb-6"
                  style={{
                    maxWidth: 'clamp(1400px, 90vw, 1920px)',
                    width: '100%',
                    paddingLeft: 'clamp(1rem, 2vw, 2.5rem)',
                    paddingRight: 'clamp(1rem, 2vw, 2.5rem)',
                  }}
                >
                  <div
                    className="relative w-full rounded-xl overflow-hidden border border-white/10 bg-cover bg-center transition-all duration-1000 ease-in-out"
                    style={{
                      aspectRatio: '21 / 9',
                      minHeight: 'clamp(18rem, 40vw, 35rem)',
                      backgroundImage: `url(${featuredSlides[activeSlide].image})`,
                      boxShadow: `0 20px 80px rgba(0,0,0,0.95), inset 0 0 100px rgba(0,0,0,0.85)`,
                    }}
                  >
                    {/* Atmospheric dark gradient overlays to ensure extreme readability and visual hierarchy */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent z-10" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#020101] via-transparent to-black/35 z-10" />

                    {/* Floating Cinematic details */}
                    <div className="absolute left-4 md:left-8 lg:left-16 bottom-6 md:bottom-8 lg:bottom-12 z-20 max-w-xl md:max-w-2xl flex flex-col gap-2 md:gap-3 lg:gap-4 px-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <span className="bg-amber-500/25 border border-amber-500/50 px-2 md:px-3 py-0.5 rounded font-mono text-[8px] md:text-[9px] text-amber-300 tracking-[0.1em]">
                          ★ {featuredSlides[activeSlide].rating} IMDb
                        </span>
                        <span className="font-mono text-[8px] md:text-[9px] text-white/45 tracking-[0.2em]">
                          {featuredSlides[activeSlide].releaseYears}
                        </span>
                      </div>

                      <h1
                        className="font-normal tracking-[0.15em] text-white leading-tight"
                        style={{
                          fontFamily: "'Cinzel', serif",
                          fontSize: 'clamp(1.75rem, 3vw, 3.5rem)',
                          textShadow: "0 4px 20px rgba(0,0,0,0.8)",
                        }}
                      >
                        {featuredSlides[activeSlide].title}
                      </h1>

                      <div className="flex flex-wrap gap-1.5 md:gap-2">
                        {featuredSlides[activeSlide].categoryTags.map(
                          (tag: string, idx: number) => (
                            <span
                              key={idx}
                              className="bg-white/5 border border-white/10 px-2 md:px-3 py-0.5 md:py-1 rounded-full font-mono text-[7px] md:text-[8px] text-white/70 tracking-[0.15em] uppercase"
                            >
                              {tag}
                            </span>
                          )
                        )}
                      </div>

                      <p 
                        className="font-sans leading-relaxed tracking-wide line-clamp-2 md:line-clamp-3"
                        style={{
                          color: 'rgba(255,255,255,0.7)',
                          fontSize: 'clamp(0.875rem, 1.2vw, 1.125rem)',
                          marginTop: 'clamp(0.5rem, 1vw, 1rem)',
                        }}
                      >
                        {featuredSlides[activeSlide].teaser}
                      </p>

                      {/* Massive glow ENTER portal button */}
                      <div className="mt-3 md:mt-4 lg:mt-6 flex items-center gap-3 md:gap-4">
                        <button
                          onClick={() => {
                            playEraTransition();
                            if (featuredSlides[activeSlide].href) {
                              startTransition(
                                featuredSlides[activeSlide].href,
                                featuredSlides[activeSlide].id
                              );
                            } else {
                              startTransition(
                                `/universe/${featuredSlides[activeSlide].id}`,
                                featuredSlides[activeSlide].id
                              );
                            }
                          }}
                          className="px-6 py-2.5 md:px-8 md:py-3.5 rounded font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-black font-semibold transition-all duration-300 hover:scale-105 cursor-none flex items-center gap-2 md:gap-3 uppercase shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                          style={{
                            background: activeGenreInfo.color,
                            boxShadow: `0 0 25px ${activeGenreInfo.color}44`,
                          }}
                          onMouseEnter={playHover}
                        >
                          ENTER UNIVERSE
                          <svg
                            className="w-3 h-3 text-black"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Right side navigation dots */}
                    <div className="absolute right-4 md:right-8 lg:right-12 bottom-6 md:bottom-8 lg:bottom-12 z-20 flex gap-2 md:gap-2.5">
                      {featuredSlides.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSlideChange(idx)}
                          className={`h-1.5 md:h-2 rounded-full transition-all duration-500 cursor-none ${
                            activeSlide === idx ? "w-6 md:w-8" : "w-1.5 md:w-2 bg-white/20"
                          }`}
                          style={{
                            backgroundColor:
                              activeSlide === idx
                                ? activeGenreInfo.color
                                : undefined,
                            boxShadow:
                              activeSlide === idx
                                ? `0 0 10px ${activeGenreInfo.color}`
                                : "none",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Filter & Search Console */}
              <div 
                className="flex flex-col lg:flex-row gap-4 justify-between items-center rounded-xl backdrop-blur-md"
                style={{
                  maxWidth: 'clamp(1400px, 90vw, 1920px)',
                  width: '100%',
                  paddingLeft: 'clamp(1rem, 2vw, 2.5rem)',
                  paddingRight: 'clamp(1rem, 2vw, 2.5rem)',
                  paddingTop: 'clamp(0.75rem, 1.25vw, 1.25rem)',
                  paddingBottom: 'clamp(0.75rem, 1.25vw, 1.25rem)',
                  marginBottom: 'clamp(0.75rem, 1.25vw, 1.25rem)',
                  backgroundColor: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                {/* Search Bar */}
                <div className="relative w-full lg:max-w-md">
                  <input
                    type="text"
                    placeholder={t('home.searchArchive')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-lg py-3 md:py-3.5 pl-10 md:pl-12 pr-4 font-mono text-[8px] md:text-[9px] tracking-[0.2em] text-white focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all duration-300 uppercase placeholder:text-white/20"
                  />
                  <svg
                    className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 w-3.5 md:w-4 h-3.5 md:h-4 text-white/30"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Dynamic Sub-genre Filters */}
                <div className="flex flex-wrap items-center gap-2 md:gap-2.5 justify-center">
                  <button
                    onClick={() => {
                      playHover();
                      setSelectedTag(null);
                    }}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full font-mono text-[7px] md:text-[8px] tracking-[0.15em] border transition-all duration-300 uppercase cursor-none ${
                      !selectedTag
                        ? "text-black font-semibold"
                        : "text-white/50 border-white/10 hover:text-white bg-white/5"
                    }`}
                    style={{
                      backgroundColor: !selectedTag
                        ? activeGenreInfo.color
                        : undefined,
                      borderColor: !selectedTag
                        ? activeGenreInfo.color
                        : undefined,
                    }}
                  >
                    {t('home.allRealms')}
                  </button>
                  {dynamicTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        playHover();
                        setSelectedTag(tag);
                      }}
                      className={`px-3 md:px-4 py-1.5 md:py-2 rounded-full font-mono text-[7px] md:text-[8px] tracking-[0.15em] border transition-all duration-300 uppercase cursor-none ${
                        selectedTag === tag
                          ? "text-black font-semibold"
                          : "text-white/50 border-white/10 hover:text-white bg-white/5"
                      }`}
                      style={{
                        backgroundColor:
                          selectedTag === tag
                            ? activeGenreInfo.color
                            : undefined,
                        borderColor:
                          selectedTag === tag
                            ? activeGenreInfo.color
                            : undefined,
                        boxShadow:
                          selectedTag === tag
                            ? `0 0 15px ${activeGenreInfo.color}55`
                            : "none",
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── High-Density Netflix Scrolling Rows ── */}
              {filteredUniverses.length === 0 ? (
                <div className="w-full text-center py-20 flex flex-col items-center gap-4">
                  <Compass size={60} color={activeGenreInfo.color} pulse />
                  <span className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase">
                    NO REALMS CONNECTED IN THIS SECTOR
                  </span>
                </div>
              ) : (
                <div 
                  className="flex flex-col"
                  style={{
                    maxWidth: 'clamp(1400px, 90vw, 1920px)',
                    width: '100%',
                    paddingLeft: 'clamp(1rem, 2vw, 2.5rem)',
                    paddingRight: 'clamp(1rem, 2vw, 2.5rem)',
                    gap: 'clamp(1.5rem, 3vw, 3rem)',
                  }}
                >
                  {filteredUniverses.length === 0 ? (
                    <div className="w-full text-center py-20 flex flex-col items-center gap-4">
                      <Compass size={60} color={activeGenreInfo.color} pulse />
                      <span className="font-mono text-[10px] text-white/30 tracking-[0.4em] uppercase">
                        {t('home.noRealms')}
                      </span>
                    </div>
                  ) : filteredUniverses.length <= 4 ? (
                    /* ── DEDUPLICATED SMALL SECTOR SHELVES (Sports, History, Mythology) ── */
                    <>
                      {/* FEATURED ARCHIVES ROW */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                          <h3
                            className="text-sm font-normal tracking-[0.3em] text-white uppercase flex items-center gap-2"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: activeGenreInfo.color }}
                            />
                            {t('home.featuredArchives')}
                          </h3>
                          <span className="font-mono text-[7px] text-[#eed078]/80 tracking-[0.2em] uppercase">
                            {t('home.criticalCoordinates')}
                          </span>
                        </div>

                        <div 
                          className="flex flex-wrap"
                          style={{
                            gap: 'clamp(1rem, 2vw, 2.5rem)',
                            paddingTop: 'clamp(0.5rem, 1vw, 1rem)',
                          }}
                        >
                          {filteredUniverses.filter(u => u.featured || filteredUniverses.indexOf(u) === 0).map((uni) => (
                            <div
                              key={uni.id}
                              style={{
                                width: 'clamp(18rem, 30vw, 28rem)',
                              }}
                            >
                              <UniverseCard
                                uni={uni}
                                genreColor={activeGenreInfo.color}
                                onEnter={playEraTransition}
                                onCardHover={setHoveredCardId}
                                hoveredCardId={hoveredCardId}
                                startTransition={startTransition}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* ALL REGISTERED SECTORS ROW */}
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-end border-b border-white/5 pb-2">
                          <h3
                            className="text-sm font-normal tracking-[0.3em] text-white uppercase flex items-center gap-2"
                            style={{ fontFamily: "'Cinzel', serif" }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: activeGenreInfo.color }}
                            />
                            {t('home.allRegisteredSectors')}
                          </h3>
                          <span className="font-mono text-[7px] text-white/30 tracking-[0.2em] uppercase">
                            {filteredUniverses.length} {t('home.realmsConnected')}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-6 pt-2">
                          {filteredUniverses.map((uni) => (
                            <div
                              key={uni.id}
                              className="w-[240px] md:w-[320px] lg:w-[280px]"
                            >
                              <UniverseCard
                                uni={uni}
                                genreColor={activeGenreInfo.color}
                                onEnter={playEraTransition}
                                onCardHover={setHoveredCardId}
                                hoveredCardId={hoveredCardId}
                                startTransition={startTransition}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* ── FULL HIGH-DENSITY SCROLLING SHELVES (Movies, Series, Games, Anime) ── */
                    <>
                      {/* ── ROW 1: TRENDING REALMS ── */}
                      {trendingUniverses.length > 0 && (
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <h3
                              className="text-sm font-normal tracking-[0.3em] text-white uppercase flex items-center gap-2"
                              style={{ fontFamily: "'Cinzel', serif" }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: activeGenreInfo.color }}
                              />
                              {t('home.trendingRealms')}
                            </h3>
                            <span className="font-mono text-[7px] text-white/30 tracking-[0.2em] uppercase">
                              {t('home.popularityWeighted')}
                            </span>
                          </div>

                          <NetflixScrollRow>
                            {trendingUniverses.map((uni) => (
                              <div
                                key={uni.id}
                                className="snap-start shrink-0 w-[240px] md:w-[320px] lg:w-[280px]"
                              >
                                <UniverseCard
                                  uni={uni}
                                  genreColor={activeGenreInfo.color}
                                  onEnter={playEraTransition}
                                  onCardHover={setHoveredCardId}
                                  hoveredCardId={hoveredCardId}
                                  startTransition={startTransition}
                                />
                              </div>
                            ))}
                          </NetflixScrollRow>
                        </div>
                      )}

                      {/* ── ROW 2: CRITICALLY ACCLAIMED ARCHIVES ── */}
                      {topRatedUniverses.length > 0 && (
                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <h3
                              className="text-sm font-normal tracking-[0.3em] text-white uppercase flex items-center gap-2"
                              style={{ fontFamily: "'Cinzel', serif" }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: activeGenreInfo.color }}
                              />
                              {t('home.criticallyAcclaimed')}
                            </h3>
                            <span className="font-mono text-[7px] text-amber-400 tracking-[0.2em] uppercase">
                              ★ {t('home.activeRatings')} 8.8+
                            </span>
                          </div>

                          <NetflixScrollRow>
                            {topRatedUniverses.map((uni) => (
                              <div
                                key={uni.id}
                                className="snap-start shrink-0 w-[240px] md:w-[320px] lg:w-[280px]"
                              >
                                <UniverseCard
                                  uni={uni}
                                  genreColor={activeGenreInfo.color}
                                  onEnter={playEraTransition}
                                  onCardHover={setHoveredCardId}
                                  hoveredCardId={hoveredCardId}
                                  startTransition={startTransition}
                                />
                              </div>
                            ))}
                          </NetflixScrollRow>
                        </div>
                      )}

                      {/* ── ROW 3: POPULAR WORLDS ── */}
                      {popularUniverses.length > 0 && (
                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <h3
                              className="text-sm font-normal tracking-[0.3em] text-white uppercase flex items-center gap-2"
                              style={{ fontFamily: "'Cinzel', serif" }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: activeGenreInfo.color }}
                              />
                              {t('home.popularWorlds')}
                            </h3>
                            <span className="font-mono text-[7px] text-white/30 tracking-[0.2em] uppercase">
                              {t('home.highEngagement')}
                            </span>
                          </div>

                          <NetflixScrollRow>
                            {popularUniverses.map((uni) => (
                              <div
                                key={uni.id}
                                className="snap-start shrink-0 w-[240px] md:w-[320px] lg:w-[280px]"
                              >
                                <UniverseCard
                                  uni={uni}
                                  genreColor={activeGenreInfo.color}
                                  onEnter={playEraTransition}
                                  onCardHover={setHoveredCardId}
                                  hoveredCardId={hoveredCardId}
                                  startTransition={startTransition}
                                />
                              </div>
                            ))}
                          </NetflixScrollRow>
                        </div>
                      )}

                      {/* ── ROW 4: RECENTLY UPDATED SECTORS ── */}
                      {recentlyUpdatedUniverses.length > 0 && (
                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <h3
                              className="text-sm font-normal tracking-[0.3em] text-white uppercase flex items-center gap-2"
                              style={{ fontFamily: "'Cinzel', serif" }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: activeGenreInfo.color }}
                              />
                              {t('home.recentlyUpdated')}
                            </h3>
                            <span className="font-mono text-[7px] text-amber-400 tracking-[0.2em] uppercase">
                              ACTIVE DATA FEEDS
                            </span>
                          </div>

                          <NetflixScrollRow>
                            {recentlyUpdatedUniverses.map((uni) => (
                              <div
                                key={uni.id}
                                className="snap-start shrink-0 w-[240px] md:w-[320px] lg:w-[280px]"
                              >
                                <UniverseCard
                                  uni={uni}
                                  genreColor={activeGenreInfo.color}
                                  onEnter={playEraTransition}
                                  onCardHover={setHoveredCardId}
                                  hoveredCardId={hoveredCardId}
                                  startTransition={startTransition}
                                />
                              </div>
                            ))}
                          </NetflixScrollRow>
                        </div>
                      )}

                      {/* ── ROW 5: CONTINUE EXPLORING ── */}
                      {continueExploringUniverses.length > 0 && (
                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <h3
                              className="text-sm font-normal tracking-[0.3em] text-white uppercase flex items-center gap-2"
                              style={{ fontFamily: "'Cinzel', serif" }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: activeGenreInfo.color }}
                              />
                              CONTINUE EXPLORING
                            </h3>
                            <span className="font-mono text-[7px] text-white/30 tracking-[0.2em] uppercase">
                              FOCUS REALM ANOMALIES
                            </span>
                          </div>

                          <NetflixScrollRow>
                            {continueExploringUniverses.map((uni) => (
                              <div
                                key={uni.id}
                                className="snap-start shrink-0 w-[240px] md:w-[320px] lg:w-[280px]"
                              >
                                <UniverseCard
                                  uni={uni}
                                  genreColor={activeGenreInfo.color}
                                  onEnter={playEraTransition}
                                  onCardHover={setHoveredCardId}
                                  hoveredCardId={hoveredCardId}
                                  startTransition={startTransition}
                                />
                              </div>
                            ))}
                          </NetflixScrollRow>
                        </div>
                      )}

                      {/* ── ROW 6: ALL REGISTERED SECTORS (Footer Grid) ── */}
                      {filteredUniverses.length > 0 && (
                        <div className="flex flex-col gap-3 mt-4">
                          <div className="flex justify-between items-end border-b border-white/5 pb-2">
                            <h3
                              className="text-sm font-normal tracking-[0.3em] text-white uppercase flex items-center gap-2"
                              style={{ fontFamily: "'Cinzel', serif" }}
                            >
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: activeGenreInfo.color }}
                              />
                              ALL REGISTERED SECTORS
                            </h3>
                            <span className="font-mono text-[7px] text-white/30 tracking-[0.2em] uppercase">
                              {filteredUniverses.length} REALMS LOADED
                            </span>
                          </div>

                          <NetflixScrollRow>
                            {filteredUniverses.map((uni) => (
                              <div
                                key={uni.id}
                                className="snap-start shrink-0 w-[240px] md:w-[280px]"
                              >
                                <UniverseCard
                                  uni={uni}
                                  genreColor={activeGenreInfo.color}
                                  onEnter={playEraTransition}
                                  onCardHover={setHoveredCardId}
                                  hoveredCardId={hoveredCardId}
                                  startTransition={startTransition}
                                />
                              </div>
                            ))}
                          </NetflixScrollRow>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* ── UNIFIED CINEMATIC HERO & EXPLORE GATEWAY (Single-Screen) ── */
            <div className="flex flex-col items-center justify-between w-full relative z-20 overflow-x-hidden" style={{ minHeight: '100dvh', padding: 'clamp(0.75rem, 2vw, 2rem) clamp(1rem, 3vw, 2rem)' }}>
              
              {/* Layered Space/Fantasy Backdrop & Particles Behind Portals */}
              <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden bg-black">
                {/* Deep Cosmic space dark base */}
                <div 
                  className="absolute inset-0 opacity-100"
                  style={{
                    background: "radial-gradient(circle at 50% 50%, #0c0907 0%, #040302 65%, #000000 100%)",
                  }}
                />

                {/* Left golden/bronze nebula cloud */}
                <div 
                  className="absolute top-[-10%] -left-[15%] w-[80vw] h-[100vh] rounded-full filter blur-[120px] opacity-50 mix-blend-screen"
                  style={{
                    background: "radial-gradient(circle at center, rgba(168, 118, 42, 0.55) 0%, rgba(80, 50, 10, 0.28) 50%, transparent 80%)",
                    animation: "nebula-drift-left 32s ease-in-out infinite alternate",
                  }}
                />
                
                {/* Right golden/bronze nebula cloud */}
                <div 
                  className="absolute top-[10%] -right-[15%] w-[80vw] h-[100vh] rounded-full filter blur-[120px] opacity-45 mix-blend-screen"
                  style={{
                    background: "radial-gradient(circle at center, rgba(238, 208, 120, 0.50) 0%, rgba(138, 88, 12, 0.22) 50%, transparent 80%)",
                    animation: "nebula-drift-right 36s ease-in-out infinite alternate",
                  }}
                />

                {/* Additional Layered Golden Core Nebula Behind Logo */}
                <div 
                  className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[100vw] h-[80vh] rounded-full filter blur-[100px] opacity-90 mix-blend-screen"
                  style={{
                    background: "radial-gradient(circle, rgba(255, 223, 130, 0.42) 0%, rgba(201, 147, 58, 0.22) 45%, rgba(138, 88, 12, 0.08) 70%, transparent 100%)",
                  }}
                />

                {/* Soft Indigo/Purple backdrop hue for chromatic depth around the edges */}
                <div 
                  className="absolute inset-0 opacity-40 mix-blend-color-dodge"
                  style={{
                    background: `
                      radial-gradient(circle at 10% 80%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
                      radial-gradient(circle at 90% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)
                    `,
                    filter: "blur(60px)",
                  }}
                />

                {/* Dark Volumetric Space Dust/Clouds Layer 1 (Smoky atmosphere) */}
                <div 
                  className="absolute top-[5%] left-[5%] w-[65vw] h-[60vh] rounded-full filter blur-[130px] opacity-[0.88] mix-blend-multiply pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, #18110b 0%, #070504 60%, transparent 95%)",
                    animation: "nebula-drift-left 45s ease-in-out infinite alternate",
                  }}
                />

                {/* Dark Volumetric Space Dust/Clouds Layer 2 */}
                <div 
                  className="absolute top-[20%] right-[5%] w-[60vw] h-[60vh] rounded-full filter blur-[120px] opacity-[0.82] mix-blend-multiply pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, #140f09 0%, #050403 65%, transparent 95%)",
                    animation: "nebula-drift-right 52s ease-in-out infinite alternate-reverse",
                  }}
                />

                {/* Dark Volumetric Space Dust/Clouds Layer 3 - Centered */}
                <div 
                  className="absolute top-[35%] left-[25%] w-[65vw] h-[45vh] rounded-full filter blur-[130px] opacity-[0.85] mix-blend-multiply pointer-events-none"
                  style={{
                    background: "radial-gradient(circle, #120d08 0%, #040302 60%, transparent 95%)",
                    animation: "nebula-drift-left 48s ease-in-out infinite alternate-reverse",
                  }}
                />

                {/* Dense Golden Dust Lane behind Explore Realms and Portals */}
                <div 
                  className="absolute bottom-[5%] left-1/2 -translate-x-1/2 w-[98vw] h-[40vh] rounded-full filter blur-[100px] opacity-65 mix-blend-screen"
                  style={{
                    background: "radial-gradient(ellipse at center, rgba(238, 208, 120, 0.15) 0%, rgba(201, 147, 58, 0.05) 50%, transparent 80%)",
                  }}
                />

                {/* Heavy Film Vignette overlay for rich contrast and edge depth */}
                <div 
                  className="absolute inset-0 z-10 pointer-events-none select-none"
                  style={{
                    background: "radial-gradient(ellipse at 50% 40%, transparent 20%, rgba(0, 0, 0, 0.65) 55%, rgba(0, 0, 0, 0.98) 100%)",
                  }}
                />

                {/* Subtle dynamic noise overlay for high-end film grain texture */}
                <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxmaWx0ZXIgaWQ9Im4iPjxmZVR1cmJ1bGVuY2UgdHlwZT0iZnJhY3RhbE5vaXNlIiBiYXNlRnJlcXVlbmN5PSIuOCIgbnVtT2N0YXZlcz0iMSIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iLjA1Ii8+PC9zdmc+')] mix-blend-overlay z-20" />
                
                {/* Dynamic floating gold stardust particles */}
                {stardust.map((particle) => (
                  <div key={particle.id} style={particle.style} />
                ))}
              </div>

              {/* Thin Vertical Golden Needle Ray */}
              <div
                className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-transparent via-[#c9933a]/20 to-transparent pointer-events-none z-10"
                style={{ height: "100%" }}
              />

              {/* ── 1. Top Cinematic Hero Area ── */}
              <div className="flex flex-col items-center relative z-20 w-full" style={{ paddingTop: 'clamp(0.5rem, 2vw, 2rem)' }}>
                <div className="font-mono text-amber-500/50 tracking-[0.4em] uppercase hero-sub" style={{ fontSize: 'clamp(6px, 0.8vw, 8px)', marginBottom: 'clamp(0.25rem, 0.75vw, 0.75rem)' }}>
                  [ LAT: 59.3293° N // LNG: 18.0686° E // ALT: 850m ]
                </div>

                {/* Majestic Center Oryndor Symbol Emblem (Centered above O R Y V O N logo) */}
                <div 
                  className="relative z-20 pointer-events-auto transition-transform duration-700 hover:scale-[1.04]"
                  style={{ marginBottom: 'clamp(0.25rem, 1vw, 1rem)', filter: "drop-shadow(0 0 100px rgba(255, 233, 163, 1.0)) drop-shadow(0 0 55px rgba(201, 147, 58, 0.95)) drop-shadow(0 0 25px rgba(238,208,120,0.8)) drop-shadow(0 4px 20px rgba(0,0,0,0.9))" }}
                >
                  {staticLogoLoaded ? (
                    <img
                      src={staticLogoSymbolUrl}
                      alt="ORYVON Symbol"
                      className="oryvon-logo-float pointer-events-auto object-contain"
                      style={{ width: 'clamp(160px, 22vw, 320px)', height: 'clamp(160px, 22vw, 320px)' }}
                      onError={() => setStaticLogoLoaded(false)}
                    />
                  ) : (
                    <OryndorLogo 
                      size={220} 
                      variant="icon" 
                      className="oryvon-logo-float pointer-events-auto"
                    />
                  )}
                  {/* Preload image to check if it exists */}
                  <img
                    src={staticLogoSymbolUrl}
                    alt=""
                    style={{ display: 'none' }}
                    onLoad={() => setStaticLogoLoaded(true)}
                    onError={() => setStaticLogoLoaded(false)}
                  />
                </div>

                {/* Elegant Golden Serif Title O R Y V O N */}
                <h1
                  className="font-normal text-center block transition-all duration-700 z-20 hero-logo"
                  style={{
                    fontSize: 'clamp(2.5rem, 7.5vw, 7rem)',
                    letterSpacing: '0.5em',
                    marginRight: '-0.5em',
                    fontFamily: "'Cinzel', 'Times New Roman', serif",
                    background: 'linear-gradient(135deg, #ffffff 0%, #ffe9a3 40%, #c9933a 75%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.6))',
                  }}
                >
                  {homepageSettings.hero_text || "ORYVON"}
                </h1>

                {/* Styled Diamond Separator Line */}
                <div className="flex items-center justify-center relative z-20 hero-sub" style={{ width: 'clamp(120px, 20vw, 220px)', margin: 'clamp(0.5rem, 1vw, 1.25rem) 0' }}>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/35 to-transparent" />
                  <div 
                    className="w-1.5 h-1.5 rotate-45 border border-amber-500 bg-[#020101] shadow-[0_0_10px_rgba(245,158,11,0.7)] flex items-center justify-center" 
                  >
                    <div className="w-0.5 h-0.5 bg-white rounded-full" />
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/35 to-transparent" />
                </div>

                {/* Tagline */}
                <p
                  className="uppercase text-center font-light block font-mono text-amber-500/60 z-20 hero-sub"
                  style={{ fontSize: 'clamp(8px, 1vw, 11px)', letterSpacing: '0.45em', marginRight: '-0.45em' }}
                >
                  {homepageSettings.slogan || t('home.worldsEvolve')}
                </p>

                {/* Descend to Explore Archive indicator */}
                <div className="flex flex-col items-center gap-1 relative z-20 pointer-events-none hero-sub" style={{ marginTop: 'clamp(1rem, 2vw, 2rem)' }}>
                  <span 
                    className="font-mono text-amber-500/40 uppercase"
                    style={{ fontSize: 'clamp(6.5px, 0.85vw, 9px)', letterSpacing: '0.45em', textShadow: "0 0 12px rgba(245,158,11,0.4)" }}
                  >
                    {homepageSettings.subtitle || t('home.descendExplore')}
                  </span>
                  <svg 
                    className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-500/35 animate-bounce-slow" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1.5" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                  </svg>
                </div>
              </div>

              {/* ── 2. Explore Realms Title ── */}
              <div className="hero-sub pointer-events-none select-none flex flex-col items-center justify-center w-full relative z-20 px-4" style={{ gap: 'clamp(0.25rem, 0.5vw, 0.5rem)', margin: 'clamp(0.25rem, 1vw, 1rem) 0' }}>
                <div className="flex items-center justify-center gap-4 w-full max-w-xl">
                  <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#c9933a]/60 to-[#c9933a]/90" />
                  <div className="w-2.5 h-2.5 rotate-45 border border-amber-500 bg-[#020101] shadow-[0_0_15px_rgba(245,158,11,0.9)] flex items-center justify-center">
                    <div className="w-0.5 h-0.5 bg-white rounded-full shadow-[0_0_5px_#fff]" />
                  </div>
                  <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#c9933a]/60 to-[#c9933a]/90" />
                </div>
                
                <h2
                  className="font-normal text-center block select-none"
                  style={{
                    fontSize: 'clamp(0.875rem, 1.8vw, 1.5rem)',
                    letterSpacing: '0.45em',
                    marginRight: '-0.45em',
                    fontFamily: "'Cinzel', 'Times New Roman', serif",
                    background: 'linear-gradient(135deg, #ffffff 0%, #ffe9a3 40%, #c9933a 75%, #ffffff 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    filter: 'drop-shadow(0 2px 10px rgba(197,150,53,0.15))',
                  }}
                >
                  {t('home.tagline')}
                </h2>
                
                <span
                  className="font-mono text-[#eed078]/55 uppercase"
                  style={{ fontSize: 'clamp(6.5px, 0.85vw, 8px)', letterSpacing: '0.48em', marginRight: '-0.48em' }}
                >
                  {homepageSettings.subtitle || t('home.chooseRealm')}
                </span>
              </div>

              {/* ── 3. Portal Cards Row ── */}
              <div className="flex flex-col sm:flex-row justify-center items-center w-full max-w-[1600px] relative z-20 px-2 sm:px-0" style={{ gap: 'clamp(0.75rem, 1.5vw, 1.5rem)', paddingBottom: 'clamp(1rem, 2vw, 2rem)' }}>
                {liveGenres.map((g) => (
                  <EraPortal
                    key={g.id}
                    g={g}
                    hovered={hoveredItem === g.id}
                    onClick={() => handleGenreClick(g.id)}
                    onEnter={() => {
                      setHoveredItem(g.id);
                      playHover();
                      setAmbientTone(0.85);
                    }}
                    onLeave={() => {
                      setHoveredItem(null);
                      setAmbientTone(0.0);
                    }}
                  />
                ))}
              </div>

            </div>
          )}
        </div>

        <Ticker />

        {/* Global CSS for diagonal glass reflection sweep effect */}
        <style jsx global>{`
          .home-page-active .noise-overlay,
          .home-page-active .scanline-overlay {
            display: none !important;
          }
          @keyframes card-metallic-sweep {
            0% {
              transform: rotate(28deg) translate3d(-120%, 0, 0);
            }
            100% {
              transform: rotate(28deg) translate3d(120%, 0, 0);
            }
          }
          @keyframes gold-float {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(20px, -25px, 0) scale(1.15);
            }
            100% {
              transform: translate3d(-10px, -55px, 0) scale(0.85);
            }
          }
          @keyframes bounce-slow {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(6px);
            }
          }
          .animate-bounce-slow {
            animation: bounce-slow 2.5s infinite ease-in-out;
          }
          @keyframes nebula-drift-left {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            100% {
              transform: translate3d(25px, -15px, 0) scale(1.06);
            }
          }
          @keyframes nebula-drift-right {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            100% {
              transform: translate3d(-25px, 15px, 0) scale(1.05);
            }
          }
          @keyframes portal-mist-swirl {
            0% {
              transform: scale(1) rotate(0deg) translate3d(0, 0, 0);
            }
            50% {
              transform: scale(1.2) rotate(180deg) translate3d(8px, -8px, 0);
            }
            100% {
              transform: scale(1) rotate(360deg) translate3d(0, 0, 0);
            }
          }
          @keyframes portal-mist-swirl-reverse {
            0% {
              transform: scale(1.1) rotate(360deg) translate3d(0, 0, 0);
            }
            50% {
              transform: scale(0.9) rotate(180deg) translate3d(-6px, 6px, 0);
            }
            100% {
              transform: scale(1.1) rotate(0deg) translate3d(0, 0, 0);
            }
          }
          @keyframes shimmer-rays {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
        `}</style>
      </main>
    </div>
  );
}
