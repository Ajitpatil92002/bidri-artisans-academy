import { notFound } from "next/navigation";
import { OrderSummary } from "@/components/account/OrderSummary";
import { OrderStatusForm } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { panelClass } from "@/components/ui";
import { db } from "@/lib/db";
import { NEXT_STATUSES, ORDER_STATUS_LABELS } from "@/lib/orders";
import { requireAdmin } from "@/lib/session";

export default async function AdminOrderPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  await requireAdmin();
  const { number } = await params;
  const order = await db.order.findUnique({
    where: { number },
    include: {
      items: true,
      events: true,
      user: { select: { name: true, email: true, phone: true } },
    },
  });
  if (!order) notFound();

  const options = NEXT_STATUSES[order.status].map((status) => ({
    value: status,
    label: ORDER_STATUS_LABELS[status],
  }));

  return (
    <>
      <AdminHeading title={`Order ${order.number}`} />
      <p className="mb-5 text-[15px] text-muted">
        {ORDER_STATUS_LABELS[order.status]} · {order.user.name} · {order.user.email}
        {order.user.phone && ` · ${order.user.phone}`}
        {order.razorpayPaymentId && ` · Payment ${order.razorpayPaymentId}`}
      </p>
      {order.needsRefund && (
        <p role="alert" className="mb-5 rounded-[8px] border border-red-400/40 bg-red-950/40 px-4 py-3 text-[15px] text-red-200">
          A payment arrived after this order closed, or for the wrong amount. Refund it in the
          Razorpay dashboard, then mark the order refunded here.
        </p>
      )}
      <OrderSummary order={order} />
      {options.length > 0 && (
        <section className={`${panelClass} mt-5 max-w-[640px]`}>
          <h2 className="mb-4 font-serif text-[22px] text-ivory">Update order</h2>
          <OrderStatusForm
            key={order.updatedAt.toISOString()}
            number={order.number}
            options={options}
            trackingCarrier={order.trackingCarrier}
            trackingNumber={order.trackingNumber}
          />
        </section>
      )}
    </>
  );
}
