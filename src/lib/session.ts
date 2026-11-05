import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth";

export const getSessionUser = cache(async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
});

/** Only allows relative paths, so a crafted link can't send people to another site. */
export function safeRedirectPath(path: string | null | undefined, fallback = "/account") {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return fallback;
  }
  return path;
}

export async function requireUser(returnTo = "/account") {
  const user = await getSessionUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(safeRedirectPath(returnTo))}`);
  return user;
}

/** Call this at the start of every admin page and action. */
export async function requireAdmin() {
  const user = await requireUser("/admin");
  if (user.role !== "admin") notFound();
  return user;
}
