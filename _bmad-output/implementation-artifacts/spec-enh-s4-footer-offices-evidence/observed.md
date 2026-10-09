# E-S4 Footer: observed on a production build

Build from `npm run build` (verification.txt), served with `npx next start -p 3005`, driven by
`walk.mjs` in Chrome (Playwright, `channel: "chrome"`); `/api/contact` answered by the walk.
Raw output: `walk-output.txt`.

| Surface | Steps | Observed |
| --- | --- | --- |
| Ridge | load at 1280, 900, 390 | 120px at 1280 and 900, 72px at 390; its bottom sits on the footer top; `aria-hidden`; nothing on the peak; ridge line amber rgb(255,192,0) at opacity .55 (`footer-1280.png`) |
| Footer grid | load at 1280, 900, 390 | 5 columns, 2 columns, 1 column (`footer-1280-full.png`, `footer-390.png`) |
| Brand | load | "Education technology products and software delivery services for schools and businesses." |
| Products | read links; click each | For schools -> /products#sxp, For students -> /products#ai-tutor, For parents -> /products#pxp; each lands with its card top at 88px |
| Services | read links; click How we work | Five services to their `/services#<id>`, How we work -> /services#process (heading fully visible), All services -> /services |
| Company | read links | News, About us, Careers only |
| Offices | load | Vietnam Delivery Center (pin and phone icons) then US Delivery Center (pin, phone, WhatsApp, envelope icons); no city headings |
| Phones | load | "(+84) 908 107 552" -> tel:+84908107552; "(+1) 469 322 9899" -> tel:+14693229899 |
| WhatsApp | read link | "(+1) 469 439 9345" -> wa.me, `_blank`, `noopener noreferrer`, name "WhatsApp (+1) 469 439 9345 (opens in a new tab)" |
| Vietnam email | load | not shown |
| Phone link | focus, hover | 2px solid ring, 24px tall; colour rgb(197,208,227) -> white on hover |
| Bottom bar | load | "© 2026 XionTech · Privacy policy" and "GET IT DONE" |
| Page ends | `/`, `/about`, `/careers`, `/services`, `/news`, `/products`, `/demo`, `/privacy`, 404 at 1280 and 390 | Every last content ends above the ridge top; room 232px at 1280, 176px at 390; no sideways scroll (`careers-end-1280.png`, `careers-end-390.png`) |
| Other pages | `/about`, `/demo`, `/` contact | About and Demo offices keep "Plano, Texas, USA" first with "+1 469 322 9899"; Home contact keeps "Plano +1 469 322 9899 Ho Chi Minh City +84 908 107 552" |
