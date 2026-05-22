# Heraldry OG Image Worker

Cloudflare Worker that generates social preview images (og:image) for shared heraldry links.

## Routes handled

| Path | Purpose |
|------|---------|
| `wilkopaints.art/heraldry/?state=HASH` | Main app page — worker injects per-shield og: meta tags via HTMLRewriter; passes straight through to origin when no `?state=` is present |
| `wilkopaints.art/heraldry/og-image?state=HASH` | Returns a 1200×630 PNG of the shield |

## Deploy

1. Log in to Cloudflare:
   ```
   npx wrangler login
   ```

2. Deploy from this directory:
   ```
   npm run deploy
   ```

Wrangler will create the worker and wire up the routes automatically

## How sharing works

The URL itself is now the share URL. The state is stored as a query param instead of a hash fragment:

```
https://wilkopaints.art/heraldry/?state=chief-d4af34-790000-12-3-d-d4af34
```

The **Share** button (or just copying the browser URL bar) generates the URL

When pasted into Discord, Bluesky, etc:
- Their bots fetch the state
- The Worker intercepts, fetches origin `index.html`, rewrites `og:image` to point at the correct shield PNG via HTMLRewriter
- Bots see the shield-specific preview; real users get the same page and the page renders normally

Old hash-based URLs (`#...`) are still decoded gracefully and normalised to `?state=` format.

## Notes

- The `@resvg/resvg-wasm` WASM binary (~2.4 MB) is fetched from jsDelivr CDN on the first
  request per Cloudflare edge datacenter, then cached
- Week long cache
- Free tier: 100k requests/day, should be enough 🤞
