// Walks every Story 2.2 UX checks line on the running dev server and prints what it observes.
// Run from the repo root: node _bmad-output/implementation-artifacts/spec-2-2-contact-form-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-2-2-contact-form-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);

async function open(width, hash = "") {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${BASE}/demo${hash}`, { waitUntil: "load" });
  await page.waitForSelector("#f-name");
  await page.waitForTimeout(800);
  return page;
}
const box = (page, sel) => page.locator(sel).first().boundingBox();
const selected = (page) =>
  page.locator('[role="tab"][aria-selected="true"]').innerText();
const submit = (page) => page.locator('button[type="submit"]').click();
// Ids of form controls a visitor can see (not inside a [hidden] panel).
const visibleFields = (page) =>
  page.$$eval("#demoForm input, #demoForm select, #demoForm textarea", (els) =>
    els
      .filter((el) => !el.closest("[hidden]"))
      .map((el) => el.id || `${el.type}:${el.parentElement?.textContent?.trim()}`),
  );

// 1–3. Layout and hero
let p = await open(1280);
const hero = await box(p, ".page-hero h1");
const card = await box(p, "#form");
log("L1 1280 card beside hero", card.x > hero.x + 300 && card.y < hero.y + 300);
await p.screenshot({ path: `${OUT}/demo-1280.png`, fullPage: true });
log("L3 breadcrumbs", (await p.locator(".crumbs").innerText()).replace(/\s+/g, " "));
log("L3 check items", await p.locator(".list-check li").count());
log("L3 offices", await p.locator(".office").count());
// 5. Default tab
log("L5 /demo tab", await selected(p));
// 6. Tab keys
const tab = p.locator('[role="tab"][aria-selected="true"]');
await tab.focus();
await p.keyboard.press("ArrowRight");
log("L6 ArrowRight", await selected(p));
await p.keyboard.press("ArrowRight");
log("L6 ArrowRight wraps", await selected(p));
await p.keyboard.press("ArrowLeft");
log("L6 ArrowLeft wraps", await selected(p));
await p.keyboard.press("Home");
log("L6 Home", await selected(p));
await p.keyboard.press("End");
log("L6 End", await selected(p));
await p.keyboard.press("Home");
// 7. Product demo fields
log("L7 demo fields", (await visibleFields(p)).join(", "));
log("L7 PXP checked", await p.locator('#demoForm input[type="checkbox"]').first().isChecked());
// 10–14. Validation
await submit(p);
await p.waitForTimeout(300);
log("L10 aria-invalid count", await p.locator('[aria-invalid="true"]').count());
log("L10 focused", await p.evaluate(() => document.activeElement?.id));
log("L10 live region", (await p.locator('[aria-live="polite"]').innerText()).replace(/\s+/g, " "));
log("L10 invalid border", await p.locator("#f-name").evaluate((el) => getComputedStyle(el).borderColor));
await p.screenshot({ path: `${OUT}/errors-1280.png`, fullPage: true });
await p.fill("#f-email", "ana@school");
await submit(p);
log("L11 ana@school invalid", await p.locator("#f-email").getAttribute("aria-invalid"));
await p.fill("#f-email", "ana@gmail.com");
await p.fill("#f-name", "Ana");
await p.fill("#f-org", "School");
await submit(p);
log("L11 ana@gmail.com invalid", await p.locator("#f-email").getAttribute("aria-invalid"));
log("L12 date min (today)", await p.locator("#f-date").getAttribute("min"));
await p.fill("#f-date", "2020-01-01");
await submit(p);
log("L12 past date invalid", await p.locator("#f-date").getAttribute("aria-invalid"));
await p.fill("#f-date", "");
await p.fill("#f-msg", "x".repeat(2001));
await submit(p);
log("L13 long message invalid", await p.locator("#f-msg").getAttribute("aria-invalid"));
await p.fill("#f-msg", "ok");
log("L14 typing clears", await p.locator("#f-msg").getAttribute("aria-invalid"));
// 15. Submit and consent
const btn = p.locator('button[type="submit"]');
log("L15 submit text", (await btn.innerText()).trim());
log("L15 submit icon", (await btn.locator("svg").count()) > 0);
log("L15 consent", (await p.locator(".consent").innerText()).replace(/\s+/g, " "));
const link = p.locator(".consent a");
log("L15 privacy href", await link.getAttribute("href"));
log("L15 privacy underline", await link.evaluate((el) => getComputedStyle(el).textDecorationLine));
await p.close();

// 4, 8, 9. Project tab and hidden fields
p = await open(1280, "#project");
log("L4 #project tab", await selected(p));
log(
  "L4 selected pill background",
  await p.locator('[role="tab"][aria-selected="true"]').evaluate((el) => getComputedStyle(el).backgroundColor),
);
log("L8 project fields", (await visibleFields(p)).join(", "));
log("L8 service options", await p.locator("#f-svc option").count());
const reached = [];
await p.locator("#f-name").focus();
for (let i = 0; i < 8; i++) {
  await p.keyboard.press("Tab");
  reached.push(await p.evaluate(() => document.activeElement?.id || document.activeElement?.tagName));
}
log("L9 tab order (project)", reached.join(" > "));
log("L9 demo fields reached", reached.some((id) => ["f-size", "f-date"].includes(id)));
await p.screenshot({ path: `${OUT}/project-1280.png`, fullPage: true });
await p.close();

// 5. #form
p = await open(1280, "#form");
log("L5 #form tab", await selected(p));
await p.close();

// 2. Narrow
p = await open(390);
const h2 = await box(p, ".page-hero h1");
const c2 = await box(p, "#form");
log("L2 390 stacked", c2.y > h2.y + 100);
log("L2 390 no horizontal scroll", await p.evaluate(() => document.documentElement.scrollWidth <= 390));
log("L7 390 demo fields", (await visibleFields(p)).join(", "));
await p.screenshot({ path: `${OUT}/demo-390.png`, fullPage: true });
await p.close();
await browser.close();
