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
