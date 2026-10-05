// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

const { sanityFetchMock } = vi.hoisted(() => ({ sanityFetchMock: vi.fn() }));

vi.mock("@/lib/sanity/client", () => ({ sanityFetch: sanityFetchMock }));

import { getLifePhotos } from "./life-photos";

describe("getLifePhotos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches the careersPhotos document with the careersPhotos tag", async () => {
    sanityFetchMock.mockResolvedValue(null);

    await getLifePhotos();

    expect(sanityFetchMock).toHaveBeenCalledTimes(1);
    const { query, tags } = sanityFetchMock.mock.calls[0][0];
    expect(tags).toEqual(["careersPhotos"]);
    expect(query).toContain('_id == "careersPhotos"');
  });

  it("projects url, width, height, alt and caption for team, office and event", async () => {
    sanityFetchMock.mockResolvedValue(null);

    await getLifePhotos();

    const { query } = sanityFetchMock.mock.calls[0][0];
    for (const slot of ["team", "office", "event"]) {
      expect(query).toContain(`"${slot}": ${slot} `);
    }
    for (const line of [
      '"url": photo.asset->url',
      '"width": photo.asset->metadata.dimensions.width',
      '"height": photo.asset->metadata.dimensions.height',
      "alt",
      "caption",
    ]) {
      expect(query).toContain(line);
    }
  });

  it("returns the photos from the fetch", async () => {
    const photos = {
      team: {
        url: "https://cdn.sanity.io/images/1khn3hf4/production/a-1x1.jpg",
        width: 1200,
        height: 900,
        alt: "The team",
        caption: "Team day",
      },
      office: null,
      event: null,
    };
    sanityFetchMock.mockResolvedValue(photos);

    await expect(getLifePhotos()).resolves.toEqual(photos);
  });

  it("returns null when there is no photos document", async () => {
    sanityFetchMock.mockResolvedValue(null);

    await expect(getLifePhotos()).resolves.toBeNull();
  });

  it("returns null and logs one line when the fetch throws", async () => {
    const error = new Error("boom");
    sanityFetchMock.mockRejectedValue(error);
    const logSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(getLifePhotos()).resolves.toBeNull();

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith(
      "Careers photos: could not load the life photos from Sanity",
      error,
    );
    logSpy.mockRestore();
  });
});
