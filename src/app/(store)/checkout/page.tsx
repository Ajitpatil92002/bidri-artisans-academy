import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CheckoutPanel } from "@/components/shop/CheckoutPanel";
import { Totals } from "@/components/shop/Totals";
import { PageContainer, PageHeader, panelClass } from "@/components/ui";
import { getCartLines } from "@/lib/cart";
import { db } from "@/lib/db";
import { formatPrice, shippingFor } from "@/lib/money";
import { requireUser } from "@/lib/session";
import { getShippingSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default async function CheckoutPage() {
  const user = await requireUser("/checkout");
  const [lines, addresses, { fee, freeAbove }] = await Promise.all([
    getCartLines(),
    db.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    }),
    getShippingSettings(),
  ]);

  if (lines.length === 0 || lines.some((line) => line.quantity > line.stock)) redirect("/cart");

  const subtotal = lines.reduce((sum, line) => sum + line.price * line.quantity, 0);

  return (
    <PageContainer>
      <PageHeader title="Checkout" />
      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-[56px]">
        <CheckoutPanel addresses={addresses} />
        <aside className={`${panelClass} h-fit`}>
          <h2 className="mb-4 font-serif text-[24px] text-ivory">Your order</h2>
          <ul className="mb-4 space-y-2 text-[15px]">
            {lines.map((line) => (
              <li key={line.productId} className="flex justify-between gap-3">
                <span className="text-ivory/90">
                  {line.name} × {line.quantity}
                </span>
                <span className="text-ivory">{formatPrice(line.price * line.quantity)}</span>
              </li>
            ))}
          </ul>
          <Totals
            subtotal={subtotal}
            shipping={shippingFor(subtotal, fee, freeAbove)}
            freeAbove={freeAbove}
          />
        </aside>
      </div>
    </PageContainer>
  );
}
