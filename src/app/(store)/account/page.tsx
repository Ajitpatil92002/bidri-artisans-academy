import { PasswordForm, ProfileForm } from "@/components/account/AccountForms";
import { panelClass } from "@/components/ui";
import { requireUser } from "@/lib/session";

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="max-w-[560px] space-y-8">
      <section className={panelClass}>
        <h2 className="mb-5 font-serif text-[24px] text-ivory">Profile</h2>
        <ProfileForm name={user.name} phone={user.phone ?? ""} email={user.email} />
      </section>
      <section className={panelClass}>
        <h2 className="mb-5 font-serif text-[24px] text-ivory">Password</h2>
        <PasswordForm />
      </section>
    </div>
  );
}
