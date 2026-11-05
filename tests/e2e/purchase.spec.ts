import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { expect, type Page, test } from "@playwright/test";

/** Emails saved by the app in development, newest first */
function savedEmails(to: string) {
  const dir = ".dev-emails";
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((name) => name.endsWith(`-${to}.html`))
    .sort()
    .reverse()
    .map((name) => readFileSync(path.join(dir, name), "utf8"));
}

const inboxSubjects = (to: string) =>
  savedEmails(to).map((html) => html.match(/Subject: (.*?) -->/)?.[1] ?? "");

async function logIn(page: Page, email: string, password: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(password);
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page).toHaveURL(/\/account/);
}

test("register, buy, and the admin ships the order", async ({ page, browser }) => {
  const email = `buyer-${Date.now()}@bidriart.test`;
  const password = "test-password-1";

  await test.step("a logged-out visitor fills a cart", async () => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Our Collection" })).toBeVisible();
    await page.goto("/shop");
    await expect(page.getByText("6 pieces")).toBeVisible();
    await page.goto("/shop/heart-earrings");
    await page.getByRole("button", { name: "Add to Cart" }).click();
    await expect(page.getByText("Added to your cart.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Cart, 1 item" })).toBeVisible();
  });

  await test.step("checkout sends them to register, and the cart survives", async () => {
    await page.goto("/cart");
    await page.getByRole("link", { name: "Checkout" }).click();
    await expect(page).toHaveURL(/\/login\?next=/);
    await page.getByRole("link", { name: "Create an account" }).click();
    await page.getByLabel("Full name").fill("Test Buyer");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Mobile number").fill("9876543210");
    await page.getByLabel("Password", { exact: true }).fill(password);
    await page.getByLabel("Confirm password").fill(password);
    await page.getByRole("button", { name: "Create Account" }).click();
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.getByText("Heart Earrings × 1")).toBeVisible();
  });

  await test.step("they add an address and pay", async () => {
    await page.getByLabel("Full name").fill("Test Buyer");
    await page.getByLabel("Mobile number").fill("9876543210");
    await page.getByLabel("Address line 1").fill("1 Fort Road");
    await page.getByLabel("City").fill("Bidar");
    await page.getByLabel("State").selectOption("Karnataka");
    await page.getByLabel("PIN code").fill("585401");
    await page.getByRole("button", { name: "Save Address" }).click();

    await page.getByRole("button", { name: "Pay Securely" }).click();
    await page.getByRole("button", { name: "Simulate Success" }).click();
    await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cart, 0 items" })).toBeVisible();
  });

  const orderNumber = (await page.getByText(/BC-\d{4}-\d{5}/).innerText()).match(
    /BC-\d{4}-\d{5}/
  )![0];

  await test.step("the order is in their account", async () => {
    await page.goto("/account/orders");
    await expect(page.getByText(orderNumber)).toBeVisible();
    await expect(page.getByText("₹798")).toBeVisible();
  });

  await test.step("a customer can't open the admin panel", async () => {
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "We couldn't find that page" })).toBeVisible();
  });

  await test.step("the admin ships it", async () => {
    const adminContext = await browser.newContext();
    const admin = await adminContext.newPage();
    await logIn(admin, process.env.ADMIN_EMAIL!, process.env.ADMIN_PASSWORD!);

    await admin.goto(`/admin/orders/${orderNumber}`);
    await admin.getByLabel("Change status to").selectOption("shipped");
    await admin.getByRole("button", { name: "Update Order" }).click();
    await expect(admin.getByText("Add the carrier and tracking number")).toBeVisible();

    await admin.getByLabel("Carrier").fill("India Post");
    await admin.getByLabel("Tracking number").fill("TRACK123");
    await admin.getByRole("button", { name: "Update Order" }).click();
    await expect(admin.getByText("Shipped ·")).toBeVisible();
    await adminContext.close();
  });

  await test.step("the customer sees tracking and gets the emails", async () => {
    await page.goto(`/account/orders/${orderNumber}`);
    await expect(page.getByText("India Post: TRACK123")).toBeVisible();
    await expect
      .poll(() => inboxSubjects(email))
      .toEqual(
        expect.arrayContaining([
          `Order ${orderNumber} confirmed`,
          `Order ${orderNumber} has shipped`,
        ])
      );
  });
});

test("password reset works by email", async ({ page }) => {
  const email = `reset-${Date.now()}@bidriart.test`;

  await page.goto("/register");
  await page.getByLabel("Full name").fill("Reset Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByLabel("Password", { exact: true }).fill("old-password-1");
  await page.getByLabel("Confirm password").fill("old-password-1");
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page).toHaveURL(/\/account/);
  await page.getByRole("button", { name: "Log out" }).click();
  await expect(page).toHaveURL("/");

  await page.goto("/forgot-password");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Send Reset Link" }).click();
  await expect(page.getByText("a reset link is on its way")).toBeVisible();

  await expect.poll(() => savedEmails(email).length).toBeGreaterThan(0);
  const html = savedEmails(email)[0];

  const link = html.match(/href="([^"]+reset-password[^"]+)"/)![1].replace(/&amp;/g, "&");
  await page.goto(link);
  await page.getByLabel("New password", { exact: true }).fill("new-password-1");
  await page.getByRole("button", { name: "Set New Password" }).click();
  await expect(page.getByText("Password updated")).toBeVisible();

  await logIn(page, email, "new-password-1");
});

test("the main public pages load", async ({ page }) => {
  for (const path of [
    "/about-bidri",
    "/artisans",
    "/journal",
    "/journal/what-is-bidri",
    "/contact",
    "/shipping",
    "/returns",
    "/care",
    "/privacy",
    "/terms",
    "/search?q=heart",
    "/shop/category/earrings",
  ]) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
  }
  await page.goto("/search?q=heart");
  await expect(page.getByRole("link", { name: /Heart Earrings/ })).toBeVisible();
});
