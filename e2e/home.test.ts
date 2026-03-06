import { test, expect } from "@playwright/test";

test.describe("Home page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("loads in Hebrew with RTL and no /he prefix", async ({ page }) => {
    await expect(page.locator("html")).toHaveAttribute("lang", "he");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
    await expect(page).not.toHaveURL(/\/he/);
  });

  test("displays hero section with brand name and CTAs", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Tichel & Co." })).toBeVisible();
    await expect(page.getByText("גלו את הקולקציה").first()).toBeVisible();
    await expect(page.getByRole("button", { name: "עיצוב אישי" })).toBeVisible();
  });

  test("displays all 5 collections from Firestore", async ({ page }) => {
    const collectionTitles = [
      "הקולקציה החתימתית",
      "חלומות משי",
      "אלגנטיות יומיומית",
      "קולקציית כלות",
      "אביזרים",
    ];
    for (const title of collectionTitles) {
      await expect(page.getByRole("heading", { name: title }).first()).toBeVisible();
    }
  });

  test("displays featured products with prices", async ({ page }) => {
    await expect(page.getByText("הנבחרים שלנו")).toBeVisible();
    const productCards = page.locator("a[href*='/products/']");
    await expect(productCards.first()).toBeVisible();
    await expect(page.getByText("₪").first()).toBeVisible();
  });

  test("collection link navigates to collection page", async ({ page }) => {
    await page.getByRole("link", { name: "הקולקציה החתימתית" }).first().click();
    await expect(page).toHaveURL(/\/collections\/signature-collection/);
  });

  test("featured product link navigates to product page", async ({ page }) => {
    const productLink = page.locator("a[href*='/products/']").first();
    await productLink.click();
    await expect(page).toHaveURL(/\/products\//);
  });
});
