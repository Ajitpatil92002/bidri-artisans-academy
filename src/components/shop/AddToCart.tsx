"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { addToCart } from "@/app/actions/cart";
import { buttonClass } from "@/components/ui";

const MAX_PER_ORDER = 20;

export function QuantityStepper({
  value,
  max,
  onChange,
  disabled,
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) {
  const buttonStyle =
    "flex size-[44px] items-center justify-center text-[20px] text-ivory hover:text-gold disabled:opacity-40";
  return (
    <div className="inline-flex items-center rounded-full border border-line-2">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={disabled || value <= 1}
        onClick={() => onChange(value - 1)}
        className={buttonStyle}
      >
        −
      </button>
      <span aria-live="polite" className="w-[32px] text-center text-[16px] text-ivory">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={disabled || value >= max}
        onClick={() => onChange(value + 1)}
        className={buttonStyle}
      >
        +
      </button>
    </div>
  );
}

export function AddToCart({ productId, stock }: { productId: string; stock: number }) {
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  if (stock === 0) {
    return <p className="text-[16px] text-muted">Sold out for now.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4">
        <QuantityStepper
          value={quantity}
          max={Math.min(stock, MAX_PER_ORDER)}
          onChange={setQuantity}
          disabled={pending}
        />
        <button
          type="button"
          disabled={pending}
          className={buttonClass}
          onClick={() =>
            startTransition(async () => {
              setMessage(await addToCart(productId, quantity));
            })
          }
        >
          {pending ? "Adding…" : "Add to Cart"}
        </button>
      </div>
      {message && (
        <p role="status" className="mt-3 text-[15px] text-sand">
          {message}{" "}
          <Link href="/cart" className="underline hover:text-ivory">
            View cart
          </Link>
        </p>
      )}
    </div>
  );
}
