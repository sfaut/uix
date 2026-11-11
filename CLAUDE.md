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
  `<uix-menu>`…), while controls stay native elements (`<button>`, `<input>`, `<select>`, `<fieldset>`)
  so they keep their built-in accessibility and form behavior. Variants are `data-*` attributes
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
    `uix-menu-item`, `start-icon`), and do not mimic native or XUL names (`optgroup`, `hbox`).
  - When an attribute and the children feed the same content (`text` and rich children), the children
    win, and the console gets a warning that names the element, the conflict and the fix.
  - Lists of items are written as `uix-*` children (`<uix-option>`, `<uix-option-group>`); a JavaScript
    property (`options`) will serve programmatic use later. Rich content uses components too
    (`<uix-link>`), and native content HTML is written only inside `<uix-prose>`.
- Goal: users write only `uix-*` tags; native HTML is what Uix renders, not what users write. Every
  component therefore gets an authoring tag, configured through attributes (`<uix-callout tone="warning"
  heading="…" text="…" dismissible>`).
- Uix is for pure application UIs, which hold no prose: the application title is an attribute
  (`<uix-app heading="…">`), and a block of text, when one is really needed, goes in `<uix-prose>`, the
  only place where users write native content HTML (paragraphs, lists, headings). Layout uses structure
  elements, as in XUL / XAML (boxes, spacer, group box…).
- Icons: Lucide by default, other providers possible. An icon is referenced as `provider:name` in
  attributes (`start-icon="lucide:save"`, `end-icon`, `icon`); a registry maps each provider prefix to a
  resolver. Icons render as inline SVG (`<svg data-icon="lucide:save" aria-hidden="true">`), so they take
  the text color and the theme's stroke width.
- `<uix-app>` is the explicit root: Uix styles apply only inside it, so an existing application can adopt
  Uix part by part, and a subtree can override the theme settings. Toasts need no root of their own: they
  are `popover="manual"` elements shown in the top layer.
- Behavior comes first from native HTML (`<dialog>`, `popover`, `<details name>`, invoker commands…), with
  no JavaScript. Purely structural components (`<uix-toolbar>`, boxes…) are styled by CSS alone and
  need no registration. Only what native HTML cannot do gets JavaScript, as custom elements without
  Shadow DOM.
- Philosophy inspired by XUL: dense application UIs, themed from a handful of root settings: fonts
  (interface, headings, code), base font size, unitless line height for density, normal and strong
  weights, text box trim, outer spacing (between elements) and inner spacing (inside controls and
  boxes), radius, corner shape (including squircle), border width, shadow strength, icon stroke width,
  focus ring width and offset, motion duration (forced to 0 under `prefers-reduced-motion`), contrast,
  accent color, semantic hues (danger, success, warning, info) and the dark base background. Features
  some browsers lack (`corner-shape`, `appearance: base-select` for themed option lists) are progressive
  enhancements behind `@supports`; themed option lists are on by default, with a setting to turn them
  off. Every dimension derives from the settings (`em`, `lh`, `calc()`) and every color from the accent
  (relative color syntax, `light-dark()`), so changing a setting re-themes everything. The dark theme is
  computed from the light theme and one dark base background color (grayish, bluish…), whose hue and
  tint every dark neutral keeps. DTCG tokens hold the default values; the derivation formulas live in
  the CSS. Density (compact, comfortable) means a tighter or looser interface: it changes spacing and
  line height, never the font size.
- Every element inside `<uix-app>` uses `box-sizing: border-box`, with no setting to change it.
- JavaScript is written as ES modules with JSDoc types, checked by `tsc --checkJs`: the source file is the
  file served, with no compilation step.
- Design tokens: source of truth in DTCG format (`.tokens.json`), turned into CSS custom properties by
  Style Dictionary. The format is documented in `README.md`.
- Planned tooling (not installed yet): Lightning CSS (bundling, browser targets, minification), Stylelint
  and ESLint, Vitest (JS) and Playwright with axe-core (visual regression, accessibility), Astro Starlight
  for the documentation.
- The documentation is also the component workshop (no Storybook): each component page shows live
  examples next to their HTML, and a showcase page renders every component in every state, light and
  dark side by side. Playwright runs the visual and accessibility tests against these documentation pages.
- Documentation is multilingual: English is the base, translations follow (French first).
- License: MIT (`LICENSE`).

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

## Status

The repository holds no code yet. Choices still open (Tailwind theme, code style for HTML, CSS and
JavaScript) are made with the maintainer; do not decide them alone.
The code style must avoid repetition: the early sketches, with a class on every child element, were
rejected for that reason.

This file grows as decisions are made: commands (build, lint, tests, running a single test), then
architecture (design tokens, components, theming, package distribution).
