# HANDOFF: 24ailab.com (for Cesar)

## Purpose
The public home page of **2xAI Lab**: a short landing page that says who we are, links to our projects (FM so far), shows a small 3D globe with where the team is, and gives a contact email. The site is static and deliberately small. You own this site now. The FM project (fm.24ailab.com) stays with Juan.

## Brand facts (follow exactly)
- Write the name as **2xAI Lab**. "24AI Lab" appears only as the secondary/pronunciation line.
- Tagline (hero h1 + footer): **Where AI meets craft.**
- Hero supporting line: "We treat intelligence as a material to be shaped with care: experiences built like objects, agents trained like apprentices." Buttons: "See the projects" (#projects, primary) and "Contact" (/contact).
- Description (meta, og, twitter, JSON-LD): "2xAI Lab is where AI meets craft. We treat intelligence as a material to be shaped with care: experiences built like objects, agents trained like apprentices. The result is technology with taste."
- Primary domain: **24ailab.com**. `www.24ailab.com` redirects to it.
- **2xailab.com** should 301-redirect to 24ailab.com. This is NOT configured yet. It needs proxied (orange-cloud) DNS records on the 2xailab.com zone, e.g. `A @ 192.0.2.1` and `A www 192.0.2.1` (dummy IP, proxied), plus a Redirect Rule: `*2xailab.com/*` → `https://24ailab.com/${2}`, 301, preserve query string.
- **Never mention 23blocks** anywhere: no copy, metadata or links.
- No "Our story" / about section yet. Don't add one unless asked.
- Contact: **hello@24ailab.com**
- Footer: `© 2026 2xAI Lab · hello@24ailab.com`
- Globe pins show place names only, never personal names: **Colorado**, **Colombia** (center of the country, not a city), **Singapore**.

## Design system (copied from FM's globe page, fm.24ailab.com/globe.html → globe.css)
Bright light mode. The tokens are in `public/styles.css` `:root`:
| Token | Value | Use |
|---|---|---|
| --bg | #fff | page |
| --text | #1d2a3a | body text |
| --muted | #64748b | secondary text |
| --muted2 | #8a97a8 | footer text |
| --accent | #1a6fd6 | links, pins |
| --border | #e3e9f0 | header border, cards |
| --border2 | #dfe6ee | footer border |
| --soft | #f4f7fa | footer bg |
| --chip | #eef2f6 | chip bg |
| --hl | #eaf3ff | highlight/project card |
| --font | -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif | everything, 14px base (no web fonts) |
| --radius | 24px | island |
| --shadow | 0 10px 34px rgba(20,50,100,.18), inset 0 1px 0 rgba(255,255,255,.9) | island |

- Header: a frosted bar, `rgba(255,255,255,.88)` with blur(8px) and a 1px #e3e9f0 bottom border. It's a 3-column grid with the title centered and bold. This matches FM.
- Liquid-glass island: `rgba(255,255,255,.55)`, `blur(18px) saturate(180%)`, `1px solid rgba(255,255,255,.8)` border, the shadow above, radius 24px.
- Footer (`#legal`): 10.5px/15px, color #8a97a8, bg #f4f7fa, top border #dfe6ee, centered.
- Pins (`.tpin`): #1a6fd6 pill, white 2px border, 11px bold white text. Same as FM pins.
- Globe: globe.gl@2 from jsDelivr. Globe material #e8f2fc with shininess 4, hex-polygon countries #a9bdd3 (resolution 3, margin .25), atmosphere #9cc9ff at altitude .18, transparent background. These values are the same as FM.
- Juan dislikes surprise design changes, especially to backgrounds. Don't change palette or background unless asked.

## Files
```
public/
  index.html        landing page (content, SEO meta, JSON-LD Organization)
  styles.css        all styles + design tokens
  globe.js          team globe (lazy-loads globe.gl, WebGL check, reduced-motion, fallback)
  countries.geojson Natural Earth country shapes for the hex globe (~480 KB, copied from FM)
  favicon.svg       "2x" icon
  og-image.png      1200x630 share image
  robots.txt, sitemap.xml
README.md           Cloudflare Pages setup
HANDOFF.md          this file
```

## Globe behavior
- Drag to rotate and scroll or pinch to zoom, within distance limits of 160 to 600. It auto-rotates slowly at speed 0.5.
- `prefers-reduced-motion: reduce` disables auto-rotate.
- If there's no WebGL, or the CDN or script fails, `#globe` gets the `.noglobe` class and shows the text "Colorado · Colombia · Singapore".
- The countries GeoJSON loads after the globe, so the globe works without it.
- To add or move pins, edit `PINS` in `globe.js` and the caption and aria-label in `index.html`.

## Deploy
- Cloudflare Pages project connected to GitHub `jpelaez-23blocks/24ailab-site`, branch `main`.
  - Build command: none. Output directory: `public`.
  - **Every push to main auto-deploys** in about 30 to 60 seconds. Other branches get preview URLs.
- Custom domains: `24ailab.com` (primary) and `www.24ailab.com` (redirects to the apex).
- **Don't touch `fm.24ailab.com`.** It's a separate Pages project (repo `jpelaez-23blocks/wavamp`) plus a Worker `wavamp-proxy` with routes `/proxy*`, `/meta*` and `/api/*`, KV and a cron. Leave its DNS record alone too.
- Verify: `curl -s https://24ailab.com/ | grep "Where AI meets craft"`.

## Git / GitHub auth (shared box)
- Local clone: `/workspace/24ailab-site`.
- `gh` is logged in as `jpelaez-23blocks` (HTTPS, token in `~/.config/gh/hosts.yml`, scopes repo/gist/read:org). Git pushes over HTTPS through gh. Don't print or copy the token.
- The commit identity is set per repo (`git config user.name/email`, same as the wavamp repo).
- Other agents push to wavamp from this box, so always `git pull --rebase` before pushing.

## SEO
- `index.html` has the title, description and canonical (https://24ailab.com/).
- Open Graph and Twitter tags use `summary_large_image` with `/og-image.png`.
- There's `theme-color`, plus JSON-LD Organization data (name 2xAI Lab, alternateName 24AI Lab, email).
- `robots.txt` allows everything and points to `sitemap.xml`, which has one URL. Update `lastmod` when content changes.

## Local preview
`python3 -m http.server -d public 8080` → http://localhost:8080. Or use `npx serve public`.

## Open TODOs
- [ ] Configure the 2xailab.com → 24ailab.com 301 (DNS + Redirect Rule, see above).
- [ ] Confirm `www` → apex redirect is active (Bulk/Redirect Rule if Pages doesn't do it).
- [ ] Verify the domain in Google Search Console and submit https://24ailab.com/sitemap.xml.
- [ ] Add `sameAs` to the JSON-LD once 2xAI Lab social or company links exist.
- [x] Add apple-touch-icon / PNG favicons (done: PNG 16/32, apple-touch-icon 180, icon-192/512, site.webmanifest).
- [ ] Consider self-hosting globe.gl or a smaller countries file if performance matters.
- [ ] Projects section: add new projects as they launch (FM is the only one).
- [ ] Optional: privacy/terms pages if analytics or forms are added (FM has examples).
