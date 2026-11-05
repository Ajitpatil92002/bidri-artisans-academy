# Changelog

Newest first. One entry per working session: what was done, and what's next.

## 2026-11-05 — First deploy attempt
- The Vercel deploy of `aec37ed` failed with no `dist` folder: the project is still configured for the old Vite site. The last successful deploy is still the old academy site.
- Owner chose Neon for production (D-029). Set `framework: nextjs` in `vercel.json`, added `DIRECT_URL` for migrations, and wrote the launch order in F08.

- Created Neon project `bidri-craft` in Singapore, ran migrations and seeded it.

**Next:** add the settings to Vercel, then follow the F08 launch order. Don't push before that.

## 2026-11-05 — Complete app built (M1 to M6)
- Built everything in docs/features: database, shop, search, product pages, accounts, cart, checkout, emails, admin, artisans, journal, contact, newsletter and policy pages.
- Owner changes during the build: no email verification (D-023), Mailpit removed (D-027), Cloudflare R2 for images (D-028), show/hide password on every password field.
- Other decisions: Cache Components off (D-024), local Razorpay stand-in (D-025), uploads to disk locally (D-026).
- Tests: 31 unit and database tests (Vitest), 7 browser journeys (Playwright). All pass.
- Bugs found by testing and fixed: a new address wasn't selected at checkout; forms cleared what people typed when validation failed.
- Not tested yet, because each needs an account: real Razorpay, Resend, Cloudflare R2.
- Known dev-only issue: the dev server sometimes reloads the first page repeatedly after starting. It settles by itself.
- Committed as `aec37ed` and pushed to `main`.

**Next:** the owner reviews the site, then adds Razorpay test keys and answers the questions in docs/tasks.md.

## 2026-11-05 — Full app plan
- Planned the complete app. No code changed.
- Owner decisions: we design the remaining pages (D-014), local Postgres in Docker with Prisma (D-015), account required to buy (D-016), India-only flat-rate shipping (D-017).
- Proposed, awaiting confirmation: Better Auth, MinIO/S3 images, Mailpit/Resend email, Zod (D-018 to D-021).
- Added `docs/architecture.md`: services, routes, data model, checkout flow and security.
- Added features F09 Foundation, F10 Customer accounts, F11 Emails, F12 Search and F13 Contact and policies. Rewrote F02 to F08. Set seven milestones, with 84 planned tasks.
- Added questions Q-11 to Q-17.

**Next:** the owner confirms the proposals and starts Docker, then we begin M1 (F09 Foundation).

## 2026-11-03 — Landing page (F01)
- Received the home page design and the first product photos. Saved them to `docs/design/` and `public/images/`.
- Moved to per-feature docs: `docs/features/F00…F08`, each with its own README and tasks (D-008).
- Built the static landing page: header with mobile menu, hero, trust strip, Our Collection.
- Pixel-matched it to the design at 1536px by measuring pixel bounds. Text is within about 1–2px, and the hero photo crop was found by image search. Chose Lora + DM Sans as the closest fonts (D-009, D-012).
- Owner requests: a hero carousel of the three banners (D-010), and more sections so the page feels full: Art of Bidri, How it's made, Gifting, Newsletter, Footer (D-011).
- Owner requests: the hero fills the first screen, and the desktop hero text is bigger (D-013).
- Build, lint and typecheck pass, and `/` is fully static. Checked at 1870, 1536, 1280 and 375px wide.
- Added `.claude/launch.json` so the dev server can be previewed.

**Next:** the owner reviews the page and the added copy, sends more product photos, and sends the next design.

## 2026-11-03 — Fresh start and project setup
- Deleted every file of the old "Bidri Artisans Academy" dummy site (D-001). It's still in git history at `9e1a8c8`.
- Agreed the direction: bidriart.com, ecommerce first with story content, Razorpay, Next.js full-stack (D-002 to D-006).
- Scaffolded Next.js 16.4.4 + React 19.3 + Tailwind 4 + TypeScript at the repo root. The default starter page is unchanged, and `npm run build` passes.
- Created `docs/` (overview, decisions, tasks, changelog, design placeholder) and `CLAUDE.md`.
- Paused building until the owner provides the design (D-007).

**Next:** the owner shares the design, then we record it in `docs/design/` and write the detailed tasks.
