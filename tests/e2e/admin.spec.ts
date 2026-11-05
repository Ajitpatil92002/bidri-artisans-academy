import { expect, test } from "@playwright/test";

test("the admin adds a product with a photo, then removes it", async ({ page }) => {
  const name = `Test Bangle ${Date.now()}`;

  await page.goto("/login");
  await page.getByLabel("Email").fill(process.env.ADMIN_EMAIL!);
  await page.getByLabel("Password", { exact: true }).fill(process.env.ADMIN_PASSWORD!);
  await page.getByRole("button", { name: "Log In" }).click();
  await expect(page).toHaveURL(/\/account/);

  await page.goto("/admin/products/new");
  await page.getByLabel("Name").fill(name);
  await page.getByLabel("Description").fill("A test bangle with silver inlay.");
  await page.getByLabel("Price (₹)", { exact: true }).fill("1250.50");
  await page.getByLabel("Stock").fill("1");
  await page.getByLabel("Status").selectOption("active");

  // A file that isn't really an image is refused, and the typed details stay
  await page.getByLabel("Add photos").setInputFiles({
    name: "fake.png",
    mimeType: "image/png",
    buffer: Buffer.from("this is not an image"),
  });
  await page.getByRole("button", { name: "Save Product" }).click();
  await expect(page.getByText("Use a JPG, PNG or WebP image.")).toBeVisible();
  await expect(page.getByLabel("Name")).toHaveValue(name);

  await page.getByLabel("Add photos").setInputFiles("public/images/products/heart-earrings.webp");
  await page.getByRole("button", { name: "Save Product" }).click();
  await expect(page).toHaveURL(/\/admin\/products\/[a-z0-9]+$/);

  await page.goto("/shop?sort=newest");
  await expect(page.getByRole("link", { name: new RegExp(name) })).toBeVisible();
  await page.getByRole("link", { name: new RegExp(name) }).click();
  await expect(page.getByRole("heading", { name })).toBeVisible();
  await expect(page.getByText("₹1,250.50")).toBeVisible();
  await expect(page.getByText("Only 1 left")).toBeVisible();

  await page.goto("/admin/products");
  await page.getByRole("link", { name }).click();
  page.on("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Delete product" }).click();
  await expect(page).toHaveURL(/\/admin\/products$/);
  await expect(page.getByRole("link", { name })).toHaveCount(0);
});
