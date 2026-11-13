// Downloads frames from the client's own YouTube Shorts at build-prep time, so the page makes
// no YouTube request until a visitor presses play.
//  - Videos + Proof: the vertical thumbnail, cropped to 9:16 → public/images/videos/{id}.jpg
//  - Work: the same frame cropped to 4:5 → public/images/work/{slug}.jpg. All their work is
//    on video (no stills on Instagram or from the client yet), so these frames stand in until
//    real photos arrive; drop a photo at the same path to replace one.
// Usage: node scripts/fetch-yt-thumbs.mjs [--force]
import { mkdirSync, existsSync } from "node:fs";
import sharp from "sharp";

const VIDEO_IDS = ["B3-puSiGIO8", "Akfa4KmWeaU", "PZdKZimD0Jo", "iMEVdAhjchc", "KV0DNZ7rh3E", "6i_bBG_otTk", "0NwTGu8gfBo"];
const WORK = {
  "mercedes-glc-ppf": { id: "TrHiT4jSC8s", y: 0.5 },
  "bmw-m2-ceramic": { id: "Cn9_caqHqCw", y: 0.5 },
  "bmw-x3-ceramic": { id: "__oZhrku4_Q", y: 0.5 },
  // The cover the client picked: the wrecked car under their red "BEFORE" label (the reel shows the after).
  // YouTube's alternate frames (oar1/oar3) catch the owner mid-word, so covers only.
  "bmw-z4-restoration": { id: "hKQGvxMT93I", y: 0.55 },
  "toyota-camry-restoration": { id: "kC4jSSr15SU", y: 0.55 },
  "mercedes-s-class-repaint-ppf": { id: "gDn7yzwWAeI", y: 0.5 },
};
const force = process.argv.includes("--force");

// oardefault is the cover the client picked, at full 9:16 resolution.
async function frame(id) {
  for (const v of ["oardefault", "oar2", "maxresdefault", "hq720", "hqdefault"]) {
    const r = await fetch(`https://i.ytimg.com/vi/${id}/${v}.jpg`);
    if (r.ok) return Buffer.from(await r.arrayBuffer());
  }
  throw new Error(`no thumbnail for ${id}`);
}

// crop a w:h window out of the frame, centred horizontally and at fraction y vertically
async function crop(buf, ratioW, ratioH, y, outW, out) {
  const m = await sharp(buf).metadata();
  const w = Math.min(m.width, Math.round((m.height * ratioW) / ratioH));
  const h = Math.round((w * ratioH) / ratioW);
  const left = Math.round((m.width - w) / 2);
  const top = Math.max(0, Math.min(m.height - h, Math.round(m.height * y - h / 2)));
  await sharp(buf).extract({ left, top, width: w, height: h }).resize(outW).jpeg({ quality: 84, mozjpeg: true }).toFile(out);
  return `${m.width}×${m.height} → ${outW}×${Math.round((outW * ratioH) / ratioW)}`;
}

mkdirSync("public/images/videos", { recursive: true });
mkdirSync("public/images/work", { recursive: true });
for (const id of VIDEO_IDS) {
  const out = `public/images/videos/${id}.jpg`;
  if (existsSync(out) && !force) continue;
  console.log("video", id, await crop(await frame(id), 9, 16, 0.5, 1080, out));
}
for (const [slug, { id, y }] of Object.entries(WORK)) {
  const out = `public/images/work/${slug}.jpg`;
  if (existsSync(out) && !force) continue;
  console.log("work ", slug, await crop(await frame(id), 4, 5, y, 1080, out));
}
