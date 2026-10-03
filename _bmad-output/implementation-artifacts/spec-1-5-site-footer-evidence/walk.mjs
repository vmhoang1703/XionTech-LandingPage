// Walks every Story 1.5 UX checks line on a running dev server and prints what it observes.
// The footer is not mounted on develop yet (Andy mounts it, T3): for this walk it was mounted
// locally in src/app/layout.tsx and that change was not committed.
// Run from the repo root: BASE=http://localhost:3005 node _bmad-output/implementation-artifacts/spec-1-5-site-footer-evidence/walk.mjs
import { chromium } from "@playwright/test";

const BASE = process.env.BASE ?? "http://localhost:3000";
const OUT = "_bmad-output/implementation-artifacts/spec-1-5-site-footer-evidence";
const browser = await chromium
  .launch()
  .catch(() => chromium.launch({ channel: "chrome" }));
const log = (k, v) => console.log(`${k}: ${v}`);

async function open(width) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(`${BASE}/`, { waitUntil: "load" });
  await page.waitForSelector("footer");
  await page.waitForTimeout(500);
  return page;
}

const links = (page, heading) =>
  page.$$eval(
    `footer h2:text-is("${heading}") + ul a`,
    (as) => as.map((a) => `${a.textContent} -> ${a.getAttribute("href")}`),
  );

const page = await open(1280);
const footer = page.locator("footer");

log("footer background", await footer.evaluate((f) => getComputedStyle(f).backgroundColor));
log("logo plate background", await footer.locator("a").first().evaluate((a) => getComputedStyle(a).backgroundColor));
log("headings", (await footer.locator("h2").allTextContents()).join(" | "));
log("heading colour", await footer.locator("h2").first().evaluate((h) => getComputedStyle(h).color));
log("Products", (await links(page, "Products")).join(", "));
log("Services", (await links(page, "Services")).join(", "));
log("Company", (await links(page, "Company")).join(", "));
log("#updates links", await footer.locator('a[href*="#updates"]').count());

const offices = await footer.locator("address").evaluateAll((as) =>
  as.map((a) => a.innerText.replace(/\n/g, " / ")),
);
log("offices", offices.join("  ||  "));
log("Head office / Da Nang present", /Head office|Da Nang/i.test(offices.join(" ")));

const contact = await footer.locator("address a").evaluateAll((as) =>
  as.map((a) => ({
    href: a.getAttribute("href"),
    target: a.getAttribute("target"),
    rel: a.getAttribute("rel"),
    name: a.getAttribute("aria-label") ?? a.textContent,
  })),
);
for (const c of contact) log("contact", JSON.stringify(c));

const first = footer.locator("ul a").first();
const before = await first.evaluate((a) => getComputedStyle(a).color);
await first.hover();
await page.waitForTimeout(200);
log("hover colour", `${before} -> ${await first.evaluate((a) => getComputedStyle(a).color)}`);

// Tab into the footer from the last element before it.
await page.locator("footer a").first().focus();
await page.keyboard.press("Shift+Tab");
const focusOrder = [];
for (let i = 0; i < 6; i++) {
  await page.keyboard.press("Tab");
  focusOrder.push(
    await page.evaluate(() => {
      const el = document.activeElement;
      const s = getComputedStyle(el);
      return `${el.textContent?.trim() || el.getAttribute("aria-label")} [outline ${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}]`;
    }),
  );
}
log("Tab order + focus ring", focusOrder.join("  >  "));

log("bottom bar", (await footer.locator("div").last().innerText()).replace(/\n/g, " "));
log("DONE colour", await footer.locator("b", { hasText: "DONE" }).evaluate((b) => getComputedStyle(b).color));
log("privacy href", await footer.getByRole("link", { name: "Privacy policy" }).getAttribute("href"));

const heights = await footer.locator("a").evaluateAll((as) =>
  as.map((a) => Math.round(a.getBoundingClientRect().height)),
);
log("smallest link height px", Math.min(...heights));

await footer.screenshot({ path: `${OUT}/footer-1280.png` });
await page.close();

for (const width of [1280, 899, 639, 390]) {
  const p = await open(width);
  const cols = await p
    .locator("footer > div > div")
    .first()
    .evaluate((g) => getComputedStyle(g).gridTemplateColumns.split(" ").length);
  const sideways = await p.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth,
  );
  log(`layout ${width}px`, `${cols} columns, sideways scroll: ${sideways}`);
  if (width !== 1280) await p.locator("footer").screenshot({ path: `${OUT}/footer-${width}.png` });
  await p.close();
}

await browser.close();
