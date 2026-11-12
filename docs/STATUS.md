# Status

Where the design of Uix stands, to pick the work up later. Settled decisions live in `CLAUDE.md`; this
file sums up what was explored, what the mockup holds, and what is left. Last update: 2026-11-12.

## The mockup

The design is explored in a single-page mockup: the library CSS and JavaScript, and a showcase with one
page per component, each example shown with its source and the HTML it produces.

- In the repository: `prototype/showcase.html`. Chrome refuses it from `file://`: serve the folder over
  HTTP locally (any static server on 127.0.0.1).
- Published as a private artifact: <https://claude.ai/artifact/APutT4LLK3SKG57L8TmX76> (mockup 15). Claude
  Code can read it back with its Artifact tool (`action: "read"`) and republish to the same link. Keep the
  file and the artifact in step.
- Checked in Chrome, light theme. Not checked: the dark theme, Firefox, and the Safari fallback that
  copies free values to custom properties with JavaScript.
- Showcase pages: Application, Row, Column, Grid, Sizes and scroll, Layout types, Panel, Button, Menu,
  Text field, Select, Checkbox and radio, Callout, Link, Prose.

## Explored and settled

All recorded in `CLAUDE.md`:

- Foundations: plain HTML and CSS, custom elements without Shadow DOM, two levels of markup (authoring
  `uix-*` tags producing native HTML), content in attributes, enumerated variants, naming rules, icons,
  theme settings, distribution (CDN and build), packages.
- Layout attributes: `align` (including `baseline`), `justify`, `gap`, `wrap`, `grow`, sizes (`width`,
  `height`, `min-*`, `max-*`), `scroll`, `columns` and `rows` on `uix-grid`, `span` on a grid child,
  `persist` on `uix-splitter`.
- Alignment relative to the axis; in a grid, `align` is vertical in each cell and `justify` horizontal.
- Free values read with typed `attr()` where supported, copied by JavaScript elsewhere.
- Scrolling: components of free length scroll by themselves; layout boxes only with `scroll`.
- Overflow: a box never gets smaller than its content; a written size gives way only to content that
  cannot wrap, unless `min-width` / `min-height` is written.
- In a row, a field's label stays on one line.
- Every component has a layout type, and an attribute its type does not accept brings a console warning.
- Foreign elements accept `grow` and `span`, no size.
- `<uix-panel text="…" tone="…">`: a framed area holding a short text or rich children (children win,
  with a warning), colored by `tone`. Documentation examples use panels to stand for any content, and
  are written with `uix-*` elements only.
- Showcase examples write widths in `ch` and heights in `lh`.

## In the mockup, not recorded yet

Choices made while building the mockup, to confirm or revise before they go into `CLAUDE.md`:

- Layer order: `uix.settings, uix.base, uix.content, uix.structure, uix.controls, uix.components,
  uix.sizes`. `uix.sizes` comes last so written sizes win over component defaults.
- Layout types and their members:

  | Type | Placed by | Accepts | Members |
  |---|---|---|---|
  | container | its parent container; places its children | `align`, `justify`, `gap`, `wrap`, `scroll`, and those of an item | `uix-app`, `uix-row`, `uix-column`, `uix-grid`, `uix-toolbar`, `uix-status-bar`, `uix-group`, `uix-radio-group` |
  | item | its parent container | `grow`, `span` (in a grid), sizes | `uix-input`, `uix-select`, `uix-button`, `uix-checkbox`, `uix-callout`, `uix-panel`, `uix-prose`, `uix-status-item`, `uix-spacer`; foreign elements (`grow` and `span` only) |
  | floating | anchored to what opens it | sizes | `uix-menu` (later: dialog, toast) |
  | inline | the text around it | none | `uix-link` |
  | part | the component it belongs to | none | `uix-menu-item`, `uix-separator`, `uix-radio`, `uix-splitter` |
  | data | never shown; read by its component | none | `uix-option`, `uix-option-group` |

- Defaults: a row centers its children vertically (`align="center"`), a column stretches them
  (`align="stretch"`).
- `uix-grid` defaults to `columns="auto 1fr"`; a field spans a whole line and lays its label and control
  on the grid columns (subgrid), so all labels share one width.
- Along a column, a box holding a scrolling element (`[scroll]`, `uix-prose`) may shrink below its
  content, so that element scrolls. Known limit: other too-tall content in the same box can spill.
- Console warning format: `'x' has no effect here: … Remove it.`, with a hint when one helps.
- Proposed names still open: `uix-row`, `uix-column`, `uix-group`, `uix-status-item`.

## Left to do

In order, as agreed:

1. Finish the layout.
   - Fields next to buttons: a field's control should line up with a button or a checkbox beside it,
     whatever the labels, hints and errors. Proposal, not applied: `<uix-grid labels="above">`, where
     each child spans three rows (label, control, message) shared by the whole line through subgrid.
     An earlier idea, offsetting the buttons, was dropped as too fragile.
   - Confirm the choices listed under "In the mockup, not recorded yet".
2. Navigation, table and tabs components. Navigation replaces the ghost buttons of the application
   example.
3. Check the dark theme, Firefox and the Safari fallback.

Later, still open:

- Tailwind theme: whether to ship one.
- Code style for HTML, CSS and JavaScript, to be chosen with the maintainer; it must avoid repetition.
- A JavaScript `options` property for programmatic lists.
- Moving from the mockup to the repository: packages (`packages/uix`, `packages/vue`,
  `packages/blade`), DTCG tokens and Style Dictionary, then the planned tooling (Lightning CSS,
  Stylelint, ESLint, Vitest, Playwright with axe-core, Astro Starlight for the documentation and
  showcase).
