import { defineConfig } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "e2e",
  forbidOnly: !!process.env.CI,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${PORT}`,
  },
  projects: [
    {
      // Smoke gate: boots the production build and runs one happy path.
      // Request-only for now, so no browser is needed.
      name: "smoke",
      grep: /@smoke/,
    },
  ],
  webServer: {
    command: `npm run build && npm run start -- --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    // Always build and boot a fresh server: the smoke gate must prove the app
    // starts. Fails fast if port 3100 is already taken.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
