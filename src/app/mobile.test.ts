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

// Touch fixes from the behaviour audit (lead, 2026-10-13).
describe("touch behaviour", () => {
  const css = globalsCss();

  it("keeps form fields at 16px so iPhone Safari does not zoom in", () => {
    expect(css).toMatch(
      /\.field input,\s*\.field select,\s*\.field textarea\s*\{[^}]*font-size:\s*1rem;/,
    );
  });

  it("drops the tooltip underline on HCMC on touch screens", () => {
    expect(css).toMatch(
      /@media \(hover: none\)\s*\{\s*\.w-chip abbr\s*\{\s*text-decoration:\s*none;/,
    );
  });
});

// Round 4 picks (lead, 2026-10-13): 4C 5B 6B 7C 9B 10B.
describe("behaviour and touch", () => {
  const css = globalsCss();

  it("shows the job Apply bar only below 900px, sliding in from the foot", () => {
    expect(css).toMatch(
      /\.apply-bar\s*\{[^}]*position:\s*fixed;[^}]*translate:\s*0 110%;/,
    );
    expect(css).toMatch(/\.apply-bar\[data-shown\]\s*\{\s*translate:\s*none;/);
    expect(css).toMatch(
      /@media \(width >= 900px\)\s*\{\s*\.apply-bar\s*\{\s*display:\s*none;/,
    );
  });

  it("slides the header away below 1080px when the script marks it hidden", () => {
    expect(css).toMatch(
      /@media \(width < 1080px\)\s*\{\s*header\[data-hidden\]\s*\{\s*translate:\s*0 -110%;/,
    );
  });

  it("presses buttons and cards in on touch screens", () => {
    const touch = css.slice(css.indexOf("/* Press on touch screens"));
    expect(touch).toMatch(
      /\.btn:not\(:disabled, \[aria-disabled="true"\]\):active\s*\{\s*transform:\s*scale\(0\.96\);/,
    );
    expect(touch).toMatch(
      /\.door:active,\s*\.app-card:active,\s*\.scard:active,\s*\.flip-card:active\s*\{\s*scale:\s*0\.96;/,
    );
  });

  it("turns the FAQ + into an x and fades the answer in", () => {
    expect(css).toMatch(
      /\.faq details\[open\] summary::after\s*\{\s*content:\s*"\+";\s*rotate:\s*45deg;/,
    );
    expect(css).toMatch(
      /\.faq details\[open\] > p\s*\{\s*animation:\s*faq-open/,
    );
  });

  it("puts the news filters in one row to swipe on phones", () => {
    const chips = css.slice(css.indexOf("/* News filters on phones"));
    expect(chips).toMatch(
      /\.filters\s*\{\s*flex-wrap:\s*nowrap;\s*min-inline-size:\s*0;/,
    );
  });

  it("gives the phone menu's phone links 44px to tap", () => {
    expect(css).toMatch(/\.mm-phones a\s*\{[^}]*min-height:\s*44px;/);
  });
});

// Amber's prototype motion (lead, 2026-10-13: 1B 3B 4B 5B).
describe("prototype motion", () => {
  const css = globalsCss();
  const keyframes = (name: string) => {
    const start = css.indexOf(`@keyframes ${name} {`);
    expect(start, name).toBeGreaterThan(-1);
    return css.slice(start, css.indexOf("\n}", start));
  };

  it.each(["press-word", "card-unfold", "icon-pop", "w-up", "w-pop"])(
    "%s animates only transform, translate, rotate, scale and opacity",
    (name) => {
      const props = [...keyframes(name).matchAll(/^\s+([a-z-]+):/gm)].map(
        (match) => match[1],
      );
      expect(props.length).toBeGreaterThan(0);
      for (const prop of props) {
        expect([
          "transform",
          "translate",
          "rotate",
          "scale",
          "opacity",
        ]).toContain(prop);
      }
    },
  );

  it("plays the icon pop for a mouse only, and every new motion has a reduced-motion version", () => {
    expect(css).toMatch(
      /@media \(hover: hover\) and \(prefers-reduced-motion: no-preference\)\s*\{\s*\.svc-card:hover \.svc-card-h svg\s*\{\s*animation:\s*icon-pop/,
    );
    for (const name of ["press-word", "w-up"]) {
      const use = css.indexOf(`animation: ${name}`);
      const block = css.lastIndexOf("@media", use);
      expect(css.slice(block, use), name).toContain(
        "prefers-reduced-motion: no-preference",
      );
    }
  });

  it("holds the mountain story only once the script arms it", () => {
    expect(css).toMatch(
      /\.mtn\[data-armed\] \.mtn-pin\s*\{\s*position:\s*sticky;/,
    );
    expect(css).toMatch(/\.mtn-rise\s*\{[^}]*overflow:\s*hidden;/);
  });
});

// Hero entrance (lead, 2026-10-14: B, every page opens the same way).
describe("hero entrance", () => {
  const css = globalsCss();
  const block = css.slice(css.indexOf("/* ---------- Hero entrance"));

  it("plays only without reduced motion, with fixed delays", () => {
    const media = block.slice(
      block.indexOf("@media (prefers-reduced-motion: no-preference)"),
    );
    expect(media).toMatch(
      /h1 \[data-hw\]\s*\{\s*animation:\s*press-word 0\.7s[^;]*calc\(min\(var\(--i\), 8\) \* 80ms\) both;/,
    );
    expect(media).toMatch(
      /h1:has\(\[data-hw\]\) ~ :is\(p, ul\.chips, ul\.list-check\)\s*\{\s*animation:[^;]*0\.55s both;/,
    );
    expect(media).toMatch(
      /h1:has\(\[data-hw\]\) ~ :is\(\.cta-row, \.btn, \.ah-links\)\s*\{\s*animation:[^;]*0\.7s both;/,
    );
    expect(media).toMatch(
      /h1:has\(\[data-hw\]\) \.hl::after\s*\{\s*animation:\s*hl-draw 1s 0\.9s/,
    );
  });

  it("moves with opacity, translate and rotate only", () => {
    const start = css.indexOf("@keyframes press-word {");
    const frames = css.slice(start, css.indexOf("\n}", start));
    const props = [...frames.matchAll(/^\s+([a-z-]+):/gm)].map((m) => m[1]);
    expect(props.sort()).toEqual(["opacity", "rotate", "translate"]);
  });
});
