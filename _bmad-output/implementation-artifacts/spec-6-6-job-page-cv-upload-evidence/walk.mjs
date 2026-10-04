import { chromium } from "@playwright/test";
import { Buffer } from "node:buffer";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const SLUG = process.env.SLUG ?? "placeholder-sample-job";
const URL_JOB = `${BASE}/careers/${SLUG}`;
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const css = (l, ps) => l.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), ps);
const box = (l) =>
  l.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  });
const pdf = { name: "cv.pdf", mimeType: "application/pdf", buffer: Buffer.from("%PDF-1.4\n%walk\n") };
const png = { name: "photo.png", mimeType: "image/png", buffer: Buffer.from([0x89, 0x50, 0x4e, 0x47]) };
const big = { name: "big.pdf", mimeType: "application/pdf", buffer: Buffer.alloc(6 * 1024 * 1024, 0x20) };
const open = async (width, opts = {}) => {
  const ctx = await b.newContext({ viewport: { width, height: 900 }, ...opts });
  const p = await ctx.newPage();
  const r = await p.goto(URL_JOB, { waitUntil: "load" });
  if (!r) throw new Error(`No response for ${URL_JOB}`);
  await p.waitForTimeout(800);
  return { ctx, p, status: r.status() };
};

try {
  {
    const { ctx, p, status } = await open(1280);
    log(`[1280] GET /careers/${SLUG} -> ${status}`);
    const hero = p.locator("section.hero-amber");
    log(`[1280] hero: bg ${(await css(hero, ["backgroundColor"])).slice(0, 40)} | crumbs "${(await hero.locator(".crumbs").innerText()).replace(/\s+/g, " ")}" | current is link ${(await hero.locator(".crumbs a").allInnerTexts()).join(",")} | H1 "${await p.locator("h1").innerText()}" | chips [${(await hero.locator(".chip").allInnerTexts()).join(", ")}]`);
    const body = p.locator("article.job-body");
    log(`[1280] details: bg ${(await css(p.locator("section.surface-paper").first(), ["backgroundColor"]))} | headings [${(await body.locator("h2").allInnerTexts()).join(" / ")}] | paragraphs ${await body.locator("p").count()} | check lists ${await body.locator(".list-check").count()}`);
    const back = p.getByRole("link", { name: "All open roles" });
    log(`[1280] All open roles: href ${await back.getAttribute("href")}`);
    const card = p.locator(".form-card");
    const bodyBox = await box(body);
    const cardBox = await box(card);
    log(`[1280] layout: details x ${bodyBox.x} y ${bodyBox.y} | form x ${cardBox.x} y ${cardBox.y} -> ${cardBox.x > bodyBox.x ? "beside" : "below"}`);
    log(`[1280] form card: radius ${await css(card, ["borderRadius"])} | bg ${await css(card, ["backgroundColor"])} | H2 "${await card.locator("h2").innerText()}" | labels [${(await card.locator("label").allInnerTexts()).join(", ")}] | help "${await card.locator(".help").innerText()}" | button "${(await card.locator("button[type=submit]").innerText()).trim()}"`);
    log(`[1280] phone: type ${await p.locator("#a-phone").getAttribute("type")}`);
    const consent = card.locator(".consent");
    log(`[1280] consent: "${(await consent.innerText()).trim()}" | link ${await consent.locator("a").getAttribute("href")}`);
    log(`[1280] email capture band: ${await p.locator('section[aria-labelledby="cap-h"]').count()}`);

    // CV type and size errors, then a valid file clears them.
    const cv = p.locator("#a-cv");
    const cvField = card.locator(".field").filter({ has: cv });
    for (const f of [png, big]) {
      await cv.setInputFiles(f);
      await p.waitForTimeout(300);
      log(`[1280] CV ${f.name}: error "${await cvField.locator(".err").innerText().catch(() => "none")}" | aria-invalid ${await cv.getAttribute("aria-invalid")} | border ${await css(cv, ["borderColor"])} | live "${(await p.locator('[aria-live="polite"]').innerText()).replace(/\s+/g, " ")}"`);
    }
    await cv.setInputFiles(pdf);
    await p.waitForTimeout(300);
    log(`[1280] CV cv.pdf after error: error ${await cvField.locator(".err").count()} | aria-invalid ${await cv.getAttribute("aria-invalid")} | border ${await css(cv, ["borderColor"])}`);

    // Empty submit: every error, focus on the first invalid field.
    await cv.setInputFiles([]);
    await p.locator("#a-email").fill("not-an-email");
    await p.locator("#a-note").fill("x".repeat(2001));
    await card.locator("button[type=submit]").click();
    await p.waitForTimeout(400);
    log(`[1280] empty submit: errors [${(await card.locator(".err").allInnerTexts()).join(" | ")}]`);
    for (const id of ["a-name", "a-email", "a-cv", "a-note"]) {
      const f = p.locator(`#${id}`);
      log(`[1280]   #${id}: aria-invalid ${await f.getAttribute("aria-invalid")} | describedby ${await f.getAttribute("aria-describedby")}`);
    }
    log(`[1280] focus after submit: #${await p.evaluate(() => document.activeElement?.id)}`);
    await card.screenshot({ path: `${OUT}/job-form-errors-1280.png` });

    // Sending, then the upload fails: alert, values and CV kept.
    let release;
    const held = new Promise((r) => (release = r));
    await p.route("**/api/careers/cv-upload", async (route) => {
      await held;
      await route.fulfill({ status: 500, contentType: "application/json", body: '{"error":"walk"}' });
    });
    await p.locator("#a-name").fill("Walk Tester");
    await p.locator("#a-email").fill("walk@example.com");
    await p.locator("#a-note").fill("Cover note");
    await cv.setInputFiles(pdf);
    const submit = card.locator("button[type=submit]");
    await submit.click();
    await p.waitForTimeout(400);
    log(`[1280] sending: disabled ${await submit.isDisabled()} | text "${(await submit.innerText()).trim()}"`);
    release();
    await card.locator(".form-alert").waitFor({ timeout: 15000 });
    log(`[1280] upload fails: alert "${await card.locator(".form-alert").innerText()}" role ${await card.locator(".form-alert").getAttribute("role")} | above button ${(await box(card.locator(".form-alert"))).y < (await box(submit)).y} | name "${await p.locator("#a-name").inputValue()}" | email "${await p.locator("#a-email").inputValue()}" | note "${await p.locator("#a-note").inputValue()}" | CV kept ${await cv.evaluate((el) => el.files?.[0]?.name ?? "none")} | focus #${await p.evaluate(() => document.activeElement?.className)}`);
    await p.unroute("**/api/careers/cv-upload");
    await card.screenshot({ path: `${OUT}/job-form-failed-1280.png` });

    // Upload limit used up: the token route's 200 with no presigned URL goes
    // through the real Blob SDK, which must lead to the rate message.
    await p.route("**/api/careers/cv-upload", (route) =>
      route.fulfill({ status: 200, contentType: "application/json", body: '{"error":"rate","presignedUrlPayload":null}' }),
    );
    await submit.click();
    await p.waitForFunction(() => document.querySelector(".form-card .form-alert")?.textContent?.includes("several requests"), null, { timeout: 15000 }).catch(() => {});
    log(`[1280] upload limit used up: alert "${await card.locator(".form-alert").innerText()}" | name kept "${await p.locator("#a-name").inputValue()}" | CV kept ${await cv.evaluate((el) => el.files?.[0]?.name ?? "none")}`);
    await p.unroute("**/api/careers/cv-upload");

    // Focus ring and button motion.
    await p.locator("#a-name").focus();
    await p.keyboard.press("Tab");
    log(`[1280] Tab -> #${await p.evaluate(() => document.activeElement?.id)} | outline ${await css(p.locator("#a-email"), ["outlineStyle", "outlineWidth"])}`);
    await back.focus();
    await p.keyboard.press("Shift+Tab");
    await p.keyboard.press("Tab");
    log(`[1280] All open roles focus: outline ${await css(back, ["outlineStyle", "outlineWidth"])} | :focus-visible ${await back.evaluate((el) => el.matches(":focus-visible"))}`);
    log(`[1280] button transition: ${await css(submit, ["transitionDuration"])}`);
    await submit.scrollIntoViewIfNeeded();
    await p.mouse.move(0, 0);
    await p.waitForTimeout(500);
    const before = await css(submit, ["transform"]);
    await submit.hover();
    await p.waitForTimeout(600);
    log(`[1280] button hover: transform ${before} -> ${await css(submit, ["transform"])}`);
    await p.mouse.down();
    await p.waitForTimeout(600);
    log(`[1280] button press: transform ${await css(submit, ["transform"])}`);
    // Release off the button so the press does not submit the form.
    await p.mouse.move(0, 0);
    await p.mouse.up();
    await p.waitForTimeout(400);

    await back.click();
    await p.waitForURL("**/careers#roles");
    log(`[1280] All open roles click lands ${new URL(p.url()).pathname}${new URL(p.url()).hash}`);
    await ctx.close();
  }
  for (const w of [900, 899, 640, 390]) {
    const { ctx, p } = await open(w);
    const bodyBox = await box(p.locator("article.job-body"));
    const cardBox = await box(p.locator(".form-card"));
    const sideways = await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    log(`[${w}] layout: form ${cardBox.y > bodyBox.y + bodyBox.h - 1 ? "below" : "beside"} details | no sideways scroll ${sideways}`);
    if (w === 390) await p.locator(".form-card").screenshot({ path: `${OUT}/job-form-390.png` });
    await ctx.close();
  }
  {
    const { ctx, p } = await open(1280, { reducedMotion: "reduce" });
    log(`[reduced] button transition: ${await css(p.locator(".form-card button[type=submit]"), ["transitionDuration"])}`);
    await ctx.close();
  }
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    const r = await p.goto(`${BASE}/careers/no-such-role`, { waitUntil: "load" });
    log(`[404] /careers/no-such-role -> ${r?.status()} | h1 "${await p.locator("h1").innerText()}"`);
    await ctx.close();
  }
  {
    const { ctx, p } = await open(1280);
    await p.screenshot({ path: `${OUT}/job-1280.png`, fullPage: true });
    await ctx.close();
  }
} finally {
  await b.close();
}
