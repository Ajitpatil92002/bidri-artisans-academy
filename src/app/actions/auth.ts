"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { APIError } from "better-auth/api";
import { z } from "zod";
import type { FormState } from "@/components/forms";
import { auth } from "@/lib/auth";
import { mergeGuestCart } from "@/lib/cart";
import { db } from "@/lib/db";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { safeRedirectPath } from "@/lib/session";
import { emailSchema, loginSchema, passwordSchema, registerSchema } from "@/lib/validation";

const TOO_MANY = "Too many attempts. Please wait a few minutes and try again.";

export async function login(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = loginSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const ip = await clientIp();
  if (!(await checkRateLimit(`login:${ip}:${parsed.data.email}`, 10, 900))) {
    return { error: TOO_MANY };
  }

  let userId: string;
  try {
    const result = await auth.api.signInEmail({ body: parsed.data, headers: await headers() });
    userId = result.user.id;
  } catch (error) {
    if (error instanceof APIError) return { error: "Incorrect email or password." };
    throw error;
  }

  await mergeGuestCart(userId);
  redirect(safeRedirectPath(formData.get("next")?.toString()));
}

export async function register(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = registerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  if (!(await checkRateLimit(`register:${await clientIp()}`, 10, 3600))) {
    return { error: TOO_MANY };
  }

  const { name, email, password, phone } = parsed.data;
  let userId: string;
  try {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });
    userId = result.user.id;
  } catch (error) {
    if (error instanceof APIError) {
      return { error: "We couldn't create that account. If you already have one, please log in." };
    }
    throw error;
  }

  await db.user.update({ where: { id: userId }, data: { phone } });
  await mergeGuestCart(userId);
  redirect(safeRedirectPath(formData.get("next")?.toString()));
}

export async function logout() {
  await auth.api.signOut({ headers: await headers() });
  redirect("/");
}

export async function forgotPassword(_: FormState, formData: FormData): Promise<FormState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { fieldErrors: { email: ["Enter a valid email address."] } };

  if (!(await checkRateLimit(`forgot:${await clientIp()}`, 5, 900))) {
    return { error: TOO_MANY };
  }

  await auth.api.requestPasswordReset({
    body: { email: parsed.data, redirectTo: "/reset-password" },
    headers: await headers(),
  });
  // The same reply either way, so this can't reveal who has an account
  return { success: "If that email has an account, a reset link is on its way." };
}

export async function resetPassword(_: FormState, formData: FormData): Promise<FormState> {
  const token = formData.get("token")?.toString();
  const parsed = passwordSchema.safeParse(formData.get("password"));
  if (!parsed.success) return { fieldErrors: { password: [parsed.error.issues[0].message] } };
  if (!token) return { error: "This reset link isn't valid. Please request a new one." };

  try {
    await auth.api.resetPassword({ body: { newPassword: parsed.data, token } });
  } catch (error) {
    if (error instanceof APIError) {
      return { error: "This reset link has expired. Please request a new one." };
    }
    throw error;
  }
  redirect("/login?reset=1");
}

export async function changePassword(_: FormState, formData: FormData): Promise<FormState> {
  const currentPassword = formData.get("currentPassword")?.toString() ?? "";
  const parsed = passwordSchema.safeParse(formData.get("newPassword"));
  if (!parsed.success) return { fieldErrors: { newPassword: [parsed.error.issues[0].message] } };

  try {
    await auth.api.changePassword({
      body: { currentPassword, newPassword: parsed.data, revokeOtherSessions: true },
      headers: await headers(),
    });
  } catch (error) {
    if (error instanceof APIError) return { error: "Your current password isn't right." };
    throw error;
  }
  return { success: "Password changed." };
}
