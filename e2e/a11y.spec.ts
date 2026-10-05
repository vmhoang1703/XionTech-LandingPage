import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Story 7.3: WCAG 2.2 AA checks on the production build (`npm run test:a11y`).

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** The first link on `listPath` that opens one of its detail pages, or null. */
async function firstDetail(page: Page, listPath: string, prefix: string) {
  await page.goto(listPath);
  const href = await page
    .locator(`main a[href^="${prefix}"]`)
    .first()
    .getAttribute("href")
    .catch(() => null);
  return href;
}

const STATIC_PAGES = [
  "/",
  "/products",
  "/services",
  "/news",
  "/about",
  "/careers",
  "/demo",
  "/privacy",
  "/no-such-page",
];

async function checkPage(page: Page, path: string, status = 200) {
  const response = await page.goto(path);
  expect(response?.status(), `${path} answers ${status}`).toBe(status);
  const result = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
  const serious = result.violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map(
      (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`,
    );
  expect(serious, `${path} has serious or critical violations`).toEqual([]);
  await expect(page.locator("h1"), `${path} has one H1`).toHaveCount(1);
  const noAlt = await page
    .locator("img:not([alt])")
    .evaluateAll((imgs) => imgs.map((img) => img.getAttribute("src")));
  expect(noAlt, `${path} has images without alt`).toEqual([]);
}

test.describe("every page type", { tag: "@a11y" }, () => {
  for (const path of STATIC_PAGES) {
    test(`${path}: axe, one H1, alt text`, async ({ page }) => {
      await checkPage(page, path, path === "/no-such-page" ? 404 : 200);
    });
  }

  test("one news story: axe, one H1, alt text", async ({ page }) => {
    const href = await firstDetail(page, "/news", "/news/");
    test.skip(!href, "No published story to open.");
    await checkPage(page, href ?? "");
  });

  test("one job page: axe, one H1, alt text", async ({ page }) => {
    const href = await firstDetail(page, "/careers", "/careers/");
    test.skip(!href, "No open role to open.");
    await checkPage(page, href ?? "");
  });
});

type Stop = {
  hiddenAncestor: boolean;
  ring: boolean;
  surface: string;
  label: string;
};

const SURFACES =
  ".surface-navy, .hero-navy, .surface-amber, .hero-amber, .surface-mist, .surface-paper, .hero-light";

/** Tab through the page once and describe every element that took focus. */
async function tabThrough(page: Page, limit = 120): Promise<Stop[]> {
  const stops: Stop[] = [];
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate((surfaces) => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      // The ring is the outline, or an ::after outline on stretched-link tiles.
      const visible = (style: CSSStyleDeclaration) =>
        style.outlineStyle !== "none" &&
        Number.parseFloat(style.outlineWidth) >= 2 &&
        !/^rgba\(.*,\s*0\)$/.test(style.outlineColor) &&
        style.outlineColor !== "transparent";
      // The capture field draws a solid 3px box-shadow ring on its row.
      const shadowRing = (node: Element | null) =>
        !!node &&
        /^rgb\([^)]*\) 0px 0px 0px [2-9]px/.test(
          getComputedStyle(node).boxShadow,
        );
      const ring =
        visible(getComputedStyle(el)) ||
        visible(getComputedStyle(el, "::after")) ||
        shadowRing(el.closest(".cap-row"));
      const surface = el.closest(surfaces);
      return {
        hiddenAncestor: Boolean(el.closest("[hidden]")),
        ring,
        surface: surface
          ? (surface.className.match(
              /(surface|hero)-(navy|amber|mist|paper|light)/,
            )?.[2] ?? "")
          : "page",
        label: `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}"`,
      };
    }, SURFACES);
    if (!stop) break;
    if (
      stops.some((s) => s.label === stop.label && s.surface === stop.surface)
    ) {
      if (stops[0]?.label === stop.label) break;
    }
    stops.push(stop);
  }
  return stops;
}

test.describe("keyboard", { tag: "@a11y" }, () => {
  const seen = new Set<string>();

  for (const path of [
    "/",
    "/products",
    "/services",
    "/news",
    "/demo",
    "/about",
  ]) {
    test(`${path}: every Tab stop shows a ring and none is inside a closed part`, async ({
      page,
    }) => {
      await page.goto(path);
      const stops = await tabThrough(page);
      expect(stops.length, `${path} has Tab stops`).toBeGreaterThan(3);
      const hidden = stops.filter((s) => s.hiddenAncestor).map((s) => s.label);
      expect(hidden, `${path}: focus inside a closed part`).toEqual([]);
      const noRing = stops.filter((s) => !s.ring).map((s) => s.label);
      expect(noRing, `${path}: Tab stops without a visible ring`).toEqual([]);
      for (const s of stops)
        seen.add(s.surface === "light" ? "paper" : s.surface);
    });
  }

  test("Tab stops covered paper, mist, amber and navy surfaces", () => {
    for (const surface of ["paper", "mist", "amber", "navy"]) {
      expect([...seen], `no Tab stop on a ${surface} surface`).toContain(
        surface,
      );
    }
  });
});

/** Submit the form that holds `field` empty and check its error wiring. */
async function expectErrorWiring(page: Page, fieldSelector: string) {
  const field = page.locator(fieldSelector).first();
  await field.focus();
  await page.keyboard.press("Enter");
  await expect(field).toHaveAttribute("aria-invalid", "true");
  const describedBy = (await field.getAttribute("aria-describedby")) ?? "";
  expect(describedBy, `${fieldSelector} has aria-describedby`).not.toBe("");
  for (const id of describedBy.split(/\s+/)) {
    await expect(page.locator(`[id="${id}"]`)).toHaveCount(1);
  }
  const announced = await page
    .locator('[aria-live]:not([aria-live="off"]), [role="alert"]')
    .evaluateAll((els) => els.map((el) => el.textContent ?? "").join(" "));
  expect(announced.trim(), "an error is announced").not.toBe("");
}

test.describe("form errors", { tag: "@a11y" }, () => {
  test("contact form on /demo", async ({ page }) => {
    await page.goto("/demo");
    await expectErrorWiring(page, 'main form input[type="email"]');
  });

  test("capture band on Home", async ({ page }) => {
    await page.goto("/");
    await expectErrorWiring(page, ".capture input[type=email]");
  });

  test("job application form", async ({ page }) => {
    const href = await firstDetail(page, "/careers", "/careers/");
    test.skip(!href, "No open role to open.");
    const response = await page.goto(href ?? "");
    expect(response?.status(), `${href} answers 200`).toBe(200);
    await expectErrorWiring(page, "#a-name");
  });
});
