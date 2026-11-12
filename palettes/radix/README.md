# Radix Colors

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

## Grays

Radix pairs each color with a gray of a close tint: mauve with tomato, red, ruby, crimson, pink, plum,
purple and violet; slate with iris, indigo, blue, sky and cyan; sage with mint, teal, jade and green; olive
with grass and lime; sand with yellow, amber, orange and brown. `gray` is neutral.

## Left out

The package also ships each scale in alpha (transparent steps that give the same color over the matching
background) and in Display P3. `palette.json` keeps the sRGB steps.

## For Uix

The roles are the useful part: they match what Uix derives from the accent (backgrounds, interactive
states, borders, solid fills, text), and give a tested order for them.
