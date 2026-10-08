---
id: SPEC-ENH-A6-news-story
owner: Andy
build_day: 2026-10-08
depends_on: ["E-A1", "E-A2"]
soft_depends_on: ["E-A4"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/news.html
  - ../../../prototype-enhancement/prototype/news-story.html
  - ../../../prototype-enhancement/prototype/index.html
  - ../../../prototype-enhancement/prototype/css/site.css
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-A6 News by audience, photo cards and the story page

Covers: ENH-007, ENH-034, ENH-037, ENH-042, ENH-044 (news part), ENH-047, ENH-053, ENH-063 (title
part), ENH-066 (title part). Tier 2: ENH-063 (motion part).

## Why

News is filtered by who the story is for and leads with pictures. The same card is used in Home's
news row.

## Capabilities (Tier 1)

- **CAP-1 Hero.**
  - "Catch up with us" with "Stay informed with the latest news and announcements, fresh off the
    press."
  - No breadcrumb. White with light blue shading.
- **CAP-2 Filters.**
  - All, Schools, Students, Parents and Company.
  - Sanity: `post.category` holds an audience. Default mapping for existing posts (the lead confirms
    it in the PR):
    - `schools` → Schools;
    - `company` → Company;
    - `team` → Company;
    - `product` → Schools, unless the post's app is Parent Hub (→ Parents) or AI Tutor (→ Students).
  - At read time, an unknown value shows no pill and appears only under All.
  - Change the `app` field's `hidden` rule in `studio/schemas/post.ts` (today it shows only when
    category is "product") so that `app` is always editable. Stop testing `category === "product"` in
    `categoryTag`, the news card and the story page.
- **CAP-3 Sample note.** "Stories from the newXion newsroom; those marked [Placeholder] are samples."
  This is the prototype text, kept as written (decision Q12).
- **CAP-4 Cards.**
  - A full-photo card that is one link. The audience and date pills sit at the top; the title sits at
    the bottom over a dark fade.
  - "Read story" shows on hover or focus, and always on touch.
  - Sanity `post` gets `image` and `alt`; `alt` is required when an image is set.
  - A post with no image shows the current frame.
  - The date reads "31 Jul 2026" (not all capitals).
- **CAP-5 Layout.**
  - The newest story is a full-width lead when it is the only story, or when a full row of cards
    follows it.
  - Then square cards: three, two or one per row.
  - With a filter on, the lead is the newest story in that filter. Work the lead out again on filter
    change and on resize. The no-JavaScript default is the layout for all stories at desktop width.
  - Empty state: "No stories are available in this category yet." with a "Show all" button.
- **CAP-6 Home news row** (`home-news.tsx`).
  - The lede "Catch up with what our team is building and shipping."
  - "See all news" on the heading row, or under it on phones.
  - The new card is used here too.
- **CAP-7 Story page.**
  - "Back to News" at the top (no breadcrumb), then the audience pill and date, the H1, and the excerpt
    as the summary.
  - Then the photo: a real image with alt, 440px tall. A story with no image shows no photo block.
  - The body keeps its subheadings (ENH-044).
  - A sample story (title starts with "[Placeholder]") shows "[Placeholder] Sample story to show the
    layout…".
  - Remove the "See {app}" button.
- **CAP-8 Email band.** It stays the demo band, in the plain light blue look (E-A4). The newsletter is
  Tier 2.
- **CAP-9 Page title.** "News | XionTech".

## Content

Mock stories keep "[Placeholder]" in their titles. Do not use their Unsplash photos; any photo goes
into Sanity with a known source.

## Constraints

- Update `e2e/news.spec.ts` and the story tests in this task.
- `categoryTag`, `categoryLabels` and `newsDate` are shared by Home, News and the story page.
- E-A2 changes `post.app` first; rebase on it.
- Definition of Done from `CLAUDE.md`.

## Non-goals for this build (Tier 2, after the demo)

- **Card motion.** Cards unfold one by one as they scroll in, again on each filter, with reduced motion
  supported (ENH-063).
- **Words rise in** on the hero title.

## Open questions

- Q12 (newXion in copy): default "keep as written".

## Success signal

On the preview, "Parents" shows only parent stories with the newest as the lead, an empty filter shows
"Show all", and a story page shows its photo and summary.

## Request to paste

```
/bmad-build _bmad-output/specs/andy/spec-enh-a6-news-story — E-A6 News audience filters (category to audience with a defined mapping; post.app always visible), full-photo cards with a lead story, Home news row, story page header and photo (Sanity post image + required alt). Branch feature/enh-a6-news-story from an up-to-date develop after E-A1 and E-A2 merge. UI task: UX checks table before coding.
```
