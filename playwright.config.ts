import { defineConfig, devices } from "@playwright/test";

const emulatorEnv = {
  NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "true",
  FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080",
  FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
  NEXT_PUBLIC_FIREBASE_API_KEY: "demo-key",
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "demo-tichel-co.firebaseapp.com",
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-tichel-co",
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "demo-tichel-co.appspot.com",
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "000000000000",
  NEXT_PUBLIC_FIREBASE_APP_ID: "1:000000000000:web:0000000000000000",
  NEXT_PUBLIC_DEFAULT_LOCALE: "he",
};

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? "github" : "html",
  timeout: 20_000,
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    locale: "he-IL",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-safari",
      use: { ...devices["iPhone 13"] },
    },
  ],
  webServer: [
    {
      command:
        "pnpm exec firebase emulators:start --only auth,firestore,storage --project demo-tichel-co",
      port: 8080,
      reuseExistingServer: !process.env.CI,
      timeout: 60_000,
    },
    {
      command: "pnpm exec tsx scripts/seed-firestore.ts && pnpm build && pnpm start",
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 300_000,
      env: emulatorEnv,
    },
  ],
});
