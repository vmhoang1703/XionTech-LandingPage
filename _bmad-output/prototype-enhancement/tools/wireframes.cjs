// Whole-page text wireframes: one frame per page, sections stacked as blocks, columns and card grids side by side.
// Run from anywhere (paths are resolved from this file):
//   node _bmad-output/prototype-enhancement/tools/wireframes.cjs final --out _bmad-output/prototype-enhancement/wireframes-final.md
//   node _bmad-output/prototype-enhancement/tools/wireframes.cjs original <first-draft folder> --source "<commit>" --out _bmad-output/prototype-enhancement/wireframes-original.md
const fs = require("fs");
const { JSDOM } = require("jsdom");
const path = require("path");
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args.splice(i, 2)[1] : undefined;
};
const OUT = flag("--out"),
  SOURCE = flag("--source");
const MODE = args[0];
const USAGE =
  'usage: node wireframes.cjs final [--out file]\n       node wireframes.cjs original <first-draft folder> --source "<where it came from>" [--out file]';
if (!["original", "final"].includes(MODE)) {
  console.error(USAGE);
  process.exit(1);
}
if (MODE === "original" && (!args[1] || !SOURCE)) {
  console.error(
    "original mode needs the first-draft folder and --source\n" + USAGE,
  );
  process.exit(1);
}
const DIR =
  (MODE === "original"
    ? path.resolve(args[1])
    : path.resolve(__dirname, "../prototype")
  ).replace(/\\/g, "/") + "/";
const CH = MODE === "final" ? require("./wireframe-changes.cjs") : null;
const PAGE_W = 104; // inner width of a page frame
const SEC_W = PAGE_W; // outer width of a section block
const MIN_COL = 24;

const PAGES = [
  ["index.html", "Home"],
  ["products.html", "Products"],
  ["services.html", "Services"],
  ["about.html", "About"],
  ["news.html", "News"],
  ["news-story.html", "News story"],
  ["careers.html", "Careers"],
  ["job.html", "Job"],
  ["demo.html", "Contact"],
  ["privacy.html", "Privacy policy"],
  ["404.html", "Not found (404)"],
];
// layout classes that place their children side by side, with their column count on desktop
const GRID = {
  "home-grid": 2,
  "doors-grid": 2,
  stats: 5,
  "svc-grid": 4,
  flow: 4,
  values: 3,
  "news-grid": 3,
  "cap-grid": 2,
  fgrid2: 2,
  split: 2,
  offices: 2,
  "feature-list": 2,
  why: 2,
  "app-strip": 4,
  "contact-grid": 2,
  fgrid: 5,
  mega: 2,
  "proof-grid": 3,
  why2: 2,
  "case-grid": 3,
  bento: 2,
};
const BLOCK = new Set([
  "DIV",
  "P",
  "UL",
  "OL",
  "LI",
  "H1",
  "H2",
  "H3",
  "H4",
  "SECTION",
  "ARTICLE",
  "A",
  "BUTTON",
  "FORM",
  "IMG",
  "CANVAS",
  "FIGURE",
  "LABEL",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "TABLE",
  "FIELDSET",
  "NAV",
  "ADDRESS",
  "DETAILS",
  "SUMMARY",
  "HEADER",
  "FOOTER",
  "TR",
  "BLOCKQUOTE",
]);
const SEP = new Set(["STRONG", "SMALL", "B", "SPAN"]);
const clean = (t) => (t || "").replace(/\s+/g, " ").trim();
function textOf(el) {
  const parts = [];
  for (const n of el.childNodes) {
    if (n.nodeType === 3) {
      parts.push(n.textContent);
      continue;
    }
    if (
      n.nodeType !== 1 ||
      n.getAttribute("aria-hidden") === "true" ||
      n.classList.contains("sr-only")
    )
      continue;
    const t = textOf(n);
    if (!t) continue;
    if (SEP.has(n.tagName) && clean(parts.join(""))) parts.push(" · ");
    parts.push(t);
  }
  return clean(parts.join(""))
    .replace(/\s*·\s*(·\s*)+/g, " · ")
    .replace(/\s*·\s*$/, "");
}
const href = (a) => {
  const h = a.getAttribute("href") || "";
  return h ? " → " + h : "";
};
const gridCols = (el) => {
  for (const k of Object.keys(GRID))
    if (el.classList.contains(k))
      return el.classList.contains("cols-4") ? 4 : GRID[k];
  return 0;
};
const surface = (el) => {
  const c = el.className || "",
    s = [];
  if (/hero-silk/.test(c)) s.push("dark hero, animated silk");
  else if (/hero-navy/.test(c)) s.push("navy hero");
  else if (/hero-amber/.test(c)) s.push("amber hero");
  else if (/hero-light/.test(c)) s.push("light hero");
  else if (/s-navy/.test(c)) s.push("navy");
  else if (/s-amber/.test(c)) s.push("amber");
  else if (/s-mist/.test(c)) s.push("light blue");
  else if (/s-paper/.test(c)) s.push("white");
  if (/gridbg/.test(c)) s.push("grid texture");
  if (/linen/.test(c)) s.push("linen");
  return s.join(", ");
};
const tabOf = (el, doc) => {
  const t = el.closest("[data-for]");
  const b = t && doc.querySelector(`[role=tab][data-type="${t.dataset.for}"]`);
  return b ? "; " + clean(b.textContent) + " tab only" : "";
};

function walk(el, out, doc) {
  if (el.nodeType !== 1) return;
  const tag = el.tagName,
    c = typeof el.className === "string" ? el.className : "";
  if (el.hidden && !el.matches("[data-for]")) return;
  if (/(^|\s)(track|art|notch|silk-fallback|dots|orb|go)(\s|$)/.test(c)) return;
  if (/\blogo-marquee\b/.test(c))
    out.push(
      "[ANIMATION: logos scroll right to left in a loop; hover, focus or tap pauses]",
    );
  if (
    /\bw-industry-row\b/.test(c) &&
    el.querySelector(".w-chip") &&
    el.querySelector(".w-more-trigger")
  ) {
    out.push(
      "Chips: " +
        clean(el.querySelector(".w-chip").textContent) +
        " · [BUTTON: " +
        clean(el.querySelector(".w-more-trigger").textContent) +
        "]",
    );
    out.push(
      "[ON HOVER OR FOCUS OF +3: " +
        [...el.querySelectorAll(".w-more-list .w-chip")]
          .map((x) => clean(x.textContent))
          .join(" · ") +
        " slide out on the same line]",
    );
    return;
  }
  if (/\bw-more-list\b/.test(c)) {
    out.push(
      "[ON HOVER OR FOCUS OF +3: " +
        [...el.querySelectorAll(".w-chip")]
          .map((x) => clean(x.textContent))
          .join(" · ") +
        "]",
    );
    return;
  }
  if (
    ["SCRIPT", "TEMPLATE", "STYLE"].includes(tag) ||
    (tag === "I" && /\bph\b/.test(c))
  )
    return;
  if (/\bslot\b/.test(c)) {
    out.push(
      `[IMAGE: ${el.dataset.hint || "image"}${el.dataset.size ? " · " + el.dataset.size : ""}]`,
    );
    return;
  }
  if (tag === "CANVAS") {
    out.push(
      /silk/.test(c)
        ? "[BACKGROUND: animated silk (WebGL)]"
        : "[BACKGROUND: animated strands]",
    );
    return;
  }
  if (el.hasAttribute("data-news")) {
    const n = +el.dataset.limit || 3,
      card = [
        "[IMAGE: story photo]",
        "Category · date",
        "H3: story title",
        "Text: summary",
        "[LINK: Read more → story]",
      ];
    out.push({
      cols: 3,
      cells: Array.from({ length: Math.min(n, 3) }, () => card.slice()),
    });
    if (!el.dataset.limit) out.push("(more cards follow, from the news list)");
    return;
  }
  if (/\bcode-win\b/.test(c)) {
    out.push("[GRAPHIC: code window]");
    return;
  }
  const cols = gridCols(el);
  if (cols) {
    const cells = [...el.children]
      .map((ch) => {
        const o = [];
        walk(ch, o, doc);
        return o;
      })
      .filter((o) => o.length);
    if (cells.length > 1) {
      out.push({ cols, cells });
      return;
    }
    if (cells.length === 1) {
      out.push(...cells[0]);
      return;
    }
    return;
  }
  if (/^H[1-4]$/.test(tag)) {
    out.push(`${tag}: ${clean(el.textContent)}`);
    return;
  }
  if (/\bcrumbs\b/.test(c)) {
    out.push(
      "Breadcrumb: " +
        [...el.querySelectorAll("a,span")]
          .map((x) => clean(x.textContent))
          .filter((t) => t && t !== "/")
          .join(" › "),
    );
    return;
  }
  if (tag === "A") {
    const img = el.querySelector("img");
    const t =
      textOf(el) ||
      el.getAttribute("aria-label") ||
      (img ? (img.alt || "image") + " logo" : "");
    if (/\bbtn\b/.test(c)) out.push(`[BUTTON: ${t}${href(el)}]`);
    else if (
      el.querySelector("h2,h3,b,strong,.slot") &&
      clean(el.textContent).length > 40
    ) {
      out.push(`[WHOLE CARD IS A LINK${href(el)}]`);
      [...el.children].forEach((ch) => walk(ch, out, doc));
    } else out.push(`[LINK: ${t}${href(el)}]`);
    return;
  }
  if (tag === "BUTTON" && el.id === "burger") {
    out.push("[BUTTON: Menu (small screens only; opens the menu)]");
    return;
  }
  if (tag === "BUTTON") {
    out.push(
      `[BUTTON: ${textOf(el) || el.getAttribute("aria-label") || "button"}${el.getAttribute("role") === "tab" ? " (tab)" : ""}]`,
    );
    return;
  }
  if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") {
    if (el.type === "checkbox" || el.type === "hidden") return;
    const lab = el.id && doc.querySelector(`label[for="${el.id}"]`);
    const name = clean(
      lab
        ? lab.textContent
        : el.getAttribute("aria-label") || el.placeholder || el.type,
    );
    const kind =
      tag === "SELECT"
        ? "dropdown: " +
          [...el.options].map((o) => clean(o.textContent)).join(" / ")
        : tag === "TEXTAREA"
          ? "text area"
          : el.type || "text";
    out.push(
      `[FIELD: ${name} (${kind}${el.required ? ", required" : ""}${tabOf(el, doc)})]`,
    );
    if (el.placeholder && tag !== "SELECT")
      out.push(`  placeholder: "${clean(el.placeholder)}"`);
    return;
  }
  if (tag === "FIELDSET") {
    const leg = el.querySelector("legend"),
      boxes = [...el.querySelectorAll("input[type=checkbox]")].map((i) =>
        clean(i.parentElement.textContent),
      );
    out.push(
      `[CHECKBOXES: ${clean(leg && leg.textContent)}: ${boxes.join(" / ")}${tabOf(el, doc)}]`,
    );
    return;
  }
  if (tag === "LABEL" && el.htmlFor) return;
  if (/\berr\b/.test(c)) {
    out.push(`  error: "${clean(el.textContent)}"`);
    return;
  }
  if (/\bhelp\b/.test(c)) {
    out.push(`  help: "${clean(el.textContent)}"`);
    return;
  }
  if (/\bchips\b/.test(c) && el.querySelector(".chip")) {
    out.push(
      "Tags: " +
        [...el.querySelectorAll(".chip")]
          .map((x) => clean(x.textContent))
          .join(" · "),
    );
    return;
  }
  if (/\bstat\b/.test(c)) {
    const nn = el.querySelector(".n"),
      u = el.querySelector(".unit"),
      p = el.querySelector("p");
    if (nn)
      out.push(
        `H3: ${clean(nn.textContent)}${u ? " " + clean(u.textContent) : ""}`,
      );
    if (p) out.push(`Text: ${clean(p.textContent)}`);
    return;
  }
  if (/\bbadge\b/.test(c)) return;
  if (
    el.children.length &&
    [...el.children].every((ch) => ch.classList.contains("badge"))
  ) {
    out.push(
      "Badges: " +
        [...el.children].map((b) => clean(b.textContent) || "IoT").join(" · "),
    );
    return;
  }
  if (tag === "DETAILS") {
    const sm = el.querySelector("summary");
    out.push(`[FAQ, opens on click] Q: ${clean(sm && sm.textContent)}`);
    const p = el.querySelector("p");
    if (p) out.push(`  A: ${clean(p.textContent)}`);
    return;
  }
  if (/\bform-ok\b|\bcap-ok\b/.test(c)) {
    out.push(
      `[AFTER SENDING, replaces the form] ${[...el.children].map(textOf).filter(Boolean).join(" / ")}`,
    );
    return;
  }
  const hasBlock = [...el.children].some(
    (ch) => BLOCK.has(ch.tagName) || ch.classList.contains("slot"),
  );
  if (!hasBlock) {
    const t = textOf(el);
    if (t && el.getAttribute("aria-hidden") !== "true")
      out.push(`${tag === "LI" ? "• " : "Text: "}${t}`);
    return;
  }
  for (const n of el.childNodes) {
    if (n.nodeType === 3) {
      const t = clean(n.textContent);
      if (t && t.length > 1) out.push("Text: " + t);
    } else walk(n, out, doc);
  }
}

// ---- drawing ----
const len = (s) => [...s].length;
const pad = (s, w) => s + " ".repeat(Math.max(0, w - len(s)));
function wrap(line, w) {
  const ind = line.match(/^\s*/)[0] + "  ";
  const out = [];
  let cur = "";
  for (let word of line.split(" ")) {
    while (len(word) > w - len(ind)) {
      // hard-break very long words (URLs)
      const room = w - len(cur ? cur + " " : "");
      if (room < 8 && cur.trim()) {
        out.push(cur);
        cur = "";
        continue;
      }
      const take = Math.max(1, room);
      out.push((cur ? cur + " " : "") + [...word].slice(0, take).join(""));
      word = [...word].slice(take).join("");
      cur = "";
    }
    if (cur && len(cur + " " + word) > w) {
      out.push(cur);
      cur = ind + word;
    } else cur = cur ? cur + " " + word : word;
  }
  if (cur.trim()) out.push(cur);
  return out;
}
function render(items, w) {
  const lines = [];
  for (const it of items) {
    if (typeof it === "string") {
      lines.push(...wrap(it, w));
      continue;
    }
    let k = Math.min(it.cols, it.cells.length, 3);
    while (k > 1 && Math.floor((w - (k - 1)) / k) < MIN_COL) k--;
    const colW = Math.floor((w - (k - 1)) / k);
    for (let r = 0; r < it.cells.length; r += k) {
      const rest = w - (k - 1) - colW * (k - 1);
      const row = it.cells.slice(r, r + k).map((cell, i, a) => {
        const cw = i === k - 1 ? rest : colW;
        return box(render(cell, cw - 4), cw);
      });
      const h = Math.max(...row.map((b) => b.length));
      row.forEach((b) => {
        const cw = len(b[0]);
        while (b.length < h)
          b.splice(b.length - 1, 0, "│" + " ".repeat(cw - 2) + "│");
      });
      for (let i = 0; i < h; i++) lines.push(row.map((b) => b[i]).join(" "));
    }
  }
  return lines;
}
function box(
  lines,
  w,
  title,
  ch = { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" },
) {
  let top;
  if (title) {
    if (len(title) > w - 6) title = [...title].slice(0, w - 7).join("") + "…";
    top =
      ch.tl +
      ch.h +
      " " +
      title +
      " " +
      ch.h.repeat(w - len(title) - 5) +
      ch.tr;
  } else top = ch.tl + ch.h.repeat(w - 2) + ch.tr;
  return [
    top,
    ...lines.map((l) => ch.v + " " + pad(l, w - 4) + " " + ch.v),
    ch.bl + ch.h.repeat(w - 2) + ch.br,
  ];
}
const DOUBLE = { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║" };
function sectionTitle(el, i, page) {
  const h = el.querySelector("h1,h2");
  let name =
    el.getAttribute("aria-label") || (h && clean(h.textContent)) || "Section";
  if (len(name) > 50) name = [...name].slice(0, 48).join("") + "…";
  const s = surface(el);
  const key = page + "#" + (h && h.id),
    tag = CH && h && CH.sections[key] ? " · [" + CH.sections[key] + "]" : "";
  return `${i}. ${name}${s ? " · " + s : ""}${tag}`;
}

const js = fs.readFileSync(DIR + "js/site.js", "utf8");
const tpl = (n) => {
  const m = `const ${n}=\``,
    i = js.indexOf(m);
  if (i < 0) {
    console.error(`no ${n} template in ${DIR}js/site.js`);
    process.exit(1);
  }
  const a = i + m.length;
  return js.slice(a, js.indexOf("`;", a)).replace(/\$\{[^}]*\}/g, "");
};
const shared = (n) => {
  const d = new JSDOM(`<body>${tpl(n)}</body>`).window.document,
    out = [];
  [...d.body.children].forEach((ch) => walk(ch, out, d));
  return out;
};

const FRAME_NOTE = `Each page is one frame (double line), drawn top to bottom as it appears on a desktop screen. Inside it, each section is a
block (single line); columns and cards that sit side by side on screen sit side by side here (at most three per row; grids
with more columns continue on the next row). On phones every block stacks into one column. English text only; every string
also has a Vietnamese version in the prototype.`;
const INTRO =
  MODE === "original"
    ? `# Prototype wireframes: original

Owner: Amber Do. The first draft of the prototype, as merged into \`develop\` with PR #4 (then in
\`mockups/site-v3\`), before any enhancement. It does not change. The current version, with every change tracked, is
\`wireframes-final.md\`. Source: ${SOURCE}.

${FRAME_NOTE}`
    : `# Prototype wireframes: final

Owner: Amber Do. The prototype as it is now (\`prototype/\` on \`docs/prototype-enhancement\`).
Each section title ends, in brackets, with the change that shaped it; \`enhancement-log.md\` has the details of every
entry. Site-wide rows (every page) apply to every section too, so "content unchanged" means the section's content did not
change. The first draft is \`wireframes-original.md\`. Regenerated whenever an enhancement is approved.

${FRAME_NOTE}

${CH.table}`;
let md = `${INTRO}

**Legend:** \`H1\`–\`H4\` heading · \`Text\` paragraph or caption · \`•\` list item · \`[IMAGE: …]\` image or screenshot
block with its intended size · \`[BUTTON: …]\` button · \`[LINK: …]\` text link · \`[WHOLE CARD IS A LINK]\` the whole card
is clickable · \`[FIELD: …]\` form field · \`→\` where it goes.

## Pages

${PAGES.map(
  ([f, n]) =>
    `- [${n}](#${n
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/ +/g, "-")}) (\`${f}\`)`,
).join("\n")}

## Header and footer (on every page)

\`\`\`text
${box(render(shared("header"), PAGE_W), PAGE_W + 4, "Header · sticky, glass" + (CH ? " · [" + CH.header + "]" : "")).join("\n")}

${box(render(shared("footer"), PAGE_W), PAGE_W + 4, "Footer · dark navy" + (CH ? " · [" + CH.footer + "]" : "")).join("\n")}
\`\`\`
`;
for (const [f, n] of PAGES) {
  if (!fs.existsSync(DIR + f)) {
    md += `\n## ${n}\n\nThis page did not exist in this version.\n`;
    continue;
  }
  const d = new JSDOM(fs.readFileSync(DIR + f, "utf8")).window.document;
  if (!d.querySelector("main")) {
    console.error(f + ": no <main>");
    process.exit(1);
  }
  const inner = [pad('[HEADER: see "Header and footer"]', SEC_W), ""];
  let i = 0;
  for (const el of d.querySelector("main").children) {
    const out = [];
    walk(el, out, d);
    if (!out.length) continue;
    inner.push(
      ...box(render(out, SEC_W - 4), SEC_W, sectionTitle(el, ++i, f)),
      "",
    );
  }
  inner.push('[FOOTER: see "Header and footer"]');
  const pageNote =
    CH && CH.pages[f] ? "\n\nChanges on this page: " + CH.pages[f] : "";
  md += `\n## ${n}\n\n\`${f}\` · page title: "${clean(d.title)}"${pageNote}\n\n\`\`\`text\n${box(inner, PAGE_W + 4, n.toUpperCase() + " PAGE", DOUBLE).join("\n")}\n\`\`\`\n`;
}
if (CH) {
  const used = new Set();
  for (const [f] of PAGES)
    if (fs.existsSync(DIR + f))
      new JSDOM(fs.readFileSync(DIR + f, "utf8")).window.document
        .querySelectorAll("h1[id],h2[id]")
        .forEach((h) => used.add(f + "#" + h.id));
  Object.keys(CH.sections)
    .filter((k) => !used.has(k))
    .forEach((k) =>
      console.error("warning: change tag matches no heading: " + k),
    );
  PAGES.filter(([f]) => !CH.pages[f]).forEach(([f]) =>
    console.error("warning: no change note for " + f),
  );
}
if (OUT) fs.writeFileSync(OUT, md, "utf8");
else process.stdout.write(md);
