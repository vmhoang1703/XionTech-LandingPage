import { chromium } from "@playwright/test";
const OUT = process.env.OUT;
const b = await chromium.launch({ channel: "chrome", timeout: 120000 });
for (const w of [1280, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, ...(w === 390 ? { hasTouch: true, isMobile: true } : {}) });
  const r = await p.goto("http://localhost:3000/privacy", { waitUntil: "load" });
  await p.waitForTimeout(1000);
  console.log(`[${w}] status ${r.status()} | title "${await p.title()}"`);
  console.log(`[${w}] h1 ${await p.locator("h1").count()} "${(await p.locator("h1").first().innerText()).replace(/\s+/g, " ")}" | h2 in main ${await p.locator("main h2").count()}`);
  console.log(`[${w}] h2 list: ${(await p.locator("main h2").allInnerTexts()).join(" | ")}`);
  console.log(`[${w}] [Placeholder] paragraphs ${await p.locator("main p", { hasText: "[Placeholder]" }).count()} of ${await p.locator("main p").count()}`);
  console.log(`[${w}] header ${await p.locator("header").count()} footer ${await p.locator("footer").count()} capture band ${await p.locator("section.capture").count()}`);
  console.log(`[${w}] no horizontal scroll ${await p.evaluate((x) => document.documentElement.scrollWidth <= x, w)}`);
  const crumb = p.locator("main nav a, main a[href='/']").first();
  if (await crumb.count()) {
    console.log(`[${w}] first main link "${(await crumb.innerText()).trim()}" -> ${await crumb.getAttribute("href")}`);
    if (w === 1280) {
      const before = await crumb.evaluate((el) => getComputedStyle(el).color + " " + getComputedStyle(el).textDecorationLine);
      await crumb.hover(); await p.waitForTimeout(300);
      const after = await crumb.evaluate((el) => getComputedStyle(el).color + " " + getComputedStyle(el).textDecorationLine);
      console.log(`[1280] breadcrumb hover: before "${before}" after "${after}"`);
      await p.keyboard.press("Tab");
      await crumb.focus();
      console.log(`[1280] breadcrumb keyboard focus outline ${await crumb.evaluate((el) => getComputedStyle(el).outlineStyle + " " + getComputedStyle(el).outlineWidth)}`);
      await p.keyboard.press("Enter");
      await p.waitForURL((u) => new URL(u).pathname === "/", { timeout: 15000 });
      console.log(`[1280] Enter on breadcrumb lands ${new URL(p.url()).pathname}`);
    }
  } else console.log(`[${w}] no breadcrumb link in main`);
  if (w === 1280) await p.goto("http://localhost:3000/privacy", { waitUntil: "load" });
  await p.screenshot({ path: `${OUT}/privacy-${w}.png`, fullPage: true });
  if (w === 390) {
    await p.goto("http://localhost:3000/", { waitUntil: "load" }); await p.waitForTimeout(800);
    await p.locator("footer").getByRole("link", { name: /privacy/i }).first().tap();
    await p.waitForURL("**/privacy", { timeout: 15000 });
    console.log(`[390] footer Privacy link tap lands ${new URL(p.url()).pathname}`);
  }
  await p.close();
}
await b.close();
