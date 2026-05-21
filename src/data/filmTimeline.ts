import { Timeline } from '@/types/timeline';

export const filmTimeline: Timeline = {
  id: 'film-history',
  title: {
    en: 'Cinematic Evolution',
    sv: 'Filmens Utveckling'
  },
  description: {
    en: 'The journey of film from silent black and white to immersive digital worlds.',
    sv: 'Filmens resa från stum svartvitt till omslutande digitala världar.'
  },
  years: [
    {
      year: 1927,
      theme: {
        uiStyle: 'noir',
        colors: {
          primary: '#e6e6e6',
          secondary: '#8c8c8c',
          background: '#0a0a0a',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: '1927', sv: '1927' },
        description: {
          en: 'The breakthrough of sound film. Film got a voice and changed storytelling forever.',
          sv: 'Ljudfilmens genombrott. Filmen fick röst och förändrade berättandet för evigt.'
        }
      },
      games: {
        title: { en: 'The Beginning of Sound', sv: 'Början av Ljudet' },
        images: [
          { url: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2059&auto=format&fit=crop', alt: 'Vintage Film Roll' }
        ]
      },
      pixelArt: {
        title: { en: 'Black & White Contrast', sv: 'Svartvitt & Kontrast' },
        description: {
          en: 'Lighting played a crucial role in early black and white productions.',
          sv: 'Ljussättningen spelade en avgörande roll i tidiga svartvita produktioner.'
        },
        images: []
      },
      arcade: {
        title: { en: 'The Cinema as a Palace', sv: 'Biografen som Palats' },
        description: {
          en: 'Cinemas were grandiose palaces where thousands gathered.',
          sv: 'Biografer var grandiosa palats där tusentals samlades.'
        },
        images: []
      },
      tech: {
        title: { en: 'Tech', sv: 'Teknik' },
        hardware: [
          { name: { en: 'Vitaphone', sv: 'Vitaphone' }, specs: { en: 'Sound-on-disc system', sv: 'Ljud-på-skiva system' } },
          { name: { en: 'Movietone', sv: 'Movietone' }, specs: { en: 'Sound-on-film', sv: 'Ljud-på-film' } }
        ],
        image: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'The Jazz Singer', sv: 'The Jazz Singer' },
        description: {
          en: 'Synchronized dialog and music. A milestone in film history.',
          sv: 'Synkroniserad dialog och musik. En milstolpe i filmhistorien.'
        }
      },
      filmVfx: {
        title: { en: 'Metropolis', sv: 'Metropolis' },
        description: {
          en: 'The same year set the standard for epic sci-fi and early miniature effects.',
          sv: 'Samma år sattes standarden för storslagen sci-fi och tidiga miniatyreffekter.'
        },
        images: [
          { url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1925&auto=format&fit=crop', alt: 'Sci-fi Cinema' }
        ]
      },
      uiDesign: {
        title: { en: 'Title Cards & Typography', sv: 'Titellkort & Typografi' },
        description: {
          en: 'Intertitles with dialog began to disappear but left a strong typographic legacy.',
          sv: 'Mellankort med dialog började försvinna men efterlämnade en stark typografisk arv.'
        },
        image: ''
      },
      summary: {
        title: { en: '1927 – A New Voice', sv: '1927 – En ny röst' },
        description: {
          en: 'The year silent films began to fade, and a new world of sound took over the silver screen.',
          sv: 'Det år då stumfilmen började försvinna, och en ny värld av ljud tog över biodukarna.'
        },
        icons: ['film']
      }
    },
    {
      year: 1977,
      theme: {
        uiStyle: 'scifi',
        colors: {
          primary: '#0055ff',
          secondary: '#ffcc00',
          background: '#00001a',
          text: '#ffffff'
        }
      },
      intro: {
        title: { en: '1977', sv: '1977' },
        description: {
          en: 'The age of the blockbuster begins with Star Wars and groundbreaking effects.',
          sv: 'Blockbusterns tidsålder inleds med stjärnornas krig och banbrytande effekter.'
        }
      },
      games: {
        title: { en: 'Space Magic', sv: 'Rymdens Magik' },
        images: [
          { url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=2094&auto=format&fit=crop', alt: 'Space VFX' }
        ]
      },
      pixelArt: {
        title: { en: 'Practical Effects', sv: 'Praktiska Effekter' },
        description: {
          en: 'Miniatures and motion control cameras.',
          sv: 'Miniatyrer och motion control-kameror.'
        },
        images: []
      },
      arcade: {
        title: { en: 'Cultural Phenomenon', sv: 'Kulturfenomen' },
        description: {
          en: 'Lines wrapped around the blocks.',
          sv: 'Köerna ringlade sig runt kvarteren.'
        },
        images: []
      },
      tech: {
        title: { en: 'Tech', sv: 'Teknik' },
        hardware: [
          { name: { en: 'Dykstraflex', sv: 'Dykstraflex' }, specs: { en: 'Computer-controlled camera system', sv: 'Datorstyrd kamerasystem' } },
          { name: { en: 'Dolby Stereo', sv: 'Dolby Stereo' }, specs: { en: 'Surround sound in cinemas', sv: 'Surroundljud på bio' } }
        ],
        image: 'https://images.unsplash.com/photo-1585647347384-2593bc35786b?q=80&w=2070&auto=format&fit=crop'
      },
      audio: {
        title: { en: 'Sound Design as Art', sv: 'Ljuddesign som Konst' },
        description: {
          en: 'Laser sounds and spaceship engines created with everyday objects.',
          sv: 'Laserljud och rymdskeppsmotorer skapade med vardagliga objekt.'
        }
      },
      filmVfx: {
        title: { en: 'Industrial Light & Magic', sv: 'Industrial Light & Magic' },
        description: {
          en: 'A brand new company was created solely to handle the complex visual effects.',
          sv: 'Ett helt nytt bolag skapades enbart för att hantera de komplexa visuella effekterna.'
        },
        images: []
      },
      uiDesign: {
        title: { en: 'Futurism', sv: 'Futurism' },
        description: {
          en: 'Glowing screens and computer simulations in the world of film.',
          sv: 'Glödande skärmar och datorsimuleringar i filmens värld.'
        },
        image: ''
      },
      summary: {
        title: { en: '1977 – Another Galaxy', sv: '1977 – En annan galax' },
        description: {
          en: 'The film industry changed fundamentally. Sci-fi and fantasy proved their power over cinema audiences.',
          sv: 'Filmindustrin förändrades från grunden. Sci-fi och fantasy bevisade sin makt över biopubliken.'
        },
        icons: ['star']
      }
    }
  ]
};
