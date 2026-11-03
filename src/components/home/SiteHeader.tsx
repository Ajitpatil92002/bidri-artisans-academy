import Link from "next/link";
import { BagIcon, LogoMark, SearchIcon, UserIcon } from "@/components/icons";
import { MobileMenu } from "./MobileMenu";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about-bidri", label: "About Bidri" },
  { href: "/artisans", label: "Our Artisans" },
  { href: "/contact", label: "Contact" },
];

// Spacing between nav items, measured from the design
const navGaps = ["", "ml-[53px]", "ml-[50px]", "ml-[46px]", "ml-[45px]"];

export function SiteHeader() {
  return (
    <header className="relative z-20 border-b border-line bg-ink-2">
      <div className="mx-auto flex h-[64px] max-w-[1536px] items-center justify-between px-4 lg:h-[80px] lg:pr-[64px] lg:pl-[64px]">
        <Link href="/" className="flex items-center gap-[14px] text-gold" aria-label="Bidri Craft home">
          <LogoMark className="size-[42px] lg:size-[55px] lg:-translate-y-[2px]" />
          <span className="flex flex-col lg:-translate-y-[1px]">
            <span className="font-serif text-[24px] leading-none text-ivory lg:text-[32px]">
              Bidri Craft
            </span>
            <span className="mt-[7px] text-[9px] leading-none tracking-[0.24em] text-ivory/85 lg:mt-[6px] lg:text-[9.5px] lg:tracking-[0.38em]">
              HANDCRAFTED IN BIDAR
            </span>
          </span>
        </Link>

        <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-[calc(50%-11px)] lg:block">
          <ul className="flex items-center -mt-[2px] text-[17px] text-ivory">
            {navLinks.map((link, i) => (
              <li key={link.href} className={`relative ${navGaps[i]}`}>
                <Link
                  href={link.href}
                  aria-current={i === 0 ? "page" : undefined}
                  className="block py-2 hover:text-gold"
                >
                  {link.label}
                </Link>
                {i === 0 && (
                  <span className="absolute -right-[8px] -left-[8px] top-[calc(100%+3px)] h-[1.5px] bg-sand" />
                )}
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1 text-ivory lg:gap-[35px]">
          <button type="button" aria-label="Search" className="hidden p-1 hover:text-gold sm:block">
            <SearchIcon size={28} />
          </button>
          <Link href="/account" aria-label="Account" className="hidden p-1 hover:text-gold sm:block">
            <UserIcon size={28} />
          </Link>
          <Link href="/cart" aria-label="Cart, 0 items" className="relative p-1 hover:text-gold">
            <BagIcon size={28} />
            <span className="absolute -top-[5px] -right-[7px] flex size-[20px] items-center justify-center rounded-full bg-sand text-[11px] font-medium text-ink">
              0
            </span>
          </Link>
          <MobileMenu links={navLinks} />
        </div>
      </div>
    </header>
  );
}
