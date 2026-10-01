/**
 * Calculate the relative luminance of a color according to WCAG 2.0
 * https://www.w3.org/TR/WCAG20/#relativeluminancedef
 */
function getRelativeLuminance(hex: string): number {
  // Parse hex color to RGB
  const hex2 = hex.replace("#", "");
  const r = parseInt(hex2.substring(0, 2), 16) / 255;
  const g = parseInt(hex2.substring(2, 4), 16) / 255;
  const b = parseInt(hex2.substring(4, 6), 16) / 255;

  // Apply gamma correction
  const [rLinear, gLinear, bLinear] = [r, g, b].map((c) => {
    if (c <= 0.03928) {
      return c / 12.92;
    }
    return Math.pow((c + 0.055) / 1.055, 2.4);
  });

  // Calculate relative luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate the contrast ratio between two colors according to WCAG 2.0
 * https://www.w3.org/TR/WCAG20/#contrast-ratiodef
 *
 * @param hexA - First color in hex format (#RRGGBB or #RRGGBBAA)
 * @param hexB - Second color in hex format (#RRGGBB or #RRGGBBAA)
 * @returns The contrast ratio, typically between 1 and 21
 */
export function contrastRatio(hexA: string, hexB: string): number {
  const l1 = getRelativeLuminance(hexA);
  const l2 = getRelativeLuminance(hexB);

  // The formula uses the lighter luminance first
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse @theme colors from CSS and return them as a map
 * of normalized color names to hex values
 *
 * @param css - CSS string containing @theme blocks
 * @returns Object mapping normalized color names to hex values
 */
export function readThemeColors(css: string): Record<string, string> {
  const colors: Record<string, string> = {};
  const themeBlockRegex = /@theme\s*\{([^}]+)\}/g;
  const colorLineRegex = /--color-([a-z0-9-]+):\s*(#[0-9a-fA-F]+)/;

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
