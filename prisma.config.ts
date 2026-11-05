import { loadEnvFile } from "node:process";
import { defineConfig } from "prisma/config";

// Prisma doesn't read Next.js env files by itself
try {
  loadEnvFile(".env.local");
} catch {
  // CI and hosted builds set real environment variables instead
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Neon migrations need the direct URL, not the pooled one
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});
