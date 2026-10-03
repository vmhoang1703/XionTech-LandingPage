// Walks every Story 2.3 UX checks line on the running dev server and prints what it observes.
// /api/contact is intercepted in the browser, so no real mail is sent and Upstash is not used.
// Run from the repo root: node _bmad-output/implementation-artifacts/spec-2-3-submission-delivery-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-2-3-submission-delivery-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);

// answer: { status, body, delayMs } or "hang" (never answers)
async function open(width, answer) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  const seen = [];
  await page.route("**/api/contact", async (route) => {
    seen.push({ url: route.request().url(), body: route.request().postDataJSON() });
    if (answer === "hang") return; // never fulfilled: the client times out
    if (answer.delayMs) await new Promise((r) => setTimeout(r, answer.delayMs));
    await route.fulfill({
      status: answer.status,
      contentType: "application/json",
      body: JSON.stringify(answer.body),
    });
  });
  await page.goto(`${BASE}/demo`, { waitUntil: "load" });
  await page.waitForSelector("#f-name");
  await page.waitForTimeout(800);
  return { page, seen };
}
async function fillValid(page) {
  await page.fill("#f-name", "Walk Test");
  await page.fill("#f-email", "walk@example.com");
  await page.fill("#f-org", "Walk School");
  await page.fill("#f-role", "Head of IT");
  await page.fill("#f-msg", "Walk message");
}
const submit = (page) => page.locator('button[type="submit"]');
const active = (page) =>
  page.evaluate(() => {
    const el = document.activeElement;
    return el ? `${el.tagName}${el.id ? "#" + el.id : ""}${el.className ? "." + String(el.className).split(" ")[0] : ""}` : "none";
  });
const values = (page) =>
  page.evaluate(() =>
    ["f-name", "f-email", "f-org", "f-role", "f-msg"].map((id) => document.getElementById(id)?.value).join(" | "),
  );

for (const W of [1280, 390]) {
const log = (k, v) => console.log(`[${W}] ${k}: ${v}`);
// L1 Sending state (slow 200), then L2 panel
let { page: p, seen } = await open(W, { status: 200, body: { ok: true }, delayMs: 1500 });
await fillValid(p);
await submit(p).focus();
await p.keyboard.press("Enter");
await p.waitForTimeout(300);
log("L1 button text while sending", (await submit(p).innerText()).trim());
log("L1 button disabled while sending", await submit(p).isDisabled());
log("L1 icon kept", (await submit(p).locator("svg").count()) > 0);
await p.screenshot({ path: `${OUT}/sending-${W}.png` });
await p.waitForSelector(".form-ok", { timeout: 5000 });
log("L2 panel role", await p.locator(".form-ok").getAttribute("role"));
log("L2 panel text", (await p.locator(".form-ok").innerText()).replace(/\s+/g, " ").trim());
log("L2 panel icon", (await p.locator(".form-ok svg").count()) > 0);
log("L2 form gone", (await p.locator("#demoForm").count()) === 0);
log("L2 tabs gone", (await p.locator('[role="tab"]').count()) === 0);
log("L2 focus", await active(p));
log("L2 request URL", seen[0]?.url);
log("L2 request URL has no query or hash", /\/api\/contact$/.test(seen[0]?.url ?? ""));
log("L2 request URL holds no name or email", !/walk/i.test(seen[0]?.url ?? "x walk"));
log("L2 request had honeypot empty", seen[0]?.body?.website === "");
await p.screenshot({ path: `${OUT}/success-${W}.png`, fullPage: true });
await p.close();

// L3 server field errors
({ page: p } = await open(W, { status: 400, body: { errors: { email: "Please enter a valid email address." } } }));
await fillValid(p);
await submit(p).click();
await p.waitForTimeout(800);
log("L3 email aria-invalid", await p.locator("#f-email").getAttribute("aria-invalid"));
log("L3 inline error", (await p.locator("#f-email-err").innerText()).trim());
log("L3 focus", await active(p));
log("L3 live region", (await p.locator('[aria-live="polite"]').innerText()).replace(/\s+/g, " ").trim());
await p.close();

// L4 send failure (502) + L6 retry
({ page: p } = await open(W, { status: 502, body: { error: "send" } }));
await fillValid(p);
await submit(p).click();
await p.waitForSelector(".form-alert", { timeout: 5000 });
log("L4 alert", `${await p.locator(".form-alert").getAttribute("role")} / ${(await p.locator(".form-alert").innerText()).trim()}`);
log("L4 alert colour", await p.locator(".form-alert").evaluate((el) => getComputedStyle(el).color));
log("L4 values kept", await values(p));
log("L4 button enabled", !(await submit(p).isDisabled()));
log("L4 button text", (await submit(p).innerText()).trim());
log("L4 focus", await active(p));
const alertBox = await p.locator(".form-alert").boundingBox();
const btnBox = await submit(p).boundingBox();
log("L4 alert above button", alertBox.y + alertBox.height <= btnBox.y);
await p.screenshot({ path: `${OUT}/failure-${W}.png`, fullPage: true });
await p.unroute("**/api/contact");
await p.route("**/api/contact", async (route) => {
  await new Promise((r) => setTimeout(r, 1500));
  await route.fulfill({ status: 502, contentType: "application/json", body: '{"error":"send"}' });
});
await submit(p).click();
await p.waitForTimeout(300);
log("L6 retry clears message", (await p.locator(".form-alert").count()) === 0);
log("L6 retry shows Sending", (await submit(p).innerText()).trim());
await p.close();

// L5 rate limit (429)
({ page: p } = await open(W, { status: 429, body: { error: "rate" } }));
await fillValid(p);
await submit(p).click();
await p.waitForSelector(".form-alert", { timeout: 5000 });
log("L5 alert", (await p.locator(".form-alert").innerText()).trim());
log("L5 values kept", await values(p));
log("L5 button enabled", !(await submit(p).isDisabled()));
await p.close();

// L4 timeout: never answered, client aborts at 15 s
({ page: p } = await open(W, "hang"));
await fillValid(p);
const t0 = Date.now();
await submit(p).click();
await p.waitForSelector(".form-alert", { timeout: 20000 });
log("L4 timeout after (s)", ((Date.now() - t0) / 1000).toFixed(1));
log("L4 timeout alert", (await p.locator(".form-alert").innerText()).trim());
log("L4 timeout values kept", await values(p));
await p.close();

// L7 honeypot
({ page: p } = await open(W, { status: 200, body: { ok: true } }));
const hp = p.locator('input[name="website"]');
log("L7 honeypot attrs", `${await hp.getAttribute("tabindex")} / ${await hp.getAttribute("aria-hidden")} / ${await hp.getAttribute("autocomplete")}`);
const hpBox = await hp.boundingBox();
log("L7 honeypot visible size", hpBox ? `${hpBox.width}x${hpBox.height}` : "none");
await p.locator("#f-msg").focus();
const reached = [];
for (let i = 0; i < 4; i++) {
  await p.keyboard.press("Tab");
  reached.push(await active(p));
}
log("L7 tab order after message", reached.join(" > "));
log("L7 honeypot reached", reached.some((r) => r.includes("website")));
await p.close();

}

// L8 panel at 390px and 1280px
for (const width of [390, 1280]) {
  const { page: p } = await open(width, { status: 200, body: { ok: true } });
  await fillValid(p);
  await submit(p).click();
  await p.waitForSelector(".form-ok", { timeout: 5000 });
  const card = await p.locator("#form").boundingBox();
  const panel = await p.locator(".form-ok").boundingBox();
  log(`L8 ${width} panel inside card`, panel.x >= card.x && panel.x + panel.width <= card.x + card.width);
  log(`L8 ${width} no horizontal scroll`, await p.evaluate((w) => document.documentElement.scrollWidth <= w, width));
  await p.close();
}
await browser.close();
