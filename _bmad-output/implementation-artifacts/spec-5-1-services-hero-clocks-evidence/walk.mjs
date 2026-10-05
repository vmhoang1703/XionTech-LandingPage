// Walks every Story 5.1 UX checks line on /services and prints what it observes.
// The 30 s refresh uses Playwright's clock, so a minute turn is reached on purpose.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-5-1-services-hero-clocks-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-5-1-services-hero-clocks-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const HERO = "section.page-hero";

async function open(width, options = {}, clockAt) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  if (clockAt) await page.clock.install({ time: new Date(clockAt) });
  await page.goto(`${BASE}/services`, { waitUntil: "load" });
  await page.waitForSelector(`${HERO} h1`);
  await sleep(600);
  return { page, context };
}
const pills = (page) =>
  page.locator(`${HERO} .clock-strip > span`).evaluateAll((ss) => ss.map((s) => s.textContent.trim()));

// 03:15:45 UTC: HCMC 10:15, Plano 22:15 (CDT); 30 s later it is 10:16 / 22:16.
const { page, context } = await open(1280, {}, "2026-10-05T03:15:45Z");
const hero = page.locator(HERO);
log("hero", `${await hero.evaluate((h) => getComputedStyle(h).backgroundImage.slice(0, 60))} | aurora ${await hero.locator(".aurora").count()} | ribbon ${await hero.locator("canvas.strands").count()}`);
log("breadcrumbs", `${(await hero.locator(".crumbs").textContent()).trim()} | Home → ${await hero.locator(".crumbs a").getAttribute("href")} | ${await hero.locator(".crumbs").evaluate((c) => getComputedStyle(c).fontFamily.split(",")[0])}`);
const h1 = hero.locator("h1");
log("H1", `${await h1.textContent()} | ${await h1.evaluate((e) => `${getComputedStyle(e).fontFamily.split(",")[0]} ${getComputedStyle(e).color}`)} | hl "${await h1.locator(".hl").textContent()}" ${await h1.locator(".hl").evaluate((e) => getComputedStyle(e, "::after").animationName)}`);
const lede = hero.locator(".lede");
const gap = Math.round((await lede.boundingBox()).y - ((await h1.boundingBox()).y + (await h1.boundingBox()).height));
log("lede", `${await lede.textContent()} | ${await lede.evaluate((e) => getComputedStyle(e).color)} | ${gap}px below H1`);
const ctas = hero.locator(".cta-row a");
log("CTAs", (await ctas.evaluateAll((as) => as.map((a) => `${a.textContent.trim()} → ${a.getAttribute("href")} [${a.className}; svg ${a.querySelector("svg") ? 1 : 0}]`))).join(" | "));
const first = ctas.first();
const y0 = (await first.boundingBox()).y;
await first.hover();
await sleep(500);
log("primary hover lift px", Math.round((y0 - (await first.boundingBox()).y) * 10) / 10);
await page.mouse.move(0, 0);
await sleep(400);
await hero.locator(".crumbs a").focus();
const stops = [];
for (let i = 0; i < 2; i++) {
  await page.keyboard.press("Tab");
  stops.push(await page.evaluate(() => {
    const el = document.activeElement;
    const s = getComputedStyle(el);
    return `${el.textContent.trim()} [${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}]`;
  }));
}
log("Tab after the breadcrumb", stops.join("  >  "));
const strip = hero.locator(".clock-strip");
log("strip group name", `${await strip.getAttribute("role")} "${await strip.getAttribute("aria-label")}"`);
log("pills with live time at 03:15:45Z", (await pills(page)).join(" | "));
log("pill style", await strip.locator("> span").first().evaluate((s) => `${getComputedStyle(s).borderTopWidth} ${getComputedStyle(s).borderRadius} | icon svg ${s.querySelector("svg") ? 1 : 0} | time ${getComputedStyle(s.querySelector("b")).fontFamily.split(",")[0]} | nested pill border ${getComputedStyle(s.querySelector("b span")).borderTopWidth}`));
await page.clock.runFor(30_000);
await sleep(300);
log("pills after 30 s (minute turned)", (await pills(page)).join(" | "));
await page.screenshot({ path: `${OUT}/services-1280.png` });
await page.locator(".cta-row a").nth(1).click();
await sleep(300);
log("See our 4-D process → URL / scrollY", `${page.url()} / ${await page.evaluate(() => window.scrollY)}`);
await page.locator(".cta-row a").first().click();
await page.waitForURL("**/demo#project", { timeout: 8000 }).catch(() => undefined);
log("Start a project → URL", page.url());
await context.close();

const noJs = await open(1280, { javaScriptEnabled: false });
log("JS off: pills", (await pills(noJs.page)).join(" | "));
await noJs.page.screenshot({ path: `${OUT}/services-no-js-1280.png` });
await noJs.context.close();

const reduced = await open(1280, { reducedMotion: "reduce" }, "2026-10-05T03:15:45Z");
log("reduced motion: aurora / highlight animation", `${await reduced.page.locator(`${HERO} .aurora`).evaluate((a) => getComputedStyle(a).animationName)} / ${await reduced.page.locator(`${HERO} .hl`).evaluate((e) => getComputedStyle(e, "::after").animationName)}`);
await reduced.page.clock.runFor(30_000);
await sleep(300);
log("reduced motion: pills after 30 s", (await pills(reduced.page)).join(" | "));
await reduced.context.close();

for (const width of [899, 390]) {
  const { page: p, context: c } = await open(width);
  const rows = await p.locator(`${HERO} .cta-row a, ${HERO} .clock-strip > span`).evaluateAll((es) => es.map((e) => Math.round(e.getBoundingClientRect().top)));
  const sideways = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  log(`layout ${width}px`, `CTA and pill tops ${rows.join(" ")}, sideways scroll ${sideways}`);
  await p.screenshot({ path: `${OUT}/services-${width}.png` });
  await c.close();
}
await browser.close();
