# Tasks

Status: `[ ]` to do · `[~]` in progress · `[x]` done · `[-]` dropped (say why)

Detailed tasks for phases 2 onward get written once the design arrives. These are the planned phases.

## Phase 0 — Setup
- [x] T-001 Delete the old academy site (D-001)
- [x] T-002 Scaffold Next.js + TypeScript + Tailwind at the repo root
- [x] T-003 Create the docs folder: overview, decisions, tasks, changelog
- [x] T-004 Write CLAUDE.md
- [ ] T-005 Commit the setup

## Phase 1 — Design
- [ ] T-010 Receive the design from the owner
- [ ] T-011 Save the design and record it in `docs/design/` (pages, colours, fonts, components)
- [ ] T-012 Answer the open questions in `decisions.md` that the design depends on
- [ ] T-013 Break the design into detailed build tasks below

## Phase 2 — Foundation (detail after design)
- [ ] Database + ORM (Q-1)
- [ ] Data models: Product, Category, Artisan, BlogPost, Order
- [ ] Design system: colours, fonts, base components from the design
- [ ] Site layout: header, footer, navigation

## Phase 3 — Shop (detail after design)
- [ ] Home page
- [ ] Shop / category listing
- [ ] Product detail page with maker story
- [ ] Cart
- [ ] Razorpay checkout (test mode)
- [ ] Order confirmation + order records

## Phase 4 — Stories (detail after design)
- [ ] Artisan list + profile pages (linked to products)
- [ ] Craft blog list + article pages

## Phase 5 — Admin (detail after design)
- [ ] Admin login (Q-2)
- [ ] Manage products, artisans, blog posts
- [ ] View and manage orders

## Phase 6 — Launch
- [ ] SEO: metadata, sitemap, social images
- [ ] Switch Razorpay to live mode
- [ ] Deploy to Vercel and connect bidriart.com
