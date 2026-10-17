import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SanityImage } from "./sanity-image";

const PHOTO = "https://cdn.sanity.io/images/1khn3hf4/production/abc.jpg";

describe("SanityImage", () => {
  it("builds a srcset of Sanity-resized widths for the layout size", () => {
    const { container } = render(
      <SanityImage src={PHOTO} alt="Team" fill sizes="50vw" />,
    );
    const img = container.querySelector("img");

    expect(img?.getAttribute("alt")).toBe("Team");
    expect(img?.getAttribute("sizes")).toBe("50vw");
    expect(img?.getAttribute("srcset")).toContain(
      `${PHOTO}?w=640&q=75&fit=max&auto=format 640w`,
    );
    expect(img?.getAttribute("loading")).toBe("lazy");
  });
});
