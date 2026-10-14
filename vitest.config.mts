import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    // "server-only" is a Next.js build guard; tests load its no-op build.
    alias: {
      "server-only": "next/dist/compiled/server-only/empty.js",
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: [
      "src/**/*.test.{ts,tsx}",
      "studio/schemas/**/*.test.ts",
      "scripts/**/*.test.mjs",
    ],
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.test.{ts,tsx}"],
      // lcov feeds the local SonarQube gate; cobertura feeds diff-cover.
      reporter: ["text", "lcov", "cobertura"],
      reportsDirectory: "coverage",
      thresholds: {
        branches: 80,
      },
    },
  },
});
