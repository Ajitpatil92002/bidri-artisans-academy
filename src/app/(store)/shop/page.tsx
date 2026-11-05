import type { Metadata } from "next";
import { ShopView, type ShopSearchParams } from "@/components/shop/ShopView";
import { PageContainer, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Shop Bidri Jewellery",
  description: "Handmade Bidri jewellery in black metal and silver, from the artisans of Bidar.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="The collection"
        title="Shop Bidri"
        intro="Black metal and silver, shaped and inlaid by hand in Bidar."
      />
      <ShopView basePath="/shop" searchParams={await searchParams} />
    </PageContainer>
  );
}
