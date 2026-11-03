# Changelog

Newest first. One entry per working session: what was done, and what's next.

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
