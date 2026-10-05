// Walks every Story 5.2 UX checks line on /services and prints what it observes.
// Run from the repo root on a production build:
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-5-2-stats-eight-services-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-5-2-stats-eight-services-evidence";
const IDS = ["product-engineering", "ai-analytics", "co-creation", "staffing", "custom-apps", "low-code", "ai-solutions", "cloud"];
const browser = await chromium.launch().catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const STATS = 'section[aria-label="Key facts"]';
const SVC = 'section[aria-labelledby="services-all-h"]';

async function open(width, path = "/services", options = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  await page.goto(`${BASE}${path}`, { waitUntil: "load" });
  await sleep(700);
  return { page, context };
}
const columns = (page, sel) => page.locator(sel).evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(" ").length);

// Where a card lands: header bottom vs the card top and its h3 top.
async function landing(page, id) {
  return page.evaluate((id) => {
    const header = document.querySelector("header").getBoundingClientRect().bottom;
    const card = document.getElementById(id);
    const h3 = card.querySelector("h3").getBoundingClientRect();
    return { header: Math.round(header), card: Math.round(card.getBoundingClientRect().top), h3: Math.round(h3.top), visible: h3.top >= header && h3.bottom <= innerHeight };
  }, id);
}

const { page, context } = await open(1280);
const stats = page.locator(STATS);
log("stats section", `${await stats.evaluate((s) => getComputedStyle(s).backgroundColor)} | directly after hero: ${await stats.evaluate((s) => s.previousElementSibling?.classList.contains("hero-navy"))}`);
log("figures", (await stats.locator("li").evaluateAll((ls) => ls.map((l) => l.querySelector("p").textContent + " / " + l.querySelectorAll("p")[1].textContent))).join(" | "));
log("suffix colours", (await stats.locator("li p span").evaluateAll((ss) => ss.map((s) => `${s.textContent} ${getComputedStyle(s).color}`))).join(" | "));
const h2 = stats.locator("h2");
log("stats label", `text "${await h2.textContent()}" | box ${JSON.stringify(await h2.evaluate((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }))} | group name ${await stats.locator('[role="group"]').evaluate((g) => document.getElementById(g.getAttribute("aria-labelledby")).textContent)}`);
log("stats list top border", await stats.locator("ul").evaluate((u) => getComputedStyle(u).borderTopWidth));
log("stats column dividers (2nd item border-left)", await stats.locator("li").nth(1).evaluate((l) => getComputedStyle(l).borderLeftWidth));
const svc = page.locator(SVC);
log("services section", `${await svc.evaluate((s) => getComputedStyle(s).backgroundImage.slice(0, 40))} | linen ${await svc.evaluate((s) => getComputedStyle(s, "::after").backgroundImage.startsWith("repeating"))} | padding-top ${await svc.evaluate((s) => getComputedStyle(s).paddingTop)}`);
log("h2 / lede", `${await svc.locator("h2").textContent()} / ${await svc.locator(".lede").textContent()}`);
log("cards", (await svc.locator("article").evaluateAll((as) => as.map((a) => `${a.id}[${a.className.replace("spot svc", "").trim() || "-"}] ic ${Math.round(a.querySelector(".ic").getBoundingClientRect().width)}px tags "${a.querySelector(".tags")?.textContent ?? ""}"`))).join("\n  "));
log("tags font", await svc.locator(".tags").first().evaluate((t) => `${getComputedStyle(t).fontFamily.split(",")[0]} ${getComputedStyle(t).fontSize}`));
log("links or focusables inside cards", await svc.locator(".svc-grid").evaluate((g) => g.querySelectorAll("a, button, [tabindex]").length));
log("card cursor", await svc.locator("article").first().evaluate((a) => getComputedStyle(a).cursor));
const before = page.url();
await svc.locator("article#low-code").click();
await sleep(300);
log("click a card → URL unchanged", page.url() === before);
log("columns 1280: stats / services", `${await columns(page, `${STATS} ul`)} / ${await columns(page, ".svc-grid")}`);
await svc.scrollIntoViewIfNeeded();
await stats.scrollIntoViewIfNeeded();
await page.evaluate(() => window.scrollBy(0, -90));
await sleep(300);
await page.screenshot({ path: `${OUT}/services-5-2-1280.png` });
// Keyboard: from the last hero CTA, the next Tab stop is not inside the services grid.
await page.locator(".cta-row a").nth(1).focus();
const stops = [];
for (let i = 0; i < 3; i++) {
  await page.keyboard.press("Tab");
  stops.push(await page.evaluate(() => `${document.activeElement.tagName}${document.activeElement.closest(".svc-grid") ? " IN GRID" : ""} "${document.activeElement.textContent.trim().slice(0, 30)}"`));
}
log("Tab after the hero CTAs", stops.join("  >  "));
await context.close();

for (const width of [1280, 390]) {
  const rows = [];
  for (const id of IDS) {
    const { page: p, context: c } = await open(width, `/services#${id}`);
    const r = await landing(p, id);
    rows.push(`${id} header ${r.header} card ${r.card} h3 ${r.h3} visible ${r.visible}`);
    if (id === "low-code") await p.screenshot({ path: `${OUT}/anchor-low-code-${width}.png` });
    await c.close();
  }
  log(`anchors at ${width}px`, "\n  " + rows.join("\n  "));
}

// From Home: click the Low-code card link and the footer Cloud link.
const home = await open(1280, "/");
await home.page.locator('.svc-grid a[href="/services#low-code"]').click();
await home.page.waitForURL("**/services#low-code");
await sleep(900);
log("Home card → /services#low-code", JSON.stringify(await landing(home.page, "low-code")));
await home.page.locator('footer a[href="/services#cloud"]').click();
await home.page.waitForURL("**/services#cloud");
await sleep(900);
log("footer link → /services#cloud", JSON.stringify(await landing(home.page, "cloud")));
await home.context.close();

for (const width of [899, 390]) {
  const { page: p, context: c } = await open(width);
  log(`columns ${width}: stats / services`, `${await columns(p, `${STATS} ul`)} / ${await columns(p, ".svc-grid")} | sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)}`);
  await p.locator(STATS).scrollIntoViewIfNeeded();
  await p.evaluate(() => window.scrollBy(0, -90));
  await sleep(300);
  await p.screenshot({ path: `${OUT}/services-5-2-${width}.png` });
  await c.close();
}

const reduced = await open(1280, "/services", { reducedMotion: "reduce" });
log("reduced motion: figures", (await reduced.page.locator(`${STATS} li p:first-child`).allTextContents()).join(" "));
log("reduced motion: card animation/transition", await reduced.page.locator("article#cloud").evaluate((a) => `${getComputedStyle(a).animationName} / ${getComputedStyle(a).transitionDuration}`));
await reduced.context.close();
await browser.close();
