#!/usr/bin/env node
/**
 * Repackages dist/ into a page that carries its texts inline, for hosting where
 * only the page and its scripts are served and fetching JSON is not an option.
 *
 *   npm run build && npm run standalone
 *
 * Writes dist-standalone/: index.html with the stylesheet and every corpus
 * embedded, plus the JavaScript chunks under their original names.
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, copyFileSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DIST = join(ROOT, 'dist')
const DATA = join(ROOT, 'public', 'data')
const OUT = join(ROOT, 'dist-standalone')

const html = readFileSync(join(DIST, 'index.html'), 'utf8')

const entry = /<script[^>]+src="\.?\/?(assets\/[^"]+\.js)"/.exec(html)?.[1]
const styles = /<link[^>]+href="\.?\/?(assets\/[^"]+\.css)"/.exec(html)?.[1]
if (!entry) throw new Error('No entry script found in dist/index.html — run `npm run build` first.')

const css = styles ? readFileSync(join(DIST, styles), 'utf8') : ''

// Embed every corpus listed in the manifest, keyed by the filename the app asks for.
const index = JSON.parse(readFileSync(join(DATA, 'index.json'), 'utf8'))
const corpora = Object.fromEntries(
  index.corpora.map((c) => [c.file, JSON.parse(readFileSync(join(DATA, c.file), 'utf8'))]),
)

// </script> inside embedded JSON would close the tag early.
const payload = JSON.stringify({ index, corpora }).replace(/</g, '\\u003c')

rmSync(OUT, { recursive: true, force: true })
mkdirSync(join(OUT, 'assets'), { recursive: true })
for (const file of readdirSync(join(DIST, 'assets'))) {
  if (file.endsWith('.js')) copyFileSync(join(DIST, 'assets', file), join(OUT, 'assets', file))
}

writeFileSync(
  join(OUT, 'index.html'),
  `<title>Norsk Lesar</title>
<style>
${css}
</style>
<div id="root"></div>
<script>window.__NORSK_DATA__ = ${payload}</script>
<script type="module" src="${entry}"></script>
`,
)

const verses = Object.values(corpora).reduce(
  (n, c) => n + c.books.reduce((m, b) => m + b.chapters.reduce((k, ch) => k + ch.verses.length, 0), 0),
  0,
)
console.log(`Wrote dist-standalone/index.html`)
console.log(`  embedded ${index.corpora.length} text(s), ${verses} verses`)
console.log(`  entry: ${entry}`)
