# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Uix (GitHub: `sfaut/uix`, npm: `@sfaut/uix`) is a design system for web applications, designed and
written from scratch in this repository. The local folder is named `lib-uix`. In prose, the project name
is written "Uix"; identifiers keep the lowercase form (`uix-` prefix, package names).

Settled decisions:

- The core is plain HTML and CSS, built from scratch: no third-party component library (such as Reka UI)
  underneath. Integrations are separate packages kept in this same repository, all sharing one version
  and one tag:
  - `packages/uix` → npm `@sfaut/uix` (core);
  - `packages/vue` → npm `@sfaut/uix-vue`;
  - `packages/blade` → Composer `sfaut/uix-blade`, whose `composer.json` sits at the repository root
    (Packagist requires it there; one PHP package per repository at most).

  The npm packages are scoped because the unscoped name `uix` is taken. A Tailwind theme is still under
  discussion.
- The library must be usable straight from a CDN, with no build step on the consumer side: the published
  `dist/` is what jsDelivr / unpkg serve. Two forms of use, served by the same files:
  - CDN: everything at once, with one stylesheet and one module script (`uix.css`, `uix.js`); a CSS-only
    use needs the stylesheet alone. No script injects the CSS.
  - Build (Vite, webpack…): everything, or one component at a time (`menu.css`, `menu.js`), through the
    `exports` map of `package.json`; the DTCG tokens are exported too. All CSS lives in `@layer`, so
    import order does not matter, and custom elements are registered only once
    (`if (!customElements.get(…))`), so loading both forms does no harm.
- Browser target: Baseline "Newly available". Modern CSS and HTML features (`@layer`, nesting,
  `light-dark()`, `:has()`, container queries, popover, anchor positioning, invoker commands…) are
  preferred over JavaScript.
- Markup is component-oriented: components are custom elements (`<uix-app>`, `<uix-toolbar>`,
  `<uix-menu>`…). Uix is for applications, not documents: it renders a native element only where the
  element brings behavior that would take real work to rebuild (controls such as `<button>`, `<input>`,
  `<select>`, `<textarea>`, `<label>`; links; `<dialog>`, `popover`, `<details>`, `<fieldset>`), and a
  `<div>` / `<span>` with ARIA where it would bring only meaning and default styles (a heading is
  `<div role="heading" aria-level="1">`; paragraphs, lists, sections). `<uix-prose>` is the exception,
  where users write native content HTML. Screen reader support beyond this is set aside for now.
  Variants are `data-*` attributes
  (`<button data-variant="primary">`), with no required class. Custom properties are prefixed with `uix-`.
- Variants that exclude each other are one enumerated attribute (`variant="primary"`, `size="small"`,
  `tone="danger"`), so an impossible combination cannot be written; boolean attributes are kept for
  states that combine (`disabled`, `dismissible`, `icon-only`).
- Two levels of markup:
  - The rendered HTML is the reference: native controls, structural `uix-*` components, `data-*`
    variants. It is what the CSS styles, what assistive technologies and forms see, and what is tested.
  - Authoring tags (`<uix-button>`, `<uix-input>`, `<uix-select>`…) are shorter to write and produce
    exactly that HTML, from three producers: custom elements in the browser (CDN, plain HTML, htmx),
    Blade components, Vue components. A browser-side authoring element renders its native HTML once in
    light DOM (skipping it when already present, as when a server rendered it), keeps it in sync with its
    attributes, and relays properties (`value`, `checked`, `disabled`, `focus()`) to the native control.
    Authoring tags need JavaScript; the rendered HTML does not.
  - Authoring content goes in attributes (`<uix-button label="Save" variant="primary">`). Children are
    used only for rich or structured content (inline HTML such as a link, a list of items). On authoring
    tags, variants are plain attributes (`variant="primary"`); on native elements, they are `data-*`
    attributes (`data-variant="primary"`).
  - Authoring attributes never reuse a global HTML attribute for another meaning: `title` shows a tooltip
    on any element, so a heading is `heading="…"`, never `title="…"`.
  - Element and attribute names are full English words in kebab-case (`uix-option-group`,
    `uix-menu-item`, `start-icon`), and do not mimic native or XUL names (`optgroup`, `hbox`). Compound
    words follow English spelling: one word when English writes one (`toolbar`, `checkbox`), a hyphen
    between separate words (`status-bar`).
  - When an attribute and the children feed the same content (`text` and rich children), the children
    win, and the console gets a warning that names the element, the conflict and the fix.
  - Lists of items are written as `uix-*` children (`<uix-option>`, `<uix-option-group>`); a JavaScript
    property (`options`) will serve programmatic use later. Rich content uses components too
    (`<uix-link>`), and native content HTML is written only inside `<uix-prose>`.
- Goal: users write only `uix-*` tags; native HTML is what Uix renders, not what users write. Every
  component therefore gets an authoring tag, configured through attributes (`<uix-callout tone="warning"
  heading="…" text="…" dismissible>`).
- Layout attributes, on rows, columns and grids: `align` (`start | center | end | stretch | baseline`,
  across the axis: vertical in a row, horizontal in a column; in a grid, vertical in each cell),
  `justify` (`start | center | end | space-between`, along the axis; in a grid, horizontal in each cell), `gap` (`none | small |
  large`), `wrap`, `grow` (alone = 1, or `0`, `2`, `3`: a share of the free space), `width`, `height`,
  `min-width`, `max-width`, `min-height`, `max-height` (any CSS length), `scroll`, `padding` (alone = the inner
  spacing, or `small`, `large`, `none`; no padding by default, except on the application); `columns` and `rows`
  (CSS grid tracks) on `uix-grid`; `span` (`2 | 3 | 4 | all`) on a child of `uix-grid`; `persist` on
  `uix-splitter`. A foreign element (not a `uix-*` tag) inside a container accepts `grow` and `span`, but
  no size: native elements already give `width` another meaning (pixels on `<img>`, `<canvas>`). Each
  container accepts the attributes it applies: rows and columns all of them; the application `align`,
  `justify`, `gap`, `padding` and no size; a grid all but `wrap`; toolbars and status bars `justify` and
  `gap`; groups only those of an item. A refused attribute brings a console warning with its reason.
- Scrolling: components holding content of free length (navigation, list, table, tree, text area,
  prose) scroll by themselves once their size is constrained; layout boxes scroll only with `scroll`.
- In a row, a field's label stays on one line: the field never gets narrower than its label.
- Overflow: a box never gets smaller than its content, so content never spills over its neighbors; what
  does not fit makes the nearest scrolling element scroll, or else the application. A written size
  (`width`, `height`) gives way only to content that cannot wrap (a button, a word, a field and its
  label), unless `min-width` / `min-height` is written; a scrolling element keeps its size.
- Every component has a layout type, which sets who places it and which layout attributes it accepts. A
  layout attribute its type does not accept has no effect and brings a console warning.
- `<uix-panel text="…" tone="info">` is a framed area holding a short text or rich children, colored by
  `tone` (`info | success | warning | danger`). Documentation examples use panels to stand for any
  content: examples are written with `uix-*` elements only, never with elements made for the
  documentation.
- `<uix-app background-pattern="…">` repeats a tile over the canvas, drawn with CSS gradients in a color
  a little darker than the canvas (lighter in the dark theme): `none | dots | staggered-dots | grid |
  graph-paper | horizontal-lines | vertical-lines | diagonal-lines | crosshatch | checkerboard | zigzag`,
  `dots` by default. The theme sets the tile size, the thickness of dots and lines, and the contrast
  (`--uix-background-pattern-size`, `-thickness`, `-contrast`). Custom SVG tiles, used as a mask colored
  by the theme, will come later.
- Uix is for pure application UIs, which hold no prose: the application title is an attribute
  (`<uix-app heading="…">`), and a block of text, when one is really needed, goes in `<uix-prose>`, the
  only place where users write native content HTML (paragraphs, lists, headings). Layout uses structure
  elements, as in XUL / XAML (boxes, spacer, group box…).
- Icons: Lucide by default, other providers possible. An icon is referenced as `provider:name` in
  attributes (`start-icon="lucide:save"`, `end-icon`, `icon`); a registry maps each provider prefix to a
  resolver. Icons render as inline SVG (`<svg data-icon="lucide:save" aria-hidden="true">`), so they take
  the text color and the theme's stroke width.
- `<uix-app>` is the explicit root: Uix styles apply only inside it, so an existing application can adopt
  Uix part by part, and a subtree can override the theme settings. The root takes all the space of its
  parent, with a margin inside its edges set by the inner spacing, and has no size attribute; right in
  `<body>`, it fills the window, and the body loses its margin (the only style Uix sets outside a root). A
  `<uix-app>` inside another is an application like any other (same heading, same default pattern),
  placed as an item of its parent's layout, where it takes the space its siblings leave. Toasts need no root of their own: they
  are `popover="manual"` elements shown in the top layer.
- Behavior comes first from native HTML (`<dialog>`, `popover`, `<details name>`, invoker commands…), with
  no JavaScript. Purely structural components (`<uix-toolbar>`…) are styled by CSS alone and need no
  registration. Layout elements take free values in attributes (`width="16em"`, `columns="auto 1fr"`):
  CSS reads them with typed `attr()` where supported (Chromium, Firefox; not stable Safari as of
  2026-11, an Interop 2026 focus area), and a few lines of JavaScript copy them to custom properties
  elsewhere. Only what native HTML cannot do gets JavaScript, as custom elements without
  Shadow DOM.
- Philosophy inspired by XUL: dense application UIs, themed from a handful of root settings: fonts
  (interface, headings, code), base font size, unitless line height for density, normal and strong
  weights, text box trim, outer spacing (between elements) and inner spacing (inside controls and
  boxes), radius, corner shape (including squircle), border width, shadow strength, icon stroke width,
  focus ring width and offset, motion (a base duration, from which the durations of state feedback,
  entering and leaving derive by default, each settable, with an easing curve for each and the distance an
  element slides in; under `prefers-reduced-motion`, nothing slides, while short fades and color changes
  stay), contrast, background pattern (tile size, thickness, contrast),
  accent color, semantic hues (danger, success, warning, info) and the dark base background. Features
  some browsers lack (`corner-shape`, `appearance: base-select` for themed option lists) are progressive
  enhancements behind `@supports`; themed option lists are on by default, with a setting to turn them
  off. Every dimension derives from the settings (`em`, `lh`, `calc()`) and every color from the accent
  (relative color syntax, `light-dark()`), so changing a setting re-themes everything. The dark theme is
  computed from the light theme and one dark base background color (grayish, bluish…), whose hue and
  tint every dark neutral keeps. The theme follows the system (light or dark) by default; a page sets
  `color-scheme` to force one. DTCG tokens hold the default values; the derivation formulas live in
  the CSS. Density (compact, comfortable) means a tighter or looser interface: it changes spacing and
  line height, never the font size.
- Every element inside `<uix-app>` uses `box-sizing: border-box`, with no setting to change it.
- JavaScript is written as ES modules with JSDoc types, checked by `tsc --checkJs`: the source file is the
  file served, with no compilation step.
- Code style: 4-space indentation; double quotes (JavaScript strings, HTML attributes, CSS strings);
  modern CSS (layers, nesting, logical properties, relative colors, `light-dark()`); modern JavaScript
  (private fields, optional chaining, `??`, destructuring, template literals). The mockup keeps its own
  style.
- Design tokens: source of truth in DTCG format (`.tokens.json`), turned into CSS custom properties by
  Style Dictionary. The format is documented in `README.md`.
- Planned tooling (not installed yet, apart from TypeScript): Lightning CSS (bundling, browser targets, minification), Stylelint
  and ESLint, Vitest (JS) and Playwright with axe-core (visual regression, accessibility), Astro Starlight
  for the documentation.
- The documentation is also the component workshop (no Storybook): each component page shows live
  examples next to their HTML, and a showcase page renders every component in every state, light and
  dark side by side; applications are shown in 16:9 screens. Playwright runs the visual and accessibility tests against these documentation pages.
  Examples write widths in `ch` (`width="26ch"`) and heights in `lh` (`height="6lh"`).
- Documentation is multilingual: English is the base, translations follow (French first).
- License: MIT (`LICENSE`).

## Commands

- `npm install`: installs the development tools (TypeScript), for the npm workspace of `packages/uix`.
- `npm run check`: type-checks the JavaScript sources (`tsc` with `checkJs`, through `tsconfig.json`).

## Working rules

- The maintainer's global directives (user-level `CLAUDE.md`) apply here. This file only records what is
  specific to this project, including exceptions to those directives.
- Everything in the repository is written in English (code, comments, commit messages, changelog,
  issues), except for the translated pages of the documentation.
- Git: read and write operations are allowed in this repository, remote included (push, deletion of
  remote branches), which lifts the global read-only rule. Claude Code may publish versions by following
  the global release procedure. The global Git conventions still apply. The main branch is `master`.
- The GitHub repository keeps issues and pull requests; wiki, projects and discussions are disabled.

## CSS pitfalls

Cases met while prototyping, to avoid repeating them:

- Hairlines (separators, rules): draw them with a border on a zero-size box (`inline-size: 0;
  border-inline-start: 1px solid …`), never with a background on a 1px box. Browsers snap borders to whole
  device pixels; a 1px background box landing on a fractional position (another font size, zoom, display
  scaling) is antialiased over two device pixels and looks thicker.
- `text-box` / `text-box-trim` only applies to block containers and inline boxes. An element whose text
  must be trimmed (a button, a menu item) cannot be a flex or grid container: use `block` or
  `inline-block`.
- Browsers read some authoring attributes as obsolete HTML attributes, even on custom elements: Chrome
  turns `align="end"` on `<uix-row>` into `text-align: end` for everything inside. Such an effect is
  undone in CSS (`text-align: inherit`), and a new attribute name is checked for it.

## Status

The library code starts in `packages/uix/src`, ported from the mockup one component at a time: one
stylesheet and one module per component (`app.css`, `app.js`), the shared JavaScript in `core.js`, and
`uix.css` / `uix.js` gathering everything. `packages/uix/demo/*.html` load the sources as they are: serve the
repository root over HTTP and open them. `prototype/showcase.html` is the design mockup: the library CSS
and JavaScript and the showcase, in one page served as is (Chrome refuses it from `file://`: serve it
over HTTP locally). The reference is the private artifact
<https://claude.ai/artifact/APutT4LLK3SKG57L8TmX76>, and the file is its clone, kept up to date: read the
artifact before changing the file, and bring the file back in step with each publication. The file is the page as served
online, wrapped by the artifact service in a document skeleton (the first line up to `<body>`, and the
closing `</body></html>`): remove that skeleton before publishing it again. Its Palettes page embeds
`palettes/data/*.json`. `docs/STATUS.md` sums up where the
design stands and what is left: read it when resuming the work, and update it as decisions are made. Choices still open (Tailwind theme, the rest of the code style) are made with the
maintainer; do not decide them alone.
The code style must avoid repetition: the early sketches, with a class on every child element, were
rejected for that reason.

This file grows as decisions are made: commands (build, lint, tests, running a single test), then
architecture (design tokens, components, theming, package distribution).
