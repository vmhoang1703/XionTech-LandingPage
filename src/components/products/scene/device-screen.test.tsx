import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import { productDetails, type RoadApp } from "@/content/products";
import { DEVICE_OF, DeviceScreen, PLACEHOLDER_TAG } from "./device-screen";

const shots = vi.hoisted(
  () => ({ SCREENSHOTS: {} }) as { SCREENSHOTS: Record<string, string> },
);
vi.mock("./screenshots", () => shots);

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
      "Thông báo khi con qua cổng trường",
    );
  });
});

describe("DeviceScreen screenshot", () => {
  it("shows the image given to it instead of the wireframe", () => {
    shots.SCREENSHOTS = {};
    const { container } = render(
      <DeviceScreen app="staff-hub" image="/screens/staff-hub.png" />,
    );
    const img = container.querySelector("img.ws-image");
    expect(img?.getAttribute("src")).toBe("/screens/staff-hub.png");
    expect(img?.getAttribute("alt")).toBe("");
    expect(container.querySelector(".ws")).toBeNull();
    expect(container.textContent).not.toContain(PLACEHOLDER_TAG);
  });

  it("shows the screenshot added in screenshots.ts, for that product only", () => {
    shots.SCREENSHOTS = { "parent-hub": "/screens/parent-hub.png" };
    const parent = render(<DeviceScreen app="parent-hub" />).container;
    expect(parent.querySelector("img")?.getAttribute("src")).toBe(
      "/screens/parent-hub.png",
    );
    const staff = render(<DeviceScreen app="staff-hub" />).container;
    expect(staff.querySelector("img")).toBeNull();
    expect(staff.querySelector(".ws-tag")).not.toBeNull();
  });
});
