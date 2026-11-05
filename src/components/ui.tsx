import Link from "next/link";

export const buttonClass =
  "inline-flex h-[48px] items-center justify-center gap-2 rounded-full bg-sand px-7 text-[16px] text-ink transition-colors hover:bg-ivory disabled:cursor-not-allowed disabled:opacity-50";

export const secondaryButtonClass =
  "inline-flex h-[48px] items-center justify-center gap-2 rounded-full border border-line-2 px-7 text-[16px] text-ivory transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-50";

export const inputClass =
  "h-[48px] w-full rounded-[8px] border border-line-2 bg-ink px-4 text-[16px] text-ivory placeholder:text-muted/70 focus:border-gold focus:outline-none";

export const panelClass = "rounded-[8px] border border-line bg-ink-2 p-5 lg:p-7";

export function PageContainer({ children, narrow }: { children: React.ReactNode; narrow?: boolean }) {
  return (
    <main
      className={`mx-auto min-h-[60vh] px-4 py-10 lg:px-[80px] lg:py-[64px] ${
        narrow ? "max-w-[760px]" : "max-w-[1536px]"
      }`}
    >
      {children}
    </main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
}) {
  return (
    <header className="mb-8 lg:mb-10">
      {eyebrow && <p className="text-[13px] tracking-[0.3em] text-gold uppercase">{eyebrow}</p>}
      <h1 className="mt-3 font-serif text-[34px] leading-tight text-ivory lg:text-[44px]">{title}</h1>
      {intro && <p className="mt-3 max-w-[640px] text-[16px] leading-[1.7] text-muted">{intro}</p>}
    </header>
  );
}

export function EmptyState({
  title,
  text,
  href,
  action,
}: {
  title: string;
  text?: string;
  href?: string;
  action?: string;
}) {
  return (
    <div className="rounded-[8px] border border-line bg-ink-2 px-6 py-14 text-center">
      <h2 className="font-serif text-[24px] text-ivory">{title}</h2>
      {text && <p className="mx-auto mt-2 max-w-[440px] text-[16px] leading-[1.7] text-muted">{text}</p>}
      {href && action && (
        <Link href={href} className={`${buttonClass} mt-6`}>
          {action}
        </Link>
      )}
    </div>
  );
}

/** Renders stored text: blank lines split paragraphs, and "## " starts a heading. */
export function Prose({ text }: { text: string }) {
  return (
    <div className="space-y-5 text-[17px] leading-[1.8] text-ivory/85">
      {text.split(/\n\s*\n/).map((block, i) =>
        block.startsWith("## ") ? (
          <h2 key={i} className="pt-3 font-serif text-[26px] leading-snug text-ivory">
            {block.slice(3)}
          </h2>
        ) : (
          <p key={i} className="whitespace-pre-line">
            {block}
          </p>
        )
      )}
    </div>
  );
}
