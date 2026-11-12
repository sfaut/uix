# Palettes

Color palettes of well-known frameworks, for reference while designing the Uix colors: `data/` holds one
JSON file per framework, shaped `{"<framework>": {"v<version>": {...}}}`, and "Notes" below gives the
history and use of each palette. Values keep the notation of their source (hex, `oklch()`, `rgba()`).
Collected on 2026-11-12, by reading each source as text (nothing was run).

| File | Version | Source | Content |
|---|---|---|---|
| [`data/tailwind.json`](data/tailwind.json) | v4.3.5, v3.4.19 | npm `tailwindcss`: `theme.css` (v4), `lib/public/colors.js` (v3) | 50–950 per color; v4 in OKLCH, v3 in hex. The deprecated v3 aliases (`lightBlue`…) are left out. |
| [`data/bootstrap.json`](data/bootstrap.json) | v5.3.9 | npm `bootstrap`: `scss/_variables.scss` | 100–900 per color, computed as Sass does (`tint-color` mixes with white, `shade-color` with black), checked against `$blue-100` and `$blue-900`; grays; `theme` maps the theme colors. |
| [`data/material-ui.json`](data/material-ui.json) | v9.5.0 | npm `@mui/material`: `colors/` | The Material Design 2 palette: 50–900 and A100–A700. |
| [`data/radix.json`](data/radix.json) | v3.0.0 | npm `@radix-ui/colors` | Steps 1–12, `light` and `dark`, sRGB. The Display P3 and alpha variants are left out. |
| [`data/open-props.json`](data/open-props.json) | v1.7.23 | npm `open-props`: `src/props.colors*.css` | `hex`: 0–12 per color. `oklch`: one lightness and chroma scale (0–15) applied to `--color-hue`, and the named hues. |
| [`data/mantine.json`](data/mantine.json) | v9.8.0 | npm `@mantine/core`: `default-colors` | Ten shades, indexed 0–9 as in Mantine. |
| [`data/ant-design.json`](data/ant-design.json) | v8.0.1 | npm `@ant-design/colors`: `presets` | Ten shades, numbered 1–10 as in the Ant Design documentation (6 is the primary shade), `light` and `dark`; `primary` lists the seed colors. |
| [`data/chakra.json`](data/chakra.json) | v3.38.0 | npm `@chakra-ui/react`: `theme/tokens/colors` | 50–950 per color; semantic tokens are left out. |
| [`data/carbon.json`](data/carbon.json) | v11.62.0 | npm `@carbon/colors`: `tokens/colors.tokens.json` (DTCG) | 10–100 per color, and their hover variants. |
| [`data/pico.json`](data/pico.json) | v2.1.1 | npm `@picocss/pico`: `scss/colors/_index.scss` | 50–950 per color; `default` names the shade each plain color name points to. |
| [`data/wave-ui.json`](data/wave-ui.json) | v4.2.5 | npm `wave-ui`: `utils/colors.js`, `utils/config.js` | `palette`: each color with six lighter and six darker shades; `theme`: the default light and dark theme colors. |
| [`data/shadcn.json`](data/shadcn.json) | v4.23.0 (CLI) | registry `ui.shadcn.com/r/colors/<base>.json` | Semantic tokens (`background`, `primary`, `border`…) of each base color, `light` and `dark`. Its color scales are Tailwind's. |
| [`data/flux.json`](data/flux.json) | v2.21.0 | `fluxui.dev/themes` | Accent themes (`accent`, `accent-content`, `accent-foreground`), `light` and `dark`, as Tailwind CSS v4 color names (`red-500`). |

## Notes

### Tailwind CSS

Each color is a scale of 11 shades, 50 (lightest) to 950 (darkest), used through utilities
(`bg-red-500`, `text-slate-700`). Tailwind gives no shade a role: the designer picks one for each use.

#### History

- v1 had shades 100–900. v2 added 50 and widened the palette to 22 colors.
- v3 made all 22 colors available by default and renamed some of them; v3.4.19 still answers the old names
  with a warning: `lightBlue` → `sky` (renamed in v2.2), `warmGray` → `stone`, `trueGray` → `neutral`,
  `coolGray` → `gray`, `blueGray` → `slate` (renamed in v3.0). Shade 950 came in v3.3.
- v4 rewrote the palette in OKLCH, which reaches the wider Display P3 gamut, and defines it in CSS: every
  shade is a custom property (`--color-red-500`) in `theme.css`, so pages can use it outside utilities.
- v4.3.5 has four neutrals absent from v3: `mauve`, `olive`, `mist`, `taupe`. shadcn/ui and Flux UI offer
  them as base colors.

#### For Uix

The v4 scales give a reference for OKLCH lightness steps tuned by eye: a derived Uix scale can be compared
with them shade by shade.

### Bootstrap

Bootstrap names ten base colors (`$blue`, `$indigo`…) and nine grays, then maps eight theme colors onto
them: `primary` (blue), `secondary` (gray 600), `success` (green), `info` (cyan), `warning` (yellow),
`danger` (red), `light` (gray 100), `dark` (gray 900). Components and utilities use the theme colors.

#### The 100–900 scales

Since v5, each base color has a 100–900 scale computed in Sass: 500 is the base color, 100–400 mix it with
white (`tint-color`, 80 % to 20 %), 600–900 with black (`shade-color`, 20 % to 80 %). They are Sass
variables only; the compiled CSS does not ship them. `data/bootstrap.json` holds them computed the way Sass does.

#### Color modes

v5.3 added a dark color mode and three derived colors per theme color, computed the same way:

| Variable | Light mode | Dark mode |
|---|---|---|
| `$primary-text-emphasis` | shade 60 % | tint 40 % |
| `$primary-bg-subtle` | tint 80 % | shade 80 % |
| `$primary-border-subtle` | tint 60 % | shade 40 % |

#### Relations

The grays come from Open Color, except gray 600: grays 100, 200, 300, 400, 500, 700, 800 and 900 equal Open
Color grays 0, 2, 3, 4, 5, 7, 8 and 9 (see Open Props and Mantine); gray 600 is `#6c757d`.

#### For Uix

Mixing with white and black keeps the hue but dulls the color in the middle of the scale. Uix derives its
shades in OKLCH instead, where lightness changes without that loss.

### Material UI

Material UI ships the palette of Material Design 2 (2014) as it was: 19 colors, plus `black` and `white`.

#### The A shades

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

#### Since then

Material Design 3 (2021) replaced this palette with tonal palettes computed from one seed color, on a tone
scale from 0 to 100.

#### For Uix

These shades meet a real need, a more vivid variant of the accent for what must draw the eye. Uix can
derive it from the accent color by raising the chroma with relative color syntax, where Material Design 2
tuned each hue by hand.

### Radix Colors

Each color is a scale of 12 steps, in a light and a dark version, and each step has a role:

| Steps | Role |
|---|---|
| 1, 2 | Backgrounds: the application, then subtle areas (cards, sidebars). |
| 3, 4, 5 | Backgrounds of interactive components: normal, hovered, pressed or selected. |
| 6, 7, 8 | Borders: subtle separators, borders of interactive components, hovered borders and focus rings. |
| 9, 10 | Solid backgrounds: 9 is the purest color (buttons, badges), 10 its hovered state. |
| 11, 12 | Text: 11 with lower contrast, 12 with high contrast. |

Swapping the light scale for the dark one switches the theme, since the roles stay on the same steps. A
few scales have a bright step 9 (sky, mint, lime, yellow, amber), which takes dark text.

#### Grays

Radix pairs each color with a gray of a close tint: mauve with tomato, red, ruby, crimson, pink, plum,
purple and violet; slate with iris, indigo, blue, sky and cyan; sage with mint, teal, jade and green; olive
with grass and lime; sand with yellow, amber, orange and brown. `gray` is neutral.

#### Left out

The package also ships each scale in alpha (transparent steps that give the same color over the matching
background) and in Display P3. `data/radix.json` keeps the sRGB steps.

#### For Uix

The roles are the useful part: they match what Uix derives from the accent (backgrounds, interactive
states, borders, solid fills, text), and give a tested order for them.

### Open Props

Open Props is a set of CSS custom properties. It offers its colors in two forms.

#### The hex palette

Each color is a scale of 13 shades, 0 (lightest) to 12 (darkest), as properties (`--red-6`). For the 12
colors it shares with Mantine, shades 0–9 equal Mantine's, both coming from Open Color; Open Props adds the
darker shades 10–12 and more colors (`stone`, `choco`, `brown`, `sand`, `camo`, `jungle`). An HSL version of
each color is available too.

#### The OKLCH palette

A single scale of 16 steps (0–15) fixes the lightness and chroma of each step and reads the hue from
`--color-hue`: `oklch(63% .20 var(--color-hue, 0))`. Named hues (`--hue-red: 25`, `--hue-blue: 240`…) give
the usual colors, and any other angle gives a new one with the same steps. The showcase draws the scale
once per named hue.

#### For Uix

The OKLCH palette is the closest to the Uix approach: one formula, one hue as the setting. Its steps keep
the same chroma whatever the hue, so some hues reach beyond the sRGB gamut and get clipped, which Uix has
to handle when it derives colors from any accent.

### Mantine

Each color is a list of ten shades, indexed 0 (lightest) to 9 (darkest). A custom color must also bring
ten shades.

#### Use

- The primary color uses shade 6 in the light scheme and shade 8 in the dark one (`primaryShade` in the
  default theme).
- `dark` is the scale of the dark scheme surfaces: the page background is `dark.7`.
- The other colors come from Open Color, as in Open Props: their shades 0–9 are equal for the 12 colors
  both have (see Open Props). `grape` and `dark` have no Open Props counterpart.

#### For Uix

A different shade per scheme for the same role (6 in light, 8 in dark) is a choice Uix makes by
computation: its dark theme derives from the light one rather than from a second hand-picked shade.

### Ant Design

Each color is a list of ten shades, numbered 1 (lightest) to 10 (darkest), computed from one seed color
that becomes shade 6, the primary shade. `primary` in `data/ant-design.json` lists the 13 seeds.

#### Generation

`@ant-design/colors` computes the shades in HSV: five lighter shades and four darker ones, each step
turning the hue by 2°, changing the saturation, and raising or lowering the brightness. The dark scales
mix these shades over the dark background `#141414`, in proportions set per step.

#### Use

Since v5, the seeds are design tokens (`colorPrimary`, `colorSuccess`…), and the theme computes the other
tokens from them. The default blue seed is `#1677FF`.

#### For Uix

The principle is the one of Uix: a few seeds, and every color computed. Ant Design computes in HSV, where
equal steps do not look equal, and builds its dark scales from a background color, as Uix does from its
dark base background.

### Chakra UI

Each color is a scale of 11 shades, 50 to 950, close to Tailwind CSS v3: `gray` matches Tailwind `zinc` on
10 of its 11 shades, the other colors match their Tailwind namesake on 6 or 7 shades, and `black` is
Tailwind `zinc-950`.

#### Semantic tokens

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

#### Left out

`data/chakra.json` keeps the shades; the semantic tokens are not extracted.

#### For Uix

The token set is close to the roles Uix derives from its accent. The light and dark values mirror each
other around the middle of the scale (100 ↔ 900, 200 ↔ 800), a pattern a computed dark theme can follow.

### IBM Carbon

Carbon follows the IBM Design Language. Each color is a scale of ten grades, 10 (lightest) to 100
(darkest), named `<swatch>-<grade>` (`blue-60`). Grades are comparable across colors: two colors of the
same grade have about the same lightness.

#### Contrast by grade

The IBM Design Language uses the grade difference to check contrast: two colors 50 grades apart or more
reach the 4.5:1 ratio that WCAG asks for normal text.

#### Hover variants

Each grade has a hover variant (`blue60Hover`), slightly lighter or darker, for the hovered state of an
element of that color. Carbon's four themes (White, Gray 10, Gray 90, Gray 100) pick their tokens from
the grades and these variants.

#### Grays

Three gray families: `coolGray` (bluish), `gray` (neutral) and `warmGray` (brownish).

#### For Uix

Comparable grades are what a contrast setting needs: a rule on the lightness difference between two roles
is enough to keep text readable, whatever the hue.

### Pico CSS

Pico v2 added a full palette: 20 colors, each a scale of 19 shades from 50 (lightest) to 950 (darkest) in
steps of 50, plus `black` and `white`. The fine steps leave room to pick a shade with the right contrast.

#### Use

- Each plain color name points to one shade (`$red` is `$red-550`); `default` in `data/pico.json` lists
  them.
- `pico.colors.css` turns the palette into utility classes, for text and backgrounds.
- Pico ships 20 precompiled themes, one per color, each built on its shades: the page changes color by
  loading another stylesheet.

#### For Uix

The 20 themes show what Uix does with a single setting: Pico precompiles one stylesheet per accent, where
Uix computes the colors from the accent in the browser.

### Wave UI

Wave UI is a Vue UI framework. Its palette has 19 colors, each with six lighter shades (`light1` to
`light6`) and six darker ones (`dark1` to `dark6`) around the base.

#### Origin

The colors follow Material Design 2: 8 bases equal the Material UI 500 shade (pink, deep purple, indigo,
blue, light blue, green, amber, orange); the 11 others are retuned (red is `#fa3317` where Material has
`#f44336`).

#### Use

- Each color and shade gives a text class and a background class (`.pink`, `.pink--bg`, `.pink-light3`),
  and a custom property (`--w-pink-color`).
- The theme has six colors per scheme: `primary`, `secondary`, `info`, `warning`, `success`, `error`
  (`theme` in `data/wave-ui.json`). Wave UI generates their shades, and those of custom colors, in the browser
  by lightening and darkening the color by a fixed step.
- The palette shades are stored values, kept so that existing pages keep their exact colors.

#### For Uix

Wave UI already computes shades at runtime for theme colors. A fixed lightening step reaches white too soon
for light colors, which an OKLCH scale avoids.

### shadcn/ui

shadcn/ui copies its components into the application, with a set of CSS custom properties that a base
color fills. It has no color scales of its own: the values are Tailwind CSS colors, in OKLCH since its
move to Tailwind CSS v4.

#### Semantic tokens

Each base color sets the same tokens, light and dark (`data/shadcn.json`):

- Pairs of a surface and the text on it: `background` / `foreground`, `card`, `popover`, `primary`,
  `secondary`, `muted`, `accent`, each with its `-foreground`.
- `destructive`, the same in every base color: `oklch(0.577 0.245 27.325)`, Tailwind v4 `red-600`, in light
  mode.
- `border`, `input` and `ring` (focus ring).
- `chart-1` to `chart-5`, the series colors of charts.
- `sidebar` and its own pairs, so the sidebar can differ from the page.

#### Base colors

Nine base colors: the five Tailwind neutrals `neutral`, `stone`, `zinc`, `gray`, `slate`, and the four
added in Tailwind v4 `mauve`, `olive`, `mist`, `taupe`. The earlier themes (blue, green, rose…) were written
in HSL for Tailwind v3; `data/shadcn.json` leaves them out.

#### For Uix

The surface / text pairs are a simple contract for components: every surface comes with the text that
reads on it, so a theme cannot forget one of them.

### Flux UI

Flux UI is the component library of Livewire, built on Tailwind CSS v4. It has no colors of its own: an
accent theme sets three properties to Tailwind colors, light and dark.

#### The accent

| Property | Role | Red, light | Red, dark |
|---|---|---|---|
| `--color-accent` | Fills: primary buttons, checked controls | `red-500` | `red-500` |
| `--color-accent-content` | Accent text on the page: links, active items | `red-600` | `red-400` |
| `--color-accent-foreground` | Text on an accent fill | `white` | `white` |

The shades depend on the color: bright colors take a lighter fill and dark text (amber: `amber-400` with
`amber-950`), and the neutral accents (`slate`, `gray`, `zinc`, `neutral`, `stone`) use shade 800 in light
mode and white in dark mode. The default accent is `zinc-800`.

#### Base gray

The interface grays come from `zinc` by default; a theme swaps them for another Tailwind neutral by
redefining the `zinc` shades.

#### For Uix

Three properties are enough for an accent: fill, text on the page, text on the fill. Choosing them by hand
for each color is what Uix replaces with a computation, including the switch to dark text on bright
accents.

## Regenerate

`scripts/extract.mjs` writes every file of `data/` from the downloaded sources, reading them as text. The
versions are written in the script (folder names, version keys): update them there first.

1. In an empty folder outside the repository, download the npm packages without running their scripts, and
   unpack each one into a folder named after its tarball:

   ```sh
   npm pack tailwindcss@4.3.5 tailwindcss@3.4.19 bootstrap@5.3.9 @mui/material@9.5.0 @radix-ui/colors@3.0.0 \
     open-props@1.7.23 @mantine/core@9.8.0 @ant-design/colors@8.0.1 @chakra-ui/react@3.38.0 \
     @carbon/colors@11.62.0 @picocss/pico@2.1.1 wave-ui@4.2.5 --ignore-scripts
   for f in *.tgz; do mkdir -p "${f%.tgz}" && tar --extract --gzip --file "$f" --directory "${f%.tgz}"; done
   ```

2. In a second empty folder, download the shadcn/ui base colors and the Flux UI themes page:

   ```sh
   for c in neutral stone zinc gray slate mauve olive mist taupe; do
     curl --silent --show-error --output "shadcn-$c.json" "https://ui.shadcn.com/r/colors/$c.json"
   done
   curl --silent --show-error --location --output flux-themes.html https://fluxui.dev/themes
   ```

   The list of shadcn/ui base colors comes from its CLI (`shadcn` on npm).

3. Run `node palettes/scripts/extract.mjs <packages folder> <downloads folder> palettes/data`. The script stops
   when a source has changed shape and yields nothing.

The showcase (`prototype/showcase.html`, Palettes page) embeds the palettes in a
`<script type="application/json" id="sc-palettes-data">` element, so it stands alone online. After
regenerating, run `node palettes/scripts/embed.mjs` to embed the new files.
