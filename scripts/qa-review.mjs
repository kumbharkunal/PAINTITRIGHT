// Visual review pass: the hero after its intro, then every section in its own viewport
// shot, at a desktop and a phone size. Console errors and sideways overflow are reported.
// Usage: node scripts/qa-review.mjs [url] [outDir] [browser=chromium|webkit]
import { mkdir } from "node:fs/promises";
import { chromium, webkit } from "playwright";

const url = process.argv[2] ?? "http://localhost:3100";
const out = process.argv[3] ?? "qa/review";
const engine = (process.argv[4] ?? "chromium") === "webkit" ? webkit : chromium;
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, mobile: false },
  { name: "phone", width: 390, height: 844, mobile: true },
];
const SECTIONS = ["services", "results", "process", "work", "why", "proof", "videos", "faq", "visit"];

await mkdir(out, { recursive: true });
const browser = await engine.launch();
const problems = [];
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.mobile && engine === chromium, hasTouch: vp.mobile });
  const page = await ctx.newPage();
  page.on("console", (m) => m.type() === "error" && problems.push(`[${vp.name}] console: ${m.text()}`));
  page.on("pageerror", (e) => problems.push(`[${vp.name}] pageerror: ${e.message}`));
  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `${out}/${vp.name}-00-hero.png` });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  if (overflow > 0) problems.push(`[${vp.name}] horizontal overflow ${overflow}px`);
  // walk the page so every scroll-triggered reveal plays
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += Math.round(vp.height * 0.7)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(140);
  }
  for (const [i, id] of SECTIONS.entries()) {
    await page.evaluate((s) => {
      const el = document.getElementById(s);
      if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 70);
    }, id);
    await page.waitForTimeout(1100);
    await page.screenshot({ path: `${out}/${vp.name}-${String(i + 1).padStart(2, "0")}-${id}.png` });
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${out}/${vp.name}-99-footer.png` });
  await ctx.close();
}
await browser.close();
console.log(problems.length ? problems.join("\n") : "no console errors, no overflow");
