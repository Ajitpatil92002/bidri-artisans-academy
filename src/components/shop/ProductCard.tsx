import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/money";
import type { ProductCardData } from "@/lib/queries/catalog";

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group relative block aspect-[207/271] overflow-hidden rounded-[8px] border border-white/[0.07] bg-card"
    >
      {image && (
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 210px, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          style={{ objectPosition: image.position ?? "50% 50%" }}
        />
      )}
      {product.stock === 0 && (
        <span className="absolute top-3 left-3 rounded-full bg-ink/85 px-3 py-1 text-[12px] text-ivory">
          Sold out
        </span>
      )}
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
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-[28px] xl:grid-cols-5">
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
