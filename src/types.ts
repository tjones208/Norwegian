/** Core data shapes shared across the reader, glossary and review deck. */

/** One verse. `no` is the Norwegian text; `en` is the optional parallel English. */
export interface Verse {
  n: number
  no: string
  en?: string
}

export interface Chapter {
  n: number
  /** Optional chapter summary/heading shown above the verses. */
  heading?: string
  verses: Verse[]
}

export interface Book {
  id: string
  title: string
  titleEn?: string
  chapters: Chapter[]
}

/** A volume of text: the bundled demo, or whatever you import. */
export interface Corpus {
  id: string
  title: string
  /** BCP-47 tag used to pick a speech voice, e.g. "nb-NO". */
  language: string
  /** Shown in Settings so you can record where the text came from. */
  source?: string
  books: Book[]
}

/** One entry in the offline Norwegian -> English glossary. */
export interface GlossEntry {
  /** Dictionary (base) form. */
  lemma: string
  pos: PartOfSpeech
  en: string[]
  /** Noun gender: en/ei/et. */
  gender?: 'm' | 'f' | 'n'
  /** Irregular or otherwise notable inflected forms that map back to this lemma. */
  forms?: string[]
  /** Grammar or usage note shown under the gloss. */
  note?: string
}

export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adj'
  | 'adv'
  | 'pron'
  | 'prep'
  | 'conj'
  | 'det'
  | 'num'
  | 'interj'
  | 'name'
  | 'phrase'

/** Result of looking a surface form up: the entry plus how we got there. */
export interface Lookup {
  surface: string
  entry?: GlossEntry
  /** How the surface form was matched, e.g. "definite singular" or "exact". */
  via?: string
  /** Best-guess analysis when the word is not in the glossary at all. */
  guess?: string
}

/** A saved word, carrying its SM-2 scheduling state. */
export interface Card {
  id: string
  /** The form you clicked, kept so the card matches what you actually read. */
  surface: string
  lemma: string
  en: string
  pos?: PartOfSpeech
  /** Where you first met the word, e.g. "1 Nephi 3:7". */
  context?: string
  contextRef?: VerseRef
  createdAt: number
  // --- SM-2 state ---
  /** Ease factor; starts at 2.5 and floors at 1.3. */
  ef: number
  /** Days until the next review. */
  interval: number
  /** Consecutive successful reviews. */
  reps: number
  lapses: number
  dueAt: number
  lastReviewedAt?: number
}

export interface VerseRef {
  corpus: string
  book: string
  chapter: number
  verse: number
}

export interface Note {
  id: string
  ref: VerseRef
  text: string
  updatedAt: number
}

export type ParallelMode = 'off' | 'below' | 'side'

export interface Settings {
  corpusId: string
  bookId: string
  chapter: number
  parallel: ParallelMode
  /** Speech rate, 0.5–1.5. Slow is normal when you are starting out. */
  rate: number
  /** Rate used by the "slower" button next to every play control. */
  slowRate: number
  /** URI of the chosen speech voice. */
  voiceURI: string | null
  fontSize: number
  /** Tint words that are already in your deck. */
  highlightKnown: boolean
  /** Speak a word when you click it, instead of only showing the gloss. */
  speakOnTap: boolean
  theme: 'light' | 'dark' | 'system'
  /** Allow the microphone for speaking practice. Off until you turn it on. */
  micEnabled: boolean
  /** Drills to aim for each day, used by the plan and the streak. */
  dailyGoal: number
}

/** Everything we persist. Written to browser storage, optionally mirrored to Supabase. */
export interface AppState {
  settings: Settings
  cards: Record<string, Card>
  notes: Record<string, Note>
  /** Verse keys you have marked as read, for the progress bar. */
  read: Record<string, number>
  /** Custom glossary entries you added yourself, keyed by lemma. */
  userGlossary: Record<string, GlossEntry>
  /** Curriculum progress, keyed by lesson id. */
  lessons: Record<string, LessonProgress>
  /** Daily activity, keyed YYYY-MM-DD. */
  days: Record<string, DayLog>
}

// ---------------------------------------------------------------------------
// Tutor: curriculum, drills and daily progress
// ---------------------------------------------------------------------------

export interface Unit {
  id: string
  title: string
  titleEn: string
  /** One line on what this unit gets you able to do. */
  goal: string
}

export interface Example {
  no: string
  en: string
  /** Why this example is here — the point it illustrates. */
  note?: string
}

export interface Table {
  caption?: string
  head: string[]
  rows: string[][]
}

export interface Section {
  heading: string
  body: string
  examples?: Example[]
  table?: Table
}

export interface Lesson {
  id: string
  unitId: string
  title: string
  titleEn: string
  summary: string
  /** Rough reading time, shown in the daily plan. */
  minutes: number
  sections: Section[]
  vocab?: Array<{ no: string; en: string; pos?: PartOfSpeech; gender?: 'm' | 'f' | 'n' }>
  /** Sentences this lesson can be drilled on. */
  practice: Example[]
}

export type DrillKind = 'translate' | 'cloze' | 'dictation' | 'speak' | 'choice'

export interface Drill {
  id: string
  kind: DrillKind
  /** What the learner is shown. */
  prompt: string
  /** The Norwegian they must produce, type or say. */
  answer: string
  /** Other wordings counted as correct. */
  alternatives?: string[]
  /** Text spoken aloud for dictation and speaking drills. */
  audio?: string
  hint?: string
  choices?: string[]
  /** Lesson id or verse reference this came from. */
  source?: string
  sourceLabel?: string
}

export interface Phrase {
  no: string
  en: string
  category: string
  note?: string
}

export interface LessonProgress {
  lessonId: string
  startedAt: number
  completedAt?: number
  /** Share of practice drills answered correctly, 0–1. */
  score?: number
}

/** One day's activity, keyed YYYY-MM-DD, for the streak and the daily goal. */
export interface DayLog {
  date: string
  drills: number
  correct: number
  versesRead: number
  lessonsDone: number
}

export type PlanItemKind = 'review' | 'lesson' | 'drill' | 'speak' | 'read'

export interface PlanItem {
  kind: PlanItemKind
  title: string
  detail: string
  /** How many things this covers — cards due, drills queued. */
  count?: number
  done: boolean
}
