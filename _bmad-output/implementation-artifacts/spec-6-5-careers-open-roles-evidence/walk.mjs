import { chromium } from "@playwright/test";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const settle = (p) => p.waitForTimeout(1200);
const css = (loc, props) => loc.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), props);
const cols = (loc) => loc.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
const box = (loc) =>
  loc.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  });
const noSideways = (p) => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

try {
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    const r = await p.goto(`${BASE}/careers`, { waitUntil: "load" });
    if (!r) throw new Error("No response for /careers");
    await settle(p);
    log(`[1280] status ${r.status()} | title "${await p.title()}"`);
    const h1 = p.locator("h1");
    log(`[1280] H1 "${(await h1.innerText()).replace(/\s+/g, " ")}" | highlight "${await p.locator("h1 .hl").innerText().catch(() => "none")}" | crumbs "${(await p.locator(".crumbs").innerText()).replace(/\s+/g, " ")}"`);
    log(`[1280] hero class "${await p.locator("main section").first().getAttribute("class")}" | ribbon svg ${await p.locator("main section").first().locator("svg").count()}`);
    log(`[1280] h2 list: ${(await p.locator("main h2").allInnerTexts()).join(" | ")}`);
    // Hero buttons
    const roles = p.locator("main").getByRole("link", { name: /See open roles/ });
    const life = p.locator("main").getByRole("link", { name: /Life at XionTech/ }).first();
    log(`[1280] See open roles: href ${await roles.getAttribute("href")} class "${await roles.getAttribute("class")}" | Life: href ${await life.getAttribute("href")} class "${await life.getAttribute("class")}"`);
    await roles.hover();
    await p.waitForTimeout(600);
    log(`[1280] See open roles hover: transform ${await css(roles, ["transform"])} | transition ${await css(roles, ["transitionDuration"])}`);
    await p.mouse.move(0, 0);
    await roles.click();
    await settle(p);
    log(`[1280] click See open roles: hash ${new URL(p.url()).hash} | #roles top ${(await box(p.locator("#roles"))).y}`);
    await p.goto(`${BASE}/careers`, { waitUntil: "load" });
    await settle(p);
    await life.focus();
    await p.keyboard.press("Enter");
    await settle(p);
    log(`[1280] Enter on Life at XionTech: hash ${new URL(p.url()).hash} | #life top ${(await box(p.locator("#life"))).y}`);
    // Sections
    const culture = p.locator("section").filter({ has: p.locator("h2", { hasText: "A culture" }) });
    log(`[1280] culture class "${await culture.getAttribute("class")}" | check bullets ${await culture.locator(".list-check li").count()} | photo frame "${(await culture.locator(".illo").innerText()).trim()}"`);
    const benefits = p.locator("section").filter({ has: p.locator("h2", { hasText: "Why you" }) });
    log(`[1280] benefits class "${await benefits.getAttribute("class")}" | cards ${await benefits.locator(".svc-grid > *").count()} | columns ${await cols(benefits.locator(".svc-grid"))} | card classes ${(await benefits.locator(".svc-grid > *").evaluateAll((els) => els.map((e) => e.className))).join(" ; ")}`);
    const rolesSec = p.locator("#roles");
    log(`[1280] #roles: cards ${await rolesSec.locator(".role").count()} | empty panel "${(await rolesSec.locator(".roles-empty").innerText().catch(() => "none")).trim()}"`);
    const lifeSec = p.locator("#life");
    log(`[1280] #life class "${await lifeSec.getAttribute("class")}" | frames ${await lifeSec.locator(".spot").count()} | captions ${(await lifeSec.locator(".spot").allInnerTexts()).map((s) => s.trim()).join(" | ")} | columns ${await cols(lifeSec.locator(".news-grid"))} | links inside ${await lifeSec.locator("a").count()}`);
    const r43 = await lifeSec.locator(".spot").first().evaluate((el) => (el.getBoundingClientRect().width / el.getBoundingClientRect().height).toFixed(2));
    log(`[1280] life frame ratio ${r43}`);
    // End of page
    const after = await p.evaluate(() => {
      const main = document.querySelector("main");
      const last = main.lastElementChild;
      return `last section in main #${last.id || last.tagName} | next after main: ${main.nextElementSibling?.tagName} | capture band ${document.querySelectorAll("section.capture").length}`;
    });
    log(`[1280] ${after}`);
    // Contrast of the amber-hero lede
    const contrast = await p.evaluate(() => {
      const parse = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
      const lum = ([r, g, b2]) => {
        const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b2);
      };
      const lede = document.querySelector("main section .lede");
      const fg = parse(getComputedStyle(lede).color);
      const amber = [255, 192, 0];
      const L1 = lum(fg), L2 = lum(amber);
      return `lede ${getComputedStyle(lede).color} on amber #FFC000: ${((Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05)).toFixed(2)}:1`;
    });
    log(`[1280] contrast ${contrast}`);
    await p.goto(`${BASE}/careers`, { waitUntil: "load" });
    await settle(p);
    await p.screenshot({ path: `${OUT}/careers-1280.png`, fullPage: true });
    await ctx.close();
  }
  // Widths
  for (const w of [1280, 1080, 900, 899, 640, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(`${BASE}/careers`, { waitUntil: "load" });
    await settle(p);
    const culture = p.locator("section").filter({ has: p.locator("h2", { hasText: "A culture" }) });
    const text = await box(culture.locator("h2"));
    const photo = await box(culture.locator(".illo"));
    const benefits = p.locator("section").filter({ has: p.locator("h2", { hasText: "Why you" }) });
    log(`[${w}] culture stacked ${photo.y >= text.y + text.h} | benefits columns ${await cols(benefits.locator(".svc-grid"))} | life columns ${await cols(p.locator("#life .news-grid"))} | no sideways scroll ${await noSideways(p)}`);
    const clip = await p.locator("#life .spot").first().evaluate((spot) => {
      const s = spot.getBoundingClientRect();
      const cap = spot.querySelector("b").getBoundingClientRect();
      const illo = spot.querySelector(".illo").getBoundingClientRect();
      return `frame ${Math.round(s.width)}x${Math.round(s.height)} | inner bottom ${Math.round(illo.bottom - s.bottom)}px past frame | caption inside ${cap.bottom <= s.bottom && cap.top >= s.top}`;
    });
    log(`[${w}] life ${clip}`);
    if (w === 390) await p.screenshot({ path: `${OUT}/careers-390.png`, fullPage: true });
    await p.close();
  }
  // Touch press on a hero button and reduced motion
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/careers`, { waitUntil: "load" });
    await settle(p);
    const btn = p.locator("main").getByRole("link", { name: /See open roles/ });
    log(`[1280 reduced] hero button transition ${await css(btn, ["transitionDuration"])} | ribbon animations running ${await p.evaluate(() => document.getAnimations().filter((a) => a.playState === "running").length)}`);
    await ctx.close();
  }
} finally {
  await b.close();
}
