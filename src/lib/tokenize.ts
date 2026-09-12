/**
 * Splits a verse into word and non-word tokens, keeping every character so the
 * rendered verse is byte-identical to the source and character offsets still
 * line up with the speech-synthesis boundary events used for read-along.
 */

export interface Token {
  text: string
  /** Character offset of this token inside the verse string. */
  start: number
  isWord: boolean
}

// Norwegian letters plus the apostrophe and hyphen that show up inside words.
const WORD_RE = /[A-Za-zÆØÅæøåÉéÈèÊêÔôÜüÄäÖö]+(?:['’-][A-Za-zÆØÅæøåÉéÈèÊêÔôÜüÄäÖö]+)*/g

export function tokenize(text: string): Token[] {
  const tokens: Token[] = []
  let last = 0
  for (const m of text.matchAll(WORD_RE)) {
    const start = m.index ?? 0
    if (start > last) tokens.push({ text: text.slice(last, start), start: last, isWord: false })
    tokens.push({ text: m[0], start, isWord: true })
    last = start + m[0].length
  }
  if (last < text.length) tokens.push({ text: text.slice(last), start: last, isWord: false })
  return tokens
}

/** Lowercases and strips the punctuation that clings to a clicked word. */
export function normalize(word: string): string {
  return word
    .toLowerCase()
    .replace(/[’']/g, "'")
    .replace(/^[^a-zæøåéèêôüäö']+|[^a-zæøåéèêôüäö']+$/g, '')
}

/** Counts word frequencies across a body of text, most frequent first. */
export function wordFrequencies(texts: string[]): Map<string, number> {
  const counts = new Map<string, number>()
  for (const text of texts) {
    for (const m of text.matchAll(WORD_RE)) {
      const w = normalize(m[0])
      if (w) counts.set(w, (counts.get(w) ?? 0) + 1)
    }
  }
  return new Map([...counts].sort((a, b) => b[1] - a[1]))
}
