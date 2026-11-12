// Films the hero intro as a strip of frames (first visit), to check the First Pass timing.
// Usage: node scripts/qa-intro.mjs [url] [outDir] [width] [height]
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://localhost:3100";
const out = process.argv[3] ?? "qa/intro";
const W = Number(process.argv[4] ?? 1440), H = Number(process.argv[5] ?? 900);
await mkdir(out, { recursive: true });
const browser = await chromium.launch();
const page = await (await browser.newContext({ viewport: { width: W, height: H } })).newPage();
const t0 = Date.now();
await page.goto(url, { waitUntil: "commit" });
const stamps = [250, 500, 750, 1000, 1250, 1500, 2000, 3000];
for (const ms of stamps) {
  const wait = ms - (Date.now() - t0);
  if (wait > 0) await page.waitForTimeout(wait);
  const ready = await page.evaluate(() => document.querySelector(".hero")?.hasAttribute("data-ready") ?? false).catch(() => false);
  await page.screenshot({ path: `${out}/${W}-${String(ms).padStart(4, "0")}.png` });
  console.log(ms, "ms ready:", ready, "intro:", await page.evaluate(() => document.documentElement.dataset.intro).catch(() => "?"));
}
await browser.close();
