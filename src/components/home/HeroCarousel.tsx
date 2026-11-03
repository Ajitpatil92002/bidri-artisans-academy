"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export type HeroSlide = {
  src: string;
  alt: string;
  /** object-position for the crop, so the product sits right of the text */
  position: string;
};

const INTERVAL_MS = 5000;

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Restarts whenever the slide changes, so a manual pick gets a full interval
    const id = setTimeout(() => setActive((i) => (i + 1) % slides.length), INTERVAL_MS);
    return () => clearTimeout(id);
  }, [active, paused, slides.length]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          aria-hidden={i !== active}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === active ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={i === active ? slide.alt : ""}
            fill
            priority={i === 0}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: slide.position }}
          />
        </div>
      ))}

      {/* Darkens the left side so the text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/75 to-ink/20 lg:from-ink/85 lg:via-ink/40 lg:via-35%" />

      <div
        role="tablist"
        aria-label="Hero images"
        className="absolute bottom-[18px] left-1/2 z-10 flex -translate-x-1/2 gap-[10px]"
      >
        {slides.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === active}
            aria-label={`Show image ${i + 1} of ${slides.length}`}
            onClick={() => setActive(i)}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === active ? "w-[28px] bg-sand" : "w-[14px] bg-ivory/40 hover:bg-ivory/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
