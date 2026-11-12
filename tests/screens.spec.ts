import { test } from "@playwright/test";
import { noSidewaysScroll, walk, watchErrors } from "./helpers";

// The screenshot matrix: hero + full page at seven sizes, in Chromium and WebKit.
// Note: Playwright's WebKit build on Windows does not render variable-font axes (it draws
// the default master), so WebKit shots are for layout and behaviour, not typography.
const SIZES: [number, number][] = [
  [360, 800],
  [390, 844],
  [430, 932],
  [768, 1024],
  [1280, 800],
  [1440, 900],
  [1920, 1080],
];

for (const [w, h] of SIZES) {
  test(`screens ${w}x${h}`, async ({ browser, browserName }) => {
    const touch = w < 1024;
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, hasTouch: touch, isMobile: touch && browserName === "chromium" });
    const page = await ctx.newPage();
    const check = watchErrors(page);
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2200);
    await page.screenshot({ path: `qa/screens/${browserName}/${w}x${h}-hero.png` });
    await noSidewaysScroll(page);
    await walk(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    // engines cap screenshots at 32767px; long pages fall back to a clipped capture
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({ path: `qa/screens/${browserName}/${w}x${h}-full.png`, fullPage: height < 32000, clip: height < 32000 ? undefined : { x: 0, y: 0, width: w, height: Math.min(height, 16000) } });
    await noSidewaysScroll(page);
    check();
    await ctx.close();
  });
}
