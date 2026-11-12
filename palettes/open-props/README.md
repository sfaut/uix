# Open Props

Open Props is a set of CSS custom properties. It offers its colors in two forms.

## The hex palette

Each color is a scale of 13 shades, 0 (lightest) to 12 (darkest), as properties (`--red-6`). For the 12
colors it shares with Mantine, shades 0–9 equal Mantine's, both coming from Open Color; Open Props adds the
darker shades 10–12 and more colors (`stone`, `choco`, `brown`, `sand`, `camo`, `jungle`). An HSL version of
each color is available too.

## The OKLCH palette

A single scale of 16 steps (0–15) fixes the lightness and chroma of each step and reads the hue from
`--color-hue`: `oklch(63% .20 var(--color-hue, 0))`. Named hues (`--hue-red: 25`, `--hue-blue: 240`…) give
the usual colors, and any other angle gives a new one with the same steps. The showcase draws the scale
once per named hue.

## For Uix

The OKLCH palette is the closest to the Uix approach: one formula, one hue as the setting. Its steps keep
the same chroma whatever the hue, so some hues reach beyond the sRGB gamut and get clipped, which Uix has
to handle when it derives colors from any accent.
