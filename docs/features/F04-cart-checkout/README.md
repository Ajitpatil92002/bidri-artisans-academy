# F04 — Cart + Razorpay checkout

**Status:** Done with the test stand-in; real Razorpay test still to do
**Milestone:** M4
**Design:** Ours, in the landing page style (D-014)

## Scope
- Cart for logged-out and logged-in visitors, merged on login, with a live header badge
- Checkout requires login (D-016): address, order summary, flat shipping (D-017)
- **Razorpay** payment in test mode (D-004)
- Signature verification, webhook, stock holds and cleanup of unpaid orders
- Full flow in docs/architecture.md

## Acceptance criteria
- [x] Prices are always recalculated on the server
- [x] Two buyers can't both pay for the last item
- [x] An order is confirmed even if the customer closes the browser after paying (webhook)
- [x] Running verification twice doesn't double-process an order
- [x] A tampered signature is rejected
- [x] Failed and cancelled payments return the customer to checkout with their cart intact
- [x] Unpaid orders release their stock after 30 minutes

## Needs from the owner
- Razorpay test keys in `.env.local`, added by the owner
- Q-5 GST
- Q-12 shipping amounts
