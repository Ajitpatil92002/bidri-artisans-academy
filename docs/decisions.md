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

### D-014 — We design the remaining pages ourselves
- **Date:** 2026-11-05
- **Status:** Decided. Supersedes D-007 for pages without a supplied design.
- **Decision:** Pages other than the home page are designed by us in the landing page's style, then reviewed and corrected by the owner. If the owner supplies a design for a page, that design wins and is matched per D-012.
- **Why:** The owner chose this so the complete app can be built without waiting for each design.

### D-015 — Local PostgreSQL in Docker, with Prisma
- **Date:** 2026-11-05
- **Status:** Decided
- **Decision:** Development uses PostgreSQL running in Docker, accessed through Prisma.
- **Why:** The owner's direction. Hosting for launch is still open (Q-11).

### D-016 — Customers must have an account to buy
- **Date:** 2026-11-05
- **Status:** Decided
- **Decision:** No guest checkout. Visitors can browse and fill a cart while logged out, but must log in or register at checkout.
- **Why:** The owner's direction.

### D-017 — India only, flat-rate shipping
- **Date:** 2026-11-05
- **Status:** Decided
- **Decision:** Ship within India only. One flat fee, with free shipping above a set order value. Both amounts are editable in admin; the values are in Q-12.
- **Why:** The owner's direction.

### D-018 — Login with Better Auth
- **Date:** 2026-11-05
- **Status:** Proposed
- **Decision:** Use Better Auth with email and password, stored through Prisma, with `customer` and `admin` roles covering both shoppers and the admin panel.

### D-019 — Images use the S3 API, with MinIO locally
- **Date:** 2026-11-05
- **Status:** Proposed
- **Decision:** Uploaded images go to S3-compatible storage: MinIO in Docker locally, and any S3-compatible host in production.
- **Why:** The same code works in both places.

### D-020 — Email through Mailpit locally and Resend in production
- **Date:** 2026-11-05
- **Status:** Proposed
- **Decision:** Mailpit catches all email in development. Resend sends it in production.

### D-021 — Zod for server-side validation
- **Date:** 2026-11-05
- **Status:** Proposed
- **Decision:** All user input is validated on the server with Zod.

### D-022 — Proposed tools confirmed
- **Date:** 2026-11-05
- **Status:** Decided. Confirms D-018 to D-021.
- **Decision:** Better Auth, S3 API with MinIO locally, Mailpit and Resend, and Zod are all approved.
- **Why:** The owner said to build everything after seeing the proposals.

### D-023 — No email verification
- **Date:** 2026-11-05
- **Status:** Decided
- **Decision:** Customers can use their account straight after registering, with no email verification step. Password reset and order emails still go out.
- **Why:** The owner's direction.

### D-024 — Cache Components turned off
- **Date:** 2026-11-05
- **Status:** Decided
- **Decision:** Set `cacheComponents` and `partialPrefetching` to false. Pages that read the database call `connection()` so they render per request, and no page needs the database at build time.
- **Why:** Stock and prices must always be fresh, and this keeps the many session-based pages simple.

### D-025 — Local stand-in for Razorpay
- **Date:** 2026-11-05
- **Status:** Decided
- **Decision:** With `RAZORPAY_MOCK=true`, checkout uses a local stand-in that runs the same server code, including signature verification. It's refused when `NODE_ENV` is `production`.
- **Why:** The whole purchase flow can be built and tested before Razorpay test keys are added.

### D-026 — Local uploads go to disk, S3 in production
- **Date:** 2026-11-05
- **Status:** Decided. Supersedes the MinIO part of D-019.
- **Decision:** In development, uploaded images are saved to `public/uploads`. In production they go to any S3-compatible host. Both sit behind one storage module, chosen by whether `S3_BUCKET` is set.
- **Why:** The MinIO image can no longer be pulled from Docker Hub or Quay without a login.

### D-027 — No local mail service
- **Date:** 2026-11-05
- **Status:** Decided. Supersedes the Mailpit part of D-020.
- **Decision:** Mailpit is removed. In development, emails are saved as HTML files in `.dev-emails/` and noted in the server log. In production, Resend sends them.
- **Why:** The owner removed Mailpit on purpose. Local work doesn't need a mail service.

### D-028 — Images on Cloudflare R2
- **Date:** 2026-11-05
- **Status:** Decided. Fills in the production host left open in D-026.
- **Decision:** Uploaded images are stored in Cloudflare R2, through its S3-compatible API. Setting the `S3_*` variables turns it on, and the same code works locally if those are set. With no bucket configured, uploads still go to `public/uploads` in development.
- **Why:** The owner's direction.

### D-029 — Neon for the production database
- **Date:** 2026-11-05
- **Status:** Decided. Answers Q-11.
- **Decision:** Production uses Neon Postgres. The app connects through Neon's pooled URL (`DATABASE_URL`), and migrations use its direct URL (`DIRECT_URL`). Local development stays on Docker.
- **Why:** The owner's direction.

### D-030 — The app runs in Vercel's Singapore region
- **Date:** 2026-11-05
- **Status:** Decided
- **Decision:** Set `regions: ["sin1"]` in `vercel.json`, to sit next to the Neon database.
- **Why:** The project defaulted to the US, which would add a slow round trip to every database read.

---

## Open questions (to decide later)

| # | Question | Notes |
|---|---|---|
| Q-1 | ~~Database and ORM~~ | Answered by D-015 |
| Q-2 | ~~Admin login method~~ | Proposed in D-018 |
| Q-3 | ~~Where product images are stored~~ | Proposed in D-019 |
| Q-4 | ~~Shipping zones~~ | Answered by D-017; amounts are Q-12 |
| Q-5 | Taxes / GST: are you GST registered? Are prices tax-inclusive? Do you need GST invoices? | Needed before checkout is finished |
| Q-6 | ~~Customer accounts, or guest checkout only~~ | Answered by D-016 |
| Q-7 | Languages (English only, or Hindi/Kannada too) | Assumed English only for now |
| Q-8 | Brand name: the design says "Bidri Craft" but the domain is bidriart.com. Which name is official? | The site uses "Bidri Craft", as in the design |
| Q-9 | Newsletter email provider | Needed to wire up the signup form |
| Q-10 | Do gifts really ship gift-ready with a story card? | The gifting section says so; confirm or change the copy |
| Q-11 | ~~Hosted Postgres for launch~~ | Answered by D-029 |
| Q-12 | Flat shipping fee and free-shipping threshold | Placeholders until confirmed: ₹99 fee, free above ₹1,499 |
| Q-13 | Returns, refunds and cancellation policy | Razorpay requires these pages before live payments |
| Q-14 | Business details for legal pages and invoices: legal name, address, phone, support email | Needed for F13 |
| Q-15 | Is cash on delivery wanted? | Planned as online payment only |
| Q-16 | Who is the shipping carrier? | Planned as manual tracking entry in admin |
| Q-17 | Real artisan names, stories and photos, with their permission to publish | Needed for F05; we won't invent people |
