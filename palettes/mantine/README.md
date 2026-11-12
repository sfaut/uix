# Mantine

Each color is a list of ten shades, indexed 0 (lightest) to 9 (darkest). A custom color must also bring
ten shades.

## Use

- The primary color uses shade 6 in the light scheme and shade 8 in the dark one (`primaryShade` in the
  default theme).
- `dark` is the scale of the dark scheme surfaces: the page background is `dark.7`.
- The other colors come from Open Color, as in Open Props: their shades 0–9 are equal for the 12 colors
  both have (see `open-props`). `grape` and `dark` have no Open Props counterpart.

## For Uix

A different shade per scheme for the same role (6 in light, 8 in dark) is a choice Uix makes by
computation: its dark theme derives from the light one rather than from a second hand-picked shade.
