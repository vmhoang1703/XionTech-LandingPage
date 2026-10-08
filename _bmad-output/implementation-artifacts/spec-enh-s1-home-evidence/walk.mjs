// Walks every E-S1 UX checks line on / and prints what it observes.
// POST /api/contact is answered by the walk (200), so no real mail is sent.
// Run from the repo root on a production build:
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-enh-s1-home-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-enh-s1-home-evidence";
const browser = await chromium.launch({ channel: "chrome" });
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(width, options = {}, path = "/") {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  await page.route("**/api/contact", (r) => r.fulfill({ status: 200, body: "{}" }));
  await page.goto(`${BASE}${path}`, { waitUntil: "load" });
  await sleep(600);
  return { page, context };
}
const cols = (loc) => loc.evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(" ").length);
const rect = (loc) => loc.evaluate((e) => { const r = e.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left, width: r.width, height: r.height }; });

// ---- 1280px, JavaScript on
const { page, context } = await open(1280);
log("title", await page.title());
log("section order", (await page.locator("main > *").evaluateAll((els) => els.flatMap((e) => (e.matches("section") ? [e] : [...e.querySelectorAll(":scope > section")]).map((s) => s.querySelector("h1,h2")?.textContent.trim() ?? s.className)))).join(" > "));
const hero = page.locator("section.home-hero");
const h1 = hero.locator("h1");
log("H1", `"${(await h1.textContent()).trim()}" | ${await page.locator("h1").count()} H1 on page`);
log("highlight", await hero.locator(".hl").evaluate((e) => `"${e.textContent}" color ${getComputedStyle(e).color} | ::after content ${getComputedStyle(e, "::after").content}`));
log("label above H1", await h1.evaluate((h) => h.parentElement.querySelector(":scope > .label") ? "present" : "none"));
log("device mockups", await hero.locator(".home-devices").count());
const cta = hero.locator("a.btn");
log("hero buttons", (await cta.evaluateAll((as) => as.map((a) => `"${a.textContent.trim()}" -> ${a.getAttribute("href")}`))).join(", "));
const stats = hero.locator(".home-stats");
log("figures heading", (await stats.locator("h2, .label, p").first().textContent()).trim());
log("figures cols 1280", await cols(stats.locator("ul")));
const heroBox = await rect(hero);
const doors = hero.locator(".doors");
const doorsGrid = hero.locator(".doors-grid");
const doorBox = await rect(doors);
// The navy ends where the light ::before layer on .doors starts (inset 50% 0 0).
const lightTop = await doors.evaluate((d) => d.getBoundingClientRect().top + scrollY + parseFloat(getComputedStyle(d, "::before").top));
const doorMid = (doorBox.top + doorBox.bottom) / 2;
log("doors vs navy", `doors ${Math.round(doorBox.top)}–${Math.round(doorBox.bottom)} | middle ${Math.round(doorMid)} | light layer starts ${Math.round(lightTop)} | navy ends at door middle: ${Math.abs(lightTop - doorMid) <= 4}`);
log("doors grid 1280", `${await doorsGrid.evaluate((g) => getComputedStyle(g).gridTemplateColumns)} (${await cols(doorsGrid)} columns)`);
await doorsGrid.scrollIntoViewIfNeeded();
log("doors lower half clickable", await hero.locator(".door").evaluateAll((ds) => ds.map((d) => { d.scrollIntoView({ block: "center" }); const r = d.getBoundingClientRect(); const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height * 0.85); return `${d.className.split(" ")[1]} ${d.contains(hit)}`; }).join(", ")));
await page.screenshot({ path: `${OUT}/home-1280-doors-edge.png`, fullPage: true, clip: { x: 0, y: Math.round(doorBox.top) - 80, width: 1280, height: 520 } });
await page.evaluate(() => scrollTo(0, 0));
await sleep(300);
const light = hero.locator(".door-products");
log("products door", await light.evaluate((d) => `href ${d.getAttribute("href")} | bg ${getComputedStyle(d).backgroundColor} | h2 color ${getComputedStyle(d.querySelector("h2")).color} | badges ${[...d.querySelectorAll(".badge")].map((b) => b.textContent.trim() || "icon").join(",")} | chips ${[...d.querySelectorAll(".chip")].map((c) => c.textContent.trim()).join(",")}`));
const dark = hero.locator(".door-services");
log("services door", await dark.evaluate((d) => `href ${d.getAttribute("href")} | kicker "${d.querySelector(".label")?.textContent.trim()}" | chips ${[...d.querySelectorAll(".chip")].map((c) => c.textContent.trim()).join(",")}`));
await page.keyboard.press("Tab");
for (let i = 0; i < 12; i++) { if (await page.evaluate(() => document.activeElement?.classList.contains("door-products"))) break; await page.keyboard.press("Tab"); }
log("products door focus", await page.evaluate(() => { const a = document.activeElement; return a?.classList.contains("door-products") ? `focused, outline ${getComputedStyle(a).outlineStyle} ${getComputedStyle(a).outlineWidth}` : `not reached (${a?.tagName})`; }));
await page.screenshot({ path: `${OUT}/home-1280-top.png` });

const caps = page.locator('section:has(h2:text-is("Capabilities."))');
log("capabilities", await caps.evaluate((s) => `h2 "${s.querySelector("h2").textContent}" | lede "${s.querySelector(".lede, p")?.textContent.trim()}" | cards ${[...s.querySelectorAll(".w-card")].map((c) => c.querySelector("h3")?.textContent.trim()).join(" / ")}`));
log("capabilities grid 1280", await caps.locator(".w-card").evaluateAll((cs) => cs.map((c) => `${Math.round(c.getBoundingClientRect().width)}@${Math.round(c.getBoundingClientRect().top)}`).join(", ")));
log("clocks", (await caps.locator(".w-delivery").innerText()).replace(/\s+/g, " "));
const trigger = caps.locator(".w-more-trigger");
const list = caps.locator(".w-more-list");
log("+3 before", `aria-expanded ${await trigger.getAttribute("aria-expanded")} | name "${await trigger.getAttribute("aria-label")}" | list visible ${await list.isVisible()}`);
await trigger.click();
await sleep(400);
log("+3 after click", `aria-expanded ${await trigger.getAttribute("aria-expanded")} | list visible ${await list.isVisible()} | "${(await list.innerText()).replace(/\s+/g, " ")}"`);
await caps.locator(".w-industries").screenshot({ path: `${OUT}/home-1280-industries-open.png` });
await page.mouse.move(5, 5);
await trigger.click();
await sleep(400);
log("+3 second click", `aria-expanded ${await trigger.getAttribute("aria-expanded")} | list visible ${await list.isVisible()}`);
await trigger.focus();
await page.keyboard.press("Enter");
await sleep(300);
log("+3 Enter", `aria-expanded ${await trigger.getAttribute("aria-expanded")} | focus on trigger ${await trigger.evaluate((t) => t === document.activeElement)}`);
await page.keyboard.press("Tab");
await sleep(300);
log("+3 after Tab away", `aria-expanded ${await trigger.getAttribute("aria-expanded")} | list visible ${await list.isVisible()}`);
await trigger.focus();
await page.keyboard.press("Space");
await sleep(300);
log("+3 Space", `aria-expanded ${await trigger.getAttribute("aria-expanded")}`);
await page.keyboard.press("Escape");
await sleep(300);
log("+3 Escape", `aria-expanded ${await trigger.getAttribute("aria-expanded")} | list visible ${await list.isVisible()}`);
log("motto", (await caps.locator(".w-motto").innerText()).replace(/\s+/g, " "));

const values = page.locator('section:has(h2:text-is("Our core values."))');
log("values", await values.evaluate((s) => `id "${s.id}" | lede "${s.querySelector("p")?.textContent.trim()}" | ${[...s.querySelectorAll(".value")].map((v) => v.querySelector("h3").textContent + (v.classList.contains("feat") ? " [feat]" : "")).join(", ")}`));
const proc = page.locator('section:has(h2:text-is("How we approach."))');
log("process", await proc.evaluate((s) => `classes ${s.className} | bg ${getComputedStyle(s).backgroundColor} | label ${s.querySelector(".label") ? "present" : "none"} | lede "${s.querySelector(".lede")?.textContent.trim().slice(0, 60)}…"`));
const link = proc.locator("a.link-arrow");
log("see how we work", await link.evaluate((a) => { const row = a.closest(".sec-head-row").getBoundingClientRect(); const h = a.closest("section").querySelector(".sec-head").getBoundingClientRect(); const r = a.getBoundingClientRect(); return `"${a.textContent.trim()}" -> ${a.getAttribute("href")} | in .sec-head-row ${Math.round(row.top)}–${Math.round(row.bottom)} | link ${Math.round(r.top)}–${Math.round(r.bottom)} x ${Math.round(r.left)}–${Math.round(r.right)} | right of heading block (ends ${Math.round(h.right)}): ${r.left >= h.right} | aligned to row bottom: ${Math.abs(r.bottom - row.bottom) <= 2}`; }));
const rowTop = await proc.locator(".sec-head-row").evaluate((r) => r.getBoundingClientRect().top + scrollY);
await page.screenshot({ path: `${OUT}/home-1280-process-head.png`, fullPage: true, clip: { x: 0, y: Math.round(rowTop) - 40, width: 1280, height: 260 } });
log("removed sections", `bento ${await page.locator(".bento").count()} | svc-grid ${await page.locator(".svc-grid").count()} | "Four apps" ${(await page.content()).includes("Four apps. One school day")} | "Eight ways" ${(await page.content()).includes("Eight ways we get IT done")}`);
log("flow surfaces", await page.locator(".home-flow").evaluate((f) => `${getComputedStyle(f).backgroundImage.slice(0, 90)} | children bg ${[...f.children].map((c) => getComputedStyle(c).backgroundColor).join(", ")}`));
log("sideways scroll 1280", await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
await page.screenshot({ path: `${OUT}/home-1280-full.png`, fullPage: true });
await context.close();

// ---- 768px figures
{ const { page, context } = await open(768);
  log("figures cols 768", await cols(page.locator(".home-stats ul")));
  await context.close(); }

// ---- 390px
{ const { page, context } = await open(390);
  log("figures cols 390", await cols(page.locator(".home-stats ul")));
  log("doors cols 390", await cols(page.locator(".home-hero .doors")));
  log("capabilities widths 390", await page.locator(".w-card").evaluateAll((cs) => cs.map((c) => Math.round(c.getBoundingClientRect().width)).join(", ")));
  const link = page.locator('section:has(h2:text-is("How we approach.")) a.link-arrow');
  log("see how we work 390", await link.evaluate((a) => { const h = a.closest("section").querySelector("h2").getBoundingClientRect(); return `below H2: ${a.getBoundingClientRect().top >= h.bottom - 2}`; }));
  log("sideways scroll 390", await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await page.screenshot({ path: `${OUT}/home-390-full.png`, fullPage: true });
  await context.close(); }

// ---- 390px touch device: real taps
{ const { page, context } = await open(390, { hasTouch: true, isMobile: true });
  const t = page.locator(".w-more-trigger");
  const l = page.locator(".w-more-list");
  await t.scrollIntoViewIfNeeded();
  await t.tap();
  await sleep(400);
  log("+3 touch tap 1", `aria-expanded ${await t.getAttribute("aria-expanded")} | list visible ${await l.isVisible()}`);
  await page.locator(".w-industries").screenshot({ path: `${OUT}/home-390-industries-tapped.png` });
  await t.tap();
  await sleep(400);
  log("+3 touch tap 2", `aria-expanded ${await t.getAttribute("aria-expanded")} | list visible ${await l.isVisible()}`);
  await context.close(); }

// ---- no JavaScript
{ const { page, context } = await open(1280, { javaScriptEnabled: false });
  const list = page.locator(".w-more-list");
  log("no-JS industries", `list visible ${await list.isVisible()} | "${(await list.innerText()).replace(/\s+/g, " ")}" | clocks "${(await page.locator(".w-delivery").innerText()).replace(/\s+/g, " ")}"`);
  await page.locator(".w-industries").screenshot({ path: `${OUT}/home-nojs-industries.png` });
  await context.close(); }

// ---- other pages still render
{ const { page, context } = await open(1280, {}, "/about");
  log("/about values", `${await page.locator("#values .value").count()} values`);
  await context.close(); }
{ const { page, context } = await open(1280, {}, "/services");
  log("/services process", await page.locator("#process").evaluate((s) => `h2 "${s.querySelector("h2").textContent}" | 03 "${[...s.querySelectorAll("li, article")].map((e) => e.textContent).find((t) => t.includes("Agile sprints"))?.slice(0, 80)}"`));
  await context.close(); }

await browser.close();
