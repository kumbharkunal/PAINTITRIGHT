import { expect, type Page } from "@playwright/test";

/** Collects console errors and uncaught exceptions; call the returned check at the end. */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`console: ${m.text()}`);
  });
  page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
  return () => expect(errors, errors.join("\n")).toEqual([]);
}

/** Walks the page top to bottom so every scroll-triggered reveal plays, then returns to top. */
export async function walk(page: Page, stepRatio = 0.7) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = page.viewportSize()?.height ?? 800;
  for (let y = 0; y < h; y += Math.round(vh * stepRatio)) {
    await page.evaluate((v) => window.scrollTo(0, v), y);
    await page.waitForTimeout(90);
  }
}

export async function noSidewaysScroll(page: Page) {
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(over, "horizontal overflow in px").toBeLessThanOrEqual(0);
}
