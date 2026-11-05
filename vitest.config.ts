import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    include: ["tests/unit/**/*.test.ts"],
    fileParallelism: false,
    testTimeout: 20000,
    env: {
      DATABASE_URL: "postgresql://bidri:bidri_local@localhost:5432/bidri_test",
      NODE_ENV: "test",
      RAZORPAY_MOCK: "true",
      RAZORPAY_KEY_ID: "rzp_test_unit",
      RAZORPAY_KEY_SECRET: "unit-test-secret",
      RAZORPAY_WEBHOOK_SECRET: "unit-webhook-secret",
    },
  },
});
