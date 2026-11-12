// Scrubs the pinned Process set piece and captures frames at several points of the pin.
// Usage: node scripts/qa-process.mjs [url] [width] [height]
import { chromium } from "playwright";
const url = process.argv[2] ?? "http://localhost:3100";
const W = Number(process.argv[3] ?? 1440), H = Number(process.argv[4] ?? 900);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: W, height: H }, hasTouch: W < 1024 });
const p = await ctx.newPage();
await p.goto(url, { waitUntil: "networkidle" });
await p.mouse.move(10, 10); // wakes the motion runtime
await p.evaluate(() => window.scrollTo(0, 200));
await p.waitForTimeout(1500);
const start = await p.evaluate(() => {
  const pin = document.querySelector(".process-pin");
  const spacer = pin?.closest(".pin-spacer") ?? pin;
  return spacer.getBoundingClientRect().top + window.scrollY;
});
const dist = await p.evaluate(() => (window.innerWidth >= 1024 ? 4.6 : 3.6) * window.innerHeight);
for (const f of [0.02, 0.2, 0.36, 0.52, 0.68, 0.85, 1]) {
  await p.evaluate((y) => window.scrollTo(0, y), Math.round(start + dist * f));
  await p.waitForTimeout(900);
  await p.screenshot({ path: `qa/process-${W}-${Math.round(f * 100)}.png` });
}
await b.close();
console.log("frames written");
