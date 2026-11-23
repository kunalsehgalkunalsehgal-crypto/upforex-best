# Source-based typography comparison

Source compared: `upforex1-main (2).zip` → `src/app/components/home/home.component.html`, `home.component.scss`, `src/styles.scss`.

| Element | Original source | Updated standalone homepage |
|---|---|---|
| Font | Montserrat Variable | Exact same Montserrat WOFF2 bytes |
| Main hero heading | Tailwind `tw-text-4xl` (36px), `lg:tw-text-5xl` (48px), `tw-font-bold`, `.banner-text {line-height:1.5}` | 36px mobile / 48px desktop; 700; line-height 1.5 |
| Main section headings | `tw-text-2xl` (24px), `lg:tw-text-4xl` (36px), `tw-font-bold` | 24px mobile/tablet, 36px desktop; 700 |
| Descriptions | `tw-text-sm`, `tw-font-semibold`, `tw-tracking-wide`, `tw-leading-relaxed` | 14px, 600, 0.025em letter-spacing, 1.625 line-height |
| Intro tagline | `tw-text-xl`, `tw-font-bold`, `tw-tracking-wide` | 20px, 700, 0.025em letter-spacing |
| Market card title | `tw-text-lg`, `tw-font-extrabold`, `tw-tracking-wider` | 18px, 800, 0.05em letter-spacing |
| Demo/account CTA | `.banner-button .btn { font-weight: 650 }` | 650 |
| Brand colors | `#0D0D0D`, `#3CFF19` | Unchanged |

The new layout contains headings and labels that do not have a one-to-one match in the original Angular site. Those were mapped to the closest semantic category; sizes are intentionally kept in the original typographic scale.

To adjust later, edit the final block `UPFOREX ORIGINAL WEBSITE TYPOGRAPHY MATCH` at the end of `css/style.css`.
