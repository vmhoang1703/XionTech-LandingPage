import { render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("./hero-silk", () => ({
  HeroSilk: () => <canvas data-testid="silk" />,
}));

const { HeroSilkLazy } = await import("./hero-silk-lazy");

describe("HeroSilkLazy", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("loads the silk scene at once when the page has already loaded", async () => {
    render(<HeroSilkLazy />);

    await waitFor(() => expect(screen.getByTestId("silk")).toBeTruthy());
  });

  it("waits for the page's load event before fetching the scene", async () => {
    vi.spyOn(document, "readyState", "get").mockReturnValue("interactive");
    const { unmount } = render(<HeroSilkLazy />);

    expect(screen.queryByTestId("silk")).toBeNull();
    window.dispatchEvent(new Event("load"));
    await waitFor(() => expect(screen.getByTestId("silk")).toBeTruthy());
    unmount();
  });
});
