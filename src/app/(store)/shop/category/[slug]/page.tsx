import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView, type ShopSearchParams } from "@/components/shop/ShopView";
import { PageContainer, PageHeader } from "@/components/ui";
import { getCategoryBySlug } from "@/lib/queries/catalog";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<ShopSearchParams>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug((await params).slug);
  if (!category) return {};
  return {
    title: `${category.name} — Bidri Jewellery`,
    description: category.description ?? undefined,
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="The collection"
        title={category.name}
        intro={category.description ?? undefined}
      />
      <ShopView
        basePath={`/shop/category/${category.slug}`}
        searchParams={await searchParams}
        categoryId={category.id}
      />
    </PageContainer>
  );
}
