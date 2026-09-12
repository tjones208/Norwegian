import type { Book, Corpus, VerseRef } from '../types'

export interface ManifestEntry {
  id: string
  title: string
  file: string
}

const BASE = import.meta.env.BASE_URL || '/'

export async function loadManifest(): Promise<ManifestEntry[]> {
  const res = await fetch(`${BASE}data/index.json`)
  if (!res.ok) throw new Error(`Could not load the text list (${res.status}).`)
  const json = (await res.json()) as { corpora: ManifestEntry[] }
  return json.corpora ?? []
}

export async function loadCorpus(entry: ManifestEntry): Promise<Corpus> {
  const res = await fetch(`${BASE}data/${entry.file}`)
  if (!res.ok) throw new Error(`Could not load "${entry.title}" (${res.status}).`)
  return (await res.json()) as Corpus
}

export function findBook(corpus: Corpus, bookId: string): Book | undefined {
  return corpus.books.find((b) => b.id === bookId) ?? corpus.books[0]
}

export function findChapter(book: Book, n: number) {
  return book.chapters.find((c) => c.n === n) ?? book.chapters[0]
}

/** A human-readable reference, e.g. "Om å lese 3:7". */
export function formatRef(corpus: Corpus, ref: VerseRef): string {
  const book = corpus.books.find((b) => b.id === ref.book)
  return `${book?.title ?? ref.book} ${ref.chapter}:${ref.verse}`
}

/** The chapter before/after the given one, crossing book boundaries. */
export function step(
  corpus: Corpus,
  bookId: string,
  chapter: number,
  direction: 1 | -1,
): { bookId: string; chapter: number } | undefined {
  const bookIndex = corpus.books.findIndex((b) => b.id === bookId)
  if (bookIndex === -1) return undefined
  const book = corpus.books[bookIndex]
  const chapterIndex = book.chapters.findIndex((c) => c.n === chapter)
  const next = book.chapters[chapterIndex + direction]
  if (next) return { bookId, chapter: next.n }

  const nextBook = corpus.books[bookIndex + direction]
  if (!nextBook?.chapters.length) return undefined
  const target = direction === 1 ? nextBook.chapters[0] : nextBook.chapters[nextBook.chapters.length - 1]
  return { bookId: nextBook.id, chapter: target.n }
}

export function countVerses(corpus: Corpus): number {
  return corpus.books.reduce(
    (total, book) => total + book.chapters.reduce((n, c) => n + c.verses.length, 0),
    0,
  )
}

/** Every Norwegian verse string in the corpus, for frequency analysis. */
export function allVerseTexts(corpus: Corpus): string[] {
  const out: string[] = []
  for (const book of corpus.books) for (const c of book.chapters) for (const v of c.verses) out.push(v.no)
  return out
}
