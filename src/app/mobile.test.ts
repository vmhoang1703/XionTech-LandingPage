import { describe, expect, it } from "vitest";
import { globalsCss } from "@/test-utils/css-classes";

// Mobile and tablet pass (lead, 2026-10-13): 44px tap targets on touch screens
// (PRODUCT.md) and no label under DESIGN.md's 11.5px floor.
describe("touch targets and small text", () => {
  const css = globalsCss();
  const ruleBody = (selector: string) => {
    const escaped = selector.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
    return new RegExp(String.raw`(?:^|\n)\s*${escaped}\s*\{([^}]*)\}`).exec(
      css,
    )?.[1];
  };

  it("makes arrow links 44px tall on touch screens", () => {
    expect(css).toMatch(
      /@media \(pointer: coarse\)\s*\{\s*\.link-arrow\s*\{\s*min-height:\s*44px;/,
    );
  });

  it("lets the 38px '+3 more' circle tap as 44px", () => {
    const body = ruleBody(".w-more-trigger::after");
    expect(body).toMatch(/position:\s*absolute;/);
    expect(body).toMatch(/inset:\s*-3px;/);
  });

  it.each([".step4 .get b", ".badge", ".map-badge", ".office-tag"])(
    "sets %s to 11.5px (0.72rem)",
    (selector) => {
      expect(ruleBody(selector)).toMatch(/font-size:\s*0\.72rem;/);
    },
  );
});

// Shorter phone pages (lead, 2026-10-13).
describe("phone layouts", () => {
  const css = globalsCss();

  it("sizes flip cards to their longer face, one a row", () => {
    expect(css).toMatch(
      /@media \(width <= 640px\)\s*\{[^@]*\.flip-face\s*\{\s*position:\s*relative;\s*inset:\s*auto;\s*grid-area:\s*1 \/ 1;/,
    );
    expect(css).toMatch(
      /@media \(width <= 520px\)\s*\{\s*\.flip-cards\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\);/,
    );
  });

  it("puts the 4-D steps in a row to swipe through", () => {
    const block =
      /@media \(width < --theme\(--breakpoint-sm\)\)\s*\{\s*\.flow\s*\{([^}]*)\}\s*\.flow > \.step4\s*\{([^}]*)\}/.exec(
        css,
      );
    expect(block?.[1]).toMatch(/grid-auto-flow:\s*column;/);
    expect(block?.[1]).toMatch(/overflow-x:\s*auto;/);
    expect(block?.[1]).toMatch(/scroll-snap-type:\s*x mandatory;/);
    expect(block?.[2]).toMatch(/scroll-snap-align:\s*start;/);
  });

  it("pairs the footer link groups in two columns", () => {
    expect(css).toMatch(
      /@media \(max-width: 640px\)\s*\{\s*\.footer-grid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);[^}]*\}\s*\.footer-grid > :first-child,\s*\.footer-grid > :last-child\s*\{\s*grid-column:\s*1 \/ -1;/,
    );
  });
});
