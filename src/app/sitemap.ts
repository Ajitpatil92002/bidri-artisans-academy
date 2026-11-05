import type { MetadataRoute } from "next";
import { connection } from "next/server";
import { db } from "@/lib/db";

const staticPaths = [
  "",
  "/shop",
  "/about-bidri",
  "/artisans",
  "/journal",
  "/contact",
  "/shipping",
  "/returns",
  "/care",
  "/privacy",
  "/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const entry = (path: string, lastModified?: Date) => ({ url: `${base}${path}`, lastModified });

  const pages = staticPaths.map((path) => entry(path));
  try {
    const [products, categories, posts, artisans] = await Promise.all([
      db.product.findMany({ where: { status: "active" }, select: { slug: true, updatedAt: true } }),
      db.category.findMany({ select: { slug: true, updatedAt: true } }),
      db.post.findMany({ where: { status: "published" }, select: { slug: true, updatedAt: true } }),
      db.artisan.findMany({ where: { isPublished: true }, select: { slug: true, updatedAt: true } }),
    ]);
    return [
      ...pages,
      ...products.map((p) => entry(`/shop/${p.slug}`, p.updatedAt)),
      ...categories.map((c) => entry(`/shop/category/${c.slug}`, c.updatedAt)),
      ...posts.map((p) => entry(`/journal/${p.slug}`, p.updatedAt)),
      ...artisans.map((a) => entry(`/artisans/${a.slug}`, a.updatedAt)),
    ];
  } catch {
    // The database may be unreachable during a build
    return pages;
  }
}
