import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";

export function GiftBanner() {
  return (
    <section className="mx-auto max-w-[1536px] px-4 pb-16 lg:px-[80px] lg:pb-[96px]">
      <div className="relative overflow-hidden rounded-[8px] border border-white/[0.07]">
        <Image
          src="/images/banners/star.webp"
          alt="Star-shaped Bidri earrings on dark stone"
          fill
          sizes="(min-width: 1536px) 1376px, 100vw"
          className="object-cover object-[60%_50%]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 via-40% to-transparent" />

        <div className="relative flex min-h-[360px] max-w-[560px] flex-col justify-center px-6 py-12 lg:min-h-[400px] lg:px-[64px]">
          <p className="text-[13px] tracking-[0.3em] text-gold lg:text-[14px]">THOUGHTFUL GIFTING</p>
          <h2 className="mt-4 font-serif text-[32px] leading-[1.15] text-ivory lg:text-[40px]">
            A gift that carries a story
          </h2>
          <p className="mt-4 text-[16px] leading-[1.7] text-muted">
            Each piece arrives gift-ready, with a card telling the story of the craft and the hands
            that made it. Made for weddings, festivals and the people you love.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-[45px] w-fit items-center gap-[9px] rounded-full bg-sand px-[28px] text-[17px] text-ink transition-colors hover:bg-ivory"
          >
            Shop Gifts
            <ArrowRightIcon size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
