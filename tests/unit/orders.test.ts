import { createHmac, randomUUID } from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn(), headers: vi.fn() }));

const { db } = await import("@/lib/db");
const orders = await import("@/lib/orders");
const { POST } = await import("@/app/api/webhooks/razorpay/route");
const { signPayment, verifyPaymentSignature } = await import("@/lib/razorpay");

async function makeUser() {
  const id = randomUUID();
  const user = await db.user.create({ data: { id, name: "Buyer", email: `${id}@test.test` } });
  const address = await db.address.create({
    data: {
      userId: id,
      fullName: "Buyer",
      phone: "9876543210",
      line1: "1 Fort Road",
      city: "Bidar",
      state: "Karnataka",
      pincode: "585401",
    },
  });
  return { user, address };
}

const makeProduct = (stock: number, price = 69900) => {
  const slug = randomUUID();
  return db.product.create({
    data: { name: `Piece ${slug}`, slug, description: "A test piece.", price, stock, status: "active" },
  });
};

async function fillCart(userId: string, productId: string, quantity: number) {
  const cart = await db.cart.upsert({ where: { userId }, update: {}, create: { userId } });
  await db.cartItem.create({ data: { cartId: cart.id, productId, quantity } });
}

async function buyer(productId: string, quantity = 1) {
  const { user, address } = await makeUser();
  await fillCart(user.id, productId, quantity);
  return { user, address };
}

const stockOf = async (id: string) =>
  (await db.product.findUniqueOrThrow({ where: { id } })).stock;

beforeEach(async () => {
  await db.orderEvent.deleteMany();
  await db.orderItem.deleteMany();
  await db.order.deleteMany();
  await db.cartItem.deleteMany();
  await db.cart.deleteMany();
  await db.product.deleteMany();
  await db.address.deleteMany();
  await db.user.deleteMany();
  await db.setting.deleteMany();
});

describe("creating an order", () => {
  it("takes prices from the database and adds shipping", async () => {
    const product = await makeProduct(5);
    const { user, address } = await buyer(product.id, 2);

    const order = await orders.createOrderFromCart(user.id, address.id);

    expect(order.subtotal).toBe(139800);
    expect(order.shippingFee).toBe(9900);
    expect(order.total).toBe(149700);
    expect(order.number).toMatch(/^BC-\d{4}-\d{5}$/);
    expect(await stockOf(product.id)).toBe(3);
  });

  it("gives free shipping at the threshold", async () => {
    const product = await makeProduct(5, 149900);
    const { user, address } = await buyer(product.id);
    const order = await orders.createOrderFromCart(user.id, address.id);
    expect(order.shippingFee).toBe(0);
  });

  it("lets only one of two buyers take the last piece", async () => {
    const product = await makeProduct(1);
    const first = await buyer(product.id);
    const second = await buyer(product.id);

    const results = await Promise.allSettled([
      orders.createOrderFromCart(first.user.id, first.address.id),
      orders.createOrderFromCart(second.user.id, second.address.id),
    ]);

    expect(results.filter((r) => r.status === "fulfilled")).toHaveLength(1);
    expect(await stockOf(product.id)).toBe(0);
  });

  it("refuses another customer's address", async () => {
    const product = await makeProduct(1);
    const { user } = await buyer(product.id);
    const stranger = await makeUser();
    await expect(
      orders.createOrderFromCart(user.id, stranger.address.id)
    ).rejects.toThrow(orders.CheckoutError);
    expect(await stockOf(product.id)).toBe(1);
  });

  it("releases the old hold when a customer retries", async () => {
    const product = await makeProduct(2);
    const { user, address } = await buyer(product.id);
    const first = await orders.createOrderFromCart(user.id, address.id);
    await orders.createOrderFromCart(user.id, address.id);

    const old = await db.order.findUniqueOrThrow({ where: { id: first.id } });
    expect(old.status).toBe("cancelled");
    expect(await stockOf(product.id)).toBe(1);
  });
});

describe("confirming payment", () => {
  async function pendingOrder(stock = 2) {
    const product = await makeProduct(stock);
    const { user, address } = await buyer(product.id);
    const order = await orders.createOrderFromCart(user.id, address.id);
    return { order, product, user };
  }

  it("marks the order paid and clears the bought items", async () => {
    const { order, user } = await pendingOrder();
    await orders.confirmPayment(order.razorpayOrderId!, "pay_1");

    const paid = await db.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(paid.status).toBe("paid");
    expect(paid.stockReleaseAt).toBeNull();
    expect(await db.cartItem.count({ where: { cart: { userId: user.id } } })).toBe(0);
  });

  it("only takes effect once", async () => {
    const { order } = await pendingOrder();
    await Promise.all([
      orders.confirmPayment(order.razorpayOrderId!, "pay_1"),
      orders.confirmPayment(order.razorpayOrderId!, "pay_1"),
    ]);
    expect(await db.orderEvent.count({ where: { orderId: order.id, status: "paid" } })).toBe(1);
  });

  it("flags a wrong amount instead of accepting it", async () => {
    const { order } = await pendingOrder();
    await orders.confirmPayment(order.razorpayOrderId!, "pay_1", 100);
    const after = await db.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(after.status).toBe("pending_payment");
    expect(after.needsRefund).toBe(true);
  });

  it("flags a payment that arrives after cancellation", async () => {
    const { order, user } = await pendingOrder();
    await orders.cancelOwnPendingOrder(user.id, order.number);
    await orders.confirmPayment(order.razorpayOrderId!, "pay_late");

    const after = await db.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(after.status).toBe("cancelled");
    expect(after.needsRefund).toBe(true);
  });
});

describe("stock release", () => {
  it("cancels expired orders and returns their stock, once", async () => {
    const product = await makeProduct(1);
    const { user, address } = await buyer(product.id);
    const order = await orders.createOrderFromCart(user.id, address.id);
    await db.order.update({
      where: { id: order.id },
      data: { stockReleaseAt: new Date(Date.now() - 1000) },
    });

    expect(await orders.releaseExpiredOrders()).toBe(1);
    expect(await orders.releaseExpiredOrders()).toBe(0);
    expect(await stockOf(product.id)).toBe(1);
  });

  it("leaves orders inside their hold alone", async () => {
    const product = await makeProduct(1);
    const { user, address } = await buyer(product.id);
    await orders.createOrderFromCart(user.id, address.id);
    expect(await orders.releaseExpiredOrders()).toBe(0);
    expect(await stockOf(product.id)).toBe(0);
  });
});

describe("admin status changes", () => {
  async function paidOrder() {
    const product = await makeProduct(2);
    const { user, address } = await buyer(product.id);
    const order = await orders.createOrderFromCart(user.id, address.id);
    await orders.confirmPayment(order.razorpayOrderId!, `pay_${randomUUID()}`);
    return { order, product };
  }

  it("blocks moves that don't make sense", async () => {
    const { order } = await paidOrder();
    await expect(
      orders.changeOrderStatus(order.number, { to: "delivered", adminEmail: "a@b.test" })
    ).rejects.toThrow();
  });

  it("returns stock when a paid order is cancelled", async () => {
    const { order, product } = await paidOrder();
    await orders.changeOrderStatus(order.number, { to: "cancelled", adminEmail: "a@b.test" });
    expect(await stockOf(product.id)).toBe(2);
  });

  it("doesn't return stock for goods already shipped", async () => {
    const { order, product } = await paidOrder();
    await orders.changeOrderStatus(order.number, { to: "shipped", adminEmail: "a@b.test" });
    await orders.changeOrderStatus(order.number, { to: "refunded", adminEmail: "a@b.test" });
    expect(await stockOf(product.id)).toBe(1);
  });
});

describe("signatures", () => {
  it("accepts a real signature and rejects a tampered one", () => {
    const good = signPayment("order_1", "pay_1");
    expect(verifyPaymentSignature("order_1", "pay_1", good)).toBe(true);
    expect(verifyPaymentSignature("order_1", "pay_2", good)).toBe(false);
    expect(verifyPaymentSignature("order_1", "pay_1", "nonsense")).toBe(false);
  });
});

describe("webhook", () => {
  const send = (body: string, signature: string) =>
    POST(
      new Request("http://localhost/api/webhooks/razorpay", {
        method: "POST",
        body,
        headers: { "x-razorpay-signature": signature },
      })
    );
  const sign = (body: string) =>
    createHmac("sha256", "unit-webhook-secret").update(body).digest("hex");

  it("rejects a bad signature", async () => {
    expect((await send("{}", "bad")).status).toBe(400);
  });

  it("confirms an order when the browser never reported back", async () => {
    const product = await makeProduct(1);
    const { user, address } = await buyer(product.id);
    const order = await orders.createOrderFromCart(user.id, address.id);
    const body = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: { entity: { id: "pay_hook", order_id: order.razorpayOrderId, amount: order.total } },
      },
    });

    expect((await send(body, sign(body))).status).toBe(200);
    expect((await send(body, sign(body))).status).toBe(200);

    const paid = await db.order.findUniqueOrThrow({ where: { id: order.id } });
    expect(paid.status).toBe("paid");
    expect(paid.razorpayPaymentId).toBe("pay_hook");
  });
});
