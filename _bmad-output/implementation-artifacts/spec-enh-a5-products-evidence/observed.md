# E-A5 observed surface

Built app (`npm run build`), served with `npx next start --port 3205`, driven by a Playwright script
(Chrome channel). Its raw output is `browser-check.txt`; screenshots are beside this file.

- `/products` at 1280px: hero "Built apart. Better together." with the four navy app cards around
  the X tile and the round navy pause button; "What we build." with four white cards in two
  columns; the amber "See it working at your school." band (`desktop-top.png`, `desktop-full.png`).
- Staff Hub card: focus the expand button, Enter: the dialog opens (`dialog.png`); 8 Tab presses
  stay inside; Esc closes it and focus is back on the expand button. Backdrop click closes; a click
  near the dialog's inner corner does not; X closes.
- Parent Hub dialog: two disabled store labels, no links (`dialog-pxp.png`).
- Pause motion: click sets `data-motion="off"`, stores `xt-motion=off`, glow `animation-play-state`
  reads `paused`. Home then shows "Play motion".
- `/products#pxp`, `#sxp`, `#iot`, `#ai-tutor`: each card top lands at 88px (below the 72px header).
- 390px and 320px: no sideways scroll (`m390.png`, `m320.png`); 390px dialog stacks media first
  (`m390-dialog.png`).
- JavaScript off: four visible "Features" details, no expand button, no pause button (`nojs.png`).
- Reduced motion: hero starts with "Play motion". No console errors.
