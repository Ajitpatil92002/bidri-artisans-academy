import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { PageContainer } from "@/components/ui";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "Your Account", robots: { index: false } };

const links = [
  { href: "/account", label: "Profile" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/addresses", label: "Addresses" },
];

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();

  return (
    <PageContainer>
      <p className="text-[13px] tracking-[0.3em] text-gold uppercase">Your account</p>
      <h1 className="mt-3 font-serif text-[34px] text-ivory lg:text-[44px]">Hello, {user.name}</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-[56px]">
        <nav aria-label="Account" className="flex flex-wrap gap-x-6 gap-y-2 lg:flex-col">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-[16px] text-ivory hover:text-gold">
              {link.label}
            </Link>
          ))}
          {user.role === "admin" && (
            <Link href="/admin" className="text-[16px] text-gold hover:text-sand">
              Admin panel
            </Link>
          )}
          <form action={logout}>
            <button type="submit" className="text-[16px] text-muted hover:text-gold">
              Log out
            </button>
          </form>
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </PageContainer>
  );
}
