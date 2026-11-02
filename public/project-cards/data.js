/* 2xAI Lab project registry. One entry per project; order = order on the page.
   See /DESIGN.md → "Project cards" for every field. */
window.LAB_PROJECTS = [
  {
    id: 'fm',
    name: 'FM',
    pitch: 'World radio, from 1979 to 2026.',
    era: '1979 → 2026',
    tags: ['Radio', 'Web Audio', '3D globe'],
    accent: '#1a6fd6',
    hint: 'fm',                       // key in LAB_HINTS (project-cards/cards.js); 'default' if none
    url: 'https://fm.24ailab.com',
    cta: 'Open FM',
    story: '/fm/',                    // story page; omit until it exists
    why: 'One place to tune in to radio from any country: to practice a language by listening to real people talk and sing, and to feel a little closer to home.',
    how: 'A free, Winamp-style web player with 60,000+ live stations from the Radio Browser directory, a 10-band equalizer, a live visualizer and a 3D station globe, built together with an AI agent.'
    },
  {
    id: 'ai-maestro',
    name: 'AI Maestro',
    pitch: 'From a desk of terminals to a team of agents.',
    era: '2025 → 2026',
    tags: ['Agents', 'Orchestration', 'Open source'],
    accent: '#1a6fd6',
    hint: 'default',
    url: '/ai-maestro/',
    cta: 'See the story',
    ext: 'https://getaimaestro.com',   // optional secondary external link
    extLabel: 'Open AI Maestro',
    why: 'We were juggling terminal after terminal of Claude Code, Codex and other AI tools, and none of them remembered or spoke to each other. We wanted one place where agents become teammates.',
    how: 'An open-source web app from 2xAI Lab and 23blocks that turns terminals into agents with skills, memory and messaging. The Lab runs on it every day.'
  }
];
