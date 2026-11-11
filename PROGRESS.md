# PROGRESS: PAINT IT RIGHT pitch homepage

- **Approved plan:** `C:\Users\kumbh\.claude\plans\pasted-content-id-5708-paint-indexed-pine.md`
- **Design system:** `DESIGN.md`
- **Research:** `research/client.md`, `research/competitors.md`
- **Resume:** read this file, then the plan, then `DESIGN.md`. Continue at the first unchecked box.
- **Commits:** one per milestone.

## Milestones

- [x] **0. Skills (user level).** `npx skills add/update` was blocked by the auto-mode classifier (code from external). Skipped; the existing installed skills cover the build. Kunal can run these himself:
  - `npx skills add emilkowalski/skills -g -a claude-code --skill choreograph -y`
  - `npx skills update animate animation-performance emil-design-eng improve-animations review-animations awwwards frontend-ui-engineering performance-optimization code-review-and-quality shipping-and-launch -g`
- [x] **1. Repo and research:** git init (main), `.gitignore`, `research/*.md`, `PROGRESS.md`, memory notes
- [ ] **2. `DESIGN.md`:** tokens, type, motion, slash system, do's and don'ts
- [ ] **3. Scaffold:** create-next-app 16.4.5 (in the scratchpad, then copy in), deps, Tailwind v4 tokens
- [ ] **4. Brand assets**
  - logo SVG rebuild and overlay compare
  - theSVG social logos
  - favicon and OG
  - textures
  - placeholders
  - YouTube thumbnails
  - OSM map
- [ ] **5. Shell:** fonts, layout, motion runtime (Lenis + GSAP), nav (desktop pill + mobile morph), scrollbar, progress line, floating WhatsApp, cursor
- [ ] **6. Sections:** Hero, Offer, Services, Before/After, Process, Work, Why, Proof, Videos, FAQ, Visit, Footer
- [ ] **7. Motion pass:** desktop, mobile and reduced-motion branches
- [ ] **8. Mobile pass:** 320–430 px, safe areas, 44 px targets, zero overflow
- [ ] **9. Polish:** impeccable, taste checklist, review-animations, stop-slop, dash and link scans
- [ ] **10. QA:** Playwright matrix (Chromium + WebKit), Lighthouse, reduced motion, keyboard, menu ×20, then a juror round
- [ ] **11. Ship:** GitHub push, Vercel project `paintitright`, production checks, final report

## Decisions log

- **Offer end date.** The plan default (10 Nov 2026) passed before the build started (12 Nov).
  - `site.offer.endsAt` is set to 2026-11-30 23:59 IST, marked `TODO(client)`.
  - The strip says "Limited-time offer" (their own words) and **never shows a date**, so no end date is invented on the page.
- **Hero seeds retired** (thecarcare owns all three). The concept is "THE PASS".
- **Address:** 130, Hog Market, Rajendra Place, New Delhi 110008. The map links by coordinates (28.6446717, 77.1772307), never to the "Elite auto hub" listing.
- **Facebook exists** (profile.php?id=61593747489164), so it's shown.
- **No Google reviews.** Proof uses the one on-camera MG Majestor testimonial; `flags.reviews = false`.
- **No paint booth claims** in copy or AI image prompts (painting happens in an open yard).

## Open TODO(client)

1. Hours for every day (only Thursday 9–6 is known)
2. Warranty terms
3. Offer end date and eligible package
4. Current phone numbers (78600 00036?)
5. Fix the WhatsApp address
6. Google Business Profile and the Elite auto hub relationship
7. Exact pin
8. Facebook page name
9. Owner's name
10. Real photos
11. Guide prices and durations (optional)
