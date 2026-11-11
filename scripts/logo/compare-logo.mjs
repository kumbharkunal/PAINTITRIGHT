// Overlay check of the rebuilt logo against references/logo.jpg. It renders the vector
// logo on the original 1080×1080 canvas, reports soft IoU per part, and writes 400% crops
// of the trickiest edges (rebuild in translucent blue over the original) to qa/logo/.
// Usage: node scripts/logo/compare-logo.mjs
import { mkdirSync } from "node:fs";
import sharp from "sharp";
import { LOGO } from "../../src/components/brand/logo-data.ts";

const S = 1080;
const canvas = (body, bg = '<rect width="1080" height="1080" fill="#fff"/>') =>
  Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${S}" height="${S}" viewBox="0 0 ${S} ${S}">${bg}${body}</svg>`);
const allBlack = `<path d="${LOGO.r}"/><path d="${LOGO.slashRed}"/><path d="${LOGO.slashDark}"/><path d="${LOGO.word}"/><path d="${LOGO.tag}"/>`;

const orig = await sharp("references/logo.jpg").greyscale().raw().toBuffer();
const mine = await sharp(canvas(allBlack)).greyscale().raw().toBuffer();
const cov = (b, i) => 1 - b[i] / 255;
// treat the red slash as ink in the original too (greyscale red ≈ 75)
function region(name, x0, y0, x1, y1) {
  let i = 0, u = 0, diff = 0, n = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const k = y * S + x, a = Math.min(1, cov(orig, k) / 0.7), b = cov(mine, k);
    i += Math.min(a, b); u += Math.max(a, b); diff += Math.abs(a - b) > 0.5 ? 1 : 0; n++;
  }
  console.log(`${name.padEnd(10)} softIoU ${(i / u).toFixed(4)}  pixels off by >50% coverage: ${diff} of ${n} (${((diff / n) * 100).toFixed(2)}%)`);
}
region("monogram", 376, 279, 702, 599);
region("wordmark", 70, 612, 1010, 716);
region("tagline", 180, 732, 900, 774);

mkdirSync("qa/logo", { recursive: true });
const over = canvas(`<g fill="#0050ff" fill-opacity="0.45">${allBlack}</g>`, "");
const composite = await sharp("references/logo.jpg").composite([{ input: over }]).png().toBuffer();
const crops = {
  notch: [376, 279, 90, 90], slotcap: [570, 330, 80, 80], tip: [366, 540, 70, 60], slashes: [490, 455, 200, 145],
  bowl: [620, 280, 80, 190], P: [70, 612, 120, 104], G: [740, 612, 110, 104], tagline: [600, 732, 160, 42],
};
for (const [name, [x, y, w, h]] of Object.entries(crops)) {
  await sharp(composite).extract({ left: x, top: y, width: w, height: h }).resize({ width: w * 4, kernel: "nearest" }).png().toFile(`qa/logo/${name}.png`);
}
const sheet = await sharp({ create: { width: 1080, height: 1080, channels: 3, background: "#fff" } }).composite([{ input: over }]).png().toBuffer();
await sharp(composite).png().toFile("qa/logo/full-overlay.png");
console.log("crops written to qa/logo/", sheet.length > 0 ? "" : "");
