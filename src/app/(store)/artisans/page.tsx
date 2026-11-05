import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui";
import { getPublishedArtisans } from "@/lib/queries/catalog";

export const metadata: Metadata = {
  title: "Our Artisans",
  description: "Meet the artisans of Bidar who make every Bidri piece by hand.",
};

export default async function ArtisansPage() {
  const artisans = await getPublishedArtisans();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Our artisans"
        title="The hands behind the craft"
        intro="Every piece is made by hand in Bidar, by artisans carrying the craft forward."
      />
      {artisans.length === 0 ? (
        <EmptyState
          title="Artisan stories are coming soon"
          text="We're gathering the stories of the people who make each piece."
          href="/about-bidri"
          action="Read about the craft"
        />
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {artisans.map((artisan) => (
            <li key={artisan.id}>
              <Link
                href={`/artisans/${artisan.slug}`}
                className="block overflow-hidden rounded-[8px] border border-line bg-ink-2 hover:border-gold"
              >
                <span className="relative block aspect-[4/3] bg-card">
                  {artisan.portrait && (
                    <Image
                      src={artisan.portrait}
                      alt={artisan.name}
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="block p-5">
                  <span className="block font-serif text-[22px] text-ivory">{artisan.name}</span>
                  <span className="mt-2 block text-[15px] leading-[1.6] text-muted">
                    {artisan.shortBio}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
