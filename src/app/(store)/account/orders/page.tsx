import Link from "next/link";
import { EmptyState } from "@/components/ui";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import { requireUser } from "@/lib/session";

export default async function OrdersPage() {
  const user = await requireUser("/account/orders");
  const orders = await db.order.findMany({
    where: { userId: user.id, status: { not: "pending_payment" } },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { items: true } } },
  });

  if (orders.length === 0) {
    return (
      <EmptyState
        title="No orders yet"
        text="When you buy something, it will show up here."
        href="/shop"
        action="Browse the collection"
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-[24px] text-ivory">Orders</h2>
      <ul className="space-y-3">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/account/orders/${order.number}`}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[8px] border border-line bg-ink-2 p-5 hover:border-gold"
            >
              <span>
                <span className="block text-[16px] text-ivory">{order.number}</span>
                <span className="text-[14px] text-muted">
                  {order.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })} ·{" "}
                  {order._count.items} {order._count.items === 1 ? "item" : "items"}
                </span>
              </span>
              <span className="text-right">
                <span className="block text-[16px] text-ivory">{formatPrice(order.total)}</span>
                <span className="text-[14px] text-gold">{ORDER_STATUS_LABELS[order.status]}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
