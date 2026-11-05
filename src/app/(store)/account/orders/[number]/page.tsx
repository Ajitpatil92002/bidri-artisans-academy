import Link from "next/link";
import { notFound } from "next/navigation";
import { OrderSummary } from "@/components/account/OrderSummary";
import { db } from "@/lib/db";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import { requireUser } from "@/lib/session";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const { number } = await params;
  const user = await requireUser(`/account/orders/${number}`);
  const order = await db.order.findFirst({
    where: { number, userId: user.id },
    include: { items: true, events: true },
  });
  if (!order) notFound();

  return (
    <div className="space-y-5">
      <Link href="/account/orders" className="text-[14px] text-muted hover:text-gold">
        ← All orders
      </Link>
      <div>
        <h2 className="font-serif text-[24px] text-ivory">Order {order.number}</h2>
        <p className="text-[15px] text-gold">{ORDER_STATUS_LABELS[order.status]}</p>
      </div>
      <OrderSummary order={order} />
    </div>
  );
}
