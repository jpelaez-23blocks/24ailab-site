# 24ailab-site

Website for 2xAI Lab at https://24ailab.com. Static files, no build step.

## Cloudflare Pages setup
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick `jpelaez-23blocks/24ailab-site`.
2. Production branch: `main`. Framework preset: None. Build command: (empty). Build output directory: `public`.
3. Save and Deploy.
4. Project → Custom domains → add `24ailab.com`, then add `www.24ailab.com`. Cloudflare creates the DNS records since the zone is on Cloudflare.
5. Optional: redirect `www` to the apex with a Redirect Rule (www.24ailab.com/* → https://24ailab.com/${1}, 301).

Note: `fm.24ailab.com` is a separate Pages project (wavamp); don't touch its DNS record.

## Local preview
`npx serve public` or `python3 -m http.server -d public`.
