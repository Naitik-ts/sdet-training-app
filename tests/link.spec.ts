import { test, expect } from "@playwright/test";

test("test register link", async ({ page }) => {
  await page.goto("http://localhost:3000");

  const registerLink = page.getByRole("link", { name: "Register" });

  await registerLink.click();

  await page.waitForURL("http://localhost:3000/form");

  const url = page.url();

  expect(url).toEqual("http://localhost:3000/form");

  const formLocator = page.locator("form");

  await expect(formLocator).toBeVisible();
});
