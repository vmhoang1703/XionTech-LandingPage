# One-shot spec: Home hero — the slogan in the T, stats above the fold, no scene dots

Owner: Hoang Vu (Andy). Stage: UI/UX enhancement (AGENTS.md). Route: one-shot (no API, no schema, no form change).
Lead, 2026-10-12: replace the T's tech logos with white dots like the X and yellow dots that show "Get IT Done"; put "Experience you can count on" on the first screen, as landing pages put their key proof above the fold; remove the 3 dots that show the scene progress. Built on the header pill (#101), whose height the first screen depends on.

Decisions, from mocks on the real build: the slogan goes into the T (the lead's words: "Slogan into the T mark"); of six still mocks, the lead chose "B. Letters are the stem", but smaller. Stats: laptop and up (1280x720 and bigger); the same band, tighter.

## Design

- **The T (globe-mark.ts):** the 13 tech logos are gone. GET IT DONE is written in amber dots up the T's stem, reading bottom to top (letter tops face the X), in a 5 x 7 dot font (I is 3 wide); 138 dots, 7 cells (`SLOGAN_CELL` = 0.008 mark units) across the stem and 55 cells up it, centred on the stem's middle: about 17px tall letters at 1440px. The stem's white dots stay as a light haze around the letters. Motion: at the end of the intro the slogan writes itself from the bottom up (1 s); it leaves with the mark when the globe opens; in scene 3 its dots gather in a loose cloud around the T and write it again from the bottom up; at rest each dot twinkles and catches the sheen. `hero-data.ts` loses the logos' SVG paths.
- **No scene dots (hero-silk.tsx):** the three progress buttons, the scene state and the jump helpers (`SCENE_STARTS`, `sceneIndex`, `sceneJumpTime`, `homeHero.scenes`) are removed. The Pause/Play button stays, moved below the header pill (it sat under the pill at 1080–1204px and on phones, where it could not be clicked).
- **Above the fold (home-hero.tsx, globals.css):** from 1080px, `.hero-fold` wraps the copy and the stats and is one screen tall below the header (at most 880px); the copy and the animation centre in it, and the stats sit at its bottom. The animation's box gives up height on short screens (`max-height: 100svh - header room - 220px`; the scene scales to fit), the top gap drops from 80px to 24px, and the stats band is tighter (numbers `clamp(1.75rem, 2.6vw, 2.5rem)`, less space above and between). Below 1080px nothing changes: on phones the stats title peeks at the bottom of the first screen.

## UX checks

| Part | State / action | Input | Visible result | Timing | Source | Checked |
| --- | --- | --- | --- | --- | --- | --- |
| Stats band | Load, 1280x720, 1366x768, 1440x900, 1536x864, 1920x1080 | Any | All 5 figures and captions on the first screen, no scroll | n/a | Lead (above the fold) | Yes (browser; 1280x720 ends at 699px) |
| Stats band | Load, phone 390x844 | Any | "Experience you can count on" peeks at the bottom | n/a | Lead (laptop and up) | Yes (title at 631px) |
| First screen | Load, 1080px and up | Any | Copy and animation centred, stats at the bottom; heading clears the pill | n/a | Spec | Yes (screenshots 1280x720, 1440x900) |
| XT animation, intro | Load | None | The X forms; GET IT DONE writes itself up the T's stem in amber dots, bottom first | ~1 s, done by 3.2 s (lead: 1 s sooner) | Lead (B, smaller) | Yes (unit tests; frames at fixed times) |
| XT animation, scene 3 | Loop | None | Amber dots gather around the T, then write GET IT DONE up the stem again | ~1.8 s | Lead | Yes (unit tests; frames) |
| XT animation, rest | After writing | None | Slogan reads upward inside the white-dot stem; dots twinkle in the sheen | Loop | Lead | Yes (frames) |
| Scene dots | Any | Any | None shown; the only hero button is Pause/Play | n/a | Lead | Yes (unit test) |
| Pause/Play | Any width | Mouse, touch, keyboard | Sits below the header pill, never under it | n/a | Spec (pill #101) | Yes (unit test; screenshot) |
| Reduced motion / saved Pause | Load | OS setting, Pause | Rests on the finished mark with the slogan written | None | NFR-2 | Yes (existing unit test: rest time) |
| All pages | Load | Any | Layout shift 0; no sideways scroll | n/a | PRODUCT.md | Yes (20 loads) |
