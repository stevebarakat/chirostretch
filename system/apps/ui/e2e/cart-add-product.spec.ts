import { test, expect } from "@playwright/test";

/**
 * Add to Cart E2E Tests
 *
 * Tests the complete add-to-cart flow:
 * - Adding products from shop page
 * - Adding products from product detail page
 * - Cart badge updates
 * - Cart page displays items correctly
 */

test.describe("Add to Cart", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage cart before each test
    await page.addInitScript(() => {
      localStorage.removeItem("chirostretch-cart");
    });
  });

  test("can add product to cart from product page", async ({ page }) => {
    // Navigate to shop page
    await page.goto("/shop");

    // Wait for products to load
    const productLinks = page.locator('a[href^="/shop/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 });

    // Click on first product
    await productLinks.first().click();

    // Wait for product page to load
    await expect(page.locator("h1")).toBeVisible();

    // Find and click "Add to Cart" button
    const addToCartButton = page.getByRole("button", { name: /add to cart/i });

    // Skip if product is out of stock
    const isOutOfStock = await page
      .getByRole("button", { name: /out of stock/i })
      .isVisible()
      .catch(() => false);

    if (isOutOfStock) {
      test.skip();
      return;
    }

    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();

    // Verify toast notification appears
    const toast = page.locator('[role="status"], [class*="toast"]');
    await expect(toast.filter({ hasText: /added.*cart/i })).toBeVisible({
      timeout: 5000,
    });
  });

  test("cart badge updates after adding product", async ({ page }) => {
    // Navigate to product page
    await page.goto("/shop");

    const productLinks = page.locator('a[href^="/shop/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 });
    await productLinks.first().click();

    // Find Add to Cart button
    const addToCartButton = page.getByRole("button", { name: /add to cart/i });

    // Skip if product is out of stock
    const isOutOfStock = await page
      .getByRole("button", { name: /out of stock/i })
      .isVisible()
      .catch(() => false);

    if (isOutOfStock) {
      test.skip();
      return;
    }

    await expect(addToCartButton).toBeVisible();

    // Get initial cart count (might be 0 or hidden)
    const cartBadge = page.locator('[class*="badge"], [data-testid="cart-badge"]');

    // Click Add to Cart
    await addToCartButton.click();

    // Wait for toast confirmation
    await expect(
      page.locator('[role="status"], [class*="toast"]').filter({ hasText: /added/i })
    ).toBeVisible({ timeout: 5000 });

    // Cart badge should show count >= 1
    // The badge might show "1" or a number
    await expect(cartBadge.first()).toBeVisible({ timeout: 3000 });
  });

  test("can change quantity before adding to cart", async ({ page }) => {
    await page.goto("/shop");

    const productLinks = page.locator('a[href^="/shop/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 });
    await productLinks.first().click();

    // Find quantity input
    const quantityInput = page.locator('input[type="number"]#quantity');
    const addToCartButton = page.getByRole("button", { name: /add to cart/i });

    // Skip if product is out of stock
    const isOutOfStock = await page
      .getByRole("button", { name: /out of stock/i })
      .isVisible()
      .catch(() => false);

    if (isOutOfStock) {
      test.skip();
      return;
    }

    await expect(quantityInput).toBeVisible();

    // Change quantity to 3
    await quantityInput.fill("3");

    // Add to cart
    await addToCartButton.click();

    // Verify toast
    await expect(
      page.locator('[role="status"], [class*="toast"]').filter({ hasText: /added/i })
    ).toBeVisible({ timeout: 5000 });
  });

  test("can navigate to cart page after adding product", async ({ page }) => {
    await page.goto("/shop");

    const productLinks = page.locator('a[href^="/shop/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 });
    await productLinks.first().click();

    const addToCartButton = page.getByRole("button", { name: /add to cart/i });

    // Skip if product is out of stock
    const isOutOfStock = await page
      .getByRole("button", { name: /out of stock/i })
      .isVisible()
      .catch(() => false);

    if (isOutOfStock) {
      test.skip();
      return;
    }

    await addToCartButton.click();

    // Wait for toast
    await expect(
      page.locator('[role="status"], [class*="toast"]').filter({ hasText: /added/i })
    ).toBeVisible({ timeout: 5000 });

    // Click "View Cart" button
    const viewCartLink = page.getByRole("link", { name: /view cart/i });
    await expect(viewCartLink).toBeVisible();
    await viewCartLink.click();

    // Should be on cart page
    await expect(page).toHaveURL(/\/cart/);

    // Cart should have at least one item
    await expect(page.locator('[class*="cart"]')).toBeVisible();
  });

  test("cart persists across page navigation", async ({ page }) => {
    // Add a product to cart
    await page.goto("/shop");

    const productLinks = page.locator('a[href^="/shop/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 });
    await productLinks.first().click();

    const addToCartButton = page.getByRole("button", { name: /add to cart/i });

    // Skip if product is out of stock
    const isOutOfStock = await page
      .getByRole("button", { name: /out of stock/i })
      .isVisible()
      .catch(() => false);

    if (isOutOfStock) {
      test.skip();
      return;
    }

    await addToCartButton.click();

    // Wait for cart update
    await expect(
      page.locator('[role="status"], [class*="toast"]').filter({ hasText: /added/i })
    ).toBeVisible({ timeout: 5000 });

    // Navigate away
    await page.goto("/shop");
    await expect(page.locator("h1")).toBeVisible();

    // Navigate to cart
    await page.goto("/cart");

    // Cart should still have items
    // Look for any cart item indicator
    const cartContent = page.locator("main, [class*='cart']");
    await expect(cartContent).toBeVisible();

    // Should not see "empty cart" message if we added something
    // This is a soft check - the exact wording might vary
    const emptyMessage = page.getByText(/cart is empty|no items/i);
    const isEmpty = await emptyMessage.isVisible().catch(() => false);

    // If cart is empty, the test should fail as we just added an item
    expect(isEmpty).toBe(false);
  });

  test("displays product price on product page", async ({ page }) => {
    await page.goto("/shop");

    const productLinks = page.locator('a[href^="/shop/"]');
    await expect(productLinks.first()).toBeVisible({ timeout: 10000 });
    await productLinks.first().click();

    // Product page should show price (formatted as currency)
    // Look for $ sign which indicates USD price
    const priceElement = page.locator('[class*="price"]');
    await expect(priceElement.first()).toBeVisible();

    const priceText = await priceElement.first().textContent();
    expect(priceText).toMatch(/\$[\d,.]+/);
  });
});
