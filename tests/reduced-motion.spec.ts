import { expect, test } from "@playwright/test";
import { walk, watchErrors } from "./helpers";

test.use({ reducedMotion: "reduce" });

for (const size of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
  test(`reduced motion ${size.width}: no intro, no smoothing, no pin, all content visible`, async ({ page, browserName }) => {
    await page.setViewportSize(size);
    const check = watchErrors(page);
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(2500);
    const state = await page.evaluate(() => ({
      intro: document.documentElement.dataset.intro ?? null,
      lenis: document.documentElement.classList.contains("lenis"),
      pinned: document.querySelector('[data-scene="process"]')?.getAttribute("data-pinned") ?? null,
    }));
    expect(state).toEqual({ intro: null, lenis: false, pinned: null });
    await walk(page);
    await page.waitForTimeout(800);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll("[data-reveal]")].filter((el) => Number(getComputedStyle(el).opacity) < 0.99).length,
    );
    expect(hidden).toBe(0);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: `qa/screens/${browserName}/reduced-${size.width}.png`, fullPage: true });
    check();
  });
}
