import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/shop/ProductCard";
import { PageContainer, Prose } from "@/components/ui";
import { getArtisanBySlug } from "@/lib/queries/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const artisan = await getArtisanBySlug((await params).slug);
  if (!artisan) return {};
  return { title: artisan.name, description: artisan.shortBio };
}

export default async function ArtisanPage({ params }: Props) {
  const artisan = await getArtisanBySlug((await params).slug);
  if (!artisan) notFound();

  return (
    <PageContainer>
      <div className="grid gap-8 lg:grid-cols-[400px_1fr] lg:gap-[56px]">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[8px] border border-white/[0.07] bg-card">
          {artisan.portrait && (
            <Image
              src={artisan.portrait}
              alt={artisan.name}
              fill
              priority
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="font-serif text-[34px] text-ivory lg:text-[44px]">{artisan.name}</h1>
          <p className="mt-3 mb-6 text-[18px] leading-[1.6] text-muted">{artisan.shortBio}</p>
          <Prose text={artisan.story} />
        </div>
      </div>
      {artisan.products.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-serif text-[28px] text-ivory">
            Pieces by {artisan.name}
          </h2>
          <ProductGrid products={artisan.products} />
        </section>
      )}
    </PageContainer>
  );
}
