import { test, expect } from "@playwright/test";

test("@smoke home page loads in Hebrew (default locale)", async ({ page }) => {
  await page.goto("/he");
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.locator("text=Tichel & Co.")).toBeVisible();
});

test("@smoke home page loads in English", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(page.locator("text=Tichel & Co.")).toBeVisible();
});

test("@smoke root redirects to default locale", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/he/);
});
