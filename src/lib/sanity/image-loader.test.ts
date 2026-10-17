import { describe, expect, it } from "vitest";
import { SANITY_QUALITY, sanityImageLoader } from "./image-loader";

const PHOTO = "https://cdn.sanity.io/images/1khn3hf4/production/abc.jpg";

describe("sanityImageLoader", () => {
  it("asks Sanity for the srcset width, in a modern format, never upscaled", () => {
    expect(sanityImageLoader({ src: PHOTO, width: 640 })).toBe(
      `${PHOTO}?w=640&q=${SANITY_QUALITY}&fit=max&auto=format`,
    );
  });

  it("uses the quality next/image passes", () => {
    expect(sanityImageLoader({ src: PHOTO, width: 320, quality: 60 })).toBe(
      `${PHOTO}?w=320&q=60&fit=max&auto=format`,
    );
  });

  it("replaces a width already on the URL", () => {
    expect(sanityImageLoader({ src: `${PHOTO}?w=1400`, width: 828 })).toBe(
      `${PHOTO}?w=828&q=${SANITY_QUALITY}&fit=max&auto=format`,
    );
  });
});
