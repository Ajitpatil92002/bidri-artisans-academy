import Link from "next/link";
import { ArrowRightIcon } from "@/components/icons";
import { ProductCard } from "@/components/shop/ProductCard";
import { getFeaturedProducts } from "@/lib/queries/catalog";

export async function CollectionGrid() {
  const products = await getFeaturedProducts();

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
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
