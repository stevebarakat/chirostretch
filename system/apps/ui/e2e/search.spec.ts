import { test, expect } from "@playwright/test";

/**
 * Search Sanity Test
 *
 * This is a single, coarse E2E test that catches:
 * - Frontend caching mistakes
 * - Wrong index being queried
 * - Environment variable regressions
 * - Index name changes
 *
 * We deliberately keep this test minimal and focused.
 * Don't test indexing E2E - it's async and flaky.
 */

test.describe("Search", () => {
  test("location search returns results", async ({ page }) => {
    // Go to locations page (default search index is locations)
    await page.goto("/locations");

    // Click on the search input to open the modal
    await page.click('input[type="search"]');

    // Wait for the modal to appear
    const modal = page.locator('[class*="modal"]');
    await expect(modal).toBeVisible();

    // Type a search query in the modal's search box
    // The modal has a focused input with placeholder "Start typing to search..."
    const searchInput = modal.locator('input[type="search"]');
    await searchInput.fill("San");

    // Wait for results to appear (Algolia is fast)
    // Look for result items - they're links with the hit class
    const results = modal.locator('a[class*="hit"]');

    // We should get at least one result
    // This test passes if ANY location matches "San"
    await expect(results.first()).toBeVisible({ timeout: 5000 });

    // Verify we can see a result title
    const hitTitle = modal.locator('[class*="hitTitle"]').first();
    await expect(hitTitle).toBeVisible();
  });

  test("search shows 'no results' for nonsense query", async ({ page }) => {
    await page.goto("/locations");

    // Open search modal
    await page.click('input[type="search"]');
    const modal = page.locator('[class*="modal"]');
    await expect(modal).toBeVisible();

    // Type a query that won't match anything
    const searchInput = modal.locator('input[type="search"]');
    await searchInput.fill("xyznonexistent12345");

    // Should show "No results found" message
    const noResults = modal.locator('text=No results found');
    await expect(noResults).toBeVisible({ timeout: 5000 });
  });

  test("search modal can be closed", async ({ page }) => {
    await page.goto("/locations");

    // Open search modal
    await page.click('input[type="search"]');
    const modal = page.locator('[class*="modal"]');
    await expect(modal).toBeVisible();

    // Close using the X button
    await page.click('button[aria-label="Close search"]');

    // Modal should be hidden
    await expect(modal).not.toBeVisible();
  });
});
