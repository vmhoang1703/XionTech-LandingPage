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

  it("returns 1 for invalid hex colors", () => {
    const ratio1 = contrastRatio("invalid", "#163663");
    const ratio2 = contrastRatio("#163663", "invalid");
    expect(ratio1).toBe(1);
    expect(ratio2).toBe(1);
  });

  it("returns 1 for both colors invalid", () => {
    const ratio = contrastRatio("notahex", "alsonot");
    expect(ratio).toBe(1);
  });

  it("handles short hex colors", () => {
    const ratio = contrastRatio("#FFF", "#163663");
    expect(ratio).toBe(1);
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
    // Both transparent composites to black, so contrast should be 1
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
  "--z-index-mega-menu": "55",
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

/** Declarations of every flat rule whose selector list includes `selector`. */
function readRuleDeclarations(
  css: string,
  selector: string,
): Map<string, string> {
  const declarations = new Map<string, string>();
  const source = css.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const [, selectors, body] of source.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    if (!selectors.split(",").some((s) => s.trim() === selector)) continue;
    for (const declaration of body.split(";")) {
      const match = /^\s*([\w-]+)\s*:\s*([\s\S]+?)\s*$/.exec(declaration);
      if (match) declarations.set(match[1], match[2].replace(/\s+/g, " "));
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
});

const TEXT = 4.5;
const NON_TEXT = 3;

// [foreground, background, minimum ratio] for the pairs in DESIGN.md Colors.
const AA_PAIRS: [string, string, number][] = [
  // Light surfaces
  ["heading", "paper", TEXT],
  ["heading", "mist", TEXT],
  ["text", "paper", TEXT],
  ["text", "page", TEXT],
  ["muted", "paper", TEXT],
  ["muted", "page", TEXT],
  ["muted", "mist", TEXT],
  ["placeholder", "paper", TEXT],
  ["amber-text", "paper", TEXT],
  ["amber-text", "page", TEXT],
  ["amber-text", "mist", TEXT],
  ["error", "paper", TEXT],
  ["field-border", "paper", NON_TEXT],
  ["field-border", "mist", NON_TEXT],
  ["focus", "paper", NON_TEXT],
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
