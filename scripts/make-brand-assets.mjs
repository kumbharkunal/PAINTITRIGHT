// Generates the favicon, Apple touch icon, Open Graph image and the two textures from the
// traced logo paths. Run after scripts/logo/build-logo.mjs.
// Usage: node --experimental-strip-types scripts/make-brand-assets.mjs
import { mkdirSync, writeFileSync } from "node:fs";
import sharp from "sharp";
import { LOGO } from "../src/components/brand/logo-data.ts";

const BOOTH = "#08090B", PAPER = "#EDEBE7", RED = LOGO.red;
const mark = (ink) => `<path d="${LOGO.r}" fill="${ink}"/><path d="${LOGO.slashRed}" fill="${RED}"/><path d="${LOGO.slashDark}" fill="${ink}"/>`;

// ---- favicon: paper R + red slash on a booth-black rounded tile ---------------------
const m = LOGO.boxes.mark;
const cx = m.x + m.w / 2, cy = m.y + m.h / 2, side = 430;
const tile = (r) => `<rect x="${cx - side / 2}" y="${cy - side / 2}" width="${side}" height="${side}" rx="${r}" fill="${BOOTH}"/>`;
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${cx - side / 2} ${cy - side / 2} ${side} ${side}">${tile(side * 0.22)}${mark(PAPER)}</svg>\n`;
writeFileSync("src/app/icon.svg", iconSvg);
await sharp(Buffer.from(iconSvg.replace(`rx="${side * 0.22}"`, 'rx="0"'))).resize(180, 180).png().toFile("src/app/apple-icon.png");

// ---- textures -----------------------------------------------------------------------
mkdirSync("public/textures", { recursive: true });
// grain: 128×128 tile of soft noise, alpha around 5%
{
  const W = 128, px = Buffer.alloc(W * W * 4);
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i < W * W; i++) {
    const v = rnd() > 0.5 ? 255 : 0;
    px[i * 4] = px[i * 4 + 1] = px[i * 4 + 2] = v;
    px[i * 4 + 3] = [0, 0, 12, 22][Math.floor(rnd() * 4)];
  }
  await sharp(px, { raw: { width: W, height: W, channels: 4 } }).png({ compressionLevel: 9 }).toFile("public/textures/grain.png");
}
// overspray: a soft vertical band with atomised speckle, used on the moving pass front
{
  const W = 240, H = 480, px = Buffer.alloc(W * H * 4);
  let seed = 11;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const t = x / (W - 1); // 0 → 1 across the band, wet edge on the right
    const body = Math.pow(Math.sin(Math.PI * t), 2.2) * 0.22;
    const edge = Math.exp(-Math.pow((t - 0.86) / 0.035, 2)) * 0.55;
    const speck = rnd() < 0.06 * Math.sin(Math.PI * t) ? rnd() * 0.5 : 0;
    const a = Math.min(1, body + edge + speck);
    const i = (y * W + x) * 4;
    px[i] = 255; px[i + 1] = 255; px[i + 2] = 255; px[i + 3] = Math.round(a * 255);
  }
  await sharp(px, { raw: { width: W, height: H, channels: 4 } }).png({ compressionLevel: 9 }).toFile("public/textures/overspray.png");
}

// ---- Open Graph image (1200×630) -----------------------------------------------------
{
  const f = LOGO.boxes.full;
  const scale = 0.84;
  const ogW = 1200, ogH = 630;
  const lw = f.w * scale, lh = f.h * scale;
  const tx = (ogW - lw) / 2 - f.x * scale, ty = (ogH - lh) / 2 - f.y * scale;
  const tan = 0.596; // slash lean
  const passX = 860;
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${ogW}" height="${ogH}" viewBox="0 0 ${ogW} ${ogH}">
<defs>
<radialGradient id="g" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#1A1D22"/><stop offset="1" stop-color="${BOOTH}"/></radialGradient>
<linearGradient id="p" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="0.82" stop-color="#fff" stop-opacity="0.07"/><stop offset="0.9" stop-color="#fff" stop-opacity="0.18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
</defs>
<rect width="100%" height="100%" fill="url(#g)"/>
<polygon points="${passX - 260},0 ${passX},0 ${passX + ogH * tan},${ogH} ${passX - 260 + ogH * tan},${ogH}" fill="url(#p)"/>
<g transform="translate(${tx} ${ty}) scale(${scale})"><path d="${LOGO.r}" fill="${PAPER}"/><path d="${LOGO.slashRed}" fill="${RED}"/><path d="${LOGO.slashDark}" fill="${PAPER}"/><path d="${LOGO.word}" fill="${PAPER}"/><path d="${LOGO.tag}" fill="#8B929C"/></g>
<rect x="0" y="${ogH - 6}" width="${ogW}" height="6" fill="${RED}"/>
</svg>`;
  // JPEG keeps the file small enough for WhatsApp link previews (they skip large images)
  await sharp(Buffer.from(og)).jpeg({ quality: 86, chromaSubsampling: "4:4:4", mozjpeg: true }).toFile("src/app/opengraph-image.jpg");
  writeFileSync("src/app/opengraph-image.alt.txt", "Paint It Right logo: lifetime warranty for your car");
}
console.log("icon.svg, apple-icon.png, opengraph-image.png, textures written");
