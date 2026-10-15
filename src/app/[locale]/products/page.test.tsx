import { render, screen, within } from "@testing-library/react";
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
  it("renders the roadmap, then the Let's talk band, with no app showcase", async () => {
    const { container } = render(await productsAt("en"));
    const sections = [...container.querySelectorAll("section")];
    expect(sections).toHaveLength(2);
    expect(sections[0].id).toBe("map");
    expect(sections[1].classList.contains("talk-band")).toBe(true);
    expect(sections[1].querySelector(".about-cta-inner")).not.toBeNull();
    expect(container.querySelector("#apps")).toBeNull();
    expect(container.querySelector("dialog.pdetail")).toBeNull();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "See it working at your school",
      }),
    ).toBeDefined();
    expect(container.querySelector("input, form")).toBeNull();
    const talk = within(sections[1]).getByRole("link", { name: "Let's talk" });
    expect(talk.getAttribute("href")).toBe("/en#contact");
    expect(sections[1].textContent).toContain(
      "Tell us about your school and we'll show you how Parent Hub, Staff Hub and AI Tutor work together.",
    );
  });

  it("sends the Vietnamese band to the Vietnamese contact form", async () => {
    const { container } = render(await productsAt("vi"));
    const band = container.querySelector("section.talk-band");
    expect(band?.querySelector("h2")?.textContent).toBe(
      "Xem ứng dụng hoạt động tại trường của bạn",
    );
    expect(band?.querySelector("a")?.getAttribute("href")).toBe("/vi#contact");
    expect(band?.querySelector("a")?.textContent).toBe(
      "Trao đổi với chúng tôi",
    );
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

  it("puts the three app anchors in the roadmap, and no IoT", async () => {
    const { container } = render(await productsAt("en"));
    for (const id of ["pxp", "sxp", "ai-tutor"]) {
      expect(container.querySelectorAll(`[id="${id}"]`)).toHaveLength(1);
      expect(
        container.querySelector(`section#map .rm [id="${id}"]`),
      ).not.toBeNull();
    }
    // IoT is no longer a product (lead, 2026-10-15).
    expect(container.querySelector("#iot")).toBeNull();
    expect(container.textContent).not.toMatch(/IoT|device management/i);
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
    // `.sec.map-sec`: the shared `.sec` padding later in the file (one
    // class) must not take the header room away; the gap matches the other
    // page heroes.
    expect(globalsCss()).toMatch(
      /\.sec\.map-sec\s*\{\s*padding-top:\s*calc\(\s*var\(--spacing-header-room\) \+ var\(--spacing-page-hero-top\)\s*\);\s*\}/,
    );
  });

  it("sets the page metadata", () => {
    expect(metadata.title).toBe(
      "School platforms: Parent Hub, Staff Hub, AI Tutor | XionTech",
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
      screen.getByRole("heading", { name: "Một ngôi trường kết nối" }),
    ).toBeTruthy();
    expect(container.querySelector(".rm-title")?.textContent).toBe(
      "1. Parent Hub",
    );
    expect(container.textContent).toContain("Giáo viên và nhân viên");
    expect(container.textContent).toContain(
      "Giúp phụ huynh luôn nắm bắt thông tin và gắn kết với đời sống học đường của con.",
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
    expect(String(viMeta.title)).toMatch(/^Nền tảng trường học: /);
    expect(String(viMeta.title)).not.toContain("[Placeholder]");
  });
});
