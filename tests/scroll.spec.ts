import { expect, test, type Page, type CDPSession } from "@playwright/test";

// Regression: the page must keep scrolling when a swipe or wheel starts over a rail,
// and the rails must still swipe sideways.

async function swipe(page: Page, cdp: CDPSession, x: number, y: number, dx: number, dy: number) {
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
  for (let i = 1; i <= 12; i++) {
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + (dx * i) / 12, y: y + (dy * i) / 12 }] });
    await page.waitForTimeout(16);
  }
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await page.waitForTimeout(700);
}

test("phone: swipes that start on a rail scroll the page, and the rail still swipes sideways", async ({ browser, browserName }) => {
  test.skip(browserName !== "chromium", "touch input is dispatched through Chromium's CDP");
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  for (const id of ["work", "videos"]) {
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    const cdp = await ctx.newCDPSession(page);
    const rail = page.locator(`#${id} .rail`);
    // Sections stream in as Suspense boundaries; React reveals them on the first frame.
    await rail.waitFor({ state: "visible" });
    await rail.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(500);
    const box = (await rail.boundingBox())!;
    const y = Math.round(Math.min(box.y + box.height / 2, 760));

    const before = await page.evaluate(() => window.scrollY);
    await swipe(page, cdp, 195, y, 0, -300);
    expect((await page.evaluate(() => window.scrollY)) - before, `page scrolls when the swipe starts on #${id}`).toBeGreaterThan(150);

    await page.waitForTimeout(800); // let any momentum settle
    await rail.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await page.waitForTimeout(800);
    const b2 = await rail.boundingBox();
    if (!b2) throw new Error(`#${id} rail has no box`);
    const left = await rail.evaluate((el) => el.scrollLeft);
    await swipe(page, cdp, 320, Math.round(b2.y + b2.height / 2), -220, 0);
    expect(await rail.evaluate((el) => el.scrollLeft), `#${id} rail still scrolls sideways`).toBeGreaterThan(left + 60);
    await page.close();
  }
  await ctx.close();
});

test("desktop: the mouse wheel over the videos row scrolls the page, all six Shorts visible", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/", { waitUntil: "networkidle" });
  const grid = page.locator("#videos ul");
  await grid.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  const box = (await grid.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + 80); // also wakes the motion runtime (Lenis)
  await page.waitForTimeout(800);
  const before = await page.evaluate(() => window.scrollY);
  for (let i = 0; i < 4; i++) {
    await page.mouse.wheel(0, 160);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1200);
  expect((await page.evaluate(() => window.scrollY)) - before).toBeGreaterThan(300);
  const visible = await page.locator("#videos li figure").evaluateAll(
    (els) => els.filter((e) => { const r = e.getBoundingClientRect(); return r.right <= window.innerWidth + 1 && r.left >= -1; }).length,
  );
  expect(visible).toBe(6);
});
