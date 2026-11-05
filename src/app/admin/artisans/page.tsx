import Link from "next/link";
import { AdminHeading, AdminTable, Td } from "@/components/admin/AdminUi";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminArtisansPage() {
  await requireAdmin();
  const artisans = await db.artisan.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <AdminHeading title="Artisans" href="/admin/artisans/new" action="Add Artisan" />
      <AdminTable headings={["Name", "Products", "Status"]}>
        {artisans.map((artisan) => (
          <tr key={artisan.id}>
            <Td>
              <Link href={`/admin/artisans/${artisan.id}`} className="text-ivory underline hover:text-gold">
                {artisan.name}
              </Link>
            </Td>
            <Td>{artisan._count.products}</Td>
            <Td>{artisan.isPublished ? "Published" : "Draft"}</Td>
          </tr>
        ))}
      </AdminTable>
    </>
  );
}
