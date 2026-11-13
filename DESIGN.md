# DESIGN.md: PAINT IT RIGHT

The single source of truth for the homepage's look and motion. Tokens live in `src/app/globals.css` (`@theme`) and `src/lib/motion.ts`. If code and this file disagree, fix one of them in the same commit.

## Concept: THE PASS

A respray is built one pass of the gun at a time, and no car goes home until its paint passes under the lights.
- Surfaces start in flat primer grey.
- A single diagonal pass, cut at the angle of the logo's slashes, sweeps across and leaves wet gloss behind.
- Red appears only where paint or light lands.

Where the pass appears:
- **Hero:** the first pass.
- **Services:** they change with a pass.
- **Process:** the seven passes.
- **Footer:** the final coat.

**Mood:** a paint booth at night. Near-black and graphite, off-white type, one signal red used as light. (The mood is art direction only; **copy never claims a paint booth**, because their painting is done in an open yard.)

**Positioning line:** one studio paints it and protects it.

## Colour

| Token | Value | Use | Contrast |
|---|---|---|---|
| `booth` | `#08090B` | Page background | — |
| `booth-2` | `#0E1013` | Raised bands, footer floor | — |
| `graphite` | `#16191E` | Panels, plates | — |
| `graphite-2` | `#1F232A` | Hover/active surfaces | — |
| `line` | `rgb(255 255 255 / .09)` | Decorative hairlines only | — |
| `line-strong` | `rgb(255 255 255 / .18)` | Control borders (always paired with text or an icon) | — |
| `steel` | `#8B929C` | Secondary text | 6.4:1 on booth, 5.6:1 on graphite |
| `paper` | `#EDEBE7` | Primary text | 16.7:1 |
| `primer` | `#6F737A` | Primer states, inactive graphics | 4.2:1 (large text and graphics only) |
| `signal` | **`#EC0609`** (sampled from the logo) | CTAs, active states, slashes, key highlights | 4.36:1 on booth, so **large text and graphics only** |
| `signal-press` | `#C70508` | Pressed CTA | White on it 6.1:1 |
| `white` | `#FFFFFF` | Text on red only | White on signal 4.57:1. Paper on red fails (3.8:1). |
| `chrome` | `linear-gradient(180deg,#FFF 0%,#C9CDD3 48%,#9AA0A8 52%,#F2F3F4 100%)` | Footer wordmark only | Darkest stop 7.5:1 |

Rules:
- Red is light: never body text, never a large fill except CTAs and the hero car.
- One red focal point per viewport.
- No purple, no gradient blobs.

## Type

**Display: Hubot Sans** (GitHub, SIL OFL 1.1), variable wght 200–900 and wdth 75–125, roman only. Uppercase, weight 800, tracking −0.02em.
- **Width by breakpoint:** 125 (Expanded) at ≥1024 px, 112 at ≥640 px, 100 below, so nothing overflows at 320 px.
- **Emphasis:** one red word per headline leans at the slash angle via `skewX`. That echoes the client's red italic word with no italic file.

**Body: Mona Sans** (OFL), wght 400–600 at wdth 100. Numbers (phones, hours, durations, counters) use its default lining figures through `.num` / `.tabular`. Mona's tabular set is a code-style design with a slashed zero, so it is never switched on, and Hubot's barred zero is kept out of numerals the same way.

**Labels:** Hubot 600, wdth 125, 12 px uppercase, +0.08em. Functional only (service groups, step counter, plate rows). Never decorative eyebrows above headings.

**Loading:** both via `next/font/google`, self-hosted, latin, `display: swap`, metric-matched fallback. Measured: Hubot 93 KB + Mona 40 KB.

**Scale (fluid)**

| Token | Size | Line-height |
|---|---|---|
| `display-xxl` | `clamp(2.5rem, 0.75rem + 7.4vw, 9rem)` | 0.88 |
| `display-xl` | `clamp(2.125rem, 0.9rem + 4.6vw, 5.75rem)` | 0.9 |
| `display-l` | `clamp(1.5rem, 0.95rem + 2.2vw, 3rem)` | 0.95 |
| `title` | `clamp(1.25rem, 1.05rem + 0.8vw, 1.625rem)` | 1.15 |
| `body-l` / `body` / `small` | 18 / 16 / 14 px | 1.55 / 1.6 / 1.5 |
| `label` | 12 px | 1.2 |

## Space, grid, shape

- **Spacing:** 4 px base: 4 8 12 16 24 32 48 64 96 128 160 224.
- **Section padding:** `clamp(80px, 6vw + 56px, 176px)`.
- **Grid:** 4 / 8 / 12 columns; gutters 16 / 24 / 40; container max 1440 px.
- **Radii:** 0 on media and panels; 6 px on chips; full pills only for the nav, buttons and chips.
- **The notch:** the top-left corner is cut at the logo's notch angle (14 px mobile, 24 px desktop), via `clip-path` on media and plates. Focus rings sit on the unclipped parent.

## The slash system

**Measured from `references/logo.jpg`**
- Both slashes lean **30.75° from vertical** (dx/dy = 0.595); the R's top-left notch leans 31.5°.
- Token: `--slash-angle: 30.75deg`, `--slash-tan: 0.595`. Every diagonal on the site uses it.

`<Slashes>` draws the logo's two parallelograms (red + paper on dark; red + black on light). It's used for:
- section markers before titles (no 01/02 numbering);
- hairline divider breaks;
- the end of the hero pass (the "loader");
- the nav active state;
- the progress line's leading edge;
- link hovers;
- Process ticks;
- the before/after divider;
- the favicon.

## Surfaces

**Glass**
- `rgb(14 16 19 / .56)`, `backdrop-filter: blur(14px) saturate(160%)` (+ `-webkit-`).
- Border `1px rgb(255 255 255 / .08)`, inset highlight `0 1px 0 rgb(255 255 255 / .07)`, shadow `0 10px 30px -10px rgb(0 0 0 / .6)`.
- The menu sheet uses `.78` alpha and 20 px blur.
- Fallback without `backdrop-filter`: `.94` alpha.
- **Never animate `backdrop-filter`.**

**Texture**
- A 160 px grain PNG (~5% alpha) as a background layer on the hero, offer strip and footer only.
- No fixed full-screen or blend-mode overlays.

## Icons and social marks

- **Icons:** Hugeicons free (stroke-rounded, 1.5 stroke, 16/20/24 px). No emoji, no other set.
- **Social:** the original full-colour Instagram, Facebook, WhatsApp and YouTube marks from theSVG in `public/icons/`, rendered as `<img>`, never recoloured. On a red button, the WhatsApp mark sits on a dark disc.

## Motion

| Token | Value | Use |
|---|---|---|
| `press` / `hover` / `ui` | 120 / 180 / 240 ms | Press, hover, small state |
| `sheet` | spring `{ visualDuration: .42, bounce: 0 }` | Menu morph, accordions, nav indicator |
| `reveal` | 800 ms | Text and media reveals |
| `pass` | 1000 ms hero, 700 ms swaps | The pass |
| `stagger` | 60 ms lines, 30–40 ms menu links (varied, never uniform) | |
| `ease-pass` | `cubic-bezier(.65,.05,.36,1)` | The pass |
| `ease-set` | `cubic-bezier(.2,.9,.1,1)` | Entrances |
| `ease-exit` | `cubic-bezier(.4,0,1,1)` | Exits |

Rules:
- Animate only `transform`, `opacity` and `clip-path`.
- Everything is interruptible. No bounce.
- Motion gets full transform strings.
- GSAP and Motion never drive the same element.
- The first viewport animates with CSS only. The LCP image is never opacity-animated.
- **GSAP + ScrollTrigger + SplitText + Lenis** load on idle, with one RAF (`gsap.ticker` drives Lenis).
- **Phones:** every effect has a mobile branch (`gsap.matchMedia`), adapted, not deleted.
- **Reduced motion:** no Lenis, scrub, pin or parallax; simple fades.
- **Choreography:** one entrance per container; a lead, then support; decoration only fades; nothing blocks interaction.

## Components

- **Primary button:** red pill, white Mona 600 label, WhatsApp disc. Hover shifts the disc. Press is `scale(.97)` over 120 ms. Magnetic on fine pointers. Min 44 px tall.
- **Secondary button:** a `line-strong` outline, paper text. Hover adds a `graphite-2` fill.
- **Links:** the underline draws with `scaleX` from the left and leaves to the right.
- **Menu button (phones and tablets):** a glass pill reading "Menu" beside a classic three-bar icon, the short bottom bar in red. Open, it reads "Close" and the bars fold into an ×. Recognisable first, branded second: real visitors read the slash-pair icon this replaced as decoration.
- **Cursor:** the system arrow and hand, redrawn in signal red with a white outline (`public/cursors/`), on fine pointers only. No follower or labelled disc.
- **Rails** (Work and Videos on phones and tablets) are native `overflow-x` scroll-snap lists. They never take `data-lenis-prevent`, because that blocks vertical scrolling for a swipe or wheel that starts on them.
- **Focus:** a 2 px paper outline with 3 px offset, always visible on keyboard focus.
- **Tap targets:** ≥ 44 px. Safe-area insets respected. Zero horizontal overflow at 320 px.

## Do / Don't

**Do**
- Asymmetric 12-column compositions.
- One idea per section.
- Their real cars and words.
- Plain lining numbers (no slashed or barred zeros).
- The slash angle everywhere a diagonal appears.

**Don't**
- Centred-everything sections, identical three-card grids, gradient blobs, purple, emoji.
- Eyebrow labels over every heading.
- Em or en dashes in visible copy.
- "Elevate / unleash / seamless / nestled / cutting-edge / state-of-the-art".
- Invented numbers, years, prices, brands or reviews.
- Paint-booth claims.
- Elite auto hub's reviews or listing.
