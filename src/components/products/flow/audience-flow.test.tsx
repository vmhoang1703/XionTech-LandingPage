import { act, render, screen, within } from "@testing-library/react";
import { motionValue } from "motion";
import { useScroll } from "motion/react";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { audienceFlow, FEATURE_PLACEHOLDER } from "@/content/products";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { AudienceFlow } from "./audience-flow";
import { chapterAt } from "./campus-scene";
import { activeChapter } from "./flow-progress";

// The scene has its own tests (campus-canvas.test.tsx); here it only shows
// the progress it is given.
vi.mock("./campus-canvas", () => ({
  CampusCanvas: ({ progress }: { progress: number }) => (
    <div data-testid="campus" data-progress={progress} />
  ),
}));

// jsdom has no layout, so the scroll progress is driven by hand.
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useScroll: vi.fn(),
}));

let scrollYProgress = motionValue(0);

beforeEach(() => {
  scrollYProgress = motionValue(0);
  vi.mocked(useScroll).mockReturnValue({
    scrollX: motionValue(0),
    scrollY: motionValue(0),
    scrollXProgress: motionValue(0),
    scrollYProgress,
  });
});

function chapterItems(container: HTMLElement) {
  return Array.from(container.querySelectorAll(".flow-chapters > li"));
}

const ANCHORS = ["#pxp", "#sxp", "#ai-tutor", "#iot"];

describe("AudienceFlow", () => {
  it("is the #flow section with one H1 and the lede", () => {
    const { container } = render(<AudienceFlow />);
    expect(container.querySelector("section#flow")).not.toBeNull();
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s.map((h) => h.textContent)).toEqual([
      "Built apart. Better together.",
    ]);
    expect(screen.getByText(audienceFlow.intro.lede)).toBeDefined();
  });

  it("lists the 4 chapters in order, each linking to its card anchor", () => {
    const { container } = render(<AudienceFlow />);
    const items = chapterItems(container);
    expect(items).toHaveLength(4);
    expect(
      items.map((li) => li.querySelector(":scope > h2")?.textContent),
    ).toEqual(["Parent", "Teacher and staff", "Student", "Campus"]);
    expect(
      items.map((li) => {
        const links = within(li as HTMLElement).getAllByRole("link");
        return links.map((a) => [a.getAttribute("href"), a.textContent]);
      }),
    ).toEqual([
      [[ANCHORS[0], "See Parent Hub details"]],
      [[ANCHORS[1], "See Staff Hub details"]],
      [[ANCHORS[2], "See AI Tutor details"]],
      [[ANCHORS[3], "See IoT Device Management details"]],
    ]);
  });

  it.each(audienceFlow.chapters.map((c, i) => [c.id, i] as const))(
    "shows the %s chapter's app, Made for line and steps as h3 + description",
    (_id, index) => {
      const chapter = audienceFlow.chapters[index];
      const { container } = render(<AudienceFlow />);
      const li = chapterItems(container)[index] as HTMLElement;
      expect(within(li).getByText(chapter.app.fullName)).toBeDefined();
      expect(li.textContent).toContain(`Made for ${chapter.madeFor}`);
      expect(within(li).getByText(chapter.tagline)).toBeDefined();
      const steps = within(li).getAllByRole("heading", { level: 3 });
      expect(steps.map((h) => h.textContent)).toEqual(
        chapter.steps.map((s) => s.title),
      );
      for (const h3 of steps) {
        expect(h3.nextElementSibling?.textContent).toBe(FEATURE_PLACEHOLDER);
      }
    },
  );

  it("server-renders every chapter and step visible, with no active state", () => {
    const html = renderToString(<AudienceFlow />);
    const host = document.createElement("div");
    host.innerHTML = html;
    const items = chapterItems(host);
    expect(items).toHaveLength(4);
    for (const [index, chapter] of audienceFlow.chapters.entries()) {
      const titles = items[index].querySelectorAll("h3");
      expect(Array.from(titles, (h) => h.textContent)).toEqual(
        chapter.steps.map((s) => s.title),
      );
    }
    expect(html).not.toContain("data-active");
    expect(host.querySelector(".flow-chapters [hidden]")).toBeNull();
  });

  it("uses only classes that globals.css defines", () => {
    const { container } = render(<AudienceFlow />);
    expect(undefinedClasses(container)).toEqual([]);
  });

  it("measures scroll over the chapter list", () => {
    const { container } = render(<AudienceFlow />);
    const [options] = vi.mocked(useScroll).mock.lastCall ?? [];
    expect(options?.target?.current).toBe(
      container.querySelector("ol.flow-chapters"),
    );
  });

  it("marks the chapter under the scroll progress active and passes progress to the scene", () => {
    const { container } = render(<AudienceFlow />);
    const states = () =>
      chapterItems(container).map((li) => li.getAttribute("data-active"));
    expect(states()).toEqual(["true", "false", "false", "false"]);
    expect(screen.getByTestId("campus").dataset.progress).toBe("0");

    act(() => scrollYProgress.set(0.6));
    expect(states()).toEqual(["false", "false", "true", "false"]);
    expect(screen.getByTestId("campus").dataset.progress).toBe("0.6");

    act(() => scrollYProgress.set(1));
    expect(states()).toEqual(["false", "false", "false", "true"]);
  });
});

// The declarations of the rule whose selector list holds `selector`.
function ruleFor(selector: string) {
  const css = globalsCss().replaceAll(/\/\*[\s\S]*?\*\//g, "");
  const rule = [...css.matchAll(/([^{}]+)\{([^{}]*)\}/g)].find(([, list]) =>
    list.split(",").some((s) => s.replaceAll(/\s+/g, " ").trim() === selector),
  );
  return rule?.[2].replaceAll(/\s+/g, " ").trim();
}

describe("chapters as a plain list", () => {
  it("dims the inactive chapters only once JavaScript marks them", () => {
    expect(ruleFor('.flow-chapter[data-active="false"]')).toBe("opacity: 0.8;");
  });

  it("stops dimming while the visitor has paused the motion", () => {
    expect(
      ruleFor(
        '.flow-body:has(.flow-canvas[data-paused="true"]) .flow-chapter[data-active="false"]',
      ),
    ).toBe("opacity: 1;");
  });
});

describe("activeChapter", () => {
  it.each([-0.2, 0, 0.1, 0.2499, 0.25, 0.4, 0.5, 0.74, 0.75, 0.99, 1, 1.3])(
    "agrees with chapterAt at %s",
    (progress) => {
      const index = activeChapter(progress, audienceFlow.chapters.length);
      expect(audienceFlow.chapters[index]?.id).toBe(chapterAt(progress).id);
    },
  );
});
