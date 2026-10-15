import { act, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import { productDetails, type RoadApp } from "@/content/products";
import {
  DEVICE_OF,
  DeviceScreen,
  PLACEHOLDER_TAG,
  SLIDE_MS,
} from "./device-screen";

const shots = vi.hoisted(
  () =>
    ({ SCREENSHOTS: {} }) as {
      SCREENSHOTS: Record<string, readonly string[]>;
    },
);
vi.mock("./screenshots", async (importOriginal) => ({
  ...(await importOriginal<typeof import("./screenshots")>()),
  get SCREENSHOTS() {
    return shots.SCREENSHOTS;
  },
}));

const APPS: RoadApp[] = ["parent-hub", "staff-hub", "ai-tutor"];

describe("DeviceScreen wireframe", () => {
  it.each(APPS)(
    "%s: the product's name and its real features, nothing else to read",
    (app) => {
      shots.SCREENSHOTS = {};
      const { container } = render(<DeviceScreen app={app} />);
      const labels = Array.from(container.querySelectorAll(".ws-label")).map(
        (el) => el.textContent,
      );
      expect(labels).toEqual(
        productDetails[app].features.map((feature) => feature.title),
      );
      expect(container.querySelector(".ws-name")?.textContent).toBe(
        {
          "parent-hub": "Parent Hub",
          "staff-hub": "Staff Hub",
          "ai-tutor": "AI Tutor",
        }[app],
      );
      // Every word is the name, a feature, or the placeholder tag: no figures.
      const words = new Set([
        container.querySelector(".ws-name")?.textContent,
        ...labels,
        PLACEHOLDER_TAG,
      ]);
      const text = Array.from(container.querySelectorAll("*"))
        .filter((el) => el.children.length === 0)
        .map((el) => el.textContent)
        .filter(Boolean);
      for (const one of text) expect(words.has(one), one ?? "").toBe(true);
      expect(container.querySelector(".ws-tag")?.textContent).toBe(
        "[Placeholder] screen",
      );
    },
  );

  it("draws a phone layout for the phone, a dashboard for the laptop and a lesson for the monitor", () => {
    shots.SCREENSHOTS = {};
    const layout = (app: RoadApp) =>
      render(<DeviceScreen app={app} />).container.querySelector(".ws")
        ?.className;
    expect(DEVICE_OF).toEqual({
      "parent-hub": "phone",
      "staff-hub": "laptop",
      "ai-tutor": "monitor",
    });
    expect(layout("parent-hub")).toBe("ws ws-phone");
    expect(layout("staff-hub")).toBe("ws ws-dash");
    expect(layout("ai-tutor")).toBe("ws ws-lesson");
  });

  it("draws browser frames only on the web screens", () => {
    shots.SCREENSHOTS = {};
    const chrome = (app: RoadApp) =>
      render(<DeviceScreen app={app} />).container.querySelector(".ws-chrome");
    expect(chrome("parent-hub")).toBeNull();
    expect(chrome("staff-hub")).not.toBeNull();
    expect(chrome("ai-tutor")).not.toBeNull();
  });

  it("speaks Vietnamese in the feature names, product names in English", () => {
    shots.SCREENSHOTS = {};
    const { container } = render(
      <LocaleProvider locale="vi">
        <DeviceScreen app="parent-hub" />
      </LocaleProvider>,
    );
    expect(container.querySelector(".ws-name")?.textContent).toBe("Parent Hub");
    expect(container.querySelector(".ws-label")?.textContent).toBe(
      "Thông báo đến trường theo thời gian thực",
    );
  });
});

describe("DeviceScreen screenshots", () => {
  afterEach(() => vi.useRealTimers());

  const IMAGES = ["/a.webp", "/b.webp", "/c.webp"];
  const onIndex = (container: HTMLElement) =>
    Array.from(container.querySelectorAll("img.ws-image")).findIndex(
      (img) => img.getAttribute("data-on") === "true",
    );

  it("shows the screenshots instead of the wireframe, the first one first", () => {
    shots.SCREENSHOTS = {};
    const { container } = render(
      <DeviceScreen app="staff-hub" images={IMAGES} />,
    );
    const imgs = Array.from(container.querySelectorAll("img.ws-image"));
    expect(imgs.map((img) => img.getAttribute("src"))).toEqual(IMAGES);
    expect(imgs.every((img) => img.getAttribute("alt") === "")).toBe(true);
    expect(onIndex(container)).toBe(0);
    expect(container.querySelectorAll(".ws-dots i")).toHaveLength(3);
    expect(container.querySelector(".ws")).toBeNull();
    expect(container.textContent).not.toContain(PLACEHOLDER_TAG);
  });

  it("moves to the next screenshot every SLIDE_MS when it plays, and wraps", () => {
    vi.useFakeTimers();
    const { container } = render(
      <DeviceScreen app="ai-tutor" images={IMAGES} play />,
    );
    act(() => {
      vi.advanceTimersByTime(SLIDE_MS);
    });
    expect(onIndex(container)).toBe(1);
    expect(
      container.querySelector(".ws-dots i[data-on]") ===
        container.querySelectorAll(".ws-dots i")[1],
    ).toBe(true);
    act(() => {
      vi.advanceTimersByTime(SLIDE_MS * 2);
    });
    expect(onIndex(container)).toBe(0);
  });

  it("stays on the first screenshot when still (reduced motion, Pause)", () => {
    vi.useFakeTimers();
    const { container } = render(
      <DeviceScreen app="ai-tutor" images={IMAGES} />,
    );
    act(() => {
      vi.advanceTimersByTime(SLIDE_MS * 3);
    });
    expect(onIndex(container)).toBe(0);
  });

  it("shows one screenshot without dots or a timer", () => {
    vi.useFakeTimers();
    const { container } = render(
      <DeviceScreen app="ai-tutor" images={["/only.webp"]} play />,
    );
    act(() => {
      vi.advanceTimersByTime(SLIDE_MS * 2);
    });
    expect(onIndex(container)).toBe(0);
    expect(container.querySelector(".ws-dots")).toBeNull();
  });

  it("uses the screenshots of screenshots.ts, for that product only", () => {
    shots.SCREENSHOTS = { "parent-hub": ["/screens/parent-hub.png"] };
    const parent = render(<DeviceScreen app="parent-hub" />).container;
    expect(parent.querySelector("img")?.getAttribute("src")).toBe(
      "/screens/parent-hub.png",
    );
    const staff = render(<DeviceScreen app="staff-hub" />).container;
    expect(staff.querySelector("img")).toBeNull();
    expect(staff.querySelector(".ws-tag")).not.toBeNull();
  });
});

describe("screenshots.ts", () => {
  it("lists four real screenshots per product, in public/products", async () => {
    const { existsSync } = await import("node:fs");
    const { SCREENSHOTS } =
      await vi.importActual<typeof import("./screenshots")>("./screenshots");
    for (const app of ["parent-hub", "staff-hub", "ai-tutor"] as const) {
      const list = SCREENSHOTS[app] ?? [];
      expect(list).toHaveLength(4);
      for (const src of list) {
        expect(src.startsWith(`/products/${app}/`)).toBe(true);
        expect(existsSync(`public${src}`)).toBe(true);
      }
    }
  });
});
