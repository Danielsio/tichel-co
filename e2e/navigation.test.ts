import { test, expect } from "@playwright/test";

test.describe("Navigation & Layout", () => {
  test("header shows logo and navigation", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByRole("banner").getByRole("link", { name: "Tichel & Co." }),
    ).toBeVisible();
    const nav = page.getByRole("navigation", { name: "ניווט ראשי" });
    await expect(nav.or(page.getByRole("button", { name: "פתח תפריט" }))).toBeVisible();
  });

  test("mobile menu opens and shows navigation links", async ({ page }) => {
    test.skip(page.viewportSize()!.width > 768, "Mobile menu only on small screens");
    await page.goto("/");
    await page.getByRole("button", { name: "פתח תפריט" }).click();
    const drawer = page.getByRole("dialog", { name: "תפריט" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "קולקציות" })).toBeVisible();
  });

  test("footer renders with shop and info sections", async ({ page }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByText("חנות")).toBeVisible();
    await expect(footer.getByText("מידע")).toBeVisible();
  });

  test("404 page for nonexistent product", async ({ page }) => {
    await page.goto("/products/does-not-exist-at-all");
    await expect(page.getByText("404")).toBeVisible();
  });

  test("about page loads with content", async ({ page }) => {
    await page.goto("/about");
    await expect(
      page.getByRole("heading", { name: "אופנה שמכבדת את מי שאת" }),
    ).toBeVisible();
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.getByRole("heading", { name: "תנאי שימוש" })).toBeVisible();
  });

  test("returns page loads", async ({ page }) => {
    await page.goto("/returns");
    await expect(page.getByRole("heading", { name: "משלוחים והחזרות" })).toBeVisible();
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { name: "מדיניות פרטיות" })).toBeVisible();
  });

  test("care guide page loads", async ({ page }) => {
    await page.goto("/care-guide");
    await expect(page.getByRole("heading", { name: "מדריך טיפוח" })).toBeVisible();
  });

  test("English locale loads with /en prefix", async ({ browser }) => {
    const context = await browser.newContext({ locale: "en-US" });
    const page = await context.newPage();
    await page.goto("/en");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
    await context.close();
  });
});
