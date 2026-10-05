// Walks every Story 6.4 UX checks line on /about and prints what it observes.
// The capture's POST /api/contact is answered by the walk (200), so no real mail is sent.
// Run from the repo root on a production build:
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-6-4-about-page-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-6-4-about-page-evidence";
const browser = await chromium.launch({ channel: "chrome" });
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function open(width, path = "/about", options = {}, clockAt) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  if (clockAt) await page.clock.install({ time: new Date(clockAt) });
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
  throw new Error("scroll did not settle");
}
const landing = (page, id) =>
  page.evaluate((id) => {
    const header = document.querySelector("header").getBoundingClientRect().bottom;
    const h2 = document.querySelector(`#${id} h2`).getBoundingClientRect();
    return `url ${location.pathname}${location.hash} | header ${Math.round(header)} h2 ${Math.round(h2.top)}–${Math.round(h2.bottom)} visible ${h2.top >= header && h2.bottom <= innerHeight}`;
  }, id);
const cols = (page, sel) => page.locator(sel).evaluate((e) => getComputedStyle(e).gridTemplateColumns.split(" ").length);
const sectionBg = (page, sel) => page.locator(sel).evaluate((s) => `${s.className} | ${getComputedStyle(s).backgroundImage.slice(0, 70)}`);

// 1280px, JavaScript on, clock at 03:15:45Z (Plano 22:15 CDT, HCMC 10:15).
const { page, context } = await open(1280, "/about", {}, "2026-10-05T03:15:45Z");
log("section order", (await page.locator("main > section").evaluateAll((ss) => ss.map((s) => s.id || s.getAttribute("aria-labelledby") || s.className.split(" ").slice(0, 2).join(".")))).join(" > "));
const hero = page.locator("section.hero-navy");
log("hero", `${await hero.locator(".aurora").count()} aurora, ${await hero.locator("canvas.strands").count()} strands | crumbs "${(await hero.locator(".crumbs").textContent()).trim()}" | H1 "${await hero.locator("h1").textContent()}" hl "${await hero.locator(".hl").textContent()}" | ${await page.locator("h1").count()} H1 on page`);
log("hero lede", await hero.locator(".lede").textContent());
const stats = page.locator('section.surface-paper:has([role="group"])');
log("stats", `${(await stats.locator("li").evaluateAll((ls) => ls.map((l) => `${l.querySelector("p").textContent} ${l.querySelectorAll("p")[1].textContent}`))).join(" | ")}`);
log("stats label", `"${await stats.locator("h2").textContent()}" box ${await stats.locator("h2").evaluate((h) => { const r = h.getBoundingClientRect(); return `${Math.round(r.width)}x${Math.round(r.height)}`; })}`);
const story = page.locator('section[aria-labelledby="about-story-h"]');
log("story", `${await sectionBg(page, 'section[aria-labelledby="about-story-h"]')} | linen ${await story.evaluate((s) => getComputedStyle(s, "::after").backgroundImage.startsWith("repeating"))} | photo "${(await story.locator(".illo").innerText()).replace(/\n/g, " / ")}" | h2 "${await story.locator("h2").textContent()}" | ${await story.locator(".list-check li").count()} checks`);
const storyLayout = (p) => p.locator('section[aria-labelledby="about-story-h"]').evaluate((s) => { const a = s.querySelector(".illo").getBoundingClientRect(); const b = s.querySelector("h2").getBoundingClientRect(); return a.top < b.top - 100 && Math.abs(a.left - b.left) < 5 ? "stacked" : "side by side"; });
log("story layout 1280", await storyLayout(page));
const values = page.locator("section#values");
log("values", `label "${await values.locator(".label").textContent()}" | h2 "${await values.locator("h2").textContent()}" | ${(await values.locator(".value").evaluateAll((vs) => vs.map((v) => `${v.querySelector("h3").textContent}${v.classList.contains("feat") ? " [feat]" : ""}${v.querySelector("svg") ? "" : " NO ICON"}`))).join(", ")} | ${await cols(page, ".values")} columns`);
const feat = values.locator(".value.feat");
log("featured cell", await feat.evaluate((f) => `${getComputedStyle(f).backgroundImage.slice(0, 80)} | h3 ${getComputedStyle(f.querySelector("h3")).color}`));
const plain = values.locator(".value").first();
const before = await plain.evaluate((v) => getComputedStyle(v).backgroundColor);
await plain.hover();
await sleep(600);
log("hover a non-featured cell", `${before} -> ${await plain.evaluate((v) => getComputedStyle(v).backgroundColor)} (transition ${await plain.evaluate((v) => getComputedStyle(v).transitionDuration)})`);
await page.mouse.move(0, 0);
await values.screenshot({ path: `${OUT}/values-1280.png` });

// FAQ: mouse, keyboard, two open, the placeholder answer.
const faq = page.locator("section#faq");
const items = faq.locator("details");
log("faq", `h2 "${await faq.locator("h2").textContent()}" | lede "${await faq.locator(".lede").textContent()}" | ${await items.count()} items, open ${await faq.locator("details[open]").count()} | marker "${await items.first().locator("summary").evaluate((s) => getComputedStyle(s, "::after").content)}"`);
const first = items.nth(0);
await first.locator("summary").click();
log("click Q1", `open ${await first.evaluate((d) => d.open)} | marker ${await first.locator("summary").evaluate((s) => getComputedStyle(s, "::after").content)}`);
await first.locator("summary").click();
log("click Q1 again", `open ${await first.evaluate((d) => d.open)}`);
// Reach Q2 by keyboard (Tab from Q1), so :focus-visible applies as for a keyboard user.
await first.locator("summary").focus();
await page.keyboard.press("Tab");
log("Tab to Q2", await page.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return `"${e.textContent}" outline ${c.outlineStyle} ${c.outlineWidth} ${c.outlineColor}, offset ${c.outlineOffset}, focus-visible ${e.matches(":focus-visible")}`; }));
await page.keyboard.press("Enter");
log("Enter on Q2", `open ${await items.nth(1).evaluate((d) => d.open)}`);
await page.keyboard.press("Space");
log("Space on Q2", `open ${await items.nth(1).evaluate((d) => d.open)}`);
await page.keyboard.press("Tab");
log("Tab from Q2", await page.evaluate(() => document.activeElement.textContent));
await page.keyboard.press("Space");
await first.locator("summary").click();
log("two open (Q3 by Space, Q1 by click)", `open: ${(await faq.locator("details[open] summary").allTextContents()).join(" | ")}`);
const security = faq.locator("details", { hasText: "How do you keep our data secure?" });
log("security answer", await security.locator("p").textContent());
await faq.screenshot({ path: `${OUT}/faq-two-open-1280.png` });

// Offices: live clocks, card order, links.
const offices = page.locator('section[aria-labelledby="about-offices-h"]');
log("offices", `${await sectionBg(page, 'section[aria-labelledby="about-offices-h"]')} | h2 "${await offices.locator("h2").textContent()}" | ${(await offices.locator(".office-card").evaluateAll((cs) => cs.map((c) => `${c.querySelector("h3").textContent}${c.querySelector(".office-tag") ? ` (${c.querySelector(".office-tag").textContent})` : ""}: clock "${c.querySelector(".clock").textContent}"`))).join(" | ")}`);
log("office grid 1280", await offices.locator(".offices").evaluate((o) => `${getComputedStyle(o).gridTemplateColumns} | card lefts ${[...o.children].map((x) => Math.round(x.getBoundingClientRect().left)).join(", ")}`));
log("clock style", await offices.locator(".clock").first().evaluate((c) => `${getComputedStyle(c).fontFamily.split(",")[0]} ${getComputedStyle(c).fontSize}`));
await page.clock.runFor(30_000);
await sleep(300);
log("clocks after 30 s", (await offices.locator(".clock").allTextContents()).join(" | "));
log("office links", (await offices.locator(".office-card a").evaluateAll((as) => as.map((a) => `${a.textContent} -> ${a.getAttribute("href")}${a.target ? ` target=${a.target}` : ""}`))).join(" | "));
await offices.screenshot({ path: `${OUT}/offices-1280.png` });

// Capture: copy, then a valid email (POST answered here).
const cap = page.locator("section.capture");
log("capture", `last in main ${await cap.evaluate((c) => !c.nextElementSibling)} | ${await cap.locator("h2").textContent()} | ${await cap.locator(".lede").textContent()} | button "${await cap.locator('button[type="submit"]').textContent()}"`);
await cap.screenshot({ path: `${OUT}/capture-1280.png` });
log("people words in main", await page.locator("main").evaluate((m) => (m.innerText.match(/\b(CEO|CTO|Founder|Director|Leadership|Manager|Mr\.|Ms\.)\b/g) ?? []).join(", ") || "none"));
await page.route("**/api/contact", (route) => route.fulfill({ status: 200, contentType: "application/json", body: '{"ok":true}' }));
await cap.locator("#cap-email").fill("principal@school-example.edu");
await cap.locator("#cap-email").press("Enter");
await page.waitForURL("**/demo#form", { timeout: 10000 });
await sleep(1200);
log("capture valid email", await page.evaluate(() => `url ${location.pathname}${location.hash} | email "${document.getElementById("f-email").value}"`));
await context.close();

// JavaScript off: the zone labels.
const noJs = await open(1280, "/about", { javaScriptEnabled: false });
log("JS off clocks", (await noJs.page.locator(".office-card .clock").allTextContents()).join(" | "));
await noJs.context.close();

// Footer links from Home.
for (const [label, id] of [["Core values", "values"], ["FAQ", "faq"]]) {
  const { page: p, context: c } = await open(1280, "/");
  await p.locator("footer").getByRole("link", { name: label, exact: true }).click();
  await p.waitForURL(`**/about#${id}`);
  await settle(p);
  log(`footer "${label}"`, await landing(p, id));
  await c.close();
}
for (const id of ["values", "faq"]) {
  const { page: p, context: c } = await open(390, `/about#${id}`);
  await settle(p);
  log(`/about#${id} at 390`, await landing(p, id));
  await c.close();
}

// Widths.
for (const width of [900, 899, 640, 390]) {
  const { page: p, context: c } = await open(width);
  log(`width ${width}`, `values ${await cols(p, ".values")} columns | story ${await storyLayout(p)} | offices ${await cols(p, ".offices")} columns | sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth > innerWidth)}`);
  if (width === 390) {
    await p.locator("section#values").screenshot({ path: `${OUT}/values-390.png` });
  }
  await c.close();
}

// Touch: a tap toggles a question.
const touch = await open(390, "/about", { hasTouch: true, isMobile: true });
const q = touch.page.locator("section#faq details").nth(3);
await q.locator("summary").scrollIntoViewIfNeeded();
await q.locator("summary").tap();
log("tap Q4", `open ${await q.evaluate((d) => d.open)}`);
await touch.context.close();

// Reduced motion: no transition, instant anchor jump.
const reduced = await open(390, "/about#faq", { reducedMotion: "reduce" });
log("reduced motion", `scroll-behavior ${await reduced.page.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior)} | value transition ${await reduced.page.locator(".value").first().evaluate((v) => getComputedStyle(v).transitionDuration)} | ${await landing(reduced.page, "faq")}`);
await reduced.context.close();
await browser.close();
