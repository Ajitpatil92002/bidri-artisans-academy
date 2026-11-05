import type { Metadata } from "next";
import { ProductGrid } from "@/components/shop/ProductCard";
import { EmptyState, buttonClass, inputClass, PageContainer, PageHeader } from "@/components/ui";
import { searchProducts } from "@/lib/queries/catalog";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 100) ?? "";
  const products = query ? await searchProducts(query) : [];

  return (
    <PageContainer>
      <PageHeader title={query ? `Results for “${query}”` : "Search"} />
      <form action="/search" role="search" className="mb-8 flex max-w-[560px] gap-3">
        <input
          type="search"
          name="q"
          defaultValue={query}
          aria-label="Search products"
          placeholder="Search earrings, motifs…"
          className={inputClass}
        />
        <button type="submit" className={buttonClass}>
          Search
        </button>
      </form>
      {query &&
        (products.length > 0 ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState
            title="No pieces found"
            text="Try a simpler word, like “heart” or “earrings”."
            href="/shop"
            action="Browse the collection"
          />
        ))}
    </PageContainer>
  );
}
