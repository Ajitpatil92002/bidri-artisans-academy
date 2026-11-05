# F09 — Foundation

**Status:** Done
**Milestone:** M1
**Design:** Ours, in the landing page style (D-014)

## Scope
- Docker services for Postgres, image storage and local email
- Prisma setup, first migration and seed data from the current products
- Shared site layout: header and footer on every page, active nav link
- Shared UI: buttons, inputs, form errors, price, empty and loading states, 404 and error pages
- `.env.example`, and test setup

## Acceptance criteria
- [x] `docker compose up -d`, then migrate and seed, gives a working database from a clean checkout
- [x] The home page reads its products from the database and looks unchanged
- [x] Every page shares the same header and footer
- [x] Build, lint and tests pass
