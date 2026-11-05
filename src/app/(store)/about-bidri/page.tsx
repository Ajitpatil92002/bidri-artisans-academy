import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CraftProcess } from "@/components/home/CraftProcess";
import { buttonClass, PageContainer, PageHeader, Prose } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Bidri",
  description: "The history and making of Bidri, the black metal and silver craft of Bidar.",
};

const story = `Bidri is a metal inlay craft from Bidar, in northern Karnataka. It began in the 14th century under the Bahmani Sultans and has been passed down through generations of artisans.

## Black metal, bright silver

Each piece starts as an alloy of zinc and copper. Artisans engrave a design into the surface by hand, then hammer fine silver into every groove.

## The colour comes last

The alloy isn't black until the very end. A paste made with soil from Bidar fort is rubbed over the piece, turning the metal a deep, lasting black, while the silver stays bright.`;

export default function AboutBidriPage() {
  return (
    <>
      <PageContainer narrow>
        <PageHeader eyebrow="The craft" title="About Bidri" />
        <div className="relative mb-8 aspect-[2/1] overflow-hidden rounded-[8px] border border-white/[0.07]">
          <Image
            src="/images/banners/hero-teardrop.webp"
            alt="Bidri earrings beside an inlaid Bidri box"
            fill
            priority
            sizes="(min-width: 760px) 760px, 100vw"
            className="object-cover"
          />
        </div>
        <Prose text={story} />
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/shop" className={buttonClass}>
            Shop the Collection
          </Link>
          <Link href="/journal" className="self-center text-[16px] text-ivory underline hover:text-gold">
            Read the journal
          </Link>
        </div>
      </PageContainer>
      <CraftProcess />
    </>
  );
}
