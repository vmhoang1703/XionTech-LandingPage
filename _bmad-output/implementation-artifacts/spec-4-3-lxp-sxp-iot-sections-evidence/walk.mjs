import { chromium } from "@playwright/test";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const settle = (p) => p.waitForTimeout(1200);
const box = (loc) =>
  loc.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  });
const css = (loc, props) => loc.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), props);
const cols = (loc) => loc.evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length);
const noSideways = (p) => p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
const IDS = ["lxp", "sxp", "iot"];

try {
  // 1280: surfaces, layout, pills, headings after a jump
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    const r = await p.goto(`${BASE}/products`, { waitUntil: "load" });
    if (!r) throw new Error("No response for /products");
    await settle(p);
    for (const id of IDS) {
      const s = p.locator(`section#${id}`);
      const h2 = s.locator("h2");
      log(`[1280] #${id}: class "${await s.getAttribute("class")}" | bg ${await css(s, ["backgroundImage"]).then((v) => v.slice(0, 40))} | H2 "${(await h2.innerText()).trim()}" color ${await css(h2, ["color"])}`);
    }
    const sxpFrame = await box(p.locator("section#sxp .browser"));
    const sxpH2 = await box(p.locator("section#sxp h2"));
    log(`[1280] #sxp frame x ${sxpFrame.x} | text x ${sxpH2.x} | frame left of text ${sxpFrame.x < sxpH2.x}`);
    log(`[1280] #lxp feature columns ${await cols(p.locator("section#lxp .feature-list"))} | #iot card columns ${await cols(p.locator("section#iot .svc-grid"))}`);
    // URL pills
    const pills = p.locator(".browser .bar-url");
    log(`[1280] URL pills: ${await pills.evaluateAll((els) => els.map((el) => `${el.tagName.toLowerCase()} aria-disabled=${el.getAttribute("aria-disabled")} href=${el.getAttribute("href")} "${el.textContent.trim()}"`).join(" ; "))}`);
    const pill = pills.first();
    await pill.scrollIntoViewIfNeeded();
    await p.mouse.move(0, 0);
    await p.waitForTimeout(400);
    await pill.hover();
    await p.waitForTimeout(400);
    log(`[1280] pill hover: ${await css(pill, ["cursor", "textDecorationLine"])} | height ${(await box(pill)).h}px`);
    const y0 = await p.evaluate(() => window.scrollY);
    const before = ctx.pages().length;
    await pill.click();
    await p.waitForTimeout(1000);
    log(`[1280] pill click: new tabs ${ctx.pages().length - before} | url ${new URL(p.url()).pathname}${new URL(p.url()).hash} | scrollY ${y0} -> ${await p.evaluate(() => window.scrollY)}`);
    const focusable = await p.evaluate(() => [...document.querySelectorAll(".browser .bar-url")].filter((el) => el.tabIndex >= 0).length);
    log(`[1280] pills in the Tab order: ${focusable}`);
    // Headings after a jump: sub-nav pill, direct URL
    for (const id of IDS) {
      await p.locator(`nav.subnav a[href="#${id}"]`).click();
      await settle(p);
      const max = await p.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      log(`[1280] sub-nav ${id}: section top ${(await box(p.locator(`section#${id}`))).y} | H2 top ${(await box(p.locator(`section#${id} h2`))).y} | scrollY ${await p.evaluate(() => Math.round(window.scrollY))} of max ${max}`);
    }
    for (const id of IDS) {
      await p.goto(`${BASE}/products#${id}`, { waitUntil: "load" });
      await settle(p);
      log(`[1280] direct #${id}: section top ${(await box(p.locator(`section#${id}`))).y} | H2 top ${(await box(p.locator(`section#${id} h2`))).y}`);
    }
    await p.goto(`${BASE}/`, { waitUntil: "load" });
    await settle(p);
    await p.locator("header").getByRole("button", { name: "Products" }).click();
    await p.locator('header a[href="/products#sxp"]').first().click();
    await p.waitForURL("**/products#sxp", { timeout: 20000 });
    await settle(p);
    log(`[1280] mega menu SXP from /: section top ${(await box(p.locator("section#sxp"))).y} | H2 top ${(await box(p.locator("section#sxp h2"))).y}`);
    await p.goto(`${BASE}/products#lxp`, { waitUntil: "load" });
    await settle(p);
    await p.screenshot({ path: `${OUT}/lxp-1280.png` });
    await p.goto(`${BASE}/products#sxp`, { waitUntil: "load" });
    await settle(p);
    await p.screenshot({ path: `${OUT}/sxp-1280.png` });
    await p.goto(`${BASE}/products#iot`, { waitUntil: "load" });
    await settle(p);
    await p.screenshot({ path: `${OUT}/iot-1280.png` });
    await ctx.close();
  }

  // Widths: columns, order, sideways scroll
  for (const w of [1080, 900, 899, 641, 640, 390, 320]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(`${BASE}/products`, { waitUntil: "load" });
    await settle(p);
    const sf = await box(p.locator("section#sxp .browser"));
    const sh = await box(p.locator("section#sxp h2"));
    const pill = await box(p.locator("section#lxp .bar-url"));
    const frame = await box(p.locator("section#lxp .browser"));
    const ellipsis = await p.locator("section#lxp .bar-url").evaluate((el) => el.scrollWidth > el.clientWidth && getComputedStyle(el).textOverflow === "ellipsis");
    log(`[${w}] lxp features ${await cols(p.locator("section#lxp .feature-list"))} col | iot cards ${await cols(p.locator("section#iot .svc-grid"))} col | sxp text first ${sh.y < sf.y} | lxp pill ${pill.w}x${pill.h} ellipsis ${ellipsis} | frame width ${frame.w} | no sideways scroll ${await noSideways(p)}`);
    if (w === 390) {
      await p.setViewportSize({ width: 390, height: 844 });
      await p.goto(`${BASE}/products#iot`, { waitUntil: "load" });
      await settle(p);
      log(`[390] direct #iot: section top ${(await box(p.locator("section#iot"))).y} | H2 top ${(await box(p.locator("section#iot h2"))).y}`);
      await p.screenshot({ path: `${OUT}/products-390.png`, fullPage: true });
    }
    await p.close();
  }

  // Touch tap on a pill at 390
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/products#lxp`, { waitUntil: "load" });
    await settle(p);
    const before = ctx.pages().length;
    await p.locator("section#lxp .bar-url").tap();
    await p.waitForTimeout(1000);
    log(`[390] pill tap: new tabs ${ctx.pages().length - before} | url ${new URL(p.url()).pathname}${new URL(p.url()).hash}`);
    await ctx.close();
  }
} finally {
  await b.close();
}
