"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { removeFromCart, updateCartQuantity } from "@/app/actions/cart";
import { QuantityStepper } from "@/components/shop/AddToCart";
import { formatPrice } from "@/lib/money";

type Line = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  imagePosition: string | null;
  quantity: number;
  stock: number;
};

export function CartLineRow({ line }: { line: Line }) {
  const [pending, startTransition] = useTransition();
  const shown = Math.min(line.quantity, Math.max(line.stock, 1));

  return (
    <li className="flex gap-4 border-b border-line py-5 first:pt-0">
      <Link
        href={`/shop/${line.slug}`}
        className="relative block size-[96px] shrink-0 overflow-hidden rounded-[6px] bg-card"
      >
        {line.image && (
          <Image
            src={line.image}
            alt={line.name}
            fill
            sizes="96px"
            className="object-cover"
            style={{ objectPosition: line.imagePosition ?? "50% 50%" }}
          />
        )}
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-3">
          <Link href={`/shop/${line.slug}`} className="text-[17px] text-ivory hover:text-gold">
            {line.name}
          </Link>
          <span className="text-[16px] text-ivory">{formatPrice(line.price * line.quantity)}</span>
        </div>
        <p className="mt-1 text-[14px] text-muted">{formatPrice(line.price)} each</p>
        {line.stock === 0 && <p className="mt-1 text-[14px] text-red-300">Sold out. Please remove it.</p>}
        {line.stock > 0 && line.quantity > line.stock && (
          <p className="mt-1 text-[14px] text-red-300">Only {line.stock} left.</p>
        )}
        <div className="mt-3 flex items-center gap-4">
          <QuantityStepper
            value={shown}
            max={Math.min(line.stock, 20)}
            disabled={pending || line.stock === 0}
            onChange={(value) =>
              startTransition(() => updateCartQuantity(line.productId, value))
            }
          />
          <button
            type="button"
            disabled={pending}
            onClick={() => startTransition(() => removeFromCart(line.productId))}
            className="text-[14px] text-muted underline hover:text-red-300"
          >
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}
