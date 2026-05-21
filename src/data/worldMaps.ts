export interface MapMarker {
  id: string;
  name: string;
  /** 0–100 percent on map image */
  x: number;
  y: number;
  type: 'City' | 'Castle' | 'Region' | 'Planet' | 'School' | 'Landmark' | 'Ruin';
  desc: string;
  details?: Record<string, string>;
  /** Minimum zoom scale before name label appears */
  labelZoom?: number;
}

export interface WorldMapConfig {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  accentColor: string;
  /** High-resolution map texture served from /public */
  mapImage: string;
  /** Intrinsic pixel size of mapImage (width × height) */
  mapSize: { w: number; h: number };
  markers: MapMarker[];
  /** Fallback zoom if container size is unknown */
  initialScale: number;
  minScale: number;
  maxScale: number;
}

const lotrMarkers: MapMarker[] = [
  { id: 'shire', name: 'The Shire', x: 22, y: 34, type: 'Region', labelZoom: 1.05, desc: 'Green hills and fertile vales where Hobbits live in quiet prosperity.', details: { Realm: 'Eriador', Notable: 'Bag End, Hobbiton' } },
  { id: 'rivendell', name: 'Rivendell', x: 30, y: 38, type: 'City', labelZoom: 1.05, desc: 'The Last Homely House east of the Sea, refuge of Elrond Half-elven.', details: { Ruler: 'Elrond', Era: 'Third Age' } },
  { id: 'moria', name: 'Moria', x: 38, y: 44, type: 'Ruin', labelZoom: 1.1, desc: 'Khazad-dûm, greatest dwarf-realm, now a tomb of shadow.', details: { Resource: 'Mithril', Threat: "Durin's Bane" } },
  { id: 'rohan', name: 'Rohan', x: 44, y: 52, type: 'Region', labelZoom: 1.0, desc: 'The Riddermark — endless grasslands of the Horse-lords.', details: { Capital: 'Edoras', King: 'Théoden' } },
  { id: 'gondor', name: 'Gondor', x: 43, y: 66, type: 'City', labelZoom: 1.0, desc: 'Last great kingdom of Men, shield against the shadow in the East.', details: { Capital: 'Minas Tirith', Steward: 'Denethor II' } },
  { id: 'mordor', name: 'Mordor', x: 58, y: 60, type: 'Region', labelZoom: 0.95, desc: 'The Black Land — volcanic realm of Sauron and the One Ring.', details: { Peak: 'Mount Doom', Fortress: 'Barad-dûr' } },
];

const gotMarkers: MapMarker[] = [
  { id: 'wall', name: 'The Wall', x: 50, y: 6, type: 'Landmark', labelZoom: 1.0, desc: 'Seven hundred feet of ice guarding the realms of men from the far North.', details: { Guard: "Night's Watch", Length: '300 miles' } },
  { id: 'winterfell', name: 'Winterfell', x: 48, y: 16, type: 'Castle', labelZoom: 1.05, desc: 'Ancestral seat of House Stark in the North.', details: { House: 'Stark', Motto: 'Winter is Coming' } },
  { id: 'kings_landing', name: "King's Landing", x: 54, y: 54, type: 'City', labelZoom: 1.0, desc: 'Capital of the Seven Kingdoms on Blackwater Bay.', details: { Seat: 'Iron Throne', Region: 'Crownlands' } },
  { id: 'casterly', name: 'Casterly Rock', x: 34, y: 50, type: 'Castle', labelZoom: 1.1, desc: 'Impregnable western fortress of House Lannister.', details: { House: 'Lannister', Wealth: 'Gold mines' } },
  { id: 'highgarden', name: 'Highgarden', x: 40, y: 64, type: 'Castle', labelZoom: 1.1, desc: 'Verdant seat of House Tyrell in the Reach.', details: { House: 'Tyrell', Region: 'The Reach' } },
  { id: 'oldtown', name: 'Oldtown', x: 38, y: 72, type: 'City', labelZoom: 1.15, desc: 'Oldest city in Westeros and seat of the Citadel maesters.', details: { Feature: 'Hightower', Region: 'The Reach' } },
];

const starwarsMarkers: MapMarker[] = [
  { id: 'coruscant', name: 'Coruscant', x: 50, y: 48, type: 'Planet', labelZoom: 1.05, desc: 'Galactic capital — entire world covered in city-sprawl.', details: { Sector: 'Core Worlds', Feature: 'Jedi Temple' } },
  { id: 'naboo', name: 'Naboo', x: 46, y: 54, type: 'Planet', labelZoom: 1.1, desc: 'Lush world of plains and underwater Gungan cities.', details: { Sector: 'Mid Rim', Capital: 'Theed' } },
  { id: 'tatooine', name: 'Tatooine', x: 58, y: 62, type: 'Planet', labelZoom: 1.0, desc: 'Twin-sun desert world on the Outer Rim trade routes.', details: { Sector: 'Outer Rim', Hub: 'Mos Eisley' } },
  { id: 'mustafar', name: 'Mustafar', x: 52, y: 40, type: 'Planet', labelZoom: 1.15, desc: 'Volcanic hellscape of rivers of magma.', details: { Sector: 'Outer Rim', Notable: "Darth Vader's fortress" } },
  { id: 'hoth', name: 'Hoth', x: 36, y: 36, type: 'Planet', labelZoom: 1.2, desc: 'Frozen exile world of the Rebel Alliance.', details: { Sector: 'Outer Rim', Climate: 'Ice plains' } },
  { id: 'endor', name: 'Endor', x: 62, y: 46, type: 'Planet', labelZoom: 1.15, desc: 'Forest moon where the second Death Star fell.', details: { Species: 'Ewoks', Event: 'Battle of Endor' } },
];

const harrypotterMarkers: MapMarker[] = [
  { id: 'hogwarts', name: 'Hogwarts', x: 52, y: 22, type: 'School', labelZoom: 1.05, desc: 'Scottish castle-school of witchcraft and wizardry.', details: { Houses: 'Gryffindor, Slytherin, Ravenclaw, Hufflepuff', Head: 'Albus Dumbledore' } },
  { id: 'hogsmeade', name: 'Hogsmeade', x: 54, y: 26, type: 'Region', labelZoom: 1.15, desc: 'All-wizarding village beside the school.', details: { Feature: 'Three Broomsticks', Transport: 'Hogwarts Express' } },
  { id: 'diagon', name: 'Diagon Alley', x: 58, y: 68, type: 'City', labelZoom: 1.05, desc: 'Hidden magical shopping street in London.', details: { Bank: 'Gringotts', Shop: 'Ollivanders' } },
  { id: 'ministry', name: 'Ministry of Magic', x: 57, y: 71, type: 'Landmark', labelZoom: 1.1, desc: 'British magical government beneath Whitehall.', details: { Minister: 'Cornelius Fudge', Dept: 'Mysteries' } },
  { id: 'azkaban', name: 'Azkaban', x: 66, y: 14, type: 'Castle', labelZoom: 1.05, desc: 'Unplottable fortress prison in the North Sea.', details: { Guards: 'Dementors', Classification: 'Maximum security' } },
  { id: 'godrics', name: "Godric's Hollow", x: 52, y: 58, type: 'Landmark', labelZoom: 1.2, desc: 'West Country village steeped in wizarding history.', details: { Notable: 'Potter cottage ruins', Region: 'England' } },
];

export const WORLD_MAPS: Record<string, WorldMapConfig> = {
  lotr: {
    id: 'lotr',
    title: 'Middle-earth',
    subtitle: 'Northwest of Middle-earth · Third Age',
    description: 'From the Shire in the West to Mordor in the East — the lands of the War of the Ring.',
    accentColor: '#d97706',
    mapImage: '/Images/middle_earth_map.png',
    mapSize: { w: 1024, h: 1024 },
    markers: lotrMarkers,
    initialScale: 0.55,
    minScale: 0.35,
    maxScale: 3.5,
  },
  got: {
    id: 'got',
    title: 'Westeros',
    subtitle: 'The Seven Kingdoms',
    description: 'From the Wall in the far North to the Reach and Dorne — the continent mapped in the Age of Dragons.',
    accentColor: '#ea580c',
    mapImage: '/maps/got-westeros.png',
    mapSize: { w: 1280, h: 2458 },
    markers: gotMarkers,
    initialScale: 0.5,
    minScale: 0.3,
    maxScale: 3.5,
  },
  starwars: {
    id: 'starwars',
    title: 'The Galaxy',
    subtitle: 'A galaxy far, far away',
    description: 'Spiral arms of star systems linked by hyperspace lanes and ancient trade routes.',
    accentColor: '#a855f7',
    mapImage: '/maps/starwars-galaxy.png',
    mapSize: { w: 1257, h: 1350 },
    markers: starwarsMarkers,
    initialScale: 0.48,
    minScale: 0.3,
    maxScale: 3.2,
  },
  harrypotter: {
    id: 'harrypotter',
    title: 'Wizarding Britain',
    subtitle: 'Hidden magical geography',
    description: 'Enchanted Britain — Hogwarts in the Highlands, Diagon Alley in London, Azkaban in the North Sea.',
    accentColor: '#fbbf24',
    mapImage: '/maps/hp-wizarding-britain.jpg',
    mapSize: { w: 960, h: 1483 },
    markers: harrypotterMarkers,
    initialScale: 0.52,
    minScale: 0.32,
    maxScale: 3.2,
  },
  hp: {
    id: 'harrypotter',
    title: 'Wizarding Britain',
    subtitle: 'Hidden magical geography',
    description: 'Enchanted Britain — Hogwarts in the Highlands, Diagon Alley in London, Azkaban in the North Sea.',
    accentColor: '#fbbf24',
    mapImage: '/maps/hp-wizarding-britain.jpg',
    mapSize: { w: 960, h: 1483 },
    markers: harrypotterMarkers,
    initialScale: 0.52,
    minScale: 0.32,
    maxScale: 3.2,
  },
};

export function getWorldMap(universeId: string): WorldMapConfig {
  if (WORLD_MAPS[universeId]) return WORLD_MAPS[universeId];

  const title = universeId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    id: universeId,
    title,
    subtitle: 'ORYVON cartographic projection',
    description: 'Exploratory map of this realm — zoom in to reveal landmarks.',
    accentColor: '#eab308',
    mapImage: '/Images/middle_earth_map.png',
    mapSize: { w: 1024, h: 1024 },
    markers: [
      {
        id: 'nexus',
        name: 'Realm Nexus',
        x: 50,
        y: 50,
        type: 'Landmark',
        labelZoom: 1,
        desc: 'Central coordinate of the mapped region.',
      },
    ],
    initialScale: 0.55,
    minScale: 0.35,
    maxScale: 2.5,
  };
}
