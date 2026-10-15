import { expect, test } from "@playwright/test";

// Back to top (2026-10-15): shows after a screen of scroll, returns to the
// top and steps aside while the phone menu is open.
test.describe("back to top", { tag: "@a11y" }, () => {
  test("shows after a screen of scroll and returns to the top", async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/en");
    const button = page.locator(".back-to-top");
    await expect(button).not.toHaveAttribute("data-shown");
    await page.evaluate(() =>
      window.scrollTo({ top: 2400, behavior: "instant" }),
    );
    await expect(button).toHaveAttribute("data-shown");
    await button.click();
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator("main#main")).toBeFocused();
  });

  test("steps aside while the phone menu is open", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    await page.evaluate(() =>
      window.scrollTo({ top: 2400, behavior: "instant" }),
    );
    const button = page.locator(".back-to-top");
    await expect(button).toHaveAttribute("data-shown");
    await page.getByRole("button", { name: "Menu" }).click();
    await expect(button).toHaveCSS("opacity", "0");
    await expect(button).toHaveCSS("pointer-events", "none");
  });
});
