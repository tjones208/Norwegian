import { useEffect, useMemo, useState } from 'react'
import type { Card, Corpus, GlossEntry, VerseRef } from './types'
import { loadCorpus, loadManifest, type ManifestEntry } from './lib/corpus'
import { useAppState } from './lib/useAppState'
import { newCard, review, dueCards, type Grade } from './lib/srs'
import { Reader } from './components/Reader'
import { Review } from './components/Review'
import { Deck } from './components/Deck'
import { SettingsPanel } from './components/SettingsPanel'
import * as tts from './lib/tts'

type Tab = 'read' | 'review' | 'words' | 'settings'

export default function App() {
  const { state, setState, update } = useAppState()
  const [tab, setTab] = useState<Tab>('read')
  const [manifest, setManifest] = useState<ManifestEntry[]>([])
  const [corpus, setCorpus] = useState<Corpus | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Warm the voice list early: browsers populate it asynchronously, and the
  // first speak() would otherwise fall back to a non-Norwegian default.
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
            // Fall back to the first book whenever the saved one is not in this text.
            bookId: loaded.books.some((b) => b.id === s.settings.bookId)
              ? s.settings.bookId
              : (loaded.books[0]?.id ?? ''),
          },
        }))
      })
      .catch((e: Error) => setError(e.message))
  }, [manifest, state.settings.corpusId, update])

  // Theme: an explicit choice wins; "system" follows the OS preference live.
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

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          Norsk <span>Lesar</span>
        </div>
        <nav className="tabs" role="tablist">
          {(
            [
              ['read', 'Les'],
              ['review', 'Repeter'],
              ['words', 'Ord'],
              ['settings', 'Innstillinger'],
            ] as Array<[Tab, string]>
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              className="tab"
              aria-selected={tab === value}
              onClick={() => setTab(value)}
            >
              {label}
              {value === 'review' && due > 0 && <span className="badge">{due}</span>}
            </button>
          ))}
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

          {!corpus && !error && <div className="empty">Loading…</div>}

          {corpus && tab === 'read' && (
            <Reader
              corpus={corpus}
              state={state}
              update={update}
              onAddCard={addCard}
              onRemoveCard={removeCard}
            />
          )}

          {tab === 'review' && (
            <Review
              cards={state.cards}
              rate={state.settings.rate}
              voiceURI={state.settings.voiceURI}
              onGrade={gradeCard}
            />
          )}

          {corpus && tab === 'words' && (
            <Deck
              state={state}
              corpus={corpus}
              onRemoveCard={removeCard}
              onAddWord={(word, en, lemma) =>
                addCard({
                  surface: word,
                  lemma,
                  en,
                  context: '',
                  ref: { corpus: corpus.id, book: state.settings.bookId, chapter: state.settings.chapter, verse: 0 },
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
