import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { contrastRatio, readThemeColors } from "./contrast";

describe("contrastRatio", () => {
  it("calculates navy on paper as 11.86", () => {
    const navy = "#163663";
    const paper = "#FDFDFE";
    const ratio = contrastRatio(navy, paper);
    expect(ratio).toBeCloseTo(11.86, 2);
  });

  it("calculates white on amber as 1.64", () => {
    const white = "#FFFFFF";
    const amber = "#FFC000";
    const ratio = contrastRatio(white, amber);
    expect(ratio).toBeCloseTo(1.64, 2);
  });

  it("handles uppercase hex colors", () => {
    const ratio = contrastRatio("#163663", "#FDFDFE");
    expect(ratio).toBeCloseTo(11.86, 2);
  });

  it("handles lowercase hex colors", () => {
    const ratio = contrastRatio("#163663", "#fdfdfe");
    expect(ratio).toBeCloseTo(11.86, 2);
  });

  it("composites translucent foreground over background", () => {
    // Navy at 12% opacity (1F hex = 31 decimal, ~12% opacity)
    // Over paper should give much lower contrast than fully opaque navy
    const navyTranslucent = "#1636631F";
    const paper = "#FDFDFE";
    const ratio = contrastRatio(navyTranslucent, paper);
    // Translucent navy over white is much lower than opaque
    expect(ratio).toBeLessThan(3);
  });

  it("treats fully opaque alpha (FF) the same as 6-digit format", () => {
    const navy6 = "#163663";
    const navyFF = "#163663FF";
    const paper = "#FDFDFE";
    const ratio6 = contrastRatio(navy6, paper);
    const ratioFF = contrastRatio(navyFF, paper);
    expect(ratioFF).toBeCloseTo(ratio6, 2);
  });

  it("composites translucent background over white", () => {
    // Translucent navy (12% opacity) composited over white becomes nearly white
    // So white text on it has very low contrast
    const white = "#FFFFFF";
    const navyTranslucentBg = "#1636631F";
    const ratioTranslucentBg = contrastRatio(white, navyTranslucentBg);
    // Translucent navy composited over white is nearly white, so contrast is very low
    expect(ratioTranslucentBg).toBeLessThan(2);
  });

  it("throws naming a value that is not a hex colour", () => {
    expect(() => contrastRatio("invalid", "#163663")).toThrow(
      'Invalid hex colour "invalid"',
    );
    expect(() => contrastRatio("#163663", "notahex")).toThrow(
      'Invalid hex colour "notahex"',
    );
    expect(() => contrastRatio("#FFF", "#163663")).toThrow(
      'Invalid hex colour "#FFF"',
    );
  });

  it("throws naming a value with a non-hex digit of valid length", () => {
    expect(() => contrastRatio("#1G3663", "#FDFDFE")).toThrow(
      'Invalid hex colour "#1G3663"',
    );
    expect(() => contrastRatio("#163663", "#FDFDFEZZ")).toThrow(
      'Invalid hex colour "#FDFDFEZZ"',
    );
  });

  it("handles fully transparent foreground", () => {
    const transparent = "#FFFFFF00";
    const navy = "#163663";
    const ratio = contrastRatio(transparent, navy);
    // Transparent white over navy should be same as navy on navy
    expect(ratio).toBeCloseTo(1, 2);
  });

  it("handles both colors fully transparent", () => {
    const transparent = "#FFFFFF00";
    const alsoTransparent = "#16366300";
    const ratio = contrastRatio(transparent, alsoTransparent);
    // The background composites over white, and the transparent foreground
    // adds nothing on top, so both sides are white and contrast is 1
    expect(ratio).toBeCloseTo(1, 2);
  });
});

describe("readThemeColors", () => {
  it("parses @theme colors from CSS", () => {
    const css = `
      @theme {
        --color-navy: #163663;
        --color-paper: #FDFDFE;
      }
    `;
    const colors = readThemeColors(css);
    expect(colors).toEqual({
      navy: "#163663",
      paper: "#FDFDFE",
    });
  });

  it("handles multiple theme blocks", () => {
    const css = `
      @theme {
        --color-navy: #163663;
      }
      @theme {
        --color-amber: #FFC000;
      }
    `;
    const colors = readThemeColors(css);
    expect(colors).toHaveProperty("navy", "#163663");
    expect(colors).toHaveProperty("amber", "#FFC000");
  });

  it("returns empty object for CSS with no @theme", () => {
    const css = "body { color: red; }";
    const colors = readThemeColors(css);
    expect(colors).toEqual({});
  });

  it("accepts @theme with modifiers", () => {
    const css = `
      @theme inline {
        --color-navy: #163663;
      }
      @theme static {
        --color-amber: #FFC000;
      }
    `;
    const colors = readThemeColors(css);
    expect(colors).toHaveProperty("navy", "#163663");
    expect(colors).toHaveProperty("amber", "#FFC000");
  });

  it("ignores non-hex values like var() and initial", () => {
    const css = `
      @theme {
        --color-navy: #163663;
        --color-other: var(--some-var);
        --color-initial: initial;
      }
    `;
    const colors = readThemeColors(css);
    expect(colors).toHaveProperty("navy", "#163663");
    expect(colors).not.toHaveProperty("other");
    expect(colors).not.toHaveProperty("initial");
  });

  it("ignores at-rules that only start with @theme", () => {
    const css = `
      @themeFoo {
        --color-navy: #163663;
      }
    `;
    expect(readThemeColors(css)).toEqual({});
  });

  it("ignores commented-out colours", () => {
    const css = `
      @theme {
        --color-navy: #163663;
        /* --color-old: #000000; */
      }
    `;
    expect(readThemeColors(css)).toEqual({ navy: "#163663" });
  });

  it("keeps the alpha pair of #RRGGBBAA colours", () => {
    const css = `
      @theme {
        --color-border: #1636631f;
        --color-on-navy-border: #FFFFFF24;
      }
    `;
    expect(readThemeColors(css)).toEqual({
      border: "#1636631f",
      "on-navy-border": "#FFFFFF24",
    });
  });
});

const ROOT = join(import.meta.dirname, "..", "..", "..");
const SRC = join(ROOT, "src");
const GLOBALS_CSS = readFileSync(join(SRC, "app", "globals.css"), "utf8");
const DESIGN_MD = readFileSync(
  join(
    ROOT,
    "_bmad-output",
    "planning-artifacts",
    "ux-designs",
    "ux-XionTech-LandingPage-2026-09-26",
    "DESIGN.md",
  ),
  "utf8",
);

/** Every `--name: value` declared in an `@theme` block, whitespace collapsed. */
function readThemeVars(css: string): Map<string, string> {
  const vars = new Map<string, string>();
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, block] of source.matchAll(/@theme\b[^{]*\{([^}]*)\}/g)) {
    for (const declaration of block.split(";")) {
      const match = /^\s*(--[\w-]+)\s*:\s*([\s\S]+?)\s*$/.exec(declaration);
      if (match) vars.set(match[1], match[2].replace(/\s+/g, " "));
    }
  }
  return vars;
}

const GROUP_PREFIX = new Map([
  ["colors", "--color-"],
  ["rounded", "--radius-"],
  ["spacing", "--spacing-"],
]);
const TYPE_SUFFIX = new Map([
  ["fontSize", ""],
  ["lineHeight", "--line-height"],
  ["letterSpacing", "--letter-spacing"],
  ["fontWeight", "--font-weight"],
]);

/** DESIGN.md frontmatter tokens, keyed by their mapped `@theme` name. */
function readDesignTokens(md: string): Map<string, string> {
  const tokens = new Map<string, string>();
  const frontmatter = md.replace(/\r\n/g, "\n").split(/^---$/m)[1];
  let group = "";
  let style = "";
  for (const line of frontmatter.split("\n")) {
    const top = /^(\w+):/.exec(line);
    const entry = /^ {2}([\w-]+):\s*'?([^']*?)'?$/.exec(line);
    const sub = /^ {4}(\w+):\s*'?([^']*?)'?$/.exec(line);
    const prefix = GROUP_PREFIX.get(group);
    if (top) {
      group = top[1];
    } else if (entry && group === "typography") {
      style = entry[1];
    } else if (entry && prefix) {
      const isContainer = group === "spacing" && entry[1] === "container";
      tokens.set(
        isContainer ? "--container-page" : prefix + entry[1],
        entry[2],
      );
    } else if (sub && group === "typography" && TYPE_SUFFIX.has(sub[1])) {
      tokens.set(`--text-${style}${TYPE_SUFFIX.get(sub[1])}`, sub[2]);
    }
  }
  return tokens;
}

// Tokens from the DESIGN.md Build tokens table, the font families, and the
// semantic link colour; none of them live in the DESIGN.md frontmatter.
const BUILD_TOKENS: Record<string, string> = {
  "--font-display": "var(--font-unbounded), system-ui, sans-serif",
  "--font-brand": "var(--font-lexend-exa), system-ui, sans-serif",
  "--font-body": "var(--font-be-vietnam-pro), system-ui, sans-serif",
  "--font-mono": "var(--font-jetbrains-mono), ui-monospace, monospace",
  "--color-link": "#163663",
  "--breakpoint-sm": "640px",
  "--breakpoint-md": "900px",
  "--breakpoint-lg": "1080px",
  "--z-index-background": "-1",
  "--z-index-content": "0",
  "--z-index-subnav": "40",
  "--z-index-header": "50",
  "--z-index-mobile-menu": "60",
  "--z-index-toast": "100",
  "--z-index-skip-link": "200",
  "--ease-brand": "cubic-bezier(0.16, 1, 0.3, 1)",
  "--transition-duration-menu": "300ms",
  "--transition-duration-crossfade": "550ms",
  "--transition-duration-reveal": "900ms",
  "--transition-duration-highlight": "1200ms",
  "--transition-duration-count-up": "1400ms",
  "--transition-duration-track": "2400ms",
  "--shadow-card": "0 40px 80px -40px rgb(11 23 48 / 0.45)",
  "--shadow-device": "0 60px 100px -40px rgb(11 23 48 / 0.55)",
  "--shadow-primary": "0 12px 30px -12px rgb(255 192 0 / 0.7)",
  "--text-display-hero-fluid": "clamp(2.2rem, 4vw, 3.5rem)",
  "--text-display-page": "clamp(2.2rem, 4.4vw, 3.6rem)",
  "--text-headline-fluid": "clamp(1.9rem, 3.5vw, 2.8rem)",
  "--text-stat-fluid": "clamp(2rem, 3.6vw, 3rem)",
  "--text-news-title": "1.08rem",
};

describe("globals.css @theme tokens", () => {
  const theme = readThemeVars(GLOBALS_CSS);
  const design = readDesignTokens(DESIGN_MD);
  // E-A1 decision Q2: the prototype's weights, heading rhythm and section
  // spacing override DESIGN.md until Amber updates it after the demo.
  // src/app/type-scale.test.ts checks their new values.
  const PROTOTYPE_OVERRIDES = new Set([
    ...[
      "display-hero",
      "display-hero-mobile",
      "headline",
      "headline-mobile",
    ].flatMap((name) =>
      ["font-weight", "line-height", "letter-spacing"].map(
        (prop) => `--text-${name}--${prop}`,
      ),
    ),
    "--text-stat--font-weight",
    "--text-title-lg--font-weight",
    "--text-title-lg--line-height",
    "--text-title-md--font-weight",
    "--text-title-sm--font-weight",
    "--text-button--font-weight",
    "--text-button-sm--font-weight",
    "--spacing-section",
    "--spacing-section-mobile",
    "--spacing-section-head-gap",
  ]);

  it("reads every DESIGN.md token group", () => {
    expect([...design.keys()]).toEqual(
      expect.arrayContaining([
        "--color-navy",
        "--text-display-hero",
        "--text-label--letter-spacing",
        "--radius-full",
        "--spacing-gutter",
        "--container-page",
      ]),
    );
  });

  it("holds every DESIGN.md token under its mapped name and value", () => {
    const problems = [...design]
      .filter(([name]) => !PROTOTYPE_OVERRIDES.has(name))
      .filter(([name, value]) => {
        return theme.get(name)?.toLowerCase() !== value.toLowerCase();
      })
      .map(([name, value]) => `${name}: want ${value}, got ${theme.get(name)}`);
    expect(problems).toEqual([]);
  });

  it("holds the Build tokens, font families and link colour", () => {
    const problems = Object.entries(BUILD_TOKENS)
      .filter(([name, value]) => theme.get(name) !== value)
      .map(([name, value]) => `${name}: want ${value}, got ${theme.get(name)}`);
    expect(problems).toEqual([]);
  });

  it("removes the default colour palette and breakpoints", () => {
    expect(GLOBALS_CSS).toMatch(/--color-\*:\s*initial;/);
    expect(GLOBALS_CSS).toMatch(/--breakpoint-\*:\s*initial;/);
  });
});

interface CssRule {
  selectors: string[];
  declarations: Map<string, string>;
}

/** Every flat rule (one with no block inside it) in `css`, comments removed. */
function readRules(css: string): CssRule[] {
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  return [...source.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(
    ([, selectors, body]) => {
      const declarations = new Map<string, string>();
      for (const declaration of body.split(";")) {
        const match = /^\s*([\w-]+)\s*:\s*([\s\S]+?)\s*$/.exec(declaration);
        if (match) declarations.set(match[1], match[2].replace(/\s+/g, " "));
      }
      return {
        selectors: selectors.split(",").map((s) => s.trim()),
        declarations,
      };
    },
  );
}

/** Declarations of every flat rule whose selector list includes `selector`. */
function readRuleDeclarations(
  css: string,
  selector: string,
): Map<string, string> {
  const declarations = new Map<string, string>();
  for (const rule of readRules(css)) {
    if (!rule.selectors.includes(selector)) continue;
    for (const [name, value] of rule.declarations) {
      declarations.set(name, value);
    }
  }
  return declarations;
}

/** Variables a surface scopes for its children, plus the `color` it resets. */
function scopedNames(surface: string): string[] {
  return [...readRuleDeclarations(GLOBALS_CSS, surface).keys()]
    .filter((name) => name.startsWith("--") || name === "color")
    .sort();
}

const LIGHT_SURFACES = [".surface-paper", ".surface-mist", ".hero-light"];
const OTHER_SURFACES = [
  ".surface-navy",
  ".surface-amber",
  ".hero-silk",
  ".hero-navy",
  ".hero-amber",
];

// A light surface nested in a navy one (the paper contact form card in a navy
// hero) must get back its own row of the DESIGN.md surface table.
describe("light surfaces restore the light token set", () => {
  const theme = readThemeVars(GLOBALS_CSS);
  const root = readRuleDeclarations(GLOBALS_CSS, ":root");
  const light: Record<string, string> = {
    "--foreground": "var(--color-text)",
    "--muted-foreground": "var(--color-muted)",
    "--border": "var(--color-border)",
    "--ring": "var(--color-focus)",
    "--destructive": "var(--color-error)",
    "--glass": root.get("--glass") ?? "missing on :root",
    "--label-color": "var(--color-muted)",
    "--label-rule": "var(--color-amber)",
    color: "var(--color-text)",
  };
  for (const name of ["heading", "text", "muted", "border", "link", "focus"]) {
    const token = `--color-${name}`;
    light[token] = theme.get(token) ?? "missing from @theme";
  }

  it.each(LIGHT_SURFACES)("%s sets the light values", (surface) => {
    const rule = readRuleDeclarations(GLOBALS_CSS, surface);
    const actual = Object.fromEntries(
      Object.keys(light).map((name) => [name, rule.get(name)]),
    );
    expect(actual).toEqual(light);
  });

  it.each(OTHER_SURFACES)("%s scopes the same variables", (surface) => {
    expect(scopedNames(surface)).toEqual(scopedNames(".surface-paper"));
  });

  it.each([".surface-navy", ".hero-silk", ".hero-navy"])(
    "%s maps --destructive to the on-navy error colour",
    (surface) => {
      const rule = readRuleDeclarations(GLOBALS_CSS, surface);
      expect(rule.get("--destructive")).toBe("var(--color-error-on-navy)");
    },
  );
});

/** Content of the first `prelude { … }` block in `css`, braces balanced. */
function readBlock(css: string, prelude: string): string {
  const start = css.indexOf(`${prelude} {`);
  if (start === -1) return "";
  const open = start + prelude.length + 1;
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    if (css[i] === "}") depth--;
    if (depth === 0) return css.slice(open + 1, i);
  }
  return "";
}

describe("headings", () => {
  const source = GLOBALS_CSS.replace(/\/\*[\s\S]*?\*\//g, "");

  it.each(["h1", "h2", "h3", "h4"])("%s uses the display font", (heading) => {
    const rule = readRuleDeclarations(source, heading);
    expect(rule.get("font-family")).toBe("var(--font-display)");
  });

  it("puts the :lang(vi) line-height in the utilities layer, above text sizes", () => {
    const rule = /:lang\(vi\) h1,\s*:lang\(vi\) h2\s*\{\s*line-height: 1\.2;/;
    expect(readBlock(source, "@layer base")).not.toMatch(rule);
    expect(readBlock(source, "@layer utilities")).toMatch(rule);
  });
});

const REDUCED_MOTION_BLOCK =
  /@media\s*\(\s*prefers-reduced-motion:\s*reduce\s*\)\s*\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}/;

describe("reduced motion", () => {
  const source = GLOBALS_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  const block = REDUCED_MOTION_BLOCK.exec(source)?.[1] ?? "";

  // E-A5: only an explicit Play motion on the Products glows is exempt.
  it.each(['*:not(.eco-bg[data-motion="on"] i)', "*::before", "*::after"])(
    "stops every animation and transition on %s",
    (selector) => {
      const rule = readRuleDeclarations(block, selector);
      expect(Object.fromEntries(rule)).toMatchObject({
        animation: "none !important",
        transition: "none !important",
        "scroll-behavior": "auto !important",
      });
    },
  );
});

// Rules allowed to hide content: the HTML `hidden` attribute (also on the
// contact form tabpanels), and the skip link, which shows on keyboard focus
// with no JavaScript. The News story card (E-A6) swaps its aria-hidden "Read
// story" for the pill and date on hover and focus with no JavaScript, and
// always shows "Read story" on touch screens. The About FAQ (E-S3) hides
// Safari's disclosure triangle, a purely decorative user-agent marker: the
// question text and the +/- stay visible. The shared scroll reveal hides only
// items its script marked "wait" and starts its rise (`from`) only on items
// the script marked "play", so with no JavaScript neither ever applies.
const MAY_HIDE = new Set([
  "[hidden]",
  ".fpanel[hidden]",
  ".skip",
  ".scard-read",
  ".scard:hover .scard-meta",
  ".scard:focus-visible .scard-meta",
  ".faq summary::-webkit-details-marker",
  '[data-reveal] > [data-shown="wait"]',
  "from",
]);
const HIDING: [string, RegExp][] = [
  ["display", /^none\b/],
  ["visibility", /^(?:hidden|collapse)\b/],
  ["opacity", /^0(?:\.0+)?%?(?:\s*!important)?$/],
];

/** `selector { property: value }` for each rule that hides its content. */
function findHidingRules(css: string): string[] {
  return readRules(css)
    .filter((rule) => !rule.selectors.every((s) => MAY_HIDE.has(s)))
    .flatMap((rule) => {
      return HIDING.filter(([property, value]) => {
        return value.test(rule.declarations.get(property) ?? "");
      }).map(([property]) => {
        const value = rule.declarations.get(property);
        return `${rule.selectors.join(", ")} { ${property}: ${value} }`;
      });
    });
}

describe("no JavaScript: CSS hides no content", () => {
  it.each([
    ".reveal { opacity: 0 }",
    ".reveal { opacity: 0% }",
    ".menu { display: none }",
    ".row { visibility: collapse }",
    ".toast { visibility: hidden !important }",
    "[hidden], .reveal { opacity: 0 }",
  ])("flags %s", (css) => {
    expect(findHidingRules(css)).toHaveLength(1);
  });

  it.each([
    "[hidden] { display: none !important }",
    ".skip { display: none }",
    ".card { opacity: 0.5 }",
    ".row { display: flex }",
  ])("allows %s", (css) => {
    expect(findHidingRules(css)).toEqual([]);
  });

  it("finds no rule in src/ CSS that hides content until JavaScript runs", () => {
    const files = sourceFiles(SRC).filter((file) => file.endsWith(".css"));
    expect(files).toContain(join("app", "globals.css"));
    const hiding = files.flatMap((file) => {
      return findHidingRules(readFileSync(join(SRC, file), "utf8"));
    });
    expect(hiding).toEqual([]);
  });
});

const TEXT = 4.5;
const NON_TEXT = 3;

// [foreground, background, minimum ratio] for the pairs in DESIGN.md Colors.
const AA_PAIRS: [string, string, number][] = [
  // Light surfaces
  ["heading", "paper", TEXT],
  ["heading", "mist", TEXT],
  ["heading", "page", TEXT],
  ["text", "paper", TEXT],
  ["text", "page", TEXT],
  ["muted", "paper", TEXT],
  ["muted", "page", TEXT],
  ["muted", "mist", TEXT],
  ["placeholder", "paper", TEXT],
  ["placeholder", "page", TEXT],
  ["placeholder", "mist", TEXT],
  ["amber-text", "paper", TEXT],
  ["amber-text", "page", TEXT],
  ["amber-text", "mist", TEXT],
  ["error", "paper", TEXT],
  ["error", "page", TEXT],
  ["error", "mist", TEXT],
  ["field-border", "paper", NON_TEXT],
  ["field-border", "page", NON_TEXT],
  ["field-border", "mist", NON_TEXT],
  ["focus", "paper", NON_TEXT],
  ["focus", "page", NON_TEXT],
  ["focus", "mist", NON_TEXT],
  // Navy surfaces, at the base colour and at the lightest gradient stop
  ["on-navy-heading", "navy", TEXT],
  ["on-navy-text", "navy", TEXT],
  ["on-navy-muted", "navy", TEXT],
  ["on-navy-link", "navy", TEXT],
  ["amber", "navy", TEXT],
  ["amber-tint", "navy", TEXT],
  ["error-on-navy", "navy", TEXT],
  ["focus-on-navy", "navy", NON_TEXT],
  ["on-navy-heading", "navy-glow", TEXT],
  ["on-navy-text", "navy-glow", TEXT],
  ["on-navy-muted", "navy-glow", TEXT],
  ["on-navy-link", "navy-glow", TEXT],
  ["amber", "navy-glow", TEXT],
  ["error-on-navy", "navy-glow", TEXT],
  ["focus-on-navy", "navy-glow", NON_TEXT],
  // Amber surfaces, at the base colour and at the darkest gradient stop
  ["on-amber-text", "amber", TEXT],
  ["on-amber-muted", "amber", TEXT],
  ["navy", "amber", TEXT],
  ["error", "amber", TEXT],
  ["focus", "amber", NON_TEXT],
  ["on-amber-text", "amber-deep", TEXT],
  ["on-amber-muted", "amber-deep", TEXT],
  ["navy", "amber-deep", TEXT],
  ["error", "amber-deep", TEXT],
  ["focus", "amber-deep", NON_TEXT],
  // Gaps closed in Story 7.3
  ["amber-tint", "navy-glow", TEXT],
  ["white", "navy-glow", TEXT],
  // Navy button
  ["white", "navy", TEXT],
];

describe("DESIGN.md AA colour pairs in globals.css", () => {
  const colors = readThemeColors(GLOBALS_CSS);

  it.each(AA_PAIRS)("%s on %s is at least %d:1", (fg, bg, min) => {
    expect(colors[fg], `--color-${fg} is missing`).toBeDefined();
    expect(colors[bg], `--color-${bg} is missing`).toBeDefined();
    const ratio = contrastRatio(colors[fg], colors[bg]);
    expect(
      ratio,
      `${fg} on ${bg} is ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(min);
  });
});

// amber-decor (#C99700) is decorative only: never a text, fill or stroke colour.
const AMBER_DECOR_MISUSE = [
  // Utilities: text-amber-decor, fill-[#C99700], stroke-(--color-amber-decor)
  /\b(?:text|fill|stroke)-[[(]?(?:var\()?(?:--color-)?(?:amber-decor|#c99700)/i,
  // CSS declarations, JSX props and style objects: color: …, fill="…", stroke={…}
  /(?:^|[^\w-])(?:color|fill|stroke)\s*[:=]\s*[{"'\s]*(?:var\(\s*)?(?:--color-amber-decor|#c99700)/i,
];

/** 1-based line numbers that use amber-decor for text, fill or stroke. */
function findAmberDecorMisuse(source: string): number[] {
  return source.split(/\r?\n/).flatMap((line, index) => {
    return AMBER_DECOR_MISUSE.some((rule) => rule.test(line))
      ? [index + 1]
      : [];
  });
}

/** Source files under `dir` (relative paths), test files excluded. */
function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { recursive: true, encoding: "utf8" }).filter(
    (file) => /\.(?:[cm]?[jt]sx?|css)$/.test(file) && !/\.test\./.test(file),
  );
}

describe("amber-decor guard", () => {
  it.each([
    '<span className="text-amber-decor">',
    '<i className="hover:fill-amber-decor/50" />',
    '<p className="stroke-[#C99700]">',
    '<b className="text-(--color-amber-decor)">',
    "  color: var(--color-amber-decor);",
    "  fill: #c99700;",
    '<path fill="#C99700" />',
    '<Icon color="#C99700" />',
    'style={{ color: "#C99700" }}',
    'stroke={"#C99700"}',
  ])("flags %s", (line) => {
    expect(findAmberDecorMisuse(`ok\n${line}`)).toEqual([2]);
  });

  it.each([
    "  --color-amber-decor: #C99700;",
    '<div className="bg-amber-decor" />',
    "  background-color: #C99700;",
    "  border-color: var(--color-amber-decor);",
    '<span className="text-amber-text">',
    '<path fill="currentColor" className="bg-amber-decor" />',
  ])("allows %s", (line) => {
    expect(findAmberDecorMisuse(line)).toEqual([]);
  });

  it("finds no amber-decor text, fill or stroke in src/", () => {
    const files = sourceFiles(SRC);
    expect(files).toContain(join("app", "globals.css"));
    const hits = files.flatMap((file) => {
      const source = readFileSync(join(SRC, file), "utf8");
      const path = `src/${file.replaceAll("\\", "/")}`;
      return findAmberDecorMisuse(source).map((line) => `${path}:${line}`);
    });
    expect(hits).toEqual([]);
  });
});

describe("T9: focus ring and skip link pill", () => {
  const source = GLOBALS_CSS.replace(/\/\*[\s\S]*?\*\//g, "");

  it(":focus-visible outline width is 2px", () => {
    const rule = readRuleDeclarations(source, ":focus-visible");
    const outline = rule.get("outline");
    expect(outline).toMatch(/^2px\s/);
  });

  it(".skip:focus uses --radius-full", () => {
    const rule = readRuleDeclarations(source, ".skip:focus");
    expect(rule.get("border-radius")).toBe("var(--radius-full)");
  });

  it("#main drops the outline when focused by the skip link", () => {
    const rule = readRuleDeclarations(source, "#main:focus");
    expect(rule.get("outline")).toBe("none");
  });

  it("html reserves scroll-padding-top for the sticky header", () => {
    const rule = readRuleDeclarations(source, "html");
    expect(rule.get("scroll-padding-top")).toBe("var(--spacing-header-height)");
  });

  it("enabled buttons show the hand cursor (Tailwind v4 resets it to the arrow)", () => {
    expect(
      readRuleDeclarations(source, "button:not(:disabled)").get("cursor"),
    ).toBe("pointer");
  });
});

describe("contact form styles", () => {
  const source = GLOBALS_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  const colors = readThemeColors(GLOBALS_CSS);

  it("shows error text in the error colour, which passes AA on the paper card", () => {
    const rule = readRuleDeclarations(source, ".field .err");
    expect(rule.get("color")).toBe("var(--color-error)");
    expect(contrastRatio(colors.error, colors.paper)).toBeGreaterThanOrEqual(
      TEXT,
    );
  });

  it("paints an invalid field border in the error border colour", () => {
    const rule = readRuleDeclarations(source, ".field.bad input");
    expect(rule.get("border-color")).toBe("var(--color-error-border)");
  });

  it("lays each tabpanel out inside the two-column grid", () => {
    const rule = readRuleDeclarations(source, ".fpanel");
    expect(rule.get("display")).toBe("contents");
  });

  it("keeps the inactive tabpanel hidden despite display: contents", () => {
    const rule = readRuleDeclarations(source, ".fpanel[hidden]");
    expect(rule.get("display")).toBe("none");
  });

  it.each([
    ".field input:focus",
    ".field select:focus",
    ".field textarea:focus",
  ])("%s keeps the global focus ring (no outline: none)", (selector) => {
    const rule = readRuleDeclarations(source, selector);
    expect(rule.get("outline")).toBeUndefined();
  });

  it("does not redefine sr-only, which Tailwind provides", () => {
    expect(source).not.toMatch(/\.sr-only\s*\{/);
  });

  it("shows the send-failure alert in the error colour, which passes AA on the paper card", () => {
    const rule = readRuleDeclarations(source, ".form-alert");
    expect(rule.get("color")).toBe("var(--color-error)");
    expect(contrastRatio(colors.error, colors.paper)).toBeGreaterThanOrEqual(
      TEXT,
    );
  });

  it("centres the thank-you panel", () => {
    const rule = readRuleDeclarations(source, ".form-ok");
    expect(rule.get("text-align")).toBe("center");
  });

  it("draws the summit and its pole in navy, which passes the non-text 3:1 on the paper card", () => {
    expect(readRuleDeclarations(source, ".sm-range").get("stroke")).toBe(
      "var(--color-navy)",
    );
    expect(readRuleDeclarations(source, ".sm-pole").get("stroke")).toBe(
      "var(--color-navy)",
    );
    expect(contrastRatio(colors.navy, colors.paper)).toBeGreaterThanOrEqual(
      NON_TEXT,
    );
  });

  it("keeps the global focus ring on the thank-you panel it receives focus on", () => {
    const rules = readRules(source).filter((rule) =>
      rule.selectors.some((selector) => selector.startsWith(".form-ok")),
    );
    expect(rules.length).toBeGreaterThan(0);
    for (const rule of rules) {
      expect(rule.declarations.get("outline")).toBeUndefined();
    }
  });
});

describe("email capture band styles", () => {
  const source = GLOBALS_CSS.replace(/\/\*[\s\S]*?\*\//g, "");
  const colors = readThemeColors(GLOBALS_CSS);
  const rule = (selector: string) => readRuleDeclarations(source, selector);
  // The first rule for a selector, before any media query overrides it.
  const baseRule = (selector: string) =>
    readRules(source).find((r) => r.selectors.includes(selector))
      ?.declarations ?? new Map<string, string>();

  it("pads the band with the capture spacing token", () => {
    expect(rule(".capture").get("padding-block")).toBe(
      "var(--spacing-capture)",
    );
  });

  it("splits the band in two columns", () => {
    expect(baseRule(".cap-grid").get("grid-template-columns")).toBe("1fr 1fr");
  });

  it("stacks the band in one column up to the md breakpoint", () => {
    expect(source).toMatch(
      /@media \(width <= --theme\(--breakpoint-md\)\)\s*\{\s*\.cap-grid\s*\{[^}]*grid-template-columns:\s*1fr;/,
    );
  });

  it("draws a decorative ring behind the band text that ignores the pointer", () => {
    const ring = baseRule(".capture::before");
    expect(ring.get("position")).toBe("absolute");
    expect(ring.get("width")).toBe("55%");
    expect(ring.get("aspect-ratio")).toBe("1");
    expect(ring.get("border-radius")).toBe("50%");
    expect(ring.get("border")).toBe("1.5px solid rgb(22 54 99 / 0.16)");
    expect(ring.get("box-shadow")).toBe(
      "0 0 0 44px rgb(255 255 255 / 0.08), 0 0 0 88px rgb(255 255 255 / 0.05)",
    );
    expect(ring.get("pointer-events")).toBe("none");
    expect(baseRule(".cap-grid").get("position")).toBe("relative");
  });

  it("limits the band heading to 15 characters wide", () => {
    expect(rule(".cap-grid h2").get("max-width")).toBe("15ch");
  });

  it("spaces the band lede 14px below the heading", () => {
    expect(rule(".cap-grid .lede").get("margin-top")).toBe("14px");
  });

  it("draws the field row as a white pill with a 1.5px navy border", () => {
    const row = baseRule(".cap-row");
    expect(row.get("background")).toBe("var(--color-paper)");
    expect(row.get("border-radius")).toBe("var(--radius-full)");
    expect(row.get("border")).toBe("1.5px solid var(--color-navy)");
  });

  it("shows a 3px ring in the focus colour around the focused row", () => {
    expect(rule(".cap-row:focus-within").get("box-shadow")).toMatch(
      /^0 0 0 3px var\(--color-focus\)/,
    );
  });

  it("stacks the field above the button up to the sm breakpoint", () => {
    expect(source).toMatch(
      /@media \(width <= --theme\(--breakpoint-sm\)\)\s*\{\s*\.cap-row\s*\{[^}]*flex-direction:\s*column/,
    );
  });

  it("shows capture errors in the error colour, which passes AA on amber", () => {
    expect(rule(".cap-form .err").get("color")).toBe("var(--color-error)");
    expect(contrastRatio(colors.error, colors.amber)).toBeGreaterThanOrEqual(
      TEXT,
    );
  });

  it("underlines the consent link", () => {
    expect(rule(".cap-form small a").get("text-decoration")).toBe("underline");
  });

  it("dims a disabled button and shows the not-allowed cursor", () => {
    const disabled = rule(".btn:disabled");
    expect(disabled.get("opacity")).toBe("0.6");
    expect(disabled.get("cursor")).toBe("not-allowed");
  });
});
