# Material UI

Material UI ships the palette of Material Design 2 (2014) as it was: 19 colors, plus `black` and `white`.

## The A shades

The shades serve two roles:

- 50–900 make the primary color of an application: 500 for the app bar, 700 for the status bar, 100 for
  light backgrounds.
- A100, A200, A400 and A700 ("A" for accent) make the accent color, the one that draws the eye: floating
  action button, switches, sliders, checked boxes, progress bars, selected text. They are more saturated
  variants of the same hue, tuned by hand (red: 500 `#f44336`, A200 `#ff5252`, A400 `#ff1744`, A700
  `#d50000`). The guidelines took A200 as the accent, and A100, A400 or A700 for a lighter or darker one.

The 2014 specification gives no accent shades to grey, blue grey and brown. Material UI still ships them,
so every color has the same keys, as copies: for these three colors, A100, A200, A400 and A700 equal 100,
200, 400 and 700.

## Since then

Material Design 3 (2021) replaced this palette with tonal palettes computed from one seed color, on a tone
scale from 0 to 100.

## For Uix

These shades meet a real need, a more vivid variant of the accent for what must draw the eye. Uix can
derive it from the accent color by raising the chroma with relative color syntax, where Material Design 2
tuned each hue by hand.
