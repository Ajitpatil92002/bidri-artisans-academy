"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getLineQuantity, setCartQuantity } from "@/lib/cart";

const idSchema = z.string().min(1).max(40);
const quantitySchema = z.number().int().min(0).max(100);

/** Adds to whatever is already in the cart and returns a message for the customer. */
export async function addToCart(productId: string, quantity: number) {
  const id = idSchema.parse(productId);
  const adding = quantitySchema.parse(quantity);
  const current = await getLineQuantity(id);
  const wanted = current + adding;
  const result = await setCartQuantity(id, wanted);
  revalidatePath("/", "layout");
  if (result === 0) return "Sorry, this piece is no longer available.";
  if (result < wanted) return `Only ${result} available, so your cart holds ${result}.`;
  return "Added to your cart.";
}

export async function updateCartQuantity(productId: string, quantity: number) {
  await setCartQuantity(idSchema.parse(productId), quantitySchema.parse(quantity));
  revalidatePath("/", "layout");
}

export async function removeFromCart(productId: string) {
  await setCartQuantity(idSchema.parse(productId), 0);
  revalidatePath("/", "layout");
}
