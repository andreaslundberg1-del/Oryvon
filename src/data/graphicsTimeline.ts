import { Timeline } from '@/types/timeline';

export const graphicsTimeline: Timeline = {
  id: 'graphics-history',
  title: {
    en: 'The Evolution of Visuals',
    sv: 'Grafikens Evolution',
    ja: 'グラフィックスの進化'
  },
  description: {
    en: 'A cinematic journey through the history of computer graphics, year by year.',
    sv: 'En filmisk resa genom datorgrafikens historia, år för år.',
    ja: 'コンピュータグラフィックスの歴史を年を追うごとに巡る、映画のような旅。'
  },
  years: [
    // 1950s: The CRT & Terminal Era
    ...Array.from({ length: 10 }, (_, i) => {
      const year = 1950 + i;
      const hue = 140 + (i * 5); // Green to Cyan-ish
      return {
        year,
        theme: {
          uiStyle: 'terminal' as const,
          ambience: 'radar' as const,
          backgroundAnimation: 'scanlines' as const,
          particles: { type: 'dust' as const, count: 20 + i * 5, color: `hsl(${hue}, 100%, 50%)` },
          pixelation: 8,
          scanlineIntensity: 0.8 + (i * 0.02),
          colors: {
            primary: `hsl(${hue}, 70%, 40%)`,
            secondary: `hsl(${hue}, 80%, 10%)`,
            background: '#020617',
            text: `hsl(${hue}, 90%, 70%)`
          }
        },
        intro: {
          title: { en: year === 1958 ? 'Tennis for Two' : `Year ${year}: Cold War Computing` },
          description: { 
            en: year === 1958 ? 'The first electronic game, played on an oscilloscope.' : 
                `Visual experiments in ${year} using vacuum tube logic and monochromatic radar screens.`
          }
        },
        games: { 
          title: { en: 'Early Logic' }, 
          images: [{ 
            url: `https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&sig=${year}`, 
            alt: `Graphics in ${year}` 
          }] 
        },
        pixelArt: { title: { en: 'Oscilloscopes' }, description: { en: 'Drawing lines with electricity.' }, images: [] },
        arcade: { title: { en: 'Mainframes' }, description: { en: `The state of computing in ${year}.` }, images: [] },
        tech: { title: { en: 'Vacuum Tubes' }, hardware: [{ name: { en: year < 1955 ? 'ENIAC' : 'IBM 701' }, specs: { en: `${year % 10 + 1}KB memory` } }], image: `https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&sig=${year+100}` },
        audio: { title: { en: 'Electronic Hum' }, description: { en: 'The unique tone of mid-century hardware.' } },
        filmVfx: { title: { en: 'Visual Experiments' }, description: { en: 'Early oscilloscope art.' }, images: [] },
        uiDesign: { title: { en: 'Punch Cards' }, description: { en: 'Binary input systems.' }, image: '' },
        summary: { title: { en: 'The Beginning' }, description: { en: `Setting the foundation in ${year}.` }, icons: ['monitor'] }
      };
    }),
    
    // 1960s: The Vector & Space Era
    ...Array.from({ length: 10 }, (_, i) => {
      const year = 1960 + i;
      const hue = 210 + (i * 4); // Blue to Indigo
      return {
        year,
        theme: {
          uiStyle: 'terminal' as const,
          ambience: 'future' as const,
          backgroundAnimation: 'stars' as const,
          particles: { type: 'points' as const, count: 50 + i * 10, color: `hsl(${hue}, 80%, 60%)` },
          pixelation: 6,
          colors: {
            primary: `hsl(${hue}, 80%, 50%)`,
            secondary: `hsl(${hue}, 90%, 15%)`,
            background: '#020617',
            text: `hsl(${hue}, 70%, 80%)`
          }
        },
        intro: {
          title: { en: year === 1962 ? 'Spacewar!' : `Year ${year}: The Space Age` },
          description: { 
            en: year === 1962 ? 'The first widely available computer game, built on the PDP-1.' : 
                `Vector displays in ${year} allow for precise geometric movement.`
          }
        },
        games: { 
          title: { en: 'Vectors' }, 
          images: [{ 
            url: `https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&sig=${year}`, 
            alt: `Space graphics ${year}` 
          }] 
        },
        pixelArt: { title: { en: 'Vector Scopes' }, description: { en: 'No pixels, just lines.' }, images: [] },
        arcade: { title: { en: 'PDP-1' }, description: { en: 'Minicomputers arrive.' }, images: [] },
        tech: { title: { en: 'Transistors' }, hardware: [{ name: { en: 'PDP-1' }, specs: { en: 'Type 30 Display' } }], image: `https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&sig=${year+200}` },
        audio: { title: { en: 'Synth Beeps' }, description: { en: 'Early square wave generation.' } },
        filmVfx: { title: { en: '2001: A Space Odyssey' }, description: { en: 'Slit-scan photography.' }, images: [] },
        uiDesign: { title: { en: 'Light Pens' }, description: { en: 'The first interactive stylus.' }, image: '' },
        summary: { title: { en: 'Reach for Stars' }, description: { en: `Innovation reaches a peak in ${year}.` }, icons: ['monitor'] }
      };
    }),

    // 1970s: The Arcade & Console Dawn
    ...Array.from({ length: 10 }, (_, i) => {
      const year = 1970 + i;
      const hue = 30 + (i * 6); // Orange to Yellow
      return {
        year,
        theme: {
          uiStyle: 'arcade' as const,
          ambience: 'synthwave' as const,
          backgroundAnimation: 'grid' as const,
          particles: { type: 'lines' as const, count: 30, color: `hsl(${hue}, 100%, 50%)` },
          pixelation: 5,
          colors: {
            primary: `hsl(${hue}, 90%, 50%)`,
            secondary: `hsl(${hue}, 100%, 15%)`,
            background: '#0f172a',
            text: `hsl(${hue}, 80%, 75%)`
          }
        },
        intro: {
          title: { en: year === 1972 ? 'PONG' : year === 1978 ? 'Space Invaders' : `Year ${year}: The Coin-Op Era` },
          description: { 
            en: year === 1972 ? 'Atari defines the arcade with a simple game of tennis.' : 
                `The golden age of arcade machines grows in ${year}.`
          }
        },
        games: { 
          title: { en: '8-Bit Roots' }, 
          images: [{ 
            url: `https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&sig=${year}`, 
            alt: `Arcade machine ${year}` 
          }] 
        },
        pixelArt: { title: { en: 'Sprites' }, description: { en: 'Characters built from blocks.' }, images: [] },
        arcade: { title: { en: 'Atari' }, description: { en: 'The first home console giant.' }, images: [] },
        tech: { title: { en: 'CPU Boom' }, hardware: [{ name: { en: 'MOS 6502' }, specs: { en: '1.02 MHz' } }], image: `https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1000&sig=${year+300}` },
        audio: { title: { en: 'FM Synthesis' }, description: { en: 'Complex wave synthesis.' } },
        filmVfx: { title: { en: 'Star Wars' }, description: { en: 'Motion control cameras.' }, images: [] },
        uiDesign: { title: { en: 'Vector Arcade' }, description: { en: 'Asteroids and Battlezone.' }, image: '' },
        summary: { title: { en: 'Game On' }, description: { en: `Arcade fever spreads in ${year}.` }, icons: ['gamepad'] }
      };
    }),

    // 1980s: The 8-Bit & Pixel Art Era
    ...Array.from({ length: 10 }, (_, i) => {
      const year = 1980 + i;
      const hue = 320 + (i * 8); // Pink to Purple
      return {
        year,
        theme: {
          uiStyle: 'arcade' as const,
          ambience: 'synthwave' as const,
          backgroundAnimation: 'geometric' as const,
          particles: { type: 'snow' as const, count: 40, color: `hsl(${hue}, 100%, 70%)` },
          pixelation: 4,
          colors: {
            primary: `hsl(${hue}, 80%, 60%)`,
            secondary: `hsl(${hue}, 100%, 10%)`,
            background: '#0c0a09',
            text: `hsl(${hue}, 70%, 80%)`
          }
        },
        intro: {
          title: { en: year === 1980 ? 'PAC-MAN' : year === 1985 ? 'Super Mario Bros' : `Year ${year}: Pixel Dreams` },
          description: { 
            en: year === 1985 ? 'Nintendo revives the industry with Mario and the NES.' : 
                `Home computers and 8-bit consoles reach new heights in ${year}.`
          }
        },
        games: { 
          title: { en: '8-Bit Legends' }, 
          images: [{ 
            url: `https://images.unsplash.com/photo-1527176930608-09cb256ab504?q=80&w=1000&sig=${year}`, 
            alt: `8-bit game ${year}` 
          }] 
        },
        pixelArt: { title: { en: 'Palettes' }, description: { en: 'Limited color mastery.' }, images: [] },
        arcade: { title: { en: 'Console War' }, description: { en: `Hardware battles in ${year}.` }, images: [] },
        tech: { title: { en: 'PPU' }, hardware: [{ name: { en: 'NES PPU' }, specs: { en: '256x240 pixels' } }], image: `https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?q=80&w=1000&sig=${year+400}` },
        audio: { title: { en: 'Chiptune' }, description: { en: 'Orchestral bit-tunes.' } },
        filmVfx: { title: { en: 'Early CGI' }, description: { en: 'Computers enter cinema.' }, images: [] },
        uiDesign: { title: { en: '16-Color' }, description: { en: 'Refined UI layouts.' }, image: '' },
        summary: { title: { en: 'Golden Age' }, description: { en: `Pixel perfection in ${year}.` }, icons: ['gamepad'] }
      };
    }),

    // 1990s: The 3D Revolution & Multimedia Era
    ...Array.from({ length: 10 }, (_, i) => {
      const year = 1990 + i;
      const hue = 150 + (i * 5); // Green to Teal
      return {
        year,
        theme: {
          uiStyle: 'tech' as const,
          ambience: 'modern' as const,
          backgroundAnimation: 'matrix' as const,
          particles: { type: 'dust' as const, count: 40, color: `hsl(${hue}, 80%, 40%)` },
          pixelation: 2,
          colors: {
            primary: `hsl(${hue}, 70%, 40%)`,
            secondary: `hsl(${hue}, 80%, 5%)`,
            background: '#050505',
            text: `hsl(${hue}, 90%, 60%)`
          }
        },
        intro: {
          title: { en: year === 1993 ? 'DOOM & Myst' : year === 1996 ? 'Quake & 3D Cards' : `Year ${year}: CD-ROM & 3D` },
          description: { 
            en: year === 1993 ? 'id Software changes everything with DOOM, while Myst shows the power of pre-rendered CGI.' : 
                `The jump from 2D sprites to 3D polygons accelerates in ${year}.`
          }
        },
        games: { 
          title: { en: '3D Dawn' }, 
          images: [{ 
            url: `https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&sig=${year}`, 
            alt: `3D graphics ${year}` 
          }] 
        },
        pixelArt: { title: { en: 'Texture Mapping' }, description: { en: 'Wrapping images around polygons.' }, images: [] },
        arcade: { title: { en: 'PlayStation' }, description: { en: `The console boom of ${year}.` }, images: [] },
        tech: { title: { en: 'GPU' }, hardware: [{ name: { en: 'Voodoo Graphics' }, specs: { en: 'Hardware Accel.' } }], image: `https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&sig=${year+500}` },
        audio: { title: { en: 'CD Audio' }, description: { en: 'High fidelity soundtracks.' } },
        filmVfx: { title: { en: 'Jurassic Era' }, description: { en: 'CGI takes center stage.' }, images: [] },
        uiDesign: { title: { en: 'Grey UI' }, description: { en: '90s desktop aesthetics.' }, image: '' },
        summary: { title: { en: '3D Boom' }, description: { en: `Polygons take over in ${year}.` }, icons: ['monitor'] }
      };
    }),

    // 2000s: The HD & Realism Era
    ...Array.from({ length: 10 }, (_, i) => {
      const year = 2000 + i;
      const hue = 190 + (i * 6); // Blue to Azure
      return {
        year,
        theme: {
          uiStyle: 'bloom' as const,
          ambience: 'future' as const,
          backgroundAnimation: 'nebula' as const,
          particles: { type: 'dust' as const, count: 60, color: `hsl(${hue}, 100%, 80%)` },
          pixelation: 0,
          bloomIntensity: 0.4 + i * 0.05,
          colors: {
            primary: `hsl(${hue}, 80%, 50%)`,
            secondary: `hsl(${hue}, 100%, 15%)`,
            background: '#030712',
            text: `hsl(${hue}, 70%, 90%)`
          }
        },
        intro: {
          title: { en: year === 2004 ? 'Half-Life 2' : year === 2007 ? 'Crysis' : `Year ${year}: The Quest for Realism` },
          description: { 
            en: year === 2007 ? 'Crytek pushes hardware to its absolute limit with Crysis.' : 
                `Graphics reach a new level of fidelity in ${year} with HD shaders.`
          }
        },
        games: { 
          title: { en: 'HD Realism' }, 
          images: [{ 
            url: `https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&sig=${year}`, 
            alt: `HD gaming ${year}` 
          }] 
        },
        pixelArt: { title: { en: 'Shaders' }, description: { en: 'Programmable pipelines.' }, images: [] },
        arcade: { title: { en: 'Next-Gen' }, description: { en: `Hardware evolution in ${year}.` }, images: [] },
        tech: { title: { en: 'DirectX' }, hardware: [{ name: { en: 'DX9/10' }, specs: { en: 'Shader Model' } }], image: `https://images.unsplash.com/photo-1587202376732-8179263633b2?q=80&w=1000&sig=${year+600}` },
        audio: { title: { en: 'Spatial Sound' }, description: { en: 'Surround immersion.' } },
        filmVfx: { title: { en: 'CGI Peak' }, description: { en: 'Seamless digital worlds.' }, images: [] },
        uiDesign: { title: { en: 'Glass' }, description: { en: 'Transparent effects.' }, image: '' },
        summary: { title: { en: 'HD Future' }, description: { en: `Visceral realism in ${year}.` }, icons: ['monitor'] }
      };
    }),

    // 2010s: The PBR & Cinematic Era
    ...Array.from({ length: 10 }, (_, i) => {
      const year = 2010 + i;
      const hue = 260 + (i * 7); // Purple to Magenta
      return {
        year,
        theme: {
          uiStyle: 'photoreal' as const,
          ambience: 'epic' as const,
          backgroundAnimation: 'geometric' as const,
          particles: { type: 'lines' as const, count: 40, color: `hsl(${hue}, 100%, 60%)` },
          pixelation: 0,
          colors: {
            primary: `hsl(${hue}, 70%, 50%)`,
            secondary: `hsl(${hue}, 90%, 10%)`,
            background: '#020617',
            text: `hsl(${hue}, 60%, 85%)`
          }
        },
        intro: {
          title: { en: year === 2018 ? 'Ray Tracing Dawn' : `Year ${year}: PBR & Lighting` },
          description: { 
            en: year === 2018 ? 'Real-time ray tracing arrives, changing how we render light forever.' : 
                `Lighting and material quality reach a peak in ${year} with PBR.`
          }
        },
        games: { 
          title: { en: 'Cinematic' }, 
          images: [{ 
            url: `https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=1000&sig=${year}`, 
            alt: `Photorealism ${year}` 
          }] 
        },
        pixelArt: { title: { en: 'Materials' }, description: { en: 'Realistic light interaction.' }, images: [] },
        arcade: { title: { en: 'Open World' }, description: { en: `Immense scale in ${year}.` }, images: [] },
        tech: { title: { en: 'RTX' }, hardware: [{ name: { en: 'RT Core' }, specs: { en: 'Light Simulation' } }], image: `https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1000&sig=${year+700}` },
        audio: { title: { en: 'Atmos' }, description: { en: 'Object-based audio.' } },
        filmVfx: { title: { en: 'Digital Human' }, description: { en: 'Crossing the Uncanny Valley.' }, images: [] },
        uiDesign: { title: { en: 'Flat' }, description: { en: 'Minimalist clarity.' }, image: '' },
        summary: { title: { en: 'Realism Peak' }, description: { en: `Seamless rendering in ${year}.` }, icons: ['monitor'] }
      };
    }),

    // 2020-2026: The Future & AI Era
    ...Array.from({ length: 7 }, (_, i) => {
      const year = 2020 + i;
      const hue = 180 + (i * 12); // Cyan to Teal
      return {
        year,
        theme: {
          uiStyle: 'holographic' as const,
          ambience: 'ambient' as const,
          backgroundAnimation: 'circuits' as const,
          particles: { type: 'fireflies' as const, count: 30, color: `hsl(${hue}, 100%, 70%)` },
          pixelation: 0,
          bloomIntensity: 0.6,
          colors: {
            primary: `hsl(${hue}, 100%, 50%)`,
            secondary: `hsl(${hue}, 100%, 5%)`,
            background: '#020617',
            text: `hsl(${hue}, 80%, 90%)`
          }
        },
        intro: {
          title: { en: year === 2021 ? 'Unreal Engine 5' : year === 2024 ? 'AI Neural Graphics' : `Year ${year}: Virtual Future` },
          description: { 
            en: year === 2024 ? 'AI predicts pixels and generates entire worlds in real-time.' : 
                `AI-driven graphics and virtual production redefine ${year}.`
          }
        },
        games: { 
          title: { en: 'Future' }, 
          images: [{ 
            url: `https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1000&sig=${year}`, 
            alt: `AI Graphics ${year}` 
          }] 
        },
        pixelArt: { title: { en: 'Neural' }, description: { en: 'AI-assisted rendering.' }, images: [] },
        arcade: { title: { en: 'Metaverse' }, description: { en: `Global networks in ${year}.` }, images: [] },
        tech: { title: { en: 'Neural GPU' }, hardware: [{ name: { en: 'Tensor Cores' }, specs: { en: 'AI prediction' } }], image: `https://images.unsplash.com/photo-1620712943543-bcc4628c6bb5?q=80&w=1000&sig=${year+800}` },
        audio: { title: { en: 'Generative' }, description: { en: 'Dynamic soundscapes.' } },
        filmVfx: { title: { en: 'The Volume' }, description: { en: 'Virtual stages.' }, images: [] },
        uiDesign: { title: { en: 'Spatial' }, description: { en: 'Immersive interfaces.' }, image: '' },
        summary: { title: { en: 'Infinite' }, description: { en: `Neural imagination in ${year}.` }, icons: ['monitor'] }
      };
    }),
  ]
};
