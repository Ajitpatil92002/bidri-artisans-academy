import { expect, test } from "@playwright/test";

test("cancelling payment keeps the cart and returns the stock", async ({ page }) => {
  const email = `cancel-${Date.now()}@bidriart.test`;

  await page.goto("/shop/floral-earrings");
  await page.getByRole("button", { name: "Add to Cart" }).click();
  await expect(page.getByText("Added to your cart.")).toBeVisible();

  await page.goto("/register?next=/checkout");
  await page.getByLabel("Full name").fill("Cancel Tester");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByLabel("Password", { exact: true }).fill("test-password-1");
  await page.getByLabel("Confirm password").fill("test-password-1");
  await page.getByRole("button", { name: "Create Account" }).click();
  await expect(page.getByRole("heading", { name: "Delivery address" })).toBeVisible();

  await page.getByLabel("Full name").fill("Cancel Tester");
  await page.getByLabel("Mobile number").fill("9876543210");
  await page.getByLabel("Address line 1").fill("1 Fort Road");
  await page.getByLabel("City").fill("Bidar");
  await page.getByLabel("State").selectOption("Karnataka");
  await page.getByLabel("PIN code").fill("585401");
  await page.getByRole("button", { name: "Save Address" }).click();

  await page.getByRole("button", { name: "Pay Securely" }).click();
  await page.getByRole("button", { name: "Cancel" }).click();
  await expect(page.getByText("you haven't been charged")).toBeVisible();

  await page.goto("/cart");
  await expect(page.getByRole("link", { name: "Floral Earrings" }).first()).toBeVisible();
  await page.goto("/account/orders");
  await expect(page.getByText(/BC-\d{4}-\d{5}/)).toBeVisible();
  await expect(page.getByText("Cancelled")).toBeVisible();
});

test("contact and newsletter forms work, and keep input on an error", async ({ page }) => {
  await page.goto("/contact");
  await page.getByLabel("Your name").fill("A Visitor");
  await page.getByLabel("Email").fill("visitor@bidriart.test");
  await page.getByLabel("Message").fill("Too short");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("Tell us a little more.")).toBeVisible();
  await expect(page.getByLabel("Your name")).toHaveValue("A Visitor");

  await page.getByLabel("Message").fill("Do you take custom orders for weddings?");
  await page.getByRole("button", { name: "Send Message" }).click();
  await expect(page.getByText("We'll be in touch soon.")).toBeVisible();

  await page.goto("/");
  await page.getByLabel("Email address").fill(`news-${Date.now()}@bidriart.test`);
  await page.getByRole("button", { name: "Subscribe" }).click();
  await expect(page.getByText("Thank you for subscribing.")).toBeVisible();
});

test("the password can be shown and hidden", async ({ page }) => {
  await page.goto("/login");
  const password = page.getByLabel("Password", { exact: true });
  await expect(password).toHaveAttribute("type", "password");
  await page.getByRole("button", { name: "Show password" }).click();
  await expect(password).toHaveAttribute("type", "text");
  await page.getByRole("button", { name: "Hide password" }).click();
  await expect(password).toHaveAttribute("type", "password");
});
