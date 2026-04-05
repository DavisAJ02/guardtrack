import { expect, test } from "@playwright/test";

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /guardtrack login/i })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("root route resolves without crash", async ({ page }) => {
  await page.goto("/");
  const currentUrl = page.url();

  if (currentUrl.includes("/login")) {
    await expect(page.getByRole("heading", { name: /guardtrack login/i })).toBeVisible();
  } else {
    await expect(
      page.getByRole("heading", { name: /executive dashboard|guardtrack pro/i }).first()
    ).toBeVisible();
  }
});

test("insights and reports routes respond", async ({ page }) => {
  const insights = await page.goto("/insights");
  expect(insights?.ok()).toBeTruthy();

  const reports = await page.goto("/reports");
  expect(reports?.ok()).toBeTruthy();
});
