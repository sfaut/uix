// Embeds palettes/data/*.json in the showcase page, replacing the content of its
// <script type="application/json" id="sc-palettes-data"> element.
// Usage: node palettes/scripts/embed.mjs [showcase file] (default: prototype/showcase.html)

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const folder = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = path.join(folder, 'data');
const file = process.argv[2] ?? path.join(folder, '..', 'prototype', 'showcase.html');

/**
 * Palette files, in the order of the showcase chooser.
 *
 * @type {string[]}
 */
const order = ['tailwind', 'bootstrap', 'material-ui', 'radix', 'open-props', 'mantine', 'ant-design', 'chakra', 'carbon', 'pico', 'wave-ui', 'shadcn', 'flux'];

const palettes = {};
for (const name of order) {
  palettes[name] = JSON.parse(fs.readFileSync(path.join(data, `${name}.json`), 'utf8'))[name];
}
const json = JSON.stringify(palettes).replace(/</g, '\\u003c');

const page = fs.readFileSync(file, 'utf8');
const element = /(<script type="application\/json" id="sc-palettes-data">)[^<]*(<\/script>)/;
if (!element.test(page)) {
  console.error(`${file}: no <script id="sc-palettes-data"> element`);
  process.exit(1);
}
fs.writeFileSync(file, page.replace(element, (_, open, close) => `${open}${json}${close}`));
console.log(`${file}: ${order.length} palettes embedded (${Math.round(json.length / 1024)} KiB)`);
