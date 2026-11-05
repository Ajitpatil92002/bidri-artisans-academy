import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/shop/AddToCart";
import { Gallery } from "@/components/shop/Gallery";
import { ProductCard } from "@/components/shop/ProductCard";
import { PageContainer } from "@/components/ui";
import { formatPrice } from "@/lib/money";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug);
  if (!product) return {};
  const image = product.images[0]?.url;
  return {
    title: product.name,
    description: product.description.slice(0, 160),
    openGraph: { images: image ? [image] : undefined },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug((await params).slug);
  if (!product) notFound();

  const related = await getRelatedProducts(product.id, product.categoryId);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  const toAbsolute = (url: string) => (url.startsWith("/") ? `${siteUrl}${url}` : url);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => toAbsolute(image.url)),
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: (product.price / 100).toFixed(2),
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  const details = [
    { label: "Materials", value: product.materials },
    { label: "Dimensions", value: product.dimensions },
    { label: "Weight", value: product.weightGrams ? `${product.weightGrams} g` : null },
  ].filter((detail) => detail.value);

  return (
    <PageContainer>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />
      <nav aria-label="Breadcrumb" className="mb-6 text-[14px] text-muted">
        <Link href="/shop" className="hover:text-gold">
          Shop
        </Link>
        {product.category && (
          <>
            {" / "}
            <Link href={`/shop/category/${product.category.slug}`} className="hover:text-gold">
              {product.category.name}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-[64px]">
        <Gallery images={product.images} />

        <div>
          <h1 className="font-serif text-[34px] leading-tight text-ivory lg:text-[44px]">
            {product.name}
          </h1>
          <p className="mt-3 flex items-baseline gap-3 text-[26px] text-ivory">
            {formatPrice(product.price)}
            {product.compareAtPrice && product.compareAtPrice > product.price && (
              <s className="text-[18px] text-muted">{formatPrice(product.compareAtPrice)}</s>
            )}
          </p>
          {product.stock > 0 && product.stock <= 3 && (
            <p className="mt-2 text-[14px] text-gold">Only {product.stock} left</p>
          )}

          <p className="mt-6 text-[17px] leading-[1.75] text-ivory/85">{product.description}</p>

          <div className="mt-8">
            <AddToCart productId={product.id} stock={product.stock} />
          </div>

          {details.length > 0 && (
            <dl className="mt-10 border-t border-line">
              {details.map((detail) => (
                <div key={detail.label} className="flex gap-6 border-b border-line py-3 text-[15px]">
                  <dt className="w-[110px] shrink-0 text-muted">{detail.label}</dt>
                  <dd className="text-ivory/90">{detail.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {(product.makerStory || product.artisan?.isPublished) && (
            <section className="mt-10 rounded-[8px] border border-line bg-ink-2 p-6">
              <p className="text-[13px] tracking-[0.3em] text-gold uppercase">The maker&apos;s story</p>
              {product.makerStory && (
                <p className="mt-3 text-[16px] leading-[1.7] text-ivory/85">{product.makerStory}</p>
              )}
              {product.artisan?.isPublished && (
                <Link
                  href={`/artisans/${product.artisan.slug}`}
                  className="mt-4 inline-block text-[15px] text-ivory underline hover:text-gold"
                >
                  Made by {product.artisan.name}
                </Link>
              )}
            </section>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-serif text-[28px] text-ivory">You may also like</h2>
          <ul className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-[28px]">
            {related.map((item) => (
              <li key={item.id}>
                <ProductCard product={item} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </PageContainer>
  );
}
