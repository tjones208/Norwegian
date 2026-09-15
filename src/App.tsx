import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Card, Corpus, GlossEntry, PlanItemKind, VerseRef } from './types'
import { loadCorpus, loadManifest, type ManifestEntry } from './lib/corpus'
import { useAppState } from './lib/useAppState'
import { newCard, review, dueCards, type Grade } from './lib/srs'
import { logActivity, nextLesson } from './lib/plan'
import { Home } from './components/Home'
import { Lessons } from './components/Lessons'
import { Practice } from './components/Practice'
import { Reader } from './components/Reader'
import { Deck } from './components/Deck'
import { SettingsPanel } from './components/SettingsPanel'
import * as tts from './lib/tts'

type Tab = 'home' | 'learn' | 'practice' | 'speak' | 'read' | 'words' | 'settings'

const TABS: Array<[Tab, string, string]> = [
  ['home', 'Hjem', 'Home'],
  ['learn', 'Lær', 'Lessons'],
  ['practice', 'Øv', 'Practice'],
  ['speak', 'Snakk', 'Speak'],
  ['read', 'Les', 'Read'],
  ['words', 'Ord', 'Words'],
]

export default function App() {
  const { state, setState, update } = useAppState()
  const [tab, setTab] = useState<Tab>('home')
  const [manifest, setManifest] = useState<ManifestEntry[]>([])
  const [corpus, setCorpus] = useState<Corpus | null>(null)
  const [error, setError] = useState<string | null>(null)
  /** Lesson to open when arriving from the plan, and drill focus from a lesson. */
  const [openLesson, setOpenLesson] = useState<string | undefined>()
  const [drillLesson, setDrillLesson] = useState<string | undefined>()
  /** Bumped to force a fresh practice queue when starting a new round. */
  const [practiceRun, setPracticeRun] = useState(0)

  useEffect(() => {
    tts.loadVoices()
  }, [])

  useEffect(() => {
    loadManifest().then(setManifest).catch((e: Error) => setError(e.message))
  }, [])

  useEffect(() => {
    if (!manifest.length) return
    const entry = manifest.find((m) => m.id === state.settings.corpusId) ?? manifest[0]
    loadCorpus(entry)
      .then((loaded) => {
        setCorpus(loaded)
        setError(null)
        update((s) => ({
          ...s,
          settings: {
            ...s.settings,
            corpusId: loaded.id,
            bookId: loaded.books.some((b) => b.id === s.settings.bookId)
              ? s.settings.bookId
              : (loaded.books[0]?.id ?? ''),
          },
        }))
      })
      .catch((e: Error) => setError(e.message))
  }, [manifest, state.settings.corpusId, update])

  useEffect(() => {
    const root = document.documentElement
    const apply = () => {
      if (state.settings.theme === 'system') {
        root.removeAttribute('data-theme')
        root.classList.toggle('dark-preferred', window.matchMedia('(prefers-color-scheme: dark)').matches)
      } else {
        root.classList.remove('dark-preferred')
        root.setAttribute('data-theme', state.settings.theme)
      }
    }
    apply()
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [state.settings.theme])

  const due = useMemo(() => dueCards(Object.values(state.cards)).length, [state.cards])

  const addCard = (fields: {
    surface: string
    lemma: string
    en: string
    pos?: GlossEntry['pos']
    context: string
    ref: VerseRef
  }) => {
    const id = fields.surface.toLowerCase()
    update((s) =>
      s.cards[id]
        ? s
        : {
            ...s,
            cards: {
              ...s.cards,
              [id]: newCard({
                id,
                surface: fields.surface,
                lemma: fields.lemma,
                en: fields.en,
                pos: fields.pos,
                context: fields.context,
                contextRef: fields.ref,
              }),
            },
          },
    )
  }

  const removeCard = (id: string) =>
    update((s) => {
      const cards = { ...s.cards }
      delete cards[id]
      return { ...s, cards }
    })

  const gradeCard = (card: Card, grade: Grade) =>
    update((s) => ({ ...s, cards: { ...s.cards, [card.id]: review(card, grade) } }))

  const answered = useCallback(
    (correct: boolean) =>
      update((s) => logActivity(s, { drills: 1, correct: correct ? 1 : 0 })),
    [update],
  )

  const toggleLessonDone = (lessonId: string) =>
    update((s) => {
      const existing = s.lessons[lessonId]
      const lessons = { ...s.lessons }
      if (existing?.completedAt) {
        lessons[lessonId] = { ...existing, completedAt: undefined }
        return { ...s, lessons }
      }
      lessons[lessonId] = {
        lessonId,
        startedAt: existing?.startedAt ?? Date.now(),
        completedAt: Date.now(),
      }
      return logActivity({ ...s, lessons }, { lessonsDone: 1 })
    })

  /** Jump from a daily-plan row to the screen that does that thing. */
  const goTo = (kind: PlanItemKind) => {
    if (kind === 'review') setTab('words')
    else if (kind === 'lesson') {
      setOpenLesson(nextLesson(state)?.id)
      setTab('learn')
    } else if (kind === 'drill') {
      setDrillLesson(undefined)
      setPracticeRun((n) => n + 1)
      setTab('practice')
    } else if (kind === 'speak') setTab('speak')
    else setTab('read')
    window.scrollTo({ top: 0 })
  }

  return (
    <div className="app">
      <header className="topbar">
        <button className="brand" onClick={() => setTab('home')}>
          Norsk <span>Lærer</span>
        </button>
        <nav className="tabs" role="tablist">
          {TABS.map(([value, label, english]) => (
            <button
              key={value}
              role="tab"
              className="tab"
              aria-selected={tab === value}
              title={english}
              onClick={() => {
                if (value === 'learn') setOpenLesson(undefined)
                if (value === 'practice') {
                  setDrillLesson(undefined)
                  setPracticeRun((n) => n + 1)
                }
                setTab(value)
              }}
            >
              {label}
              {value === 'words' && due > 0 && <span className="badge">{due}</span>}
            </button>
          ))}
          <button
            role="tab"
            className="tab"
            aria-selected={tab === 'settings'}
            title="Innstillinger"
            onClick={() => setTab('settings')}
          >
            ⚙
          </button>
        </nav>
      </header>

      <main className="main">
        <div className="content">
          {error && (
            <div className="notice warn">
              {error} Run <code>npm run dev</code> from the project root so the files in{' '}
              <code>public/data/</code> are served.
            </div>
          )}

          {tab === 'home' && <Home state={state} onGo={goTo} />}

          {tab === 'learn' && (
            <Lessons
              state={state}
              initialLessonId={openLesson}
              onComplete={toggleLessonDone}
              onPractiseLesson={(lessonId) => {
                setDrillLesson(lessonId)
                setPracticeRun((n) => n + 1)
                setTab('practice')
                window.scrollTo({ top: 0 })
              }}
            />
          )}

          {tab === 'practice' && (
            <Practice
              key={`practice-${practiceRun}-${drillLesson ?? 'mixed'}`}
              state={state}
              corpus={corpus ?? undefined}
              lessonId={drillLesson}
              onAnswered={answered}
            />
          )}

          {tab === 'speak' && (
            <>
              <h2 className="section">Snakk — speaking practice</h2>
              <p className="ui lead">
                Read each sentence aloud. With the microphone on, every word you say is checked against the
                target and the ones that missed are marked.
              </p>
              <Practice
                key={`speak-${practiceRun}`}
                state={state}
                corpus={corpus ?? undefined}
                only={['speak']}
                onAnswered={answered}
              />
            </>
          )}

          {corpus && tab === 'read' && (
            <Reader
              corpus={corpus}
              state={state}
              update={update}
              onAddCard={addCard}
              onRemoveCard={removeCard}
            />
          )}

          {corpus && tab === 'words' && (
            <Deck
              state={state}
              corpus={corpus}
              onRemoveCard={removeCard}
              onGrade={gradeCard}
              onAddWord={(word, en, lemma) =>
                addCard({
                  surface: word,
                  lemma,
                  en,
                  context: '',
                  ref: {
                    corpus: corpus.id,
                    book: state.settings.bookId,
                    chapter: state.settings.chapter,
                    verse: 0,
                  },
                })
              }
            />
          )}

          {corpus && tab === 'settings' && (
            <SettingsPanel
              state={state}
              corpus={corpus}
              manifest={manifest}
              update={update}
              replaceState={setState}
            />
          )}
        </div>
      </main>
    </div>
  )
}
