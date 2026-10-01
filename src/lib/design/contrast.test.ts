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
