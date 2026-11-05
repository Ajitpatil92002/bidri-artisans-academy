import { AddressCard, NewAddress } from "@/components/account/AccountForms";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/session";

export default async function AddressesPage() {
  const user = await requireUser("/account/addresses");
  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
  });

  return (
    <div className="space-y-5">
      <h2 className="font-serif text-[24px] text-ivory">Saved addresses</h2>
      {addresses.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
      <NewAddress startOpen={addresses.length === 0} />
    </div>
  );
}
