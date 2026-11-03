# App icons: the Closed Ring mark

The Goodbye Debt mark is the product's own progress ring drawn closed:
indigo ring, the amber segment is the final payment that shuts the circle.
Palette is the app design system: indigo #4338ca, amber accent #f59e0b.
Source SVGs live in the profile workspace under gd-logo/ (gd-mark-tile.svg,
gd-mark-fullbleed.svg, gd-logo-b-ring.svg for the lockup with the wordmark).

| File | Purpose |
|---|---|
| ../favicon.ico (16/32/48) | browser tab, transparent rounded corners |
| icon-192.png / icon-512.png | purpose any: rounded-corner tile (indigo, white ring, amber segment) |
| icon-maskable-192.png / icon-maskable-512.png | purpose maskable: full-bleed square, ring scaled into the 80 percent safe zone so Android circle masks never clip it |
| ../apple-touch-icon.png (180) | iOS home screen, full bleed (iOS applies its own rounding) |

Product Hunt uses the full-bleed 512 (they round it themselves); a copy ships
with the platform-profiles packet as gd-icon-producthunt-512.png.
