"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import type { FormState } from "@/components/forms";
import { OrderStatus, Prisma } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { rupeesToPaise } from "@/lib/money";
import { changeOrderStatus } from "@/lib/orders";
import { requireAdmin } from "@/lib/session";
import { saveImage, UploadError } from "@/lib/storage";

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

const text = (formData: FormData, key: string) => formData.get(key)?.toString().trim() ?? "";
const optional = (formData: FormData, key: string) => text(formData, key) || null;

const files = (formData: FormData, key: string) =>
  formData.getAll(key).filter((value): value is File => value instanceof File && value.size > 0);

function isDuplicate(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

const DUPLICATE_SLUG: FormState = { fieldErrors: { slug: ["That web address is already in use."] } };

function revalidateStore() {
  revalidatePath("/", "layout");
}

// Products

const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a name.").max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens.").max(80),
  description: z.string().trim().min(10, "Add a description.").max(5000),
  makerStory: z.string().trim().max(5000).nullable(),
  price: z.number({ error: "Enter a valid price." }).int().positive("Enter a valid price."),
  compareAtPrice: z.number().int().positive().nullable(),
  stock: z.number({ error: "Enter a whole number." }).int().min(0, "Stock can't be negative."),
  materials: z.string().trim().max(300).nullable(),
  dimensions: z.string().trim().max(300).nullable(),
  weightGrams: z.number().int().positive().nullable(),
  status: z.enum(["draft", "active", "archived"]),
  isFeatured: z.boolean(),
  categoryId: z.string().nullable(),
  artisanId: z.string().nullable(),
});

export async function saveProduct(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id") || null;
  const name = text(formData, "name");
  const weight = text(formData, "weightGrams");

  const parsed = productSchema.safeParse({
    name,
    slug: text(formData, "slug") || slugify(name),
    description: text(formData, "description"),
    makerStory: optional(formData, "makerStory"),
    price: rupeesToPaise(text(formData, "price")) ?? undefined,
    compareAtPrice: rupeesToPaise(text(formData, "compareAtPrice")),
    stock: Number(text(formData, "stock")),
    materials: optional(formData, "materials"),
    dimensions: optional(formData, "dimensions"),
    weightGrams: weight ? Number(weight) : null,
    status: text(formData, "status"),
    isFeatured: formData.get("isFeatured") === "on",
    categoryId: optional(formData, "categoryId"),
    artisanId: optional(formData, "artisanId"),
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  let uploads: string[];
  try {
    uploads = await Promise.all(files(formData, "images").map(saveImage));
  } catch (error) {
    if (error instanceof UploadError) return { error: error.message };
    throw error;
  }

  const removeIds = formData.getAll("removeImage").map(String);
  const data = parsed.data;

  try {
    const productId = await db.$transaction(async (tx) => {
      const product = id
        ? await tx.product.update({ where: { id }, data })
        : await tx.product.create({ data });
      if (removeIds.length > 0) {
        await tx.productImage.deleteMany({
          where: { id: { in: removeIds }, productId: product.id },
        });
      }
      const last = await tx.productImage.aggregate({
        where: { productId: product.id },
        _max: { sortOrder: true },
      });
      const start = (last._max.sortOrder ?? -1) + 1;
      if (uploads.length > 0) {
        await tx.productImage.createMany({
          data: uploads.map((url, i) => ({
            productId: product.id,
            url,
            alt: `${product.name} in Bidri black metal with silver inlay`,
            sortOrder: start + i,
          })),
        });
      }
      return product.id;
    });
    revalidateStore();
    if (!id) redirect(`/admin/products/${productId}`);
    return { success: "Product saved." };
  } catch (error) {
    if (isDuplicate(error)) return DUPLICATE_SLUG;
    throw error;
  }
}

/** Products on past orders are archived, so order history stays complete. */
export async function deleteProduct(id: string) {
  await requireAdmin();
  const used = await db.orderItem.count({ where: { productId: id } });
  if (used > 0) {
    await db.product.update({ where: { id }, data: { status: "archived" } });
  } else {
    await db.product.delete({ where: { id } });
  }
  revalidateStore();
  redirect("/admin/products");
}

// Categories

const categorySchema = z.object({
  name: z.string().trim().min(2, "Enter a name.").max(80),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens.").max(80),
  description: z.string().trim().max(500).nullable(),
  sortOrder: z.number().int().min(0).max(9999),
});

export async function saveCategory(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id") || null;
  const name = text(formData, "name");
  const parsed = categorySchema.safeParse({
    name,
    slug: text(formData, "slug") || slugify(name),
    description: optional(formData, "description"),
    sortOrder: Number(text(formData, "sortOrder") || 0),
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  try {
    if (id) await db.category.update({ where: { id }, data: parsed.data });
    else await db.category.create({ data: parsed.data });
  } catch (error) {
    if (isDuplicate(error)) return DUPLICATE_SLUG;
    throw error;
  }
  revalidateStore();
  return { success: "Category saved." };
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  await db.category.delete({ where: { id } });
  revalidateStore();
}

// Artisans

const artisanSchema = z.object({
  name: z.string().trim().min(2, "Enter a name.").max(120),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens.").max(80),
  shortBio: z.string().trim().min(5, "Add a short bio.").max(300),
  story: z.string().trim().min(10, "Add their story.").max(20000),
  isPublished: z.boolean(),
});

export async function saveArtisan(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id") || null;
  const name = text(formData, "name");
  const parsed = artisanSchema.safeParse({
    name,
    slug: text(formData, "slug") || slugify(name),
    shortBio: text(formData, "shortBio"),
    story: text(formData, "story"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  let portrait: string | undefined;
  const [file] = files(formData, "portrait");
  try {
    if (file) portrait = await saveImage(file);
  } catch (error) {
    if (error instanceof UploadError) return { error: error.message };
    throw error;
  }

  const data = { ...parsed.data, portrait };
  try {
    const artisan = id
      ? await db.artisan.update({ where: { id }, data })
      : await db.artisan.create({ data });
    revalidateStore();
    if (!id) redirect(`/admin/artisans/${artisan.id}`);
  } catch (error) {
    if (isDuplicate(error)) return DUPLICATE_SLUG;
    throw error;
  }
  return { success: "Artisan saved." };
}

export async function deleteArtisan(id: string) {
  await requireAdmin();
  await db.artisan.delete({ where: { id } });
  revalidateStore();
  redirect("/admin/artisans");
}

// Journal posts

const postSchema = z.object({
  title: z.string().trim().min(3, "Enter a title.").max(160),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens.").max(80),
  excerpt: z.string().trim().min(10, "Add a short summary.").max(300),
  body: z.string().trim().min(20, "Write the article.").max(100000),
  status: z.enum(["draft", "published"]),
});

export async function savePost(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const id = text(formData, "id") || null;
  const title = text(formData, "title");
  const parsed = postSchema.safeParse({
    title,
    slug: text(formData, "slug") || slugify(title),
    excerpt: text(formData, "excerpt"),
    body: text(formData, "body"),
    status: text(formData, "status"),
  });
  if (!parsed.success) return { fieldErrors: z.flattenError(parsed.error).fieldErrors };

  let coverImage: string | undefined;
  const [file] = files(formData, "coverImage");
  try {
    if (file) coverImage = await saveImage(file);
  } catch (error) {
    if (error instanceof UploadError) return { error: error.message };
    throw error;
  }

  const existing = id ? await db.post.findUnique({ where: { id } }) : null;
  const publishedAt =
    parsed.data.status === "published" ? (existing?.publishedAt ?? new Date()) : null;
  const data = { ...parsed.data, coverImage, publishedAt };

  try {
    const post = id
      ? await db.post.update({ where: { id }, data })
      : await db.post.create({ data });
    revalidateStore();
    if (!id) redirect(`/admin/posts/${post.id}`);
  } catch (error) {
    if (isDuplicate(error)) return DUPLICATE_SLUG;
    throw error;
  }
  return { success: "Post saved." };
}

export async function deletePost(id: string) {
  await requireAdmin();
  await db.post.delete({ where: { id } });
  revalidateStore();
  redirect("/admin/posts");
}

// Orders

export async function updateOrderStatus(_: FormState, formData: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const number = text(formData, "number");
  const to = z.enum(OrderStatus).safeParse(text(formData, "status"));
  if (!to.success) return { error: "Choose a status." };

  const trackingNumber = text(formData, "trackingNumber");
  const trackingCarrier = text(formData, "trackingCarrier");
  if (to.data === "shipped" && (!trackingNumber || !trackingCarrier)) {
    return { error: "Add the carrier and tracking number before marking it shipped." };
  }

  try {
    await changeOrderStatus(number, {
      to: to.data,
      adminEmail: admin.email,
      note: text(formData, "note") || undefined,
      trackingCarrier,
      trackingNumber,
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Couldn't update the order." };
  }
  revalidatePath(`/admin/orders/${number}`);
  revalidatePath("/admin/orders");
  return { success: "Order updated." };
}

// Settings and messages

export async function saveShippingSettings(_: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const fee = rupeesToPaise(text(formData, "fee"));
  const freeAbove = rupeesToPaise(text(formData, "freeAbove"));
  if (fee === null) return { fieldErrors: { fee: ["Enter an amount in rupees."] } };
  if (freeAbove === null) return { fieldErrors: { freeAbove: ["Enter an amount in rupees."] } };

  const entries = [
    ["shipping_fee", String(fee)],
    ["free_shipping_above", String(freeAbove)],
  ];
  await Promise.all(
    entries.map(([key, value]) =>
      db.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
    )
  );
  revalidateStore();
  return { success: "Settings saved." };
}

export async function toggleMessageHandled(id: string, handled: boolean) {
  await requireAdmin();
  await db.contactMessage.update({ where: { id }, data: { handled } });
  revalidatePath("/admin/messages");
}
