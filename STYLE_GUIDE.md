# UPFOREX Homepage V3 — Style guide

This upgrade keeps the original UPFOREX identity and original homepage structure. It is **not** the Skyriss-inspired version.

## Brand colors
- Background: `#0D0D0D`
- Accent green: `#3CFF19`
- Primary light text: `#F6F7F4`
- Dark cards: `#151515`–`#1D1D1D`
- Font: bundled **Montserrat** variable font

## Responsive typography
The responsive size rules are at the very end of `css/style.css` under `TYPOGRAPHY + MOTION REFINEMENT (V3)`.

- Hero: about `94px` on 1440px desktop, `56px` on 820px tablet, `43px` on 390px mobile, `39px` on 320px small mobile
- Large section titles: about `88px` on large desktop, `54px` on tablet, `43px` on mobile, `37px` on small mobile
- FAQ title: about `72px` on desktop, `40px` on mobile
- Hero copy: 14–17px with comfortable line height
- Letter spacing: relaxed compared with the prior design; no clipping at the tested widths

## Enhanced motion
- Hero neon light trails and atmospheric globe movement
- Section ambient haze, drifting light and staggered reveal effects
- Market rows: rail movement, hover shine and selector effects
- MetaTrader 5: neon scan, floating devices and animated halo
- Account rows: accent lines and moving icons
- Resources: hover lift, glowing rings and symbol movement
- FAQ: smoother open state and plus rotation
- Buttons: magnetic hover, shine and click ripples

## Accessibility & speed
- All decorative effects have `pointer-events: none` where needed.
- Respect `prefers-reduced-motion`.
- No third-party libraries, CDN dependencies or fake live quotes.
- Media is local; no new external network calls.

## Install
Open `index.html` in a browser. To integrate, keep all relative `assets/`, `css/`, and `js/` paths together.
