"use client";

import { buttonClass, PageContainer } from "@/components/ui";

export default function StoreError({ reset }: { reset: () => void }) {
  return (
    <PageContainer narrow>
      <div className="rounded-[8px] border border-line bg-ink-2 px-6 py-14 text-center">
        <h1 className="font-serif text-[28px] text-ivory">Something went wrong</h1>
        <p className="mt-2 text-[16px] text-muted">Please try again in a moment.</p>
        <button type="button" onClick={reset} className={`${buttonClass} mt-6`}>
          Try again
        </button>
      </div>
    </PageContainer>
  );
}
