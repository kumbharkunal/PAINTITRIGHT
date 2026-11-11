// Identifies the wordmark/tagline font in references/logo.jpg by pixel overlap.
// For each candidate it renders the text with opentype.js, scales it to the logo's
// cap height, fits letter spacing to the logo's letter positions, then scores the
// intersection-over-union against the logo mask.
// Usage: node scripts/logo/match-font.mjs <fontsDir>
import { readFileSync } from "node:fs";
import path from "node:path";
import opentype from "opentype.js";
import sharp from "sharp";

const fontsDir = process.argv[2];
const LOGO = "references/logo.jpg";

const BLOCKS = {
  wordmark: { text: "PAINT IT RIGHT", x0: 70, x1: 1010, y0: 612, y1: 716, fonts: ["Poppins-SemiBold", "Poppins-Bold", "Poppins-ExtraBold"] },
  tagline: { text: "LIFETIME WARRANTY FOR YOUR CAR", x0: 180, x1: 900, y0: 732, y1: 774, fonts: ["Poppins-Medium", "Poppins-SemiBold", "Poppins-Bold"] },
};

async function mask(x0, y0, w, h) {
  const { data } = await sharp(LOGO).extract({ left: x0, top: y0, width: w, height: h }).greyscale().raw().toBuffer({ resolveWithObject: true });
  return Uint8Array.from(data, (v) => (v < 128 ? 1 : 0));
}

function letterRuns(m, w, h) {
  const cols = [];
  for (let x = 0; x < w; x++) {
    let on = 0;
    for (let y = 0; y < h; y++) on |= m[y * w + x];
    cols.push(on);
  }
  const runs = [];
  let s = -1;
  cols.forEach((on, x) => {
    if (on && s < 0) s = x;
    if (!on && s >= 0) { runs.push([s, x - 1]); s = -1; }
  });
  if (s >= 0) runs.push([s, w - 1]);
  return runs;
}

function rowsExtent(m, w, h) {
  let top = h, bot = 0;
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (m[y * w + x]) { top = Math.min(top, y); bot = Math.max(bot, y); }
  return [top, bot];
}

function layout(font, text, size, spacing) {
  const glyphs = font.stringToGlyphs(text);
  const scale = size / font.unitsPerEm;
  let x = 0;
  const placed = [];
  glyphs.forEach((g, i) => {
    placed.push({ g, x });
    let adv = g.advanceWidth * scale + spacing;
    if (i < glyphs.length - 1) adv += font.getKerningValue(g, glyphs[i + 1]) * scale;
    x += adv;
  });
  return placed;
}

async function render(font, placed, size, w, h, ox, baseline) {
  const d = placed.map(({ g, x }) => g.getPath(ox + x, baseline, size).toPathData(2)).join(" ");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  const { data } = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true });
  return { m: Uint8Array.from(data, (v) => (v < 128 ? 1 : 0)), d };
}

for (const [name, b] of Object.entries(BLOCKS)) {
  const w = b.x1 - b.x0, h = b.y1 - b.y0;
  const ref = await mask(b.x0, b.y0, w, h);
  const refRuns = letterRuns(ref, w, h);
  const [top, bot] = rowsExtent(ref, w, h);
  console.log(`\n${name}: ${refRuns.length} letter runs, rows ${top + b.y0}-${bot + b.y0}, x ${refRuns[0][0] + b.x0}-${refRuns.at(-1)[1] + b.x0}`);
  for (const fname of b.fonts) {
    const font = opentype.parse(readFileSync(path.join(fontsDir, `${fname}.ttf`)).buffer);
    // cap height from the first letter run (a flat-topped capital), baseline at its bottom
    const firstRun = refRuns[0];
    let capTop = h, capBot = 0;
    for (let y = 0; y < h; y++) for (let x = firstRun[0]; x <= firstRun[1]; x++) if (ref[y * w + x]) { capTop = Math.min(capTop, y); capBot = Math.max(capBot, y); }
    const capPx = capBot - capTop + 1;
    const capUnits = font.tables.os2.sCapHeight;
    const size = (capPx / capUnits) * font.unitsPerEm;
    const baseline = capBot + 1;
    const firstInk = refRuns[0][0];
    const iou = (m) => { let inter = 0, uni = 0; for (let i = 0; i < m.length; i++) { inter += m[i] & ref[i]; uni += m[i] | ref[i]; } return inter / uni; };
    const score = async (sp, k, dx) => {
      const sz = size * k;
      const placed = layout(font, b.text, sz, sp);
      const g0 = placed[0];
      const ox = firstInk - (g0.g.xMin ?? 0) * (sz / font.unitsPerEm) + dx;
      const { m, d } = await render(font, placed, sz, w, h, ox, baseline);
      return { v: iou(m), sp, k, dx, d, sz };
    };
    let best = { v: -1 };
    for (let sp = -4; sp <= 30; sp += 1) for (const k of [0.98, 1, 1.02]) { const r = await score(sp, k, 0); if (r.v > best.v) best = r; }
    for (let sp = best.sp - 1; sp <= best.sp + 1; sp += 0.2) for (let k = best.k - 0.012; k <= best.k + 0.012; k += 0.004) for (const dx of [-1, -0.5, 0, 0.5, 1]) { const r = await score(sp, k, dx); if (r.v > best.v) best = r; }
    console.log(`  ${fname.padEnd(18)} size ${best.sz.toFixed(2)}px  spacing ${best.sp.toFixed(2)}px  dx ${best.dx}  IoU ${best.v.toFixed(4)}`);
  }
}
