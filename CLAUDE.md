# CLAUDE.md

@AGENTS.md

## Project

**bidriart.com** is an ecommerce store for Bidri art (handmade silver-inlay metalwork from Bidar), with story content: artisan profiles, a craft blog, and maker stories on product pages. Ecommerce comes first and the stories support sales.

Full context: [docs/project-overview.md](docs/project-overview.md).

## Current phase

**Setup done. Waiting on the design.** Don't build pages or features until the owner has provided the design and it's recorded in `docs/design/` with detailed tasks in `docs/tasks.md`.

## Workflow (required)

1. **Read the docs first:** `docs/tasks.md`, `docs/decisions.md`, `docs/changelog.md`.
2. **Design, then docs and tasks, then build.** Every piece of work maps to a task ID (`T-xxx`) in `docs/tasks.md`. If no task exists for it, add one first.
3. **Record decisions.** Any choice of library, service, data model or behaviour goes into `docs/decisions.md` as a new `D-xxx` entry before the code that depends on it. Never edit a past decision. Add a new one that supersedes it.
4. **Keep tasks current.** Mark tasks `[~]` when you start them and `[x]` when they're done.
5. **Log every session** in `docs/changelog.md`: what changed, and what's next.
6. **Ask, don't assume,** on open questions (the `Q-x` list in `decisions.md`), especially payments, shipping, tax and data storage.

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
- Prices are stored as integers in paise. Razorpay uses paise too.
- Secrets (Razorpay keys, database URL) live in `.env.local` only. `.env*` is gitignored and must never be committed.
- Commit only when the owner asks.
