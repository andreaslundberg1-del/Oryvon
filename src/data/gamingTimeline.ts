import { Timeline } from '@/types/timeline';

export const gamingTimeline: Timeline = {
  id: 'gaming-history',
  title: {
    en: 'Gaming Lore',
    sv: 'Spelens Värld'
  },
  description: {
    en: 'The legends and lore of the gaming universe, from arcades to virtual realities.',
    sv: 'Legender och myter i spelvärlden, från arkadhallar till virtuella verkligheter.'
  },
  years: [
    {
      year: 1972,
      theme: {
        uiStyle: 'arcade',
        colors: {
          primary: '#00ff00',
          secondary: '#ffffff',
          background: '#000000',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: '1972', sv: '1972' },
        description: {
          en: 'The birth of the commercial video game industry with Pong.',
          sv: 'Födelsen av den kommersiella videospelsindustrin med spelet Pong.'
        }
      },
      games: {
        title: { en: 'Pong', sv: 'Pong' },
        images: [
          { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop', alt: 'Pong CRT' }
        ]
      },
      pixelArt: {
        title: { en: 'Primitive Pixels', sv: 'Primitiva Pixlar' },
        description: {
          en: 'Just a few squares on a screen was enough to captivate a generation.',
          sv: 'Bara ett par fyrkanter på en skärm var nog för att fängsla en hel generation.'
        },
        images: []
      },
      arcade: {
        title: { en: 'Magnavox Odyssey', sv: 'Magnavox Odyssey' },
        description: {
          en: 'The first home console is launched.',
          sv: 'Den första hemkonsolen lanseras.'
        },
        images: []
      },
      tech: {
        title: { en: 'Tech', sv: 'Teknik' },
        hardware: [
          { name: { en: 'Atari', sv: 'Atari' }, specs: { en: 'Founded by Nolan Bushnell', sv: 'Grundas av Nolan Bushnell' } },
          { name: { en: 'Transistors', sv: 'Transistorer' }, specs: { en: 'Discrete logic, no processors', sv: 'Diskret logik, inga processorer' } }
        ],
        image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?q=80&w=2042&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'Beeps and Boops', sv: 'Bip och Boop' },
        description: {
          en: 'Simple tones and beeping sounds.',
          sv: 'Enkla tonslingor och pipande ljud.'
        }
      },
      filmVfx: {
        title: { en: 'Games on TV', sv: 'Spel på TV' },
        description: {
          en: 'Games move from university labs to public living rooms.',
          sv: 'Spelen flyttar från universitetslabben till allmänhetens vardagsrum.'
        },
        images: []
      },
      uiDesign: {
        title: { en: 'Scoreboards', sv: 'Poängtavlor' },
        description: {
          en: 'Simple text to keep score.',
          sv: 'Enkel text för att hålla poäng.'
        },
        image: ''
      },
      summary: {
        title: { en: '1972 – Games Become Culture', sv: '1972 – Spel blir kultur' },
        description: {
          en: 'Pong proves there is a massive market for interactive entertainment.',
          sv: 'Pong bevisar att det finns en enorm marknad för interaktiv underhållning.'
        },
        icons: ['gamepad']
      }
    },
    {
      year: 1981,
      theme: {
        uiStyle: 'arcade',
        colors: {
          primary: '#ffeb3b',
          secondary: '#e91e63',
          background: '#1a0033',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: '1981', sv: '1981' },
        description: {
          en: 'The golden age of arcades when Donkey Kong and Pac-Man ruled the world.',
          sv: 'Arkadhallarnas guldålder när Donkey Kong och Pac-Man styrde världen.'
        }
      },
      games: {
        title: { en: 'Iconic Characters', sv: 'Ikoniska Karaktärer' },
        images: [
          { url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2071&auto=format&fit=crop', alt: 'Arcade Cabinets' }
        ]
      },
      pixelArt: {
        title: { en: 'Colorful Sprite Art', sv: 'Färgglad Sprite-konst' },
        description: {
          en: 'Artists began creating recognizable figures with few pixels.',
          sv: 'Konstnärer började skapa igenkännbara figurer med få pixlar.'
        },
        images: []
      },
      arcade: {
        title: { en: 'Coin Drops', sv: 'Myntinkast' },
        description: {
          en: 'The game industry pulls in more money than film and music combined.',
          sv: 'Spelindustrin drar in mer pengar än film- och musikindustrin kombinerat.'
        },
        images: []
      },
      tech: {
        title: { en: 'Tech', sv: 'Teknik' },
        hardware: [
          { name: { en: 'Zilog Z80', sv: 'Zilog Z80' }, specs: { en: 'Popular processor for arcade games', sv: 'Populär processor för arkadspel' } },
          { name: { en: 'IBM PC', sv: 'IBM PC' }, specs: { en: 'Launched', sv: 'Lanseras' } }
        ],
        image: 'https://images.unsplash.com/photo-1629851610484-93e506e75dd5?q=80&w=2070&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'Earworms', sv: 'Öronmaskar' },
        description: {
          en: 'Pac-Man\'s siren sound and waka-waka are burned into many memories.',
          sv: 'Pac-Mans sirenljud och waka-waka är bränt in i mångas minnen.'
        }
      },
      filmVfx: {
        title: { en: 'Pop Culture', sv: 'Popkultur' },
        description: {
          en: 'Game characters begin appearing on cereal boxes and cartoons.',
          sv: 'Spelkaraktärer börjar dyka upp på frukostflingor och tecknade serier.'
        },
        images: []
      },
      uiDesign: {
        title: { en: 'High Score', sv: 'High Score' },
        description: {
          en: 'Entering your initials was the highest form of bragging rights.',
          sv: 'Att skriva in sina initialer var den högsta formen av skryt.'
        },
        image: ''
      },
      summary: {
        title: { en: '1981 – Arcade Fever', sv: '1981 – Arkadfeber' },
        description: {
          en: 'A year that cemented video games as a permanent fixture in global culture.',
          sv: 'Ett år som cementerade tv-spelen som ett permanent inslag i den globala kulturen.'
        },
        icons: ['star']
      }
    }
  ]
};
