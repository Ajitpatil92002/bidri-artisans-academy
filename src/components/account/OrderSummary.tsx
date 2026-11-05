import Image from "next/image";
import { panelClass } from "@/components/ui";
import { formatPrice } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/orders";
import type { Prisma } from "@/generated/prisma/client";

type OrderDetail = Prisma.OrderGetPayload<{ include: { items: true; events: true } }>;

export function OrderSummary({ order }: { order: OrderDetail }) {
  const rows = [
    { label: "Subtotal", value: formatPrice(order.subtotal) },
    { label: "Shipping", value: order.shippingFee === 0 ? "Free" : formatPrice(order.shippingFee) },
  ];

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <section className={panelClass}>
        <h3 className="mb-4 text-[17px] text-ivory">Items</h3>
        <ul className="space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <span className="relative block size-[64px] shrink-0 overflow-hidden rounded-[6px] bg-card">
                {item.image && <Image src={item.image} alt="" fill sizes="64px" className="object-cover" />}
              </span>
              <span className="min-w-0 flex-1 text-[15px] text-ivory">
                {item.name}
                <span className="block text-muted">Qty {item.quantity}</span>
              </span>
              <span className="text-[15px] text-ivory">{formatPrice(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-line pt-4 text-[15px]">
          {rows.map((row) => (
            <div key={row.label} className="flex justify-between">
              <dt className="text-muted">{row.label}</dt>
              <dd className="text-ivory">{row.value}</dd>
            </div>
          ))}
          <div className="flex justify-between text-[17px]">
            <dt className="text-ivory">Total</dt>
            <dd className="text-ivory">{formatPrice(order.total)}</dd>
          </div>
        </dl>
      </section>

      <div className="space-y-5">
        <section className={panelClass}>
          <h3 className="mb-3 text-[17px] text-ivory">Delivering to</h3>
          <address className="text-[15px] leading-[1.6] text-ivory/85 not-italic">
            {order.shipFullName}
            <br />
            {order.shipLine1}
            {order.shipLine2 && (
              <>
                <br />
                {order.shipLine2}
              </>
            )}
            <br />
            {order.shipCity}, {order.shipState} {order.shipPincode}
            <br />
            {order.shipPhone}
          </address>
          {order.trackingNumber && (
            <p className="mt-4 text-[15px] text-ivory/85">
              {order.trackingCarrier}: {order.trackingNumber}
            </p>
          )}
        </section>

        <section className={panelClass}>
          <h3 className="mb-3 text-[17px] text-ivory">Timeline</h3>
          <ol className="space-y-2 text-[14px]">
            {[...order.events]
              .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
              .map((event) => (
                <li key={event.id} className="flex justify-between gap-4">
                  <span className="text-ivory/90">{ORDER_STATUS_LABELS[event.status]}</span>
                  <time className="text-muted" dateTime={event.createdAt.toISOString()}>
                    {event.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </time>
                </li>
              ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
