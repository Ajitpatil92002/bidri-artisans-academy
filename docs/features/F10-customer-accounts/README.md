# F10 — Customer accounts

**Status:** Done
**Milestone:** M3
**Design:** Ours, in the landing page style (D-014)

## Scope
- Register, log in, log out, forgot and reset password (D-016, D-018). No email verification (D-023)
- `/account` with profile, saved addresses and order history
- `customer` and `admin` roles

## Acceptance criteria
- [x] A customer can register and log in straight away
- [x] Password reset works by email
- [x] A customer can never see another customer's orders or addresses
- [x] Login is rate limited
- [x] Admin routes refuse non-admins
