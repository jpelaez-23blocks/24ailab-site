/* 2xAI Lab project registry. One entry per project; order = order on the page.
   See /DESIGN.md → "Project cards" for every field. */
window.LAB_PROJECTS = [
  {
    id: 'fm',
    name: 'FM',
    pitch: 'World radio, from 1998 to 2026.',
    era: '1979 → 2026',
    tags: ['Radio', 'Web Audio', '3D globe'],
    accent: '#1a6fd6',
    hint: 'fm',                       // key in LAB_HINTS (project-cards/cards.js); 'default' if none
    url: 'https://fm.24ailab.com',
    cta: 'Open FM',
    story: '/fm/',                    // story page; omit until it exists
    why: 'One place to tune in to radio from any country: to practice a language by listening to real people talk and sing, and to feel a little closer to home.',
    how: 'A free, Winamp-style web player with 60,000+ live stations from the Radio Browser directory, a 10-band equalizer, a live visualizer and a 3D station globe, built together with an AI agent.',
    gallery: [
      { src: '/assets/projects/fm/player-mobile', w: 780, h: 1696, kind: 'mobile', alt: 'FM screenshot: the player on a phone', cap: 'The player on a phone' },
      { src: '/assets/projects/fm/globe-mobile', w: 780, h: 1696, kind: 'mobile', alt: 'FM screenshot: the globe on a phone', cap: 'The globe on a phone' },
      { src: '/assets/projects/fm/mini-mobile', w: 780, h: 1696, kind: 'mobile', alt: 'FM screenshot: FM mini on a phone', cap: 'FM mini on a phone' }
    ]
  }
];
