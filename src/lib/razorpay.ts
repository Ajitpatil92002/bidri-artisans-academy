import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import Razorpay from "razorpay";

/** Local stand-in for development (D-025). Never active in production. */
export function isMockPayments() {
  return process.env.NODE_ENV !== "production" && process.env.RAZORPAY_MOCK === "true";
}

export function paymentsConfigured() {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

function keySecret() {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error("RAZORPAY_KEY_SECRET is not set");
  return secret;
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

/** Creates the Razorpay order that the customer pays against. */
export async function createGatewayOrder(amount: number, receipt: string) {
  if (isMockPayments()) return `order_mock_${randomBytes(8).toString("hex")}`;
  const client = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID ?? "",
    key_secret: keySecret(),
  });
  const order = await client.orders.create({ amount, currency: "INR", receipt });
  return order.id;
}

export function signPayment(orderId: string, paymentId: string) {
  return createHmac("sha256", keySecret()).update(`${orderId}|${paymentId}`).digest("hex");
}

export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string) {
  return safeEqual(signPayment(orderId, paymentId), signature);
}

/** Must be given the raw request body, exactly as Razorpay sent it. */
export function verifyWebhookSignature(rawBody: string, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  const expected = createHmac("sha256", secret).update(rawBody).digest("hex");
  return safeEqual(expected, signature);
}
