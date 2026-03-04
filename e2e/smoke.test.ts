import { test, expect } from "@playwright/test";

test("@smoke home page loads in Hebrew (default locale)", async ({ page }) => {
  await page.goto("/he");
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Tichel & Co." }),
  ).toBeVisible();
});

test("@smoke home page loads in English", async ({ page }) => {
  await page.goto("/en");
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("html")).toHaveAttribute("dir", "ltr");
  await expect(
    page.getByRole("banner").getByRole("link", { name: "Tichel & Co." }),
  ).toBeVisible();
});

test("@smoke root redirects to default locale", async ({ browser }) => {
  const context = await browser.newContext({
    locale: "he-IL",
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForURL(/\/he/, { timeout: 10000 });
  await expect(page).toHaveURL(/\/he/);
  await context.close();
});
