// Render share images: from repo root, `python3 -m http.server 8766 &` then `node tools/og/render.js`
// Needs playwright-core and a Chrome at $CHROME (default /usr/bin/google-chrome).
const { chromium } = require('playwright-core');
(async () => { const b = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' });
 const p = await b.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
 for (const [v, out] of [['site', 'public/og-image.png'], ['fm', 'public/fm/og-image.png']]) {
  await p.goto(`http://localhost:${process.env.PORT || 8766}/tools/og/og.html?v=${v}`); await p.waitForSelector('body[data-ready]'); await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: out }); console.log('wrote', out); }
 await b.close(); })();
