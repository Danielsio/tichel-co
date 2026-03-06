import { test, expect } from "@playwright/test";
import { addProductToCart } from "./helpers";

test.describe("Cart", () => {
  test("cart drawer opens when adding a product", async ({ page }) => {
    await addProductToCart(page, "ivory-silk-square-tichel");
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByText("טישל משי מרובע — שנהב")).toBeVisible();
  });

  test("cart shows correct price", async ({ page }) => {
    await addProductToCart(page, "ivory-silk-square-tichel");
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    await expect(drawer.getByText(/289/).first()).toBeVisible();
  });

  test("increment quantity updates cart", async ({ page }) => {
    await addProductToCart(page, "ivory-silk-square-tichel");
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    await drawer.getByRole("button", { name: "הוסף כמות" }).click();
    await expect(drawer.getByText(/578/).first()).toBeVisible();
  });

  test("decrement quantity below 1 removes item", async ({ page }) => {
    await addProductToCart(page, "ivory-silk-square-tichel");
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    await drawer.getByRole("button", { name: "הפחת כמות" }).click();
    await expect(drawer.getByText("הסל ריק")).toBeVisible();
  });

  test("remove item button empties cart", async ({ page }) => {
    await addProductToCart(page, "ivory-silk-square-tichel");
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    const removeBtn = drawer.getByRole("button", {
      name: /הסר/,
    });
    await removeBtn.click();
    await expect(drawer.getByText("הסל ריק")).toBeVisible();
  });

  test("cart persists across page navigation", async ({ page }) => {
    await addProductToCart(page, "ivory-silk-square-tichel");
    await page.getByRole("button", { name: "המשך קניות" }).click();
    await page.goto("/");
    const cartButton = page.getByRole("button", { name: "עגלת קניות" });
    await expect(cartButton.locator("span")).toContainText("1");
  });

  test("multiple products appear in cart", async ({ page }) => {
    await addProductToCart(page, "ivory-silk-square-tichel");
    await page.getByRole("button", { name: "המשך קניות" }).click();
    await addProductToCart(page, "navy-velvet-pre-tied");
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    await expect(drawer.getByText("טישל משי מרובע — שנהב")).toBeVisible();
    await expect(drawer.getByText("טישל קטיפה קשור מראש — כחול כהה")).toBeVisible();
  });

  test("empty cart shows empty state with continue shopping", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "עגלת קניות" }).click();
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    await expect(drawer.getByText("הסל ריק")).toBeVisible();
    await expect(drawer.getByRole("button", { name: "המשך קניות" })).toBeVisible();
  });

  test("total is calculated correctly for multiple items", async ({ page }) => {
    await addProductToCart(page, "cotton-turban-terracotta");
    const drawer = page.getByRole("dialog", { name: "סל קניות" });
    await drawer.getByRole("button", { name: "הוסף כמות" }).click();
    await expect(drawer.getByText(/298/).first()).toBeVisible();
  });
});
