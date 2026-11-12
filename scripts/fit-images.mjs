// Crops and resizes every image slot to its exact size (centre crop, "attention" focus), so a
// ChatGPT or phone image of any shape can be dropped in at its path. Untouched files that
// already match are skipped. Usage: npm run images:fit
import { renameSync } from "node:fs";
import sharp from "sharp";
import { SLOTS } from "./image-slots.mjs";

let changed = 0;
for (const s of SLOTS) {
  let meta;
  try {
    meta = await sharp(s.path).metadata();
  } catch {
    console.log("missing", s.path, "(run npm run placeholders)");
    continue;
  }
  if (meta.width === s.w && meta.height === s.h) continue;
  const tmp = `${s.path}.tmp`;
  let img = sharp(s.path).resize(s.w, s.h, { fit: "cover", position: sharp.strategy.attention });
  img = s.path.endsWith(".jpg") ? img.jpeg({ quality: 88, mozjpeg: true }) : img.png({ compressionLevel: 9 });
  await img.toFile(tmp);
  renameSync(tmp, s.path);
  changed++;
  console.log(`fitted ${s.path}: ${meta.width}×${meta.height} → ${s.w}×${s.h}`);
}
console.log(changed ? `${changed} image(s) fitted` : "every slot already has the right size");
