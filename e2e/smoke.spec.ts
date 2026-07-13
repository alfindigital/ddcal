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

  test("drawdown chart keyboard selection updates active value", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const chart = page.getByRole("group", { name: /chart|drawdown/i }).first();
    await expect(chart).toBeVisible();

    // Default is 30%. Focus the chart and step right; active bucket should change.
    await chart.focus();
    const before = await chart.getAttribute("aria-valuetext");
    await page.keyboard.press("ArrowRight");
    await expect
      .poll(async () => chart.getAttribute("aria-valuetext"))
      .not.toBe(before);
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
