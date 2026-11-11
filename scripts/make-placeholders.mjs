// Writes a tasteful, brand-tinted placeholder for every image slot that has no file yet,
// at its final path and exact pixel size, so the site looks finished before any real image
// exists. Drop the real file at the same path and rebuild; nothing else changes.
//   hero   : a red paint panel catching the studio's LED-slat reflections
//   after  : mirror-gloss panel with crisp, straight slat reflections
//   before : the same panel dulled, with swirl marks and specks (keeps the slider honest)
//   studio : dark studio light, slats + floor reflection, a faint slash at the logo's angle
// Usage: node scripts/make-placeholders.mjs [--force]
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { SLOTS } from "./image-slots.mjs";

const force = process.argv.includes("--force");
const TAN = 0.596; // slash lean (DESIGN.md)

function rng(seed) {
  let s = seed % 2147483647 || 1;
  return () => ((s = (s * 16807) % 2147483647) / 2147483647);
}

function slats(w, h, y0, y1, count, warm = true) {
  // horizontal LED slats receding toward y1 (perspective: thinner, closer together)
  let out = "";
  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const y = y0 + (y1 - y0) * Math.pow(t, 1.7);
    const th = Math.max(2, (h / 70) * (1 - t * 0.8));
    const inset = w * 0.06 * t;
    out += `<rect x="${inset}" y="${y}" width="${w - inset * 2}" height="${th}" fill="${warm ? "#FFF3E2" : "#F4F6F8"}" opacity="${0.75 - t * 0.45}"/>`;
  }
  return out;
}

function studio(w, h, seed) {
  const r = rng(seed * 97 + 13);
  const tilt = r() * 0.2 - 0.1;
  const slashX = w * (0.55 + r() * 0.3);
  return `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0D0F12"/><stop offset="0.55" stop-color="#08090B"/><stop offset="1" stop-color="#121418"/></linearGradient>
    <radialGradient id="floor" cx="${0.5 + tilt}" cy="1" r="0.75"><stop offset="0" stop-color="#2A2E35" stop-opacity="0.9"/><stop offset="1" stop-color="#08090B" stop-opacity="0"/></radialGradient>
    <radialGradient id="red" cx="${0.7 + tilt}" cy="0.78" r="0.45"><stop offset="0" stop-color="#EC0609" stop-opacity="0.22"/><stop offset="1" stop-color="#EC0609" stop-opacity="0"/></radialGradient>
    <filter id="b1" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="${Math.max(w, h) / 260}"/></filter>
    <filter id="b2" x="-10%" y="-50%" width="120%" height="200%"><feGaussianBlur stdDeviation="${Math.max(w, h) / 90}"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <g filter="url(#b1)">${slats(w, h, h * 0.04, h * 0.36, 7)}</g>
  <rect x="0" y="${h * 0.62}" width="${w}" height="${h * 0.38}" fill="url(#floor)"/>
  <g filter="url(#b2)" transform="translate(0 ${h * 1.36}) scale(1 -0.55)" opacity="0.35">${slats(w, h, h * 0.04, h * 0.36, 7)}</g>
  <rect width="${w}" height="${h}" fill="url(#red)"/>
  <g opacity="0.07" fill="#EDEBE7"><polygon points="${slashX},0 ${slashX + w * 0.035},0 ${slashX + w * 0.035 + h * TAN},${h} ${slashX + h * TAN},${h}"/></g>`;
}

function heroPanel(w, h) {
  // a red body panel, shoulder line curving across, with the slats reflected along it
  const shoulder = (k) => `M${-w * 0.1} ${h * k} C ${w * 0.3} ${h * (k - 0.09)}, ${w * 0.7} ${h * (k - 0.13)}, ${w * 1.1} ${h * (k - 0.06)}`;
  const top = h > w ? 0.5 : 0.46;
  return `${studio(w, h, 3)}
  <defs>
    <linearGradient id="paint" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F01A1D"/><stop offset="0.35" stop-color="#B80507"/><stop offset="0.75" stop-color="#5E0203"/><stop offset="1" stop-color="#1A0101"/></linearGradient>
    <clipPath id="panel"><path d="${shoulder(top)} L ${w * 1.1} ${h} L ${-w * 0.1} ${h} Z"/></clipPath>
    <filter id="soft"><feGaussianBlur stdDeviation="${Math.max(w, h) / 500}"/></filter>
  </defs>
  <path d="${shoulder(top)} L ${w * 1.1} ${h} L ${-w * 0.1} ${h} Z" fill="url(#paint)"/>
  <g clip-path="url(#panel)" filter="url(#soft)" fill="none" stroke-linecap="round">
    <path d="${shoulder(top + 0.035)}" stroke="#FFF6EC" stroke-width="${h * 0.012}" opacity="0.9"/>
    <path d="${shoulder(top + 0.075)}" stroke="#FFF6EC" stroke-width="${h * 0.006}" opacity="0.55"/>
    <path d="${shoulder(top + 0.105)}" stroke="#FFF6EC" stroke-width="${h * 0.004}" opacity="0.4"/>
    <path d="${shoulder(top + 0.3)}" stroke="#000" stroke-width="${h * 0.004}" opacity="0.65"/>
  </g>
  <path d="${shoulder(top)}" fill="none" stroke="#FFB3B4" stroke-width="${h * 0.003}" opacity="0.6"/>`;
}

function panel(w, h, dull) {
  const r = rng(dull ? 5 : 4);
  let swirls = "";
  if (dull) {
    // holograms and swirl marks: thin concentric arcs around a few buffer centres
    for (let c = 0; c < 6; c++) {
      const cx = w * (0.15 + r() * 0.7), cy = h * (0.2 + r() * 0.6);
      for (let k = 0; k < 26; k++) {
        const rad = w * (0.02 + k * 0.012 + r() * 0.01);
        const a0 = r() * Math.PI * 2, a1 = a0 + 0.6 + r() * 1.4;
        const p = (a) => `${cx + rad * Math.cos(a)} ${cy + rad * Math.sin(a)}`;
        swirls += `<path d="M${p(a0)} A ${rad} ${rad} 0 0 1 ${p(a1)}" stroke="#E8ECF2" stroke-width="${0.8 + r() * 0.8}" fill="none" opacity="${0.05 + r() * 0.12}"/>`;
      }
    }
    for (let i = 0; i < 240; i++) swirls += `<circle cx="${r() * w}" cy="${r() * h}" r="${0.6 + r() * 1.8}" fill="#D9DDE3" opacity="${0.15 + r() * 0.35}"/>`;
    for (let i = 0; i < 9; i++) { const x = r() * w, y = r() * h, l = w * (0.05 + r() * 0.12), a = r() * Math.PI; swirls += `<line x1="${x}" y1="${y}" x2="${x + l * Math.cos(a)}" y2="${y + l * Math.sin(a)}" stroke="#F2F4F7" stroke-width="1.2" opacity="0.35"/>`; }
  }
  return `
  <defs>
    <linearGradient id="pp" x1="0" y1="0" x2="0.2" y2="1"><stop offset="0" stop-color="${dull ? "#2B2F35" : "#14171B"}"/><stop offset="1" stop-color="${dull ? "#1C1F24" : "#050607"}"/></linearGradient>
    <filter id="refl"><feGaussianBlur stdDeviation="${dull ? w / 70 : w / 900}"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#pp)"/>
  <g filter="url(#refl)" opacity="${dull ? 0.45 : 0.95}">
    <rect x="${-w * 0.05}" y="${h * 0.26}" width="${w * 1.1}" height="${h * 0.035}" fill="#FFF4E6" transform="rotate(-4 ${w / 2} ${h / 2})"/>
    <rect x="${-w * 0.05}" y="${h * 0.39}" width="${w * 1.1}" height="${h * 0.018}" fill="#FFF4E6" opacity="0.8" transform="rotate(-4 ${w / 2} ${h / 2})"/>
    <rect x="${-w * 0.05}" y="${h * 0.49}" width="${w * 1.1}" height="${h * 0.01}" fill="#FFF4E6" opacity="0.6" transform="rotate(-4 ${w / 2} ${h / 2})"/>
  </g>
  <rect x="0" y="${h * 0.7}" width="${w}" height="${h * 0.3}" fill="#EC0609" opacity="${dull ? 0.05 : 0.1}"/>
  ${swirls}`;
}

const kinds = { hero: heroPanel, studio, after: (w, h) => panel(w, h, false), before: (w, h) => panel(w, h, true) };

let made = 0;
for (const s of SLOTS) {
  if (existsSync(s.path) && !force) continue;
  mkdirSync(path.dirname(s.path), { recursive: true });
  const body = s.kind === "studio" ? studio(s.w, s.h, s.seed ?? 1) : kinds[s.kind](s.w, s.h);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${s.w}" height="${s.h}" viewBox="0 0 ${s.w} ${s.h}">${body}</svg>`;
  let img = sharp(Buffer.from(svg));
  img = s.path.endsWith(".jpg") ? img.jpeg({ quality: 82, mozjpeg: true }) : img.png({ compressionLevel: 9, palette: false });
  await img.toFile(s.path);
  made++;
  console.log("placeholder", s.path, `${s.w}×${s.h}`);
}
console.log(made ? `${made} placeholder(s) written` : "all slots already have files");
