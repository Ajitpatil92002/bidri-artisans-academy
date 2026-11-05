import { formatPrice } from "@/lib/money";

export function Totals({
  subtotal,
  shipping,
  freeAbove,
}: {
  subtotal: number;
  shipping: number;
  freeAbove: number;
}) {
  return (
    <dl className="space-y-2 text-[15px]">
      <div className="flex justify-between">
        <dt className="text-muted">Subtotal</dt>
        <dd className="text-ivory">{formatPrice(subtotal)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-muted">Shipping</dt>
        <dd className="text-ivory">{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
      </div>
      {shipping > 0 && (
        <p className="text-[13px] text-gold">
          Free shipping on orders of {formatPrice(freeAbove)} or more.
        </p>
      )}
      <div className="flex justify-between border-t border-line pt-3 text-[18px]">
        <dt className="text-ivory">Total</dt>
        <dd className="text-ivory">{formatPrice(subtotal + shipping)}</dd>
      </div>
    </dl>
  );
}
