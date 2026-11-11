// Refines the measured monogram geometry against references/logo.jpg by coordinate
// descent on soft IoU (anti-aliased coverage), so the rebuilt R and slashes trace the
// original edges. Writes scripts/logo/fit/mark.json, which build-logo.mjs reads.
// Usage: node scripts/logo/fit-mark.mjs
import { writeFileSync } from "node:fs";
import sharp from "sharp";

const BOX = { x: 376, y: 279, w: 326, h: 320 };
const { data } = await sharp("references/logo.jpg").extract({ left: BOX.x, top: BOX.y, width: BOX.w, height: BOX.h }).raw().toBuffer({ resolveWithObject: true });
// two reference channels: dark ink (R+black) and red ink
const N = BOX.w * BOX.h;
const refDark = new Float32Array(N), refRed = new Float32Array(N);
for (let i = 0; i < N; i++) {
  const r = data[i * 3], g = data[i * 3 + 1], b = data[i * 3 + 2];
  const redness = Math.max(0, Math.min(1, (r - (g + b) / 2) / 200));
  const darkness = Math.max(0, Math.min(1, 1 - Math.max(r, g, b) / 255));
  refRed[i] = redness;
  refDark[i] = Math.max(0, darkness - redness * 0.3);
}

let P = {
  top: 287, notchTopX: 387.15, notchSlope: 0.6121,
  bowlCx: 604.75, bowlCy: 374.25, bowlR: 87.25,
  slotTop: 355.9, slotBottom: 390.6, slotCapX: 604.15,
  stemLeft: 386.2, stemRightX465: 472.32, stemRightSlope: -0.6825,
  slashTop: 476.5, slashBottom: 589.5,
  redLa: 499.53, redLk: 0.5952, redRa: 546.69, redRk: 0.5947,
  darkLa: 558.7, darkLk: 0.5926, darkRa: 605.7, darkRk: 0.5926,
};

function paths(p) {
  const notchAt = (y) => p.notchTopX + p.notchSlope * (y - p.top);
  const bowlBottom = p.bowlCy + p.bowlR;
  const stemRightAt = (y) => p.stemRightX465 + p.stemRightSlope * (y - 465);
  const tipY = 465 + (p.stemRightX465 - p.stemLeft) / -p.stemRightSlope;
  const slotR = (p.slotBottom - p.slotTop) / 2;
  const topY = p.bowlCy - p.bowlR; // top edge is tangent to the bowl
  const r = `M${notchAt(topY)} ${topY}H${p.bowlCx}A${p.bowlR} ${p.bowlR} 0 0 1 ${p.bowlCx} ${bowlBottom}H${stemRightAt(bowlBottom)}L${p.stemLeft} ${tipY}V${p.slotBottom}H${p.slotCapX}A${slotR} ${slotR} 0 0 0 ${p.slotCapX} ${p.slotTop}H${notchAt(p.slotTop)}Z`;
  const sl = (la, lk, ra, rk) => {
    const at = (a, k, y) => a + k * (y - 476);
    return `M${at(la, lk, p.slashTop)} ${p.slashTop}L${at(ra, rk, p.slashTop)} ${p.slashTop}L${at(ra, rk, p.slashBottom)} ${p.slashBottom}L${at(la, lk, p.slashBottom)} ${p.slashBottom}Z`;
  };
  return { r, red: sl(p.redLa, p.redLk, p.redRa, p.redRk), dark: sl(p.darkLa, p.darkLk, p.darkRa, p.darkRk) };
}

async function cover(d) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${BOX.w}" height="${BOX.h}" viewBox="${BOX.x} ${BOX.y} ${BOX.w} ${BOX.h}"><rect x="${BOX.x}" y="${BOX.y}" width="100%" height="100%" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
  const { data: r } = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer({ resolveWithObject: true });
  return Float32Array.from(r, (v) => 1 - v / 255);
}
const softIoU = (a, b) => { let i = 0, u = 0; for (let k = 0; k < a.length; k++) { i += Math.min(a[k], b[k]); u += Math.max(a[k], b[k]); } return i / u; };

async function score(p) {
  const { r, red, dark } = paths(p);
  const [cd, cr] = await Promise.all([cover(r + dark), cover(red)]);
  return (softIoU(cd, refDark) * 2 + softIoU(cr, refRed)) / 3;
}

let best = await score(P);
console.log("start", best.toFixed(5));
const keys = Object.keys(P).filter((k) => k !== "top");
for (const step of [1, 0.5, 0.25, 0.1]) {
  let improved = true;
  while (improved) {
    improved = false;
    for (const k of keys) {
      const s = /Slope|k$/.test(k) && k !== "darkRk" && k !== "redRk" && k !== "darkLk" && k !== "redLk" ? step * 0.01 : /k$/.test(k) ? step * 0.004 : step;
      for (const dir of [1, -1]) {
        const q = { ...P, [k]: P[k] + dir * s };
        const v = await score(q);
        if (v > best + 1e-6) { best = v; P = q; improved = true; }
      }
    }
  }
  console.log("step", step, "score", best.toFixed(5));
}
P.top = P.bowlCy - P.bowlR;
writeFileSync("scripts/logo/fit/mark.json", JSON.stringify(Object.fromEntries(Object.entries(P).map(([k, v]) => [k, +v.toFixed(4)])), null, 1));
console.log(JSON.stringify(P));
