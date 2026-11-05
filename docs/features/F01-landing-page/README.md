# F01 — Landing page

**Status:** Done
**Design:** [docs/design/home-page-v1.webp](../../design/home-page-v1.webp)
**Route:** `/`

## Scope
The home page. Our Collection reads featured products from the database.

### From the design (pixel-matched at 1536px)
1. **Header:** logo, nav links, search/account/cart icons with a cart badge (always 0 for now). On mobile, the nav collapses into a menu button.
2. **Hero:** fills the first screen (D-013); eyebrow, heading, subtext and "Shop Collection" button over a **carousel** of the three banner photos (D-010)
3. **Trust strip:** four value points with icons
4. **Our Collection:** six product cards and a "View All" link

### Added beyond the design (D-011)
5. **The Art of Bidri:** a craft history story with an image
6. **How it's made:** four steps (Casting, Engraving, Inlaying, Oxidising)
7. **Thoughtful Gifting:** a banner with a CTA
8. **Newsletter:** a signup form that saves to the database
9. **Footer:** brand, link columns, copyright

## Components
| File | Section |
|---|---|
| `src/components/home/SiteHeader.tsx` + `MobileMenu.tsx` | Header |
| `src/components/home/Hero.tsx` + `HeroCarousel.tsx` | Hero + carousel |
| `src/components/home/TrustStrip.tsx` | Trust strip |
| `src/components/home/CollectionGrid.tsx` | Our Collection |
| `src/components/home/CraftStory.tsx` | The Art of Bidri |
| `src/components/home/CraftProcess.tsx` | How it's made |
| `src/components/home/GiftBanner.tsx` | Gifting banner |
| `src/components/home/Newsletter.tsx` | Newsletter |
| `src/components/home/SiteFooter.tsx` | Footer |
| `src/components/icons.tsx` | All icons + logo mark |

## Carousel behaviour
- It moves to the next photo every 5 seconds, with a 1-second crossfade.
- It pauses on hover or focus.
- It doesn't auto-play when the visitor's system asks for reduced motion.
- Dot buttons below the hero switch slides. Picking one restarts the 5-second timer.
- The text stays fixed. Only the photo changes.

## Not in scope (yet)
- A working cart count, search, account or newsletter. Those come with later features.
- The pages that the nav and footer links point to. Until their features are built, those links lead to a 404.

## Acceptance criteria
- [x] Matches `home-page-v1` at 1536px in layout, colours, type and content (see "Pixel match" in [design/README.md](../../design/README.md))
- [x] Works at 375px wide with no horizontal scrolling; mobile menu works
- [x] All images use `next/image` with alt text
- [x] `npm run build`, `npm run lint` and `tsc` pass; the page is fully static
