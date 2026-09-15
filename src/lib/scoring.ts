/**
 * Grading for anything the learner produces — typed translations, dictation,
 * and speech transcripts. Feedback is word by word, because "wrong" on its own
 * teaches nothing: the learner needs to see which word missed.
 */

export type WordStatus = 'ok' | 'close' | 'wrong' | 'missing' | 'extra'

export interface WordResult {
  /** The expected word, or the surplus word when status is "extra". */
  word: string
  status: WordStatus
  /** What the learner actually produced, when it differs. */
  got?: string
}

export interface Result {
  correct: boolean
  /** Share of expected words matched, 0–1. */
  ratio: number
  words: WordResult[]
  /** Set when the answer matched apart from accents or punctuation. */
  note?: string
}

/** Lowercase, strip punctuation, collapse spaces. Keeps æ, ø and å. */
export function normalizeAnswer(text: string): string {
  return text
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/[.,!?;:"«»()\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Folds æ/ø/å to ae/o/a, so a missing keyboard layout is not marked wrong. */
function foldAccents(text: string): string {
  return text.replace(/æ/g, 'ae').replace(/ø/g, 'o').replace(/å/g, 'a')
}

export function words(text: string): string[] {
  const normalized = normalizeAnswer(text)
  return normalized ? normalized.split(' ') : []
}

/** Classic Levenshtein distance, used to tell a typo from a different word. */
export function distance(a: string, b: string): number {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length

  let previous = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      current[j] = Math.min(
        previous[j] + 1,
        current[j - 1] + 1,
        previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      )
    }
    previous = current
  }
  return previous[b.length]
}

/** A typo rather than a different word: one edit, or two in a long word. */
function isClose(expected: string, got: string): boolean {
  const d = distance(expected, got)
  if (d === 0) return true
  if (foldAccents(expected) === foldAccents(got)) return true
  return d <= (expected.length > 6 ? 2 : 1)
}

/**
 * Aligns the two word sequences with a longest-common-subsequence table so that
 * one missing word early on does not mark the whole rest of the answer wrong.
 */
function align(expected: string[], got: string[]): WordResult[] {
  const n = expected.length
  const m = got.length
  const lcs: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0))

  for (let i = n - 1; i >= 0; i--) {
    for (let j = m - 1; j >= 0; j--) {
      lcs[i][j] = isClose(expected[i], got[j])
        ? lcs[i + 1][j + 1] + 1
        : Math.max(lcs[i + 1][j], lcs[i][j + 1])
    }
  }

  const out: WordResult[] = []
  let i = 0
  let j = 0
  while (i < n && j < m) {
    if (isClose(expected[i], got[j])) {
      out.push({
        word: expected[i],
        status: expected[i] === got[j] ? 'ok' : 'close',
        got: expected[i] === got[j] ? undefined : got[j],
      })
      i++
      j++
    } else if (lcs[i + 1][j] >= lcs[i][j + 1]) {
      out.push({ word: expected[i], status: 'missing' })
      i++
    } else {
      out.push({ word: got[j], status: 'extra' })
      j++
    }
  }
  while (i < n) out.push({ word: expected[i++], status: 'missing' })
  while (j < m) out.push({ word: got[j++], status: 'extra' })
  return out
}

/**
 * Grades an answer against the expected text and any accepted alternatives,
 * returning the best-scoring comparison.
 */
export function grade(expected: string, got: string, alternatives: string[] = []): Result {
  const candidates = [expected, ...alternatives]
  let best: Result | undefined

  for (const candidate of candidates) {
    const want = words(candidate)
    const have = words(got)
    const aligned = align(want, have)
    const matched = aligned.filter((w) => w.status === 'ok' || w.status === 'close').length
    const ratio = want.length ? matched / want.length : 0
    const perfect = aligned.every((w) => w.status === 'ok')
    const onlyTypos = aligned.every((w) => w.status === 'ok' || w.status === 'close')

    const result: Result = {
      correct: onlyTypos && have.length === want.length,
      ratio,
      words: aligned,
      note: !perfect && onlyTypos ? 'Right, apart from spelling.' : undefined,
    }
    if (!best || result.ratio > best.ratio || (result.correct && !best.correct)) best = result
  }

  return best ?? { correct: false, ratio: 0, words: [] }
}

/** A percentage for display, rounded. */
export function percent(ratio: number): number {
  return Math.round(ratio * 100)
}
