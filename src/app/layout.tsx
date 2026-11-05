import type { Metadata } from "next";
import { DM_Sans, Lora } from "next/font/google";
import "./globals.css";

const heading = Lora({
  variable: "--font-heading",
  subsets: ["latin"],
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "Bidri Craft — Handcrafted Bidri Jewellery from Bidar",
    template: "%s — Bidri Craft",
  },
  description:
    "Handcrafted treasures in black metal with intricate silver inlay — authentic Bidri art from Bidar, Karnataka.",
  openGraph: {
    siteName: "Bidri Craft",
    type: "website",
    locale: "en_IN",
    images: ["/images/banners/hero-teardrop.webp"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${heading.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full font-sans">{children}</body>
    </html>
  );
}
