import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [product, categories, artisans] = await Promise.all([
    db.product.findUnique({
      where: { id },
      include: { images: { orderBy: { sortOrder: "asc" } } },
    }),
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.artisan.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <>
      <AdminHeading title={product.name} />
      <ProductForm key={product.updatedAt.toISOString()} product={product} categories={categories} artisans={artisans} />
    </>
  );
}
