import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules", ".next", ".firebase", "e2e"],
    coverage: {
      provider: "v8",
      include: ["lib/**", "components/**", "hooks/**", "stores/**"],
      exclude: [
        "**/*.test.*",
        "**/index.ts",
        "lib/i18n/**",
        "lib/firebase/admin.ts",
        "lib/firebase/client.ts",
        "lib/email/**",
        "components/layout/locale-switcher.tsx",
      ],
      thresholds: {
        statements: 75,
        branches: 65,
        functions: 75,
        lines: 75,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
