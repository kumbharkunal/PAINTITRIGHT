// Lighthouse, mobile then desktop, against a running server (default: local production build).
// Usage: node scripts/perf.mjs [url]   Reports land in qa/lighthouse/ (git-ignored).
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";

const url = process.argv[2] ?? "http://localhost:3100";
mkdirSync("qa/lighthouse", { recursive: true });
const tag = new URL(url).hostname.replace(/\W+/g, "-");
for (const preset of ["mobile", "desktop"]) {
  const out = `qa/lighthouse/${tag}-${preset}.json`;
  const args = ["-y", "lighthouse@13.6.0", url, "--quiet", "--chrome-flags=--headless=new", "--output=json", `--output-path=${out}`, "--only-categories=performance,accessibility,best-practices,seo"];
  if (preset === "desktop") args.push("--preset=desktop");
  spawnSync("npx", args, { stdio: "inherit", shell: true });
  const r = JSON.parse(readFileSync(out, "utf8"));
  const a = r.audits;
  const scores = Object.entries(r.categories).map(([k, v]) => `${k} ${Math.round(v.score * 100)}`).join(" · ");
  console.log(`\n${preset.toUpperCase()}  ${scores}`);
  for (const id of ["first-contentful-paint", "largest-contentful-paint", "total-blocking-time", "cumulative-layout-shift", "speed-index"]) console.log(`  ${id.padEnd(26)} ${a[id].displayValue}`);
}
