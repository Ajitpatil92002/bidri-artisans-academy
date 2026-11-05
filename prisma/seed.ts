import { loadEnvFile } from "node:process";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "node:crypto";
import { PrismaClient } from "../src/generated/prisma/client";

try {
  loadEnvFile(".env.local");
} catch {
  // Real environment variables are used instead
}

const db = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const MATERIALS = "Bidri alloy (zinc and copper) with silver inlay, on hook ear wires";

const descriptionFor = (motif: string) =>
  `${motif} Each pair is cast in the traditional zinc-copper alloy, engraved by hand, inlaid with silver and darkened with soil from Bidar, so no two pieces are exactly alike.`;

const products = [
  {
    slug: "heart-earrings",
    name: "Heart Earrings",
    price: 69900,
    image: "/images/products/heart-earrings.webp",
    motif: "A simple double heart traced in fine silver lines on matte black metal.",
  },
  {
    slug: "leaf-earrings",
    name: "Leaf Earrings",
    price: 69900,
    image: "/images/products/leaf-earrings.webp",
    motif: "A branching leaf motif in silver, on a star-like black form.",
  },
  {
    slug: "floral-earrings",
    name: "Floral Earrings",
    price: 69900,
    image: "/images/products/floral-earrings.webp",
    motif: "Four clean petals outlined in silver around a small circle.",
  },
  {
    slug: "fan-earrings",
    name: "Fan Earrings",
    price: 74900,
    image: "/images/banners/fan-heart.webp",
    position: "61% 50%",
    motif: "Heart-shaped earrings filled with a radiating silver fan pattern.",
  },
  {
    slug: "star-earrings",
    name: "Star Earrings",
    price: 74900,
    image: "/images/banners/star.webp",
    position: "63% 50%",
    motif: "Six-pointed stars with a striped silver centre.",
  },
  {
    slug: "teardrop-earrings",
    name: "Teardrop Earrings",
    price: 79900,
    image: "/images/products/teardrop-earrings.webp",
    motif: "A tapered teardrop covered with silver leaves around a striped centre.",
  },
];

const posts = [
  {
    slug: "what-is-bidri",
    title: "What is Bidri?",
    excerpt: "A short guide to the black metal and silver craft of Bidar, Karnataka.",
    coverImage: "/images/banners/hero-teardrop.webp",
    body: `Bidri is a metal inlay craft from Bidar in Karnataka. Its name comes from the town, and its look comes from a striking contrast: bright silver set into metal that is almost pure black.

## Where it began

The craft took root in the Deccan during the rule of the Bahmani Sultans, in the 14th century. Over the centuries it was used for vases, boxes, bowls and hookah bases, and today it has also found its way into jewellery.

## What it's made of

Bidri starts with an alloy of zinc and copper. Silver is then inlaid into its surface. The metal isn't naturally black: that colour comes at the very end of the process.

## Why Bidar's soil matters

The final step uses soil from Bidar fort, mixed with sal ammoniac and water. Rubbed over the piece, the paste turns the alloy a deep, lasting black, while the silver stays bright. That is the moment a Bidri piece becomes itself.`,
  },
  {
    slug: "how-bidri-is-made",
    title: "How Bidri is made, step by step",
    excerpt: "From molten alloy to finished piece: the four stages behind every Bidri work.",
    coverImage: "/images/banners/star.webp",
    body: `Every Bidri piece passes through the same stages, each done by hand.

## Casting

Zinc and copper are melted together and poured into a mould. The rough casting is filed smooth.

## Engraving

The design is scratched freehand onto the surface, then cut deeper with a fine steel chisel.

## Inlaying

Thin silver wire or sheet is hammered into each engraved groove, then the surface is filed and polished until metal and silver sit flush.

## Oxidising

A paste of Bidar soil and sal ammoniac turns the alloy black while leaving the silver untouched. A rub of oil gives the piece its soft, matte finish.`,
  },
];

async function main() {
  const earrings = await db.category.upsert({
    where: { slug: "earrings" },
    update: {},
    create: {
      slug: "earrings",
      name: "Earrings",
      description: "Lightweight Bidri earrings in black metal and silver.",
      image: "/images/products/teardrop-earrings.webp",
    },
  });

  for (const p of products) {
    const existing = await db.product.findUnique({ where: { slug: p.slug } });
    if (existing) continue;
    await db.product.create({
      data: {
        slug: p.slug,
        name: p.name,
        price: p.price,
        description: descriptionFor(p.motif),
        materials: MATERIALS,
        stock: 5,
        status: "active",
        isFeatured: true,
        categoryId: earrings.id,
        images: {
          create: {
            url: p.image,
            alt: `${p.name} in Bidri black metal with silver inlay`,
            position: p.position,
          },
        },
      },
    });
  }

  for (const post of posts) {
    await db.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: { ...post, status: "published", publishedAt: new Date() },
    });
  }

  // Placeholders until the owner confirms the amounts (Q-12)
  await db.setting.upsert({
    where: { key: "shipping_fee" },
    update: {},
    create: { key: "shipping_fee", value: "9900" },
  });
  await db.setting.upsert({
    where: { key: "free_shipping_above" },
    update: {},
    create: { key: "free_shipping_above", value: "149900" },
  });

  const email = process.env.ADMIN_EMAIL?.toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const admin = await db.user.findUnique({ where: { email } });
    if (!admin) {
      const id = randomUUID();
      await db.user.create({
        data: {
          id,
          email,
          name: "Admin",
          role: "admin",
          emailVerified: true,
          accounts: {
            create: {
              id: randomUUID(),
              accountId: id,
              providerId: "credential",
              password: await hashPassword(password),
            },
          },
        },
      });
    }
  }
}

main()
  .then(() => console.log("Seed complete"))
  .finally(() => db.$disconnect());
