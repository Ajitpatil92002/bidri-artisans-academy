"use client";

import { useState } from "react";
import { CloseIcon, SearchIcon } from "@/components/icons";

export function HeaderSearch() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label={open ? "Close search" : "Search"}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="hidden p-1 hover:text-gold sm:block"
      >
        {open ? <CloseIcon size={28} /> : <SearchIcon size={28} />}
      </button>
      {open && (
        <form
          action="/search"
          role="search"
          className="absolute inset-x-0 top-full border-b border-line bg-ink-2 px-4 py-4"
        >
          <div className="mx-auto flex max-w-[640px] gap-3">
            <input
              type="search"
              name="q"
              required
              autoFocus
              aria-label="Search products"
              placeholder="Search earrings, motifs…"
              className="h-[46px] flex-1 rounded-full border border-line-2 bg-ink px-5 text-[16px] text-ivory placeholder:text-muted/70 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="h-[46px] rounded-full bg-sand px-6 text-[16px] text-ink hover:bg-ivory"
            >
              Search
            </button>
          </div>
        </form>
      )}
    </>
  );
}
