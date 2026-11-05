"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { cancelOwnPendingOrder, CheckoutError, confirmPayment, createOrderFromCart } from "@/lib/orders";
import { checkRateLimit } from "@/lib/rate-limit";
import {
  isMockPayments,
  paymentsConfigured,
  signPayment,
  verifyPaymentSignature,
} from "@/lib/razorpay";
import { requireUser } from "@/lib/session";

export type StartCheckoutResult =
  | {
      ok: true;
      mock: boolean;
      keyId: string;
      orderNumber: string;
      razorpayOrderId: string;
      amount: number;
      customer: { name: string; email: string; phone: string };
    }
  | { ok: false; error: string };

export async function startCheckout(addressId: string): Promise<StartCheckoutResult> {
  const user = await requireUser("/checkout");

  if (!isMockPayments() && !paymentsConfigured()) {
    return { ok: false, error: "Payments aren't set up yet. Please try again later." };
  }
  if (!(await checkRateLimit(`checkout:${user.id}`, 20, 600))) {
    return { ok: false, error: "Too many attempts. Please wait a few minutes." };
  }

  try {
    const order = await createOrderFromCart(user.id, z.string().parse(addressId));
    revalidatePath("/", "layout");
    return {
      ok: true,
      mock: isMockPayments(),
      keyId: process.env.RAZORPAY_KEY_ID ?? "",
      orderNumber: order.number,
      razorpayOrderId: order.razorpayOrderId ?? "",
      amount: order.total,
      customer: { name: user.name, email: user.email, phone: user.phone ?? "" },
    };
  } catch (error) {
    if (error instanceof CheckoutError) return { ok: false, error: error.message };
    throw error;
  }
}

const paymentSchema = z.object({
  razorpayOrderId: z.string().min(1).max(100),
  razorpayPaymentId: z.string().min(1).max(100),
  razorpaySignature: z.string().min(1).max(200),
});

export async function completeCheckout(input: z.input<typeof paymentSchema>) {
  const user = await requireUser("/checkout");
  const payment = paymentSchema.parse(input);

  const valid = verifyPaymentSignature(
    payment.razorpayOrderId,
    payment.razorpayPaymentId,
    payment.razorpaySignature
  );
  if (!valid) return { ok: false as const, error: "We couldn't verify that payment." };

  const owned = await db.order.findFirst({
    where: { razorpayOrderId: payment.razorpayOrderId, userId: user.id },
    select: { id: true },
  });
  if (!owned) return { ok: false as const, error: "We couldn't find that order." };

  const order = await confirmPayment(payment.razorpayOrderId, payment.razorpayPaymentId);
  revalidatePath("/", "layout");
  return { ok: true as const, orderNumber: order?.number ?? "" };
}

export async function abandonCheckout(orderNumber: string) {
  const user = await requireUser("/checkout");
  await cancelOwnPendingOrder(user.id, z.string().parse(orderNumber));
  revalidatePath("/", "layout");
}

/** Plays Razorpay's part in development (D-025). Refuses to run otherwise. */
export async function mockPay(razorpayOrderId: string) {
  await requireUser("/checkout");
  if (!isMockPayments()) throw new Error("Mock payments are off");
  const razorpayPaymentId = `pay_mock_${crypto.randomUUID().slice(0, 12)}`;
  return {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature: signPayment(razorpayOrderId, razorpayPaymentId),
  };
}
