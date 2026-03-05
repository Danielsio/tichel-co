import { test, expect } from "@playwright/test";
import { createEmulatorUser, setAdminClaim, clearEmulatorAuth } from "./helpers";

const ADMIN_EMAIL = "admin@tichel.co";
const ADMIN_PASSWORD = "Admin123456";
const USER_EMAIL = "regular@tichel.co";
const USER_PASSWORD = "User123456";

test.describe("Admin panel", () => {
  let adminUid: string;

  test.beforeAll(async () => {
    await clearEmulatorAuth();
    adminUid = await createEmulatorUser(ADMIN_EMAIL, ADMIN_PASSWORD);
    await setAdminClaim(adminUid);
    await createEmulatorUser(USER_EMAIL, USER_PASSWORD);
  });

  test.afterAll(async () => {
    await clearEmulatorAuth();
  });

  test("regular user cannot access admin panel", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("כתובת אימייל").fill(USER_EMAIL);
    await page.getByLabel("סיסמה").fill(USER_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");
    await page.goto("/admin");
    await expect(page.getByText("אין הרשאה")).toBeVisible({ timeout: 10000 });
  });

  test("admin can access dashboard", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("כתובת אימייל").fill(ADMIN_EMAIL);
    await page.getByLabel("סיסמה").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "לוח בקרה" })).toBeVisible({
      timeout: 10000,
    });
  });

  test("admin dashboard shows product stats", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("כתובת אימייל").fill(ADMIN_EMAIL);
    await page.getByLabel("סיסמה").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");
    await page.goto("/admin");
    await expect(page.getByText("מוצרים").first()).toBeVisible({ timeout: 10000 });
  });

  test("admin products page lists seeded products", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("כתובת אימייל").fill(ADMIN_EMAIL);
    await page.getByLabel("סיסמה").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");
    await page.goto("/admin/products");
    await expect(page.getByText("טישל משי מרובע — שנהב")).toBeVisible({
      timeout: 10000,
    });
  });

  test("admin orders page loads", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("כתובת אימייל").fill(ADMIN_EMAIL);
    await page.getByLabel("סיסמה").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");
    await page.goto("/admin/orders");
    await expect(page.getByText("הזמנות").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("admin custom requests page loads", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("כתובת אימייל").fill(ADMIN_EMAIL);
    await page.getByLabel("סיסמה").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");
    await page.goto("/admin/custom-requests");
    await expect(page.getByText("בקשות מיוחדות").first()).toBeVisible({
      timeout: 10000,
    });
  });
});
