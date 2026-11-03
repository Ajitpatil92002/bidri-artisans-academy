import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { featuredProducts, formatPrice } from "@/data/products";

export function CollectionGrid() {
  return (
    <section className="mx-auto max-w-[1536px] px-4 pt-8 pb-10 lg:pr-[72px] lg:pl-[72px] lg:pt-[29px] lg:pb-[30px]">
      <div className="flex items-end justify-between lg:items-center lg:px-[8px]">
        <h2 className="font-serif text-[30px] leading-none text-ivory lg:-translate-y-[4px] lg:text-[34.3px] lg:leading-[44px]">
          Our Collection
        </h2>
        <Link
          href="/shop"
          className="flex items-center gap-[10px] text-[14px] text-ivory hover:text-gold lg:mt-[12px] lg:-mr-[8px] lg:text-[14.5px]"
        >
          View All
          <ArrowRightIcon size={20} />
        </Link>
      </div>

      <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:mt-[22px] lg:grid-cols-6 lg:gap-[28px] lg:pl-[8px]">
        {featuredProducts.map((product) => (
          <li key={product.slug}>
            <Link
              href={`/shop/${product.slug}`}
              className="group relative block aspect-[207/271] overflow-hidden rounded-[8px] border border-white/[0.07] bg-card"
            >
              <Image
                src={product.image}
                alt={`${product.name} — Bidri black metal with silver inlay`}
                fill
                sizes="(min-width: 1024px) 210px, (min-width: 640px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ objectPosition: product.imagePosition ?? "50% 50%" }}
              />
              <div className="absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-b from-transparent via-[#29241f]/85 via-35% to-[#2a2520]" />
              <div className="absolute inset-x-0 bottom-0 px-[20px] pb-[11px]">
                <p className="text-[16px] leading-[22px] text-ivory lg:text-[18.5px] lg:leading-[24px]">
                  {product.name}
                </p>
                <p className="mt-[6px] text-[17px] leading-[22px] text-ivory lg:text-[19px] lg:leading-[24px]">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
