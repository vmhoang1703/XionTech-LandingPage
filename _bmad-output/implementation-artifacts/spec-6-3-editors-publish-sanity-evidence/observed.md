# Story 6.3 — what was observed (2026-10-05)

- `/careers` on the production build (`next start`, port 3066), walked with `walk.mjs` at 1280, 640 and 390px: the `#life` section shows three `[Placeholder]` frames (Team, Office, Event photo), because Sanity has no published `careersPhotos` document yet. 3 columns at 1280, 1 column at 640 and 390, no sideways scroll (`walk-output.txt`, `life-1280.png`).
- A slot with a photo is shown by unit tests only (`careers.test.tsx`): no consented photo exists yet (lead decision D6), so no real photo was published.
- Studio: `npx sanity schema validate` gives 0 errors and 0 warnings. The deployed Studio (singletons, no create/duplicate/delete, CAP-5 upload check) was not opened: the schema is deployed by the lead after merge.
- Webhook: a signed `careersPhotos` or `product` body answers 200 and revalidates its tag (unit tests). The Sanity webhook filter still lists only `post` and `job` until the lead updates it.
- Not observed: the live proof of CAP-1 and CAP-2 with `[Test]` documents (after merge, with the lead's OK).
