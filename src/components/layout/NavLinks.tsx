"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Spacing between nav items, measured from the design
const navGaps = ["", "ml-[53px]", "ml-[50px]", "ml-[46px]", "ml-[45px]"];

export function NavLinks({ links }: { links: { href: string; label: string }[] }) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <nav aria-label="Main" className="absolute left-1/2 hidden -translate-x-[calc(50%-11px)] lg:block">
      <ul className="flex items-center -mt-[2px] text-[17px] text-ivory">
        {links.map((link, i) => (
          <li key={link.href} className={`relative ${navGaps[i]}`}>
            <Link
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className="block py-2 hover:text-gold"
            >
              {link.label}
            </Link>
            {isActive(link.href) && (
              <span className="absolute -right-[8px] -left-[8px] top-[calc(100%+3px)] h-[1.5px] bg-sand" />
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
