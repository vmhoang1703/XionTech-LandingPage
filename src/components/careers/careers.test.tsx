import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenRole } from "@/lib/careers/open-roles";
import { undefinedClasses } from "@/test-utils/css-classes";
vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));

import { Benefits } from "./benefits";
import { CareersHero } from "./careers-hero";
import { Culture } from "./culture";
import { LifeFrames } from "./life-frames";
import { OpenRoles } from "./open-roles";

// jsdom has no canvas: HeroArt skips the ribbon.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
});

const roles: OpenRole[] = [
  {
    slug: "qa-engineer",
    title: "QA Engineer",
    team: "Quality",
    location: "Ho Chi Minh City",
    type: "full-time",
  },
  { slug: "designer", title: "Designer" },
];

describe("CareersHero", () => {
  it("shows the H1 with the highlight and breadcrumbs", () => {
    const { container } = render(<CareersHero />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Build what schools use every day.",
      }),
    ).not.toBeNull();
    expect(container.querySelector("h1 .hl")?.textContent).toBe("every day");
    expect(
      within(screen.getByRole("navigation", { name: "Breadcrumb" })).getByRole(
        "link",
        { name: "Home" },
      ),
    ).toHaveProperty("pathname", "/");
  });

  it("points the buttons to #roles and #life", () => {
    render(<CareersHero />);

    expect(
      screen.getByRole("link", { name: "See open roles" }).getAttribute("href"),
    ).toBe("#roles");
    expect(
      screen
        .getByRole("link", { name: "Life at XionTech" })
        .getAttribute("href"),
    ).toBe("#life");
  });
});

describe("Culture", () => {
  it("shows the heading, three bullets and the placeholder photo frame", () => {
    render(<Culture />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "A culture that goes beyond employment.",
      }),
    ).not.toBeNull();
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("[Placeholder] Photo")).not.toBeNull();
  });
});

describe("Benefits", () => {
  it("shows the four benefit cards", () => {
    render(<Benefits />);

    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Innovative workspace",
      "Growth opportunities",
      "Engaging work",
      "Meaningful impact",
    ]);
  });
});

describe("OpenRoles", () => {
  it("renders each role as one link to its slug with no nested control", () => {
    render(<OpenRoles roles={roles} />);

    const links = screen.getAllByRole("link");
    expect(links.map((link) => link.getAttribute("href"))).toEqual([
      "/careers/qa-engineer",
      "/careers/designer",
    ]);
    for (const link of links) {
      expect(within(link).queryByRole("link")).toBeNull();
      expect(within(link).queryByRole("button")).toBeNull();
    }
    expect(links[0].textContent).toBe(
      "QA EngineerQuality · Ho Chi Minh City · Full-timeView and apply",
    );
    expect(links[1].textContent).toBe("DesignerView and apply");
  });

  it("shows the empty panel and no card when there are no roles", () => {
    render(<OpenRoles roles={[]} />);

    expect(screen.getByText("No open roles right now.")).not.toBeNull();
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("uses #roles as the section id", () => {
    const { container } = render(<OpenRoles roles={roles} />);

    expect(container.querySelector("section#roles")).not.toBeNull();
  });
});

describe("LifeFrames", () => {
  it("lets each frame shrink to its 4:3 box, so the caption is never clipped", () => {
    const { container } = render(<LifeFrames />);
    const frames = container.querySelectorAll("#life .spot .illo");
    expect(frames).toHaveLength(3);
    for (const frame of frames) {
      expect(frame.classList.contains("min-h-0")).toBe(true);
    }
  });

  it("shows three placeholder frames inside #life, none clickable", () => {
    const { container } = render(<LifeFrames />);

    expect(container.querySelector("section#life")).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Life at XionTech." }),
    ).not.toBeNull();
    for (const caption of [
      "[Placeholder] Team photo",
      "[Placeholder] Office photo",
      "[Placeholder] Event photo",
    ]) {
      expect(screen.getByText(caption)).not.toBeNull();
    }
    expect(container.querySelectorAll(".illo")).toHaveLength(3);
    expect(screen.queryByRole("link")).toBeNull();
    expect(screen.queryByRole("button")).toBeNull();
  });
});

describe("Careers sections", () => {
  it("use only classes that globals.css defines", () => {
    const { container } = render(
      <>
        <CareersHero />
        <Culture />
        <Benefits />
        <OpenRoles roles={roles} />
        <OpenRoles roles={[]} />
        <LifeFrames />
      </>,
    );

    expect(
      undefinedClasses(
        container,
        /^(mt|mb|gap|min-h|h|aspect)-|^flex(-wrap)?$/,
      ),
    ).toEqual([]);
  });
});
