#!/usr/bin/env node
/**
 * Renders the app icons into public/icons/ with headless Chromium.
 *
 *   npm run icons
 *
 * The mark is the letter Å — the most recognisably Norwegian letter — set in
 * the reading serif on the app's accent brown, so the home-screen icon matches
 * what you see when the app opens. The maskable variant keeps the letter inside
 * the safe circle that Android crops to.
 */

import { mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Playwright is only needed to regenerate the icons, which are committed, so it
 * is not a dependency of the project. Use a local install if there is one, else
 * fall back to a global one.
 */
async function loadChromium() {
  for (const specifier of ['playwright', 'playwright-core', '/opt/node22/lib/node_modules/playwright/index.mjs']) {
    try {
      return (await import(specifier)).chromium
    } catch {
      // try the next one
    }
  }
  throw new Error('Playwright not found. Run `npm i -D playwright` to regenerate the icons.')
}

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(ROOT, 'public', 'icons')

const BROWN = '#7a4522'
const CREAM = '#f7f5f0'

/** `scale` is the share of the canvas the letter fills; maskable needs less. */
function page(size, scale, radius) {
  return `<!doctype html><meta charset="utf-8">
<style>
  html, body { margin: 0; padding: 0; }
  .icon {
    width: ${size}px; height: ${size}px;
    border-radius: ${radius}px;
    background: ${BROWN};
    display: flex; align-items: center; justify-content: center;
    font-family: 'Iowan Old Style', Palatino, Georgia, 'Times New Roman', serif;
    color: ${CREAM};
    font-size: ${Math.round(size * scale)}px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.02em;
  }
  /* Nudge up: the ring over the A leaves the glyph optically low otherwise. */
  .icon span { transform: translateY(${Math.round(size * 0.02)}px); }
</style>
<div class="icon"><span>Å</span></div>`
}

const ICONS = [
  { file: 'icon-192.png', size: 192, scale: 0.62, radius: 0 },
  { file: 'icon-512.png', size: 512, scale: 0.62, radius: 0 },
  // Android crops a maskable icon to a circle of ~80% width, so the glyph sits
  // smaller and the background runs edge to edge.
  { file: 'maskable-512.png', size: 512, scale: 0.44, radius: 0 },
  { file: 'apple-touch-icon.png', size: 180, scale: 0.62, radius: 0 },
  { file: 'favicon-32.png', size: 32, scale: 0.72, radius: 0 },
]

const chromium = await loadChromium()
const browser = await chromium.launch()
mkdirSync(OUT, { recursive: true })

for (const { file, size, scale, radius } of ICONS) {
  const tab = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 })
  await tab.setContent(page(size, scale, radius))
  await tab.screenshot({ path: join(OUT, file), omitBackground: false })
  await tab.close()
  console.log(`  ${file}  ${size}×${size}`)
}

await browser.close()
console.log('Wrote public/icons/')
