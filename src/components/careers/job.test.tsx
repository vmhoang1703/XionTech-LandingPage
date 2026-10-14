import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { OpenRoleDetail } from "@/lib/careers/open-roles";
import { undefinedClasses } from "@/test-utils/css-classes";
vi.mock("@/lib/sanity/client", () => ({ sanityFetch: vi.fn() }));

import { JobDetails } from "./job-details";
import { JobHero } from "./job-hero";

// jsdom has no canvas: HeroArt skips the ribbon.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
  // jsdom has no IntersectionObserver: the Apply bar stays hidden.
  vi.stubGlobal(
    "IntersectionObserver",
    class {
      observe() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

const full: OpenRoleDetail = {
  slug: "qa-engineer",
  title: "QA Engineer",
  team: "Quality",
  location: "Ho Chi Minh City",
  type: "full-time",
  about: "First paragraph.\n\n  Second paragraph.  \n\n\n\n",
  responsibilities: ["Write tests", "Report bugs"],
  requirements: ["Curiosity"],
};

describe("JobHero", () => {
  it("shows crumbs with the title as the current page, the H1 and chips", () => {
    render(<JobHero role={full} />);

    const nav = screen.getByRole("navigation", { name: "Breadcrumb" });
    expect(within(nav).getByRole("link", { name: "Home" })).toHaveProperty(
      "pathname",
      "/",
    );
    expect(within(nav).getByRole("link", { name: "Careers" })).toHaveProperty(
      "pathname",
      "/careers",
    );
    const current = nav.querySelector('[aria-current="page"]');
    expect(current?.textContent).toBe("QA Engineer");
    expect(current?.tagName).toBe("SPAN");
    expect(
      screen.getByRole("heading", { level: 1, name: "QA Engineer" }),
    ).not.toBeNull();

    const items = within(
      screen.getByRole("list", { name: "Role details" }),
    ).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "Quality",
      "Ho Chi Minh City",
      "Full-time",
    ]);
  });

  it("leaves out an empty chip", () => {
    render(<JobHero role={{ ...full, team: null, type: "weekend" }} />);

    const items = within(
      screen.getByRole("list", { name: "Role details" }),
    ).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual(["Ho Chi Minh City"]);
  });

  it("shows no list when team, location and type are all empty", () => {
    render(<JobHero role={{ slug: "a", title: "A" }} />);

    expect(screen.queryByRole("list")).toBeNull();
  });
});

describe("JobDetails", () => {
  it("shows the about paragraphs, both lists, the back link and the form slot", () => {
    const { container } = render(
      <JobDetails role={full}>
        <p>form here</p>
      </JobDetails>,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "About the role" }),
    ).not.toBeNull();
    const paragraphs = [...container.querySelectorAll(".job-body > p")].map(
      (p) => p.textContent,
    );
    expect(paragraphs.slice(0, 2)).toEqual([
      "First paragraph.",
      "Second paragraph.",
    ]);
    expect(paragraphs).toHaveLength(3);

    expect(
      screen.getByRole("heading", { level: 2, name: "What you'll do" }),
    ).not.toBeNull();
    expect(
      screen.getByRole("heading", { level: 2, name: "What you bring" }),
    ).not.toBeNull();
    const lists = container.querySelectorAll("ul.list-check");
    expect([...lists].map((l) => l.querySelectorAll("li").length)).toEqual([
      2, 1,
    ]);
    expect(lists[0]?.querySelector("li svg")).not.toBeNull();

    expect(
      screen.getByRole("link", { name: "All open roles" }).getAttribute("href"),
    ).toBe("/careers#roles");

    const apply = container.querySelector("#apply");
    expect(apply?.classList.contains("form-card")).toBe(true);
    expect(within(apply as HTMLElement).getByText("form here")).not.toBeNull();
  });

  it("hides every empty section with its heading", () => {
    render(
      <JobDetails role={{ slug: "a", title: "A", responsibilities: [] }}>
        <span />
      </JobDetails>,
    );

    expect(screen.queryByRole("heading", { level: 2 })).toBeNull();
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByRole("link", { name: "All open roles" })).not.toBeNull();
  });

  it("hides the about section when it has only blank lines", () => {
    render(
      <JobDetails role={{ slug: "a", title: "A", about: "\n\n  \n\n" }}>
        <span />
      </JobDetails>,
    );

    expect(
      screen.queryByRole("heading", { name: "About the role" }),
    ).toBeNull();
  });
});

describe("job page classes", () => {
  it("only uses classes that globals.css defines", () => {
    const { container } = render(
      <>
        <JobHero role={full} />
        <JobDetails role={full}>
          <span />
        </JobDetails>
      </>,
    );

    expect(
      undefinedClasses(
        container,
        /^(mt|mb|gap|min-h|h|aspect|items)-|^flex(-wrap)?$/,
      ),
    ).toEqual([]);
  });
});
