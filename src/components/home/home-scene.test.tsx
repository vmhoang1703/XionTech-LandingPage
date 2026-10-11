import { render } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MOTION_KEY } from "@/lib/motion/motion-preference";
import { undefinedClasses } from "@/test-utils/css-classes";
import { HomeScene } from "./home-scene";

// No reduced motion: readMotionPaused reads matchMedia, which jsdom lacks.
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({ matches: false } as MediaQueryList),
  );
});

afterEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
});

const mount = () =>
  render(
    <HomeScene>
      <section>Story</section>
    </HomeScene>,
  );

describe("HomeScene", () => {
  it("draws the colour field in the server HTML, before the content", () => {
    const html = renderToString(
      <HomeScene>
        <section>Story</section>
      </HomeScene>,
    );
    expect(html).toContain('class="home-scene"');
    expect(html.indexOf('class="scene-bg"')).toBeLessThan(
      html.indexOf("<section>"),
    );
  });

  it("is three soft blobs, hidden from screen readers, behind the children", () => {
    const { container } = mount();

    const scene = container.querySelector(".home-scene") as HTMLElement;
    const layer = scene.firstElementChild as HTMLElement;
    expect(layer.className).toBe("scene-bg");
    expect(layer.getAttribute("aria-hidden")).toBe("true");
    expect(Array.from(layer.children).map((blob) => blob.className)).toEqual([
      "scene-blob scene-blob-blue",
      "scene-blob scene-blob-amber",
      "scene-blob scene-blob-warm",
    ]);
    expect(scene.lastElementChild?.textContent).toBe("Story");
    expect(undefinedClasses(container)).toEqual([]);
  });

  it("keeps moving unless a Pause was saved", () => {
    const { container } = mount();
    const scene = container.querySelector(".home-scene") as HTMLElement;
    expect(scene.dataset.paused).toBeUndefined();
  });

  it("holds the field still after a saved Pause", () => {
    localStorage.setItem(MOTION_KEY, "off");
    const { container } = mount();
    const scene = container.querySelector(".home-scene") as HTMLElement;
    expect(scene.dataset.paused).toBe("");
  });
});
