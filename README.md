# Paint It Right: homepage

A one-page site for Paint It Right, a car painting, PPF and detailing studio at 130, Hog Market, Rajendra Place, New Delhi.

The concept is "The Pass": surfaces start in primer grey, and a diagonal pass at the logo's slash angle lays down wet gloss. See `DESIGN.md` for the system and `PROGRESS.md` for the build log.

## Stack

- **Framework:** Next.js 16 (App Router, Cache Components, Turbopack), React 19, TypeScript (strict), Tailwind CSS 4.
- **Motion:** GSAP + ScrollTrigger + SplitText and Lenis for scroll, loaded on the first interaction. Motion handles UI state (nav, menu, accordions).
- **Fonts:** Hubot Sans + Mona Sans (OFL), self-hosted through `next/font`.
- **Icons:** Hugeicons (free set).
- **Social marks:** original brand marks from theSVG.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Where things live

| What | Where |
|---|---|
| Every business fact and line of copy | `src/content/site.ts` (unverified items are marked `TODO(client)`) |
| Image slots and their files | `src/content/images.ts`, `public/images/**` |
| Prompts for the AI images | `IMAGE_PROMPTS.md` |
| Design tokens | `src/app/globals.css` (`@theme`), `src/lib/motion.ts`, `DESIGN.md` |
| Scroll scenes (GSAP) | `src/lib/runtime.ts` |
| Logo rebuild (vector, traced from `references/logo.jpg`) | `scripts/logo/*`, `src/components/brand/logo-data.ts` |

## Common changes

- **Offer strip:** edit `site.offer` (`enabled`, `endsAt`). It hides itself after `endsAt`.
- **Search indexing:** set `site.flags.noindex` to `false` once the client approves.
- **Reviews:** set `site.flags.reviews` to `true` once real Google reviews exist.
- **Hours:** fill `site.hours` (days without a time show "Call to confirm").
- **Replacing an image:** drop the file at its path, run `npm run images:fit` if its size differs, then rebuild.
- **Hiding Facebook:** empty `site.socials.facebook.url`.

## Scripts

| Command | Does |
|---|---|
| `npm run test:e2e` | Playwright suite in Chromium + WebKit: screenshots at 7 sizes, menu ×20, keyboard, reduced motion, tap targets, axe |
| `node scripts/perf.mjs [url]` | Lighthouse mobile + desktop |
| `npm run qa:review` | Section-by-section screenshots for a visual review |
| `npm run placeholders` | Writes a placeholder for any image slot without a file |
| `npm run images:fit` | Crops/resizes dropped-in images to their slot size |
| `npm run thumbs` | Fetches the YouTube Shorts thumbnails |
| `node scripts/build-map.mjs` | Rebuilds the OpenStreetMap street map for the Visit section |

## Credits

- Map data © OpenStreetMap contributors (ODbL).
- Hubot Sans, Mona Sans and Poppins (used for the traced wordmark): SIL Open Font License.
