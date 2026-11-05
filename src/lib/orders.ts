import type { OrderStatus, Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import {
  sendNewOrderAlert,
  sendOrderClosedEmail,
  sendOrderConfirmedEmail,
  sendOrderDeliveredEmail,
  sendOrderShippedEmail,
} from "@/lib/email";
import { shippingFor } from "@/lib/money";
import { createGatewayOrder } from "@/lib/razorpay";
import { getShippingSettings } from "@/lib/settings";

/** How long an unpaid order keeps its items reserved */
const HOLD_MINUTES = 30;

export class CheckoutError extends Error {}

const withItems = { items: true, user: { select: { email: true } } } satisfies Prisma.OrderInclude;

type TxClient = Prisma.TransactionClient;

async function restock(tx: TxClient, orderId: string) {
  const items = await tx.orderItem.findMany({ where: { orderId } });
  for (const item of items) {
    if (!item.productId) continue;
    await tx.product.update({
      where: { id: item.productId },
      data: { stock: { increment: item.quantity } },
    });
  }
}

/** Cancels one unpaid order and returns its stock. Safe if it's already been handled. */
async function cancelUnpaid(orderId: string, note: string) {
  await db.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: orderId, status: "pending_payment" },
      data: { status: "cancelled", stockReleaseAt: null },
    });
    if (count === 0) return;
    await restock(tx, orderId);
    await tx.orderEvent.create({ data: { orderId, status: "cancelled", note } });
  });
}

export async function releaseExpiredOrders() {
  const expired = await db.order.findMany({
    where: { status: "pending_payment", stockReleaseAt: { lt: new Date() } },
    select: { id: true },
  });
  for (const order of expired) await cancelUnpaid(order.id, "Payment not completed in time");
  return expired.length;
}

/**
 * Creates an order from the user's saved cart. Prices come from the database, never
 * the browser, and stock is reserved atomically so the last piece can't be sold twice.
 */
export async function createOrderFromCart(userId: string, addressId: string) {
  await releaseExpiredOrders();

  // A customer retrying checkout gets a fresh order, so nothing stays reserved twice
  const previous = await db.order.findMany({
    where: { userId, status: "pending_payment" },
    select: { id: true },
  });
  for (const order of previous) await cancelUnpaid(order.id, "Replaced by a new checkout");

  const address = await db.address.findFirst({ where: { id: addressId, userId } });
  if (!address) throw new CheckoutError("Please choose a delivery address.");

  const cartItems = await db.cartItem.findMany({
    where: { cart: { userId } },
    include: { product: { include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } } } },
  });
  if (cartItems.length === 0) throw new CheckoutError("Your cart is empty.");

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const { fee, freeAbove } = await getShippingSettings();
  const shippingFee = shippingFor(subtotal, fee, freeAbove);
  const total = subtotal + shippingFee;

  const order = await db.$transaction(async (tx) => {
    for (const item of cartItems) {
      const { count } = await tx.product.updateMany({
        where: { id: item.productId, status: "active", stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (count === 0) {
        throw new CheckoutError(
          `${item.product.name} is no longer available in that quantity. Please review your cart.`
        );
      }
    }

    const created = await tx.order.create({
      data: {
        number: `pending-${crypto.randomUUID()}`,
        userId,
        shipFullName: address.fullName,
        shipPhone: address.phone,
        shipLine1: address.line1,
        shipLine2: address.line2,
        shipCity: address.city,
        shipState: address.state,
        shipPincode: address.pincode,
        subtotal,
        shippingFee,
        total,
        stockReleaseAt: new Date(Date.now() + HOLD_MINUTES * 60 * 1000),
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images[0]?.url,
          })),
        },
        events: { create: { status: "pending_payment" } },
      },
    });

    return tx.order.update({
      where: { id: created.id },
      data: {
        number: `BC-${created.createdAt.getFullYear()}-${String(created.seq).padStart(5, "0")}`,
      },
    });
  });

  try {
    const razorpayOrderId = await createGatewayOrder(total, order.number);
    return db.order.update({ where: { id: order.id }, data: { razorpayOrderId } });
  } catch (error) {
    await cancelUnpaid(order.id, "Could not start payment");
    console.error("Razorpay order creation failed", error);
    throw new CheckoutError("We couldn't start the payment. Please try again.");
  }
}

/**
 * Marks an order paid. The browser callback and the webhook both call this, in either
 * order, and only the first one has any effect.
 */
export async function confirmPayment(
  razorpayOrderId: string,
  paymentId: string,
  paidAmount?: number
) {
  const order = await db.order.findUnique({ where: { razorpayOrderId }, include: withItems });
  if (!order) return null;

  if (paidAmount !== undefined && paidAmount !== order.total) {
    console.error(`Payment amount mismatch on ${order.number}: ${paidAmount} vs ${order.total}`);
    await db.order.updateMany({ where: { id: order.id }, data: { needsRefund: true } });
    return order;
  }

  const firstConfirmation = await db.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: order.id, status: "pending_payment" },
      data: { status: "paid", razorpayPaymentId: paymentId, stockReleaseAt: null },
    });
    if (count === 0) return false;
    await tx.orderEvent.create({ data: { orderId: order.id, status: "paid" } });
    // Only the items bought leave the cart, so anything added since stays
    for (const item of order.items) {
      if (!item.productId) continue;
      await tx.cartItem.deleteMany({
        where: { cart: { userId: order.userId }, productId: item.productId },
      });
    }
    return true;
  });

  if (firstConfirmation) {
    await Promise.all([
      sendOrderConfirmedEmail(order.user.email, order),
      sendNewOrderAlert(order),
    ]);
    return order;
  }

  // Paid after the hold ran out: the stock may be gone, so flag it for a refund
  if (order.status === "cancelled" && !order.razorpayPaymentId) {
    await db.order.update({
      where: { id: order.id },
      data: { needsRefund: true, razorpayPaymentId: paymentId },
    });
    await db.orderEvent.create({
      data: {
        orderId: order.id,
        status: "cancelled",
        note: `Payment ${paymentId} arrived after cancellation. Refund needed.`,
      },
    });
  }
  return order;
}

/** Called when a customer closes the payment window without paying. */
export async function cancelOwnPendingOrder(userId: string, number: string) {
  const order = await db.order.findFirst({
    where: { number, userId, status: "pending_payment" },
    select: { id: true },
  });
  if (order) await cancelUnpaid(order.id, "Customer closed the payment window");
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Awaiting payment",
  paid: "Paid",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  refunded: "Refunded",
};

/** Moves an admin can make from each status */
export const NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["cancelled"],
  paid: ["packed", "shipped", "cancelled", "refunded"],
  packed: ["shipped", "cancelled", "refunded"],
  shipped: ["delivered", "refunded"],
  delivered: ["refunded"],
  cancelled: ["refunded"],
  refunded: [],
};

type StatusChange = {
  to: OrderStatus;
  adminEmail: string;
  note?: string;
  trackingCarrier?: string;
  trackingNumber?: string;
};

export async function changeOrderStatus(orderNumber: string, change: StatusChange) {
  const order = await db.order.findUnique({ where: { number: orderNumber }, include: withItems });
  if (!order) throw new Error("Order not found");
  if (!NEXT_STATUSES[order.status].includes(change.to)) {
    throw new Error(`An order can't go from ${order.status} to ${change.to}`);
  }

  // Goods that never left the workshop go back on sale
  const returnsStock =
    (change.to === "cancelled" || change.to === "refunded") &&
    ["pending_payment", "paid", "packed"].includes(order.status);

  const updated = await db.$transaction(async (tx) => {
    const { count } = await tx.order.updateMany({
      where: { id: order.id, status: order.status },
      data: {
        status: change.to,
        stockReleaseAt: null,
        needsRefund: change.to === "refunded" ? false : undefined,
        trackingCarrier: change.trackingCarrier || undefined,
        trackingNumber: change.trackingNumber || undefined,
      },
    });
    if (count === 0) throw new Error("This order was just changed. Please reload.");
    if (returnsStock) await restock(tx, order.id);
    await tx.orderEvent.create({
      data: {
        orderId: order.id,
        status: change.to,
        note: change.note,
        createdBy: change.adminEmail,
      },
    });
    return tx.order.findUniqueOrThrow({ where: { id: order.id }, include: withItems });
  });

  const email = updated.user.email;
  if (change.to === "shipped") await sendOrderShippedEmail(email, updated);
  if (change.to === "delivered") await sendOrderDeliveredEmail(email, updated);
  if (change.to === "cancelled" || change.to === "refunded") {
    await sendOrderClosedEmail(email, updated, change.to);
  }
}
