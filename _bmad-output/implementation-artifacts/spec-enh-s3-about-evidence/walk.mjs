// Walks the E-S3 UX checks on /about and prints what it observes.
// POST /api/contact is answered by the walk (200), so no real mail is sent.
// BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-enh-s3-about-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-enh-s3-about-evidence";
const browser = await chromium.launch({ channel: "chrome" });
const log = (k, v) => console.log(`${k}: ${v}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(width, path = "/about", options = {}) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, ...options });
  const page = await context.newPage();
  await page.route("**/api/contact", (r) => r.fulfill({ status: 200, body: "{}" }));
  await page.goto(`${BASE}${path}`, { waitUntil: "load" });
  await sleep(500);
  return { page, context };
}
async function settle(page) {
  const readings = [];
  for (let i = 0; i < 60; i++) {
    readings.push(await page.evaluate(() => scrollY));
    const last = readings.slice(-3);
    if (readings.at(-1) > 0 && last.length === 3 && new Set(last).size === 1) return;
    await sleep(120);
  }
}

{ const { page, context } = await open(1280);
  log("title", await page.title());
  log("sections", (await page.locator("main > section").evaluateAll((ss) => ss.map((s) => s.id || s.querySelector("h1,h2")?.textContent.trim().slice(0, 30)))).join(" > "));
  log("H1", await page.locator("h1").evaluate((h) => `"${h.textContent.trim()}" | ${document.querySelectorAll("h1").length} H1 | accent "${h.querySelector(".ah-accent")?.textContent}" colour ${getComputedStyle(h.querySelector(".ah-accent")).color} underline ${getComputedStyle(h.querySelector(".ah-accent")).textDecorationLine} | centred ${getComputedStyle(h).textAlign}`));
  log("intro", await page.locator("#mission").evaluate((s) => `crumbs ${s.querySelectorAll(".crumbs").length} | peaks svg ${s.querySelectorAll("svg").length} | links ${[...s.querySelectorAll("a")].map((a) => `${a.textContent.trim()} -> ${a.getAttribute("href")}`).join(", ")}`));
  log("story", await page.locator("#story").evaluate((s) => `h2 "${s.querySelector("h2").textContent.trim()}" | chapters ${[...s.querySelectorAll("h3")].map((h) => h.textContent.trim()).join(" / ")} | images ${s.querySelectorAll("img").length} | placeholder first ${/\[Placeholder\]/.test(s.textContent)} | close "${[...s.querySelectorAll("p")].slice(-2).map((p) => p.textContent.trim()).join(" | ")}"`));
  log("removed", `values ${await page.locator("#values").count()} | stats ${await page.locator('[role="group"]').count()} | Two strengths ${(await page.content()).includes("Two strengths")}`);
  const faq = page.locator("#faq");
  log("faq", await faq.evaluate((s) => { const g = s.querySelector(".faq"); return `h2 "${s.querySelector("h2").textContent}" | ${s.querySelectorAll("details").length} details, open ${s.querySelectorAll("details[open]").length} | cols ${getComputedStyle(g).gridTemplateColumns.split(" ").length} gap ${getComputedStyle(g).columnGap} | Q1 "${s.querySelector("summary").textContent.trim()}" | security placeholder ${[...s.querySelectorAll("details")].some((d) => /\[Placeholder\]/.test(d.textContent))}`; }));
  const sum = faq.locator("summary").first();
  await sum.hover(); await sleep(250);
  log("faq hover", await sum.evaluate((e) => `colour ${getComputedStyle(e).color} | marker ${getComputedStyle(e, "::after").content}`));
  await sum.focus(); await page.keyboard.press("Enter"); await sleep(250);
  log("faq Enter", await sum.evaluate((e) => `open ${e.parentElement.open} | marker ${getComputedStyle(e, "::after").content} | outline ${getComputedStyle(e).outlineStyle}`));
  const ask = faq.locator(".faq-ask");
  log("ask", await ask.evaluate((a) => `"${a.textContent.trim()}" -> ${a.getAttribute("href")} | height ${Math.round(a.getBoundingClientRect().height)} | decoration ${getComputedStyle(a).textDecorationLine}`));
  await faq.screenshot({ path: `${OUT}/about-1280-faq.png` });
  log("offices", await page.locator("#offices").evaluate((s) => { const g = s.querySelector(".offices"); const cards = [...s.querySelectorAll(".office-card")]; return `bg ${getComputedStyle(s).backgroundColor} | cols ${getComputedStyle(g).gridTemplateColumns} | ${cards.map((c) => `[${c.querySelector("h3").textContent} · ${c.querySelector(".office-tag")?.textContent} · clock "${c.querySelector(".clock")?.textContent.trim()}" · icons ${c.querySelectorAll("svg").length} · ${[...c.querySelectorAll("a")].map((a) => `${a.textContent.trim()}${a.target ? " (new tab)" : ""}`).join(", ")}]`).join(" ")}`; }));
  log("vietnam email", (await page.locator("#offices").textContent()).includes("xiontechs.com"));
  await page.locator("#offices").screenshot({ path: `${OUT}/about-1280-offices.png` });
  log("book", await page.locator("#book").evaluate((s) => `h2 "${s.querySelector("h2").textContent}" | lede "${s.querySelector("p")?.textContent.trim()}" | bg ${getComputedStyle(s).backgroundColor}`));
  log("sideways 1280", await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await page.evaluate(() => scrollTo(0, 0)); await sleep(300);
  await page.screenshot({ path: `${OUT}/about-1280-top.png` });
  await page.screenshot({ path: `${OUT}/about-1280-full.png`, fullPage: true });
  await context.close(); }

{ const { page, context } = await open(760);
  log("faq cols 760", await page.locator(".faq").evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length));
  await context.close(); }
{ const { page, context } = await open(390, "/about", { hasTouch: true, isMobile: true });
  log("offices 390", await page.locator(".offices").evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length));
  const s = page.locator(".faq summary").first(); await s.scrollIntoViewIfNeeded(); await s.tap(); await sleep(300);
  log("faq tap", await s.evaluate((e) => e.parentElement.open));
  log("sideways 390", await page.evaluate(() => document.documentElement.scrollWidth > innerWidth));
  await page.screenshot({ path: `${OUT}/about-390-full.png`, fullPage: true });
  await context.close(); }
for (const id of ["faq", "book"]) {
  const { page, context } = await open(1280, `/about#${id}`);
  await settle(page);
  log(`#${id} lands`, await page.evaluate((id) => { const h = document.querySelector(`#${id} h2`).getBoundingClientRect(); const hb = document.querySelector("header").getBoundingClientRect().bottom; return `h2 ${Math.round(h.top)}-${Math.round(h.bottom)} header ${Math.round(hb)} visible ${h.top >= hb && h.bottom <= innerHeight}`; }, id));
  await context.close();
}
{ const { page, context } = await open(1280);
  await page.locator(".faq-ask").click(); await page.waitForURL("**/#contact"); await sleep(400); await settle(page);
  log("Ask us directly lands", await page.evaluate(() => `${location.pathname}${location.hash} | contact heading visible ${(() => { const r = document.querySelector("#contact h2").getBoundingClientRect(); return r.top >= 0 && r.bottom <= innerHeight; })()}`));
  await context.close(); }
await browser.close();
