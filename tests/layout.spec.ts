import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { noSidewaysScroll, walk } from "./helpers";

test("320px: no sideways scroll anywhere", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/", { waitUntil: "networkidle" });
  await walk(page);
  await noSidewaysScroll(page);
});

test("phone: every visible control is at least 44px tall and wide", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("a[href], button, [role='slider']")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        if (r.width === 0 || r.height === 0 || cs.visibility === "hidden" || el.closest("[inert], #site-menu, .skip-link")) return false;
        return r.height < 44 || r.width < 44;
      })
      .map((el) => `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 40)}" ${Math.round(el.getBoundingClientRect().width)}x${Math.round(el.getBoundingClientRect().height)}`),
  );
  expect(small, small.join("\n")).toEqual([]);
});

test("offer strip shows before its end date and hides after it", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.clock.setFixedTime(new Date("2026-11-20T12:00:00+05:30"));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const offer = page.locator("aside.offer");
  if ((await offer.count()) === 0) test.skip(true, "offer already expired on the server");
  await expect(offer).toBeVisible();
  await page.clock.setFixedTime(new Date("2026-12-01T00:00:00+05:30"));
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator("aside.offer")).toBeHidden();
});

test("every WhatsApp link goes to the one number with a message; calls use the two numbers", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const links = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>("a[href]")].map((a) => a.href));
  const wa = links.filter((h) => h.includes("wa.me"));
  expect(wa.length).toBeGreaterThan(5);
  for (const h of wa) {
    const u = new URL(h);
    expect(u.pathname).toBe("/918448448030");
    expect(u.searchParams.get("text")?.length ?? 0).toBeGreaterThan(10);
    expect(u.searchParams.get("text")).not.toMatch(/[–—]/);
  }
  const tel = [...new Set(links.filter((h) => h.startsWith("tel:")))];
  expect(tel.sort()).toEqual(["tel:+919810178185", "tel:+919871333206"]);
  const external = await page.evaluate(() => [...document.querySelectorAll<HTMLAnchorElement>("a[target=_blank]")].filter((a) => !a.rel.includes("noopener")).length);
  expect(external).toBe(0);
});

test("axe: no serious or critical accessibility violations", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "axe once is enough");
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/", { waitUntil: "networkidle" });
  await walk(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();
  const bad = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
  expect(bad.map((v) => `${v.id}: ${v.help} (${v.nodes.length})\n  ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join("\n  ")}`).join("\n")).toBe("");
});
