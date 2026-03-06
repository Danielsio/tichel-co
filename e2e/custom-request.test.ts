import { test, expect } from "@playwright/test";

test.describe("Custom request form", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/custom");
  });

  test("form renders with all fields", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "בקשת עיצוב מותאם" })).toBeVisible();
    await expect(page.getByLabel("שם מלא")).toBeVisible();
    await expect(page.getByLabel("כתובת אימייל")).toBeVisible();
    await expect(page.getByLabel("סוג כיסוי ראש")).toBeVisible();
    await expect(page.getByLabel("תארי את החזון שלך")).toBeVisible();
    await expect(page.getByLabel("טווח תקציב")).toBeVisible();
    await expect(page.getByRole("button", { name: "שלחי בקשה" })).toBeVisible();
  });

  test("form validation prevents empty submission", async ({ page }) => {
    await page.getByRole("button", { name: "שלחי בקשה" }).click();
    await expect(page.getByLabel("שם מלא")).toBeFocused();
  });

  test("form submits successfully with valid data", async ({ page }) => {
    await page.getByLabel("שם מלא").fill("שרה כהן");
    await page.getByLabel("כתובת אימייל").fill("sarah@test.co");
    await page.getByLabel("סוג כיסוי ראש").selectOption({ label: "טישל" });
    await page
      .getByLabel("תארי את החזון שלך")
      .fill("טישל משי בגוון ורוד עתיק עם עיטורי תחרה עדינים");
    await page.getByLabel("טווח תקציב").selectOption({ label: "₪350 – ₪700" });
    await page.getByRole("button", { name: "שלחי בקשה" }).click();
    await expect(page.getByText("הבקשה נשלחה!")).toBeVisible({ timeout: 10000 });
  });
});
