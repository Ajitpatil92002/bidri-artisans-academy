import { ProductForm } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function NewProductPage() {
  await requireAdmin();
  const [categories, artisans] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.artisan.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <>
      <AdminHeading title="Add product" />
      <ProductForm categories={categories} artisans={artisans} />
    </>
  );
}
