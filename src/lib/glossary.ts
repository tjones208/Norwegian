import type { GlossEntry, Lookup } from '../types'
import { GLOSSARY, PHRASES } from '../data/glossary'
import { candidates, describeShape } from './morphology'
import { normalize } from './tokenize'

/**
 * Index built once from the bundled glossary. Every lemma and every listed
 * irregular form points at its entry, so "gikk" and "gått" both resolve to "gå".
 */
type Index = Map<string, { entry: GlossEntry; isLemma: boolean }>

function buildIndex(entries: GlossEntry[]): Index {
  const index: Index = new Map()
  for (const entry of entries) {
    const lemma = entry.lemma.toLowerCase()
    index.set(lemma, { entry, isLemma: true })
    for (const form of entry.forms ?? []) {
      const key = form.toLowerCase()
      // A lemma always wins over another entry's irregular form.
      if (!index.get(key)?.isLemma) index.set(key, { entry, isLemma: false })
    }
  }
  return index
}

const BASE_INDEX = buildIndex(GLOSSARY)

/**
 * Resolves a surface form to a glossary entry, trying in order: an exact match,
 * a listed irregular form, then the suffix rules. `userEntries` are your own
 * additions and always take precedence.
 */
export function lookup(surface: string, userEntries: Record<string, GlossEntry> = {}): Lookup {
  const word = normalize(surface)
  if (!word) return { surface }

  const userIndex = buildIndex(Object.values(userEntries))

  for (const [index, source] of [
    [userIndex, 'your glossary'],
    [BASE_INDEX, 'exact'],
  ] as const) {
    const hit = index.get(word)
    if (hit) {
      return {
        surface,
        entry: hit.entry,
        via: hit.isLemma ? (source === 'exact' ? 'dictionary form' : source) : `form of "${hit.entry.lemma}"`,
      }
    }
  }

  for (const { lemma, label } of candidates(word)) {
    const hit = userIndex.get(lemma) ?? BASE_INDEX.get(lemma)
    if (hit) return { surface, entry: hit.entry, via: `${label} of "${hit.entry.lemma}"` }
  }

  return { surface, guess: describeShape(word) }
}

/** Phrases occurring in a verse, so common idioms can be glossed as a unit. */
export function phrasesIn(text: string): Array<{ no: string; en: string; at: number }> {
  const haystack = text.toLowerCase()
  const found: Array<{ no: string; en: string; at: number }> = []
  for (const phrase of PHRASES) {
    const at = haystack.indexOf(phrase.no)
    if (at !== -1) found.push({ no: phrase.no, en: phrase.en, at })
  }
  return found.sort((a, b) => a.at - b.at)
}

export function allEntries(userEntries: Record<string, GlossEntry> = {}): GlossEntry[] {
  const merged = new Map<string, GlossEntry>()
  for (const entry of GLOSSARY) merged.set(entry.lemma.toLowerCase(), entry)
  for (const entry of Object.values(userEntries)) merged.set(entry.lemma.toLowerCase(), entry)
  return [...merged.values()].sort((a, b) => a.lemma.localeCompare(b.lemma, 'nb'))
}

export const POS_LABEL: Record<string, string> = {
  noun: 'noun',
  verb: 'verb',
  adj: 'adjective',
  adv: 'adverb',
  pron: 'pronoun',
  prep: 'preposition',
  conj: 'conjunction',
  det: 'determiner',
  num: 'number',
  interj: 'interjection',
  name: 'proper noun',
  phrase: 'phrase',
}

/** The indefinite article that goes with a noun's gender. */
export function article(entry: GlossEntry): string | undefined {
  if (entry.pos !== 'noun') return undefined
  return entry.gender === 'n' ? 'et' : entry.gender === 'f' ? 'ei / en' : 'en'
}
