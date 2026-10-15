import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// Mobile retest (2026-10-15): phone widths, by touch.
test.describe("mobile", { tag: "@a11y" }, () => {
  test.use({ hasTouch: true, isMobile: true });

  for (const path of ["/en", "/en/services"]) {
    test(`${path} at 390px: a keyboard can reach every scroll row`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(path);
      await expect(page.locator(".flow")).toHaveAttribute("tabindex", "0");
      const result = await new AxeBuilder({ page })
        .withRules(["scrollable-region-focusable"])
        .analyze();
      expect(result.violations.flatMap((v) => v.nodes)).toEqual([]);
    });
  }

  test("a job at 320px: no sideways scroll, fields inside their card", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/en/careers");
    const href = await page
      .locator('main a[href^="/en/careers/"]')
      .first()
      .getAttribute("href");
    if (!href) throw new Error("no job link on /en/careers");
    await page.goto(href);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBe(0);
    const past = await page.locator(".split > .form-card").evaluate((card) => {
      const style = getComputedStyle(card);
      const inner =
        card.getBoundingClientRect().right -
        parseFloat(style.paddingRight) -
        parseFloat(style.borderRightWidth);
      return [...card.querySelectorAll<HTMLElement>(".field input, textarea")]
        .filter((field) => !field.classList.contains("sr-only"))
        .map((field) => field.getBoundingClientRect().right - inner)
        .filter((gap) => gap > 0.5);
    });
    expect(past).toEqual([]);
  });

  test("an empty contact form at 320px puts the first field below the header", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 568 });
    await page.goto("/en#contact");
    const form = page.locator("#contact form");
    await form.scrollIntoViewIfNeeded();
    await form.getByRole("button", { name: /Start the conversation/ }).tap();
    const name = form.locator('[name="name"]');
    await expect(name).toBeFocused();
    await expect
      .poll(async () => {
        const label = await form.locator('label[for="c-name"]').boundingBox();
        const pill = await page.locator(".nav-pill").boundingBox();
        return (label?.y ?? 0) - ((pill?.y ?? 0) + (pill?.height ?? 0));
      })
      .toBeGreaterThan(0);
  });
});
