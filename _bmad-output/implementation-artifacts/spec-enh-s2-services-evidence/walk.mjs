// Walks the E-S2 UX checks on /services and prints what it observes.
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-enh-s2-services-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-enh-s2-services-evidence";
const browser = await chromium.launch({ channel: "chrome" });
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(width, path = "/services") {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.route("**/api/contact", (r) => r.fulfill({ status: 200, body: "{}" }));
  await page.goto(`${BASE}${path}`, { waitUntil: "load" });
  await sleep(500);
  return { page, context };
}
async function settle(page) {
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => scrollY);
    if (y === last) return;
    last = y;
    await sleep(150);
  }
}
const sections = (page) => page.locator("main section").evaluateAll((ss) => ss.map((s) => s.id || s.querySelector("h1,h2")?.textContent.trim().slice(0, 40)));

{ const { page, context } = await open(1280);
  log("title", await page.title());
  log("sections", (await sections(page)).join(" > "));
  log("hero", await page.evaluate(() => {
    const h = document.querySelector("main section");
    const r = h.getBoundingClientRect(); const cs = getComputedStyle(h);
    return `radius ${cs.borderTopLeftRadius} | inset left ${Math.round(r.left)} right ${Math.round(innerWidth - r.right)} | bg ${cs.backgroundImage.slice(0, 60)}… | aurora ${h.querySelectorAll(".aurora").length} | crumbs ${h.querySelectorAll(".crumbs").length}`;
  }));
  log("H1", (await page.locator("h1").textContent()).trim() + " | hl " + (await page.locator("h1 .hl").textContent()));
  log("lede", (await page.locator("main section").first().locator("p").first().textContent()).trim());
  log("buttons", (await page.locator("main section").first().locator("a.btn").evaluateAll((as) => as.map((a) => `${a.textContent.trim()} -> ${a.getAttribute("href")}`))).join(", "));
  log("removed", `clocks ${await page.locator(".clock-strip, time").count()} | stats ${await page.locator('[role="group"]').count()} | capture ${await page.locator("section.capture, .capture").count()} | 4-D button ${await page.locator('a[href="#process"].btn').count()}`);
  log("panel gap", await page.evaluate(() => { const ss = [...document.querySelectorAll("main section")]; const a = ss[0].getBoundingClientRect(), b = ss[1].getBoundingClientRect(); return `${Math.round(b.top - a.bottom)}px | panel radius ${getComputedStyle(ss[1]).borderTopLeftRadius} | panel bg ${getComputedStyle(ss[1]).backgroundImage.slice(0, 50)}…`; }));
  log("cards", await page.locator("article[id]").evaluateAll((as) => `${as.length} | classes ${[...new Set(as.map((a) => a.className))].join(" / ")} | ${as.map((a) => a.id).join(",")}`));
  log("card parts", await page.locator("article[id]").first().evaluate((a) => { const h = a.firstElementChild; return `head: ${h.tagName}.${h.className} (${h.querySelectorAll("svg").length} icon + ${h.querySelector("h3")?.textContent}) border-bottom ${getComputedStyle(h).borderBottomStyle} | bg ${getComputedStyle(a).backgroundColor}`; }));
  log("cards per row 1280", await page.locator("article[id]").evaluateAll((as) => new Set(as.slice(0, 4).map((a) => Math.round(a.getBoundingClientRect().top))).size === 2 ? 2 : "?"));
  await page.screenshot({ path: `${OUT}/services-1280-top.png` });
  // sticky heading while cards scroll
  const stick = page.locator(".svc-stick");
  const cards = page.locator("article[id]");
  await cards.nth(5).scrollIntoViewIfNeeded(); await sleep(400);
  log("sticky", await stick.evaluate((s) => `position ${getComputedStyle(s).position} top ${Math.round(s.getBoundingClientRect().top)} | heading visible ${s.getBoundingClientRect().top >= 0 && s.getBoundingClientRect().bottom <= innerHeight}`));
  await page.screenshot({ path: `${OUT}/services-1280-sticky.png` });
  const oc = page.locator("#outcomes");
  log("outcomes", await oc.evaluate((s) => `${s.querySelector("h2").textContent} | ${[...s.querySelectorAll("li")].map((l) => l.textContent.replace(/\s+/g, " ").trim().slice(0, 40)).join(" / ")} | cols ${getComputedStyle(s.querySelector("ol")).gridTemplateColumns.split(" ").length}`));
  const pr = page.locator("#process");
  await pr.scrollIntoViewIfNeeded(); await sleep(1500);
  log("process", await pr.evaluate((s) => `label ${s.querySelectorAll(".label").length} | h2 "${s.querySelector("h2").textContent}" | bg ${getComputedStyle(s).backgroundColor} | h2 colour ${getComputedStyle(s.querySelector("h2")).color} | step card bg ${getComputedStyle(s.querySelector(".step4")).backgroundColor} | revealed ${s.querySelector("[data-phase]")?.getAttribute("data-phase")}`));
  await pr.screenshot({ path: `${OUT}/services-1280-process.png` });
  log("sideways 1280", await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await page.screenshot({ path: `${OUT}/services-1280-full.png`, fullPage: true });
  await context.close(); }

for (const w of [980, 640, 390]) {
  const { page, context } = await open(w);
  log(`layout ${w}`, await page.evaluate(() => {
    const st = document.querySelector(".svc-stick"); const c = [...document.querySelectorAll("article[id]")];
    const rows = new Set(c.slice(0, 2).map((a) => Math.round(a.getBoundingClientRect().top))).size;
    return `stick ${getComputedStyle(st).position} above cards ${st.getBoundingClientRect().bottom <= c[0].getBoundingClientRect().top + 1} | cards per row ${rows === 1 ? 2 : 1} | outcomes cols ${getComputedStyle(document.querySelector("#outcomes ol")).gridTemplateColumns.split(" ").length} | sideways ${document.documentElement.scrollWidth > innerWidth}`;
  }));
  if (w === 390) await page.screenshot({ path: `${OUT}/services-390-full.png`, fullPage: true });
  await context.close();
}

for (const hash of ["cloud", "process"]) {
  const { page, context } = await open(1280, "/");
  await page.goto(`${BASE}/services#${hash}`, { waitUntil: "load" }); await sleep(600); await settle(page);
  log(`#${hash} lands`, await page.evaluate((hash) => { const el = document.getElementById(hash); const h = el.querySelector("h2, h3"); const r = h.getBoundingClientRect(); const hb = document.querySelector("header").getBoundingClientRect().bottom; return `heading ${Math.round(r.top)}-${Math.round(r.bottom)} under header ${Math.round(hb)} visible ${r.top >= hb && r.bottom <= innerHeight}`; }, hash));
  await context.close();
}
{ const { page, context } = await open(1280);
  await page.getByRole("link", { name: "Start a project" }).click();
  await page.waitForURL("**/demo#project"); await sleep(600);
  log("Start a project", await page.evaluate(() => `${location.pathname}${location.hash} | selected tab "${document.querySelector('[role="tab"][aria-selected="true"]')?.textContent.trim()}"`));
  await context.close(); }
await browser.close();
