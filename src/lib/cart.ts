import { cookies } from "next/headers";
import { z } from "zod";
import { db } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

const CART_COOKIE = "bidri_cart";
const MAX_LINES = 50;
export const MAX_QUANTITY = 20;

const guestCartSchema = z
  .array(z.object({ p: z.string().max(40), q: z.number().int().min(1).max(MAX_QUANTITY) }))
  .max(MAX_LINES);

type GuestLine = z.infer<typeof guestCartSchema>[number];

/** Logged-out carts live in a cookie, so the server can read them like any other cart. */
async function readGuestCart(): Promise<GuestLine[]> {
  const raw = (await cookies()).get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    return guestCartSchema.parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

async function writeGuestCart(lines: GuestLine[]) {
  const store = await cookies();
  if (lines.length === 0) {
    store.delete(CART_COOKIE);
    return;
  }
  store.set(CART_COOKIE, JSON.stringify(lines), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

async function userCartId(userId: string) {
  const cart = await db.cart.upsert({ where: { userId }, update: {}, create: { userId } });
  return cart.id;
}

export type CartLine = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  imagePosition: string | null;
  quantity: number;
  stock: number;
};

/** Current cart with fresh prices and stock. Products no longer on sale are left out. */
export async function getCartLines(): Promise<CartLine[]> {
  const user = await getSessionUser();
  const wanted = user
    ? (
        await db.cartItem.findMany({
          where: { cart: { userId: user.id } },
          orderBy: { id: "asc" },
        })
      ).map((item) => ({ p: item.productId, q: item.quantity }))
    : await readGuestCart();
  if (wanted.length === 0) return [];

  const products = await db.product.findMany({
    where: { id: { in: wanted.map((line) => line.p) }, status: "active" },
    include: { images: { orderBy: { sortOrder: "asc" }, take: 1 } },
  });

  return wanted.flatMap((line) => {
    const product = products.find((p) => p.id === line.p);
    if (!product) return [];
    return [
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0]?.url ?? null,
        imagePosition: product.images[0]?.position ?? null,
        quantity: line.q,
        stock: product.stock,
      },
    ];
  });
}

export async function getCartCount() {
  const user = await getSessionUser();
  if (user) {
    const sum = await db.cartItem.aggregate({
      where: { cart: { userId: user.id } },
      _sum: { quantity: true },
    });
    return sum._sum.quantity ?? 0;
  }
  return (await readGuestCart()).reduce((total, line) => total + line.q, 0);
}

/** Sets a line's quantity. Zero removes it. Returns the quantity actually set. */
export async function setCartQuantity(productId: string, quantity: number) {
  const product = await db.product.findFirst({
    where: { id: productId, status: "active" },
    select: { stock: true },
  });
  if (!product) return 0;
  const capped = Math.min(Math.max(0, quantity), product.stock, MAX_QUANTITY);

  const user = await getSessionUser();
  if (user) {
    const cartId = await userCartId(user.id);
    if (capped === 0) {
      await db.cartItem.deleteMany({ where: { cartId, productId } });
    } else {
      await db.cartItem.upsert({
        where: { cartId_productId: { cartId, productId } },
        update: { quantity: capped },
        create: { cartId, productId, quantity: capped },
      });
    }
    return capped;
  }

  const lines = (await readGuestCart()).filter((line) => line.p !== productId);
  if (capped > 0) lines.push({ p: productId, q: capped });
  await writeGuestCart(lines.slice(-MAX_LINES));
  return capped;
}

export async function getLineQuantity(productId: string) {
  const lines = await getCartLines();
  return lines.find((line) => line.productId === productId)?.quantity ?? 0;
}

/** Moves a logged-out cart into the user's saved cart after login or registration. */
export async function mergeGuestCart(userId: string) {
  const lines = await readGuestCart();
  if (lines.length === 0) return;

  const cartId = await userCartId(userId);
  const products = await db.product.findMany({
    where: { id: { in: lines.map((line) => line.p) }, status: "active" },
    select: { id: true, stock: true },
  });
  const existing = await db.cartItem.findMany({ where: { cartId } });

  for (const product of products) {
    const guest = lines.find((line) => line.p === product.id)?.q ?? 0;
    const saved = existing.find((item) => item.productId === product.id)?.quantity ?? 0;
    const quantity = Math.min(guest + saved, product.stock, MAX_QUANTITY);
    if (quantity < 1) continue;
    await db.cartItem.upsert({
      where: { cartId_productId: { cartId, productId: product.id } },
      update: { quantity },
      create: { cartId, productId: product.id, quantity },
    });
  }
  await writeGuestCart([]);
}
