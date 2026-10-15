import { expect, test } from "@playwright/test";

const INTERACTIVE = "a[href], button, input, select, textarea";

for (const locale of ["en", "vi", "ja", "fr", "ko", "zh"] as const) {
  for (const width of [
    320, 375, 390, 412, 430, 444, 480, 520, 640, 900, 1080, 1440,
  ]) {
    test(
      `/${locale} at ${width}px: the language button is the last item in the pill`,
      {
        tag: "@a11y",
      },
      async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(`/${locale}`);
        const header = page.getByRole("banner");
        const language = header.locator("[aria-controls='language-list']");
        await expect(language).toBeVisible();

        // The last visible interactive item in the pill (the closed list is
        // hidden). Above 1080px the dark-mode toggle sits outside the pill, on
        // its right (2026-10-15); below, it is a row in the menu.
        const pill = header.locator(".nav-pill");
        const lastIsLanguage = await pill.evaluate((el, selector) => {
          const items = [...el.querySelectorAll<HTMLElement>(selector)].filter(
            (item) => item.getClientRects().length > 0,
          );
          return (
            items.at(-1)?.getAttribute("aria-controls") === "language-list"
          );
        }, INTERACTIVE);
        expect(lastIsLanguage).toBe(true);
        const toggle = header.locator(".theme-toggle");
        if (width > 1080) await expect(toggle).toBeVisible();
        else await expect(toggle).toBeHidden();

        const overflow = await pill.evaluate(
          (el) => el.scrollWidth - el.clientWidth,
        );
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
