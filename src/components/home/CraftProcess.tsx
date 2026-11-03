const steps = [
  {
    title: "Casting",
    text: "Zinc and copper are melted together and poured into moulds to form the base piece.",
  },
  {
    title: "Engraving",
    text: "The artisan scratches the design freehand into the surface with a fine steel chisel.",
  },
  {
    title: "Inlaying",
    text: "Thin silver wire and sheet are hammered into each engraved groove, line by line.",
  },
  {
    title: "Oxidising",
    text: "A paste of Bidar soil turns the alloy jet black, leaving the silver to shine.",
  },
];

export function CraftProcess() {
  return (
    <section className="mx-auto max-w-[1536px] px-4 py-16 lg:px-[80px] lg:py-[96px]">
      <div className="text-center">
        <p className="text-[13px] tracking-[0.3em] text-gold lg:text-[14px]">HOW IT&apos;S MADE</p>
        <h2 className="mt-4 font-serif text-[32px] leading-tight text-ivory lg:text-[40px]">
          From molten metal to heirloom
        </h2>
        <p className="mx-auto mt-4 max-w-[560px] text-[16px] leading-[1.7] text-muted">
          Every piece passes through the same four steps, done by hand in Bidar, just as it has
          been for generations.
        </p>
      </div>

      <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-[56px] lg:grid-cols-4 lg:gap-[28px]">
        {steps.map((step, i) => (
          <li
            key={step.title}
            className="rounded-[8px] border border-line bg-ink-2 p-6 lg:p-[28px]"
          >
            <span className="font-serif text-[40px] leading-none text-gold/80">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-5 text-[19px] text-ivory">{step.title}</h3>
            <p className="mt-2 text-[15px] leading-[1.65] text-muted">{step.text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
