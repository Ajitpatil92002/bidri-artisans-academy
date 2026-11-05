import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EmptyState, PageContainer, PageHeader } from "@/components/ui";
import { getPublishedPosts } from "@/lib/queries/catalog";

export const metadata: Metadata = {
  title: "Journal",
  description: "Stories about Bidri's history, its techniques and the people who keep it alive.",
};

export default async function JournalPage() {
  const posts = await getPublishedPosts();

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Journal"
        title="Stories from Bidar"
        intro="The history, the technique and the people behind the craft."
      />
      {posts.length === 0 ? (
        <EmptyState title="Stories are coming soon" href="/shop" action="Browse the collection" />
      ) : (
        <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id}>
              <Link
                href={`/journal/${post.slug}`}
                className="group block overflow-hidden rounded-[8px] border border-line bg-ink-2 hover:border-gold"
              >
                <span className="relative block aspect-[16/9] bg-card">
                  {post.coverImage && (
                    <Image
                      src={post.coverImage}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )}
                </span>
                <span className="block p-5">
                  <span className="block font-serif text-[22px] text-ivory">{post.title}</span>
                  <span className="mt-2 block text-[15px] leading-[1.6] text-muted">{post.excerpt}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </PageContainer>
  );
}
