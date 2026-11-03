# Design

## Received

| Date | File | What it is |
|---|---|---|
| 2026-11-03 | [home-page-v1.webp](home-page-v1.webp) | Home page design (desktop): header, hero, trust strip, "Our Collection" row |
| 2026-11-03 | `public/images/banners/*`, `public/images/products/*` | First product photos: 3 wide banners, 4 square product shots |

More product images are still to come from the owner.

## Brand (taken from home-page-v1)

- **Name shown in the design:** "Bidri Craft", with the tagline "Handcrafted in Bidar". The domain is bidriart.com (see Q-8 in [decisions.md](../decisions.md)).
- **Mood:** dark and premium. Near-black backgrounds with warm silver and champagne-gold accents, matching the Bidri pieces themselves (black metal, silver inlay).

### Colours
| Token | Hex | Use |
|---|---|---|
| `ink` | `#0e0e0f` | Page background |
| `ink-2` | `#141416` | Header and trust strip background |
| `card` | `#262320` | Product card base |
| `line` | `#2a2a2c` | Dividers and borders |
| `ivory` | `#f1ece4` | Headings and main text |
| `muted` | `#a9a39a` | Secondary text |
| `gold` | `#cdb38a` | Eyebrow text, icons, logo |
| `sand` | `#e6d3b3` | Primary button background |

### Type
The design doesn't name its fonts, so we matched them from the image:
- **Headings: Lora** (Google Fonts). We tested about 100 Google serif fonts against the heading's proportions, and Lora was the closest visual match.
- **Body and UI: DM Sans** (Google Fonts). Its widths match the design's nav and body text to within 1–2px.
- **Eyebrow labels:** DM Sans, uppercase, with wide letter spacing (0.33em), in gold

If the owner has the original font files or names, swap them in `src/app/layout.tsx`.

### Key sizes at 1536px
| Element | Size |
|---|---|
| Logo wordmark | Lora 32px |
| Hero heading | Lora 72px / 76px line height (design: 58px; enlarged per D-013) |
| Hero subtext | DM Sans 22px / 32px (design: 19.5px; enlarged per D-013) |
| Section heading ("Our Collection") | Lora 34.3px |
| Nav links | DM Sans 17px |
| Trust title / sub | DM Sans 16.6px / 14.3px |
| Card name / price | DM Sans 18.5px / 19px |

## Pixel match (home page, 1536px)
We checked by drawing the design into a canvas, finding each text block's exact pixel bounds, and comparing those with the live page's text bounds.
- **Text and layout:** every measured element is within about 1–2px of the design (header, nav, hero text and button, trust strip, collection heading, cards).
- **Hero photo:** the crop was found by image search: the photo is drawn 1664px wide, shifted −128px horizontally and −135px vertically. This was later replaced: at the owner's request the hero now fills the whole first screen with larger text (D-013), so the hero no longer matches the design's 457px height.
- **Known limits:**
  - The design is a mockup, so its product photos don't exactly match the real photos we were given.
  - The fonts are the closest Google Fonts matches, not necessarily the designer's originals. Glyph shapes can differ slightly even where sizes and positions match.
- Below 1536px the layout scales down. Mobile (under 1024px) is our own layout, since no mobile design was given.

## Home page sections (home-page-v1)

1. **Header:** logo (ornament plus "Bidri Craft / Handcrafted in Bidar"); nav links Home, Shop, About Bidri, Our Artisans, Contact; icons for search, account and cart (with a count badge)
2. **Hero:** eyebrow "Bidri from Bidar", heading "Timeless Bidri Jewellery", a supporting line, and a "Shop Collection →" button over a full-width teardrop-earrings photo
3. **Trust strip:** four items (Authentic Bidri Craft, Handcrafted, Heritage Art, Thoughtful Gifting), each with an icon and a sub-line
4. **Our Collection:** heading plus "View All →", and six product cards (image, name, price): Heart ₹699, Leaf ₹699, Floral ₹699, Fan ₹749, Star ₹749, Teardrop ₹799

## Image mapping

| Product | Image |
|---|---|
| Heart Earrings | `products/heart-earrings.webp` |
| Leaf Earrings | `products/leaf-earrings.webp` |
| Floral Earrings | `products/floral-earrings.webp` |
| Fan Earrings | `banners/fan-heart.webp` (cropped; a square shot is still needed) |
| Star Earrings | `banners/star.webp` (cropped; a square shot is still needed) |
| Teardrop Earrings | `products/teardrop-earrings.webp` |
| Hero | `banners/hero-teardrop.webp` |

## Not designed yet

- Mobile layouts
- The home page sections below "Our Collection" (Art of Bidri, How it's made, Gifting, Newsletter, Footer). We built these in the same style (D-011).
- Every other page: shop, product, cart, artisans, blog, admin

Until a design arrives, all of these are our own interpretation.
