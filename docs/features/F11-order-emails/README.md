# F11 — Emails and order tracking

**Status:** Done
**Milestone:** M4
**Design:** Ours, in the landing page style (D-014)

## Scope
- Branded email templates
- Emails for: reset password, order confirmed, order shipped (with tracking), order delivered, order cancelled or refunded
- Admin alert for each new order
- Order status timeline in the customer's account

## Acceptance criteria
- [x] Each status change sends the right email once
- [x] A failed email never blocks an order
- [x] All emails can be read in `.dev-emails/` during development
