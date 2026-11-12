import { defineConfig, devices } from "@playwright/test";

// QA runs against the production build: `npm run build` first, then `npm run test:e2e`.
const PORT = Number(process.env.PORT ?? 3200);
const BASE = process.env.BASE_URL ?? `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "tests",
  outputDir: "test-results",
  timeout: 90_000,
  fullyParallel: false,
  workers: 2,
  reporter: [["list"]],
  use: { baseURL: BASE, trace: "off" },
  webServer: process.env.BASE_URL
    ? undefined
    : { command: `npx next start -p ${PORT}`, url: BASE, reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
