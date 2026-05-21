import { Timeline } from '@/types/timeline';

export const footballTimeline: Timeline = {
  id: 'football-history',
  title: {
    en: 'The History of Football',
    sv: 'Fotbollens Historia'
  },
  description: {
    en: 'From muddy pitches to global stadiums. The beautiful game.',
    sv: 'Från leriga planer till globala arenor. Det vackra spelet.'
  },
  years: [
    {
      year: 1930,
      theme: {
        uiStyle: 'noir',
        colors: {
          primary: '#d4af37',
          secondary: '#8c8c8c',
          background: '#1a1a1a',
          text: '#fdfdfd'
        }
      },
      intro: {
        title: { en: '1930', sv: '1930' },
        description: {
          en: 'The first ever FIFA World Cup takes place in Uruguay.',
          sv: 'Det allra första FIFA Fotbolls-VM spelas i Uruguay.'
        }
      },
      games: {
        title: { en: 'The Beginning', sv: 'Början' },
        images: [
          { url: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=2070&auto=format&fit=crop', alt: 'Vintage Football' }
        ]
      },
      pixelArt: {
        title: { en: 'Heavy Leather', sv: 'Tungt Läder' },
        description: {
          en: 'The balls were made of heavy leather with laces.',
          sv: 'Bollarna var gjorda av tungt läder och hade snörning.'
        },
        images: []
      },
      arcade: {
        title: { en: 'No Substitutes', sv: 'Inga Avbytare' },
        description: {
          en: 'Players played the full 90 minutes, no matter the injury.',
          sv: 'Spelarna körde hela 90 minuter, oavsett skador.'
        },
        images: []
      },
      tech: {
        title: { en: 'Tech', sv: 'Teknik' },
        hardware: [
          { name: { en: 'Radio', sv: 'Radio' }, specs: { en: 'The only broadcast', sv: 'Enda sättet att sända' } }
        ],
        image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'Roar of the Crowd', sv: 'Publikens Vrål' },
        description: {
          en: 'Stadiums packed to the brim with pure passion.',
          sv: 'Arenor packade till bredden med ren passion.'
        }
      },
      filmVfx: {
        title: { en: 'Black and White', sv: 'Svartvitt' },
        description: {
          en: 'All photographs and footage are strictly black and white.',
          sv: 'Alla foton och all film är strikt svartvitt.'
        },
        images: []
      },
      uiDesign: {
        title: { en: 'Newsprint', sv: 'Tidningspapper' },
        description: {
          en: 'Results were read in the next day\'s paper.',
          sv: 'Resultaten lästes i nästa dags tidning.'
        },
        image: ''
      },
      summary: {
        title: { en: '1930 – A Global Game', sv: '1930 – Ett globalt spel' },
        description: {
          en: 'The foundation for the world\'s biggest sporting event was laid.',
          sv: 'Grunden för världens största sportevenemang var lagd.'
        },
        icons: ['star']
      }
    },
    {
      year: 1970,
      theme: {
        uiStyle: 'arcade',
        colors: {
          primary: '#ffe600',
          secondary: '#008000',
          background: '#0a1a0a',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: '1970', sv: '1970' },
        description: {
          en: 'Pelé and Brazil dazzle the world in glorious technicolor.',
          sv: 'Pelé och Brasilien förtrollar världen i färg-TV.'
        }
      },
      games: {
        title: { en: 'Joga Bonito', sv: 'Joga Bonito' },
        images: [
          { url: 'https://images.unsplash.com/photo-1518605368461-1b8ceb43c6d7?q=80&w=2070&auto=format&fit=crop', alt: 'Stadium Lights' }
        ]
      },
      pixelArt: {
        title: { en: 'The Telstar', sv: 'Telstar-bollen' },
        description: {
          en: 'The iconic black and white pentagon football is introduced for TV visibility.',
          sv: 'Den ikoniska svartvita femhörningsbollen introduceras för att synas bättre på TV.'
        },
        images: []
      },
      arcade: {
        title: { en: 'Yellow Shirts', sv: 'Gula Tröjor' },
        description: {
          en: 'Brazil\'s yellow becomes a global symbol of joy.',
          sv: 'Brasiliens gula tröjor blir en global symbol för glädje.'
        },
        images: []
      },
      tech: {
        title: { en: 'Color Broadcast', sv: 'Färgsändningar' },
        hardware: [
          { name: { en: 'Satellite TV', sv: 'Satellit-TV' }, specs: { en: 'Live global broadcast', sv: 'Live över hela världen' } }
        ],
        image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2070&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'Samba', sv: 'Samba' },
        description: {
          en: 'The rhythm of the drums in the Mexican stadiums.',
          sv: 'Rytmen från trummorna i de mexikanska arenorna.'
        }
      },
      filmVfx: {
        title: { en: 'The Beautiful Game', sv: 'Det Vackra Spelet' },
        description: {
          en: 'Football becomes an art form.',
          sv: 'Fotboll blir till en konstform.'
        },
        images: []
      },
      uiDesign: {
        title: { en: 'Scoreboards', sv: 'Poängtavlor' },
        description: {
          en: 'Electronic scoreboards begin to appear.',
          sv: 'Elektroniska poängtavlor börjar dyka upp.'
        },
        image: ''
      },
      summary: {
        title: { en: '1970 – Color and Joy', sv: '1970 – Färg och Glädje' },
        description: {
          en: 'The tournament that defined modern football aesthetics.',
          sv: 'Turneringen som definierade modern fotbollsestetik.'
        },
        icons: ['eye']
      }
    },
    {
      year: 2022,
      theme: {
        uiStyle: 'cinematic',
        colors: {
          primary: '#8a1538',
          secondary: '#ffffff',
          background: '#1a050b',
          text: '#fdfdfd'
        }
      },
      intro: {
        title: { en: '2022', sv: '2022' },
        description: {
          en: 'Messi completes football in the most dramatic final ever played.',
          sv: 'Messi "varvar" fotbollen i den mest dramatiska finalen någonsin.'
        }
      },
      games: {
        title: { en: 'The Crowning', sv: 'Kröningen' },
        images: [
          { url: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070&auto=format&fit=crop', alt: 'Modern Stadium' }
        ]
      },
      pixelArt: {
        title: { en: 'VAR', sv: 'VAR' },
        description: {
          en: 'Technology analyzes every millimeter of the pitch.',
          sv: 'Teknik analyserar varje millimeter av planen.'
        },
        images: []
      },
      arcade: {
        title: { en: 'Desert Winter', sv: 'Ökenvinter' },
        description: {
          en: 'First tournament played in November/December.',
          sv: 'Första turneringen som spelades i november/december.'
        },
        images: []
      },
      tech: {
        title: { en: 'Smart Ball', sv: 'Smart Boll' },
        hardware: [
          { name: { en: 'Sensors', sv: 'Sensorer' }, specs: { en: '500 data points per second', sv: '500 datapunkter per sekund' } }
        ],
        image: 'https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=2070&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'Muchachos', sv: 'Muchachos' },
        description: {
          en: 'The anthem that echoed across the globe.',
          sv: 'Sången som ekade över hela världen.'
        }
      },
      filmVfx: {
        title: { en: '4K Drones', sv: '4K-drönare' },
        description: {
          en: 'Cinematic angles from flying cameras.',
          sv: 'Cinematiska vinklar från flygande kameror.'
        },
        images: []
      },
      uiDesign: {
        title: { en: 'Data Overlays', sv: 'Data-överlägg' },
        description: {
          en: 'Augmented reality graphics show speed and tactics in real-time.',
          sv: 'AR-grafik visar hastighet och taktik i realtid på rutan.'
        },
        image: ''
      },
      summary: {
        title: { en: '2022 – The Climax', sv: '2022 – Klimax' },
        description: {
          en: 'A technological marvel meeting pure, unpredictable human drama.',
          sv: 'Ett tekniskt underverk som mötte rent, oförutsägbart mänskligt drama.'
        },
        icons: ['star']
      }
    }
  ]
};
