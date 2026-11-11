# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Uix (GitHub: `sfaut/uix`, npm: `@sfaut/uix`) is a design system for web applications, designed and
written from scratch in this repository. The local folder is named `lib-uix`. In prose, the project name
is written "Uix"; identifiers keep the lowercase form (`uix-` prefix, package names).

Settled decisions:

- The core is plain HTML and CSS, built from scratch: no third-party component library (such as Reka UI)
  underneath. Integrations (Blade components, Vue components…) are separate packages kept in this same
  repository; their names and layout are not settled yet. A Tailwind theme is still under discussion.
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
- Every class and custom property is prefixed with `uix-` (`.uix-button`, `--uix-color-primary`).
- Behavior comes first from native HTML (`<dialog>`, `popover`, `<details name>`, invoker commands…), with
  no JavaScript. Only what native HTML cannot do gets JavaScript, as custom elements (`<uix-tabs>`)
  without Shadow DOM: their content stays ordinary HTML in the page, so the library CSS, the user's
  classes, ARIA `id` references and form submission keep working. No Shadow DOM.
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

## Status

The repository holds no code yet. Choices still open (Tailwind theme, names and layout of the integration
packages, code style for HTML, CSS and JavaScript) are made with the maintainer; do not decide them alone.
The code style must avoid repetition: the early sketches, with a class on every child element, were
rejected for that reason.

This file grows as decisions are made: commands (build, lint, tests, running a single test), then
architecture (design tokens, components, theming, package distribution).
