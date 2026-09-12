#!/usr/bin/env node
/**
 * Imports a Norwegian text into public/data/ so it ships with the app.
 *
 *   npm run import -- <source.txt> --id bom --title "Mormons bok"
 *   npm run import -- <source.txt> --id bom --title "Mormons bok" --en english.txt
 *
 * Expected plain-text layout (blank lines are ignored):
 *
 *   # 1 Nephi                  <- a book:    "# " followed by the title
 *   ## 3                       <- a chapter: "## " followed by the number
 *   1 Og det skjedde at ...    <- a verse:   the number, a space, then the text
 *   2 Og jeg sa til ...
 *
 * "Kapittel 3" and "Chapter 3" are also accepted as chapter lines. A verse that
 * wraps onto following lines is joined back together.
 *
 * Passing --en with a second file in the same layout attaches parallel English
 * to matching book/chapter/verse references.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const DATA_DIR = join(ROOT, 'public', 'data')

function parseArgs(argv) {
  const positional = []
  const flags = {}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) flags[argv[i].slice(2)] = argv[++i]
    else positional.push(argv[i])
  }
  return { positional, flags }
}

const BOOK_RE = /^#\s+(?!#)(.+)$/
const CHAPTER_RE = /^(?:##\s*|kapittel\s+|chapter\s+)(\d+)\s*$/i
const VERSE_RE = /^(\d+)[.:]?\s+(.+)$/

/** Turns the plain-text layout into the app's corpus shape. */
export function parseText(raw) {
  const books = []
  let book = null
  let chapter = null
  let verse = null

  const flush = () => {
    if (verse && chapter) chapter.verses.push({ n: verse.n, no: verse.lines.join(' ').trim() })
    verse = null
  }

  for (const line of raw.split(/\r?\n/)) {
    const text = line.trim()
    if (!text) {
      flush()
      continue
    }

    const bookMatch = BOOK_RE.exec(text)
    if (bookMatch) {
      flush()
      book = { id: slug(bookMatch[1]), title: bookMatch[1], chapters: [] }
      books.push(book)
      chapter = null
      continue
    }

    const chapterMatch = CHAPTER_RE.exec(text)
    if (chapterMatch) {
      flush()
      if (!book) {
        book = { id: 'text', title: 'Text', chapters: [] }
        books.push(book)
      }
      chapter = { n: Number(chapterMatch[1]), verses: [] }
      book.chapters.push(chapter)
      continue
    }

    const verseMatch = VERSE_RE.exec(text)
    if (verseMatch && chapter) {
      flush()
      verse = { n: Number(verseMatch[1]), lines: [verseMatch[2]] }
      continue
    }

    // A continuation of the verse above, or loose prose before any verse number.
    if (verse) verse.lines.push(text)
    else if (chapter) verse = { n: chapter.verses.length + 1, lines: [text] }
  }
  flush()

  return books.filter((b) => b.chapters.some((c) => c.verses.length))
}

function slug(title) {
  return title
    .toLowerCase()
    .replace(/[æ]/g, 'ae')
    .replace(/[ø]/g, 'o')
    .replace(/[å]/g, 'a')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Copies English text onto matching verses, matched by position in the file. */
function attachEnglish(books, englishBooks) {
  const index = new Map()
  for (const b of englishBooks)
    for (const c of b.chapters)
      for (const v of c.verses) index.set(`${b.id}/${c.n}/${v.n}`, v.no)

  let matched = 0
  for (const b of books)
    for (const c of b.chapters)
      for (const v of c.verses) {
        const en = index.get(`${b.id}/${c.n}/${v.n}`)
        if (en) {
          v.en = en
          matched++
        }
      }
  return matched
}

function updateManifest(entry) {
  const path = join(DATA_DIR, 'index.json')
  const manifest = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : { corpora: [] }
  manifest.corpora = manifest.corpora.filter((c) => c.id !== entry.id).concat(entry)
  writeFileSync(path, JSON.stringify(manifest, null, 2) + '\n')
}

function main() {
  const { positional, flags } = parseArgs(process.argv.slice(2))
  const [source] = positional

  if (!source) {
    console.error('Usage: npm run import -- <source.txt> --id <id> --title "<title>" [--en <english.txt>]')
    process.exit(1)
  }
  if (!existsSync(source)) {
    console.error(`No such file: ${source}`)
    process.exit(1)
  }

  const id = flags.id ?? slug(source.replace(/\.[^.]+$/, ''))
  const title = flags.title ?? id

  const raw = readFileSync(source, 'utf8')
  // A JSON source is passed through as-is, so an already-structured text does
  // not have to be flattened to plain text first.
  const books = raw.trimStart().startsWith('{') ? JSON.parse(raw).books : parseText(raw)

  if (!books?.length) {
    console.error('No verses found. Check the layout described at the top of scripts/import-text.mjs.')
    process.exit(1)
  }

  let englishNote = ''
  if (flags.en) {
    const matched = attachEnglish(books, parseText(readFileSync(flags.en, 'utf8')))
    englishNote = `, ${matched} with parallel English`
  }

  const corpus = {
    id,
    title,
    language: flags.language ?? 'nb-NO',
    source: flags.source ?? `Imported from ${source}`,
    books,
  }

  mkdirSync(DATA_DIR, { recursive: true })
  const file = `${id}.json`
  writeFileSync(join(DATA_DIR, file), JSON.stringify(corpus) + '\n')
  updateManifest({ id, title, file })

  const chapters = books.reduce((n, b) => n + b.chapters.length, 0)
  const verses = books.reduce((n, b) => n + b.chapters.reduce((m, c) => m + c.verses.length, 0), 0)
  console.log(`Wrote public/data/${file}`)
  console.log(`  ${books.length} books, ${chapters} chapters, ${verses} verses${englishNote}`)
  console.log(`  Added "${title}" to public/data/index.json — it will appear in the app's text picker.`)
}

if (import.meta.url === `file://${process.argv[1]}`) main()
