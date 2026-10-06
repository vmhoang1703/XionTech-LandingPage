// Story 7.4: mobile Lighthouse on the 11 English page types of a running
// production build (`npm run build && npm start`). Saves one JSON report per
// page in `lighthouse-reports/` and exits 1 when a page breaks the budget.
// Usage: node scripts/perf/lighthouse.mjs [baseUrl]   (default http://localhost:3000)
import { mkdir, writeFile } from "node:fs/promises";
import * as chromeLauncher from "chrome-launcher";
import lighthouse from "lighthouse";

const BASE = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const OUT = "lighthouse-reports";

// Budget (SPEC CAP-3, CAP-4). Scores are 0 to 100.
const MIN_SCORE = {
  performance: 90,
  accessibility: 100,
  "best-practices": 95,
  seo: 90,
};
const HOME_VITALS = {
  "largest-contentful-paint": 2500,
  "cumulative-layout-shift": 0.1,
};

/** The first detail link on a list page, read from its HTML. */
async function firstDetail(listPath, prefix) {
  const html = await (await fetch(BASE + listPath)).text();
  const match = html.match(new RegExp(`href="(${prefix}[^"#?]+)"`));
  if (!match) throw new Error(`${listPath} links to no ${prefix} page`);
  return match[1];
}

const pages = [
  ["home", "/"],
  ["products", "/products"],
  ["services", "/services"],
  ["news", "/news"],
  ["news-story", await firstDetail("/news", "/news/")],
  ["about", "/about"],
  ["careers", "/careers"],
  ["job", await firstDetail("/careers", "/careers/")],
  ["demo", "/demo"],
  ["privacy", "/privacy"],
  ["not-found", "/no-such-page"],
];

await mkdir(OUT, { recursive: true });
const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new"] });
const failures = [];
try {
  for (const [name, path] of pages) {
    const { lhr } = await lighthouse(BASE + path, {
      port: chrome.port,
      output: "json",
      logLevel: "error",
    });
    await writeFile(`${OUT}/${name}.json`, JSON.stringify(lhr));
    const scores = Object.fromEntries(
      Object.entries(lhr.categories).map(([id, c]) => [
        id,
        Math.round((c.score ?? 0) * 100),
      ]),
    );
    for (const [id, min] of Object.entries(MIN_SCORE)) {
      if (scores[id] < min) failures.push(`${name}: ${id} ${scores[id]} < ${min}`);
    }
    // CAP-2: no icon set or third-party request blocks render. The site's
    // own CSS file always blocks render and is allowed.
    const blocking = lhr.audits["render-blocking-insight"]?.details?.items ?? [];
    for (const item of blocking.filter((i) => !i.url.startsWith(BASE))) {
      failures.push(`${name}: render-blocking ${item.url}`);
    }
    if (name === "home") {
      for (const [id, max] of Object.entries(HOME_VITALS)) {
        const value = lhr.audits[id].numericValue;
        if (value > max) failures.push(`home: ${id} ${value} > ${max}`);
      }
    }
    console.log(
      `${name.padEnd(11)} ${path.padEnd(40)} ` +
        Object.entries(scores)
          .map(([id, s]) => `${id} ${s}`)
          .join(", ") +
        ` | LCP ${lhr.audits["largest-contentful-paint"].displayValue}` +
        `, TBT ${lhr.audits["total-blocking-time"].displayValue}` +
        `, CLS ${lhr.audits["cumulative-layout-shift"].displayValue}`,
    );
  }
} finally {
  chrome.kill();
}

if (failures.length > 0) {
  console.error(`\nBudget broken:\n${failures.join("\n")}`);
  process.exit(1);
}
console.log("\nAll pages within budget.");
