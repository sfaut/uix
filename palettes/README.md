# Palettes

Color palettes of well-known frameworks, for reference while designing the Uix colors. One file per
framework, shaped `{"<framework>": {"v<version>": {...}}}`. Values keep the notation of their source
(hex, `oklch()`, `rgba()`). Collected on 2026-11-12, by reading each source as text (nothing was run).

| File | Version | Source | Content |
|---|---|---|---|
| `tailwind.json` | v4.3.5, v3.4.19 | npm `tailwindcss`: `theme.css` (v4), `lib/public/colors.js` (v3) | 50–950 per color; v4 in OKLCH, v3 in hex. The deprecated v3 aliases (`lightBlue`…) are left out. |
| `bootstrap.json` | v5.3.9 | npm `bootstrap`: `scss/_variables.scss` | 100–900 per color, computed as Sass does (`tint-color` mixes with white, `shade-color` with black), checked against `$blue-100` and `$blue-900`; grays; `theme` maps the theme colors. |
| `material-ui.json` | v9.5.0 | npm `@mui/material`: `colors/` | The Material Design 2 palette: 50–900 and A100–A700. |
| `radix.json` | v3.0.0 | npm `@radix-ui/colors` | Steps 1–12, `light` and `dark`, sRGB. The Display P3 and alpha variants are left out. |
| `open-props.json` | v1.7.23 | npm `open-props`: `src/props.colors*.css` | `hex`: 0–12 per color. `oklch`: one lightness and chroma scale (0–15) applied to `--color-hue`, and the named hues. |
| `mantine.json` | v9.8.0 | npm `@mantine/core`: `default-colors` | Ten shades, indexed 0–9 as in Mantine. |
| `ant-design.json` | v8.0.1 | npm `@ant-design/colors`: `presets` | Ten shades, numbered 1–10 as in the Ant Design documentation (6 is the primary shade), `light` and `dark`; `primary` lists the seed colors. |
| `chakra.json` | v3.38.0 | npm `@chakra-ui/react`: `theme/tokens/colors` | 50–950 per color; semantic tokens are left out. |
| `carbon.json` | v11.62.0 | npm `@carbon/colors`: `tokens/colors.tokens.json` (DTCG) | 10–100 per color, and their hover variants. |
| `pico.json` | v2.1.1 | npm `@picocss/pico`: `scss/colors/_index.scss` | 50–950 per color; `default` names the shade each plain color name points to. |
| `wave-ui.json` | v4.2.5 | npm `wave-ui`: `utils/colors.js`, `utils/config.js` | `palette`: each color with six lighter and six darker shades; `theme`: the default light and dark theme colors. |
| `shadcn.json` | v4.23.0 (CLI) | registry `ui.shadcn.com/r/colors/<base>.json` | Semantic tokens (`background`, `primary`, `border`…) of each base color, `light` and `dark`. Its color scales are Tailwind's. |
| `flux.json` | v2.21.0 | `fluxui.dev/themes` | Accent themes (`accent`, `accent-content`, `accent-foreground`), `light` and `dark`, as Tailwind CSS v4 color names (`red-500`). |

## Regenerate

`extract.mjs` writes every file from the downloaded sources, reading them as text. The versions are written
in the script (folder names, version keys): update them there first.

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

3. Run `node extract.mjs <packages folder> <downloads folder> <output folder>`. The script stops when a source
   has changed shape and yields nothing.

The showcase (`prototype/showcase.html`, Palettes page) embeds these files in a
`<script type="application/json" id="sc-palettes-data">` element, so it stands alone online: replace its
content after regenerating.
