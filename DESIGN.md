# 2xAI Lab — DESIGN.md

The design system for 24ailab.com: every project gets **one card** on `/projects` and **one story page** at `/<id>/`. The FM story page (`public/fm/`) is the reference template.

## 1. Tokens (from `public/styles.css`)
| Token | Value | Use |
|---|---|---|
| `--text` | `#1d2a3a` | body text |
| `--muted` / `--muted2` | `#64748b` / `#8a97a8` | secondary text, captions |
| `--accent` | `#1a6fd6` | site links, primary buttons |
| `--pc` | per project (card `accent`) | card primary button, focus ring, hint highlights |
| `--border` / `--chip` / `--hl` | `#e3e9f0` / `#eef2f6` / `#eaf3ff` | lines, tags, highlights |
| `--radius` | `24px` | cards, islands |
| Globe | sphere `#e8f2fc`, countries `#a9bdd3`, atmosphere `#9cc9ff` | every globe, 2D or 3D |
| Type | system UI stack (`--font`); story-page display: New York / Iowan / Georgia serif | **no web fonts** |

Rules: light mode only, no purple gradients, no surprise background/palette changes, no third-party logos or skin assets (draw an homage instead). Name is always "2xAI Lab".

## 2. Project card
**Anatomy** (top → bottom): hint panel (320:140, inline SVG) · meta chips (era first, in accent, then tags) · name (h2) · one-line pitch · Why · How · CTAs · optional `Screenshots` disclosure (gallery + lightbox).

**CTAs.** Exactly two, both real `<a>` links:
1. Primary `btn pri` → the project itself (`url`, label `cta`, e.g. "Open FM ↗").
2. Secondary `btn` → story page (`story`), label "Project story" (+ hidden "of {name}" for screen readers).
The card itself is **not** a link, so it never swallows the two CTAs. Focus: 2px `--pc` outline, 3px offset.

**Data** lives in `public/project-cards/data.js` (`window.LAB_PROJECTS`), rendered by `public/project-cards/cards.js` into `<div class="pcards" data-pcards>`. Styles: `public/project-cards/cards.css`. Fields: `id, name, pitch, era, tags[], accent, hint, url, cta, story, why, how, gallery[]{src (no extension; .webp + .png), w, h, kind: mobile|desktop, alt, cap}`. Keep the `<noscript>` fallback in `projects.html` in sync (one line per project).

## 3. Hint animation rules
- **What:** a 3-act miniature of the story page (FM: dial in static → visualizer → globe + pins). One idea per act, no text.
- **Cost:** inline SVG + CSS keyframes, `transform`/`opacity` only. No Three.js, video, canvas loops or JS timers on cards.
- **Timing:** one loop `--loop: 3.6s` (3–4s allowed), acts split ≈ 0–33 / 33–66 / 66–100%, ~8% crossfades. Easing `--ease: cubic-bezier(.65,0,.35,1)`; pops/pins use overshoot `cubic-bezier(.34,1.56,.64,1)`; staggers 0.12s.
- **When:** paused by default; runs only while the card is ≥35% in view (`.live` via IntersectionObserver) or hovered/focused.
- **Reduced motion:** `prefers-reduced-motion: reduce` → no animation; show the most meaningful still frame (FM: globe + pins).
- **Registry:** `window.LAB_HINTS[key] = p => '<svg viewBox="0 0 320 140">…</svg>'`, CSS scoped under `.hint-<key>`. Projects without one use `default` (accent sonar pulse).
- SVGs are `aria-hidden`; the pitch carries meaning.

## 4. Story page skeleton (reference: `public/fm/`)
- **Files:** `public/<id>/index.html`, `story.css`, `story.js`, optional lazy module (e.g. `globe-story.js`) and data (`stations.json`). Standalone: the site mark links to `/`; no nav changes.
- **Structure:** fixed `#stage` (objects in a 640×640 design box scaled by `--s`) + captions `.caps[data-a][data-b]` + `#fin` + a tall `#track` (≈1000vh) that drives scroll progress `p ∈ [0,1]`.
- **Scenes:** 5–6, one era/idea each; each object *becomes* the next (morph, not cut). FM: radio → desktop visualizer → pocket player → wheel → globe with real data pins → final line.
- **Timeline:** custom rAF + lerp smoothing on `p` (no GSAP/Lenis). Each scene owns a `[a,b]` range; neighbors overlap 0.03–0.07 for morphs. Heavy pieces (3D) lazy-import past p≈0.4 or on idle, with a non-WebGL fallback.
- **Final:** one honest sentence (serif display) + one primary CTA to the project; secondary link back to `/`.
- **Sound:** opt-in only, synthesized/licensed-clean.
- **Reduced motion:** snap between key frames (FM `KEYS`) instead of scrubbing.
- **Ship check (from the landing-page checklist):** one action, CTA visible at the end, real numbers from real data, ≤ 1 heavy asset, no console errors, test 1440×900 and 390×844.

## 5. Add a new project
1. Append an entry to `public/project-cards/data.js` (copy FM's; set `id`, `accent`, `url`, `cta`; leave `story` out until the page exists; `hint: 'default'` is fine to start).
2. Optional bespoke hint: add `LAB_HINTS.<id>` in `cards.js` (or a new script loaded after `data.js`) and `.hint-<id>` keyframes in `cards.css` following §3.
3. Screenshots → `public/assets/projects/<id>/` (`.webp` + `.png`), list them in `gallery`.
4. Add a one-line `<noscript>` card in `projects.html` and the homepage line in `index.html` `#projects`.
5. Story page: copy `public/fm/` to `public/<id>/`, replace scenes/captions/final line, set `story: '/<id>/'`.
6. Test at 1440×900 and 390×844 (hover, keyboard focus, reduced motion), branch + PR; Juan approves merges.
