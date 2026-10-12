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
  "/careers",
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
    await expect(page.locator('[id="mobile-menu"]')).toHaveAttribute(
      "hidden",
      "",
    );
    await page.goto("/demo");
    await expect(page.locator('[role="tabpanel"][hidden]')).toHaveCount(1);
    await page.goto("/products");
    await expect(page.locator("dialog.pdetail")).toHaveCount(0);
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

test.describe("reflow", { tag: "@a11y" }, () => {
  test("Home at 390px: no sideways scroll, stacked cards, two figures per row", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    const layout = await page.evaluate(() => {
      const boxes = (selector: string) =>
        [...document.querySelectorAll(selector)].map((el) => {
          const { left, top } = el.getBoundingClientRect();
          return { left: Math.round(left), top: Math.round(top) };
        });
      const columns = getComputedStyle(
        document.querySelector(".home-stats ul") as Element,
      ).gridTemplateColumns.split(" ").length;
      return {
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        columns,
        cards: boxes(".w-card"),
        doors: boxes(".door"),
      };
    });
    const stacked = (items: { left: number; top: number }[]) =>
      items.every(
        (b, i) =>
          b.left === items[0].left && (i === 0 || b.top > items[i - 1].top),
      );
    expect(layout.overflow, "no sideways scroll").toBeLessThanOrEqual(0);
    expect(layout.columns, "figures per row").toBe(2);
    expect(layout.cards, "Capabilities cards").toHaveLength(4);
    expect(stacked(layout.cards), "Capabilities cards stack").toBe(true);
    expect(layout.doors, "door cards").toHaveLength(2);
    expect(stacked(layout.doors), "door cards stack").toBe(true);
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

  test("contact form on Home", async ({ page }) => {
    await page.goto("/");
    await expectErrorWiring(page, "#contact input[type=email]");
  });

  test("job application form", async ({ page }) => {
    const href = await firstDetail(page, "/careers", "/careers/");
    const response = await page.goto(href);
    expect(response?.status(), `${href} answers 200`).toBe(200);
    await expectErrorWiring(page, "#a-name");
  });
});

test.describe("Home hero doors and +3 reveal", { tag: "@a11y" }, () => {
  test.use({ viewport: { width: 1280, height: 900 } });

  test("doors straddle the hero and the +3 list opens and closes", async ({
    page,
  }) => {
    await page.goto("/");

    const join = await page.evaluate(() => {
      const doors = document.querySelector(".home-hero .doors") as HTMLElement;
      const grid = doors.querySelector(".doors-grid") as HTMLElement;
      const box = doors.getBoundingClientRect();
      const layerTop = Number.parseFloat(
        getComputedStyle(doors, "::before").top,
      );
      return {
        columns: getComputedStyle(grid)
          .gridTemplateColumns.split(" ")
          .filter(Boolean).length,
        layerOffset: Math.abs(layerTop - box.height / 2),
      };
    });
    expect(join.columns, "two doors side by side").toBe(2);
    expect(
      join.layerOffset,
      "navy stops at the doors' middle",
    ).toBeLessThanOrEqual(4);

    for (const door of await page.locator(".home-hero .door").all()) {
      await door.scrollIntoViewIfNeeded();
      const hit = await door.evaluate((link) => {
        const box = link.getBoundingClientRect();
        const el = document.elementFromPoint(
          box.left + box.width / 2,
          box.top + box.height * 0.85,
        );
        return link.contains(el);
      });
      expect(hit, "the door's lower half is its own link").toBe(true);
    }

    const trigger = page.getByRole("button", { name: /^\+3 more industries/ });
    const list = page.locator(".w-more-list");
    await trigger.scrollIntoViewIfNeeded();
    await trigger.click();
    await expect(list).toBeVisible();
    await trigger.click();
    await expect(list).toBeHidden();
    await trigger.click();
    await expect(list).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(list).toBeHidden();
  });
});

// E-S4: the footer's ridge is drawn over the bottom of <main>; the room on
// the last element keeps the last content above it.
test.describe("footer ridge", { tag: "@a11y" }, () => {
  const VIEWPORTS = [
    { width: 1280, height: 800 },
    { width: 390, height: 844 },
  ];
  /** The first link on `listPath` into `prefix`, or null when there is none. */
  async function firstLink(page: Page, listPath: string, prefix: string) {
    await page.goto(listPath);
    return page
      .locator(`main a[href^="${prefix}"]`)
      .first()
      .getAttribute("href", { timeout: 5000 })
      .catch(() => null);
  }

  async function expectClearsRidge(page: Page, path: string) {
    await page.goto(path);
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "instant" }),
    );
    // One evaluate: all rects come from the same moment.
    const { contentBottom, ridgeTop } = await page.evaluate(() => {
      const last = document.querySelector("main > :last-child");
      let bottom = 0;
      // Page coordinates: on phones the footer is taller than the screen.
      for (const el of last?.querySelectorAll("*") ?? []) {
        if (!(el instanceof HTMLElement || el instanceof SVGElement)) continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        if (getComputedStyle(el).visibility === "hidden") continue;
        bottom = Math.max(bottom, rect.bottom + window.scrollY);
      }
      const ridge = document.querySelector("[data-ridge]");
      return {
        contentBottom: bottom,
        ridgeTop: (ridge?.getBoundingClientRect().top ?? 0) + window.scrollY,
      };
    });
    expect(contentBottom, `${path}: has content`).toBeGreaterThan(0);
    expect(contentBottom, `${path}: content ends above the ridge`).toBeLessThan(
      ridgeTop,
    );
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow, `${path}: no sideways scroll`).toBeLessThanOrEqual(0);
  }

  for (const viewport of VIEWPORTS) {
    for (const path of ["/", "/careers", "/about", "/privacy"]) {
      test(`${path} at ${viewport.width}px: content clears the ridge`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        await expectClearsRidge(page, path);
      });
    }

    for (const [name, listPath, prefix] of [
      ["news story", "/news", "/news/"],
      ["job page", "/careers", "/careers/"],
    ]) {
      test(`${name} at ${viewport.width}px: content clears the ridge`, async ({
        page,
      }) => {
        await page.setViewportSize(viewport);
        const href = await firstLink(page, listPath, prefix);
        // Skipped when no story or role link can be read from the list (for
        // example none is published in Sanity): there is no page to measure.
        test.skip(href === null, `${listPath} has no ${prefix} link to open`);
        await expectClearsRidge(page, href ?? listPath);
      });
    }
  }
});

test.describe("services layout", { tag: "@a11y" }, () => {
  const box = (page: Page, selector: string, index = 0) =>
    page
      .locator(selector)
      .nth(index)
      .evaluate((el) => {
        const { top, bottom } = el.getBoundingClientRect();
        return { top, bottom };
      });

  test("sticky heading at 1280, stacked at 980, one column at 640, anchor clears the header", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/services");
    await page
      .locator(".svc-card")
      .nth(5)
      .evaluate((el) => el.scrollIntoView({ behavior: "instant" }));
    const stick = await box(page, ".svc-stick");
    const bar = await box(page, "header");
    expect(stick.top, "heading stays below the header").toBeGreaterThanOrEqual(
      bar.bottom,
    );
    expect(stick.bottom).toBeLessThanOrEqual(800);

    await page.setViewportSize({ width: 980, height: 800 });
    await page.goto("/services");
    const position = await page
      .locator(".svc-stick")
      .evaluate((el) => getComputedStyle(el).position);
    expect(position).toBe("static");
    expect((await box(page, ".svc-stick")).bottom).toBeLessThanOrEqual(
      (await box(page, ".svc-card")).top,
    );

    await page.setViewportSize({ width: 640, height: 800 });
    await page.goto("/services");
    expect((await box(page, ".svc-card", 1)).top).toBeGreaterThan(
      (await box(page, ".svc-card", 0)).top,
    );

    await page.setViewportSize({ width: 1280, height: 800 });
    for (const [hash, heading] of [
      ["cloud", "#cloud h3"],
      ["outcomes", "#outcomes h2"],
    ]) {
      // Start each anchor from the top of a fresh load, so the scroll gate
      // below cannot pass on the previous anchor's position.
      await page.goto("/services");
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.goto(`/services#${hash}`);
      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeGreaterThan(0);
      // Settled once three readings in a row match (smooth scrolling).
      const readings: number[] = [];
      await expect
        .poll(async () => {
          readings.push(await page.evaluate(() => window.scrollY));
          const lastThree = readings.slice(-3);
          return lastThree.length === 3 && new Set(lastThree).size === 1;
        })
        .toBe(true);
      const target = await box(page, heading);
      const header = await box(page, "header");
      expect(target.top, `#${hash} clears the header`).toBeGreaterThanOrEqual(
        header.bottom,
      );
      expect(target.bottom, `#${hash} is fully visible`).toBeLessThanOrEqual(
        await page.evaluate(() => window.innerHeight),
      );
    }
  });
});

test.describe("about layout", { tag: "@a11y" }, () => {
  const columns = (page: Page) =>
    page
      .locator(".faq")
      .evaluate(
        (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
      );

  test("FAQ in two columns at 1280 and one at 760, /about#faq and /about#book land under the header", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    expect(await columns(page)).toBe(2);

    await page.setViewportSize({ width: 760, height: 800 });
    await page.goto("/about");
    expect(await columns(page)).toBe(1);

    await page.setViewportSize({ width: 1280, height: 800 });
    for (const id of ["faq", "book"]) {
      await page.goto("/about");
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
      await page.goto(`/about#${id}`);
      await expect
        .poll(() => page.evaluate(() => window.scrollY))
        .toBeGreaterThan(0);
      // Settled once three readings in a row match (smooth scrolling).
      const readings: number[] = [];
      await expect
        .poll(async () => {
          readings.push(await page.evaluate(() => window.scrollY));
          const lastThree = readings.slice(-3);
          return lastThree.length === 3 && new Set(lastThree).size === 1;
        })
        .toBe(true);
      const target = await page
        .locator(`#${id} h2`)
        .evaluate((el) => el.getBoundingClientRect().top);
      const header = await page
        .locator("header")
        .first()
        .evaluate((el) => el.getBoundingClientRect().bottom);
      expect(target, `#${id} heading clears the header`).toBeGreaterThanOrEqual(
        header,
      );
      const bottom = await page
        .locator(`#${id} h2`)
        .evaluate((el) => el.getBoundingClientRect().bottom);
      expect(bottom, `#${id} heading is fully visible`).toBeLessThanOrEqual(
        800,
      );
    }
  });

  test("offices sit at opposite edges at 1280 and stack at 390; FAQ rows open by keyboard", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/about");
    const offices = await page.evaluate(() => {
      const grid = document.querySelector("#offices .offices");
      const wrap = document.querySelector("#offices .wrap");
      const cards = [...document.querySelectorAll("#offices .office-card")];
      if (!grid || !wrap || cards.length !== 2) throw new Error("no offices");
      const inner = (el: Element) => {
        const { left, right } = el.getBoundingClientRect();
        return { left, right };
      };
      const style = getComputedStyle(wrap);
      const box = inner(wrap);
      return {
        columns: getComputedStyle(grid).gridTemplateColumns.split(" ").length,
        wrapLeft: box.left + parseFloat(style.paddingLeft),
        wrapRight: box.right - parseFloat(style.paddingRight),
        first: inner(cards[0]),
        second: inner(cards[1]),
        firstName: cards[0].querySelector("h3")?.textContent,
      };
    });
    expect(offices.columns).toBe(2);
    expect(offices.firstName).toBe("Plano, Texas, USA");
    expect(offices.first.left).toBeCloseTo(offices.wrapLeft, 0);
    expect(offices.second.right).toBeCloseTo(offices.wrapRight, 0);

    const markerAfter = (index: number) =>
      page
        .locator(".faq summary")
        .nth(index)
        .evaluate((el) => getComputedStyle(el, "::after").content);
    expect(await markerAfter(0)).toBe('"+"');
    const neighbour = page.locator(".faq details").nth(1);
    const heightBefore = (await neighbour.boundingBox())?.height ?? 0;
    expect(heightBefore, "the neighbour row was measured").toBeGreaterThan(0);
    await page.locator(".faq summary").nth(0).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".faq details").nth(0)).toHaveAttribute(
      "open",
      "",
    );
    expect(await markerAfter(0)).toBe('"−"');
    // align-items: start, so the open answer does not stretch its neighbour
    expect((await neighbour.boundingBox())?.height).toBe(heightBefore);
    await page.locator(".faq summary").nth(2).focus();
    await page.keyboard.press("Space");
    await expect(page.locator(".faq details").nth(2)).toHaveAttribute(
      "open",
      "",
    );
    await expect(page.locator(".faq details[open]")).toHaveCount(2);
    await page.locator(".faq summary").nth(0).focus();
    await page.keyboard.press("Enter");
    await expect(page.locator(".faq details").nth(0)).not.toHaveAttribute(
      "open",
      "",
    );
    expect(await markerAfter(0)).toBe('"+"');
    // Closing one row leaves the other open.
    await expect(page.locator(".faq details[open]")).toHaveCount(1);
    expect(await markerAfter(2)).toBe('"−"');

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/about");
    expect(
      await page
        .locator("#offices .offices")
        .evaluate(
          (el) => getComputedStyle(el).gridTemplateColumns.split(" ").length,
        ),
    ).toBe(1);
  });
});
