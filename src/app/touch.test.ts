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
