import Link from "next/link";
import { AdminHeading, AdminTable, Td } from "@/components/admin/AdminUi";
import { OrderStatus } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { ORDER_STATUS_LABELS, releaseExpiredOrders } from "@/lib/orders";
import { requireAdmin } from "@/lib/session";

const statuses = Object.values(OrderStatus);

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  await requireAdmin();
  await releaseExpiredOrders();
  const { status } = await searchParams;
  const active = statuses.find((value) => value === status);

  const orders = await db.order.findMany({
    where: { status: active },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { user: { select: { name: true, email: true } } },
  });

  return (
    <>
      <AdminHeading title="Orders" />
      <nav aria-label="Filter by status" className="mb-5 flex flex-wrap gap-x-4 gap-y-2 text-[14px]">
        <Link href="/admin/orders" className={active ? "text-muted hover:text-gold" : "text-gold"}>
          All
        </Link>
        {statuses.map((value) => (
          <Link
            key={value}
            href={`/admin/orders?status=${value}`}
            className={value === active ? "text-gold" : "text-muted hover:text-gold"}
          >
            {ORDER_STATUS_LABELS[value]}
          </Link>
        ))}
      </nav>
      <AdminTable headings={["Order", "Customer", "Date", "Total", "Status"]}>
        {orders.map((order) => (
          <tr key={order.id}>
            <Td>
              <Link href={`/admin/orders/${order.number}`} className="text-ivory underline hover:text-gold">
                {order.number}
              </Link>
            </Td>
            <Td>{order.user.name}</Td>
            <Td>{order.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</Td>
            <Td>{formatPrice(order.total)}</Td>
            <Td>
              {ORDER_STATUS_LABELS[order.status]}
              {order.needsRefund && <span className="ml-2 text-red-300">Refund needed</span>}
            </Td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}
