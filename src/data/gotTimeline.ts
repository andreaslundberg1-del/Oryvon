import { Timeline } from '@/types/timeline';

export const gotTimeline: Timeline = {
  id: 'got-lore',
  title: {
    en: 'Game of Thrones Lore',
    sv: 'Game of Thrones Lore',
    ja: 'ゲーム・オブ・スローンズの伝承'
  },
  description: {
    en: 'The complete history of Westeros, from the Dawn Age to the Battle of the Bastards.',
    sv: 'Hela historien om Westeros, från Gryningstiden till Slaget om Bastarderna.',
    ja: '夜明けの時代から落とし子の戦いまで、ウェスタロスの完全な歴史。'
  },
  years: [
    {
      year: -12000,
      theme: {
        uiStyle: 'fantasy',
        colors: {
          primary: '#4ade80',
          secondary: '#166534',
          background: '#052e16',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: 'The Dawn Age', sv: 'Gryningstiden' },
        description: {
          en: '12,000 BC: Before the coming of man, the Children of the Forest and Giants ruled the continent.',
          sv: '12 000 BC: Innan människornas ankomst regerade Skogens barn och Jättarna över kontinenten.'
        }
      },
      games: {
        title: { en: 'Nature & Magic', sv: 'Natur & Magi' },
        images: [{ url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop', alt: 'Ancient Forest' }]
      },
      pixelArt: {
        title: { en: 'The Weirwoods', sv: 'Weirwood-träden' },
        description: { en: 'Faces carved into the white bark of ancient trees.', sv: 'Ansikten utsnidade i den vita barken på urgamla träd.' },
        images: []
      },
      arcade: {
        title: { en: 'Giant Inhabitants', sv: 'Jättarnas Värld' },
        description: { en: 'Huge creatures who roamed alongside the Children.', sv: 'Enorma varelser som strövade sida vid sida med barnen.' },
        images: []
      },
      tech: {
        title: { en: 'Old Gods', sv: 'Gamla Gudar' },
        hardware: [
          { name: { en: 'Weirwood Trees', sv: 'Weirwood-träd' }, specs: { en: 'Magical nodes', sv: 'Magiska noder' } },
          { name: { en: 'Obsidian', sv: 'Obsidian' }, specs: { en: 'Dragonglass', sv: 'Drakglas' } }
        ],
        image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'Nature’s Song', sv: 'Naturens Sång' },
        description: { en: 'The wind whispered the secrets of the gods.', sv: 'Vinden viskade gudarnas hemligheter.' }
      },
      filmVfx: {
        title: { en: 'Ancient Magic', sv: 'Urgammal Magi' },
        description: { en: 'The pact between the First Men and the Children.', sv: 'Paktens mellan de första människorna och barnen.' },
        images: []
      },
      uiDesign: {
        title: { en: 'Cave Inscriptions', sv: 'Grott-inskriptioner' },
        description: { en: 'Symbols that tell the story of the Dawn.', sv: 'Symboler som berättar historien om gryningen.' },
        image: ''
      },
      summary: {
        title: { en: '12,000 BC', sv: '12 000 BC' },
        description: { en: 'The era when the Children of the Forest and the First Men signed the Pact.', sv: 'Eran då Skogens barn och de Första människorna undertecknade pakten.' },
        icons: ['tree']
      }
    },
    {
      year: -8000,
      theme: {
        uiStyle: 'ice',
        colors: {
          primary: '#7dd3fc',
          secondary: '#075985',
          background: '#0c4a6e',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: 'The Long Night', sv: 'Den Långa Natten' },
        description: {
          en: '8,000 BC: A winter that lasted a generation and the first invasion of the White Walkers.',
          sv: '8 000 BC: En vinter som varade en hel generation och den första invasionen av White Walkers.'
        }
      },
      games: {
        title: { en: 'Winter is Coming', sv: 'Vintern kommer' },
        images: [{ url: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2070&auto=format&fit=crop', alt: 'Frozen Tundra' }]
      },
      pixelArt: {
        title: { en: 'Icy Shadows', sv: 'Isskuggor' },
        description: { en: 'Creatures made of ice and cold death.', sv: 'Varelser gjorda av is och kall död.' },
        images: []
      },
      arcade: {
        title: { en: 'The Night’s Watch', sv: 'Nattens Väktare' },
        description: { en: 'The first men who swore to protect the realms.', sv: 'De första männen som svor att skydda rikena.' },
        images: []
      },
      tech: {
        title: { en: 'The Wall', sv: 'Muren' },
        hardware: [
          { name: { en: 'Brandon the Builder', sv: 'Brandon Byggaren' }, specs: { en: 'Architect of the Wall', sv: 'Murens arkitekt' } },
          { name: { en: 'Magic Spells', sv: 'Magiska besvärjelser' }, specs: { en: 'Woven into the ice', sv: 'Vävda in i isen' } }
        ],
        image: 'https://images.unsplash.com/photo-1453396450673-3fe83d2db2c4?q=80&w=1974&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'The Blue Cold', sv: 'Den blå kylan' },
        description: { en: 'Sound of ice cracking under the weight of history.', sv: 'Ljudet av is som spricker under historiens tyngd.' }
      },
      filmVfx: {
        title: { en: 'Blizzard Effects', sv: 'Snöstormseffekter' },
        description: { en: 'Infinite white and chilling winds.', sv: 'Oändligt vitt och isande vindar.' },
        images: []
      },
      uiDesign: {
        title: { en: 'Frost Patterns', sv: 'Frostmönster' },
        description: { en: 'UI inspired by crystalline ice structures.', sv: 'UI inspirerat av kristallina isstrukturer.' },
        image: ''
      },
      summary: {
        title: { en: '8,000 BC', sv: '8 000 BC' },
        description: { en: 'The construction of the Wall and the formation of the Night’s Watch.', sv: 'Byggandet av muren och bildandet av Nattens väktare.' },
        icons: ['shield']
      }
    },
    {
      year: -114,
      theme: {
        uiStyle: 'tech',
        colors: {
          primary: '#e2e8f0',
          secondary: '#475569',
          background: '#0f172a',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: 'The Doom of Valyria', sv: 'Valyrias Undergång' },
        description: {
          en: '114 BC: The cataclysm that destroyed the greatest civilization and its dragons.',
          sv: '114 BC: Katastrofen som förstörde den främsta civilisationen och dess drakar.'
        }
      },
      games: {
        title: { en: 'Fourteen Flames', sv: 'De fjorton flammorna' },
        images: [{ url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2022&auto=format&fit=crop', alt: 'Volcano' }]
      },
      pixelArt: {
        title: { en: 'Lost Knowledge', sv: 'Förlorad kunskap' },
        description: { en: 'Spells and steel lost to the smoke.', sv: 'Besvärjelser och stål som förlorades i röken.' },
        images: []
      },
      arcade: {
        title: { en: 'Dragonlords', sv: 'Drakherrar' },
        description: { en: 'Those who ruled the skies before the fall.', sv: 'De som regerade himlarna före fallet.' },
        images: []
      },
      tech: {
        title: { en: 'Valyrian Steel', sv: 'Valyriskt stål' },
        hardware: [
          { name: { en: 'Spell-forged blades', sv: 'Förtrollade klingor' }, specs: { en: 'Unparalleled sharpness', sv: 'Oöverträffad skärpa' } },
          { name: { en: 'Dragon Horns', sv: 'Drakhorn' }, specs: { en: 'Tools to bind dragons', sv: 'Verktyg för att binda drakar' } }
        ],
        image: 'https://images.unsplash.com/photo-1594061683313-25114249bf55?q=80&w=2069&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'The Roar of Magma', sv: 'Magmans dån' },
        description: { en: 'The earth splitting open in a final scream.', sv: 'Jorden som öppnade sig i ett sista skrik.' }
      },
      filmVfx: {
        title: { en: 'Ash & Smoke', sv: 'Aska & Rök' },
        description: { en: 'Particles of a dying empire.', sv: 'Partiklar av ett döende imperium.' },
        images: []
      },
      uiDesign: {
        title: { en: 'Obsidian UI', sv: 'Obsidian UI' },
        description: { en: 'Dark, sharp and mysterious interface.', sv: 'Mörkt, skarpt och mystiskt gränssnitt.' },
        image: ''
      },
      summary: {
        title: { en: '114 BC', sv: '114 BC' },
        description: { en: 'The day the dragons died and the world changed forever.', sv: 'Dagen då drakarna dog och världen förändrades för alltid.' },
        icons: ['skull']
      }
    },
    {
      year: 0,
      theme: {
        uiStyle: 'fire',
        colors: {
          primary: '#f59e0b',
          secondary: '#b91c1c',
          background: '#450a0a',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: 'Aegon’s Conquest', sv: 'Aegons Erövring' },
        description: {
          en: '0 AC: Aegon Targaryen and his sisters united the Seven Kingdoms.',
          sv: '0 AC: Aegon Targaryen och hans systrar enade de sju rikena.'
        }
      },
      games: {
        title: { en: 'The Black Dread', sv: 'The Black Dread' },
        images: [{ url: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=2070&auto=format&fit=crop', alt: 'Dragon Fire' }]
      },
      pixelArt: {
        title: { en: 'Dracarys', sv: 'Dracarys' },
        description: { en: 'The fire that forged a kingdom.', sv: 'Elden som smidde ett rike.' },
        images: []
      },
      arcade: {
        title: { en: 'The Iron Throne', sv: 'Järntronen' },
        description: { en: 'Forged from a thousand swords.', sv: 'Smidda av tusen svärd.' },
        images: []
      },
      tech: {
        title: { en: 'Dragonstone', sv: 'Draksten' },
        hardware: [
          { name: { en: 'Three Dragons', sv: 'Tre drakar' }, specs: { en: 'Living weapons', sv: 'Levande vapen' } },
          { name: { en: 'The Throne', sv: 'Tronen' }, specs: { en: 'Forged in dragonfire', sv: 'Smidd i drakeld' } }
        ],
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=2032&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'Wings of Fire', sv: 'Vingars eld' },
        description: { en: 'The sound of scales and flame.', sv: 'Ljudet av fjäll och flammor.' }
      },
      filmVfx: {
        title: { en: 'Field of Fire', sv: 'Field of Fire' },
        description: { en: 'Spectacular cinematic destruction.', sv: 'Spektakulär cinematisk förstörelse.' },
        images: []
      },
      uiDesign: {
        title: { en: 'Blood & Gold', sv: 'Blod & Guld' },
        description: { en: 'Royal Targaryen aesthetics.', sv: 'Kunglig Targaryen-estetik.' },
        image: ''
      },
      summary: {
        title: { en: '0 AC', sv: '0 AC' },
        description: { en: 'The unification of Westeros and the start of the Targaryen dynasty.', sv: 'Enandet av Westeros och början på Targaryen-dynastin.' },
        icons: ['flame']
      }
    },
    {
      year: 298,
      theme: {
        uiStyle: 'royal',
        colors: {
          primary: '#fbbf24',
          secondary: '#78350f',
          background: '#000000',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: 'The Game of Thrones', sv: 'Kampen om tronen' },
        description: {
          en: '298 AC: The death of Jon Arryn and the start of the great war.',
          sv: '298 AC: Jon Arryns död och början på det stora kriget.'
        }
      },
      games: {
        title: { en: 'The Seven Kingdoms', sv: 'De sju rikena' },
        images: [{ url: 'https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=2069&auto=format&fit=crop', alt: 'Medieval City' }]
      },
      pixelArt: {
        title: { en: 'Political Intrigue', sv: 'Politiska intriger' },
        description: { en: 'Plots within plots, masters of whisperers.', sv: 'Ränksmideri och viskningarnas mästare.' },
        images: []
      },
      arcade: {
        title: { en: 'The Iron Bank', sv: 'Järnbanken' },
        description: { en: 'Power beyond kings.', sv: 'Makt bortom kungar.' },
        images: []
      },
      tech: {
        title: { en: 'Wildfire', sv: 'Skogsbrand' },
        hardware: [
          { name: { en: 'The Citadel', sv: 'Citadellet' }, specs: { en: 'Keepers of knowledge', sv: 'Kunskapens väktare' } },
          { name: { en: 'Raven Network', sv: 'Korp-nätverket' }, specs: { en: 'Instant communication', sv: 'Snabb kommunikation' } }
        ],
        image: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=80&w=2069&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'Rains of Castamere', sv: 'Rains of Castamere' },
        description: { en: 'A song of pride and warning.', sv: 'En sång om stolthet och varning.' }
      },
      filmVfx: {
        title: { en: 'Battle for the Dawn', sv: 'Striden för gryningen' },
        description: { en: 'The living against the dead.', sv: 'De levande mot de döda.' },
        images: []
      },
      uiDesign: {
        title: { en: 'The Crown', sv: 'Kronan' },
        description: { en: 'The ultimate symbol of power.', sv: 'Den ultimata symbolen för makt.' },
        image: ''
      },
      summary: {
        title: { en: '298 AC', sv: '298 AC' },
        description: { en: 'The struggle for power reaches its peak as winter finally arrives.', sv: 'Kampen om makten når sin höjdpunkt när vintern äntligen anländer.' },
        icons: ['crown']
      }
    }
  ]
};
