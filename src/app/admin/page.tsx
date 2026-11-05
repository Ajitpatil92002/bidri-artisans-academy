import Link from "next/link";
import { AdminHeading, Stat } from "@/components/admin/AdminUi";
import { panelClass } from "@/components/ui";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { ORDER_STATUS_LABELS, releaseExpiredOrders } from "@/lib/orders";
import { requireAdmin } from "@/lib/session";

const LOW_STOCK = 2;

export default async function AdminDashboard() {
  await requireAdmin();
  await releaseExpiredOrders();

  const paidStatuses = ["paid", "packed", "shipped", "delivered"] as const;
  const [sales, toFulfil, refunds, recent, lowStock] = await Promise.all([
    db.order.aggregate({
      where: { status: { in: [...paidStatuses] } },
      _sum: { total: true },
      _count: true,
    }),
    db.order.count({ where: { status: { in: ["paid", "packed"] } } }),
    db.order.count({ where: { needsRefund: true } }),
    db.order.findMany({
      where: { status: { not: "pending_payment" } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    db.product.findMany({
      where: { status: "active", stock: { lte: LOW_STOCK } },
      orderBy: { stock: "asc" },
      take: 8,
    }),
  ]);

  return (
    <>
      <AdminHeading title="Dashboard" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Total sales" value={formatPrice(sales._sum.total ?? 0)} />
        <Stat label="Paid orders" value={String(sales._count)} />
        <Stat label="To fulfil" value={String(toFulfil)} />
        <Stat label="Need a refund" value={String(refunds)} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-2">
        <section className={panelClass}>
          <h2 className="mb-4 font-serif text-[22px] text-ivory">Recent orders</h2>
          {recent.length === 0 && <p className="text-[15px] text-muted">No orders yet.</p>}
          <ul className="space-y-2 text-[15px]">
            {recent.map((order) => (
              <li key={order.id} className="flex justify-between gap-4">
                <Link href={`/admin/orders/${order.number}`} className="text-ivory hover:text-gold">
                  {order.number}
                </Link>
                <span className="text-muted">
                  {ORDER_STATUS_LABELS[order.status]} · {formatPrice(order.total)}
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section className={panelClass}>
          <h2 className="mb-4 font-serif text-[22px] text-ivory">Low stock</h2>
          {lowStock.length === 0 && <p className="text-[15px] text-muted">Everything is stocked.</p>}
          <ul className="space-y-2 text-[15px]">
            {lowStock.map((product) => (
              <li key={product.id} className="flex justify-between gap-4">
                <Link href={`/admin/products/${product.id}`} className="text-ivory hover:text-gold">
                  {product.name}
                </Link>
                <span className="text-muted">{product.stock} left</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
