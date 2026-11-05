# F08 — Launch

**Status:** In progress; waiting on the owner
**Milestone:** M7
**Design:** Ours, in the landing page style (D-014)

## Scope
- SEO: metadata, sitemap, robots, social images
- Hosted database (Q-11) with backups, and a Cloudflare R2 bucket for images (D-028)
- Razorpay live keys and webhook
- Deploy to Vercel and connect the domain
- Security, speed and accessibility review, with error monitoring and analytics

## Acceptance criteria
- [ ] A real low-value order works end to end in production, then is refunded
- [ ] Database backups are running
- [ ] No test keys in production
- [ ] Razorpay has approved the site

## Needs from the owner
- Q-11 hosting
- Q-13 and Q-14 for Razorpay approval
