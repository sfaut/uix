# Pico CSS

Pico v2 added a full palette: 20 colors, each a scale of 19 shades from 50 (lightest) to 950 (darkest) in
steps of 50, plus `black` and `white`. The fine steps leave room to pick a shade with the right contrast.

## Use

- Each plain color name points to one shade (`$red` is `$red-550`); `default` in `palette.json` lists
  them.
- `pico.colors.css` turns the palette into utility classes, for text and backgrounds.
- Pico ships 20 precompiled themes, one per color, each built on its shades: the page changes color by
  loading another stylesheet.

## For Uix

The 20 themes show what Uix does with a single setting: Pico precompiles one stylesheet per accent, where
Uix computes the colors from the accent in the browser.
