import { headers } from "next/headers";
import { db } from "@/lib/db";

export async function clientIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
}

/** Returns false once `key` has been used more than `limit` times in the window. */
export async function checkRateLimit(key: string, limit: number, windowSeconds: number) {
  const rows = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "count", "resetAt")
    VALUES (${key}, 1, NOW() + make_interval(secs => ${windowSeconds}))
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."resetAt" < NOW() THEN 1 ELSE "RateLimit"."count" + 1 END,
      "resetAt" = CASE WHEN "RateLimit"."resetAt" < NOW()
        THEN NOW() + make_interval(secs => ${windowSeconds}) ELSE "RateLimit"."resetAt" END
    RETURNING "count"`;
  return rows[0].count <= limit;
}
