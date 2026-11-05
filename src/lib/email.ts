import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { Resend } from "resend";
import { formatPrice } from "@/lib/money";

const FROM = process.env.EMAIL_FROM ?? "Bidri Craft <orders@bidriart.com>";
const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function layout(heading: string, bodyHtml: string) {
  return `<div style="background:#0e0e0f;padding:32px 16px;font-family:Arial,sans-serif;color:#f1ece4">
  <div style="max-width:560px;margin:0 auto;background:#141416;border:1px solid #2a2a2c;border-radius:8px;padding:32px">
    <p style="margin:0 0 24px;font-family:Georgia,serif;font-size:22px;color:#cdb38a">Bidri Craft</p>
    <h1 style="margin:0 0 16px;font-family:Georgia,serif;font-size:24px;font-weight:normal">${escapeHtml(heading)}</h1>
    <div style="font-size:15px;line-height:1.6;color:#d8d2c8">${bodyHtml}</div>
  </div>
</div>`;
}

function button(href: string, label: string) {
  return `<p style="margin:24px 0"><a href="${escapeHtml(href)}" style="background:#e6d3b3;color:#0e0e0f;padding:12px 24px;border-radius:999px;text-decoration:none">${escapeHtml(label)}</a></p>`;
}

/** Never throws: a failed email must not stop an order or a login. */
async function send(to: string, subject: string, html: string) {
  try {
    if (process.env.RESEND_API_KEY) {
      const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: FROM,
        to,
        subject,
        html,
      });
      if (error) throw new Error(error.message);
      return;
    }
    if (process.env.NODE_ENV === "development") await saveForDevelopment(to, subject, html);
    else console.warn(`Email "${subject}" not sent: RESEND_API_KEY is not set`);
  } catch (error) {
    console.error(`Email "${subject}" failed`, error);
  }
}

/** With no email service locally, emails are saved as files you can open (D-027). */
async function saveForDevelopment(to: string, subject: string, html: string) {
  const dir = path.join(process.cwd(), ".dev-emails");
  await mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${to.replace(/[^a-z0-9.@-]/gi, "_")}.html`;
  await writeFile(path.join(dir, name), `<!-- To: ${to} | Subject: ${escapeHtml(subject)} -->\n${html}`);
  console.log(`Email saved to .dev-emails/${name}: ${subject}`);
}

export function sendPasswordResetEmail(to: string, name: string, url: string) {
  return send(
    to,
    "Reset your Bidri Craft password",
    layout(
      "Reset your password",
      `<p>Hello ${escapeHtml(name)}, use the button below to choose a new password. The link expires in one hour. If you didn't ask for this, you can ignore this email.</p>${button(url, "Reset password")}`
    )
  );
}

type OrderEmail = {
  number: string;
  total: number;
  items: { name: string; quantity: number; price: number }[];
  trackingCarrier?: string | null;
  trackingNumber?: string | null;
};

const orderLink = (number: string) => `${siteUrl()}/account/orders/${number}`;

function itemsTable(order: OrderEmail) {
  const rows = order.items
    .map(
      (item) =>
        `<tr><td style="padding:6px 0">${escapeHtml(item.name)} × ${item.quantity}</td><td style="padding:6px 0;text-align:right">${formatPrice(item.price * item.quantity)}</td></tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;color:#d8d2c8">${rows}<tr><td style="padding:12px 0 0;border-top:1px solid #2a2a2c">Total</td><td style="padding:12px 0 0;border-top:1px solid #2a2a2c;text-align:right">${formatPrice(order.total)}</td></tr></table>`;
}

export function sendOrderConfirmedEmail(to: string, order: OrderEmail) {
  return send(
    to,
    `Order ${order.number} confirmed`,
    layout(
      "Thank you for your order",
      `<p>We've received your payment for order <strong>${escapeHtml(order.number)}</strong> and will start preparing it.</p>${itemsTable(order)}${button(orderLink(order.number), "View your order")}`
    )
  );
}

export function sendOrderShippedEmail(to: string, order: OrderEmail) {
  const tracking = order.trackingNumber
    ? `<p>Carrier: ${escapeHtml(order.trackingCarrier ?? "")}<br>Tracking number: ${escapeHtml(order.trackingNumber)}</p>`
    : "";
  return send(
    to,
    `Order ${order.number} has shipped`,
    layout(
      "Your order is on its way",
      `<p>Order <strong>${escapeHtml(order.number)}</strong> has shipped.</p>${tracking}${button(orderLink(order.number), "Track your order")}`
    )
  );
}

export function sendOrderDeliveredEmail(to: string, order: OrderEmail) {
  return send(
    to,
    `Order ${order.number} delivered`,
    layout(
      "Your order has been delivered",
      `<p>Order <strong>${escapeHtml(order.number)}</strong> has been delivered. We hope you love it.</p>${button(orderLink(order.number), "View your order")}`
    )
  );
}

export function sendOrderClosedEmail(to: string, order: OrderEmail, status: "cancelled" | "refunded") {
  return send(
    to,
    `Order ${order.number} ${status}`,
    layout(
      `Your order has been ${status}`,
      `<p>Order <strong>${escapeHtml(order.number)}</strong> has been ${status}. If you have any questions, please contact us.</p>${button(orderLink(order.number), "View your order")}`
    )
  );
}

export function sendNewOrderAlert(order: OrderEmail) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!to) return Promise.resolve();
  return send(
    to,
    `New order ${order.number}: ${formatPrice(order.total)}`,
    layout(
      `New order ${order.number}`,
      `${itemsTable(order)}${button(`${siteUrl()}/admin/orders/${order.number}`, "Open in admin")}`
    )
  );
}

export function sendContactAlert(name: string, email: string, message: string) {
  const to = process.env.ADMIN_NOTIFY_EMAIL;
  if (!to) return Promise.resolve();
  return send(
    to,
    `New message from ${name.slice(0, 60)}`,
    layout(
      "New contact message",
      `<p><strong>${escapeHtml(name)}</strong> (${escapeHtml(email)})</p><p style="white-space:pre-wrap">${escapeHtml(message)}</p>`
    )
  );
}
