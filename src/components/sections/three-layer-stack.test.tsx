import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { servicesPage } from "@/content/services";
import { ThreeLayerStack } from "./three-layer-stack";

describe("ThreeLayerStack", () => {
  it("renders three layers and three labels as one described image", () => {
    const { container } = render(
      <ThreeLayerStack labels={servicesPage.stack} />,
    );

    const img = screen.getByRole("img", {
      name: "Illustration: requirements, wireframe and technical code layers of a software build",
    });
    const svg = img.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 1200 825");
    expect(svg?.getAttribute("role")).toBeNull();
    expect(svg?.querySelector("title, desc")).toBeNull();
    const layers = Array.from(container.querySelectorAll("[data-layer]"));
    expect(layers.map((l) => l.getAttribute("data-layer"))).toEqual([
      "tech",
      "wire",
      "req",
    ]);
    const labels = Array.from(container.querySelectorAll(".tls-label"));
    expect(labels.map((l) => l.textContent?.trim())).toEqual([
      "REQUIREMENTS",
      "WIREFRAME",
      "TECHNICAL CODE",
    ]);
    expect(container.querySelectorAll(".tls-leader")).toHaveLength(3);
    expect(container.querySelectorAll(".tls-anchor")).toHaveLength(3);
    expect(container.querySelector("button")).toBeNull();
    expect(undefinedClasses(container)).toEqual([]);
  });

  it("animates the three layers with one shared timing, on load only", () => {
    const source = readFileSync(
      join(process.cwd(), "src/components/sections/three-layer-stack.tsx"),
      "utf8",
    );
    expect(source).not.toMatch(
      /IntersectionObserver|addEventListener|onMouse|onClick|onScroll|onPointer/,
    );
    const css = globalsCss();
    expect(css).toContain("--tls-time: 3.6s;");
    expect(css).toContain("--tls-ease: cubic-bezier(0.22, 0.7, 0.16, 1);");
    for (const [cls, name] of [
      ["req", "requirements"],
      ["wire", "wireframe"],
      ["tech", "technical"],
    ]) {
      expect(css).toMatch(
        new RegExp(
          String.raw`\.tls-${cls} \{\s*animation: tls-${name}-pop var\(--tls-time\) var\(--tls-ease\) both;`,
        ),
      );
      // Same 22% start and 77% end for every layer: no stagger.
      expect(css).toMatch(
        new RegExp(
          String.raw`@keyframes tls-${name}-pop \{\s*0%,\s*22% \{[^}]*\}\s*77%,\s*100% \{`,
        ),
      );
    }
    expect(css).not.toMatch(/\.tls-[\w-]+:hover/);
  });

  it("renders the final state on a remount in the same page lifecycle", () => {
    const first = render(<ThreeLayerStack labels={servicesPage.stack} />);
    first.unmount();
    render(<ThreeLayerStack labels={servicesPage.stack} />);
    expect(screen.getByRole("img").hasAttribute("data-settled")).toBe(true);
  });
});
