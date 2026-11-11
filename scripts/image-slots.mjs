// Every image slot the homepage uses: final path, pixel size and the placeholder style.
// IMAGE_PROMPTS.md documents the same slots for whoever generates the real images.
export const SLOTS = [
  { path: "public/images/hero/hero-desktop.png", w: 1536, h: 1024, kind: "hero" },
  { path: "public/images/hero/hero-mobile.png", w: 1024, h: 1536, kind: "hero" },
  { path: "public/images/results/after.png", w: 1024, h: 1024, kind: "after" },
  { path: "public/images/results/before.png", w: 1024, h: 1024, kind: "before" },
  { path: "public/images/why/craft.png", w: 1536, h: 1024, kind: "studio", seed: 21 },
  ...[
    "paint-respray",
    "scratch-correction",
    "paint-restoration",
    "ppf",
    "ceramic-coating",
    "glass-coating",
    "detailing-polishing",
    "interior-detailing",
    "interior-plastic-coating",
  ].map((slug, i) => ({ path: `public/images/services/${slug}.png`, w: 1024, h: 1536, kind: "studio", seed: 30 + i })),
  ...[
    "bmw-x7-bumper",
    "porsche-macan-piano-black",
    "bmw-z4-restoration",
    "mercedes-s-class-repaint-ppf",
    "mercedes-glc-ppf",
    "bmw-x3-ceramic",
  ].map((slug, i) => ({ path: `public/images/work/${slug}.jpg`, w: 1280, h: 1600, kind: "studio", seed: 50 + i })),
];
