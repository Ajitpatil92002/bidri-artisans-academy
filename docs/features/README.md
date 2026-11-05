# Features

Each feature has its own folder:

- `README.md`: what the feature is, its scope, design source, and acceptance criteria
- `tasks.md`: the feature's tasks, with status, a dated progress log, and follow-ups

Status: **Planned** · **In progress** · **Built** (waiting on owner content) · **Done**

## Build order

IDs are stable labels, so they don't follow the build order. Each milestone ends with something you can use and review. How it's built is in [architecture.md](../architecture.md).

| Milestone | What you get | Feature | Status | Tasks done |
|---|---|---|---|---|
| Done | Project and home page | [F00 Project setup](F00-project-setup/README.md) | Done | 5/5 |
| Done | | [F01 Landing page](F01-landing-page/README.md) | Done | 11/11, with 4 follow-ups open |
| **M1** | Database running; shared layout | [F09 Foundation](F09-foundation/README.md) | Done | 10/10 |
| **M2** | Browse and search real products | [F02 Shop catalogue](F02-shop-catalogue/README.md) | Done | 6/6 |
| | | [F03 Product page + maker story](F03-product-page/README.md) | Done | 7/7 |
| | | [F12 Search](F12-search/README.md) | Done | 3/3 |
| **M3** | Register, log in, manage account | [F10 Customer accounts](F10-customer-accounts/README.md) | Done | 9/9 |
| **M4** | Buy a product (test payments) | [F04 Cart + Razorpay checkout](F04-cart-checkout/README.md) | Done (real Razorpay untested) | 13/13 |
| | | [F11 Emails and order tracking](F11-order-emails/README.md) | Done (Resend untested) | 6/6 |
| **M5** | Run the shop with no code | [F07 Admin panel](F07-admin/README.md) | Done | 11/11 |
| **M6** | Stories and every page complete | [F05 Artisan profiles](F05-artisans/README.md) | Built | 2/3 |
| | | [F06 Craft blog / About Bidri](F06-craft-blog/README.md) | Built | 3/4 |
| | | [F13 Contact, newsletter and policies](F13-contact-policies/README.md) | Built | 3/4 |
| **M7** | Live at bidriart.com | [F08 Launch](F08-launch/README.md) | In progress | 1/8 |

## Backlog (not planned yet)

Good ideas to consider after launch: wishlist, product reviews, discount codes, cash on delivery (Q-15), gift wrap and gift notes, shipping carrier integration (Q-16), GST invoices as PDFs (Q-5), Hindi and Kannada (Q-7), international shipping.

## Adding a feature

1. Copy an existing folder, then name it `F<next number>-<short-name>`.
2. Fill in its `README.md` and `tasks.md`.
3. Add it to the table above.

Task IDs are `F<nn>-T<nn>`, e.g. `F01-T03`.
