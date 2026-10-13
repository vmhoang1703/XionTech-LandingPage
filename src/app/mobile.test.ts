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

  // The body of the first @media block whose query matches, up to the next
  // top-level @media.
  const mediaBody = (query: string) => {
    const start = css.indexOf(`@media ${query} {`);
    expect(start).toBeGreaterThan(-1);
    const end = css.indexOf("\n@media", start + 1);
    return css.slice(start, end === -1 ? undefined : end);
  };

  it("sizes flip cards to their longer face on phones and tablets", () => {
    expect(css).toMatch(
      /@media \(width <= 640px\)\s*\{[^@]*\.flip-face\s*\{\s*position:\s*relative;\s*inset:\s*auto;\s*grid-area:\s*1 \/ 1;/,
    );
    const tablet = mediaBody("(640px <= width < 1080px)");
    expect(tablet).toMatch(
      /\.flip-face\s*\{\s*position:\s*relative;\s*inset:\s*auto;\s*grid-area:\s*1 \/ 1;/,
    );
  });

  it("puts the card sets in rows to swipe through", () => {
    const phone = mediaBody("(width < 640px)");
    const row =
      /\.flow,\s*\.app-cards,\s*\.flip-cards:not\(\.home-values \.flip-cards\),\s*\.sgrid-row\s*\{([^}]*)\}/.exec(
        phone,
      );
    expect(row?.[1]).toMatch(/grid-auto-flow:\s*column;/);
    expect(row?.[1]).toMatch(/grid-auto-columns:\s*84%;/);
    expect(row?.[1]).toMatch(/overflow-x:\s*auto;/);
    expect(row?.[1]).toMatch(/scroll-snap-type:\s*x mandatory;/);
    expect(phone).toMatch(
      /\.flow > \*,\s*\.app-cards > \*,\s*\.flip-cards:not\(\.home-values \.flip-cards\) > \*,\s*\.sgrid-row > \*\s*\{\s*scroll-snap-align:\s*start;/,
    );
  });

  it("makes story, service and Why cards shorter", () => {
    const phone = mediaBody("(width < 640px)");
    expect(phone).toMatch(
      /\.scard,\s*\.sgrid-row \.scard\s*\{\s*min-height:\s*250px;/,
    );
    expect(phone).toMatch(/#newsGrid \.scard\s*\{\s*aspect-ratio:\s*auto;/);
    expect(phone).toMatch(
      /#newsGrid \.s-lead \.scard\s*\{\s*min-height:\s*320px;/,
    );
    expect(phone).toMatch(/\.svc-card\s*\{\s*padding:\s*16px 18px;/);
    expect(phone).toMatch(
      /\.svc-card \.svc-card-tags\s*\{\s*margin-top:\s*4px;\s*font-size:\s*0\.8rem;/,
    );
    expect(phone).toMatch(/\.w-card\s*\{\s*min-height:\s*0;/);
  });

  it("shows Inside XionTech as a mosaic on phones", () => {
    const phone = mediaBody("(width < 640px)");
    expect(phone).toMatch(
      /\.ins-grid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);/,
    );
    expect(phone).toMatch(/\.ins-card\.big\s*\{\s*grid-column:\s*1 \/ -1;/);
  });

  it("puts dots under the swipe rows and shrinks the cards behind", () => {
    const dots = css.slice(css.indexOf("/* Swipe dots"));
    expect(dots).toMatch(
      /\.swipe-dots::after\s*\{[^}]*transform:\s*translateX\(calc\(var\(--i, 0\) \* 28px\)\);/,
    );
    expect(dots).toMatch(
      /\.swipe-dots button\s*\{[^}]*width:\s*28px;\s*height:\s*44px;/,
    );
    expect(dots).toMatch(
      /\[data-swipe="move"\] > :not\(\[data-active\]\)\s*\{\s*scale:\s*0\.94;/,
    );
    expect(dots).toMatch(
      /@media \(width >= 640px\)\s*\{\s*\.swipe-dots\s*\{\s*display:\s*none;/,
    );
  });

  it("puts the next steps after the four goals below 980px", () => {
    const goals = css.slice(
      css.indexOf("/* What can we help you achieve? (lead, 2026-10-13)"),
    );
    expect(goals).toMatch(
      /\.svc-split:has\(> \.goal-list\) > \.svc-stick\s*\{\s*display:\s*contents;/,
    );
    expect(goals).toMatch(/\.goal-ctas\s*\{\s*order:\s*1;/);
    expect(goals).toMatch(
      /@media \(width < 640px\)\s*\{\s*\.goal-ctas\s*\{\s*flex-direction:\s*column;\s*align-items:\s*stretch;/,
    );
  });

  it("sets the Why XionTech cards side by side on tablets", () => {
    const tablet = mediaBody("(640px <= width <= 900px)");
    expect(tablet).toMatch(
      /\.w-delivery,\s*\.w-industries\s*\{\s*grid-column:\s*span 6;/,
    );
    expect(tablet).toMatch(/\.w-card\s*\{\s*min-height:\s*0;/);
  });

  it("shows the hero figures as number and label rows", () => {
    const rows = css.slice(
      css.indexOf("/* Phones (lead, 2026-10-13): the hero figures as rows"),
    );
    expect(rows).toMatch(
      /\.home-stats ul\s*\{\s*grid-template-columns:\s*minmax\(0, 1fr\);/,
    );
    expect(rows).toMatch(
      /\.home-stats li\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*92px minmax\(0, 1fr\);/,
    );
  });

  it("uses the tablet width for doors and stories", () => {
    const tablet = mediaBody("(640px <= width < 1080px)");
    expect(tablet).toMatch(
      /\.doors-grid\s*\{\s*grid-template-columns:\s*1fr 1fr;/,
    );
    expect(tablet).toMatch(
      /\.sgrid-row\s*\{\s*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/,
    );
  });

  it("gives the tablet footer three link columns and offices side by side", () => {
    const footer = mediaBody("(640px <= width <= 1024px)");
    expect(footer).toMatch(
      /\.footer-grid\s*\{\s*grid-template-columns:\s*repeat\(3, 1fr\);/,
    );
    expect(footer).toMatch(
      /\.footer-grid > :last-child\s*\{\s*display:\s*grid;\s*grid-template-columns:\s*1fr 1fr;/,
    );
  });

  it("pairs the footer link groups in two columns, Company under Products", () => {
    expect(css).toMatch(
      /@media \(max-width: 640px\)\s*\{\s*\.footer-grid\s*\{\s*grid-template-columns:\s*repeat\(2, minmax\(0, 1fr\)\);[^}]*\}\s*\.footer-grid > :first-child,\s*\.footer-grid > :last-child\s*\{\s*grid-column:\s*1 \/ -1;/,
    );
    expect(mediaBody("(width < 640px)")).toMatch(
      /\.footer-grid > :nth-child\(3\)\s*\{\s*grid-row:\s*span 2;/,
    );
  });
});
