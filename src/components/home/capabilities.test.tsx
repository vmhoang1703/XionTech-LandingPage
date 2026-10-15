import { render, screen, within } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { undefinedClasses } from "@/test-utils/css-classes";
import { homeCapabilities } from "@/content/home";
import { Capabilities } from "./capabilities";

describe("Capabilities", () => {
  it("is Why XionTech, with a lede and the two cards", () => {
    render(<Capabilities />);

    const region = screen.getByRole("region", { name: "Why XionTech" });
    expect(within(region).getByText(homeCapabilities.lede)).toBeDefined();
    expect(
      within(region)
        .getAllByRole("heading", { level: 3 })
        .map((h) => h.textContent),
    ).toEqual([
      homeCapabilities.delivery.title,
      homeCapabilities.industries.title,
    ]);
  });

  it("drops the products and services cards: the doors and app cards link there", () => {
    render(<Capabilities />);

    const region = screen.getByRole("region", { name: "Why XionTech" });
    expect(within(region).queryAllByRole("link")).toEqual([]);
    expect(region.querySelector(".badge")).toBeNull();
  });

  it("shows both offices: zone label in the server HTML, then the time", () => {
    const html = renderToString(<Capabilities />);
    expect(html).toContain("US Central");
    expect(html).toContain("GMT+7");

    render(<Capabilities />);
    const chips = screen.getAllByText(/^\d{2}:\d{2}$/);
    expect(chips).toHaveLength(2);
    expect(screen.getByText("HCMC").getAttribute("title")).toBe(
      "Ho Chi Minh City",
    );
  });

  it("names the zone and the city in Vietnamese on vi", () => {
    const html = renderToString(<Capabilities locale="vi" />);
    expect(html).toContain("Giờ miền Trung Mỹ");
    expect(html).not.toContain("US Central");

    render(<Capabilities locale="vi" />);
    expect(screen.getByText("HCMC").getAttribute("title")).toBe(
      "TP. Hồ Chí Minh",
    );
  });

  it("shows Education and the other industries as plain chips, with no reveal button", () => {
    const { industries } = homeCapabilities;
    const html = renderToString(<Capabilities />);
    for (const name of [industries.main, ...industries.more]) {
      expect(html).toContain(name);
    }

    const { container } = render(<Capabilities />);
    const row = container.querySelector(".w-industry-row");
    expect(
      Array.from(row?.querySelectorAll(".w-chip") ?? [], (c) => c.textContent),
    ).toEqual([industries.main, ...industries.more]);
    expect(screen.queryAllByRole("button")).toHaveLength(0);
  });

  it("ends with the motto, leaving out an empty motto line", () => {
    const { container } = render(<Capabilities />);
    const { motto } = homeCapabilities;

    expect(screen.getByText(motto.lead)).toBeDefined();
    expect(screen.getByText(motto.title)).toBeDefined();
    expect(container.querySelectorAll(".w-own p")).toHaveLength(
      motto.line ? 2 : 1,
    );
  });

  it("only uses classes that globals.css defines", () => {
    const { container } = render(<Capabilities />);

    expect(undefinedClasses(container, /^(sr-only|wrap)$/)).toEqual([]);
  });
});
