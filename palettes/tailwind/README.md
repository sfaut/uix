# Tailwind CSS

Each color is a scale of 11 shades, 50 (lightest) to 950 (darkest), used through utilities
(`bg-red-500`, `text-slate-700`). Tailwind gives no shade a role: the designer picks one for each use.

## History

- v1 had shades 100–900. v2 added 50 and widened the palette to 22 colors.
- v3 made all 22 colors available by default and renamed some of them; v3.4.19 still answers the old names
  with a warning: `lightBlue` → `sky` (renamed in v2.2), `warmGray` → `stone`, `trueGray` → `neutral`,
  `coolGray` → `gray`, `blueGray` → `slate` (renamed in v3.0). Shade 950 came in v3.3.
- v4 rewrote the palette in OKLCH, which reaches the wider Display P3 gamut, and defines it in CSS: every
  shade is a custom property (`--color-red-500`) in `theme.css`, so pages can use it outside utilities.
- v4.3.5 has four neutrals absent from v3: `mauve`, `olive`, `mist`, `taupe`. shadcn/ui and Flux UI offer
  them as base colors.

## For Uix

The v4 scales give a reference for OKLCH lightness steps tuned by eye: a derived Uix scale can be compared
with them shade by shade.
