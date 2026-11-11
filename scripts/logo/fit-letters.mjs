// Per-letter fit of a logo text line: one font, one size, one baseline and one horizontal
// scale, but every glyph gets its own x (logo designers hand-kern). Coordinate descent on
// whole-line IoU against references/logo.jpg. Prints JSON consumed by build-logo.mjs.
// Usage: node scripts/logo/fit-letters.mjs <font.ttf> "<TEXT>" x0 y0 x1 y1 [overlay.png]
import { readFileSync } from "node:fs";
import opentype from "opentype.js";
import sharp from "sharp";

const [fontPath, text, ...rest] = process.argv.slice(2);
const [x0, y0, x1, y1] = rest.slice(0, 4).map(Number);
const overlayOut = rest[4];
const w = x1 - x0, h = y1 - y0;
const font = opentype.parse(readFileSync(fontPath).buffer);
const upm = font.unitsPerEm;

const { data } = await sharp("references/logo.jpg").extract({ left: x0, top: y0, width: w, height: h }).greyscale().raw().toBuffer({ resolveWithObject: true });
// soft reference: darkness 0..1 (keeps anti-aliasing information)
const ref = Float32Array.from(data, (v) => 1 - v / 255);

const glyphs = font.stringToGlyphs(text).map((g) => ({ g, ink: g.unicode !== 32 && g.name !== "space" }));
let top = h, bot = 0, left = w;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (ref[y * w + x] > 0.5) { top = Math.min(top, y); bot = Math.max(bot, y); left = Math.min(left, x); }

function pathFor(xs, size, baseline, sx) {
  // horizontal scale applied per glyph about its own origin, so positions stay free
  return glyphs.map(({ g, ink }, i) => (ink ? `<path transform="translate(${xs[i]} 0) scale(${sx} 1)" d="${g.getPath(0, baseline, size).toPathData(3)}"/>` : "")).join("");
}

async function score(xs, size, baseline, sx) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#fff"/><g fill="#000">${pathFor(xs, size, baseline, sx)}</g></svg>`;
  const { data: r } = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true });
  // soft IoU between two coverage maps
  let i = 0, u = 0;
  for (let k = 0; k < r.length; k++) { const a = 1 - r[k] / 255, b = ref[k]; i += Math.min(a, b); u += Math.max(a, b); }
  return i / u;
}

function naturalXs(size, sx) {
  const sc = size / upm;
  const xs = [];
  let x = left - glyphs[0].g.getMetrics().xMin * sc * sx;
  glyphs.forEach(({ g }, i) => { xs.push(x); x += (g.advanceWidth * sc + (i < glyphs.length - 1 ? font.getKerningValue(g, glyphs[i + 1].g) * sc : 0)) * sx; });
  return xs;
}

const capPx = bot - top; // threshold rows minus one edge row
let size = (capPx / font.tables.os2.sCapHeight) * upm;
let baseline = bot + 0.5;
let sx = 1;
// global: size, scaleX with natural spacing stretched to the line's ink width
let best = -1, xs = naturalXs(size, sx);
for (let k = 0.97; k <= 1.031; k += 0.01) for (let q = 0.94; q <= 1.061; q += 0.02) {
  const s = size * k, x2 = naturalXs(s, q);
  const v = await score(x2, s, baseline, q);
  if (v > best) { best = v; xs = x2; var bs = s, bq = q; }
}
size = bs; sx = bq;
// coordinate descent: per-glyph x, then size/baseline/scale nudges
for (let sweep = 0; sweep < 4; sweep++) {
  const step = [2, 1, 0.5, 0.25][sweep];
  for (let i = 0; i < glyphs.length; i++) {
    if (!glyphs[i].ink) continue;
    for (const d of [-4, -3, -2, -1, 1, 2, 3, 4].map((t) => t * step)) {
      const x2 = [...xs]; x2[i] += d;
      const v = await score(x2, size, baseline, sx);
      if (v > best) { best = v; xs = x2; }
    }
  }
  for (const [ds, db, dq] of [[1, 0, 0], [-1, 0, 0], [0, 0.5, 0], [0, -0.5, 0], [0, 0, 0.01], [0, 0, -0.01], [0.4, 0, 0], [-0.4, 0, 0], [0, 0.25, 0], [0, -0.25, 0], [0, 0, 0.004], [0, 0, -0.004]]) {
    const v = await score(xs, size + ds, baseline + db, sx + dq);
    if (v > best) { best = v; size += ds; baseline += db; sx += dq; }
  }
}
const out = {
  font: fontPath.split(/[\\/]/).pop(),
  text,
  softIoU: +best.toFixed(4),
  size: +size.toFixed(3),
  scaleX: +sx.toFixed(4),
  baseline: +(baseline + y0).toFixed(3),
  xs: xs.map((x, i) => (glyphs[i].ink ? +(x + x0).toFixed(3) : null)),
};
console.log(JSON.stringify(out));
if (overlayOut) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><g fill="#0040ff" fill-opacity="0.55">${pathFor(xs, size, baseline, sx)}</g></svg>`;
  const crop = await sharp("references/logo.jpg").extract({ left: x0, top: y0, width: w, height: h }).png().toBuffer();
  const comp = await sharp(crop).composite([{ input: Buffer.from(svg) }]).png().toBuffer();
  await sharp(comp).resize({ width: w * 2 }).png().toFile(overlayOut);
}
