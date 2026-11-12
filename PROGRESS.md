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
- [x] **2. `DESIGN.md`:** tokens, type, motion, slash system, do's and don'ts
- [x] **3. Scaffold:** create-next-app 16.4.5 (in the scratchpad, then copy in), deps, Tailwind v4 tokens
- [x] **4. Brand assets**
  - logo SVG rebuild and overlay compare
  - theSVG social logos
  - favicon and OG
  - textures
  - placeholders
  - YouTube thumbnails
  - OSM map
- [x] **5. Shell:** fonts, layout, motion runtime (Lenis + GSAP), nav (desktop pill + mobile morph), scrollbar, progress line, floating WhatsApp, cursor
- [x] **6. Sections:** Hero, Offer, Services, Before/After, Process, Work, Why, Proof, Videos, FAQ, Visit, Footer
- [x] **7. Motion pass:** desktop, mobile and reduced-motion branches
- [x] **8. Mobile pass:** 320–430 px, safe areas, 44 px targets, zero overflow
- [x] **9. Polish:** impeccable, taste checklist, review-animations, stop-slop, dash and link scans
- [x] **10. QA:** Playwright matrix (Chromium + WebKit), Lighthouse, reduced motion, keyboard, menu ×20, then a juror round
- [x] **11. Ship:** live at https://paintitright.vercel.app (Vercel project `paintitright`, team kunals-projects-a6e41378, CLI deploys). Repo pushed to github.com/kumbharkunal/PAINTITRIGHT.
  - **Still open:** grant the Vercel GitHub app access to the repo, then run `vercel git connect https://github.com/kumbharkunal/PAINTITRIGHT.git` for auto-deploys.

## Results (production, 12 Nov 2026)

- **Lighthouse mobile** (median of 3): Performance 98, Accessibility 100, Best Practices 100, SEO 66 (blocked only by the intended noindex). LCP 1.3 s, TBT 40 ms, CLS 0.
- **Lighthouse desktop:** 100 / 100 / 100 / 66. LCP 0.5 s, TBT 0 ms, CLS 0.
- **Initial JS:** 209 KB compressed (9 files). GSAP + Lenis (~55 KB) and Motion layout features load on first interaction.
- **Playwright:** 39 pass, 3 skipped (WebKit Tab-to-link x2 is Safari default; axe runs once in Chromium). Covers 7 sizes x 2 engines, menu x20, keyboard, reduced motion, 320 px, tap targets, offer expiry, link checks.
- **WebKit caveat:** Playwright's Windows WebKit draws variable fonts at their default master, so typography in WebKit shots is not representative. Real Safari renders correctly.

## Decisions log

- **Offer end date.** The plan default (10 Nov 2026) passed before the build started (12 Nov).
  - `site.offer.endsAt` is set to 2026-11-30 23:59 IST, marked `TODO(client)`.
  - The strip says "Limited-time offer" (their own words) and **never shows a date**, so no end date is invented on the page.
- **Hero seeds retired** (thecarcare owns all three). The concept is "THE PASS".
- **Address:** 130, Hog Market, Rajendra Place, New Delhi 110008. The map links by coordinates (28.6446717, 77.1772307), never to the "Elite auto hub" listing.
- **Facebook exists** (profile.php?id=61593747489164), so it's shown.
- **No Google reviews.** Proof uses the one on-camera MG Majestor testimonial; `flags.reviews = false`.
- **Reveals fire from IntersectionObserver** (cannot stay hidden after layout shifts). ScrollTrigger is used only for scrub/pin. content-visibility was tried and reverted, because it hid reduced-motion content in WebKit.
- **Images:** plain <img> via getImageProps (no next/image hydration). The overspray band is CSS gradients (it had become the LCP candidate).
- **Runtime loads on first interaction** (scroll, pointer, touch, key) or after 7 s. This took mobile TBT from 590 ms to 70 ms.
- **Each section in its own Suspense boundary** so hydration runs in small tasks.
- **Hubot Sans barred zero:** numerals in display or label text use Mona Sans (`.num`).
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
