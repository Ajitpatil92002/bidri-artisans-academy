"use client";

import Image from "next/image";
import { useState } from "react";

type GalleryImage = { id: string; url: string; alt: string; position: string | null };

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [activeId, setActiveId] = useState(images[0]?.id);
  const active = images.find((image) => image.id === activeId) ?? images[0];
  if (!active) return <div className="aspect-[4/3] rounded-[8px] bg-card" />;

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-[8px] border border-white/[0.07] bg-card">
        <Image
          src={active.url}
          alt={active.alt}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          style={{ objectPosition: active.position ?? "50% 50%" }}
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 flex flex-wrap gap-3">
          {images.map((image) => (
            <li key={image.id}>
              <button
                type="button"
                aria-label={`Show ${image.alt}`}
                aria-current={image.id === active.id}
                onClick={() => setActiveId(image.id)}
                className={`relative block size-[72px] overflow-hidden rounded-[6px] border ${
                  image.id === active.id ? "border-sand" : "border-line-2"
                }`}
              >
                <Image src={image.url} alt="" fill sizes="72px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
