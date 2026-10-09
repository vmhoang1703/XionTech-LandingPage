// Walks every E-S4 UX checks line on a production build and prints what it observes.
// POST /api/contact is answered by the walk (200), so no real mail is sent.
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-enh-s4-footer-offices-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-enh-s4-footer-offices-evidence";
const browser = await chromium.launch({ channel: "chrome" });
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(width, path = "/") {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.route("**/api/contact", (r) => r.fulfill({ status: 200, body: "{}" }));
  await page.goto(`${BASE}${path}`, { waitUntil: "load" });
  await sleep(500);
  return { page, context };
}
// The page smooth-scrolls to anchors: wait until scrollY stops changing.
async function settle(page) {
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => scrollY);
    if (y === last) return;
    last = y;
    await sleep(150);
  }
}
const footerFacts = (page) =>
  page.evaluate(() => {
    const f = document.querySelector("footer");
    const ridge = document.querySelector("[data-ridge]");
    const r = ridge.getBoundingClientRect();
    const svg = ridge.querySelector("svg") ?? ridge;
    const cols = getComputedStyle(f.querySelector(".footer-grid") ?? f.querySelector("div div")).gridTemplateColumns.split(" ").length;
    const line = ridge.querySelector("path:last-of-type");
    return {
      ridge: `height ${Math.round(r.height)} | bottom at footer top ${Math.abs(r.bottom - f.getBoundingClientRect().top) < 1} | aria-hidden ${ridge.getAttribute("aria-hidden") ?? svg.getAttribute("aria-hidden")} | figures on ridge ${ridge.querySelectorAll("img, image, .ridge-climber").length}`,
      line: line ? `stroke ${getComputedStyle(line).stroke} opacity ${getComputedStyle(line).strokeOpacity}` : "no line",
      cols,
    };
  });
const lastClear = (page) =>
  page.evaluate(() => {
    scrollTo({ top: document.body.scrollHeight, behavior: "instant" });
    const last = document.querySelector("main > :last-child");
    const links = [...last.querySelectorAll("a, button, p, li, h2, h3")].filter((e) => e.getBoundingClientRect().height > 0);
    const end = Math.max(...links.map((e) => e.getBoundingClientRect().bottom));
    const ridgeTop = document.querySelector("[data-ridge]").getBoundingClientRect().top;
    return `last content bottom ${Math.round(end)} | ridge top ${Math.round(ridgeTop)} | clear ${end <= ridgeTop} | room ${getComputedStyle(last).paddingBottom} | sideways ${document.documentElement.scrollWidth > innerWidth}`;
  });

// ---- 1280px on Home: footer content
{ const { page, context } = await open(1280);
  const f = await footerFacts(page);
  log("ridge 1280", f.ridge);
  log("ridge line", f.line);
  log("footer columns 1280", f.cols);
  log("brand", (await page.locator("footer p").first().textContent()).trim());
  log("columns", (await page.locator("footer h2").allTextContents()).join(" | "));
  for (const h of ["Products", "Services", "Company"]) {
    const links = await page.locator(`footer h2:text-is("${h}") + ul a`).evaluateAll((as) => as.map((a) => `${a.textContent.trim()} -> ${a.getAttribute("href")}`));
    log(`${h} links`, links.join(", "));
  }
  log("offices", (await page.locator("footer address").evaluateAll((as) => as.map((a) => `[${a.querySelector("b")?.textContent.trim()}] ${a.querySelectorAll("svg").length} icons | ${[...a.querySelectorAll("a")].map((l) => `${l.textContent.trim()} (${l.getAttribute("href")}${l.target ? `, ${l.target}, ${l.rel}` : ""}${l.getAttribute("aria-label") ? `, name "${l.getAttribute("aria-label")}"` : ""})`).join("; ")}`))).join(" || "));
  log("vietnam email shown", (await page.locator("footer").textContent()).includes("xiontechs.com"));
  log("bottom bar", (await page.locator("footer").innerText()).split("\n").filter((l) => /©|GET IT/.test(l)).join(" | "));
  const tel = page.locator('footer a[href^="tel:"]').first();
  await tel.focus();
  log("phone link focus", await tel.evaluate((a) => `outline ${getComputedStyle(a).outlineStyle} ${getComputedStyle(a).outlineWidth} | height ${Math.round(a.getBoundingClientRect().height)}`));
  const before = await tel.evaluate((a) => getComputedStyle(a).color);
  await tel.hover(); await sleep(250);
  log("phone link hover", `${before} -> ${await tel.evaluate((a) => getComputedStyle(a).color)}`);
  log("/ end", await lastClear(page));
  await page.screenshot({ path: `${OUT}/footer-1280.png`, fullPage: false });
  await page.locator("footer").screenshot({ path: `${OUT}/footer-1280-full.png` });
  await context.close(); }

// ---- footer links land
{ const { page, context } = await open(1280);
  for (const [name, id] of [["For parents", "pxp"], ["For schools", "sxp"], ["For students", "ai-tutor"]]) {
    await page.goto(`${BASE}/`, { waitUntil: "load" });
    await page.locator(`footer a:text-is("${name}")`).click();
    await page.waitForURL(`**/products#${id}`); await sleep(400); await settle(page);
    log(`${name} lands`, await page.evaluate((id) => { const e = document.getElementById(id); const r = e.getBoundingClientRect(); return `${location.pathname}${location.hash} | card top ${Math.round(r.top)} in view ${r.top >= 0 && r.top < innerHeight}`; }, id));
  }
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.locator('footer a:text-is("How we work")').click();
  await page.waitForURL("**/services#process"); await sleep(400); await settle(page);
  log("How we work lands", await page.evaluate(() => { const h = document.querySelector("#process h2").getBoundingClientRect(); return `${location.hash} | h2 top ${Math.round(h.top)} visible ${h.top >= 0 && h.bottom <= innerHeight}`; }));
  await context.close(); }

// ---- every page ends above the ridge, 1280 and 390
for (const w of [1280, 390]) {
  for (const path of ["/", "/about", "/careers", "/services", "/news", "/products", "/demo", "/privacy", "/no-such-page"]) {
    const { page, context } = await open(w, path);
    log(`${path} ${w}`, await lastClear(page));
    if (path === "/careers") await page.screenshot({ path: `${OUT}/careers-end-${w}.png` });
    await context.close();
  }
}

// ---- widths
for (const w of [900, 390]) {
  const { page, context } = await open(w);
  const f = await footerFacts(page);
  log(`footer columns ${w}`, f.cols);
  log(`ridge ${w}`, f.ridge);
  if (w === 390) await page.locator("footer").screenshot({ path: `${OUT}/footer-390.png` });
  await context.close();
}

// ---- other pages unchanged
{ const { page, context } = await open(1280, "/about");
  log("/about offices", (await page.locator("#offices, section:has(h2:text-matches('office', 'i'))").first().innerText()).replace(/\s+/g, " ").slice(0, 200));
  await context.close(); }
{ const { page, context } = await open(1280, "/demo");
  log("/demo offices", (await page.locator("address").evaluateAll((as) => as.map((a) => a.innerText.replace(/\s+/g, " ").slice(0, 90)))).join(" || "));
  await context.close(); }
{ const { page, context } = await open(1280, "/");
  log("/ contact", (await page.locator("#contact").innerText()).replace(/\s+/g, " ").match(/Plano[^H]*Ho Chi Minh City [+\d ]+/)?.[0]);
  await context.close(); }

await browser.close();
