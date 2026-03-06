import type { Page } from "@playwright/test";

const AUTH_EMULATOR = "http://127.0.0.1:9099";
const PROJECT_ID = "demo-tichel-co";

export async function createEmulatorUser(
  email: string,
  password: string,
): Promise<string> {
  const signUpRes = await fetch(
    `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signUp?key=demo-key`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    },
  );
  const signUpData = await signUpRes.json();

  if (signUpRes.ok) return signUpData.localId;

  if (signUpData?.error?.message === "EMAIL_EXISTS") {
    const signInRes = await fetch(
      `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=demo-key`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, returnSecureToken: true }),
      },
    );
    const signInData = await signInRes.json();
    if (!signInRes.ok)
      throw new Error(`Failed to sign in existing user: ${JSON.stringify(signInData)}`);
    return signInData.localId;
  }

  throw new Error(`Failed to create user: ${JSON.stringify(signUpData)}`);
}

export async function setAdminClaim(uid: string, retries = 3): Promise<void> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    const res = await fetch(
      `${AUTH_EMULATOR}/identitytoolkit.googleapis.com/v1/projects/${PROJECT_ID}/accounts:update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer owner",
        },
        body: JSON.stringify({
          localId: uid,
          customAttributes: JSON.stringify({ role: "admin" }),
        }),
      },
    );
    if (res.ok) return;
    const data = await res.json();
    if (attempt < retries && data?.error?.message === "USER_NOT_FOUND") {
      await new Promise((r) => setTimeout(r, 500 * attempt));
      continue;
    }
    throw new Error(`Failed to set admin claim: ${JSON.stringify(data)}`);
  }
}

export async function clearEmulatorAuth(): Promise<void> {
  await fetch(`${AUTH_EMULATOR}/emulator/v1/projects/${PROJECT_ID}/accounts`, {
    method: "DELETE",
  });
}

export async function loginOnPage(
  page: Page,
  email: string,
  password: string,
): Promise<void> {
  await page.goto("/login");
  await page.getByLabel("כתובת אימייל").fill(email);
  await page.getByLabel("סיסמה").fill(password);
  await page.getByRole("button", { name: "התחבר" }).click();
  await page.waitForURL("**/account");
}

export async function addProductToCart(page: Page, productSlug: string): Promise<void> {
  await page.goto(`/products/${productSlug}`);
  await page.getByRole("button", { name: "הוסיפי לסל" }).click();
  await page.getByRole("dialog", { name: "סל קניות" }).waitFor();
}
