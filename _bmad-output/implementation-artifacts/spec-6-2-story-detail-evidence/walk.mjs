import { chromium } from "@playwright/test";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const css = (l, ps) => l.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), ps);
const text = (l) => l.innerText().then((t) => t.replace(/\s+/g, " ").trim());

try {
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/news`, { waitUntil: "load" });
    await p.locator(".news-grid article").first().locator("a.link-arrow").click();
    await p.waitForURL(/\/news\/[^/]+$/);
    await p.locator("#story-h1").waitFor();
    await p.waitForTimeout(800);
    const path = new URL(p.url()).pathname;
    log(`[1280] News first Read story lands ${path} | tab title "${await p.title()}"`);
    const crumbs = p.locator(".crumbs");
    log(`[1280] crumbs "${await text(crumbs)}" | links [${(await crumbs.locator("a").evaluateAll((as) => as.map((a) => `${a.textContent}=${a.getAttribute("href")}`))).join(", ")}] | current "${await crumbs.locator('[aria-current="page"]').innerText()}"`);
    log(`[1280] H1 "${await p.locator("h1").innerText()}" | date "${await p.locator("main time").first().innerText()}" font ${(await css(p.locator("main time").first(), ["fontFamily"])).slice(0, 40)} | tag "${await p.locator("main .cat").first().innerText()}" bg ${await css(p.locator("main .cat").first(), ["backgroundColor"])}`);
    const media = p.locator(".story-media");
    const r = await media.evaluate((el) => el.getBoundingClientRect());
    log(`[1280] frame ${Math.round(r.width)}x${Math.round(r.height)} ratio ${(r.width / r.height).toFixed(2)} | column ${await css(p.locator("section[aria-label='Story'] .story-body"), ["maxWidth"])}`);
    log(`[1280] body paragraphs ${await p.locator(".story-body > p").count()} | h2 ${await p.locator(".story-body > h2").count()} | first "${(await p.locator(".story-body > p").first().innerText()).slice(0, 60)}"`);
    const buttons = await p.locator("section[aria-label='Story'] a.btn").evaluateAll((as) => as.map((a) => `${a.textContent.trim()}=${a.getAttribute("href")}`));
    log(`[1280] buttons [${buttons.join(", ")}] | capture band ${await p.locator("#cap-h").count()}`);
    const see = p.locator("section[aria-label='Story'] a.btn").first();
    // Tab from the top until "See PXP" has focus (keyboard focus, not .focus()).
    for (let i = 0; i < 40 && !(await see.evaluate((el) => el === document.activeElement)); i++) {
      await p.keyboard.press("Tab");
    }
    log(`[1280] button focus: outline ${await css(see, ["outlineStyle", "outlineWidth"])} | :focus-visible ${await see.evaluate((el) => el.matches(":focus-visible"))}`);
    await p.screenshot({ path: `${OUT}/story-1280.png`, fullPage: true });
    await p.getByRole("link", { name: "See PXP" }).click();
    await p.waitForURL(/\/products/);
    log(`[1280] See PXP lands ${new URL(p.url()).pathname}${new URL(p.url()).hash}`);
    await p.goBack();
    await p.locator("#story-h1").waitFor();
    await p.getByRole("link", { name: "Back to News" }).click();
    await p.waitForURL(/\/news$/);
    log(`[1280] Back to News lands ${new URL(p.url()).pathname}`);

    // A non-product story: the Company card.
    await p.locator(".filters").getByRole("button", { name: "Company" }).click();
    await p.locator(".news-grid article a.link-arrow").first().click();
    await p.waitForURL(/\/news\/[^/]+$/);
    await p.locator("#story-h1").waitFor();
    log(`[1280] Company story ${new URL(p.url()).pathname} | tag "${await p.locator("main .cat").first().innerText()}" | buttons [${(await p.locator("section[aria-label='Story'] a.btn").allInnerTexts()).map((t) => t.trim()).join(", ")}]`);

    // Home: the news card link.
    await p.goto(`${BASE}/`, { waitUntil: "load" });
    await p.locator("section[aria-labelledby='news-h'] article a.link-arrow").first().click();
    await p.waitForURL(/\/news\/[^/]+$/);
    await p.locator("#story-h1").waitFor();
    log(`[1280] Home Read story lands ${new URL(p.url()).pathname} | H1 "${await p.locator("h1").innerText()}"`);
    await ctx.close();
  }
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } });
    const p = await ctx.newPage();
    const r = await p.goto(`${BASE}/news/no-such-story`, { waitUntil: "load" });
    log(`[404] /news/no-such-story -> ${r?.status()} | h1 "${await p.locator("h1").innerText()}"`);
    await ctx.close();
  }
  {
    const ctx = await b.newContext({ viewport: { width: 390, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/news`, { waitUntil: "load" });
    const href = await p.locator(".news-grid article a.link-arrow").first().getAttribute("href");
    await p.goto(`${BASE}${href}`, { waitUntil: "load" });
    await p.waitForTimeout(500);
    log(`[390] no sideways scroll ${await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)}`);
    await p.screenshot({ path: `${OUT}/story-390.png`, fullPage: true });
    await ctx.close();
  }
} finally {
  await b.close();
}
