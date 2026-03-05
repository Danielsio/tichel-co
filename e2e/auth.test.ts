import { test, expect } from "@playwright/test";
import { createEmulatorUser, clearEmulatorAuth, addProductToCart } from "./helpers";

const TEST_EMAIL = "test@tichel.co";
const TEST_PASSWORD = "Test123456";

test.describe("Authentication", () => {
  test.beforeAll(async () => {
    await clearEmulatorAuth();
  });

  test.afterAll(async () => {
    await clearEmulatorAuth();
  });

  test("register a new account", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByRole("heading", { name: "יצירת חשבון" })).toBeVisible();
    await page.getByLabel("כתובת אימייל").fill(TEST_EMAIL);
    await page.getByLabel("סיסמה", { exact: true }).fill(TEST_PASSWORD);
    await page.getByLabel("אימות סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "צור חשבון" }).click();
    await page.waitForURL("**/account");
    await expect(page.getByText(TEST_EMAIL)).toBeVisible();
  });

  test("login with existing account", async ({ page }) => {
    await createEmulatorUser("login@tichel.co", TEST_PASSWORD);
    await page.goto("/login");
    await expect(page.getByRole("heading", { name: "התחברות" })).toBeVisible();
    await page.getByLabel("כתובת אימייל").fill("login@tichel.co");
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");
    await expect(page.getByText("login@tichel.co")).toBeVisible();
  });

  test("account page shows user email", async ({ page }) => {
    await createEmulatorUser("account@tichel.co", TEST_PASSWORD);
    await page.goto("/login");
    await page.getByLabel("כתובת אימייל").fill("account@tichel.co");
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");
    await expect(page.getByText("account@tichel.co")).toBeVisible();
  });

  test("logout redirects to home", async ({ page }) => {
    await createEmulatorUser("logout@tichel.co", TEST_PASSWORD);
    await page.goto("/login");
    await page.getByLabel("כתובת אימייל").fill("logout@tichel.co");
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");
    await page.getByRole("button", { name: "התנתק" }).click();
    await expect(page).toHaveURL("/");
  });

  test("unauthenticated account page shows login/register links", async ({ page }) => {
    await page.goto("/account");
    await expect(page.getByRole("heading", { name: "החשבון שלי" })).toBeVisible();
    await expect(page.getByRole("link", { name: "התחבר" })).toBeVisible();
    await expect(page.getByRole("link", { name: "צור חשבון" })).toBeVisible();
  });

  test("cart persists after login", async ({ page }) => {
    await createEmulatorUser("cart-sync@tichel.co", TEST_PASSWORD);
    await addProductToCart(page, "ivory-silk-square-tichel");
    await page.getByRole("button", { name: "המשך קניות" }).click();

    await page.goto("/login");
    await page.getByLabel("כתובת אימייל").fill("cart-sync@tichel.co");
    await page.getByLabel("סיסמה").fill(TEST_PASSWORD);
    await page.getByRole("button", { name: "התחבר" }).click();
    await page.waitForURL("**/account");

    await page.getByRole("button", { name: "עגלת קניות" }).click();
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    await expect(drawer.getByText("טישל משי מרובע — שנהב")).toBeVisible();
  });
});
