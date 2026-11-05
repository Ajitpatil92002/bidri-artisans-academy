import { ArtisanForm } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { requireAdmin } from "@/lib/session";

export default async function NewArtisanPage() {
  await requireAdmin();
  return (
    <>
      <AdminHeading title="Add artisan" />
      <ArtisanForm />
    </>
  );
}
