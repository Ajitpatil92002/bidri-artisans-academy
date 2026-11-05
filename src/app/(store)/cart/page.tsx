import type { Metadata } from "next";
import Link from "next/link";
import { CartLineRow } from "@/components/shop/CartLineRow";
import { Totals } from "@/components/shop/Totals";
import { buttonClass, EmptyState, PageContainer, PageHeader, panelClass } from "@/components/ui";
import { getCartLines } from "@/lib/cart";
import { shippingFor } from "@/lib/money";
import { getShippingSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Your Cart", robots: { index: false } };

export default async function CartPage() {
  const [lines, { fee, freeAbove }] = await Promise.all([getCartLines(), getShippingSettings()]);

  if (lines.length === 0) {
    return (
      <PageContainer narrow>
        <PageHeader title="Your cart" />
        <EmptyState
          title="Your cart is empty"
          text="Find a piece you love in the collection."
          href="/shop"
          action="Browse the collection"
        />
      </PageContainer>
    );
  }

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);
  const blocked = lines.some((line) => line.quantity > line.stock);

  return (
    <PageContainer>
      <PageHeader title="Your cart" />
      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-[56px]">
        <ul>
          {lines.map((line) => (
            <CartLineRow key={line.productId} line={line} />
          ))}
        </ul>
        <aside className={`${panelClass} h-fit`}>
          <h2 className="mb-4 font-serif text-[24px] text-ivory">Summary</h2>
          <Totals
            subtotal={subtotal}
            shipping={shippingFor(subtotal, fee, freeAbove)}
            freeAbove={freeAbove}
          />
          {blocked ? (
            <p className="mt-5 text-[15px] text-red-300">
              Please fix the items marked above before checking out.
            </p>
          ) : (
            <Link href="/checkout" className={`${buttonClass} mt-6 w-full`}>
              Checkout
            </Link>
          )}
          <p className="mt-3 text-center text-[13px] text-muted">
            You&apos;ll need an account to complete your order.
          </p>
        </aside>
      </div>
    </PageContainer>
  );
}
