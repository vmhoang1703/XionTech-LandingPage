// Walks the Story 2.2 UX checks on the running dev server and prints what it observes.
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

// Layout
let p = await open(1280);
const hero = await box(p, ".page-hero h1");
const card = await box(p, "#form");
log("1280 card beside hero", card.x > hero.x + 300 && card.y < hero.y + 300);
await p.screenshot({ path: `${OUT}/demo-1280.png`, fullPage: true });
log("breadcrumbs", (await p.locator(".crumbs").innerText()).replace(/\s+/g, " "));
log("check items", await p.locator(".list-check li").count());
log("offices", await p.locator(".office").count());
log("default tab", await selected(p));
log("date min (today)", await p.locator("#f-date").getAttribute("min"));
// Tabs keys
await p.locator('[role="tab"][aria-selected="true"]').focus();
await p.keyboard.press("ArrowRight");
log("after ArrowRight", await selected(p));
await p.keyboard.press("Home");
log("after Home", await selected(p));
// Empty submit
await p.locator('button[type="submit"]').click();
await p.waitForTimeout(300);
log("aria-invalid count", await p.locator('[aria-invalid="true"]').count());
log("focused after submit", await p.evaluate(() => document.activeElement?.id));
log("live region", (await p.locator('[aria-live="polite"]').innerText()).replace(/\s+/g, " "));
await p.screenshot({ path: `${OUT}/errors-1280.png`, fullPage: true });
// Email
await p.fill("#f-email", "ana@school");
await p.locator('button[type="submit"]').click();
log("email error", await p.locator("#f-email").getAttribute("aria-invalid"));
await p.fill("#f-email", "ana@gmail.com");
await p.fill("#f-name", "Ana");
await p.fill("#f-org", "School");
// Past date
await p.fill("#f-date", "2020-01-01");
await p.locator('button[type="submit"]').click();
log("past date error", await p.locator("#f-date").getAttribute("aria-invalid"));
// Long message
await p.fill("#f-date", "");
await p.fill("#f-msg", "x".repeat(2001));
await p.locator('button[type="submit"]').click();
log("long message error", await p.locator("#f-msg").getAttribute("aria-invalid"));
await p.fill("#f-msg", "ok");
log("typing clears", await p.locator("#f-msg").getAttribute("aria-invalid"));
log("submit text", (await p.locator('button[type="submit"]').innerText()).trim());
log("consent", (await p.locator(".consent").innerText()).replace(/\s+/g, " "));
log("privacy href", await p.locator(".consent a").getAttribute("href"));
await p.close();

// Project tab and hidden fields
p = await open(1280, "#project");
log("#project tab", await selected(p));
log("service options", await p.locator("#f-svc option").count());
const reached = [];
await p.locator("#f-name").focus();
for (let i = 0; i < 12; i++) {
  await p.keyboard.press("Tab");
  reached.push(await p.evaluate(() => document.activeElement?.id || document.activeElement?.tagName));
}
log("tab order (project)", reached.join(" > "));
log("demo fields reached", reached.some((id) => ["f-size", "f-date"].includes(id)));
await p.screenshot({ path: `${OUT}/project-1280.png`, fullPage: true });
await p.close();

// Narrow
p = await open(390);
const h2 = await box(p, ".page-hero h1");
const c2 = await box(p, "#form");
log("390 stacked", c2.y > h2.y + 100);
await p.screenshot({ path: `${OUT}/demo-390.png`, fullPage: true });
await p.close();
await browser.close();
