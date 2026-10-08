import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenRole } from "@/lib/careers/open-roles";
import { undefinedClasses } from "@/test-utils/css-classes";
vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));

import { CareersHero } from "./careers-hero";
import { FlipCards } from "./flip-cards";
import { Inside } from "./inside";
import { LifeFrames } from "./life-frames";
import { OpenRoles } from "./open-roles";

// The growth ring reads reduced motion and watches the viewport.
beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: true })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
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
  it("shows the two-line H1, the lede and no breadcrumb", () => {
    const { container } = render(<CareersHero />);

    const h1 = screen.getByRole("heading", { level: 1 });
    expect(h1.textContent).toBe("Stay curious.Build what’s next.");
    expect(h1.querySelector("br")).not.toBeNull();
    expect(container.querySelector(".lede")?.textContent).toMatch(
      /^We’re building a team for people who learn fast/,
    );
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(container.querySelector(".hero-light.careers-hero")).not.toBeNull();
  });

  it("points Explore open roles to #roles and shows the growth ring", () => {
    const { container } = render(<CareersHero />);

    expect(
      screen
        .getByRole("link", { name: "Explore open roles" })
        .getAttribute("href"),
    ).toBe("#roles");
    expect(container.querySelector(".ch-grid figure.cycle")).not.toBeNull();
  });
});

describe("Inside", () => {
  it("shows #life with the heading and five tiles in the prototype order", () => {
    const { container } = render(<Inside />);

    expect(container.querySelector("section#life")).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "Inside XionTech." }),
    ).not.toBeNull();
    expect(
      screen
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual([
      "Workshops & experiments",
      "Client visits",
      "Town halls",
      "Project kickoffs",
      "[Placeholder] Celebration",
    ]);
    expect(
      [...container.querySelectorAll(".ins-card")].map(
        (tile) => tile.className,
      ),
    ).toEqual([
      "ins-card big",
      "ins-card yellow",
      "ins-card cream",
      "ins-card cream",
      "ins-card",
    ]);
    expect(screen.queryByRole("link")).toBeNull();
  });
});

describe("FlipCards", () => {
  it("shows the heading, the [Placeholder] note and five numbered flip buttons", () => {
    render(<FlipCards />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Five things that shape the way we work.",
      }),
    ).not.toBeNull();
    expect(
      screen.getByText(
        "[Placeholder] These five values are waiting for confirmation.",
      ),
    ).not.toBeNull();
    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(5);
    expect(
      buttons.map((b) => b.querySelector(".flip-front .flip-num")?.textContent),
    ).toEqual(["01", "02", "03", "04", "05"]);
    expect(
      buttons.map(
        (b) => b.querySelector(".flip-front .flip-title")?.textContent,
      ),
    ).toEqual([
      "Stay agile",
      "Own the outcome",
      "Innovate with purpose",
      "Grow together",
      "Get IT Done",
    ]);
    for (const button of buttons) {
      expect(button.getAttribute("aria-pressed")).toBe("false");
      expect(button.querySelector("svg.flip-ill")).not.toBeNull();
    }
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

  it("shows a photo with alt text and caption, and keeps the placeholder for empty slots", () => {
    const { container } = render(
      <LifeFrames
        photos={{
          team: {
            url: "https://cdn.sanity.io/images/1khn3hf4/production/team.jpg",
            alt: "The team at a desk",
            caption: "Our team",
          },
          office: null,
          event: { url: null, alt: "x", caption: "y" },
        }}
      />,
    );

    const image = screen.getByAltText("The team at a desk");
    expect(image.getAttribute("src")).toBe(
      "https://cdn.sanity.io/images/1khn3hf4/production/team.jpg?w=800&auto=format",
    );
    expect(screen.getByText("Our team")).not.toBeNull();
    expect(screen.queryByText("[Placeholder] Team photo")).toBeNull();
    expect(screen.getByText("[Placeholder] Office photo")).not.toBeNull();
    expect(screen.getByText("[Placeholder] Event photo")).not.toBeNull();
    expect(container.querySelectorAll(".illo")).toHaveLength(2);
  });

  it.each([null, "   "])(
    "keeps the placeholder when a photo's alt text is %j",
    (alt) => {
      render(
        <LifeFrames
          photos={{
            team: {
              url: "https://cdn.sanity.io/images/1khn3hf4/production/team.jpg",
              alt,
            },
          }}
        />,
      );

      expect(screen.queryByRole("img")).toBeNull();
      expect(screen.getByText("[Placeholder] Team photo")).not.toBeNull();
    },
  );

  it("keeps the other placeholders when one photo has no alt text", () => {
    render(
      <LifeFrames
        photos={{
          team: {
            url: "https://cdn.sanity.io/images/1khn3hf4/production/team.jpg",
            alt: null,
          },
        }}
      />,
    );

    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("[Placeholder] Team photo")).not.toBeNull();
  });

  it("shows no caption text when a photo has none", () => {
    const { container } = render(
      <LifeFrames
        photos={{
          team: {
            url: "https://cdn.sanity.io/images/1khn3hf4/production/team.jpg",
            alt: "The team",
          },
        }}
      />,
    );

    expect(screen.getByAltText("The team")).not.toBeNull();
    expect(container.querySelector("figcaption")).toBeNull();
  });
});

describe("Careers sections", () => {
  it("use only classes that globals.css defines", () => {
    const { container } = render(
      <>
        <CareersHero />
        <Inside />
        <FlipCards />
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
