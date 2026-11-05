// Draft wording. The owner must review every page before launch (Q-13, Q-14).

export type PolicySlug = "shipping" | "returns" | "care" | "privacy" | "terms";

export const policies: Record<PolicySlug, { title: string; draft: boolean; body: string }> = {
  shipping: {
    title: "Shipping",
    draft: true,
    body: `We currently ship within India only.

## Charges

A flat shipping fee applies to each order, and shipping is free above a set order value. The exact amounts are shown in your cart before you pay.

## Tracking

When your order ships, we'll email you the carrier and tracking number. You can also see them in your account under Orders.`,
  },
  returns: {
    title: "Returns and Refunds",
    draft: true,
    body: `## Handmade pieces

Every Bidri piece is made by hand, so small variations are part of the craft and aren't faults.

## Our policy

Our returns, refund and cancellation terms are being finalised and will be published here before we start taking orders.

## Questions

If there's a problem with your order, please contact us through the Contact page.`,
  },
  care: {
    title: "Caring for Bidri",
    draft: false,
    body: `Bidri's deep black finish is a treated surface, so a little care keeps it looking its best.

## Keep it dry

Take your jewellery off before bathing or swimming, and wipe off any moisture with a soft cloth.

## Avoid chemicals

Keep pieces away from perfume, cleaning products and metal polish. Polish can strip the black finish.

## Clean gently

Wipe with a soft, dry cloth. A tiny amount of coconut oil on a cloth restores the sheen.

## Store separately

Keep each piece in a soft pouch, so it can't scratch against harder jewellery.`,
  },
  privacy: {
    title: "Privacy Policy",
    draft: true,
    body: `## What we collect

When you create an account or order, we collect your name, email, phone number and delivery address. If you write to us or join our newsletter, we keep your message or email address.

## How we use it

We use your details to fulfil orders, send order updates and answer your questions. We only send newsletters if you've signed up, and you can ask us to stop at any time.

## Payments

Payments are handled by Razorpay. We never see or store your card details.

## Your choices

You can ask us to correct or delete your details through the Contact page.`,
  },
  terms: {
    title: "Terms of Use",
    draft: true,
    body: `## Using this site

By using this site and placing an order, you agree to these terms.

## Products

Our pieces are handmade, so size, colour and pattern can vary slightly from the photos.

## Prices

Prices are shown in Indian rupees. The price charged is the one shown at checkout.

## Orders

An order is confirmed once payment succeeds. We may cancel an order and refund it if a piece turns out to be unavailable.

## Business details

Our full legal business details will be published here before launch.`,
  },
};
