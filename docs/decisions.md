# Decision Log

Each decision gets an ID, a date, what was decided, and why. A decision is never edited later. If it changes, add a new entry that supersedes it.

Status: **Decided**, **Proposed** (not confirmed yet), or **Superseded by D-xxx**.

---

### D-001 — Drop the old academy site and start fresh
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** Delete the old "Bidri Artisans Academy" course/enrollment website (Vite + React) completely and build a new site from scratch.
- **Why:** It was a dummy site with no use for the real business. It's still in git history (last commit `9e1a8c8`) if any images or logos are needed.

### D-002 — The site is ecommerce first, story content second
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** The main purpose is selling Bidri art. Story content (artisans, craft history) supports sales.
- **Why:** The owner's direction.

### D-003 — Brand / domain: bidriart.com
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** The store is bidriart.com and sells Bidri art.

### D-004 — Payments via Razorpay
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** Use Razorpay for checkout (UPI, cards, netbanking). Build and test in Razorpay test mode first.
- **Why:** Best fit for Indian buyers.

### D-005 — Stack: Next.js full-stack, deployed on Vercel
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** Next.js (App Router) with TypeScript and Tailwind CSS, with its own database and admin panel. Deploy on Vercel.
- **Versions at setup:** Next.js 16.4.4, React 19.3.0, Tailwind CSS 4, TypeScript 5, Node 26.

### D-006 — Content features
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** Build all three: artisan profiles linked to products, a craft history blog, and maker stories on product pages.

### D-007 — Design comes first, then docs/tasks, then build
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** Only the project scaffold is set up for now. The owner will provide a design. Then we record it in the docs, break it into tasks, and only then build.
- **Why:** The owner's direction: plan and record everything before building.

### D-008 — Each feature gets its own docs folder
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** Every feature lives in `docs/features/F<nn>-<name>/`, with a `README.md` (scope, design, acceptance) and a `tasks.md` (tasks, progress log, follow-ups). `docs/tasks.md` becomes an index.
- **Why:** The owner's direction: record each feature, its tasks and their progress separately.

### D-009 — Fonts: Lora (headings) and DM Sans (body)
- **Date:** 2026-11-03
- **Status:** Decided (can change if the owner provides the design's original fonts)
- **Decision:** Use Lora for headings and DM Sans for body/UI, both from Google Fonts via `next/font`.
- **Why:** The design doesn't name its fonts. Of about 100 Google serif fonts tested against the heading's proportions, Lora was the closest visual match. DM Sans matches the body text widths to within 1–2px.

### D-010 — Hero is a carousel of the banner photos
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** The hero background rotates through the three banner photos (teardrop, fan-heart, star) every 5 seconds with a crossfade. The text and button stay fixed. Auto-play pauses on hover or focus and is off when the visitor's system asks for reduced motion.
- **Why:** The owner asked for it.

### D-011 — Extra home page sections beyond the design
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** Below "Our Collection" we added The Art of Bidri, How it's made, Thoughtful Gifting, Newsletter and a Footer, in the same visual style. The designed part stays pixel-matched.
- **Why:** The owner asked for more sections so the page feels full. The copy is ours and needs the owner's review (see F01 follow-ups).

### D-012 — Pixel-perfect means matching the design at 1536px
- **Date:** 2026-11-03
- **Status:** Decided
- **Decision:** Designs are matched exactly at the width they were drawn at (1536px for home-page-v1), checked by measuring pixel bounds. Other widths get a sensible responsive layout until mobile designs exist.
- **Why:** The owner asked for an exact pixel match. A fixed-width mockup can only be exact at its own width.

### D-013 — Full-screen hero with larger text (overrides the design's hero size)
- **Date:** 2026-11-03
- **Status:** Decided. For the hero only, this supersedes the design's hero height and text sizes from D-012.
- **Decision:** The hero fills the first screen (viewport height minus the header, with a minimum of 560px on desktop and 520px on mobile). The photo covers the area, and the text is centred vertically. Desktop hero text is larger than in the design: heading 72px, subtext 22px, eyebrow 18px, button 54px tall. Everything else stays pixel-matched to the design.
- **Why:** The owner asked for the hero image to fill the first view and for bigger desktop text.

---

## Open questions (to decide later)

| # | Question | Notes |
|---|---|---|
| Q-1 | Database and ORM | Proposed: PostgreSQL (e.g. Neon) with Prisma |
| Q-2 | Admin login method | Proposed: a simple password-protected admin to start, or Better Auth |
| Q-3 | Where product images are stored | Proposed: Vercel Blob or Cloudinary |
| Q-4 | Shipping: rates, zones, international or not | Needed before checkout is built |
| Q-5 | Taxes / GST on invoices | Needed before checkout is built |
| Q-6 | Customer accounts, or guest checkout only | |
| Q-7 | Languages (English only, or Hindi/Kannada too) | |
| Q-8 | Brand name: the design says "Bidri Craft" but the domain is bidriart.com. Which name is official? | The site uses "Bidri Craft", as in the design |
| Q-9 | Newsletter email provider | Needed to wire up the signup form |
| Q-10 | Do gifts really ship gift-ready with a story card? | The gifting section says so; confirm or change the copy |
