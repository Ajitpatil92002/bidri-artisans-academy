# F12 — Search

**Status:** Done
**Milestone:** M2
**Design:** Ours, in the landing page style (D-014)

## Scope
- Header search icon opens a search box
- `/search?q=` results across product names and descriptions
- Postgres full-text search, no extra service

## Acceptance criteria
- [x] Finds products by partial words and is case-insensitive
- [x] Shows only active products
- [x] A search with no results shows a helpful empty state
