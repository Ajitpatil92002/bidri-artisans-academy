import { CategoryForm } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { panelClass } from "@/components/ui";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await db.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

  return (
    <>
      <AdminHeading title="Categories" />
      <div className="max-w-[820px] space-y-5">
        <section className={panelClass}>
          <h2 className="mb-4 font-serif text-[22px] text-ivory">Add a category</h2>
          <CategoryForm key={categories.length} />
        </section>
        {categories.map((category) => (
          <section key={category.id} className={panelClass}>
            <CategoryForm key={category.updatedAt.toISOString()} category={category} />
          </section>
        ))}
      </div>
    </>
  );
}
