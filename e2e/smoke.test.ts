import { test, expect } from "@playwright/test";

test("@smoke home page loads in Hebrew (default locale, no prefix)", async ({
  page,
}) => {
  await page.goto("/");
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

test("@smoke root serves Hebrew without redirect", async ({ browser }) => {
  const context = await browser.newContext({ locale: "he-IL" });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "he");
  await expect(page).not.toHaveURL(/\/he/);
  await context.close();
});
