// Data-driven config structures for admin panel
// Each section has: Content, Design, Layout, Animation settings

// ===== HOMEPAGE CONFIG =====
export interface HomepageContentConfig {
  heroTitle: string;
  heroSubtitle: string;
  heroSlogan: string;
  heroButtonText: string;
  heroButtonLink: string;
  heroDescription: string;
  logoUrl: string;
  symbolUrl: string;
  showLogo: boolean;
  showSymbol: boolean;
}

export interface HomepageDesignConfig {
  backgroundType: 'image' | 'video' | 'color' | 'gradient';
  backgroundUrl: string;
  backgroundVideoUrl: string;
  backgroundColor: string;
  gradientStart: string;
  gradientEnd: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: {
    heroTitle: string;
    heroSubtitle: string;
    heroSlogan: string;
    heroDescription: string;
  };
  textColors: {
    heroTitle: string;
    heroSubtitle: string;
    heroSlogan: string;
    heroDescription: string;
  };
}

export interface HomepageLayoutConfig {
  heroAlignment: 'left' | 'center' | 'right';
  heroVerticalAlignment: 'top' | 'center' | 'bottom';
  heroPadding: string;
  heroSpacing: string;
  buttonPosition: 'inline' | 'block';
  mobileHeroAlignment: 'left' | 'center';
  mobileHeroPadding: string;
  mobileHeroSpacing: string;
  backdropBlur: string;
  backdropOpacity: number;
  shadowIntensity: string;
  borderRadius: string;
}

export interface HomepageAnimationConfig {
  heroAnimation: 'fadeIn' | 'slideUp' | 'scaleIn' | 'none';
  heroAnimationDuration: number;
  heroAnimationDelay: number;
  heroGlowEnabled: boolean;
  heroGlowColor: string;
  heroGlowIntensity: string;
  buttonHoverEffect: 'glow' | 'scale' | 'slide' | 'none';
  backgroundMovementEnabled: boolean;
  backgroundMovementSpeed: number;
  parallaxEnabled: boolean;
  parallaxIntensity: number;
}

export interface HomepageConfig {
  content: HomepageContentConfig;
  design: HomepageDesignConfig;
  layout: HomepageLayoutConfig;
  animation: HomepageAnimationConfig;
}

// ===== PORTALS CONFIG =====
export interface PortalCard {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  category: string;
  featured: boolean;
  visible: boolean;
  order: number;
}

export interface PortalsContentConfig {
  portalCards: PortalCard[];
  showFeaturedOnly: boolean;
  maxFeaturedCount: number;
}

export interface PortalsDesignConfig {
  cardStyle: 'glass' | 'solid' | 'minimal';
  cardBackgroundColor: string;
  cardBorderColor: string;
  cardBorderRadius: string;
  cardShadow: string;
  cardGlowEnabled: boolean;
  cardGlowColor: string;
  cardGlowIntensity: string;
  imageFit: 'cover' | 'contain' | 'fill';
  imageGrayscale: boolean;
  imageBlur: number;
}

export interface PortalsLayoutConfig {
  gridColumns: number;
  gridGap: string;
  cardAspectRatio: string;
  cardPadding: string;
  mobileGridColumns: number;
  mobileCardPadding: string;
  scrollDirection: 'horizontal' | 'vertical';
  showScrollbar: boolean;
}

export interface PortalsAnimationConfig {
  cardHoverEffect: 'lift' | 'glow' | 'scale' | 'none';
  cardAnimationDuration: number;
  staggerAnimation: boolean;
  staggerDelay: number;
  imageHoverEffect: 'zoom' | 'pan' | 'none';
  imageAnimationDuration: number;
}

export interface PortalsConfig {
  content: PortalsContentConfig;
  design: PortalsDesignConfig;
  layout: PortalsLayoutConfig;
  animation: PortalsAnimationConfig;
}

// ===== TIMELINE CONFIG =====
export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  imageUrl: string;
  musicUrl: string;
  order: number;
  visible: boolean;
}

export interface TimelineContentConfig {
  events: TimelineEvent[];
  showAllYears: boolean;
  startYear: string;
  endYear: string;
}

export interface TimelineDesignConfig {
  backgroundColor: string;
  yearMarkerColor: string;
  eventCardStyle: 'glass' | 'solid' | 'minimal';
  eventCardBackgroundColor: string;
  eventCardBorderColor: string;
  eventCardBorderRadius: string;
  fontFamily: string;
  fontSize: {
    yearMarker: string;
    eventTitle: string;
    eventDescription: string;
  };
  textColors: {
    yearMarker: string;
    eventTitle: string;
    eventDescription: string;
  };
}

export interface TimelineLayoutConfig {
  timelineOrientation: 'horizontal' | 'vertical';
  yearMarkerPosition: 'top' | 'bottom' | 'left' | 'right';
  eventSpacing: string;
  yearSpacing: string;
  cardPadding: string;
  cardMaxWidth: string;
  mobileEventSpacing: string;
  mobileCardPadding: string;
}

export interface TimelineAnimationConfig {
  scrollAnimation: 'fade' | 'slide' | 'scale' | 'none';
  scrollAnimationDuration: number;
  scrollTriggerOffset: number;
  yearMarkerAnimation: 'fadeIn' | 'slideUp' | 'none';
  eventCardAnimation: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'none';
  animationStagger: boolean;
  animationStaggerDelay: number;
}

export interface TimelineConfig {
  content: TimelineContentConfig;
  design: TimelineDesignConfig;
  layout: TimelineLayoutConfig;
  animation: TimelineAnimationConfig;
}

// ===== UNIVERSE CONFIG =====
export interface UniverseContentConfig {
  title: string;
  description: string;
  lore: string;
  factions: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }>;
  characters: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }>;
  locations: Array<{
    id: string;
    name: string;
    description: string;
    imageUrl: string;
  }>;
}

export interface UniverseDesignConfig {
  headerStyle: 'cinematic' | 'minimal' | 'classic';
  headerBackgroundUrl: string;
  headerBackgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  fontSize: {
    title: string;
    description: string;
    sectionTitle: string;
    itemTitle: string;
    itemDescription: string;
  };
}

export interface UniverseLayoutConfig {
  headerAlignment: 'left' | 'center' | 'right';
  contentSpacing: string;
  sectionSpacing: string;
  gridColumns: number;
  cardAspectRatio: string;
  mobileGridColumns: number;
  mobileContentSpacing: string;
}

export interface UniverseAnimationConfig {
  headerAnimation: 'fadeIn' | 'slideDown' | 'zoomIn' | 'none';
  sectionAnimation: 'fadeInUp' | 'fadeIn' | 'none';
  cardHoverEffect: 'lift' | 'glow' | 'scale' | 'none';
  parallaxEnabled: boolean;
  parallaxIntensity: number;
}

export interface UniverseConfig {
  content: UniverseContentConfig;
  design: UniverseDesignConfig;
  layout: UniverseLayoutConfig;
  animation: UniverseAnimationConfig;
}

// ===== CHARACTER CONFIG =====
export interface CharacterContentConfig {
  name: string;
  title: string;
  description: string;
  backstory: string;
  abilities: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  relationships: Array<{
    id: string;
    characterName: string;
    relationshipType: string;
    description: string;
  }>;
  imageUrl: string;
  galleryImages: string[];
}

export interface CharacterDesignConfig {
  profileStyle: 'cinematic' | 'minimal' | 'detailed';
  profileBackgroundUrl: string;
  profileBackgroundColor: string;
  accentColor: string;
  fontFamily: string;
  fontSize: {
    name: string;
    title: string;
    description: string;
    sectionTitle: string;
  };
}

export interface CharacterLayoutConfig {
  profileAlignment: 'left' | 'center' | 'right';
  contentSpacing: string;
  sectionSpacing: string;
  galleryColumns: number;
  mobileProfileAlignment: 'center';
  mobileContentSpacing: string;
}

export interface CharacterAnimationConfig {
  profileAnimation: 'fadeIn' | 'slideUp' | 'zoomIn' | 'none';
  sectionAnimation: 'fadeInUp' | 'fadeIn' | 'none';
  imageHoverEffect: 'zoom' | 'pan' | 'none';
  parallaxEnabled: boolean;
}

export interface CharacterConfig {
  content: CharacterContentConfig;
  design: CharacterDesignConfig;
  layout: CharacterLayoutConfig;
  animation: CharacterAnimationConfig;
}

// ===== MEDIA CONFIG =====
export interface MediaItem {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  order: number;
  visible: boolean;
}

export interface MediaContentConfig {
  items: MediaItem[];
  showAllCategories: boolean;
  maxItemsPerCategory: number;
}

export interface MediaDesignConfig {
  galleryStyle: 'grid' | 'masonry' | 'carousel' | 'list';
  cardStyle: 'glass' | 'solid' | 'minimal';
  cardBackgroundColor: string;
  cardBorderColor: string;
  cardBorderRadius: string;
  cardShadow: string;
  imageFit: 'cover' | 'contain';
}

export interface MediaLayoutConfig {
  gridColumns: number;
  gridGap: string;
  cardAspectRatio: string;
  cardPadding: string;
  mobileGridColumns: number;
  mobileCardPadding: string;
  scrollDirection: 'horizontal' | 'vertical';
  showScrollbar: boolean;
}

export interface MediaAnimationConfig {
  cardHoverEffect: 'lift' | 'glow' | 'scale' | 'none';
  cardAnimationDuration: number;
  imageHoverEffect: 'zoom' | 'pan' | 'none';
  filterAnimation: 'fadeIn' | 'slideUp' | 'none';
}

export interface MediaConfig {
  content: MediaContentConfig;
  design: MediaDesignConfig;
  layout: MediaLayoutConfig;
  animation: MediaAnimationConfig;
}

// ===== GLOBAL ADMIN CONFIG =====
export interface AdminConfig {
  homepage: HomepageConfig;
  portals: PortalsConfig;
  timeline: TimelineConfig;
  universe: UniverseConfig;
  character: CharacterConfig;
  media: MediaConfig;
}

// ===== DEFAULT CONFIGS =====
export const defaultHomepageConfig: HomepageConfig = {
  content: {
    heroTitle: 'ORYVON',
    heroSubtitle: 'Worlds Evolve. Stories Endure.',
    heroSlogan: 'Choose a realm and open the archive',
    heroButtonText: 'Explore',
    heroButtonLink: '/explore',
    heroDescription: '',
    logoUrl: '/logo.png',
    symbolUrl: '/symbol.png',
    showLogo: true,
    showSymbol: true,
  },
  design: {
    backgroundType: 'image',
    backgroundUrl: '/Images/background.jpg',
    backgroundVideoUrl: '',
    backgroundColor: '#020102',
    gradientStart: '#020102',
    gradientEnd: '#1a0a0a',
    primaryColor: '#c9933a',
    secondaryColor: '#eed078',
    accentColor: '#f59e0b',
    fontFamily: 'Outfit',
    fontSize: {
      heroTitle: '4rem',
      heroSubtitle: '1.5rem',
      heroSlogan: '1rem',
      heroDescription: '1rem',
    },
    textColors: {
      heroTitle: '#ffffff',
      heroSubtitle: '#ffffff',
      heroSlogan: '#ffffff',
      heroDescription: '#ffffff',
    },
  },
  layout: {
    heroAlignment: 'center',
    heroVerticalAlignment: 'center',
    heroPadding: '4rem',
    heroSpacing: '2rem',
    buttonPosition: 'inline',
    mobileHeroAlignment: 'center',
    mobileHeroPadding: '2rem',
    mobileHeroSpacing: '1rem',
    backdropBlur: '20px',
    backdropOpacity: 0.9,
    shadowIntensity: '0 0 60px rgba(0,0,0,0.8)',
    borderRadius: '1rem',
  },
  animation: {
    heroAnimation: 'fadeIn',
    heroAnimationDuration: 1000,
    heroAnimationDelay: 200,
    heroGlowEnabled: true,
    heroGlowColor: '#f59e0b',
    heroGlowIntensity: '0 0 30px rgba(245,158,11,0.5)',
    buttonHoverEffect: 'glow',
    backgroundMovementEnabled: true,
    backgroundMovementSpeed: 1,
    parallaxEnabled: true,
    parallaxIntensity: 0.5,
  },
};

export const defaultPortalsConfig: PortalsConfig = {
  content: {
    portalCards: [],
    showFeaturedOnly: false,
    maxFeaturedCount: 6,
  },
  design: {
    cardStyle: 'glass',
    cardBackgroundColor: 'rgba(0,0,0,0.6)',
    cardBorderColor: 'rgba(255,255,255,0.1)',
    cardBorderRadius: '1rem',
    cardShadow: '0 0 30px rgba(0,0,0,0.5)',
    cardGlowEnabled: true,
    cardGlowColor: '#f59e0b',
    cardGlowIntensity: '0 0 20px rgba(245,158,11,0.3)',
    imageFit: 'cover',
    imageGrayscale: false,
    imageBlur: 0,
  },
  layout: {
    gridColumns: 3,
    gridGap: '2rem',
    cardAspectRatio: '16/9',
    cardPadding: '1rem',
    mobileGridColumns: 1,
    mobileCardPadding: '1rem',
    scrollDirection: 'vertical',
    showScrollbar: false,
  },
  animation: {
    cardHoverEffect: 'lift',
    cardAnimationDuration: 300,
    staggerAnimation: true,
    staggerDelay: 100,
    imageHoverEffect: 'zoom',
    imageAnimationDuration: 500,
  },
};

export const defaultTimelineConfig: TimelineConfig = {
  content: {
    events: [],
    showAllYears: true,
    startYear: '1970',
    endYear: '2030',
  },
  design: {
    backgroundColor: '#020102',
    yearMarkerColor: '#c9933a',
    eventCardStyle: 'glass',
    eventCardBackgroundColor: 'rgba(0,0,0,0.6)',
    eventCardBorderColor: 'rgba(255,255,255,0.1)',
    eventCardBorderRadius: '1rem',
    fontFamily: 'Outfit',
    fontSize: {
      yearMarker: '3rem',
      eventTitle: '1.5rem',
      eventDescription: '1rem',
    },
    textColors: {
      yearMarker: '#c9933a',
      eventTitle: '#ffffff',
      eventDescription: '#ffffff',
    },
  },
  layout: {
    timelineOrientation: 'vertical',
    yearMarkerPosition: 'left',
    eventSpacing: '4rem',
    yearSpacing: '8rem',
    cardPadding: '2rem',
    cardMaxWidth: '600px',
    mobileEventSpacing: '2rem',
    mobileCardPadding: '1.5rem',
  },
  animation: {
    scrollAnimation: 'fade',
    scrollAnimationDuration: 800,
    scrollTriggerOffset: 100,
    yearMarkerAnimation: 'fadeIn',
    eventCardAnimation: 'fadeInUp',
    animationStagger: true,
    animationStaggerDelay: 150,
  },
};

export const defaultUniverseConfig: UniverseConfig = {
  content: {
    title: '',
    description: '',
    lore: '',
    factions: [],
    characters: [],
    locations: [],
  },
  design: {
    headerStyle: 'cinematic',
    headerBackgroundUrl: '',
    headerBackgroundColor: '#020102',
    primaryColor: '#c9933a',
    secondaryColor: '#eed078',
    fontFamily: 'Outfit',
    fontSize: {
      title: '3rem',
      description: '1.25rem',
      sectionTitle: '2rem',
      itemTitle: '1.5rem',
      itemDescription: '1rem',
    },
  },
  layout: {
    headerAlignment: 'center',
    contentSpacing: '4rem',
    sectionSpacing: '3rem',
    gridColumns: 3,
    cardAspectRatio: '16/9',
    mobileGridColumns: 1,
    mobileContentSpacing: '2rem',
  },
  animation: {
    headerAnimation: 'fadeIn',
    sectionAnimation: 'fadeInUp',
    cardHoverEffect: 'lift',
    parallaxEnabled: true,
    parallaxIntensity: 0.5,
  },
};

export const defaultCharacterConfig: CharacterConfig = {
  content: {
    name: '',
    title: '',
    description: '',
    backstory: '',
    abilities: [],
    relationships: [],
    imageUrl: '',
    galleryImages: [],
  },
  design: {
    profileStyle: 'cinematic',
    profileBackgroundUrl: '',
    profileBackgroundColor: '#020102',
    accentColor: '#c9933a',
    fontFamily: 'Outfit',
    fontSize: {
      name: '3rem',
      title: '1.5rem',
      description: '1.25rem',
      sectionTitle: '2rem',
    },
  },
  layout: {
    profileAlignment: 'center',
    contentSpacing: '4rem',
    sectionSpacing: '3rem',
    galleryColumns: 3,
    mobileProfileAlignment: 'center',
    mobileContentSpacing: '2rem',
  },
  animation: {
    profileAnimation: 'fadeIn',
    sectionAnimation: 'fadeInUp',
    imageHoverEffect: 'zoom',
    parallaxEnabled: true,
  },
};

export const defaultMediaConfig: MediaConfig = {
  content: {
    items: [],
    showAllCategories: true,
    maxItemsPerCategory: 20,
  },
  design: {
    galleryStyle: 'grid',
    cardStyle: 'glass',
    cardBackgroundColor: 'rgba(0,0,0,0.6)',
    cardBorderColor: 'rgba(255,255,255,0.1)',
    cardBorderRadius: '1rem',
    cardShadow: '0 0 30px rgba(0,0,0,0.5)',
    imageFit: 'cover',
  },
  layout: {
    gridColumns: 4,
    gridGap: '2rem',
    cardAspectRatio: '16/9',
    cardPadding: '1rem',
    mobileGridColumns: 2,
    mobileCardPadding: '1rem',
    scrollDirection: 'vertical',
    showScrollbar: false,
  },
  animation: {
    cardHoverEffect: 'lift',
    cardAnimationDuration: 300,
    imageHoverEffect: 'zoom',
    filterAnimation: 'fadeIn',
  },
};

export const defaultAdminConfig: AdminConfig = {
  homepage: defaultHomepageConfig,
  portals: defaultPortalsConfig,
  timeline: defaultTimelineConfig,
  universe: defaultUniverseConfig,
  character: defaultCharacterConfig,
  media: defaultMediaConfig,
};
