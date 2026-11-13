import { expect, test } from "@playwright/test";
import { watchErrors } from "./helpers";

test.use({ viewport: { width: 390, height: 844 }, hasTouch: true });

test("mobile menu survives 20 rapid open/close taps", async ({ page }) => {
  const check = watchErrors(page);
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500); // runtime (Lenis) loaded
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForTimeout(400);
  const before = await page.evaluate(() => ({ y: window.scrollY, top: document.querySelector("main")!.getBoundingClientRect().top }));
  const btn = page.locator(".menu-btn");
  for (let i = 0; i < 20; i++) {
    await btn.click({ delay: 0 });
    await page.waitForTimeout(i % 3 === 0 ? 30 : 90); // mixes mid-animation and settled taps
  }
  // 20 taps = even count: menu must end closed
  await page.waitForTimeout(900);
  await expect(btn).toHaveAttribute("aria-expanded", "false");
  const after = await page.evaluate(() => ({
    y: window.scrollY,
    top: document.querySelector("main")!.getBoundingClientRect().top,
    locked: document.documentElement.classList.contains("is-locked"),
    menu: document.documentElement.dataset.menu ?? null,
    inert: (document.querySelector("main") as HTMLElement).inert,
    sheetVisible: getComputedStyle(document.getElementById("site-menu")!).visibility,
  }));
  expect(after.y).toBe(before.y);
  expect(after.top).toBe(before.top);
  expect(after.locked).toBe(false);
  expect(after.menu).toBeNull();
  expect(after.inert).toBe(false);
  expect(after.sheetVisible).toBe("hidden");
  check();
});

test("menu still opens after its lazy chunks fail to download (patchy network)", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "network fault injection once is enough");
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message)); // unhandled rejections land here
  await page.goto("/", { waitUntil: "networkidle" });
  let offline = true;
  // Every chunk requested from here on fails, including Turbopack's own retry.
  await page.route(/\/_next\/static\/.+\.js(\?|$)/, (route) => (offline ? route.abort("internetdisconnected") : route.continue()));
  const btn = page.locator(".menu-btn");
  await btn.click();
  await page.waitForTimeout(1000);
  await expect(btn).toHaveAttribute("aria-expanded", "false");
  offline = false;
  await btn.click(); // the next tap downloads again
  await expect(btn).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("#site-menu")).toBeVisible();
  await btn.click();
  await expect(btn).toHaveAttribute("aria-expanded", "false");
  // the motion runtime (GSAP + Lenis) failed too; it retries on a later interaction
  await page.waitForTimeout(3300);
  await page.mouse.wheel(0, 200);
  await expect(page.locator("html")).toHaveClass(/\blenis\b/);
  expect(errors).toEqual([]);
});

test("menu: link tap closes first, then scrolls to the section", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  await page.locator(".menu-btn").click();
  await page.waitForTimeout(500);
  await page.locator("#site-menu a", { hasText: "FAQ" }).click();
  await page.waitForTimeout(1800);
  await expect(page.locator(".menu-btn")).toHaveAttribute("aria-expanded", "false");
  const top = await page.evaluate(() => document.getElementById("faq")!.getBoundingClientRect().top);
  expect(Math.abs(top - 80)).toBeLessThan(40);
});

test("menu: backdrop tap and swipe up both close it", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  const btn = page.locator(".menu-btn");
  await btn.click();
  await page.waitForTimeout(600);
  await page.mouse.click(200, 830); // below the sheet: the backdrop
  await page.waitForTimeout(600);
  await expect(btn).toHaveAttribute("aria-expanded", "false");

  await btn.click();
  await page.waitForTimeout(700);
  const box = await page.locator("#site-menu").boundingBox();
  if (!box) throw new Error("sheet not found");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height - 40);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height - 220, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(700);
  await expect(btn).toHaveAttribute("aria-expanded", "false");
});
