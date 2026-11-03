import Link from "next/link";
import { LogoMark } from "@/components/icons";

const columns = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "All Jewellery" },
      { href: "/shop", label: "Earrings" },
      { href: "/shop", label: "Gifts" },
    ],
  },
  {
    title: "Discover",
    links: [
      { href: "/about-bidri", label: "About Bidri" },
      { href: "/artisans", label: "Our Artisans" },
      { href: "/journal", label: "Journal" },
    ],
  },
  {
    title: "Help",
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/shipping", label: "Shipping & Returns" },
      { href: "/care", label: "Caring for Bidri" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto grid max-w-[1536px] gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:px-[80px] lg:py-[72px]">
        <div>
          <Link href="/" className="flex items-center gap-[12px] text-gold">
            <LogoMark size={44} />
            <span className="flex flex-col">
              <span className="font-serif text-[24px] leading-none text-ivory">Bidri Craft</span>
              <span className="mt-[7px] text-[9px] leading-none tracking-[0.24em] text-ivory/85">
                HANDCRAFTED IN BIDAR
              </span>
            </span>
          </Link>
          <p className="mt-5 max-w-[320px] text-[15px] leading-[1.7] text-muted">
            Handmade Bidri jewellery in black metal and silver, from the artisans of Bidar,
            Karnataka.
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-[13px] tracking-[0.2em] text-gold">{col.title.toUpperCase()}</h3>
            <ul className="mt-4 space-y-3">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-[15px] text-ivory/85 hover:text-gold">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-[1536px] flex-col gap-2 px-4 py-6 text-[13px] text-muted sm:flex-row sm:justify-between lg:px-[80px]">
          <p>© 2026 Bidri Craft · bidriart.com</p>
          <p>Secure payments by Razorpay</p>
        </div>
      </div>
    </footer>
  );
}
