"use client";

import Image from "next/image";
import { useTransition } from "react";
import {
  deleteArtisan,
  deleteCategory,
  deletePost,
  deleteProduct,
  saveArtisan,
  saveCategory,
  savePost,
  saveProduct,
  saveShippingSettings,
  toggleMessageHandled,
  updateOrderStatus,
} from "@/app/actions/admin";
import {
  Field,
  FormMessage,
  SelectField,
  SubmitButton,
  useSubmit,
  TextAreaField,
} from "@/components/forms";
import { secondaryButtonClass } from "@/components/ui";

const rupees = (paise: number | null | undefined) => (paise == null ? "" : String(paise / 100));

const checkboxClass = "size-4 accent-[var(--color-sand)]";

function ConfirmDelete({ label, onDelete }: { label: string; onDelete: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (window.confirm(`${label}?`)) startTransition(onDelete);
      }}
      className="text-[15px] text-red-300 underline hover:text-red-200"
    >
      {label}
    </button>
  );
}

type Option = { id: string; name: string };

type ProductData = {
  id: string;
  name: string;
  slug: string;
  description: string;
  makerStory: string | null;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  materials: string | null;
  dimensions: string | null;
  weightGrams: number | null;
  status: string;
  isFeatured: boolean;
  categoryId: string | null;
  artisanId: string | null;
  images: { id: string; url: string; alt: string }[];
};

export function ProductForm({
  product,
  categories,
  artisans,
}: {
  product?: ProductData;
  categories: Option[];
  artisans: Option[];
}) {
  const [state, onSubmit, pending] = useSubmit(saveProduct);
  const none = { value: "", label: "None" };
  const toOption = (option: Option) => ({ value: option.id, label: option.name });

  return (
    <form onSubmit={onSubmit} className="max-w-[820px] space-y-5">
      <FormMessage state={state} />
      <input type="hidden" name="id" value={product?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={product?.name} required state={state} />
        <Field
          label="Web address"
          name="slug"
          defaultValue={product?.slug}
          hint="Leave empty to create it from the name."
          state={state}
        />
      </div>
      <TextAreaField label="Description" name="description" rows={5} defaultValue={product?.description} required state={state} />
      <TextAreaField
        label="Maker's story (optional)"
        name="makerStory"
        rows={4}
        defaultValue={product?.makerStory ?? ""}
        state={state}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Price (₹)" name="price" inputMode="decimal" defaultValue={rupees(product?.price)} required state={state} />
        <Field label="Compare-at price (₹)" name="compareAtPrice" inputMode="decimal" defaultValue={rupees(product?.compareAtPrice)} state={state} />
        <Field label="Stock" name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} required state={state} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Materials" name="materials" defaultValue={product?.materials ?? ""} state={state} />
        <Field label="Dimensions" name="dimensions" defaultValue={product?.dimensions ?? ""} state={state} />
        <Field label="Weight (grams)" name="weightGrams" type="number" min={1} defaultValue={product?.weightGrams ?? ""} state={state} />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <SelectField
          label="Status"
          name="status"
          defaultValue={product?.status ?? "draft"}
          options={[
            { value: "draft", label: "Draft (hidden)" },
            { value: "active", label: "Active (on sale)" },
            { value: "archived", label: "Archived" },
          ]}
          state={state}
        />
        <SelectField
          label="Category"
          name="categoryId"
          defaultValue={product?.categoryId ?? ""}
          options={[none, ...categories.map(toOption)]}
          state={state}
        />
        <SelectField
          label="Artisan"
          name="artisanId"
          defaultValue={product?.artisanId ?? ""}
          options={[none, ...artisans.map(toOption)]}
          state={state}
        />
      </div>
      <label className="flex items-center gap-2 text-[15px] text-ivory/85">
        <input type="checkbox" name="isFeatured" defaultChecked={product?.isFeatured} className={checkboxClass} />
        Show in Our Collection on the home page
      </label>

      {product && product.images.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-[14px] text-ivory/85">Current photos (tick to remove)</legend>
          <ul className="flex flex-wrap gap-3">
            {product.images.map((image) => (
              <li key={image.id}>
                <label className="block cursor-pointer">
                  <span className="relative block size-[96px] overflow-hidden rounded-[6px] bg-card">
                    <Image src={image.url} alt={image.alt} fill sizes="96px" className="object-cover" />
                  </span>
                  <span className="mt-1 flex items-center gap-1 text-[13px] text-muted">
                    <input type="checkbox" name="removeImage" value={image.id} className={checkboxClass} />
                    Remove
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
      <Field
        label="Add photos"
        name="images"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        hint="JPG, PNG or WebP, up to 5 MB each."
      />

      <div className="flex items-center gap-6">
        <SubmitButton pending={pending}>Save Product</SubmitButton>
        {product && (
          <ConfirmDelete label="Delete product" onDelete={() => deleteProduct(product.id)} />
        )}
      </div>
    </form>
  );
}

type CategoryData = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sortOrder: number;
};

export function CategoryForm({ category }: { category?: CategoryData }) {
  const [state, onSubmit, pending] = useSubmit(saveCategory);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <input type="hidden" name="id" value={category?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field id={`name-${category?.id}`} label="Name" name="name" defaultValue={category?.name} required state={state} />
        <Field id={`slug-${category?.id}`} label="Web address" name="slug" defaultValue={category?.slug} state={state} />
        <Field id={`sort-${category?.id}`} label="Sort order" name="sortOrder" type="number" min={0} defaultValue={category?.sortOrder ?? 0} state={state} />
      </div>
      <Field id={`desc-${category?.id}`} label="Description" name="description" defaultValue={category?.description ?? ""} state={state} />
      <div className="flex items-center gap-6">
        <SubmitButton pending={pending} className={secondaryButtonClass}>{category ? "Save" : "Add Category"}</SubmitButton>
        {category && (
          <ConfirmDelete label="Delete category" onDelete={() => deleteCategory(category.id)} />
        )}
      </div>
    </form>
  );
}

type ArtisanData = {
  id: string;
  name: string;
  slug: string;
  shortBio: string;
  story: string;
  portrait: string | null;
  isPublished: boolean;
};

export function ArtisanForm({ artisan }: { artisan?: ArtisanData }) {
  const [state, onSubmit, pending] = useSubmit(saveArtisan);
  return (
    <form onSubmit={onSubmit} className="max-w-[820px] space-y-5">
      <FormMessage state={state} />
      <input type="hidden" name="id" value={artisan?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" defaultValue={artisan?.name} required state={state} />
        <Field label="Web address" name="slug" defaultValue={artisan?.slug} hint="Leave empty to create it from the name." state={state} />
      </div>
      <TextAreaField label="Short bio" name="shortBio" rows={2} defaultValue={artisan?.shortBio} required state={state} />
      <TextAreaField
        label="Story"
        name="story"
        rows={10}
        defaultValue={artisan?.story}
        hint='Leave a blank line between paragraphs. Start a line with "## " for a heading.'
        required
        state={state}
      />
      <Field
        label={artisan?.portrait ? "Replace portrait" : "Portrait"}
        name="portrait"
        type="file"
        accept="image/jpeg,image/png,image/webp"
      />
      <label className="flex items-center gap-2 text-[15px] text-ivory/85">
        <input type="checkbox" name="isPublished" defaultChecked={artisan?.isPublished} className={checkboxClass} />
        Published
      </label>
      <div className="flex items-center gap-6">
        <SubmitButton pending={pending}>Save Artisan</SubmitButton>
        {artisan && <ConfirmDelete label="Delete artisan" onDelete={() => deleteArtisan(artisan.id)} />}
      </div>
    </form>
  );
}

type PostData = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  status: string;
};

export function PostForm({ post }: { post?: PostData }) {
  const [state, onSubmit, pending] = useSubmit(savePost);
  return (
    <form onSubmit={onSubmit} className="max-w-[820px] space-y-5">
      <FormMessage state={state} />
      <input type="hidden" name="id" value={post?.id ?? ""} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title" name="title" defaultValue={post?.title} required state={state} />
        <Field label="Web address" name="slug" defaultValue={post?.slug} hint="Leave empty to create it from the title." state={state} />
      </div>
      <TextAreaField label="Summary" name="excerpt" rows={2} defaultValue={post?.excerpt} required state={state} />
      <TextAreaField
        label="Article"
        name="body"
        rows={16}
        defaultValue={post?.body}
        hint='Leave a blank line between paragraphs. Start a line with "## " for a heading.'
        required
        state={state}
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Cover image" name="coverImage" type="file" accept="image/jpeg,image/png,image/webp" />
        <SelectField
          label="Status"
          name="status"
          defaultValue={post?.status ?? "draft"}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
          ]}
          state={state}
        />
      </div>
      <div className="flex items-center gap-6">
        <SubmitButton pending={pending}>Save Post</SubmitButton>
        {post && <ConfirmDelete label="Delete post" onDelete={() => deletePost(post.id)} />}
      </div>
    </form>
  );
}

export function OrderStatusForm({
  number,
  options,
  trackingCarrier,
  trackingNumber,
}: {
  number: string;
  options: { value: string; label: string }[];
  trackingCarrier: string | null;
  trackingNumber: string | null;
}) {
  const [state, onSubmit, pending] = useSubmit(updateOrderStatus);
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <FormMessage state={state} />
      <input type="hidden" name="number" value={number} />
      <SelectField label="Change status to" name="status" options={options} state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Carrier" name="trackingCarrier" defaultValue={trackingCarrier ?? ""} state={state} />
        <Field label="Tracking number" name="trackingNumber" defaultValue={trackingNumber ?? ""} state={state} />
      </div>
      <Field label="Internal note (optional)" name="note" state={state} />
      <SubmitButton pending={pending}>Update Order</SubmitButton>
      <p className="text-[13px] text-muted">
        Refunds themselves are made in the Razorpay dashboard. Marking an order refunded here only
        records it and emails the customer.
      </p>
    </form>
  );
}

export function ShippingForm({ fee, freeAbove }: { fee: number; freeAbove: number }) {
  const [state, onSubmit, pending] = useSubmit(saveShippingSettings);
  return (
    <form onSubmit={onSubmit} className="max-w-[480px] space-y-4">
      <FormMessage state={state} />
      <Field label="Flat shipping fee (₹)" name="fee" inputMode="decimal" defaultValue={rupees(fee)} required state={state} />
      <Field label="Free shipping at or above (₹)" name="freeAbove" inputMode="decimal" defaultValue={rupees(freeAbove)} required state={state} />
      <SubmitButton pending={pending}>Save Settings</SubmitButton>
    </form>
  );
}

export function HandledToggle({ id, handled }: { id: string; handled: boolean }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => toggleMessageHandled(id, !handled))}
      className="text-[14px] text-ivory underline hover:text-gold"
    >
      {handled ? "Mark as new" : "Mark as handled"}
    </button>
  );
}
