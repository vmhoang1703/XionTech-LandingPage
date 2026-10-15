import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Dark mode (2026-10-15): every page type passes axe colour-contrast in dark,
// the theme is set before first paint, and the toggle's choice survives
// navigation. Back to top shows after a screen of scroll and returns to the top.

const PAGES = [
  "/en",
  "/en/products",
  "/en/services",
  "/en/news",
  "/en/about",
  "/en/careers",
  "/en/privacy",
  "/en/no-such-page",
];

async function firstDetail(page: Page, listPath: string, prefix: string) {
  await page.goto(listPath);
  const href = await page
    .locator(`main a[href^="${prefix}"]`)
    .first()
    .getAttribute("href");
  if (!href) throw new Error(`${listPath}: no ${prefix} link`);
  return href;
}

async function contrastIn(page: Page, path: string) {
  await page.goto(path);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  const result = await new AxeBuilder({ page })
    .withRules(["color-contrast"])
    .analyze();
  return result.violations.flatMap((v) =>
    v.nodes.map((n) => n.target.join(" ")),
  );
}

test.describe("dark mode", { tag: "@a11y" }, () => {
  test.use({ colorScheme: "dark", reducedMotion: "reduce" });

  for (const path of PAGES) {
    test(`${path}: colour contrast in dark`, async ({ page }) => {
      expect(await contrastIn(page, path)).toEqual([]);
    });
  }

  test("a news story and a job: colour contrast in dark", async ({ page }) => {
    for (const [list, prefix] of [
      ["/en/news", "/en/news/"],
      ["/en/careers", "/en/careers/"],
    ]) {
      const detail = await firstDetail(page, list, prefix);
      expect(await contrastIn(page, detail), detail).toEqual([]);
    }
  });

  test("the theme is on <html> before the page's scripts run", async ({
    page,
  }) => {
    await page.goto("/en", { waitUntil: "commit" });
    await page.waitForSelector("html[data-theme]", { state: "attached" });
    const atParse = await page.evaluate(
      () => document.documentElement.dataset.theme,
    );
    expect(atParse).toBe("dark");
  });

  test("the toggle switches, and the choice survives navigation", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/en");
    const toggle = page.locator(".theme-toggle");
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    await expect(toggle).toHaveAttribute("aria-pressed", "false");
    await page.goto("/en/about");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("on a phone the toggle is a row in the menu", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/en");
    await expect(page.locator(".theme-toggle")).toBeHidden();
    await page.getByRole("button", { name: "Menu" }).click();
    const row = page.getByRole("button", { name: "Dark mode" });
    await row.click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });
});

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
});
