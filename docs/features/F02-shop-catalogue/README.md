# F02 — Shop catalogue

**Status:** Done
**Milestone:** M2
**Design:** Ours, in the landing page style (D-014)

## Scope
- `/shop` with all active products
- Category pages at `/shop/category/[slug]`
- Sorting (newest, price) and filters (category, price range), kept in the URL
- Pagination, sold-out badges, and an empty state

## Acceptance criteria
- [x] Draft and archived products never appear
- [x] Sold-out products show a badge
- [x] Filters and sort survive a refresh and can be shared as a link
- [x] Works at 375px with no horizontal scroll
