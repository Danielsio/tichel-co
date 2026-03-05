import { test, expect } from "@playwright/test";

test.describe("Collection page", () => {
  test("shows collection title and description", async ({ page }) => {
    await page.goto("/collections/signature-collection");
    await expect(
      page.getByRole("heading", { name: "הקולקציה החתימתית" }),
    ).toBeVisible();
  });

  test("displays products belonging to the collection", async ({ page }) => {
    await page.goto("/collections/signature-collection");
    const productCards = page.locator("a[href*='/products/']");
    const count = await productCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("product cards show prices in ILS", async ({ page }) => {
    await page.goto("/collections/signature-collection");
    await expect(page.getByText("₪").first()).toBeVisible();
  });

  test("new badge appears on new products", async ({ page }) => {
    await page.goto("/collections/signature-collection");
    await expect(page.getByText("חדש").first()).toBeVisible();
  });

  test("shows sale price on discounted products", async ({ page }) => {
    await page.goto("/collections/everyday-elegance");
    const strikeThroughPrice = page.locator(".line-through");
    await expect(strikeThroughPrice.first()).toBeVisible();
  });

  test("sidebar shows all collections for navigation", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1024, "Sidebar hidden on mobile");
    await page.goto("/collections/signature-collection");
    await expect(page.getByRole("link", { name: "חלומות משי" })).toBeVisible();
    await expect(page.getByRole("link", { name: "אלגנטיות יומיומית" })).toBeVisible();
  });

  test("navigate between collections via sidebar", async ({ page }) => {
    test.skip(page.viewportSize()!.width < 1024, "Sidebar hidden on mobile");
    await page.goto("/collections/signature-collection");
    await page.getByRole("link", { name: "חלומות משי" }).click();
    await expect(page).toHaveURL(/\/collections\/silk-dreams/);
    await expect(page.getByRole("heading", { name: "חלומות משי" })).toBeVisible();
  });

  test("product card links to correct product page", async ({ page }) => {
    await page.goto("/collections/signature-collection");
    const firstProduct = page.locator("a[href*='/products/']").first();
    const href = await firstProduct.getAttribute("href");
    await firstProduct.click();
    await expect(page).toHaveURL(new RegExp(href!));
  });
});
