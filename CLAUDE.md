# CLAUDE.md

@AGENTS.md

## Project

**bidriart.com** is an ecommerce store for Bidri art (handmade silver-inlay metalwork from Bidar), with story content: artisan profiles, a craft blog, and maker stories on product pages. Ecommerce comes first and the stories support sales.

Full context: [docs/project-overview.md](docs/project-overview.md).

## Current phase

**F01 Landing page done (static).** Every other feature is waiting on the owner's design. Don't build a feature until its design is recorded in `docs/design/` and its tasks are written in its feature folder. See `docs/features/README.md` for status.

## Workflow (required)

1. **Read the docs first:** `docs/features/README.md`, the feature's own folder, `docs/decisions.md`, `docs/changelog.md`.
2. **One folder per feature:** `docs/features/F<nn>-<name>/` holds `README.md` (scope, design, acceptance) and `tasks.md` (tasks, progress log, follow-ups). New work maps to a task ID `F<nn>-T<nn>`. If no task exists for it, add one first.
3. **Design, then docs and tasks, then build.**
4. **Record decisions.** Any choice of library, service, data model or behaviour goes into `docs/decisions.md` as a new `D-xxx` entry before the code that depends on it. Never edit a past decision. Add a new one that supersedes it.
5. **Keep progress current.** Mark tasks `[~]` when you start them and `[x]` when they're done, add a dated line to the feature's progress log, and update the status table in `docs/features/README.md`.
6. **Log every session** in `docs/changelog.md`: what changed, and what's next.
7. **Ask, don't assume,** on open questions (the `Q-x` list in `decisions.md`), especially payments, shipping, tax and data storage. Any copy we write that makes a business promise needs the owner's review.

## Matching designs (pixel-perfect)

The owner expects designs to be matched exactly (D-012):
- Match at the design's own width (the home page is 1536px), and check by measuring. Don't eyeball it.
- Method: load the design image into a canvas in the browser, find each element's pixel bounds, and compare them with the live text bounds (from `getBoundingClientRect` plus canvas `measureText`). Target: within about 2px.
- Keep the design file out of `public/` once you're done; a temporary copy is fine while measuring.
- Record the sizes you land on in `docs/design/README.md`.

## Stack

- Next.js 16 (App Router, `src/` directory) with React 19 and the React Compiler enabled
- TypeScript, Tailwind CSS 4, ESLint
- Payments: Razorpay (test mode until launch)
- Deploy: Vercel
- Not chosen yet: database/ORM, admin login, image storage (see `docs/decisions.md`)

Next.js 16 differs from older versions. Check `node_modules/next/dist/docs/` before using a Next.js API (see AGENTS.md).

## Commands

```bash
npm run dev      # dev server at http://localhost:3000
npm run build    # production build; must pass before committing
npm run lint     # ESLint
```

## Conventions

- Import alias `@/*` maps to `src/*`.
- Brand colours and fonts are Tailwind theme tokens in `src/app/globals.css` (`ink`, `ivory`, `gold`, `sand`, …; `font-serif` = Lora, `font-sans` = DM Sans). Use the tokens, not raw hex values.
- Home page sections live in `src/components/home/`; shared icons and the logo are in `src/components/icons.tsx`.
- `cacheComponents` is on: don't call `new Date()` or other changing values in server components without following the Next.js 16 rules (the build fails).
- Prices are stored as integers in paise. Razorpay uses paise too.
- Secrets (Razorpay keys, database URL) live in `.env.local` only. `.env*` is gitignored and must never be committed.
- Commit only when the owner asks.
