# Architecture

How the complete app fits together. Decisions behind this are in [decisions.md](decisions.md) (D-014 onward). Items marked *proposed* aren't confirmed yet.

## Overview

One Next.js app holds the storefront, the customer account area and the admin panel. It talks to Postgres through Prisma.

```
Browser ── Next.js app ──┬── PostgreSQL (via Prisma)
                         ├── Cloudflare R2 (product and story images)
                         ├── Razorpay (payments)
                         └── Email (order and account emails)
```

## Local development (Docker)

`docker-compose.yml` runs Postgres. The Next.js app itself runs on your machine with `npm run dev`.

| Service | Purpose | Port |
|---|---|---|
| `postgres` | Main database | 5432 |

Secrets go in `.env.local`, which is never committed. `.env.example` lists every variable with no real values.

## Production (decide before launch)

Docker is for local work. Vercel can't reach a database running on your own machine, so launch needs a hosted Postgres (Q-11). Images go to Cloudflare R2 (D-028). Moving is mostly a change of connection settings.

## Stack additions

| Need | Choice | Status |
|---|---|---|
| Database | PostgreSQL in Docker | Decided (D-015) |
| ORM | Prisma | Decided (D-015) |
| Login | Better Auth, email + password, `customer` and `admin` roles, no email verification | Decided (D-022, D-023) |
| Image storage | `public/uploads` locally, Cloudflare R2 in production | Decided (D-028) |
| Email | Saved to `.dev-emails/` locally, Resend in production | Decided (D-027) |
| Payments | Razorpay | Decided (D-004) |
| Form validation | Zod, on the server for every input | Decided (D-022) |

## Routes

### Storefront
| Route | Page | Feature |
|---|---|---|
| `/` | Home | F01 |
| `/shop`, `/shop/category/[slug]` | Catalogue | F02 |
| `/shop/[slug]` | Product | F03 |
| `/search` | Search results | F12 |
| `/artisans`, `/artisans/[slug]` | Artisans | F05 |
| `/about-bidri` | About Bidri | F06 |
| `/journal`, `/journal/[slug]` | Blog | F06 |
| `/contact` | Contact form | F13 |
| `/shipping`, `/returns`, `/care`, `/privacy`, `/terms` | Policy and help pages | F13 |

### Customer (login required)
| Route | Page | Feature |
|---|---|---|
| `/login`, `/register`, `/forgot-password`, `/reset-password` | Account access | F10 |
| `/account`, `/account/orders`, `/account/orders/[number]`, `/account/addresses` | Account area | F10 |
| `/cart` | Cart (viewable without login) | F04 |
| `/checkout` | Address, summary, payment | F04 |
| `/checkout/success/[number]` | Confirmation | F04 |

### Admin (`admin` role required)
`/admin`, `/admin/products`, `/admin/categories`, `/admin/artisans`, `/admin/posts`, `/admin/orders`, `/admin/customers`, `/admin/settings` (F07)

### API
| Route | Purpose |
|---|---|
| `/api/auth/*` | Better Auth |
| `/api/webhooks/razorpay` | Payment events from Razorpay |

Most other writes use Next.js Server Actions.

## Data model

All money is stored as integer paise. Slugs are unique. Every table has `id`, `createdAt` and `updatedAt`.

| Model | Key fields |
|---|---|
| `User` | name, email, emailVerified, phone, role (`customer`/`admin`) |
| `Session`, `Account`, `Verification` | Managed by Better Auth |
| `Address` | userId, fullName, phone, line1, line2, city, state, pincode, isDefault |
| `Category` | name, slug, description, image, sortOrder |
| `Artisan` | name, slug, shortBio, story, portrait, isPublished |
| `Product` | name, slug, description, makerStory, price, compareAtPrice, stock, materials, dimensions, weightGrams, categoryId, artisanId, status (`draft`/`active`/`archived`), isFeatured |
| `ProductImage` | productId, url, alt, sortOrder |
| `Post` | title, slug, excerpt, body, coverImage, status, publishedAt |
| `Cart` | userId (one per user) |
| `CartItem` | cartId, productId, quantity |
| `Order` | number, userId, status, shipping address snapshot, subtotal, shippingFee, total, razorpayOrderId, razorpayPaymentId, stockReleaseAt, trackingCarrier, trackingNumber |
| `OrderItem` | orderId, productId, name, price, quantity, image (all snapshots) |
| `OrderEvent` | orderId, status, note, createdBy |
| `Setting` | key, value (flat shipping fee, free-shipping threshold) |
| `NewsletterSubscriber` | email |
| `ContactMessage` | name, email, message, handled |

Orders copy the product name, price and address, so later edits never change a past order.

Order status: `pending_payment` → `paid` → `packed` → `shipped` → `delivered`, or `cancelled` / `refunded`.

## Cart

- A logged-out visitor's cart lives in the browser. The header badge works straight away.
- On login, it merges into their saved cart in the database.
- Checkout requires login (D-016). `/checkout` sends logged-out visitors to `/login`, then brings them back.

## Checkout and payment flow

1. The customer picks or adds an address on `/checkout`.
2. The server **recalculates all prices from the database**. It never trusts prices from the browser.
3. In one database transaction, it checks stock, reserves it, and creates an `Order` as `pending_payment` with a 30-minute hold.
4. The server creates a Razorpay order, and the browser opens Razorpay Checkout.
5. After payment, the server verifies Razorpay's signature (HMAC SHA-256 with the key secret) and marks the order `paid`.
6. The Razorpay webhook does the same job independently, so an order is still confirmed if the customer closes the browser. Both paths are safe to run twice.
7. The cart empties and the confirmation email goes out.
8. A cleanup job cancels unpaid orders after 30 minutes and returns their stock. A late payment on a cancelled order is flagged to the admin for a refund.

Handmade stock is low, often a single piece, so step 3 stops two buyers paying for the same item.

## Security

- Admin checks run on the server in every admin action and page, not only in the layout.
- Customers can only read their own orders and addresses.
- Every input is validated on the server.
- Login, contact and newsletter forms are rate limited.
- The Razorpay webhook checks its signature against the raw request body.
- Image uploads accept only image types and have a size limit.

## Testing

- Unit tests for money, shipping and stock logic (Vitest, *proposed*)
- Browser tests for register → buy → admin sees order, using Razorpay test mode (Playwright, *proposed*)
