---
id: SPEC-ENH-A2-app-rename
owner: Andy
build_day: 2026-10-08
depends_on: ["E-A1"]
companions:
  - ../../enhancement-2026-10-07/README.md
  - ../../decisions-2026-10-01.md
  - ../../../prototype-enhancement/prototype/products.html
  - ../../../prototype-enhancement/prototype/index.html
  - ../../../prototype-enhancement/prototype/demo.html
sources:
  - ../../../prototype-enhancement/enhancement-log.md
---

# E-A2 One set of app names everywhere

Covers: ENH-086 (names part), ENH-087 (names part).

## Why

The prototype names the apps for who uses them:

- PXP becomes **Parent Hub** (badge "P-Hub");
- SXP becomes **Staff Hub** (badge "S-Hub");
- **IoT** stays ("IoT Device Management" on the Products cards and dialogs);
- **AI Tutor** is added;
- LXP is no longer shown.

The old names appear in about 13 source files, 22 test files and the Sanity Studio. This task renames
them so the page tasks don't each do it differently.

## Capabilities (Tier 1)

- **CAP-1 `src/content/apps.ts` (new).** One record per app. The `anchor` is the prototype's card id,
  which stays the same, so old links keep working (ENH-086):

  | id | shortName | fullName | badge | anchor |
  | --- | --- | --- | --- | --- |
  | `parent-hub` | Parent Hub | Parent Hub | text "P-Hub" | `pxp` |
  | `staff-hub` | Staff Hub | Staff Hub | text "S-Hub" | `sxp` |
  | `iot` | IoT | IoT Device Management | icon `Cpu` | `iot` |
  | `ai-tutor` | AI Tutor | AI Tutor | icon `Sparkle` | `ai-tutor` |

  - Each record also has its `tagline`, copied from the `ps-title` in `products.html`.
  - `shortName` is for doors, chips, the hero diagram and pills. `fullName` is for the Products cards
    and dialogs.
  - The AI Tutor tagline is `[Placeholder]` until the business confirms it (decision Q6 covers
    unverified copy the same way).
- **CAP-2 Andy's files use it.**
  - `content/products.ts`, `product-links.ts`, `nav-data.ts`, `lib/news/post.ts` (the app label).
  - `contact-strings.ts`: the Demo product options become Parent Hub, Staff Hub and IoT (no AI Tutor,
    as in `demo.html:52`), with Parent Hub as the default. Update `isProductList` in
    `src/lib/contact/submission.ts`.
  - The Demo page, whose copy changes to "Parent Hub and Staff Hub", "the first of our four steps",
    "Your role" and "When do you want to start?".
  - The contact payload changes with the options: update the `submission` and `delivery` tests.
- **CAP-3 Sanity.**
  - `post.app` stores the `apps.ts` ids. Its options become Parent Hub, Staff Hub, IoT and AI Tutor
    (`studio/schemas/post.ts`).
  - Until the content migration runs, the read code maps old stored values: PXP becomes `parent-hub`,
    SXP becomes `staff-hub`, and LXP shows no app (`lib/news/latest-posts.ts`, `post.ts`).
  - In `structure.ts`, keep the product document ids (`product-pxp`, `product-sxp`, `product-iot`), so
    stored clips stay attached, and change only their titles. Hide `product-lxp`. No AI Tutor document
    is added before the demo.
  - Write the value mapping in the PR. After the merge the lead runs, by hand, the Studio deploy and
    migration steps listed in decision A9.
- **CAP-4 Old anchors.** `#pxp`, `#sxp` and `#iot` stay the card ids (CAP-1), so footer, news and
  outside links keep working. `#lxp` lands at the top of `/products`.

## Out of scope

Home, About and footer text: Sammy's tasks (E-S1, E-S3, E-S4) import from `apps.ts`.

## Constraints

- Merge right after E-A1, so Sammy can import `apps.ts`.
- `nav-data.ts` is rewritten by E-A3. Change only the names here, not the menu structure.
- Grep `PXP|SXP|LXP|eXperience` across `src/` and `studio/` before and after. The PR lists what
  remains and why.
- Definition of Done from `CLAUDE.md`.

## Open questions

- Q1: default "rename". If the answer is no, `apps.ts` still ships with the old names, so the page tasks
  keep importing it unchanged.

## Success signal

`grep -rE "PXP|SXP|LXP"` over Andy's files (`src/content/products.ts`, `product-links.ts`,
`nav-data.ts`, `contact-strings.ts`, `src/lib/`) finds only the old-value mapping; Sammy's files change in
E-S1, E-S3 and E-S4. The Demo form shows Parent Hub, Staff Hub
and IoT, and `/products#pxp` still lands on the Parent Hub card.

## Request to paste

```
/bmad-build _bmad-output/specs/andy/spec-enh-a2-app-rename — E-A2 rename PXP/SXP/LXP to Parent Hub, Staff Hub, IoT and AI Tutor with one src/content/apps.ts (short and full names, badges, anchors pxp/sxp/iot/ai-tutor); Demo options; Sanity post.app values with a read-time mapping. Branch feature/enh-a2-app-rename from an up-to-date develop after E-A1 merges. Not one-shot: it changes the contact payload and Sanity.
```
