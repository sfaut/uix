// Reads the color sources of each framework as text (nothing from the packages is executed) and writes
// one JSON file per framework, <output>/<framework>.json: {"<framework>": {"v<version>": {...}}}.
// Usage: node palettes/scripts/extract.mjs <packages dir> <downloads dir> [output dir] (default: palettes/data;
// see palettes/README.md, "Regenerate").

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const [packages, downloads, output = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'data')] = process.argv.slice(2);
if (!packages || !downloads) {
  console.error('Usage: node palettes/scripts/extract.mjs <packages dir> <downloads dir> [output dir]');
  process.exit(1);
}
const read = (...parts) => fs.readFileSync(path.join(...parts), 'utf8');
const pkg = (name, file) => read(packages, name, 'package', file);
const all = (text, regex) => [...text.matchAll(regex)];
const fail = (message) => { console.error(message); process.exit(1); };
const count = (object) => Object.keys(object).length;

/**
 * Writes {"name": {"version": data}}, checking the data is not empty.
 */
function write(name, versions) {
  for (const [version, data] of Object.entries(versions)) {
    if (!data || count(data) === 0) fail(`${name} ${version}: nothing extracted`);
  }
  fs.mkdirSync(output, { recursive: true });
  fs.writeFileSync(path.join(output, `${name}.json`), `${JSON.stringify({ [name]: versions }, null, 2)}\n`);
  const sizes = Object.entries(versions).map(([version, data]) => `${version}: ${Object.keys(data).join(', ')}`);
  console.log(`${name} → ${sizes.join(' | ')}`);
}

/**
 * Groups "name-shade" custom properties into {name: {shade: value}}; plain names stay values.
 */
function scales(entries) {
  const result = {};
  for (const [name, value] of entries) {
    const match = name.match(/^([a-z]+(?:-[a-z]+)*?)-(\d+)$/);
    if (match) {
      (result[match[1]] ??= {})[match[2]] = value;
    } else {
      result[name] = value;
    }
  }
  return result;
}

/* Tailwind CSS */
{
  const v4 = scales(all(pkg('tailwindcss-4.3.5', 'theme.css'), /--color-([a-z]+(?:-\d+)?):\s*([^;]+);/g).map((m) => [m[1], m[2].trim()]));
  const v3source = pkg('tailwindcss-3.4.19', 'lib/public/colors.js');
  const v3 = {};
  for (const m of all(v3source, /^ {4}(black|white): "([^"]+)"/gm)) v3[m[1]] = m[2];
  for (const m of all(v3source, /^ {4}([a-z]+): \{\n([^}]+)\}/gm)) {
    v3[m[1]] = Object.fromEntries(all(m[2], /(\d+): "([^"]+)"/g).map((s) => [s[1], s[2]]));
  }
  write('tailwind', { 'v4.3.5': v4, 'v3.4.19': v3 });
}

/* Bootstrap: the 100–900 scales are computed as Sass does (tint-color = mix with white, shade-color = mix with black). */
{
  const source = pkg('bootstrap-5.3.9', 'scss/_variables.scss');
  const hex = (value) => {
    const h = value.replace('#', '');
    const full = h.length === 3 ? [...h].map((c) => c + c).join('') : h;
    return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
  };
  const mix = (a, b, weight) => `#${hex(a).map((c, i) => Math.round(c * weight + hex(b)[i] * (1 - weight) + 1e-9).toString(16).padStart(2, '0')).join('')}`;
  const base = Object.fromEntries(all(source, /^\$([a-z]+(?:-\d+)?):\s+(#[0-9a-f]+) !default;/gm).map((m) => [m[1], m[2]]));
  const result = { white: base.white, black: base.black, gray: {} };
  for (const [name, value] of Object.entries(base)) {
    const gray = name.match(/^gray-(\d+)$/);
    if (gray) result.gray[gray[1]] = value;
  }
  for (const m of all(source, /^\$([a-z]+)-(\d+): (tint-color|shade-color)\(\$\1, (\d+)%\) !default;/gm)) {
    const color = base[m[1]] ?? fail(`bootstrap: no base for ${m[1]}`);
    (result[m[1]] ??= {})[m[2]] = mix(m[3] === 'tint-color' ? '#ffffff' : '#000000', color, Number(m[4]) / 100);
  }
  for (const m of all(source, /^\$([a-z]+)-500: \$\1 !default;/gm)) result[m[1]]['500'] = base[m[1]];
  for (const name of Object.keys(result)) {
    if (typeof result[name] === 'object') result[name] = Object.fromEntries(Object.entries(result[name]).sort((a, b) => a[0] - b[0]));
  }
  result.theme = {};
  for (const m of all(source, /^\$(primary|secondary|success|info|warning|danger|light|dark):\s+\$([a-z]+(?:-\d+)?) !default;/gm)) {
    result.theme[m[1]] = base[m[2]] ?? fail(`bootstrap: no value for ${m[2]}`);
  }
  if (result.blue['100'] !== '#cfe2ff' || result.blue['900'] !== '#031633') fail('bootstrap: mix check failed');
  write('bootstrap', { 'v5.3.9': result });
}

/* Material UI: the Material Design 2 palette. */
{
  const dir = path.join(packages, 'mui-material-9.5.0', 'package', 'colors');
  const result = {};
  for (const file of fs.readdirSync(dir).filter((f) => /^[a-zA-Z]+\.js$/.test(f) && f !== 'index.js').sort()) {
    const name = file.replace('.js', '');
    const values = Object.fromEntries(all(fs.readFileSync(path.join(dir, file), 'utf8'), /^\s+(\w+): '([^']+)'/gm).map((m) => [m[1], m[2]]));
    if (name === 'common') Object.assign(result, values);
    else result[name] = values;
  }
  write('material-ui', { 'v9.5.0': result });
}

/* Radix Colors: sRGB values, light and dark; the Display P3 and alpha variants are left out. */
{
  const dir = path.join(packages, 'radix-ui-colors-3.0.0', 'package');
  const result = { light: {}, dark: {} };
  for (const file of fs.readdirSync(dir).filter((f) => /^[a-z]+(-dark)?\.css$/.test(f)).sort()) {
    const text = fs.readFileSync(path.join(dir, file), 'utf8');
    const first = text.slice(0, text.indexOf('}'));
    const theme = file.includes('-dark') ? 'dark' : 'light';
    const name = file.replace(/(-dark)?\.css$/, '');
    result[theme][name] = Object.fromEntries(all(first, /--[a-z]+-(\d+):\s*([^;]+);/g).map((m) => [m[1], m[2].trim()]));
  }
  write('radix', { 'v3.0.0': result });
}

/* Open Props: the hex palette, and the OKLCH palette (one lightness and chroma scale, applied to named hues). */
{
  const hexes = scales(all(pkg('open-props-1.7.23', 'src/props.colors.css'), /--([a-z]+-\d+):\s*([^;]+);/g).map((m) => [m[1], m[2].trim()]));
  const oklch = pkg('open-props-1.7.23', 'src/props.colors-oklch.css');
  const scale = Object.fromEntries(all(oklch, /--color-(\d+):\s*([^;\n]+?);?\n/g).map((m) => [m[1], m[2].trim()]));
  const hues = Object.fromEntries(all(pkg('open-props-1.7.23', 'src/props.colors-oklch-hues.css'), /--hue-([a-z]+):\s*([^;]+);/g).map((m) => [m[1], Number(m[2])]));
  write('open-props', { 'v1.7.23': { hex: hexes, oklch: { scale, hues } } });
}

/* Mantine: ten shades per color, indexed 0–9. */
{
  const source = pkg('mantine-core-9.8.0', 'esm/core/MantineProvider/default-colors.mjs');
  const result = {};
  for (const m of all(source, /^\t(\w+): \[([^\]]+)\]/gm)) {
    result[m[1]] = Object.fromEntries(all(m[2], /"([^"]+)"/g).map((s, index) => [String(index), s[1]]));
  }
  write('mantine', { 'v9.8.0': result });
}

/* Ant Design: ten shades per color, numbered 1–10 as in the documentation (6 is the primary shade). */
{
  const source = pkg('ant-design-colors-8.0.1', 'es/presets.js');
  const primary = JSON.parse(source.match(/presetPrimaryColors = (\{[^}]+\})/)[1]);
  const result = { primary, light: {}, dark: {} };
  for (const m of all(source, /^export const (\w+?)(Dark)? = \[([^\]]+)\]/gm)) {
    result[m[2] ? 'dark' : 'light'][m[1]] = Object.fromEntries(all(m[3], /"([^"]+)"/g).map((s, index) => [String(index + 1), s[1]]));
  }
  write('ant-design', { 'v8.0.1': result });
}

/* Chakra UI: the base color tokens. */
{
  const source = pkg('chakra-ui-react-3.38.0', 'dist/esm/theme/tokens/colors.js');
  const result = {};
  for (const m of all(source, /^ {2}(black|white): \{ value: "([^"]+)" \}/gm)) result[m[1]] = m[2];
  for (const m of all(source, /^ {2}(\w+): \{\n((?: {4}\d+: \{ value: "[^"]+" \},?\n)+)/gm)) {
    result[m[1]] = Object.fromEntries(all(m[2], /(\d+): \{ value: "([^"]+)" \}/g).map((s) => [s[1], s[2]]));
  }
  write('chakra', { 'v3.38.0': result });
}

/* IBM Carbon: shades 10–100 and their hover variants, from its own DTCG file. */
{
  const tokens = JSON.parse(pkg('carbon-colors-11.62.0', 'tokens/colors.tokens.json'));
  const result = {};
  for (const [name, token] of Object.entries(tokens)) {
    if (name.startsWith('$')) continue;
    result[name] = token.$value
      ? token.$value.hex
      : Object.fromEntries(Object.entries(token).filter(([key]) => !key.startsWith('$')).map(([key, value]) => [key, value.$value.hex]));
  }
  write('carbon', { 'v11.62.0': result });
}

/* Pico CSS: 50–950 per color; "default" names the shade each plain color name points to. */
{
  const source = pkg('picocss-pico-2.1.1', 'scss/colors/_index.scss');
  const result = scales(all(source, /^\$([a-z]+-\d+|black|white):\s*([^;]+);/gm).map((m) => [m[1], m[2].trim()]));
  result.default = Object.fromEntries(all(source, /^\$([a-z]+):\s*\$\1-(\d+);/gm).map((m) => [m[1], m[2]]));
  write('pico', { 'v2.1.1': result });
}

/* Wave UI: the palette with six lighter and six darker shades, and the default theme colors. */
{
  const source = read(packages, 'wave-ui-4.2.5', 'package', 'src/wave-ui/utils/colors.js');
  const palette = {};
  for (const m of all(source, /label: '([a-z-]+)',\s*color: '(#[0-9a-f]+)',\s*shades: \[([^\]]+)\]/g)) {
    const shades = Object.fromEntries(all(m[3], /label: '[a-z-]+-((?:light|dark)\d)', color: '(#[0-9a-f]+)'/g).map((s) => [s[1], s[2]]));
    palette[m[1]] = { base: m[2], ...shades };
  }
  const config = read(packages, 'wave-ui-4.2.5', 'package', 'src/wave-ui/utils/config.js');
  const theme = {};
  for (const name of ['light', 'dark']) {
    const block = config.match(new RegExp(`${name}: \\{([^}]+)\\}`))[1];
    theme[name] = Object.fromEntries(all(block, /(\w+): '([^']+)'/g).map((m) => [m[1], m[2]]));
  }
  write('wave-ui', { 'v4.2.5': { palette, theme } });
}

/* shadcn/ui: the semantic tokens of each base color, light and dark, from its registry. */
{
  const result = {};
  for (const file of fs.readdirSync(downloads).filter((f) => /^shadcn-[a-z]+\.json$/.test(f) && f !== 'shadcn-index.json' && f !== 'shadcn-registry.json').sort()) {
    const data = JSON.parse(fs.readFileSync(path.join(downloads, file), 'utf8'));
    result[file.replace(/^shadcn-|\.json$/g, '')] = data.cssVarsV4;
  }
  write('shadcn', { 'v4.23.0': { 'base-colors': result } });
}

/* Flux UI: accent themes, as Tailwind CSS v4 color names, from its themes page. */
{
  const html = read(downloads, 'flux-themes.html').replace(/&quot;/g, '"').replace(/\\n/g, '\n');
  const accents = {};
  for (const m of all(html, /"([a-z]+)":"@theme \{([^}]+)\}\s*@layer theme \{\s*\.dark \{([^}]+)\}/g)) {
    const parse = (block) => Object.fromEntries(all(block, /--color-(accent[a-z-]*): var\(--color-([a-z]+(?:-\d+)?)\);/g).map((s) => [s[1], s[2]]));
    accents[m[1]] ??= { light: parse(m[2]), dark: parse(m[3]) };
  }
  write('flux', { 'v2.21.0': { accents } });
}
