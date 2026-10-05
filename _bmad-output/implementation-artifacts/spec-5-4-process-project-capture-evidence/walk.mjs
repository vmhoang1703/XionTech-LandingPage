// Walks every Story 5.4 UX checks line on /services and prints what it observes.
// The capture's POST /api/contact is answered by the walk (200), so no real mail is sent.
// Run from the repo root on a production build:
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-5-4-process-project-capture-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-5-4-process-project-capture-evidence";
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BAND = "section#process";

async function open(width, path = "/services", options = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: "load" });
  await sleep(500);
  return { page, context };
}
// The page smooth-scrolls to an anchor: wait until scrollY stops changing.
async function settle(page) {
  let last = -1;
  for (let i = 0; i < 40; i++) {
    const y = await page.evaluate(() => scrollY);
    if (y === last) return;
    last = y;
    await sleep(150);
  }
}
const landing = (page) =>
  page.evaluate(() => {
    const header = document.querySelector("header").getBoundingClientRect().bottom;
    const h2 = document.querySelector("#process h2").getBoundingClientRect();
    return `url ${location.pathname}${location.hash} | header ${Math.round(header)} h2 ${Math.round(h2.top)}–${Math.round(h2.bottom)} visible ${h2.top >= header && h2.bottom <= innerHeight}`;
  });
const box = (loc) => loc.evaluate((e) => { const r = e.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; });
// Distinct row tops of the four steps = how many rows they use.
const stepLayout = (page) =>
  page.locator(`${BAND} li.step4`).evaluateAll((ls) => {
    const tops = ls.map((l) => Math.round(l.getBoundingClientRect().top));
    return `${new Set(tops).size} row(s), ${tops.filter((t) => t === tops[0]).length} per row`;
  });

// 1280px: the band, the reveal, the aligned "You receive" rows.
const { page, context } = await open(1280);
const band = page.locator(BAND);
log("4-D band", `${await band.evaluate((b) => `${getComputedStyle(b).backgroundColor} | gridbg ${b.classList.contains("gridbg")} | after services ${b.previousElementSibling?.classList.contains("surface-mist")}`)}`);
log("head", (await band.locator(".sec-head").evaluate((h) => [...h.children].map((c) => c.textContent).join(" / "))));
log("phase before scroll", await band.locator("ol.flow").getAttribute("data-phase"));
await band.locator("ol.flow").scrollIntoViewIfNeeded();
await sleep(2800);
log("phase after scroll", await band.locator("ol.flow").getAttribute("data-phase"));
log("track fill width", await band.locator(".track i").evaluate((i) => `${Math.round(i.getBoundingClientRect().width)} of ${Math.round(i.parentElement.getBoundingClientRect().width)}`));
log("steps", (await band.locator("li.step4").evaluateAll((ls) => ls.map((l) => `${l.querySelector("h3").textContent}: "${l.querySelector(":scope > p").textContent}" → "${l.querySelector(".get span").textContent}"`))).join("\n  "));
log("You receive row tops (1280)", (await band.locator("li.step4 .get").evaluateAll((gs) => gs.map((g) => Math.round(g.getBoundingClientRect().top)))).join(" "));
log("layout 1280", `${await stepLayout(page)} | track ${await box(band.locator(".track"))} | end node ${await box(band.locator(".node.end"))}`);
await band.screenshot({ path: `${OUT}/process-1280.png` });

// Hero link, mouse and keyboard.
await page.evaluate(() => scrollTo(0, 0));
await sleep(300);
await page.getByRole("link", { name: "See our 4-D process" }).click();
await settle(page);
log("hero link click", await landing(page));
await page.evaluate(() => { history.replaceState(null, "", "/services"); scrollTo(0, 0); });
await sleep(300);
await page.getByRole("link", { name: "See our 4-D process" }).focus();
await page.keyboard.press("Enter");
await settle(page);
log("hero link Enter", await landing(page));
await page.screenshot({ path: `${OUT}/process-landing-1280.png` });

// Capture band: last section of main, copy, invalid then valid email.
const cap = page.locator("section.capture");
log("capture", `${await cap.evaluate((c) => `${getComputedStyle(c).backgroundColor} | last in main ${c.parentElement.tagName === "MAIN" && !c.nextElementSibling}`)} | ${await cap.locator("h2").textContent()} | ${await cap.locator(".lede").textContent()} | label "${await cap.locator('label[for="cap-email"]').textContent()}" | button "${await cap.locator('button[type="submit"]').textContent()}" ${await cap.locator('button[type="submit"]').evaluate((b) => getComputedStyle(b).backgroundColor)}`);
log("amber bands on the page", await page.locator(".surface-amber").count());
log("navy surfaces (hero, 4-D)", `${await page.locator(".hero-navy").count()} hero-navy, ${await page.locator(".surface-navy").count()} surface-navy`);
await cap.scrollIntoViewIfNeeded();
await cap.screenshot({ path: `${OUT}/capture-1280.png` });
const field = cap.locator("#cap-email");
await field.fill("not-an-email");
await field.press("Enter");
await sleep(400);
log("invalid email", `error "${await cap.locator(".err").textContent().catch(() => "none")}" | focus on field ${await field.evaluate((f) => document.activeElement === f)} | url ${new URL(page.url()).pathname}`);
let posted = null;
await page.route("**/api/contact", async (route) => {
  posted = route.request().postDataJSON();
  await route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' });
});
await field.fill("quan@logistics-example.com");
await field.press("Enter");
await page.waitForURL("**/demo#project", { timeout: 10000 });
await sleep(1200);
await settle(page);
log("posted (intercepted, not sent)", JSON.stringify(posted));
log("after valid email", await page.evaluate(() => {
  const tab = document.querySelector('[role="tab"][aria-selected="true"]');
  const email = document.getElementById("f-email");
  const form = email.closest("form").getBoundingClientRect();
  return `url ${location.pathname}${location.hash} (email in URL: ${location.href.includes("quan")}) | tab "${tab?.textContent}" | email "${email.value}" | form top ${Math.round(form.top)} of ${innerHeight}`;
}));
await page.screenshot({ path: `${OUT}/demo-project-after-capture.png` });
await context.close();

// Mega menu "See the process" from Home.
const mega = await open(1280, "/");
await mega.page.locator('button[aria-controls="mega-services"]').hover();
await mega.page.locator('#mega-services a[href="/services#process"]').click();
await mega.page.waitForURL("**/services#process");
await settle(mega.page);
log("mega menu See the process", await landing(mega.page));
await mega.context.close();

// Direct links and the narrower layouts.
for (const width of [1280, 390]) {
  const { page: p, context: c } = await open(width, "/services#process");
  await settle(p);
  log(`/services#process at ${width}px`, await landing(p));
  await c.close();
}
for (const width of [1080, 899, 640, 390]) {
  const { page: p, context: c } = await open(width);
  const b = p.locator(BAND);
  log(`layout ${width}`, `${await stepLayout(p)} | track ${await box(b.locator(".track"))} | end node ${await box(b.locator(".node.end"))} | sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)}`);
  if (width === 390) {
    const row = await p.locator(".cap-row").evaluate((r) => { const [i, btn] = [r.querySelector("input"), r.querySelector("button")]; return `input top ${Math.round(i.getBoundingClientRect().top)}, button top ${Math.round(btn.getBoundingClientRect().top)}`; });
    log("capture row at 390", row);
    await b.screenshot({ path: `${OUT}/process-390.png` });
  }
  await c.close();
}

// Reduced motion: flow shown at once, instant anchor jump.
const reduced = await open(390, "/services#process", { reducedMotion: "reduce" });
log("reduced motion", `phase ${await reduced.page.locator(`${BAND} ol.flow`).getAttribute("data-phase")} | scroll-behavior ${await reduced.page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)} | ${await landing(reduced.page)}`);
await reduced.context.close();
await browser.close();
