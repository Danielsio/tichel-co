import { test, expect } from "@playwright/test";

test.describe("Product detail page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/products/ivory-silk-square-tichel");
  });

  test("shows product title", async ({ page }) => {
    await expect(
      page.getByRole("heading", { name: "טישל משי מרובע — שנהב" }),
    ).toBeVisible();
  });

  test("shows product description", async ({ page }) => {
    await expect(page.getByText("טישל מרובע ממשי טהור בגוון שנהב")).toBeVisible();
  });

  test("shows product price in ILS", async ({ page }) => {
    await expect(page.getByText(/289/)).toBeVisible();
  });

  test("shows stock status", async ({ page }) => {
    await expect(page.getByText("במלאי")).toBeVisible();
  });

  test("shows color variants", async ({ page }) => {
    await expect(page.getByRole("button", { name: "שנהב" })).toBeVisible();
    await expect(page.getByRole("button", { name: "ורוד עתיק" })).toBeVisible();
  });

  test("clicking a color variant updates the selection", async ({ page }) => {
    await page.getByRole("button", { name: "ורוד עתיק" }).click();
    const selectedButton = page.getByRole("button", { name: "ורוד עתיק" });
    await expect(selectedButton).toHaveAttribute("aria-pressed", "true");
  });

  test("shows fabric information", async ({ page }) => {
    await expect(page.getByText("משי").first()).toBeVisible();
  });

  test("add to cart button works", async ({ page }) => {
    await page.getByRole("button", { name: "הוסיפי לסל" }).click();
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("טישל משי מרובע — שנהב")).toBeVisible();
  });

  test("shows related products section", async ({ page }) => {
    await expect(page.getByText("השלימי את המראה")).toBeVisible();
  });

  test("image gallery shows main image", async ({ page }) => {
    const mainImage = page.getByRole("img").first();
    await expect(mainImage).toBeVisible();
  });

  test("image gallery has clickable thumbnails", async ({ page }) => {
    await page.goto("/products/navy-velvet-pre-tied");
    const thumbnails = page.getByRole("tab");
    await expect(thumbnails.first()).toBeVisible({ timeout: 5000 });
    const count = await thumbnails.count();
    expect(count).toBeGreaterThanOrEqual(2);
    await thumbnails.nth(1).click();
    await expect(thumbnails.nth(1)).toHaveAttribute("aria-selected", "true");
  });

  test("breadcrumb navigation is present", async ({ page }) => {
    const breadcrumb = page.getByRole("navigation", { name: "ניווט פירורי לחם" });
    await expect(breadcrumb).toBeVisible();
  });

  test("out-of-stock variant shows disabled button", async ({ page }) => {
    await page.goto("/products/silk-chiffon-wrap-dusty-pink");
    await page.getByRole("button", { name: "לבנדר" }).click();
    await expect(page.getByRole("button", { name: "אזל מהמלאי" })).toBeDisabled();
  });

  test("product with sale price shows original price struck through", async ({
    page,
  }) => {
    await page.goto("/products/cashmere-wrap-stone");
    await expect(page.locator(".line-through")).toBeVisible();
    await expect(page.getByText(/459/)).toBeVisible();
    await expect(page.getByText(/529/)).toBeVisible();
  });
});
