import { ShippingForm } from "@/components/admin/AdminForms";
import { AdminHeading } from "@/components/admin/AdminUi";
import { requireAdmin } from "@/lib/session";
import { getShippingSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  await requireAdmin();
  const { fee, freeAbove } = await getShippingSettings();

  return (
    <>
      <AdminHeading title="Settings" />
      <h2 className="mb-4 font-serif text-[22px] text-ivory">Shipping</h2>
      <ShippingForm fee={fee} freeAbove={freeAbove} />
    </>
  );
}
