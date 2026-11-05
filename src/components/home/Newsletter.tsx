"use client";

import { subscribeToNewsletter } from "@/app/actions/contact";
import { FormMessage, SubmitButton, useSubmit } from "@/components/forms";

export function Newsletter() {
  const [state, onSubmit, pending] = useSubmit(subscribeToNewsletter);
  const error = state.fieldErrors?.email?.[0];

  return (
    <section className="border-t border-line bg-ink-2">
      <div className="mx-auto flex max-w-[1536px] flex-col items-center px-4 py-16 text-center lg:py-[80px]">
        <h2 className="font-serif text-[30px] leading-tight text-ivory lg:text-[36px]">
          Stories from Bidar, in your inbox
        </h2>
        <p className="mt-3 max-w-[520px] text-[16px] leading-[1.7] text-muted">
          New collections, artisan stories and the history behind the craft. No spam, ever.
        </p>
        {state.success ? (
          <div className="mt-8">
            <FormMessage state={state} />
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 w-full max-w-[480px]">
            <div className="flex flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
                id="newsletter-email"
                name="email"
                type="email"
                required
                placeholder="Your email address"
                className="h-[48px] flex-1 rounded-full border border-line-2 bg-ink px-5 text-[15px] text-ivory placeholder:text-muted/70 focus:border-gold focus:outline-none"
              />
              {/* Hidden from people; catches bots */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
              <SubmitButton pending={pending}>Subscribe</SubmitButton>
            </div>
            {error && <p className="mt-2 text-[14px] text-red-300">{error}</p>}
            {state.error && (
              <div className="mt-3">
                <FormMessage state={state} />
              </div>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
