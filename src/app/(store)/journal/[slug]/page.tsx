import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buttonClass, PageContainer, Prose } from "@/components/ui";
import { getPostBySlug } from "@/lib/queries/catalog";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostBySlug((await params).slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { images: post.coverImage ? [post.coverImage] : undefined },
  };
}

export default async function ArticlePage({ params }: Props) {
  const post = await getPostBySlug((await params).slug);
  if (!post) notFound();

  return (
    <PageContainer narrow>
      <article>
        <Link href="/journal" className="text-[14px] text-muted hover:text-gold">
          ← Journal
        </Link>
        <h1 className="mt-4 font-serif text-[34px] leading-tight text-ivory lg:text-[44px]">
          {post.title}
        </h1>
        {post.publishedAt && (
          <time
            dateTime={post.publishedAt.toISOString()}
            className="mt-2 block text-[14px] text-muted"
          >
            {post.publishedAt.toLocaleDateString("en-IN", { dateStyle: "long" })}
          </time>
        )}
        {post.coverImage && (
          <div className="relative my-8 aspect-[2/1] overflow-hidden rounded-[8px] border border-white/[0.07]">
            <Image
              src={post.coverImage}
              alt=""
              fill
              priority
              sizes="(min-width: 760px) 760px, 100vw"
              className="object-cover"
            />
          </div>
        )}
        <Prose text={post.body} />
        <Link href="/shop" className={`${buttonClass} mt-8`}>
          Shop the Collection
        </Link>
      </article>
    </PageContainer>
  );
}
