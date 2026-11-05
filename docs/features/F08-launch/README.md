# F08 — Launch

**Status:** In progress; waiting on the owner
**Milestone:** M7
**Design:** Ours, in the landing page style (D-014)

## Scope
- SEO: metadata, sitemap, robots, social images
- Neon database (D-029) with backups, and a Cloudflare R2 bucket for images (D-028)
- Razorpay live keys and webhook
- Deploy to Vercel and connect the domain
- Security, speed and accessibility review, with error monitoring and analytics

## Acceptance criteria
- [ ] A real low-value order works end to end in production, then is refunded
- [ ] Database backups are running
- [ ] No test keys in production
- [ ] Razorpay has approved the site

## Needs from the owner
- A Neon database
- Q-13 and Q-14 for Razorpay approval

## Launch order

**Don't push to `main` until steps 1 to 3 are done.** Vercel deploys every push, and a deploy with no database would replace the current site with a broken one.

1. Create the Neon database. Done: project `bidri-craft`.
2. Run migrations and seed. Done. The values are in the git-ignored `.env.neon`.
3. In Vercel, add the production variables from `.env.example`: `DATABASE_URL` (pooled), `NEXT_PUBLIC_SITE_URL`, `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `CRON_SECRET`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `RESEND_API_KEY`, `EMAIL_FROM`, `ADMIN_NOTIFY_EMAIL`, and the `S3_*` values for R2. Generate new secrets; don't reuse local ones. Leave `RAZORPAY_MOCK` unset.
4. In Vercel project settings, check Framework Preset is Next.js and clear the old `dist` Output Directory. `vercel.json` sets the framework, but a saved override may remain.
5. Push, then confirm the deploy is Ready.
6. Add the Razorpay webhook: `https://<site>/api/webhooks/razorpay`, for `payment.captured` and `order.paid`.
