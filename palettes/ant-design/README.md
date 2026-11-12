# Ant Design

Each color is a list of ten shades, numbered 1 (lightest) to 10 (darkest), computed from one seed color
that becomes shade 6, the primary shade. `primary` in `palette.json` lists the 13 seeds.

## Generation

`@ant-design/colors` computes the shades in HSV: five lighter shades and four darker ones, each step
turning the hue by 2°, changing the saturation, and raising or lowering the brightness. The dark scales
mix these shades over the dark background `#141414`, in proportions set per step.

## Use

Since v5, the seeds are design tokens (`colorPrimary`, `colorSuccess`…), and the theme computes the other
tokens from them. The default blue seed is `#1677FF`.

## For Uix

The principle is the one of Uix: a few seeds, and every color computed. Ant Design computes in HSV, where
equal steps do not look equal, and builds its dark scales from a background color, as Uix does from its
dark base background.
