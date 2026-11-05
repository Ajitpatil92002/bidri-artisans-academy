import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass, PageContainer, secondaryButtonClass } from "@/components/ui";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Order Confirmed", robots: { index: false } };

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const user = await requireUser(`/account/orders/${number}`);
  const order = await db.order.findFirst({ where: { number, userId: user.id } });
  if (!order) notFound();

  const paid = order.status !== "pending_payment" && order.status !== "cancelled";

  return (
    <PageContainer narrow>
      <div className="rounded-[8px] border border-line bg-ink-2 px-6 py-14 text-center">
        <p className="text-[13px] tracking-[0.3em] text-gold uppercase">
          {paid ? "Order confirmed" : "Order received"}
        </p>
        <h1 className="mt-3 font-serif text-[34px] text-ivory">
          {paid ? "Thank you for your order" : "We're confirming your payment"}
        </h1>
        <p className="mt-3 text-[16px] leading-[1.7] text-muted">
          Order {order.number} · {formatPrice(order.total)}
          <br />A confirmation is on its way to {user.email}.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href={`/account/orders/${order.number}`} className={buttonClass}>
            View Order
          </Link>
          <Link href="/shop" className={secondaryButtonClass}>
            Keep Shopping
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
