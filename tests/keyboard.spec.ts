import { expect, test } from "@playwright/test";

test.describe("keyboard only", () => {
  // Safari (and Playwright's WebKit) only Tab to links when the user enables it in settings
  test("desktop: skip link first, visible focus on nav links", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "Safari does not Tab to links by default");
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.keyboard.press("Tab");
    await expect(page.locator(".skip-link")).toBeFocused();
    await page.keyboard.press("Tab"); // logo link
    await page.keyboard.press("Tab"); // first nav link
    const focused = page.locator(":focus");
    await expect(focused).toHaveText(/Services/);
    const outline = await focused.evaluate((el) => getComputedStyle(el).outlineStyle);
    expect(outline).not.toBe("none");
  });

  test("mobile menu: opens from keyboard, traps focus, Escape returns focus", async ({ page, browserName }) => {
    test.skip(browserName === "webkit", "Safari does not Tab to links by default");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    await page.locator(".menu-btn").focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);
    await expect(page.locator("#site-menu a").first()).toBeFocused();
    // tab through everything in the sheet and wrap back to the menu button
    const count = await page.locator("#site-menu a").count();
    for (let i = 0; i < count; i++) await page.keyboard.press("Tab");
    await expect(page.locator(".menu-btn")).toBeFocused();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    await expect(page.locator(".menu-btn")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(".menu-btn")).toBeFocused();
  });

  test("before/after slider moves with arrows, Home and End", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    const handle = page.getByRole("slider", { name: "Before and after comparison" });
    await handle.scrollIntoViewIfNeeded();
    await handle.focus();
    await page.keyboard.press("Home");
    await expect(handle).toHaveAttribute("aria-valuenow", "0");
    await page.keyboard.press("ArrowRight");
    await expect(handle).toHaveAttribute("aria-valuenow", "5");
    await page.keyboard.press("End");
    await expect(handle).toHaveAttribute("aria-valuenow", "100");
  });

  test("FAQ toggles with Enter and Space", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/", { waitUntil: "networkidle" });
    const q = page.locator("#faq .faq-q").nth(1);
    await q.scrollIntoViewIfNeeded();
    await q.focus();
    await expect(q).toHaveAttribute("aria-expanded", "false");
    await page.keyboard.press("Enter");
    await expect(q).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Space");
    await expect(q).toHaveAttribute("aria-expanded", "false");
  });
});
