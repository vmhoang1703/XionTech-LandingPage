import { readdirSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";

vi.mock("node:fs", () => {
  const readdirSync = vi.fn();
  return { readdirSync, default: { readdirSync } };
});

import { LIFE_PHOTO_DIR, listLifePhotos } from "./life-photo-folder";

const entry = (name: string, file = true) => ({ name, isFile: () => file });

describe("listLifePhotos", () => {
  it("lists every image file, any name, sorted by filename", () => {
    vi.mocked(readdirSync).mockReturnValue([
      entry("zeta.PNG"),
      entry("IMG_10.JPG"),
      entry("IMG_9.jpeg"),
      entry("Image denny.jpg"),
      entry("a.avif"),
      entry("b.webp"),
      entry("notes.txt"),
      entry("phone.heic"),
      entry("nested.jpg", false),
    ] as never);
    expect(listLifePhotos()).toEqual([
      "/careers/life/a.avif",
      "/careers/life/b.webp",
      "/careers/life/Image%20denny.jpg",
      "/careers/life/IMG_9.jpeg",
      "/careers/life/IMG_10.JPG",
      "/careers/life/zeta.PNG",
    ]);
    expect(vi.mocked(readdirSync).mock.calls[0]?.[0]).toBe(LIFE_PHOTO_DIR);
    expect(LIFE_PHOTO_DIR.replaceAll("\\", "/")).toMatch(
      /public\/careers\/life$/,
    );
  });

  it("gives an empty list when the folder is missing", () => {
    vi.mocked(readdirSync).mockImplementation(() => {
      throw new Error("ENOENT");
    });
    expect(listLifePhotos()).toEqual([]);
  });
});
