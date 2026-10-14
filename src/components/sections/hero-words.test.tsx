import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { heroWords } from "./hero-words";

describe("heroWords", () => {
  it("makes one numbered span a word and keeps the spaces as text", () => {
    const t = heroWords();
    const html = renderToStaticMarkup(<h1>{t.words("Catch up with us")}</h1>);
    expect(html).toBe(
      '<h1><span data-hw="" style="--i:0">Catch</span> <span data-hw="" style="--i:1">up</span> <span data-hw="" style="--i:2">with</span> <span data-hw="" style="--i:3">us</span></h1>',
    );
  });

  it("keeps counting across parts, so a highlight is one more word", () => {
    const t = heroWords();
    const html = renderToStaticMarkup(
      <h1>
        {t.words("Software teams that ")}
        <span className="hl" {...t.unit()}>
          get IT done
        </span>
        .
      </h1>,
    );
    expect(html).toContain('<span data-hw="" style="--i:2">that</span> ');
    expect(html).toContain(
      '<span class="hl" data-hw="" style="--i:3">get IT done</span>.',
    );
    expect(html.replaceAll(/<[^>]*>/g, "")).toBe(
      "Software teams that get IT done.",
    );
  });
});
