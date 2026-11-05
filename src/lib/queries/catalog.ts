import { connection } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";

export const PAGE_SIZE = 12;

const cardInclude = {
  images: { orderBy: { sortOrder: "asc" }, take: 1 },
} satisfies Prisma.ProductInclude;

export type ProductCardData = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

export async function getFeaturedProducts(limit = 6) {
  await connection();
  return db.product.findMany({
    where: { status: "active", isFeatured: true },
    include: cardInclude,
    orderBy: { createdAt: "asc" },
    take: limit,
  });
}

export async function getCategories() {
  await connection();
  return db.category.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function getCategoryBySlug(slug: string) {
  await connection();
  return db.category.findUnique({ where: { slug } });
}

export type ShopSort = "newest" | "price-asc" | "price-desc";

export type ShopFilters = {
  categoryId?: string;
  sort?: ShopSort;
  /** Price bounds in paise */
  minPrice?: number;
  maxPrice?: number;
  page?: number;
};

const sortOrders: Record<ShopSort, Prisma.ProductOrderByWithRelationInput> = {
  newest: { createdAt: "desc" },
  "price-asc": { price: "asc" },
  "price-desc": { price: "desc" },
};

export async function getShopProducts(filters: ShopFilters) {
  await connection();
  const page = Math.max(1, filters.page ?? 1);
  const where: Prisma.ProductWhereInput = {
    status: "active",
    categoryId: filters.categoryId,
    price: { gte: filters.minPrice, lte: filters.maxPrice },
  };
  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      include: cardInclude,
      orderBy: [sortOrders[filters.sort ?? "newest"], { id: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.product.count({ where }),
  ]);
  return { products, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getProductBySlug(slug: string) {
  await connection();
  return db.product.findFirst({
    where: { slug, status: "active" },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      artisan: true,
    },
  });
}

export async function getRelatedProducts(productId: string, categoryId: string | null) {
  await connection();
  return db.product.findMany({
    where: { status: "active", id: { not: productId }, categoryId: categoryId ?? undefined },
    include: cardInclude,
    orderBy: { createdAt: "desc" },
    take: 4,
  });
}

export async function searchProducts(query: string) {
  await connection();
  const terms = query.trim().split(/\s+/).filter(Boolean).slice(0, 6);
  if (terms.length === 0) return [];
  return db.product.findMany({
    where: {
      status: "active",
      AND: terms.map((term) => ({
        OR: [
          { name: { contains: term, mode: "insensitive" as const } },
          { description: { contains: term, mode: "insensitive" as const } },
          { category: { is: { name: { contains: term, mode: "insensitive" as const } } } },
        ],
      })),
    },
    include: cardInclude,
    orderBy: { name: "asc" },
    take: 48,
  });
}

export async function getPublishedArtisans() {
  await connection();
  return db.artisan.findMany({ where: { isPublished: true }, orderBy: { name: "asc" } });
}

export async function getArtisanBySlug(slug: string) {
  await connection();
  return db.artisan.findFirst({
    where: { slug, isPublished: true },
    include: {
      products: { where: { status: "active" }, include: cardInclude, orderBy: { name: "asc" } },
    },
  });
}

export async function getPublishedPosts() {
  await connection();
  return db.post.findMany({ where: { status: "published" }, orderBy: { publishedAt: "desc" } });
}

export async function getPostBySlug(slug: string) {
  await connection();
  return db.post.findFirst({ where: { slug, status: "published" } });
}
