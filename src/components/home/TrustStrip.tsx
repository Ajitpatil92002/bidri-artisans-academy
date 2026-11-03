import type { ComponentType } from "react";
import { GiftIcon, HandIcon, LeafIcon, ShieldCheckIcon } from "@/components/icons";

const items: { icon: ComponentType<{ size?: number }>; title: string; sub: string }[] = [
  { icon: HandIcon, title: "Authentic Bidri Craft", sub: "From Bidar, Karnataka" },
  { icon: LeafIcon, title: "Handcrafted", sub: "By Skilled Artisans" },
  { icon: ShieldCheckIcon, title: "Heritage Art", sub: "With a Timeless Legacy" },
  { icon: GiftIcon, title: "Thoughtful Gifting", sub: "Unique & Meaningful" },
];

export function TrustStrip() {
  return (
    <section aria-label="Why Bidri Craft" className="border-y border-line bg-ink-2">
      <ul className="mx-auto grid max-w-[1536px] grid-cols-2 gap-y-6 px-4 py-6 lg:h-[88px] lg:grid-cols-[370fr_323fr_349fr_334fr] lg:gap-y-0 lg:px-[80px] lg:py-0">
        {items.map(({ icon: Icon, title, sub }, i) => (
          <li
            key={title}
            className={`flex items-center justify-center lg:justify-center ${
              i > 0 ? "lg:border-l lg:border-line-2" : ""
            } ${i === 3 ? "lg:pl-[19px]" : ""} lg:my-[25px]`}
          >
            <div className="flex w-full items-center gap-3 px-2 lg:w-auto lg:gap-[28px] lg:px-0">
              <span className="shrink-0 text-gold">
                <Icon size={32} />
              </span>
              <div className="lg:-mt-[3px]">
                <p className="text-[15px] leading-tight text-ivory lg:text-[16.6px] lg:leading-[22px]">
                  {title}
                </p>
                <p className="text-[12.5px] leading-tight text-muted lg:text-[14.3px] lg:leading-[20px]">
                  {sub}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
