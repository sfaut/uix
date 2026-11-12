# Wave UI

Wave UI is a Vue UI framework. Its palette has 19 colors, each with six lighter shades (`light1` to
`light6`) and six darker ones (`dark1` to `dark6`) around the base.

## Origin

The colors follow Material Design 2: 8 bases equal the Material UI 500 shade (pink, deep purple, indigo,
blue, light blue, green, amber, orange); the 11 others are retuned (red is `#fa3317` where Material has
`#f44336`).

## Use

- Each color and shade gives a text class and a background class (`.pink`, `.pink--bg`, `.pink-light3`),
  and a custom property (`--w-pink-color`).
- The theme has six colors per scheme: `primary`, `secondary`, `info`, `warning`, `success`, `error`
  (`theme` in `palette.json`). Wave UI generates their shades, and those of custom colors, in the browser
  by lightening and darkening the color by a fixed step.
- The palette shades are stored values, kept so that existing pages keep their exact colors.

## For Uix

Wave UI already computes shades at runtime for theme colors. A fixed lightening step reaches white too soon
for light colors, which an OKLCH scale avoids.
