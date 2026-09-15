import type { Corpus, Drill, DrillKind, Lesson } from '../types'
import { LESSONS } from '../data/lessons'
import { tokenize } from './tokenize'

/**
 * Builds practice items out of the curriculum and whatever text is loaded.
 * Everything a learner is asked to produce comes from a sentence they have
 * already met, so a drill is always recall rather than a guess.
 */

function id(kind: string, seed: string): string {
  return `${kind}:${seed}`
}

/** Fisher–Yates, seeded so a day's queue stays stable while you work through it. */
export function shuffle<T>(items: T[], seed = Date.now()): T[] {
  const out = [...items]
  let state = seed % 2147483647
  if (state <= 0) state += 2147483646
  const next = () => (state = (state * 16807) % 2147483647) / 2147483647
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

/** Type the Norwegian for an English prompt. */
function translateDrills(lesson: Lesson): Drill[] {
  return lesson.practice.map((example, i) => ({
    id: id('tr', `${lesson.id}-${i}`),
    kind: 'translate' as const,
    prompt: example.en,
    answer: example.no,
    hint: example.note,
    source: lesson.id,
    sourceLabel: lesson.title,
    audio: example.no,
  }))
}

/**
 * Blank out one content word and ask for it. Picks the longest word that is not
 * the first, since short function words make for a guessable gap.
 */
function clozeDrill(no: string, en: string, seed: string, label: string, source?: string): Drill | null {
  const tokens = tokenize(no).filter((t) => t.isWord)
  const candidates = tokens.slice(1).filter((t) => t.text.length >= 3)
  if (!candidates.length) return null

  const target = candidates.reduce((a, b) => (b.text.length > a.text.length ? b : a))
  const blanked = no.slice(0, target.start) + '_____' + no.slice(target.start + target.text.length)

  return {
    id: id('cl', seed),
    kind: 'cloze',
    prompt: blanked,
    answer: target.text,
    hint: en,
    source,
    sourceLabel: label,
    audio: no,
  }
}

function clozeDrills(lesson: Lesson): Drill[] {
  return lesson.practice
    .map((example, i) => clozeDrill(example.no, example.en, `${lesson.id}-${i}`, lesson.title, lesson.id))
    .filter((d): d is Drill => d !== null)
}

/** Hear it, type it. No text shown until the answer is checked. */
function dictationDrills(lesson: Lesson): Drill[] {
  return lesson.practice.map((example, i) => ({
    id: id('di', `${lesson.id}-${i}`),
    kind: 'dictation' as const,
    prompt: 'Listen, then write what you hear.',
    answer: example.no,
    audio: example.no,
    hint: example.en,
    source: lesson.id,
    sourceLabel: lesson.title,
  }))
}

/** Read the Norwegian aloud; the microphone checks it. */
function speakDrills(lesson: Lesson): Drill[] {
  return lesson.practice.map((example, i) => ({
    id: id('sp', `${lesson.id}-${i}`),
    kind: 'speak' as const,
    prompt: example.no,
    answer: example.no,
    audio: example.no,
    hint: example.en,
    source: lesson.id,
    sourceLabel: lesson.title,
  }))
}

/** Gender practice, built from any vocabulary entry that carries a gender. */
function genderDrills(lesson: Lesson): Drill[] {
  const article = { m: 'en', f: 'ei', n: 'et' } as const
  return (lesson.vocab ?? [])
    .filter((v) => v.gender)
    .map((v, i) => {
      // Strip any article the vocabulary entry already carries.
      const bare = v.no.replace(/^(en|ei|et|å)\s+/, '')
      return {
        id: id('ge', `${lesson.id}-${i}`),
        kind: 'choice' as const,
        prompt: `Which article goes with “${bare}” (${v.en.replace(/^an? /, '')})?`,
        answer: article[v.gender!],
        choices: ['en', 'ei', 'et'],
        hint: v.gender === 'f' ? 'Feminine nouns may also take "en" — but pick the feminine article here.' : undefined,
        source: lesson.id,
        sourceLabel: lesson.title,
        audio: `${article[v.gender!]} ${bare}`,
      }
    })
}

const BUILDERS: Record<DrillKind, (lesson: Lesson) => Drill[]> = {
  translate: translateDrills,
  cloze: clozeDrills,
  dictation: dictationDrills,
  speak: speakDrills,
  choice: genderDrills,
}

export function drillsForLesson(lesson: Lesson, kinds: DrillKind[]): Drill[] {
  return kinds.flatMap((kind) => BUILDERS[kind](lesson))
}

export interface MixOptions {
  /** Lessons already studied; drills are drawn from these. */
  lessonIds: string[]
  kinds: DrillKind[]
  limit: number
  seed?: number
  /** Text to pull extra cloze and dictation sentences from. */
  corpus?: Corpus
}

/**
 * A mixed session across everything studied so far, so older material keeps
 * coming back instead of being left behind once its lesson is done.
 */
export function mixedDrills({ lessonIds, kinds, limit, seed, corpus }: MixOptions): Drill[] {
  const studied = LESSONS.filter((l) => lessonIds.includes(l.id))
  // Before any lesson is finished, practise the first one rather than nothing.
  const pool = studied.length ? studied : LESSONS.slice(0, 1)

  const drills = pool.flatMap((lesson) => drillsForLesson(lesson, kinds))
  if (corpus) drills.push(...corpusDrills(corpus, kinds, 12))

  return shuffle(drills, seed).slice(0, limit)
}

/** Cloze and dictation drawn from the text being read. */
export function corpusDrills(corpus: Corpus, kinds: DrillKind[], limit: number): Drill[] {
  const out: Drill[] = []
  for (const book of corpus.books) {
    for (const chapter of book.chapters) {
      for (const verse of chapter.verses) {
        // Long verses make for punishing dictation; keep to readable sentences.
        if (verse.no.length > 110) continue
        const label = `${book.title} ${chapter.n}:${verse.n}`
        const seed = `${corpus.id}-${book.id}-${chapter.n}-${verse.n}`
        if (kinds.includes('cloze')) {
          const drill = clozeDrill(verse.no, verse.en ?? '', seed, label)
          if (drill) out.push(drill)
        }
        if (kinds.includes('dictation')) {
          out.push({
            id: id('di', seed),
            kind: 'dictation',
            prompt: 'Listen, then write what you hear.',
            answer: verse.no,
            audio: verse.no,
            hint: verse.en,
            sourceLabel: label,
          })
        }
        if (out.length >= limit * 2) return out.slice(0, limit)
      }
    }
  }
  return out.slice(0, limit)
}

export const KIND_LABEL: Record<DrillKind, string> = {
  translate: 'Translate',
  cloze: 'Fill the gap',
  dictation: 'Listen and write',
  speak: 'Say it',
  choice: 'Choose',
}
