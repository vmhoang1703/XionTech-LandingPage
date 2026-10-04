# Story 6.6 — what was observed (2026-10-04)

Surfaces: `/careers/[slug]` (job page), `POST /api/careers/cv-upload`, `POST /api/careers/apply`, the 404 for an unknown or closed slug.

Not reached in a browser or over HTTP: this worktree's `node_modules` is a junction, and Turbopack rejects it, so `npm run build`, `npm run dev` and `npm run test:smoke` cannot run here. No real upload and no real mail were sent (controller rule). The controller runs build, smoke and the browser walk in the main checkout.

Observed instead (jsdom and node unit tests, `npm test` 928 passed):
- Page: H1, crumbs with `aria-current`, chips, details sections, "All open roles" link, the form inside `#apply`, `notFound()` for a null role, no capture band — `src/app/careers/[slug]/page.test.tsx`, `src/components/careers/job.test.tsx`.
- Form: CV error on change, submit errors with focus and announcement, sending state, success panel, failure keeps values and the file, 60 s upload abort, retry reuses the upload — `src/components/careers/job-application-form.test.tsx`.
- Routes: every I/O matrix row with Blob, Sanity, Upstash and Gmail mocked — `src/app/api/careers/apply/route.test.ts`, `src/app/api/careers/cv-upload/route.test.ts`.
- Smoke file listed by `npx playwright test --list --project=smoke` (10 tests in 7 files), not run.
