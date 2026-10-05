import { AxeBuilder } from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

// Story 7.3: WCAG 2.2 AA checks on the production build (`npm run test:a11y`).
// The news story and the job page come from Sanity: the run fails, not skips,
// when the list pages show none (a release check must cover all 11 pages).

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** The first link on `listPath` that opens one of its detail pages. */
async function firstDetail(page: Page, listPath: string, prefix: string) {
  await page.goto(listPath);
  const link = page.locator(`main a[href^="${prefix}"]`).first();
  await expect(link, `${listPath} links to a ${prefix} page`).toBeAttached();
  const href = await link.getAttribute("href");
  if (!href) throw new Error(`${listPath}: the ${prefix} link has no href`);
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

// A link or button must not hold another control (AC-A11Y-4).
const NESTED =
  "a a, a button, a input, a select, a textarea, button a, button button, button input";

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
  await expect(page.locator(NESTED), `${path} nests controls`).toHaveCount(0);
  const positive = await page
    .locator("[tabindex]")
    .evaluateAll((els) =>
      els
        .filter((el) => Number(el.getAttribute("tabindex")) > 0)
        .map((el) => el.outerHTML.slice(0, 60)),
    );
  expect(positive, `${path} has a positive tabindex`).toEqual([]);
}

test.describe("every page type", { tag: "@a11y" }, () => {
  for (const path of STATIC_PAGES) {
    test(`${path}: axe, one H1, alt text, no nesting`, async ({ page }) => {
      await checkPage(page, path, path === "/no-such-page" ? 404 : 200);
    });
  }

  test("one news story: axe, one H1, alt text, no nesting", async ({
    page,
  }) => {
    await checkPage(page, await firstDetail(page, "/news", "/news/"));
  });

  test("one job page: axe, one H1, alt text, no nesting", async ({ page }) => {
    await checkPage(page, await firstDetail(page, "/careers", "/careers/"));
  });
});

type Stop = {
  hiddenAncestor: boolean;
  ring: boolean;
  surface: string;
  label: string;
  order: number;
  width: number;
  height: number;
  inlineText: boolean;
};

const SURFACES =
  ".surface-navy, .hero-navy, .surface-amber, .hero-amber, .surface-mist, .surface-paper, .hero-light";

/** Tab through the page from the top until focus wraps; describe each stop. */
async function tabThrough(page: Page, limit = 150): Promise<Stop[]> {
  const stops: Stop[] = [];
  await page.locator("body").click({ position: { x: 1, y: 1 } });
  for (let i = 0; i < limit; i++) {
    await page.keyboard.press("Tab");
    const stop = await page.evaluate((surfaces) => {
      const el = document.activeElement as HTMLElement | null;
      if (!el || el === document.body) return null;
      // The ring is the outline, an ::after outline on stretched-link tiles,
      // or the capture field's solid 3px ring on its row.
      const visible = (style: CSSStyleDeclaration) =>
        style.outlineStyle !== "none" &&
        Number.parseFloat(style.outlineWidth) >= 2 &&
        !/^rgba\(.*,\s*0\)$/.test(style.outlineColor) &&
        style.outlineColor !== "transparent";
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
      // A checkbox or radio inside its label is pressed through the label.
      const target =
        el instanceof HTMLInputElement &&
        (el.type === "checkbox" || el.type === "radio") &&
        el.closest("label")
          ? (el.closest("label") as HTMLElement)
          : el;
      const box = target.getBoundingClientRect();
      const all = [...document.querySelectorAll("*")];
      return {
        hiddenAncestor: Boolean(
          el.closest('[hidden], [inert], [aria-hidden="true"]'),
        ),
        ring,
        surface: surface
          ? (surface.className.match(
              /(surface|hero)-(navy|amber|mist|paper|light)/,
            )?.[2] ?? "")
          : "page",
        label: `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 40)}"`,
        order: all.indexOf(el),
        width: box.width,
        height: box.height,
        // WCAG 2.5.8 exempts a link inside a sentence.
        inlineText:
          getComputedStyle(el).display === "inline" &&
          !!el.parentElement?.closest("p, small"),
      };
    }, SURFACES);
    // The walk ends when focus leaves the page (after the last control) or
    // comes back to the first stop.
    if (!stop) return stops;
    if (stops.length > 0 && stops[0].order === stop.order) return stops;
    stops.push(stop);
  }
  throw new Error(
    `Tab did not wrap back to the first stop within ${limit} presses`,
  );
}

/** The keyboard rules for one page: ring, closed parts, order, target size. */
function expectKeyboardRules(path: string, stops: Stop[]) {
  expect(stops.length, `${path} has Tab stops`).toBeGreaterThan(3);
  expect(
    stops.filter((s) => s.hiddenAncestor).map((s) => s.label),
    `${path}: focus inside a closed part`,
  ).toEqual([]);
  expect(
    stops.filter((s) => !s.ring).map((s) => s.label),
    `${path}: Tab stops without a visible ring`,
  ).toEqual([]);
  expect(
    stops
      .filter((s, i) => i > 0 && s.order < stops[i - 1].order)
      .map((s) => s.label),
    `${path}: Tab order goes back against the page order`,
  ).toEqual([]);
  expect(
    stops
      // Half a pixel of slack for sub-pixel layout.
      .filter((s) => !s.inlineText && (s.width < 23.5 || s.height < 23.5))
      .map((s) => `${s.label} ${Math.round(s.width)}x${Math.round(s.height)}`),
    `${path}: targets under 24 x 24px`,
  ).toEqual([]);
}

const KEYBOARD_PAGES = [
  "/",
  "/products",
  "/services",
  "/news",
  "/demo",
  "/about",
];

test.describe("keyboard", { tag: "@a11y" }, () => {
  for (const path of KEYBOARD_PAGES) {
    test(`${path}: ring, closed parts, Tab order, 24px targets`, async ({
      page,
    }) => {
      await page.goto(path);
      expectKeyboardRules(path, await tabThrough(page));
    });
  }

  test("Tab stops reach paper, mist, amber and navy surfaces", async ({
    page,
  }) => {
    const seen = new Set<string>();
    for (const path of KEYBOARD_PAGES) {
      await page.goto(path);
      for (const s of await tabThrough(page)) {
        seen.add(s.surface === "light" ? "paper" : s.surface);
      }
    }
    for (const surface of ["paper", "mist", "amber", "navy"]) {
      expect([...seen], `no Tab stop on a ${surface} surface`).toContain(
        surface,
      );
    }
  });

  test("closed parts exist and are hidden, so Tab cannot reach them", async ({
    page,
  }) => {
    await page.goto("/");
    for (const id of ["mega-products", "mega-services", "mobile-menu"]) {
      await expect(page.locator(`[id="${id}"]`)).toHaveAttribute("hidden", "");
    }
    await page.goto("/demo");
    await expect(page.locator('[role="tabpanel"][hidden]')).toHaveCount(1);
    await page.goto("/products");
    await expect(
      page.locator('[id^="pxp-panel-"][hidden]').first(),
    ).toBeAttached();
  });

  test("390px: ring, closed mobile menu, Tab order, 24px targets", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    expectKeyboardRules("/ at 390px", await tabThrough(page));
    await expect(page.locator('[id="mobile-menu"]')).toHaveAttribute(
      "hidden",
      "",
    );
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
  const texts: string[] = [];
  for (const id of describedBy.split(/\s+/)) {
    const target = page.locator(`[id="${id}"]`);
    await expect(target).toHaveCount(1);
    texts.push((await target.textContent())?.trim() ?? "");
  }
  expect(texts.join(" "), "the described error has text").not.toBe("");
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
    const response = await page.goto(href);
    expect(response?.status(), `${href} answers 200`).toBe(200);
    await expectErrorWiring(page, "#a-name");
  });
});
