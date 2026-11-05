import Link from "next/link";
import { BagIcon, LogoMark, UserIcon } from "@/components/icons";
import { getCartCount } from "@/lib/cart";
import { getSessionUser } from "@/lib/session";
import { HeaderSearch } from "./HeaderSearch";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/about-bidri", label: "About Bidri" },
  { href: "/artisans", label: "Our Artisans" },
  { href: "/contact", label: "Contact" },
];

export async function SiteHeader() {
  const [user, cartCount] = await Promise.all([getSessionUser(), getCartCount()]);

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

        <NavLinks links={navLinks} />

        <div className="flex items-center gap-1 text-ivory lg:gap-[35px]">
          <HeaderSearch />
          <Link
            href={user ? "/account" : "/login"}
            aria-label={user ? "Your account" : "Log in"}
            className="hidden p-1 hover:text-gold sm:block"
          >
            <UserIcon size={28} />
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
            className="relative p-1 hover:text-gold"
          >
            <BagIcon size={28} />
            <span className="absolute -top-[5px] -right-[7px] flex size-[20px] items-center justify-center rounded-full bg-sand text-[11px] font-medium text-ink">
              {cartCount}
            </span>
          </Link>
          <MobileMenu links={navLinks} loggedIn={Boolean(user)} />
        </div>
      </div>
    </header>
  );
}
