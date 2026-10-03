// Walks the Story 2.4 UX checks on the running dev server and prints what it observes.
// /api/contact is intercepted in the browser, so no real mail is sent and Upstash is not used.
// Run from the repo root: node _bmad-output/implementation-artifacts/spec-2-4-email-capture-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-2-4-email-capture-evidence";
const EMAIL = "lan@school.edu.vn";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);

// answer: { status, body, delayMs } or "hang"
async function home(width, answer, opts = {}) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, ...opts });
  const seen = [];
  await page.route("**/api/contact", async (route) => {
    seen.push({ url: route.request().url(), body: route.request().postDataJSON() });
    if (answer === "hang") return;
    if (answer.delayMs) await new Promise((r) => setTimeout(r, answer.delayMs));
    await route.fulfill({ status: answer.status, contentType: "application/json", body: JSON.stringify(answer.body) });
  });
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForSelector("#cap-email");
  await page.waitForTimeout(800);
  await page.locator("section.capture").scrollIntoViewIfNeeded();
  return { page, seen };
}
const band = (p) => p.locator("section.capture");
const button = (p) => band(p).locator('button[type="submit"]');
const field = (p) => p.locator("#cap-email");
const msg = (p) => band(p).locator(".err").first();
const box = (p, sel) => p.locator(sel).first().boundingBox();
const active = (p) => p.evaluate(() => document.activeElement?.id || document.activeElement?.tagName);

// L1 look at 1280px
let { page: p, seen } = await home(1280, { status: 200, body: { ok: true } });
const h2 = await box(p, "#cap-h");
const form = await box(p, "section.capture form");
log("L1 1280 H2 left of form", h2.x + h2.width <= form.x + 1);
log("L1 band background", await band(p).evaluate((el) => getComputedStyle(el).backgroundImage.slice(0, 60)));
log("L1 row border", await p.locator(".cap-row").evaluate((el) => `${getComputedStyle(el).borderTopWidth} ${getComputedStyle(el).borderTopColor}`));
log("L1 button background", await button(p).evaluate((el) => getComputedStyle(el).backgroundColor));
log("L1 texts", (await band(p).innerText()).replace(/\s+/g, " ").trim());
const privacy = band(p).getByRole("link", { name: "Privacy policy" });
log("L9 privacy href", await privacy.getAttribute("href"));
log("L9 privacy underline", await privacy.evaluate((el) => getComputedStyle(el).textDecorationLine));
await band(p).screenshot({ path: `${OUT}/band-1280.png` });
// L3 focus ring via keyboard
await p.locator("#cap-h").click();
await field(p).focus();
await p.keyboard.press("Shift+Tab");
await p.keyboard.press("Tab");
log("L3 focus on field", await active(p));
log("L3 row ring", await p.locator(".cap-row").evaluate((el) => getComputedStyle(el).boxShadow));
// L4 invalid email, keyboard Enter
await field(p).fill("lan@school");
await p.keyboard.press("Enter");
await p.waitForTimeout(300);
log("L4 error", `${await msg(p).getAttribute("role")} / ${(await msg(p).innerText()).trim()}`);
log("L4 aria-invalid / describedby", `${await field(p).getAttribute("aria-invalid")} / ${await field(p).getAttribute("aria-describedby")}`);
log("L4 focus", await active(p));
log("L4 no request", seen.length === 0);
await band(p).screenshot({ path: `${OUT}/band-error-1280.png` });
// L5 typing clears
await field(p).type("x");
log("L5 error cleared", (await band(p).locator(".err").count()) === 0 || !(await msg(p).isVisible()));
await p.close();

// L6 + L7 valid demo capture, mouse click
({ page: p, seen } = await home(1280, { status: 200, body: { ok: true }, delayMs: 1500 }));
await field(p).fill(EMAIL);
await button(p).click();
await p.waitForTimeout(300);
log("L6 button while sending", `${(await button(p).innerText()).trim()} / disabled ${await button(p).isDisabled()}`);
await p.waitForURL("**/demo#form", { timeout: 8000 });
await p.waitForSelector("#f-email");
await p.waitForTimeout(800);
log("L7 request body", JSON.stringify(seen[0]?.body));
log("L7 landed URL", p.url());
log("L7 URL holds no email", !p.url().includes("@") && !p.url().includes("lan"));
log("L7 tab", await p.locator('[role="tab"][aria-selected="true"]').innerText());
log("L7 Work email", await p.locator("#f-email").inputValue());
log("L7 storage cleared", await p.evaluate(() => sessionStorage.getItem("xt-capture-email")));
log("CAP-9 /demo has no band", (await p.locator("section.capture").count()) === 0);
await p.screenshot({ path: `${OUT}/demo-prefilled-1280.png` });
await p.close();

// L6 keyboard: valid email submitted with Enter lands on /demo#form
({ page: p } = await home(1280, { status: 200, body: { ok: true } }));
await field(p).fill(EMAIL);
await field(p).press("Enter");
await p.waitForURL("**/demo#form", { timeout: 8000 });
await p.waitForSelector("#f-email");
await p.waitForTimeout(600);
log("L6 keyboard Enter lands", `${new URL(p.url()).pathname}${new URL(p.url()).hash} / ${await p.locator("#f-email").inputValue()}`);
await p.close();

// L7 project arrival (no project band is placed yet): from Home, store the key and do the
// same client navigation the band does (router.push("/demo#project")).
p = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await p.goto(`${BASE}/`, { waitUntil: "load" });
await p.waitForTimeout(800);
await p.evaluate((e) => sessionStorage.setItem("xt-capture-email", e), EMAIL);
await p.evaluate(() => window.next.router.push("/demo#project"));
await p.waitForURL("**/demo#project");
await p.waitForSelector("#f-email");
await p.waitForTimeout(1200);
log("L7 project tab", await p.locator('[role="tab"][aria-selected="true"]').innerText());
log("L7 project Work email", await p.locator("#f-email").inputValue());
const card = await box(p, "#form");
log("L7 project form in view", card.y >= 0 && card.y < 400);
await p.close();

// L8 failures: 502, 429, timeout (15 s)
for (const [name, answer] of [["502", { status: 502, body: { error: "send" } }], ["429", { status: 429, body: { error: "rate" } }], ["timeout", "hang"]]) {
  ({ page: p } = await home(1280, answer));
  await field(p).fill(EMAIL);
  const t0 = Date.now();
  await button(p).click();
  await band(p).locator(".err").first().waitFor({ timeout: 20000 });
  log(`L8 ${name} message`, (await msg(p).innerText()).trim());
  log(`L8 ${name} after (s)`, ((Date.now() - t0) / 1000).toFixed(1));
  log(`L8 ${name} email kept / button enabled`, `${await field(p).inputValue()} / ${!(await button(p).isDisabled())}`);
  log(`L8 ${name} still on Home`, new URL(p.url()).pathname === "/");
  if (name === "502") await band(p).screenshot({ path: `${OUT}/band-failure-1280.png` });
  await p.close();
}

// L2 layout at 900 and 390, touch submit at 390
for (const width of [900, 390]) {
  ({ page: p } = await home(width, { status: 200, body: { ok: true } }, width === 390 ? { hasTouch: true, isMobile: true } : {}));
  const hb = await box(p, "#cap-h");
  const fb = await box(p, "section.capture form");
  log(`L2 ${width} one column (form below H2)`, fb.y >= hb.y + hb.height - 1);
  const ib = await box(p, "#cap-email");
  const bb = await box(p, 'section.capture button[type="submit"]');
  log(`L2 ${width} field above button`, bb.y >= ib.y + ib.height - 1);
  log(`L2 ${width} no horizontal scroll`, await p.evaluate((w) => document.documentElement.scrollWidth <= w, width));
  await band(p).screenshot({ path: `${OUT}/band-${width}.png` });
  if (width === 390) {
    await field(p).fill("bad");
    await button(p).tap();
    await p.waitForTimeout(300);
    log("L4 390 touch invalid", (await msg(p).innerText()).trim());
    const rowBox = await box(p, ".cap-row");
    const btnBox = await box(p, 'section.capture button[type="submit"]');
    log("L2 390 button full width of the row", btnBox.width >= rowBox.width - 20);
    await field(p).fill(EMAIL);
    await button(p).tap();
    await p.waitForURL("**/demo#form", { timeout: 8000 });
    await p.waitForSelector("#f-email");
    await p.waitForTimeout(600);
    log("L6 390 touch tap lands", `${new URL(p.url()).pathname}${new URL(p.url()).hash} / ${await p.locator("#f-email").inputValue()}`);
  }
  await p.close();
}
await browser.close();
