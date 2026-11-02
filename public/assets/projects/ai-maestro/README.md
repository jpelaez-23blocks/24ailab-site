# AI Maestro assets (for /ai-maestro/)

- `3metas-logo.png`: the 3Metas logo (110×110 PNG from https://3metas.com/brand/logo.png; the site has no SVG). It's used in beat 7.

## Waiting for Juan's assets
Drop files here with these exact names. The page picks them up with no code change, and a missing file falls back to the placeholder.

| File | Where | Notes |
|---|---|---|
| `lola.webp` | Beats 5–7, Lola's portrait in her card | Square, ≥ 400×400 |
| `stills/beat-1.webp` … `stills/beat-9.webp`, plus `beat-5a/5b/5c.webp` | Stacked fallback: mobile < 720px, reduced motion, no JS | 16:10, about 1600×1000 |

Placeholders inside the animated stage are drawn in HTML, in `public/ai-maestro/index.html`, and marked with a "Placeholder · …" pill:
- `dashboard.webp`: beats 3–4, the AI Maestro dashboard. Swap the `.main` mock for an `<img>`.
- `team.webp`: beat 8, the team meeting with Kanban. Swap the `.team` mock.
- The agent names in the mock (Lola, Brutus, Cesar, Julia, Marcus, Iris, Theo) are placeholders.
- Lola's hires ("Research", "Operations", "Writing") are placeholders.
- The beat-8 people tiles ("J", "You") are placeholders.
