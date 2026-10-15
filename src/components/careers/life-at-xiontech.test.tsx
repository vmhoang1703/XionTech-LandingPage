import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { careersLife } from "@/content/careers";
import { LifeAtXionTech } from "./life-at-xiontech";

const photos = [
  "/careers/life/a1.jpg",
  "/careers/life/b2.webp",
  "/careers/life/c3.png",
  "/careers/life/d4.avif",
];

function sets(container: HTMLElement) {
  return [...container.querySelectorAll(".life-set")];
}

describe("LifeAtXionTech", () => {
  it("shows the heading, lede and the interest tags, the last one filled", () => {
    const { container } = render(
      <LifeAtXionTech copy={careersLife} photos={photos} />,
    );
    expect(container.querySelector("section#meet-the-team")).not.toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Meet the team at XionTech",
      }),
    ).not.toBeNull();
    const tags = screen.getByRole("list", { name: "Our team interests" });
    expect(tags.children).toHaveLength(11);
    expect(tags.lastElementChild?.textContent).toBe("...and you?");
  });

  it("loops every photo once for readers and once more, hidden, with no captions", () => {
    const { container } = render(
      <LifeAtXionTech copy={careersLife} photos={photos} />,
    );
    const strip = screen.getByRole("region", {
      name: "Photos of the XionTech team",
    });
    expect(strip.getAttribute("tabindex")).toBe("0");
    const [first, second] = sets(container);
    expect(sets(container)).toHaveLength(2);
    expect(first?.getAttribute("aria-hidden")).toBeNull();
    expect(second?.getAttribute("aria-hidden")).toBe("true");
    const imgs = [...(first?.querySelectorAll("img") ?? [])];
    expect(imgs).toHaveLength(4);
    expect(imgs.every((img) => img.alt === "XionTech team moment")).toBe(true);
    expect(
      [...(second?.querySelectorAll("img") ?? [])].every(
        (img) => img.alt === "",
      ),
    ).toBe(true);
    expect(container.querySelector(".life-strip")?.textContent).toBe("");
  });

  it("repeats a single photo so the loop stays seamless, repeats decorative", () => {
    const { container } = render(
      <LifeAtXionTech copy={careersLife} photos={["/careers/life/only.jpg"]} />,
    );
    const imgs = [...(sets(container)[0]?.querySelectorAll("img") ?? [])];
    expect(imgs).toHaveLength(3);
    expect(imgs.map((img) => img.alt)).toEqual([
      "XionTech team moment",
      "",
      "",
    ]);
  });

  it("shows plain tinted tiles without text when the folder is empty", () => {
    const { container } = render(
      <LifeAtXionTech copy={careersLife} photos={[]} />,
    );
    const strip = container.querySelector(".life-strip");
    expect(strip?.getAttribute("aria-hidden")).toBe("true");
    expect(strip?.getAttribute("tabindex")).toBeNull();
    expect(strip?.querySelectorAll("img")).toHaveLength(0);
    expect(
      sets(container)[0]?.querySelectorAll(".life-tile.is-empty"),
    ).toHaveLength(4);
    expect(strip?.textContent).toBe("");
    expect(
      screen.queryByRole("region", { name: "Photos of the XionTech team" }),
    ).toBeNull();
  });
});
