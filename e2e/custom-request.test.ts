import { test, expect } from "@playwright/test";

test.describe("Custom request form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/custom");
  });

  test("shows login prompt for unauthenticated users", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "בקשת עיצוב מותאם" })).toBeVisible();
    await expect(page.getByText("יש להתחבר כדי לשלוח בקשת עיצוב מותאם")).toBeVisible();
    await expect(page.getByRole("link", { name: "התחבר" })).toBeVisible();
  });

  test("login link navigates to login page", async ({ page }) => {
    await page.getByRole("link", { name: "התחבר" }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
