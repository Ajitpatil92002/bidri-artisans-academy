import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export function CraftStory() {
  return (
    <section className="border-t border-line bg-ink-2">
      <div className="mx-auto grid max-w-[1536px] items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:gap-[72px] lg:px-[80px] lg:py-[96px]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-white/[0.07]">
          <Image
            src="/images/products/teardrop-earrings.webp"
            alt="Close-up of silver leaf inlay on blackened Bidri teardrop earrings"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="max-w-[560px]">
          <p className="text-[13px] tracking-[0.3em] text-gold lg:text-[14px]">THE ART OF BIDRI</p>
          <h2 className="mt-4 font-serif text-[32px] leading-[1.15] text-ivory lg:text-[44px]">
            Six centuries of silver,
            <br />
            set in black metal
          </h2>
          <div className="mt-6 space-y-4 text-[16px] leading-[1.7] text-muted lg:text-[17px]">
            <p>
              Bidri began in the 14th century in Bidar, under the Bahmani Sultans. Craftsmen cast
              an alloy of zinc and copper, engrave it by hand, and hammer fine silver into every
              groove.
            </p>
            <p>
              The final step is the one that gives Bidri its name and its colour: the piece is
              rubbed with a paste of soil from Bidar fort, which turns the metal a deep, lasting
              black while the silver stays bright.
            </p>
          </div>
          <Link
            href="/about-bidri"
            className="mt-8 inline-flex items-center gap-[10px] border-b border-sand/60 pb-1 text-[16px] text-ivory hover:border-sand hover:text-gold"
          >
            Discover the craft
            <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
