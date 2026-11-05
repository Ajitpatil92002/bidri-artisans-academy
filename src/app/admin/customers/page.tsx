import { AdminHeading, AdminTable, Td } from "@/components/admin/AdminUi";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminCustomersPage() {
  await requireAdmin();
  const [customers, subscribers] = await Promise.all([
    db.user.findMany({
      where: { role: "customer" },
      orderBy: { createdAt: "desc" },
      take: 200,
      include: { _count: { select: { orders: true } } },
    }),
    db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" }, take: 500 }),
  ]);

  return (
    <>
      <AdminHeading title="Customers" />
      <AdminTable headings={["Name", "Email", "Phone", "Orders", "Joined"]}>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <Td>{customer.name}</Td>
            <Td>{customer.email}</Td>
            <Td>{customer.phone ?? "—"}</Td>
            <Td>{customer._count.orders}</Td>
            <Td>{customer.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</Td>
          </tr>
        ))}
      </AdminTable>

      <h2 className="mt-10 mb-4 font-serif text-[24px] text-ivory">
        Newsletter ({subscribers.length})
      </h2>
      <AdminTable headings={["Email", "Joined"]}>
        {subscribers.map((subscriber) => (
          <tr key={subscriber.id}>
            <Td>{subscriber.email}</Td>
            <Td>{subscriber.createdAt.toLocaleDateString("en-IN", { dateStyle: "medium" })}</Td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}
