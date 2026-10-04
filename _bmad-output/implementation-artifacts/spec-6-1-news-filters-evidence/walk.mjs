import { chromium } from "@playwright/test";

const OUT = process.env.OUT;
if (!OUT) throw new Error("Set OUT to the evidence folder");
const BASE = process.env.BASE_URL ?? "http://localhost:3000";
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
const log = (s) => console.log(s);
const css = (l, ps) => l.evaluate((el, ps) => ps.map((p) => getComputedStyle(el)[p]).join(" | "), ps);
const box = (l) =>
  l.evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
  });
const open = async (width, opts = {}) => {
  const ctx = await b.newContext({ viewport: { width, height: 900 }, ...opts });
  const p = await ctx.newPage();
  const r = await p.goto(`${BASE}/news`, { waitUntil: "load" });
  if (!r) throw new Error("No response for /news");
  await p.waitForTimeout(800);
  return { ctx, p, status: r.status() };
};
const titles = (p) => p.locator(".news-grid article h3").allInnerTexts();
const pressed = (p) =>
  p.locator(".filters button").evaluateAll((bs) => bs.map((b) => `${b.textContent}=${b.getAttribute("aria-pressed")}`).join(" "));
const live = (p) => p.locator("[aria-live='polite']").innerText();

try {
  {
    const { ctx, p, status } = await open(1280);
    log(`[1280] GET /news -> ${status}`);
    const hero = p.locator("section.hero-light.page-hero");
    log(`[1280] hero: crumbs "${(await hero.locator(".crumbs").innerText()).replace(/\s+/g, " ")}" | links ${(await hero.locator(".crumbs a").allInnerTexts()).join(",")} | H1 "${await p.locator("h1").innerText()}" | hl "${await p.locator("h1 .hl").innerText()}" | lede "${await hero.locator(".lede").innerText()}"`);
    log(`[1280] chips: group "${await p.locator(".filters").getAttribute("aria-label")}" | ${await pressed(p)}`);
    const active = p.locator('.filters button[aria-pressed="true"]');
    const idle = p.locator('.filters button[aria-pressed="false"]').first();
    log(`[1280] chip styles: active ${await css(active, ["backgroundColor", "color", "borderRadius"])} | idle ${await css(idle, ["backgroundColor", "color", "borderTopColor"])}`);
    const cards = p.locator(".news-grid article");
    log(`[1280] grid: cards ${await cards.count()} | titles [${(await titles(p)).join(" / ")}] | first class "${await cards.first().getAttribute("class")}" | columns ${await p.locator(".news-grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length)}`);
    const feat = await box(cards.first());
    const frame = await box(cards.first().locator(".frame"));
    log(`[1280] feature: card w ${feat.w} | frame x ${frame.x - feat.x} w ${frame.w} h ${frame.h} | title size ${await css(cards.first().locator("h3"), ["fontSize"])} | 2nd card w ${(await box(cards.nth(1))).w}`);
    log(`[1280] live: "${await live(p)}" | aria-live ${await p.locator("[aria-live='polite']").getAttribute("aria-live")}`);
    await p.screenshot({ path: `${OUT}/news-1280.png`, fullPage: true });

    const url = p.url();
    await p.locator(".filters").getByRole("button", { name: "Product" }).click();
    await p.waitForTimeout(300);
    log(`[1280] press Product: url same ${p.url() === url} | ${await pressed(p)} | titles [${(await titles(p)).join(" / ")}] | live "${await live(p)}"`);
    await p.locator(".filters").getByRole("button", { name: "Company" }).click();
    await p.waitForTimeout(300);
    log(`[1280] press Company: titles [${(await titles(p)).join(" / ")}] | live "${await live(p)}"`);
    await p.locator(".filters").getByRole("button", { name: "Company" }).click();
    await p.waitForTimeout(300);
    log(`[1280] press Company again: ${await pressed(p)} | live "${await live(p)}"`);
    await p.locator(".filters").getByRole("button", { name: "Team" }).click();
    await p.waitForTimeout(300);
    const empty = p.locator(".news-empty");
    log(`[1280] press Team: grid ${await p.locator(".news-grid").count()} | empty "${(await empty.innerText()).replace(/\s+/g, " ")}" | border ${await css(empty, ["borderTopStyle"])} | live "${await live(p)}"`);
    await empty.screenshot({ path: `${OUT}/news-empty-1280.png` });
    await p.getByRole("button", { name: "Show all" }).click();
    await p.waitForTimeout(300);
    log(`[1280] Show all: ${await pressed(p)} | cards ${await cards.count()} | focus "${await p.evaluate(() => document.activeElement?.textContent)}" | live "${await live(p)}"`);

    // Keyboard: Tab to a chip, Enter and Space.
    await p.locator(".filters button").first().focus();
    await p.keyboard.press("Tab");
    log(`[1280] Tab -> "${await p.evaluate(() => document.activeElement?.textContent)}" | outline ${await css(p.locator(".filters button").nth(1), ["outlineStyle", "outlineWidth"])}`);
    await p.keyboard.press("Enter");
    await p.waitForTimeout(300);
    log(`[1280] Enter on Product: ${await pressed(p)}`);
    await p.keyboard.press("Tab");
    await p.keyboard.press("Space");
    await p.waitForTimeout(300);
    log(`[1280] Space on Company: ${await pressed(p)}`);
    const read = p.locator(".news-grid a.link-arrow").first();
    await read.focus();
    log(`[1280] Read story focus: outline ${await css(read, ["outlineStyle", "outlineWidth"])} | :focus-visible ${await read.evaluate((el) => el.matches(":focus-visible"))}`);
    await p.locator(".filters").getByRole("button", { name: "Team" }).click();
    await p.getByRole("button", { name: "Show all" }).focus();
    await p.keyboard.press("Tab");
    await p.keyboard.press("Shift+Tab");
    log(`[1280] Show all focus: outline ${await css(p.getByRole("button", { name: "Show all" }), ["outlineStyle", "outlineWidth"])}`);

    log(`[1280] capture band: "${await p.locator("#cap-h").innerText()}" | newsletter ${await p.getByText(/newsletter/i).count()}`);
    await ctx.close();
  }
  for (const w of [900, 640, 390]) {
    const { ctx, p } = await open(w);
    const cards = p.locator(".news-grid article");
    const first = await box(cards.first());
    const grid = await box(p.locator(".news-grid"));
    const sideways = await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
    log(`[${w}] columns ${await p.locator(".news-grid").evaluate((el) => getComputedStyle(el).gridTemplateColumns.split(" ").length)} | feature full width ${Math.abs(first.w - grid.w) <= 1} | no sideways scroll ${sideways}`);
    if (w === 390) await p.screenshot({ path: `${OUT}/news-390.png`, fullPage: true });
    await ctx.close();
  }
  {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
    const p = await ctx.newPage();
    await p.goto(`${BASE}/news`, { waitUntil: "load" });
    log(`[no JS] cards ${await p.locator(".news-grid article").count()} | chips ${await p.locator(".filters button").count()}`);
    await ctx.close();
  }
} finally {
  await b.close();
}
