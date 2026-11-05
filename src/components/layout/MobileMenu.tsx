"use client";

import Link from "next/link";
import { useState } from "react";
import { CloseIcon, MenuIcon } from "@/components/icons";

type Props = { links: { href: string; label: string }[]; loggedIn: boolean };

export function MobileMenu({ links, loggedIn }: Props) {
  const [open, setOpen] = useState(false);
  const allLinks = [
    ...links,
    { href: "/search", label: "Search" },
    loggedIn ? { href: "/account", label: "Your Account" } : { href: "/login", label: "Log In" },
  ];

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="ml-2 p-1 hover:text-gold"
      >
        {open ? <CloseIcon size={28} /> : <MenuIcon size={28} />}
      </button>
      {open && (
        <nav
          aria-label="Mobile"
          className="absolute inset-x-0 top-full border-b border-line bg-ink-2 px-4 pb-4"
        >
          <ul className="flex flex-col">
            {allLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b border-line/60 py-3 text-[17px] text-ivory hover:text-gold"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
