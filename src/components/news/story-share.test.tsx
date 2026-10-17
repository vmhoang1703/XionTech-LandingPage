import { act, fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { newsStory, newsStoryVi } from "@/content/news";
import { shareLinks, StoryShare } from "./story-share";

const URL = "https://example.test/en/news/a-story";

describe("StoryShare", () => {
  it("links LinkedIn and Facebook to the encoded story URL in a new tab", () => {
    render(<StoryShare url={URL} labels={newsStory.share} />);
    const li = screen.getByRole("link", { name: /Share on LinkedIn/ });
    const fb = screen.getByRole("link", { name: /Share on Facebook/ });
    expect(li.getAttribute("href")).toBe(shareLinks(URL).linkedin);
    expect(li.getAttribute("href")).toContain(encodeURIComponent(URL));
    expect(fb.getAttribute("href")).toContain(encodeURIComponent(URL));
    for (const a of [li, fb]) {
      expect(a.getAttribute("target")).toBe("_blank");
      expect(a.getAttribute("rel")).toContain("noopener");
      expect(a.getAttribute("aria-label")).toContain("new tab");
    }
  });

  it("copies the URL and says so politely", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<StoryShare url={URL} labels={newsStory.share} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });
    expect(writeText).toHaveBeenCalledWith(URL);
    const status = screen.getByText("Link copied");
    expect(status.getAttribute("aria-live")).toBe("polite");
  });

  it("says when the copy fails", async () => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockRejectedValue(new Error("no")) },
    });
    render(<StoryShare url={URL} labels={newsStory.share} />);
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Copy link" }));
    });
    expect(screen.getByText(newsStory.share.copyFailed)).toBeTruthy();
  });

  it("has every label in Vietnamese", () => {
    for (const key of Object.keys(
      newsStory.share,
    ) as (keyof typeof newsStory.share)[])
      expect(newsStoryVi.share[key]).not.toBe(newsStory.share[key]);
    expect(newsStoryVi.moreStories).toBe("Tin khác");
  });
});
