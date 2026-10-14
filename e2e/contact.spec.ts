import { expect, test, type Page, type Route } from "@playwright/test";

// The Get in touch form end to end in a real browser (lead, 2026-10-13: "test
// behavior of it ... and test functional to confirm it works well"). Every
// request to /api/contact is answered here, so no test ever reaches the real
// API or sends mail; the API itself is covered by its unit tests.

const SEND_ERROR = "We could not send your request. Please try again.";
const RATE_ERROR =
  "You have sent several requests in a short time. Please try again in a few minutes.";
const SUCCESS = "Summit reached. Thanks — we've received your message.";

type Answer = { status: number; body?: unknown } | "abort" | "hold";

/** Answer each POST to /api/contact in turn; returns the bodies it got. */
async function fakeApi(page: Page, answers: Answer[]) {
  const sent: Record<string, string>[] = [];
  const held: Route[] = [];
  await page.route("**/api/contact", async (route) => {
    sent.push(route.request().postDataJSON());
    const answer = answers[Math.min(sent.length - 1, answers.length - 1)];
    if (answer === "abort") return route.abort("failed");
    if (answer === "hold") return void held.push(route);
    return route.fulfill({
      status: answer.status,
      contentType: "application/json",
      body: JSON.stringify(answer.body ?? { ok: true }),
    });
  });
  return { sent, held };
}

const form = (page: Page) => page.locator("#contact form");
const field = (page: Page, label: string) =>
  form(page).getByLabel(label, { exact: true });
// The message under the field (the screen reader summary repeats it).
const fieldError = (page: Page, text: string) =>
  form(page).locator("span.err", { hasText: text });
const submit = (page: Page) =>
  form(page).getByRole("button", { name: /Start the conversation|Sending/ });

async function openForm(page: Page) {
  await page.goto("/en#contact");
  await expect(form(page)).toBeVisible();
}

async function fill(page: Page) {
  await field(page, "Your name").fill("  Lan Nguyen ");
  await field(page, "Work email").fill("lan@school.edu.vn ");
  await field(page, "Tell us about your project").fill(
    "We want a parent app for our school.",
  );
}

for (const [device, viewport] of [
  ["phone", { width: 390, height: 844 }],
  ["desktop", { width: 1280, height: 800 }],
] as const) {
  test.describe(`Get in touch form, ${device}`, { tag: "@a11y" }, () => {
    test.use({ viewport, hasTouch: device === "phone" });

    test("an empty form sends nothing and points at the first gap", async ({
      page,
    }) => {
      const { sent } = await fakeApi(page, [{ status: 200 }]);
      await openForm(page);
      await submit(page).click();
      await expect(fieldError(page, "Please enter your name.")).toBeVisible();
      await expect(
        fieldError(page, "Please enter a valid email address."),
      ).toBeVisible();
      await expect(
        fieldError(page, "Please tell us a little about your project."),
      ).toBeVisible();
      await expect(field(page, "Your name")).toBeFocused();
      await expect(field(page, "Your name")).toHaveAttribute(
        "aria-invalid",
        "true",
      );
      expect(sent).toHaveLength(0);
    });

    test("a fixed field loses its error as the visitor types", async ({
      page,
    }) => {
      await fakeApi(page, [{ status: 200 }]);
      await openForm(page);
      await field(page, "Work email").fill("lan@school");
      await submit(page).click();
      const error = fieldError(page, "Please enter a valid email address.");
      await expect(error).toBeVisible();
      await field(page, "Work email").fill("lan@school.edu.vn");
      await expect(error).toBeHidden();
      await expect(field(page, "Work email")).not.toHaveAttribute(
        "aria-invalid",
        "true",
      );
    });

    test("sends once, trimmed, shows Sending..., then the summit", async ({
      page,
    }) => {
      const { sent, held } = await fakeApi(page, ["hold"]);
      await openForm(page);
      await fill(page);
      await submit(page).click();
      await expect(submit(page)).toHaveText("Sending...");
      await expect(submit(page)).toBeDisabled();
      // A second press while sending does nothing.
      await submit(page).click({ force: true });
      expect(sent).toHaveLength(1);
      expect(sent[0]).toEqual({
        type: "general",
        name: "Lan Nguyen",
        email: "lan@school.edu.vn",
        phone: "",
        message: "We want a parent app for our school.",
        website: "",
      });
      await held[0].fulfill({ status: 200, body: '{"ok":true}' });
      const done = page.getByRole("heading", { name: SUCCESS });
      await expect(done).toBeVisible();
      await expect(page.locator("#contact .form-ok")).toBeFocused();
    });

    for (const [name, answer, message] of [
      ["the rate limit", { status: 429, body: { error: "rate" } }, RATE_ERROR],
      [
        "a server failure",
        { status: 502, body: { error: "send" } },
        SEND_ERROR,
      ],
      ["no network", "abort", SEND_ERROR],
    ] as const) {
      test(`after ${name} it keeps the text, explains, and a retry sends`, async ({
        page,
      }) => {
        const { sent } = await fakeApi(page, [answer, { status: 200 }]);
        await openForm(page);
        await fill(page);
        await submit(page).click();
        await expect(form(page).getByRole("alert")).toHaveText(message);
        await expect(submit(page)).toBeFocused();
        await expect(submit(page)).toBeEnabled();
        await expect(field(page, "Your name")).toHaveValue("  Lan Nguyen ");
        await submit(page).click();
        await expect(
          page.getByRole("heading", { name: SUCCESS }),
        ).toBeVisible();
        expect(sent).toHaveLength(2);
      });
    }

    test("shows the server's field error at the field", async ({ page }) => {
      await fakeApi(page, [
        {
          status: 400,
          body: { errors: { email: "Please enter a valid email address." } },
        },
      ]);
      await openForm(page);
      await fill(page);
      await submit(page).click();
      await expect(
        fieldError(page, "Please enter a valid email address."),
      ).toBeVisible();
      await expect(field(page, "Work email")).toBeFocused();
    });

    test("uses 16px fields, so iPhone does not zoom in", async ({ page }) => {
      await openForm(page);
      for (const label of [
        "Your name",
        "Work email",
        "Tell us about your project",
      ]) {
        const size = await field(page, label).evaluate(
          (el) => getComputedStyle(el).fontSize,
        );
        expect(size, label).toBe("16px");
      }
    });
  });
}

test.describe(
  "Get in touch everywhere, no Demo page links",
  { tag: "@a11y" },
  () => {
    test("no page links to the Demo page", async ({ page }) => {
      for (const path of [
        "/en",
        "/en/services",
        "/en/products",
        "/en/about",
        "/en/careers",
        "/en/news",
      ]) {
        await page.goto(path);
        const demo = await page.locator('a[href*="/demo"]').count();
        expect(demo, path).toBe(0);
      }
    });

    test("the header's Get in touch opens the Home form from another page", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/en/about");
      await page
        .getByRole("banner")
        .getByRole("link", { name: "Get in touch" })
        .click();
      await expect(page).toHaveURL(/\/en#contact$/);
      await expect(form(page)).toBeInViewport();
    });

    test("a capture band hands its email to the Home form and sends nothing", async ({
      page,
    }) => {
      const { sent } = await fakeApi(page, [{ status: 200 }]);
      await page.goto("/en/news");
      await page.getByLabel("Work email").fill("lan@school.edu.vn");
      await page.getByRole("button", { name: "Get in touch" }).click();
      await expect(page).toHaveURL(/\/en#contact$/);
      await expect(field(page, "Work email")).toHaveValue("lan@school.edu.vn");
      expect(sent).toHaveLength(0);
    });

    test("the phone menu's Get in touch closes the menu and opens the form", async ({
      page,
    }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto("/en/services");
      await page.getByRole("button", { name: "Menu" }).click();
      const nav = page.locator("#mobile-menu");
      await expect(nav.getByRole("link", { name: /^Plano/ })).toHaveAttribute(
        "href",
        "tel:+14693229899",
      );
      await nav.getByRole("link", { name: "Get in touch" }).click();
      await expect(page).toHaveURL(/\/en#contact$/);
      await expect(nav).toBeHidden();
      await expect(form(page)).toBeInViewport();
    });
  },
);
