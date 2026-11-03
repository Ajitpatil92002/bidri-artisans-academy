// Static product data for the landing page (F01). Replaced by the database in F02.

export type Product = {
  slug: string;
  name: string;
  /** Price in paise */
  price: number;
  image: string;
  /** CSS object-position for the card crop */
  imagePosition?: string;
};

export const featuredProducts: Product[] = [
  {
    slug: "heart-earrings",
    name: "Heart Earrings",
    price: 69900,
    image: "/images/products/heart-earrings.webp",
  },
  {
    slug: "leaf-earrings",
    name: "Leaf Earrings",
    price: 69900,
    image: "/images/products/leaf-earrings.webp",
  },
  {
    slug: "floral-earrings",
    name: "Floral Earrings",
    price: 69900,
    image: "/images/products/floral-earrings.webp",
  },
  {
    slug: "fan-earrings",
    name: "Fan Earrings",
    price: 74900,
    image: "/images/banners/fan-heart.webp",
    imagePosition: "61% 50%",
  },
  {
    slug: "star-earrings",
    name: "Star Earrings",
    price: 74900,
    image: "/images/banners/star.webp",
    imagePosition: "63% 50%",
  },
  {
    slug: "teardrop-earrings",
    name: "Teardrop Earrings",
    price: 79900,
    image: "/images/products/teardrop-earrings.webp",
  },
];

export function formatPrice(paise: number) {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}
