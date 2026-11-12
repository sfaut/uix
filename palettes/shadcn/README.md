# shadcn/ui

shadcn/ui copies its components into the application, with a set of CSS custom properties that a base
color fills. It has no color scales of its own: the values are Tailwind CSS colors, in OKLCH since its
move to Tailwind CSS v4.

## Semantic tokens

Each base color sets the same tokens, light and dark (`palette.json`):

- Pairs of a surface and the text on it: `background` / `foreground`, `card`, `popover`, `primary`,
  `secondary`, `muted`, `accent`, each with its `-foreground`.
- `destructive`, the same in every base color: `oklch(0.577 0.245 27.325)`, Tailwind v4 `red-600`, in light
  mode.
- `border`, `input` and `ring` (focus ring).
- `chart-1` to `chart-5`, the series colors of charts.
- `sidebar` and its own pairs, so the sidebar can differ from the page.

## Base colors

Nine base colors: the five Tailwind neutrals `neutral`, `stone`, `zinc`, `gray`, `slate`, and the four
added in Tailwind v4 `mauve`, `olive`, `mist`, `taupe`. The earlier themes (blue, green, rose…) were written
in HSL for Tailwind v3; `palette.json` leaves them out.

## For Uix

The surface / text pairs are a simple contract for components: every surface comes with the text that
reads on it, so a theme cannot forget one of them.
