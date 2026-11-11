# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`uix` (GitHub: `sfaut/uix`, npm: `@sfaut/uix`) is a design system for web applications, designed and
written from scratch in this repository. The local folder is named `lib-uix`.

Settled decisions:

- The core is plain HTML and CSS, built from scratch: no third-party component library (such as Reka UI)
  underneath. Whether to add integrations (Tailwind theme, Blade or Vue components…) is still under
  discussion.
- The library must be usable straight from a CDN, with no build step on the consumer side: the published
  `dist/` is what jsDelivr / unpkg serve.
- Browser target: Baseline "Newly available". Modern CSS and HTML features (`@layer`, nesting,
  `light-dark()`, `:has()`, container queries, popover, anchor positioning, invoker commands…) are
  preferred over JavaScript.
- Every class and custom property is prefixed with `uix-` (`.uix-button`, `--uix-color-primary`).
- JavaScript, if any, is written as ES modules with JSDoc types, checked by `tsc --checkJs`: the source
  file is the file served, with no compilation step.
- Design tokens: source of truth in DTCG format (`.tokens.json`), turned into CSS custom properties by
  Style Dictionary. The format is documented in `README.md`.
- Planned tooling (not installed yet): Lightning CSS (bundling, browser targets, minification), Stylelint
  and ESLint, Vitest (JS) and Playwright with axe-core (visual regression, accessibility), Astro Starlight
  for the documentation.
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

The repository holds no code yet. Structural choices still open (integrations, JavaScript form) are made
with the maintainer; do not decide them alone.

This file grows as decisions are made: commands (build, lint, tests, running a single test), then
architecture (design tokens, components, theming, package distribution).
