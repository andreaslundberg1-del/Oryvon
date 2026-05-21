const years = [
  {
    year: 1950,
    style: 'terminal',
    desc: 'Tidiga datorer visar mest text och enkla signaler. Svart bakgrund, grön/vit terminaltext, inga riktiga animationer.',
    colors: { primary: '#00ff00', background: '#000000' }
  },
  {
    year: 1951,
    style: 'terminal',
    desc: 'CRT-skärmar används mer för forskning. Visa oscilloskop-linjer, radar-känsla och elektriska signaler.',
    colors: { primary: '#00ff00', background: '#000500' }
  },
  {
    year: 1952,
    style: 'terminal',
    desc: 'Tidiga experiment med interaktiva skärmar. Enkla former, punkter och tekniska ritningar.',
    colors: { primary: '#ffffff', background: '#000000' }
  },
  {
    year: 1953,
    style: 'terminal',
    desc: 'Militär och vetenskaplig grafik utvecklas. Låg upplösning, scanlines och grön monitorstil.',
    colors: { primary: '#33ff33', background: '#050505' }
  },
  {
    year: 1954,
    style: 'terminal',
    desc: 'Primitiva datoranimationer testas. Blinkande former och enkel rörelse.',
    colors: { primary: '#00ff00', background: '#000000' }
  },
  {
    year: 1955,
    style: 'terminal',
    desc: 'Universiteten börjar använda datorvisualisering. Visa grids, matematiska former och teknisk labbkänsla.',
    colors: { primary: '#00ffff', background: '#000a0a' }
  },
  {
    year: 1956,
    style: 'terminal',
    desc: 'Mer forskning kring datorgrafik. Radar, vektorer och neonliknande linjer.',
    colors: { primary: '#00ffcc', background: '#000000' }
  },
  {
    year: 1957,
    style: 'terminal',
    desc: 'Grafik används i flygsimulering. Visa cockpit-HUD, gröna linjer och teknisk instrumentkänsla.',
    colors: { primary: '#00ff00', background: '#051a05' }
  },
  {
    year: 1958,
    style: 'terminal',
    desc: 'Tennis for Two visar tidig spelgrafik. Enkel svart bakgrund, vita linjer och oscilloskop-look.',
    colors: { primary: '#ffffff', background: '#000000' }
  },
  {
    year: 1959,
    style: 'terminal',
    desc: 'Datorgrafik får mer forskningsintresse. Minimalistisk CRT-grafik och elektriska linjer.',
    colors: { primary: '#00ff00', background: '#000000' }
  }
];

function generate(y) {
  return {
    year: y.year,
    theme: {
      uiStyle: y.style,
      colors: {
        primary: y.colors.primary,
        secondary: '#ffffff',
        background: y.colors.background,
        text: '#ffffff'
      }
    },
    intro: {
      title: { en: `${y.year}`, sv: `${y.year}`, ja: `${y.year}年` },
      description: {
        en: `Description for ${y.year}`,
        sv: y.desc,
        ja: `Description for ${y.year}`
      }
    },
    games: {
        title: { en: 'Early Graphics', sv: 'Tidig Grafik', ja: '初期のグラフィックス' },
        images: []
    },
    pixelArt: {
        title: { en: 'Visual Style', sv: 'Visuell Stil', ja: 'ビジュアルスタイル' },
        description: { en: '', sv: '', ja: '' },
        images: []
    },
    arcade: {
        title: { en: 'Systems', sv: 'System', ja: 'システム' },
        description: { en: '', sv: '', ja: '' },
        images: []
    },
    tech: {
        title: { en: 'Tech', sv: 'Teknik', ja: '技術' },
        hardware: [],
        image: ''
    },
    audio: {
        title: { en: 'Audio', sv: 'Ljud', ja: 'オーディオ' },
        description: { en: '', sv: '', ja: '' }
    },
    filmVfx: {
        title: { en: 'Visuals', sv: 'Visuellt', ja: 'ビジュアル' },
        description: { en: '', sv: '', ja: '' },
        images: []
    },
    uiDesign: {
        title: { en: 'Interface', sv: 'Gränssnitt', ja: 'インターフェース' },
        description: { en: '', sv: '', ja: '' },
        image: ''
    },
    summary: {
      title: { en: `${y.year} Era`, sv: `${y.year}-eran`, ja: `${y.year}年時代` },
      description: { en: '', sv: y.desc, ja: '' },
      icons: ['monitor']
    }
  };
}

console.log(JSON.stringify(years.map(generate), null, 2));
