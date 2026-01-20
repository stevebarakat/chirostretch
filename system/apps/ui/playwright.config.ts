import { defineConfig, devices } from "@playwright/test";

/**
 * E2E tests require the dev server to be running manually:
 *   pnpm run dev
 *
 * Then run tests:
 *   pnpm run test:e2e
 *
 * The dev server uses a custom hostname (chirostretch-copy.local) with HTTPS,
 * so we don't auto-start it from Playwright.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL:
      process.env.PLAYWRIGHT_BASE_URL ||
      "https://chirostretch-copy.local:3000",
    ignoreHTTPSErrors: true,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  // No webServer config - start `pnpm run dev` manually before running tests
});
