// Rebuilds the PAINT IT RIGHT logo as vector paths, in the 1080×1080 coordinate space of
// references/logo.jpg:
//  - the R monogram and its two slashes from measured geometry (see DESIGN.md: the slashes
//    lean 30.75° from vertical);
//  - the wordmark (Poppins Bold) and tagline (Poppins Medium) from the per-letter fits in
//    scripts/logo/fit/*.json, with every glyph converted to an outline.
// Writes public/brand/*.svg and src/components/brand/logo-data.ts.
// Usage: node scripts/logo/build-logo.mjs <fontsDir>
// (Poppins is SIL OFL 1.1; outlines of it in a logo are permitted. Font files are not committed.)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import opentype from "opentype.js";

const fontsDir = process.argv[2];
const r2 = (n) => Math.round(n * 100) / 100;

// ---- monogram geometry (logo.jpg pixels, subpixel edge fits) -------------------------
const F = JSON.parse(readFileSync("scripts/logo/fit/mark.json", "utf8"));
// one slope for all four slash edges (the fits differ by <0.4°, i.e. JPEG noise); each
// edge keeps its fitted position at mid-height
const SLASH_K = 0.596;
const mid = (F.slashTop + F.slashBottom) / 2;
const edge = (a, k) => [a + k * (mid - 476) - SLASH_K * (mid - 476), SLASH_K];
const G = {
  top: F.bowlCy - F.bowlR, notchTopX: F.notchTopX, notchSlope: F.notchSlope,
  bowlCx: F.bowlCx, bowlCy: F.bowlCy, bowlR: F.bowlR,
  slotTop: F.slotTop, slotBottom: F.slotBottom, slotCapX: F.slotCapX,
  stemLeft: F.stemLeft, stemRightX465: F.stemRightX465, stemRightSlope: F.stemRightSlope,
  slashTop: F.slashTop, slashBottom: F.slashBottom,
  red: { l: edge(F.redLa, F.redLk), r: edge(F.redRa, F.redRk) },
  dark: { l: edge(F.darkLa, F.darkLk), r: edge(F.darkRa, F.darkRk) },
};
const notchAt = (y) => G.notchTopX + G.notchSlope * (y - G.top);
const bowlBottom = G.bowlCy + G.bowlR;
const stemRightAt = (y) => G.stemRightX465 + G.stemRightSlope * (y - 465);
const tipY = 465 + (G.stemRightX465 - G.stemLeft) / -G.stemRightSlope;
const slotR = (G.slotBottom - G.slotTop) / 2;

const rPath = [
  `M${r2(notchAt(G.top))} ${r2(G.top)}`,
  `H${r2(G.bowlCx)}`,
  `A${G.bowlR} ${G.bowlR} 0 0 1 ${r2(G.bowlCx)} ${r2(bowlBottom)}`,
  `H${r2(stemRightAt(bowlBottom))}`,
  `L${r2(G.stemLeft)} ${r2(tipY)}`,
  `V${r2(G.slotBottom)}`,
  `H${r2(G.slotCapX)}`,
  `A${r2(slotR)} ${r2(slotR)} 0 0 0 ${r2(G.slotCapX)} ${r2(G.slotTop)}`,
  `H${r2(notchAt(G.slotTop))}`,
  "Z",
].join("");

const slash = ({ l, r }) => {
  const at = ([a, k], y) => a + k * (y - 476);
  const t = G.slashTop, b = G.slashBottom;
  return `M${r2(at(l, t))} ${r2(t)}L${r2(at(r, t))} ${r2(t)}L${r2(at(r, b))} ${r2(b)}L${r2(at(l, b))} ${r2(b)}Z`;
};
const redPath = slash(G.red);
const darkPath = slash(G.dark);

// ---- text outlines from the per-letter fits ------------------------------------------
function textPath(fitFile) {
  const fit = JSON.parse(readFileSync(fitFile, "utf8"));
  const font = opentype.parse(readFileSync(path.join(fontsDir, fit.font)).buffer);
  const glyphs = font.stringToGlyphs(fit.text);
  let d = "";
  glyphs.forEach((g, i) => {
    const x0 = fit.xs[i];
    if (x0 == null) return;
    const p = g.getPath(0, fit.baseline, fit.size);
    // bake the glyph's own x offset and horizontal scale into the coordinates
    const X = (x) => r2(x0 + x * fit.scaleX);
    const Y = (y) => r2(y);
    for (const c of p.commands) {
      if (c.type === "M") d += `M${X(c.x)} ${Y(c.y)}`;
      else if (c.type === "L") d += `L${X(c.x)} ${Y(c.y)}`;
      else if (c.type === "Q") d += `Q${X(c.x1)} ${Y(c.y1)} ${X(c.x)} ${Y(c.y)}`;
      else if (c.type === "C") d += `C${X(c.x1)} ${Y(c.y1)} ${X(c.x2)} ${Y(c.y2)} ${X(c.x)} ${Y(c.y)}`;
      else if (c.type === "Z") d += "Z";
    }
  });
  return d;
}
const wordPath = textPath("scripts/logo/fit/wordmark.json");
const tagPath = textPath("scripts/logo/fit/tagline.json");

// ---- bounding boxes (with a hair of padding) -----------------------------------------
const MARK = { x: 384, y: 285, w: 310, h: 308 }; // R + slashes
const WORD = { x: 68, y: 612, w: 944, h: 100 };
const TAG = { x: 182, y: 734, w: 714, h: 40 };
const FULL = { x: 60, y: 270, w: 960, h: 515 };

const RED = "#EC0609";
const svg = (vb, body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb.x} ${vb.y} ${vb.w} ${vb.h}" width="${vb.w}" height="${vb.h}" role="img" aria-label="${title}"><title>${title}</title>${body}</svg>\n`;
const mark = (ink) => `<path d="${rPath}" fill="${ink}"/><path d="${redPath}" fill="${RED}"/><path d="${darkPath}" fill="${ink}"/>`;

mkdirSync("public/brand", { recursive: true });
writeFileSync("public/brand/logo-full.svg", svg(FULL, `${mark("#000")}<path d="${wordPath}" fill="#000"/><path d="${tagPath}" fill="#000"/>`, "Paint It Right, lifetime warranty for your car"));
writeFileSync("public/brand/logo-full-dark.svg", svg(FULL, `${mark("#EDEBE7")}<path d="${wordPath}" fill="#EDEBE7"/><path d="${tagPath}" fill="#EDEBE7"/>`, "Paint It Right, lifetime warranty for your car"));
writeFileSync("public/brand/logo-mark.svg", svg(MARK, mark("#000"), "Paint It Right"));
writeFileSync("public/brand/logo-mark-dark.svg", svg(MARK, mark("#EDEBE7"), "Paint It Right"));
writeFileSync("public/brand/wordmark.svg", svg(WORD, `<path d="${wordPath}" fill="#000"/>`, "Paint It Right"));

const ts = `// Generated by scripts/logo/build-logo.mjs. Do not edit by hand.
// Coordinates are in the 1080×1080 space of references/logo.jpg.
export const LOGO = {
  red: "${RED}",
  boxes: ${JSON.stringify({ mark: MARK, word: WORD, tag: TAG, full: FULL })},
  r: "${rPath}",
  slashRed: "${redPath}",
  slashDark: "${darkPath}",
  word: "${wordPath}",
  tag: "${tagPath}",
} as const;
`;
mkdirSync("src/components/brand", { recursive: true });
writeFileSync("src/components/brand/logo-data.ts", ts);
console.log("R path:", rPath);
console.log("red:", redPath);
console.log("dark:", darkPath);
console.log("wordmark bytes", wordPath.length, "tagline bytes", tagPath.length);
