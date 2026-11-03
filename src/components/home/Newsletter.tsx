"use client";

import { useState } from "react";

export function Newsletter() {
  // Not connected yet: signup handling comes in a later feature
  const [sent, setSent] = useState(false);

  return (
    <section className="border-t border-line bg-ink-2">
      <div className="mx-auto flex max-w-[1536px] flex-col items-center px-4 py-16 text-center lg:py-[80px]">
        <h2 className="font-serif text-[30px] leading-tight text-ivory lg:text-[36px]">
          Stories from Bidar, in your inbox
        </h2>
        <p className="mt-3 max-w-[520px] text-[16px] leading-[1.7] text-muted">
          New collections, artisan stories and the history behind the craft. No spam, ever.
        </p>
        {sent ? (
          <p role="status" className="mt-8 text-[16px] text-gold">
            Thank you. Signups open soon, so we&apos;ll be in touch.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
            className="mt-8 flex w-full max-w-[480px] flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              placeholder="Your email address"
              className="h-[48px] flex-1 rounded-full border border-line-2 bg-ink px-5 text-[15px] text-ivory placeholder:text-muted/70 focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              className="h-[48px] rounded-full bg-sand px-7 text-[16px] text-ink transition-colors hover:bg-ivory"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
