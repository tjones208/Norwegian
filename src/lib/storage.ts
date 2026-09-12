import type { AppState, Settings, VerseRef } from '../types'

const KEY = 'norsk-lesar:v1'

export const DEFAULT_SETTINGS: Settings = {
  corpusId: 'demo',
  bookId: '',
  chapter: 1,
  parallel: 'below',
  rate: 0.85,
  voiceURI: null,
  fontSize: 19,
  highlightKnown: true,
  speakOnTap: true,
  theme: 'system',
}

export const EMPTY_STATE: AppState = {
  settings: DEFAULT_SETTINGS,
  cards: {},
  notes: {},
  read: {},
  userGlossary: {},
}

export function refKey(ref: VerseRef): string {
  return `${ref.corpus}/${ref.book}/${ref.chapter}/${ref.verse}`
}

export function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw) as Partial<AppState>
    // Merge against defaults so a state saved by an older version still loads.
    return {
      settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
      cards: parsed.cards ?? {},
      notes: parsed.notes ?? {},
      read: parsed.read ?? {},
      userGlossary: parsed.userGlossary ?? {},
    }
  } catch {
    return EMPTY_STATE
  }
}

export function save(state: AppState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {
    // Quota exceeded or storage disabled (private browsing). The app keeps
    // working for this session; only persistence is lost.
  }
}

export function exportState(state: AppState): string {
  return JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), ...state }, null, 2)
}

export function importState(json: string): AppState {
  const parsed = JSON.parse(json) as Partial<AppState>
  return {
    settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
    cards: parsed.cards ?? {},
    notes: parsed.notes ?? {},
    read: parsed.read ?? {},
    userGlossary: parsed.userGlossary ?? {},
  }
}
