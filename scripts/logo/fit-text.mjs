// Fits a text block of references/logo.jpg with one font: a shared size and letter
// spacing, and each word placed on its own (logos often tighten letters and widen word
// gaps). Prints the fitted parameters as JSON for scripts/logo/build-logo.mjs.
// Usage: node scripts/logo/fit-text.mjs <font.ttf> "<TEXT>" x0 y0 x1 y1
import { readFileSync } from "node:fs";
import opentype from "opentype.js";
import sharp from "sharp";

const [fontPath, text, ...box] = process.argv.slice(2);
const [x0, y0, x1, y1] = box.map(Number);
const w = x1 - x0, h = y1 - y0;
const font = opentype.parse(readFileSync(fontPath).buffer);
const upm = font.unitsPerEm;

const { data } = await sharp("references/logo.jpg").extract({ left: x0, top: y0, width: w, height: h }).greyscale().raw().toBuffer({ resolveWithObject: true });
const ref = Uint8Array.from(data, (v) => (v < 128 ? 1 : 0));

// word segments: column runs separated by gaps wider than ~0.35 cap height
const cols = Array.from({ length: w }, (_, x) => { for (let y = 0; y < h; y++) if (ref[y * w + x]) return 1; return 0; });
let top = h, bot = 0;
for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (ref[y * w + x]) { top = Math.min(top, y); bot = Math.max(bot, y); }
const words = text.split(" ");
const segs = [];
{
  let s = -1, gap = 0;
  const minGap = (bot - top) * 0.3;
  for (let x = 0; x <= w; x++) {
    const on = x < w ? cols[x] : 0;
    if (on) { if (s < 0) s = x; gap = 0; }
    else if (s >= 0) { gap++; if (gap > minGap || x === w) { segs.push([s, x - gap]); s = -1; gap = 0; } }
  }
}
if (segs.length !== words.length) { console.error("segments", segs, "words", words); process.exit(1); }

const capH = font.tables.os2.sCapHeight;
const iou = (m) => { let i = 0, u = 0; for (let k = 0; k < m.length; k++) { i += m[k] & ref[k]; u += m[k] | ref[k]; } return i / u; };

function wordPath(word, size, sp, startInk, baseline, sx = 1) {
  const sc = size / upm;
  const gl = font.stringToGlyphs(word);
  let x = startInk - gl[0].getMetrics().xMin * sc;
  const xs = [];
  gl.forEach((g, i) => { xs.push(x); x += g.advanceWidth * sc + sp + (i < gl.length - 1 ? font.getKerningValue(g, gl[i + 1]) * sc : 0); });
  const d = gl.map((g, i) => g.getPath(xs[i], baseline, size).toPathData(3)).join(" ");
  return { d, xs, startInk, sx };
}

async function score(size, sp, dy, dxs, sx = 1) {
  const baseline = bot + 1 + dy;
  const parts = words.map((wd, i) => wordPath(wd, size, sp / sx, segs[i][0] + dxs[i], baseline, sx));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect width="100%" height="100%" fill="#fff"/>${parts.map((p) => `<path transform="translate(${p.startInk} 0) scale(${sx} 1) translate(${-p.startInk} 0)" d="${p.d}" fill="#000"/>`).join("")}</svg>`;
  const { data: r } = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true });
  return { v: iou(Uint8Array.from(r, (q) => (q < 128 ? 1 : 0))), size, sp, dy, dxs: [...dxs], parts, baseline, sx };
}

const size0 = ((bot - top + 1) / capH) * upm;
let best = { v: -1 };
const dx0 = words.map(() => 0);
for (let k = 0.97; k <= 1.03; k += 0.01) for (let sp = -6; sp <= 10; sp += 2) for (let sx = 0.9; sx <= 1.1001; sx += 0.025) { const r = await score(size0 * k, sp, 0, dx0, sx); if (r.v > best.v) best = r; }
for (let pass = 0; pass < 3; pass++) {
  for (let k = -0.6; k <= 0.6; k += 0.3) for (let sp = best.sp - 0.8; sp <= best.sp + 0.8; sp += 0.4) for (let q = -0.01; q <= 0.0101; q += 0.005) { const r = await score(best.size + k, sp, best.dy, best.dxs, best.sx + q); if (r.v > best.v) best = r; }
  for (const dy of [-1, -0.5, 0, 0.5, 1]) { const r = await score(best.size, best.sp, best.dy + dy, best.dxs, best.sx); if (r.v > best.v) best = r; }
  for (let i = 0; i < words.length; i++) for (let d = -2; d <= 2; d += 0.5) { const dxs = [...best.dxs]; dxs[i] += d; const r = await score(best.size, best.sp, best.dy, dxs, best.sx); if (r.v > best.v) best = r; }
}
console.log(JSON.stringify({ font: fontPath.split(/[\\/]/).pop(), text, iou: +best.v.toFixed(4), size: +best.size.toFixed(3), letterSpacing: +best.sp.toFixed(3), scaleX: +best.sx.toFixed(4), baseline: +(best.baseline + y0).toFixed(3), wordStartInk: words.map((_, i) => +(segs[i][0] + best.dxs[i] + x0).toFixed(3)) }));

if (process.env.OVERLAY) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">${best.parts.map((p) => `<path transform="translate(${p.startInk} 0) scale(${best.sx} 1) translate(${-p.startInk} 0)" d="${p.d}" fill="#0040ff" fill-opacity="0.55"/>`).join("")}</svg>`;
  const crop = await sharp("references/logo.jpg").extract({ left: x0, top: y0, width: w, height: h }).png().toBuffer();
  const comp = await sharp(crop).composite([{ input: Buffer.from(svg) }]).png().toBuffer();
  await sharp(comp).resize({ width: w * 2 }).png().toFile(process.env.OVERLAY);
}
