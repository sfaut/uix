# Chakra UI

Each color is a scale of 11 shades, 50 to 950, close to Tailwind CSS v3: `gray` matches Tailwind `zinc` on
10 of its 11 shades, the other colors match their Tailwind namesake on 6 or 7 shades, and `black` is
Tailwind `zinc-950`.

## Semantic tokens

Components use semantic tokens rather than shades. Each color gets the same set, with a value for each
scheme; for red:

| Token | Light | Dark |
|---|---|---|
| `solid` | 600 | 600 |
| `contrast` (text on `solid`) | white | white |
| `fg` | 700 | 300 |
| `subtle` | 100 | 900 |
| `muted` | 200 | 800 |
| `emphasized` | 300 | 700 |
| `focusRing` | 500 | 500 |
| `border` | 500 | 400 |

The `colorPalette` property switches a component to another color, and its tokens follow.

## Left out

`palette.json` keeps the shades; the semantic tokens are not extracted.

## For Uix

The token set is close to the roles Uix derives from its accent. The light and dark values mirror each
other around the middle of the scale (100 ↔ 900, 200 ↔ 800), a pattern a computed dark theme can follow.
