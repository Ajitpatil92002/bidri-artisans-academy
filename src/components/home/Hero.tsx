import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { HeroCarousel, type HeroSlide } from "./HeroCarousel";

const slides: HeroSlide[] = [
  {
    src: "/images/banners/hero-teardrop.webp",
    alt: "Bidri teardrop earrings with silver leaf inlay, resting on dark stone beside a Bidri box",
    position: "62% 45%",
  },
  {
    src: "/images/banners/fan-heart.webp",
    alt: "Heart-shaped Bidri earrings with a silver fan pattern, beside a Bidri box",
    position: "62% 45%",
  },
  {
    src: "/images/banners/star.webp",
    alt: "Star-shaped Bidri earrings with silver inlay on dark stone",
    position: "62% 45%",
  },
];

export function Hero() {
  return (
    <section className="relative h-[calc(100svh-65px)] min-h-[520px] overflow-hidden bg-ink lg:h-[calc(100svh-81px)] lg:min-h-[560px]">
      <HeroCarousel slides={slides} />

      <div className="pointer-events-none relative mx-auto flex h-full max-w-[1536px] flex-col justify-center px-6 pb-8 lg:px-[142px] lg:pb-[24px]">
        <p className="text-[13px] tracking-[0.3em] text-gold lg:text-[18px] lg:tracking-[0.333em] lg:leading-[22px]">
          BIDRI FROM BIDAR
        </p>
        <h1 className="mt-4 font-serif text-[44px] leading-[1.02] text-ivory lg:mt-[18px] lg:text-[72px] lg:leading-[76px]">
          Timeless
          <br />
          Bidri Jewellery
        </h1>
        <p className="mt-5 max-w-[360px] lg:max-w-[440px] text-[17px] leading-[1.35] text-ivory/90 lg:mt-[26px] lg:text-[22px] lg:leading-[32px]">
          Handcrafted treasures in black metal, with intricate silver inlay — a legacy from
          Bidar, Karnataka.
        </p>
        <Link
          href="/shop"
          className="pointer-events-auto mt-8 inline-flex h-[45px] w-fit items-center gap-[9px] rounded-full bg-sand pr-[27px] pl-[29px] text-[19px] text-ink transition-colors hover:bg-ivory lg:mt-[34px] lg:h-[54px] lg:pr-[34px] lg:pl-[34px] lg:text-[20px]"
        >
          Shop Collection
          <ArrowRightIcon size={20} />
        </Link>
      </div>
    </section>
  );
}
