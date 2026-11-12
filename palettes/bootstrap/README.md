# Bootstrap

Bootstrap names ten base colors (`$blue`, `$indigo`…) and nine grays, then maps eight theme colors onto
them: `primary` (blue), `secondary` (gray 600), `success` (green), `info` (cyan), `warning` (yellow),
`danger` (red), `light` (gray 100), `dark` (gray 900). Components and utilities use the theme colors.

## The 100–900 scales

Since v5, each base color has a 100–900 scale computed in Sass: 500 is the base color, 100–400 mix it with
white (`tint-color`, 80 % to 20 %), 600–900 with black (`shade-color`, 20 % to 80 %). They are Sass
variables only; the compiled CSS does not ship them. `palette.json` holds them computed the way Sass does.

## Color modes

v5.3 added a dark color mode and three derived colors per theme color, computed the same way:

| Variable | Light mode | Dark mode |
|---|---|---|
| `$primary-text-emphasis` | shade 60 % | tint 40 % |
| `$primary-bg-subtle` | tint 80 % | shade 80 % |
| `$primary-border-subtle` | tint 60 % | shade 40 % |

## Relations

The grays come from Open Color, except gray 600: grays 100, 200, 300, 400, 500, 700, 800 and 900 equal Open
Color grays 0, 2, 3, 4, 5, 7, 8 and 9 (see `open-props` and `mantine`); gray 600 is `#6c757d`.

## For Uix

Mixing with white and black keeps the hue but dulls the color in the middle of the scale. Uix derives its
shades in OKLCH instead, where lightness changes without that loss.
