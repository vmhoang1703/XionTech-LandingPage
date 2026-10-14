# Story 1.2: what the browser showed

Production build (`npm run build`, then `next start -p 3005`), Chrome via Playwright, 2026-10-13, at commit 6639842, after the review patches. Requests to `/api/*` were intercepted, so nothing was sent.

## 320 x 700

- On `/vi`, the header bar has no horizontal overflow (`scrollWidth - clientWidth = 0`). It shows three items, in this order: the logo link, the Menu button and the language button. "Book a demo" is hidden below 360px and is the first item in the mobile menu. Screenshot: `w320-vi-header.png`.
- `/fr/products` returns 404. The page H1 is "You’ve wandered off the trail." and the URL stays `/fr/products`. Choosing EN in the language menu goes to `/en/products`.
- The `/vi/demo` tab title is "[Placeholder] Book a Demo or Start a Project | XionTech".

## 390 x 844

1. `GET /` (Accept-Language `en-US`, no cookie) lands on `/en` (200).
2. On `/en/demo` I typed in the first text field and the textarea. I opened the menu with the keyboard. When VI was chosen, the scroll position was 719.
3. The language button is the last header item, 53 x 44 px, and EN is marked current. Screenshot: `mobile-dropdown-open.png`.
4. Choosing VI goes to `/vi/demo`:
   - Scroll position is 719, the same as when VI was chosen.
   - Both typed values are kept.
   - Focus is on the language button.
   - `<html lang="vi">` and `<main lang="en">`.
   - The title is "[Placeholder] Book a Demo or Start a Project | XionTech".
   - The `locale` cookie is `vi`, Lax, about 365 days.

   Screenshot: `mobile-after-vi.png`.
5. A reload stays on `/vi/demo`. `GET /products` with the cookie redirects to `/vi/products`.

## 1440 x 900

The same walk. The form is in the first screen, so the scroll position is 0. Results match 390px: values kept, focus on the language button, the button is last in the header, the `lang` attributes and the placeholder title as above. Screenshots: `desktop-dropdown-open.png`, `desktop-after-vi.png`.
