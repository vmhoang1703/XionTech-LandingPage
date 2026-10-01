/**
 * Parse a hex color (#RRGGBB or #RRGGBBAA) into RGB components (0-1).
 * Returns undefined for invalid formats.
 */
function parseHexColor(
  hex: string,
): { r: number; g: number; b: number; a: number } | undefined {
  const cleaned = hex.replace("#", "").toLowerCase();
  if (cleaned.length !== 6 && cleaned.length !== 8) {
    return undefined;
  }

  const r = parseInt(cleaned.substring(0, 2), 16) / 255;
  const g = parseInt(cleaned.substring(2, 4), 16) / 255;
  const b = parseInt(cleaned.substring(4, 6), 16) / 255;
  const a =
    cleaned.length === 8 ? parseInt(cleaned.substring(6, 8), 16) / 255 : 1;

  return { r, g, b, a };
}

/**
 * Composite a foreground color over a background using sRGB alpha blending.
 */
function compositeColor(
  fg: { r: number; g: number; b: number; a: number },
  bg: { r: number; g: number; b: number; a: number },
): { r: number; g: number; b: number } {
  const alpha = fg.a + bg.a * (1 - fg.a);
  if (alpha === 0) {
    return { r: 0, g: 0, b: 0 };
  }

  return {
    r: (fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / alpha,
    g: (fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / alpha,
    b: (fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / alpha,
  };
}

/**
 * Calculate the relative luminance of RGB values according to WCAG 2.0
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getLuminanceFromRGB(r: number, g: number, b: number): number {
  const [rLinear, gLinear, bLinear] = [r, g, b].map((c) => {
    if (c <= 0.03928) {
      return c / 12.92;
    }
    return Math.pow((c + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate the contrast ratio between two colors according to WCAG 2.0
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 *
 * Handles both opaque (#RRGGBB) and translucent (#RRGGBBAA) colors.
 * Translucent foreground is composited over translucent background in sRGB.
 * Both are composited over white (#FFFFFF) if needed for alpha blending.
 *
 * @param fgHex - Foreground color in hex format (#RRGGBB or #RRGGBBAA)
 * @param bgHex - Background color in hex format (#RRGGBB or #RRGGBBAA)
 * @returns The contrast ratio, typically between 1 and 21
 */
export function contrastRatio(fgHex: string, bgHex: string): number {
  const fg = parseHexColor(fgHex);
  const bg = parseHexColor(bgHex);

  if (!fg || !bg) {
    return 1;
  }

  // White base for compositing translucent colors
  const white = { r: 1, g: 1, b: 1, a: 1 };

  // Composite background over white if it has transparency
  const bgComposited =
    bg.a < 1 ? compositeColor(bg, white) : { r: bg.r, g: bg.g, b: bg.b };

  // Composite foreground over the (possibly composited) background
  const fgComposited = compositeColor(fg, { ...bgComposited, a: 1 });

  const l1 = getLuminanceFromRGB(
    fgComposited.r,
    fgComposited.g,
    fgComposited.b,
  );
  const l2 = getLuminanceFromRGB(
    bgComposited.r,
    bgComposited.g,
    bgComposited.b,
  );

  // The formula uses the lighter luminance first
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse @theme colors from CSS and return them as a map
 * of normalized color names to hex values
 *
 * Accepts @theme blocks with or without modifiers (@theme inline, @theme static, etc).
 * Only extracts hex color values, ignoring var(), initial, and other non-hex values.
 *
 * @param css - CSS string containing @theme blocks
 * @returns Object mapping normalized color names to hex values
 */
export function readThemeColors(css: string): Record<string, string> {
  const colors: Record<string, string> = {};
  // Match @theme with optional modifiers, then the opening brace and contents
  const themeBlockRegex = /@theme\s*(?:\w+\s+)*\{([^}]+)\}/g;
  const colorLineRegex =
    /--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?)/i;

  const themeMatches = css.matchAll(themeBlockRegex);
  for (const themeMatch of themeMatches) {
    const themeBlock = themeMatch[1];
    const lines = themeBlock.split(";");
    for (const line of lines) {
      const colorMatch = line.match(colorLineRegex);
      if (colorMatch) {
        colors[colorMatch[1]] = colorMatch[2];
      }
    }
  }

  return colors;
}
