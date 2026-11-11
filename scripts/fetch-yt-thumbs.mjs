// Downloads the vertical thumbnail of each YouTube Short the site shows (the client's own
// videos) into public/images/videos/{id}.jpg at build-prep time, so the page makes no
// YouTube request until a visitor presses play. Crops to 9:16 if YouTube returns another shape.
// Usage: node scripts/fetch-yt-thumbs.mjs
import { mkdirSync, existsSync } from "node:fs";
import sharp from "sharp";

const IDS = ["B3-puSiGIO8", "iMEVdAhjchc", "kC4jSSr15SU", "KV0DNZ7rh3E", "Cn9_caqHqCw", "6i_bBG_otTk", "0NwTGu8gfBo"];
mkdirSync("public/images/videos", { recursive: true });
for (const id of IDS) {
  const out = `public/images/videos/${id}.jpg`;
  if (existsSync(out) && !process.argv.includes("--force")) continue;
  let buf = null;
  for (const v of ["oardefault", "oar2", "maxresdefault", "hq720", "hqdefault"]) {
    const r = await fetch(`https://i.ytimg.com/vi/${id}/${v}.jpg`);
    if (r.ok) { buf = Buffer.from(await r.arrayBuffer()); break; }
  }
  if (!buf) { console.error("no thumbnail for", id); continue; }
  const meta = await sharp(buf).metadata();
  const targetW = Math.min(meta.width, Math.round((meta.height * 9) / 16));
  const targetH = Math.round((targetW * 16) / 9);
  await sharp(buf)
    .resize(targetW, targetH, { fit: "cover", position: "centre" })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(out);
  console.log(id, `${meta.width}×${meta.height} → ${targetW}×${targetH}`);
}
