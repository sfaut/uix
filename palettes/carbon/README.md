# IBM Carbon

Carbon follows the IBM Design Language. Each color is a scale of ten grades, 10 (lightest) to 100
(darkest), named `<swatch>-<grade>` (`blue-60`). Grades are comparable across colors: two colors of the
same grade have about the same lightness.

## Contrast by grade

The IBM Design Language uses the grade difference to check contrast: two colors 50 grades apart or more
reach the 4.5:1 ratio that WCAG asks for normal text.

## Hover variants

Each grade has a hover variant (`blue60Hover`), slightly lighter or darker, for the hovered state of an
element of that color. Carbon's four themes (White, Gray 10, Gray 90, Gray 100) pick their tokens from
the grades and these variants.

## Grays

Three gray families: `coolGray` (bluish), `gray` (neutral) and `warmGray` (brownish).

## For Uix

Comparable grades are what a contrast setting needs: a rule on the lightness difference between two roles
is enough to keep text readable, whatever the hue.
