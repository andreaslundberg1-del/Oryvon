const data = [
  { year: 1950, style: 'terminal', colors: { p: '#00ff00', b: '#000000' }, desc: 'Tidiga datorer visar mest text och enkla signaler. Svart bakgrund, grön/vit terminaltext, inga riktiga animationer.' },
  { year: 1951, style: 'terminal', colors: { p: '#00ff00', b: '#000500' }, desc: 'CRT-skärmar används mer för forskning. Visa oscilloskop-linjer, radar-känsla och elektriska signaler.' },
  { year: 1952, style: 'terminal', colors: { p: '#ffffff', b: '#000000' }, desc: 'Tidiga experiment med interaktiva skärmar. Enkla former, punkter och tekniska ritningar.' },
  { year: 1953, style: 'terminal', colors: { p: '#33ff33', b: '#050505' }, desc: 'Militär och vetenskaplig grafik utvecklas. Låg upplösning, scanlines och grön monitorstil.' },
  { year: 1954, style: 'terminal', colors: { p: '#00ff00', b: '#000000' }, desc: 'Primitiva datoranimationer testas. Blinkande former och enkel rörelse.' },
  { year: 1955, style: 'terminal', colors: { p: '#00ffff', b: '#000a0a' }, desc: 'Universiteten börjar använda datorvisualisering. Visa grids, matematiska former och teknisk labbkänsla.' },
  { year: 1956, style: 'terminal', colors: { p: '#00ffcc', b: '#000000' }, desc: 'Mer forskning kring datorgrafik. Radar, vektorer och neonliknande linjer.' },
  { year: 1957, style: 'terminal', colors: { p: '#00ff00', b: '#051a05' }, desc: 'Grafik används i flygsimulering. Visa cockpit-HUD, gröna linjer och teknisk instrumentkänsla.' },
  { year: 1958, style: 'terminal', colors: { p: '#ffffff', b: '#000000' }, desc: 'Tennis for Two visar tidig spelgrafik. Enkel svart bakgrund, vita linjer och oscilloskop-look.' },
  { year: 1959, style: 'terminal', colors: { p: '#00ff00', b: '#000000' }, desc: 'Datorgrafik får mer forskningsintresse. Minimalistisk CRT-grafik och elektriska linjer.' },
  { year: 1960, style: 'terminal', colors: { p: '#00ff00', b: '#000000' }, desc: 'Datorgrafik börjar bli ett eget område. Terminaler, tekniska overlays och enkla former.' },
  { year: 1961, style: 'terminal', colors: { p: '#00ffff', b: '#000000' }, desc: 'Vektorgrafik utvecklas. Glödande linjer, wireframes och tekniska figurer.' },
  { year: 1962, style: 'terminal', colors: { p: '#00ff00', b: '#00001a' }, desc: 'Spacewar! visar interaktiv spelgrafik. Svart rymdbakgrund, stjärnor och enkla skepp.' },
  { year: 1963, style: 'terminal', colors: { p: '#ffffff', b: '#000000' }, desc: 'Sketchpad blir ett genombrott för interaktiv grafik. Visa tidiga ritverktyg och vector-UI.' },
  { year: 1964, style: 'terminal', colors: { p: '#00ff00', b: '#000000' }, desc: 'Tidiga 3D-modeller testas. Wireframe-kuber, grids och teknisk 3D.' },
  { year: 1965, style: 'terminal', colors: { p: '#ff00ff', b: '#0a0a0a' }, desc: 'Datoranimation utvecklas. Abstrakta geometriska animationer.' },
  { year: 1966, style: 'terminal', colors: { p: '#00ff00', b: '#000000' }, desc: 'Grafik används mer i simulering. Radar, flyg-HUD och tekniska skärmar.' },
  { year: 1967, style: 'terminal', colors: { p: '#ffff00', b: '#000000' }, desc: 'Digital rörelse blir bättre. Visa experimentell motion graphics.' },
  { year: 1968, style: 'terminal', colors: { p: '#ffffff', b: '#1a1a1a' }, desc: '“Mother of All Demos” visar mus, fönster och framtida UI. Retro GUI-känsla.' },
  { year: 1969, style: 'terminal', colors: { p: '#00ff00', b: '#000033' }, desc: 'NASA och rymdteknik påverkar grafik. Space UI, terminaler och rymddata.' },
  { year: 1970, style: 'arcade', colors: { p: '#ffffff', b: '#000000' }, desc: 'Tidig arkadgrafik börjar ta form. Svart bakgrund, vita pixlar och enkel rörelse.' },
  { year: 1971, style: 'arcade', colors: { p: '#00ffff', b: '#000000' }, desc: 'Computer Space släpps. Arcade cabinet, vector glow och rymdspel.' },
  { year: 1972, style: 'arcade', colors: { p: '#ffffff', b: '#000000' }, desc: 'Pong revolutionerar spelgrafik. Enkel svart/vit grafik, två paddlar och scanlines.' },
  { year: 1973, style: 'arcade', colors: { p: '#ff0000', b: '#000000' }, desc: 'Färgskärmar och rastergrafik utvecklas. Begränsade färger och retro glow.' },
  { year: 1974, style: 'arcade', colors: { p: '#ffff00', b: '#000000' }, desc: 'Rastergrafik förbättras. Chunky pixels och enkla spelrutor.' },
  { year: 1975, style: 'arcade', colors: { p: '#ffffff', b: '#1a1a1a' }, desc: 'Hemdatorer växer fram. Hobby-dator estetik, terminaler och beige hårdvara.' },
  { year: 1976, style: 'arcade', colors: { p: '#00ff00', b: '#000000' }, desc: 'Apple grundas. Hemdatorgrafik blir viktigare.' },
  { year: 1977, style: 'arcade', colors: { p: '#ffcc00', b: '#000000' }, desc: 'Atari 2600 släpps. Enkel pixelgrafik och stark retro gaming-känsla.' },
  { year: 1978, style: 'arcade', colors: { p: '#00ffff', b: '#000000' }, desc: 'Sprite-system blir vanligare. Arkadfärger, scanlines och enkel animation.' },
  { year: 1979, style: 'arcade', colors: { p: '#00ff00', b: '#000000' }, desc: 'Tidiga 3D-experiment. Vector ships, polygonlinjer och rymdspel.' },
  { year: 1980, style: 'arcade', colors: { p: '#ffff00', b: '#000000' }, desc: 'Pac-Man gör färgstark pixelgrafik ikonisk. Neon arcade, starka färger och enkla animationer.' },
  { year: 1981, style: 'arcade', colors: { p: '#ff0000', b: '#000000' }, desc: 'Donkey Kong visar bättre karaktärsanimation. Plattformsgrafik och arkadkänsla.' },
  { year: 1982, style: 'cyber', colors: { p: '#00ffff', b: '#05051a' }, desc: 'Tron visar tidig CGI i film. Neon grids, wireframes och digital sci-fi.' },
  { year: 1983, style: 'arcade', colors: { p: '#ffffff', b: '#000000' }, desc: 'Nintendo/8-bit-eran växer. Pixelvärldar, begränsad färgpalett och ikoniska sprites.' },
  { year: 1984, style: 'tech', colors: { p: '#ffffff', b: '#cccccc' }, desc: 'Macintosh gör GUI populärt. Grå fönster, pixeltypsnitt och tidig desktopdesign.' },
  { year: 1985, style: 'arcade', colors: { p: '#00ffcc', b: '#0a0a1a' }, desc: 'Amiga ger bättre färggrafik. Demo scene, färgstarka pixeleffekter och retro cyberstil.' },
  { year: 1986, style: 'tech', colors: { p: '#ffffff', b: '#000000' }, desc: '3D-rendering och ray tracing-experiment växer. Primitiva 3D-objekt.' },
  { year: 1987, style: 'tech', colors: { p: '#00ff00', b: '#000000' }, desc: 'VGA förbättrar färger. DOS-estetik, fler färger och tydligare grafik.' },
  { year: 1988, style: 'cyber', colors: { p: '#ff00ff', b: '#05051a' }, desc: 'Digital animation blir bättre. Synthwave, pixeleffekter och mer rörelse.' },
  { year: 1989, style: 'arcade', colors: { p: '#00ff00', b: '#889977' }, desc: 'Game Boy släpps. Grön monokrom skärm och bärbar pixelgrafik.' },
  { year: 1990, style: 'arcade', colors: { p: '#ff3300', b: '#000000' }, desc: '16-bit-eran med SNES/Genesis. Mer detaljerad pixel art och parallax scrolling.' },
  { year: 1991, style: 'tech', colors: { p: '#ffffff', b: '#000000' }, desc: 'Texture mapping förbättras. Tidig 3D med texturer.' },
  { year: 1992, style: 'tech', colors: { p: '#ff0000', b: '#000000' }, desc: 'Wolfenstein 3D populariserar pseudo-3D. Pixelväggar och corridor shooter-känsla.' },
  { year: 1993, style: 'tech', colors: { p: '#ff3300', b: '#1a0500' }, desc: 'DOOM förändrar spelgrafik. Mörk sci-fi, snabba miljöer och dynamisk känsla.' },
  { year: 1994, style: 'tech', colors: { p: '#ffffff', b: '#000033' }, desc: 'PlayStation/Saturn gör 3D mainstream. Low-poly modeller och texture warping.' },
  { year: 1995, style: 'tech', colors: { p: '#00ccff', b: '#00051a' }, desc: 'Toy Story blir första hela CGI-filmen. Tidig Pixar, plastig men mjuk 3D-rendering.' },
  { year: 1996, style: 'tech', colors: { p: '#ffffff', b: '#0a0a0a' }, desc: 'Quake visar riktig 3D-rendering. Low-poly realism och gritty texturer.' },
  { year: 1997, style: 'tech', colors: { p: '#00ff00', b: '#000000' }, desc: '3D-grafikkort blir vanligare. Metalliska shaders och tydligare 3D.' },
  { year: 1998, style: 'tech', colors: { p: '#ffaa00', b: '#000000' }, desc: 'Half-Life och Unreal höjer ribban. Cinematic shooters, bättre texturer och ljus.' },
  { year: 1999, style: 'cyber', colors: { p: '#00ff00', b: '#050505' }, desc: 'Dreamcast/Y2K-design. Glossy futuristiska menyer och tidig online-estetik.' },
  { year: 2000, style: 'tech', colors: { p: '#ffffff', b: '#000033' }, desc: 'PlayStation 2 startar mer filmisk spelgrafik. Tidig cinematic 3D.' },
  { year: 2001, style: 'tech', colors: { p: '#00ff00', b: '#000000' }, desc: 'Xbox/GameCube förbättrar 3D. Skarpare texturer och starkare ljus.' },
  { year: 2002, style: 'tech', colors: { p: '#00ffff', b: '#000000' }, desc: 'Shader-teknik utvecklas. Reflektioner, vatteneffekter och material.' },
  { year: 2003, style: 'tech', colors: { p: '#ffaa00', b: '#1a1a1a' }, desc: 'Source Engine/Half-Life 2 visar fysik och rendering. Realistisk rörelse.' },
  { year: 2004, style: 'tech', colors: { p: '#ffffff', b: '#000000' }, desc: 'HDR och bloom blir vanligare. Glödande highlights och starkt ljus.' },
  { year: 2005, style: 'tech', colors: { p: '#00ff00', b: '#000000' }, desc: 'Xbox 360 startar HD-eran. HD-texturer och modernare UI.' },
  { year: 2006, style: 'tech', colors: { p: '#ffffff', b: '#000000' }, desc: 'PS3 och avancerade shaders. Mer cinematic realism.' },
  { year: 2007, style: 'tech', colors: { p: '#00ffcc', b: '#0a1a0a' }, desc: 'Crysis höjer PC-grafik. Jungle rendering, volumetric lighting och realism.' },
  { year: 2008, style: 'tech', colors: { p: '#ffffff', b: '#000000' }, desc: 'GPU-kraft ökar. Mer detaljerade miljöer och realistiska reflektioner.' },
  { year: 2009, style: 'tech', colors: { p: '#00ffff', b: '#000000' }, desc: 'Avatar revolutionerar CGI/VFX. Motion capture och filmisk photorealism.' },
  { year: 2010, style: 'cinematic', colors: { p: '#ffaa00', b: '#050505' }, desc: 'Post-processing blir standard. Lens flares, depth of field och filmisk färg.' },
  { year: 2011, style: 'cinematic', colors: { p: '#ffffff', b: '#000000' }, desc: 'Battlefield 3/Frostbite visar destruction och avancerad ljussättning.' },
  { year: 2012, style: 'cinematic', colors: { p: '#00ffcc', b: '#000000' }, desc: 'Real-time lighting förbättras. Tidig global illumination-känsla.' },
  { year: 2013, style: 'cinematic', colors: { p: '#ffffff', b: '#000000' }, desc: 'PS4/Xbox One höjer realism. Bättre karaktärer, material och miljöer.' },
  { year: 2014, style: 'cinematic', colors: { p: '#ffaa00', b: '#000000' }, desc: 'PBR blir standard. Realistiska metaller, plast, trä och ljus.' },
  { year: 2015, style: 'cinematic', colors: { p: '#ffffff', b: '#000000' }, desc: 'The Witcher 3 visar stora öppna världar. Cinematic fantasy realism.' },
  { year: 2016, style: 'cinematic', colors: { p: '#00ffff', b: '#000000' }, desc: 'VR växer. Immersiv rendering, 360-känsla och VR-interface.' },
  { year: 2017, style: 'cinematic', colors: { p: '#ffffff', b: '#000000' }, desc: 'Photogrammetry används mer. Skannade miljöer och ultradetalj.' },
  { year: 2018, style: 'cinematic', colors: { p: '#ffaa00', b: '#050505' }, desc: 'Ray tracing börjar introduceras. Realistiska reflektioner och globalt ljus.' },
  { year: 2019, style: 'cinematic', colors: { p: '#ffffff', b: '#000000' }, desc: 'RTX gör real-time ray tracing mer känt. Cinematic reflektioner och skuggor.' },
  { year: 2020, style: 'cinematic', colors: { p: '#22d3ee', b: '#020617' }, desc: 'PS5/Xbox Series X. Nära photorealism, snabb rendering och hög detalj.' },
  { year: 2021, style: 'cinematic', colors: { p: '#ffffff', b: '#000000' }, desc: 'Unreal Engine 5 visar Nanite och Lumen. Filmkvalitet i realtid.' },
  { year: 2022, style: 'cinematic', colors: { p: '#ff00ff', b: '#050505' }, desc: 'AI-genererad grafik exploderar. Generative art och neural rendering.' },
  { year: 2023, style: 'cinematic', colors: { p: '#00ffcc', b: '#000000' }, desc: 'AI integreras i spel/filmproduktion. AI-assisterade visuals och automatiserad design.' },
  { year: 2024, style: 'cinematic', colors: { p: '#ffffff', b: '#000000' }, desc: 'Real-time cinematic rendering blir vanligare. Hyperreal lighting och UE5-känsla.' },
  { year: 2025, style: 'cinematic', colors: { p: '#ffaa00', b: '#000000' }, desc: 'AI-drivna shaders och procedural worlds växer. Dynamiska AI-världar.' },
  { year: 2026, style: 'cinematic', colors: { p: '#ffffff', b: '#000000' }, desc: 'Grafik suddar ut gränsen mellan verklighet och rendering. AI, ray tracing, real-time VFX, holographic UI, volumetric lighting och hyperrealistiska världar.' }
];

function generate(y) {
  return {
    year: y.year,
    theme: {
      uiStyle: y.style,
      colors: {
        primary: y.colors.p,
        secondary: '#ffffff',
        background: y.colors.b,
        text: '#ffffff'
      }
    },
    intro: {
      title: { en: `${y.year}`, sv: `${y.year}`, ja: `${y.year}年` },
      description: {
        en: `The visual evolution of ${y.year}.`,
        sv: y.desc,
        ja: `${y.year}年の視覚的進化。`
      }
    },
    games: {
      title: { en: 'Games & Interactivity', sv: 'Spel & Interaktivitet', ja: 'ゲームとインタラクティブ性' },
      images: []
    },
    pixelArt: {
      title: { en: 'Visual Style', sv: 'Visuell Stil', ja: 'ビジュアルスタイル' },
      description: { en: '', sv: y.desc, ja: '' },
      images: []
    },
    arcade: {
      title: { en: 'Systems & Hardware', sv: 'System & Hårdvara', ja: 'システムとハードウェア' },
      description: { en: '', sv: '', ja: '' },
      images: []
    },
    tech: {
      title: { en: 'Technological Leaps', sv: 'Tekniska Språng', ja: '技術的飛躍' },
      hardware: [],
      image: ''
    },
    audio: {
      title: { en: 'Soundscapes', sv: 'Ljudlandskap', ja: 'サウンドスケープ' },
      description: { en: '', sv: '', ja: '' }
    },
    filmVfx: {
      title: { en: 'Film & VFX', sv: 'Film & VFX', ja: '映画とVFX' },
      description: { en: '', sv: '', ja: '' },
      images: []
    },
    uiDesign: {
      title: { en: 'User Interface', sv: 'Användargränssnitt', ja: 'ユーザーインターフェース' },
      description: { en: '', sv: '', ja: '' },
      image: ''
    },
    summary: {
      title: { en: `${y.year} – The Milestone`, sv: `${y.year} – Milstolpen`, ja: `${y.year} – マイルストーン` },
      description: { en: '', sv: y.desc, ja: '' },
      icons: ['monitor']
    }
  };
}

console.log(JSON.stringify(data.map(generate), null, 2));
