import { loadEnvFile } from "node:process";
import { defineConfig } from "@playwright/test";

try {
  loadEnvFile(".env.local");
} catch {
  // Real environment variables are used instead
}

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90000,
  workers: 1,
  use: { baseURL: "http://localhost:3000", trace: "retain-on-failure" },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
