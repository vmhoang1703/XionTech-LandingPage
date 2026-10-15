import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/components/layout/locale-link";
import { undefinedClasses } from "@/test-utils/css-classes";
import { NotFoundView } from "./not-found-view";

describe("NotFound page", () => {
  it("shows a large 404 and the Page not found H1", () => {
    const { container } = render(<NotFoundView locale="en" />);

    expect(container.querySelector(".nf-code")?.textContent).toBe("404");
    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0].textContent).toBe("Page not found");
  });

  it("has a single small link back home and nothing else", () => {
    const { container } = render(<NotFoundView locale="en" />);

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0].getAttribute("href")).toBe("/en");
    expect(links[0].textContent).toBe("Back to Home");
    expect(container.querySelector("svg, img, figure, canvas")).toBeNull();
    expect(container.querySelectorAll("p")).toHaveLength(1);
  });

  it("has no capture band and leaves main to the root layout", () => {
    render(<NotFoundView locale="en" />);

    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("main")).toBeNull();
  });

  it("leaves the title and robots tags to the metadata", () => {
    render(<NotFoundView locale="en" />);

    expect(document.querySelector("title")).toBeNull();
    expect(document.querySelector('meta[name="robots"]')).toBeNull();
  });

  it("shows the Vietnamese strings and a /vi link inside a vi page", () => {
    render(
      <LocaleProvider locale="vi">
        <NotFoundView locale="vi" />
      </LocaleProvider>,
    );

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Không tìm thấy trang",
    );
    expect(
      screen.getByRole("link", { name: "Về trang chủ" }).getAttribute("href"),
    ).toBe("/vi");
  });

  it("marks its root with the page locale so it overrides the English main", () => {
    const { container } = render(<NotFoundView locale="vi" />);
    expect(container.querySelector("section")?.getAttribute("lang")).toBe("vi");
  });

  it("uses only defined classes", () => {
    const { container } = render(<NotFoundView locale="en" />);

    expect(undefinedClasses(container, /^(wrap)$/)).toEqual([]);
  });
});
