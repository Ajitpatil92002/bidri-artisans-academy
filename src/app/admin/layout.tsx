import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/icons";
import { requireAdmin } from "@/lib/session";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s — Bidri Craft Admin" },
  robots: { index: false },
};

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/artisans", label: "Artisans" },
  { href: "/admin/posts", label: "Journal" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/messages", label: "Messages" },
  { href: "/admin/settings", label: "Settings" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-ink-2 p-5 lg:border-r lg:border-b-0">
        <Link href="/admin" className="flex items-center gap-2 text-gold">
          <LogoMark size={32} />
          <span className="font-serif text-[20px] text-ivory">Admin</span>
        </Link>
        <nav aria-label="Admin" className="mt-5 flex flex-wrap gap-x-5 gap-y-2 lg:flex-col">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-[15px] text-ivory/85 hover:text-gold">
              {link.label}
            </Link>
          ))}
          <Link href="/" className="text-[15px] text-muted hover:text-gold lg:mt-4">
            View store
          </Link>
        </nav>
      </aside>
      <main className="min-w-0 p-5 lg:p-10">{children}</main>
    </div>
  );
}
