# uix

A design system for web applications, written in plain HTML and CSS.

- Usable straight from a CDN: no build step on the consumer side.
- Published on npm as `@sfaut/uix`.
- Targets the browser features of [Baseline](https://web.dev/baseline) "Newly available".
- Documented in English, with translations (French first).

The project is at an early design stage: there is nothing to install yet.

## Design tokens

Design tokens (colors, spacing, typography…) are the named values every component is built from. Their
source of truth is written in the [DTCG format](https://www.designtokens.org/), the standard of the W3C
Design Tokens Community Group (first stable version: 2025.10), in `.tokens.json` files.

A DTCG file is JSON with reserved `$`-prefixed properties:

- `$value`: the token value, or an alias to another token (`{color.blue-600}`);
- `$type`: the kind of value (`color`, `dimension`, `fontFamily`…), declared on the token or inherited from
  its group;
- `$description`: what the token is for.

```json
{
  "color": {
    "$type": "color",
    "blue-600": {
      "$value": { "colorSpace": "srgb", "components": [0.145, 0.388, 0.922], "hex": "#2563eb" }
    },
    "primary": {
      "$value": "{color.blue-600}",
      "$description": "Main action color."
    }
  },
  "space": {
    "$type": "dimension",
    "md": { "$value": { "value": 1, "unit": "rem" } }
  }
}
```

[Style Dictionary](https://styledictionary.com/) turns these files into CSS custom properties, prefixed
with `uix-`, which is what the library ships:

```css
:root {
  --uix-color-blue-600: #2563eb;
  --uix-color-primary: var(--uix-color-blue-600);
  --uix-space-md: 1rem;
}
```

Using a standard format keeps the tokens readable by other tools (design tools such as Figma, other
generators) and lets the same source produce further outputs, such as a Tailwind theme.

## License

MIT, see [LICENSE](LICENSE).
