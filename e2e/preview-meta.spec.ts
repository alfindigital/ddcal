import { test, expect, Page } from "@playwright/test";

const SECTIONS = ["Root (sitewide default)", "Index"];

async function openPreviewMeta(page: Page) {
  await page.goto("/preview-meta");
  await expect(page.getByRole("heading", { name: "Meta Preview" })).toBeVisible();
}

test.describe("/preview-meta", () => {
  test("renders both sections with share cards", async ({ page }) => {
    await openPreviewMeta(page);
    for (const heading of SECTIONS) {
      await expect(page.getByRole("heading", { name: heading })).toBeVisible();
    }
    // Two networks per section -> 4 card containers
    expect(await page.getByText(/Facebook \/ LinkedIn/).count()).toBe(2);
    expect(await page.getByText(/Twitter \/ X/).count()).toBe(2);
  });

  test("mobile/desktop toggle changes card width", async ({ page }) => {
    await openPreviewMeta(page);
    const section = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Index" }) });

    // Card with og image preview is the first .aspect-[1.91/1] inside the section
    const card = section.locator("div.aspect-\\[1\\.91\\/1\\]").first().locator("..");

    await section.getByRole("button", { name: "desktop" }).click();
    const desktopBox = await card.boundingBox();

    await section.getByRole("button", { name: "mobile" }).click();
    const mobileBox = await card.boundingBox();

    expect(desktopBox && mobileBox).toBeTruthy();
    expect(mobileBox!.width).toBeLessThan(desktopBox!.width);
  });

  test("Copy button writes share text to clipboard", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await openPreviewMeta(page);

    const section = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Index" }) });

    const pre = section.locator("pre").first();
    const expected = (await pre.textContent())?.trim() ?? "";
    expect(expected.length).toBeGreaterThan(0);

    await section.getByRole("button", { name: "Copy" }).click();

    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip.trim()).toBe(expected);

    // Same text is used for Facebook, LinkedIn, Twitter/X (single share-text block per section)
    expect(clip).toMatch(/DrawdownCal/);
    expect(clip).toMatch(/https:\/\/drawdowncal\.lovable\.app/);
  });

  test("Download button produces a .txt file matching the share text", async ({ page }) => {
    await openPreviewMeta(page);

    for (const heading of SECTIONS) {
      const section = page
        .locator("section")
        .filter({ has: page.getByRole("heading", { name: heading }) });
      const expected = ((await section.locator("pre").first().textContent()) ?? "").trim();

      const [download] = await Promise.all([
        page.waitForEvent("download"),
        section.getByRole("button", { name: /Download \.txt/ }).click(),
      ]);

      expect(download.suggestedFilename()).toMatch(/^share-.+\.txt$/);
      const stream = await download.createReadStream();
      const chunks: Buffer[] = [];
      for await (const c of stream) chunks.push(c as Buffer);
      const content = Buffer.concat(chunks).toString("utf8").trim();
      expect(content).toBe(expected);
      // Same payload works across Facebook, LinkedIn, Twitter/X.
      expect(content).toContain("DrawdownCal");
      expect(content).toContain("https://drawdowncal.lovable.app");
    }
  });
});
