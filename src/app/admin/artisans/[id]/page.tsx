import { notFound } from "next/navigation";
import { ArtisanForm } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/session";

export default async function EditArtisanPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const artisan = await db.artisan.findUnique({ where: { id: (await params).id } });
  if (!artisan) notFound();

  return (
    <>
      <AdminHeading title={artisan.name} />
      <ArtisanForm key={artisan.updatedAt.toISOString()} artisan={artisan} />
    </>
  );
}
