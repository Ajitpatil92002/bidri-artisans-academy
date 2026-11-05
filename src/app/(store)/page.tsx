import { CollectionGrid } from "@/components/home/CollectionGrid";
import { CraftProcess } from "@/components/home/CraftProcess";
import { CraftStory } from "@/components/home/CraftStory";
import { GiftBanner } from "@/components/home/GiftBanner";
import { Hero } from "@/components/home/Hero";
import { Newsletter } from "@/components/home/Newsletter";
import { TrustStrip } from "@/components/home/TrustStrip";

export default function HomePage() {
  return (
    <>
      <main>
        {/* Designed in home-page-v1 */}
        <Hero />
        <TrustStrip />
        <CollectionGrid />
        {/* Not in the design yet: our own sections in the same style */}
        <CraftStory />
        <CraftProcess />
        <GiftBanner />
        <Newsletter />
      </main>
    </>
  );
}
