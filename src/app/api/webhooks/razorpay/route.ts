import { NextResponse } from "next/server";
import { z } from "zod";
import { confirmPayment } from "@/lib/orders";
import { verifyWebhookSignature } from "@/lib/razorpay";

const eventSchema = z.object({
  event: z.string(),
  payload: z.object({
    payment: z
      .object({
        entity: z.object({
          id: z.string(),
          order_id: z.string().nullable(),
          amount: z.number().int(),
        }),
      })
      .optional(),
  }),
});

export async function POST(request: Request) {
  // The signature covers the exact bytes sent, so read the body before parsing it
  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature || !verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const parsed = eventSchema.safeParse(JSON.parse(rawBody));
  if (!parsed.success) return NextResponse.json({ ignored: true });

  const { event, payload } = parsed.data;
  const payment = payload.payment?.entity;
  if ((event === "payment.captured" || event === "order.paid") && payment?.order_id) {
    await confirmPayment(payment.order_id, payment.id, payment.amount);
  }
  return NextResponse.json({ received: true });
}
