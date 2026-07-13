import { test, expect, devices } from "@playwright/test";

test.use({ ...devices["Pixel 7"] });

test.describe("mobile smoke", () => {
  test("home defaults to light mode with no horizontal overflow", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Default light mode: <html> should NOT have `dark` class.
    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isDark).toBe(false);

    // No horizontal overflow at mobile width.
    const { scrollW, clientW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    expect(scrollW).toBeLessThanOrEqual(clientW + 1);

    // Calculator is rendered.
    await expect(page.getByRole("heading", { level: 1 })).toBeAttached();
  });

  test("drawdown chart bar selection updates active value", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Chart is present and interactive.
    const chart = page.getByRole("group", { name: /chart|drawdown/i }).first();
    await expect(chart).toBeVisible();

    // Click a specific bar (e.g. 50%).
    const bar50 = chart.locator('button:has-text("50")').first();
    await bar50.scrollIntoViewIfNeeded();
    await bar50.click();

    // aria-valuetext on the chart group should reflect the new selection.
    await expect(chart).toHaveAttribute("aria-valuetext", /50/);
  });

  test("about page loads in light mode on mobile", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("domcontentloaded");

    const isDark = await page.evaluate(() =>
      document.documentElement.classList.contains("dark"),
    );
    expect(isDark).toBe(false);

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const { scrollW, clientW } = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    expect(scrollW).toBeLessThanOrEqual(clientW + 1);
  });
});
