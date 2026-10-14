import { expect, test } from "@playwright/test";

// The "+3" circle on Home: on phones it is the full 44px tap target, so nothing
// sticks out of it (an outset hit area overflowed it by 3px).
for (const locale of ["en", "vi", "ja", "fr", "ko", "zh"] as const) {
  for (const width of [320, 375]) {
    test(
      `/${locale} at ${width}px: the +3 circle fits its box`,
      {
        tag: "@a11y",
      },
      async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.goto(`/${locale}`);
        const trigger = page.locator(".w-more-trigger").first();
        const size = await trigger.evaluate((el) => ({
          scroll: el.scrollWidth,
          client: el.clientWidth,
        }));
        expect(size.client).toBe(44);
        expect(size.scroll).toBeLessThanOrEqual(size.client);
      },
    );
  }
}
