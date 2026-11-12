// First paint, LCP element and resource timing for one load (unthrottled sanity check;
// Lighthouse does the throttled measurement).
// Usage: node scripts/qa-paint.mjs [url] [width] [height]
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3100";
const W = Number(process.argv[3] ?? 1440), H = Number(process.argv[4] ?? 900);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: W, height: H }, isMobile: W < 768, hasTouch: W < 768 });
const p = await ctx.newPage();
await p.addInitScript(() => {
  window.__lcp = [];
  new PerformanceObserver((l) =>
    l.getEntries().forEach((e) => window.__lcp.push({ t: Math.round(e.startTime), el: `${e.element?.tagName}.${String(e.element?.className || "").slice(0, 30)}`, size: e.size })),
  ).observe({ type: "largest-contentful-paint", buffered: true });
});
await p.goto(url, { waitUntil: "load" });
await p.waitForTimeout(3000);
const data = await p.evaluate(() => {
  const nav = performance.getEntriesByType("navigation")[0];
  return {
    paint: performance.getEntriesByType("paint").map((e) => `${e.name}: ${Math.round(e.startTime)}ms`),
    lcp: window.__lcp,
    nav: { responseEnd: Math.round(nav.responseEnd), dcl: Math.round(nav.domContentLoadedEventEnd), load: Math.round(nav.loadEventEnd) },
    resources: performance
      .getEntriesByType("resource")
      .filter((r) => /\.(woff2|css)/.test(r.name) || r.name.includes("_next/image") || r.name.includes("/_next/static/chunks"))
      .map((r) => `${decodeURIComponent(r.name.split("/").pop()).slice(0, 70)}  ${Math.round(r.startTime)}→${Math.round(r.responseEnd)}ms  ${r.transferSize}B`),
  };
});
console.log(JSON.stringify(data, null, 1));
await b.close();
