# Flux UI

Flux UI is the component library of Livewire, built on Tailwind CSS v4. It has no colors of its own: an
accent theme sets three properties to Tailwind colors, light and dark.

## The accent

| Property | Role | Red, light | Red, dark |
|---|---|---|---|
| `--color-accent` | Fills: primary buttons, checked controls | `red-500` | `red-500` |
| `--color-accent-content` | Accent text on the page: links, active items | `red-600` | `red-400` |
| `--color-accent-foreground` | Text on an accent fill | `white` | `white` |

The shades depend on the color: bright colors take a lighter fill and dark text (amber: `amber-400` with
`amber-950`), and the neutral accents (`slate`, `gray`, `zinc`, `neutral`, `stone`) use shade 800 in light
mode and white in dark mode. The default accent is `zinc-800`.

## Base gray

The interface grays come from `zinc` by default; a theme swaps them for another Tailwind neutral by
redefining the `zinc` shades.

## For Uix

Three properties are enough for an accent: fill, text on the page, text on the fill. Choosing them by hand
for each color is what Uix replaces with a computation, including the switch to dark text on bright
accents.
