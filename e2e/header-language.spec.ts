import { expect, test } from "@playwright/test";

const INTERACTIVE = "a[href], button, input, select, textarea";

for (const locale of ["en", "vi", "ja", "fr", "ko", "zh"] as const) {
  for (const width of [
    320, 375, 390, 412, 430, 444, 480, 520, 640, 900, 1080, 1440,
  ]) {
    test(
      `/${locale} at ${width}px: the bar ends with language, then the menu button on phones`,
      {
        tag: "@a11y",
      },
      async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(`/${locale}`);
        const header = page.getByRole("banner");
        const language = header.locator("[aria-controls='language-list']");
        await expect(language).toBeVisible();

        // The last visible interactive items in the pill (the closed list is
        // hidden).
        const pill = header.locator(".nav-pill");
        // Up to 1080px the menu button follows language on the right edge
        // (2026-10-15), so it opens and closes from one spot.
        const lastTwo = await pill.evaluate((el, selector) => {
          const items = [...el.querySelectorAll<HTMLElement>(selector)].filter(
            (item) =>
              item.getClientRects().length > 0 && !item.closest("#mobile-menu"),
          );
          return items
            .slice(-2)
            .map((item) => item.getAttribute("aria-controls"));
        }, INTERACTIVE);
        if (width > 1080) expect(lastTwo.at(-1)).toBe("language-list");
        else expect(lastTwo).toEqual(["language-list", "mobile-menu"]);

        // The bar's own items must stay inside the pill. The menu sheet is
        // drawn 1px wider than the pill on purpose (globals.css, .mm-sheet).
        const overflow = await pill.evaluate((el) => {
          const edge = el.getBoundingClientRect().right;
          return Math.max(
            0,
            ...[...el.children]
              .filter((item) => !item.classList.contains("mm-sheet"))
              .map((item) => item.getBoundingClientRect().right - edge),
          );
        });
        expect(overflow).toBeLessThanOrEqual(0);
        const box = await language.boundingBox();
        expect((box?.x ?? 0) + (box?.width ?? 0)).toBeLessThanOrEqual(width);

        const menu = header.locator("button[aria-controls='mobile-menu']");
        if (await menu.isVisible()) {
          await menu.click();
          const panel = page.locator("#mobile-menu");
          await expect(panel).toBeVisible();
          await expect(
            panel.locator("[aria-controls='language-list'], [lang]"),
          ).toHaveCount(0);
        }
      },
    );
  }
}
