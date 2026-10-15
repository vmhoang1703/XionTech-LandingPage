import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { productsMeta } from "@/content/products";
import { globalsCss, undefinedClasses } from "@/test-utils/css-classes";
import { LocaleProvider } from "@/components/layout/locale-link";
import ProductsPage, { generateMetadata } from "./page";

function productsAt(locale: string) {
  return ProductsPage({ params: Promise.resolve({ locale }) });
}

const metadata = await generateMetadata({
  params: Promise.resolve({ locale: "en" }),
});

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// jsdom has no observers: the roadmap never leaves its armed phase.
class NoObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  vi.stubGlobal("IntersectionObserver", NoObserver);
  vi.stubGlobal("ResizeObserver", NoObserver);
  // jsdom has no CSS.supports or animation frames.
  vi.stubGlobal("CSS", { supports: () => true });
  vi.stubGlobal("requestAnimationFrame", () => 1);
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Products page", () => {
  it("renders the roadmap, then the capture band, with no app showcase", async () => {
    const { container } = render(await productsAt("en"));
    const sections = [...container.querySelectorAll("section")];
    expect(sections).toHaveLength(2);
    expect(sections[0].id).toBe("map");
    expect(sections[1].classList.contains("capture")).toBe(true);
    // E-A5 CAP-5: the navy band from E-A4.
    expect(sections[1].classList.contains("surface-navy")).toBe(true);
    expect(container.querySelector("#apps")).toBeNull();
    expect(container.querySelector("dialog.pdetail")).toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "See it working at your school",
      }),
    ).toBeDefined();
  });

  it("opens with the H1 and a roadmap of three cards, one per product", async () => {
    const { container } = render(await productsAt("en"));
    const map = container.querySelector("section#map");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Built apart. Better together",
      }),
    ).toBeDefined();
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(map?.querySelector("h1")).not.toBeNull();
    const roadmap = map?.querySelector(".rm");
    expect(roadmap?.querySelectorAll(".rm-card")).toHaveLength(3);
    expect(
      [...(roadmap?.querySelectorAll(".rm-title") ?? [])].map((h) =>
        h.textContent?.trim(),
      ),
    ).toEqual(["1. Parent Hub", "2. Staff Hub", "3. AI Tutor"]);
  });

  it("puts the four app anchors in the roadmap, IoT's at its start", async () => {
    const { container } = render(await productsAt("en"));
    for (const id of ["pxp", "sxp", "iot", "ai-tutor"]) {
      expect(container.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
      expect(
        container.querySelector(`section#map .rm [id="${id}"]`),
      ).not.toBeNull();
    }
    // IoT has no stop: its anchor is a mark at the start of the roadmap.
    expect(container.querySelector("#iot")?.className).toBe("rm-alias");
    expect(container.querySelector("#iot")?.closest("li")).toBeNull();
  });

  it("has no sub-nav, tab list, Updates link or LXP section", async () => {
    const { container } = render(await productsAt("en"));
    expect(container.querySelector(".subnav")).toBeNull();
    expect(screen.queryByRole("tablist")).toBeNull();
    expect(container.querySelector('a[href="#updates"]')).toBeNull();
    expect(container.querySelector("#lxp")).toBeNull();
    expect(container.textContent).not.toContain("Four apps. One");
  });

  it("styles every class it uses", async () => {
    const { container } = render(await productsAt("en"));
    expect(
      undefinedClasses(container, /^(sr-only|size-|mt-|-?z-|absolute)/),
    ).toEqual([]);
  });

  it("starts the first section below the floating header pill", async () => {
    const { container } = render(await productsAt("en"));
    expect(container.querySelector("section")?.classList).toContain("map-sec");
    expect(globalsCss()).toMatch(
      /\.map-sec\s*\{\s*padding-top:\s*calc\(var\(--spacing-header-room\) \+ var\(--spacing-section\)\);\s*\}/,
    );
  });

  it("sets the page metadata", () => {
    expect(metadata.title).toBe(
      "School Apps: Parent Hub, Staff Hub, IoT & AI Tutor | XionTech",
    );
    expect(metadata.description).toBe(productsMeta.description);
    expect(productsMeta.description).not.toMatch(/PXP|LXP|SXP|XionTechs/);
  });

  it("renders the journey in Vietnamese on vi, app names in English", async () => {
    const page = await productsAt("vi");
    const { container } = render(
      <LocaleProvider locale="vi">{page}</LocaleProvider>,
    );

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Xây dựng riêng. Mạnh hơn khi kết nối",
    );
    expect(
      screen.getByRole("heading", { name: "Một ngôi trường kết nối." }),
    ).toBeTruthy();
    expect(container.querySelector(".rm-title")?.textContent).toBe(
      "1. Parent Hub",
    );
    expect(container.textContent).toContain("Giáo viên và nhân viên");
    expect(container.textContent).toContain(
      "Giúp phụ huynh đồng hành cùng con mỗi ngày học, ngay trên điện thoại.",
    );
    expect(container.textContent).toContain("Staff Hub");
    expect(container.textContent).not.toContain("A day at school.");
    expect(container.textContent).not.toContain("Một ngày ở trường.");
  });

  it("falls back to English for an unknown locale", async () => {
    render(await productsAt("xx"));

    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(
      "Built apart. Better together",
    );
  });
});

describe("Products page metadata in Vietnamese", () => {
  it("uses the Vietnamese title and description", async () => {
    const viMeta = await generateMetadata({
      params: Promise.resolve({ locale: "vi" }),
    });
    expect(String(viMeta.title)).toMatch(/^Ứng dụng cho trường học: /);
    expect(String(viMeta.title)).not.toContain("[Placeholder]");
  });
});
