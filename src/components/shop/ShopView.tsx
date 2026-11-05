import Link from "next/link";
import { ProductGrid } from "@/components/shop/ProductCard";
import { EmptyState, inputClass, secondaryButtonClass } from "@/components/ui";
import { rupeesToPaise } from "@/lib/money";
import { getCategories, getShopProducts, type ShopSort } from "@/lib/queries/catalog";

export type ShopSearchParams = Record<string, string | string[] | undefined>;

const first = (value: string | string[] | undefined) =>
  Array.isArray(value) ? value[0] : value;

const SORTS: { value: ShopSort; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

type Props = {
  basePath: string;
  searchParams: ShopSearchParams;
  categoryId?: string;
};

export async function ShopView({ basePath, searchParams, categoryId }: Props) {
  const sortParam = first(searchParams.sort);
  const sort = SORTS.find((option) => option.value === sortParam)?.value ?? "newest";
  const minText = first(searchParams.min) ?? "";
  const maxText = first(searchParams.max) ?? "";
  const page = Math.max(1, Number.parseInt(first(searchParams.page) ?? "1", 10) || 1);

  const [categories, result] = await Promise.all([
    getCategories(),
    getShopProducts({
      categoryId,
      sort,
      page,
      minPrice: rupeesToPaise(minText) ?? undefined,
      maxPrice: rupeesToPaise(maxText) ?? undefined,
    }),
  ]);

  const pageHref = (target: number) => {
    const params = new URLSearchParams();
    if (sort !== "newest") params.set("sort", sort);
    if (minText) params.set("min", minText);
    if (maxText) params.set("max", maxText);
    if (target > 1) params.set("page", String(target));
    const query = params.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  const chip = (active: boolean) =>
    `rounded-full border px-4 py-2 text-[14px] ${
      active ? "border-sand bg-sand text-ink" : "border-line-2 text-ivory hover:border-gold"
    }`;

  return (
    <>
      <nav aria-label="Categories" className="flex flex-wrap gap-2">
        <Link href="/shop" className={chip(!categoryId)} aria-current={!categoryId ? "page" : undefined}>
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/shop/category/${category.slug}`}
            className={chip(category.id === categoryId)}
            aria-current={category.id === categoryId ? "page" : undefined}
          >
            {category.name}
          </Link>
        ))}
      </nav>

      <form method="get" action={basePath} className="mt-5 flex flex-wrap items-end gap-3">
        <div>
          <label htmlFor="sort" className="mb-1 block text-[13px] text-muted">
            Sort by
          </label>
          <select id="sort" name="sort" defaultValue={sort} className={`${inputClass} w-[200px]`}>
            {SORTS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="min" className="mb-1 block text-[13px] text-muted">
            Min price (₹)
          </label>
          <input
            id="min"
            name="min"
            inputMode="numeric"
            defaultValue={minText}
            className={`${inputClass} w-[120px]`}
          />
        </div>
        <div>
          <label htmlFor="max" className="mb-1 block text-[13px] text-muted">
            Max price (₹)
          </label>
          <input
            id="max"
            name="max"
            inputMode="numeric"
            defaultValue={maxText}
            className={`${inputClass} w-[120px]`}
          />
        </div>
        <button type="submit" className={secondaryButtonClass}>
          Apply
        </button>
      </form>

      <p className="mt-6 mb-4 text-[14px] text-muted" aria-live="polite">
        {result.total} {result.total === 1 ? "piece" : "pieces"}
      </p>

      {result.products.length === 0 ? (
        <EmptyState
          title="Nothing matches those filters"
          text="Try a wider price range, or see the whole collection."
          href="/shop"
          action="View all"
        />
      ) : (
        <ProductGrid products={result.products} />
      )}

      {result.pageCount > 1 && (
        <nav aria-label="Pages" className="mt-10 flex items-center justify-center gap-4 text-[15px]">
          {result.page > 1 && (
            <Link href={pageHref(result.page - 1)} className="text-ivory hover:text-gold">
              Previous
            </Link>
          )}
          <span className="text-muted">
            Page {result.page} of {result.pageCount}
          </span>
          {result.page < result.pageCount && (
            <Link href={pageHref(result.page + 1)} className="text-ivory hover:text-gold">
              Next
            </Link>
          )}
        </nav>
      )}
    </>
  );
}
