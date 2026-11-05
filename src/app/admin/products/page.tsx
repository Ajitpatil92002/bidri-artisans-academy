import Link from "next/link";
import { AdminHeading, AdminTable, Td } from "@/components/admin/AdminUi";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { requireAdmin } from "@/lib/session";

export default async function AdminProductsPage() {
  await requireAdmin();
  const products = await db.product.findMany({
    orderBy: { updatedAt: "desc" },
    include: { category: true },
  });

  return (
    <>
      <AdminHeading title="Products" href="/admin/products/new" action="Add Product" />
      <AdminTable headings={["Name", "Category", "Price", "Stock", "Status"]}>
        {products.map((product) => (
          <tr key={product.id}>
            <Td>
              <Link href={`/admin/products/${product.id}`} className="text-ivory underline hover:text-gold">
                {product.name}
              </Link>
            </Td>
            <Td>{product.category?.name ?? "—"}</Td>
            <Td>{formatPrice(product.price)}</Td>
            <Td>{product.stock}</Td>
            <Td>{product.status}</Td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}
