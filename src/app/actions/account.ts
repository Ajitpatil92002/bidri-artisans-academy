"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { FormState } from "@/components/forms";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";
import { addressSchema, profileSchema } from "@/lib/validation";

export async function updateProfile(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };
  await db.user.update({ where: { id: user.id }, data: parsed.data });
  revalidatePath("/account");
  return { success: "Profile saved." };
}

function readAddress(formData: FormData) {
  return addressSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    pincode: formData.get("pincode"),
    isDefault: formData.get("isDefault") === "on",
  });
}

export async function saveAddress(_: FormState, formData: FormData): Promise<FormState> {
  const user = await requireUser();
  const parsed = readAddress(formData);
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  const id = formData.get("id")?.toString() || null;
  const existingCount = await db.address.count({ where: { userId: user.id } });
  const data = { ...parsed.data, isDefault: parsed.data.isDefault || existingCount === 0 };

  await db.$transaction(async (tx) => {
    if (data.isDefault) {
      await tx.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
    }
    if (id) {
      // The userId filter stops anyone editing another customer's address
      const { count } = await tx.address.updateMany({ where: { id, userId: user.id }, data });
      if (count === 0) throw new Error("Address not found");
    } else {
      await tx.address.create({ data: { ...data, userId: user.id } });
    }
  });

  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
  return { success: "Address saved." };
}

export async function deleteAddress(id: string) {
  const user = await requireUser();
  await db.address.deleteMany({ where: { id: z.string().parse(id), userId: user.id } });
  revalidatePath("/account/addresses");
  revalidatePath("/checkout");
}
