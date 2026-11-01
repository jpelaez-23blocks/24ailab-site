# Share images (og:image)
`og.html` draws both 1200×630 share images (site and /fm/) with the brand tokens: serif display (New York → Iowan → Newsreader → Georgia), system sans, accent #1a6fd6, globe #e8f2fc / #a9bdd3 / #9cc9ff, real country outlines and FM station data.
```
cd 24ailab-site && python3 -m http.server 8766 &
NODE_PATH=$(npm root -g) node tools/og/render.js
```
After changing an image, bump `?v=N` on every `og:image`/`twitter:image` URL so X, LinkedIn, WhatsApp and Slack re-fetch.
