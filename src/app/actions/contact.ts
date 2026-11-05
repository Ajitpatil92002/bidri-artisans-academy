"use server";

import { z } from "zod";
import type { FormState } from "@/components/forms";
import { db } from "@/lib/db";
import { sendContactAlert } from "@/lib/email";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import { contactSchema, emailSchema } from "@/lib/validation";

export async function sendContactMessage(_: FormState, formData: FormData): Promise<FormState> {
  // Hidden field that people never fill in, but form-filling bots do
  if (formData.get("website")) return { success: "Thank you. We'll be in touch soon." };

  const parsed = contactSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  if (!(await checkRateLimit(`contact:${await clientIp()}`, 5, 3600))) {
    return { error: "Too many messages. Please try again later." };
  }

  const { name, email, message } = parsed.data;
  await db.contactMessage.create({ data: { name, email, message } });
  await sendContactAlert(name, email, message);
  return { success: "Thank you. We'll be in touch soon." };
}

export async function subscribeToNewsletter(_: FormState, formData: FormData): Promise<FormState> {
  if (formData.get("website")) return { success: "Thank you for subscribing." };

  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) return { fieldErrors: { email: ["Enter a valid email address."] } };

  if (!(await checkRateLimit(`newsletter:${await clientIp()}`, 5, 3600))) {
    return { error: "Too many attempts. Please try again later." };
  }

  await db.newsletterSubscriber.upsert({
    where: { email: parsed.data },
    update: {},
    create: { email: parsed.data },
  });
  return { success: "Thank you for subscribing." };
}
