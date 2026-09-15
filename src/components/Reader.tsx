import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AppState, Corpus, GlossEntry, ParallelMode, VerseRef } from '../types'
import { findBook, findChapter, formatRef, step } from '../lib/corpus'
import { refKey } from '../lib/storage'
import { logActivity } from '../lib/plan'
import { phrasesIn } from '../lib/glossary'
import { normalize } from '../lib/tokenize'
import * as tts from '../lib/tts'
import { VerseView } from './VerseView'
import { WordPanel } from './WordPanel'

interface Props {
  corpus: Corpus
  state: AppState
  update: (fn: (previous: AppState) => AppState) => void
  onAddCard: (fields: {
    surface: string
    lemma: string
    en: string
    pos?: GlossEntry['pos']
    context: string
    ref: VerseRef
  }) => void
  onRemoveCard: (id: string) => void
}

export function Reader({ corpus, state, update, onAddCard, onRemoveCard }: Props) {
  const { settings } = state
  const book = findBook(corpus, settings.bookId)
  const chapter = book ? findChapter(book, settings.chapter) : undefined

  /** Verse currently being read aloud, and where in it the voice is. */
  const [playing, setPlaying] = useState<number | null>(null)
  const [boundary, setBoundary] = useState<number | null>(null)
  const [selected, setSelected] = useState<{ word: string; ref: VerseRef; context: string } | null>(null)
  const [bubble, setBubble] = useState<{ x: number; y: number; text: string } | null>(null)

  // Read from a ref inside speech callbacks: the callbacks outlive the render
  // that created them, so a captured value would go stale mid-chapter.
  const continueRef = useRef(false)
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  const stopPlayback = useCallback(() => {
    continueRef.current = false
    tts.stop()
    setPlaying(null)
    setBoundary(null)
  }, [])

  // Never leave a voice running when the chapter changes or the view unmounts.
  useEffect(() => stopPlayback, [stopPlayback])
  useEffect(() => {
    stopPlayback()
  }, [settings.bookId, settings.chapter, stopPlayback])

  const speakVerse = useCallback(
    (verseNumber: number, text: string) => {
      setPlaying(verseNumber)
      setBoundary(null)
      tts.speak(text, {
        rate: settingsRef.current.rate,
        voiceURI: settingsRef.current.voiceURI,
        onBoundary: (charIndex) => setBoundary(charIndex),
        onEnd: () => {
          setBoundary(null)
          if (!continueRef.current) {
            setPlaying(null)
            return
          }
          const verses = chapter?.verses ?? []
          const index = verses.findIndex((v) => v.n === verseNumber)
          const next = verses[index + 1]
          if (next) speakVerse(next.n, next.no)
          else {
            continueRef.current = false
            setPlaying(null)
          }
        },
      })
    },
    [chapter],
  )

  const playChapter = useCallback(() => {
    const first = chapter?.verses[0]
    if (!first) return
    continueRef.current = true
    speakVerse(first.n, first.no)
  }, [chapter, speakVerse])

  const speakOne = useCallback((text: string) => {
    continueRef.current = false
    tts.speak(text, { rate: settingsRef.current.rate, voiceURI: settingsRef.current.voiceURI })
  }, [])

  // These are handed to every verse, so they must keep a stable identity or the
  // memoized VerseView re-renders the entire chapter on each boundary event.
  const handleWordClick = useCallback(
    (word: string, wordRef: VerseRef, verseText: string) => {
      setSelected({ word, ref: wordRef, context: verseText })
      if (settingsRef.current.speakOnTap) speakOne(word)
    },
    [speakOne],
  )

  const handleSpeakVerse = useCallback(
    (target: VerseRef, text: string) => {
      continueRef.current = false
      speakVerse(target.verse, text)
    },
    [speakVerse],
  )

  const handleToggleRead = useCallback(
    (target: VerseRef) =>
      update((s) => {
        const read = { ...s.read }
        const k = refKey(target)
        if (read[k]) {
          delete read[k]
          return { ...s, read }
        }
        read[k] = Date.now()
        // Only marking a verse read counts toward the day — unmarking does not
        // subtract, so the streak cannot be gamed backwards.
        return logActivity({ ...s, read }, { versesRead: 1 })
      }),
    [update],
  )

  const handleSaveNote = useCallback(
    (target: VerseRef, text: string) =>
      update((s) => {
        const notes = { ...s.notes }
        const k = refKey(target)
        if (!text.trim()) delete notes[k]
        else notes[k] = { id: k, ref: target, text: text.trim(), updatedAt: Date.now() }
        return { ...s, notes }
      }),
    [update],
  )

  // --- selection-to-speak -------------------------------------------------
  useEffect(() => {
    const onSelectionChange = () => {
      const selection = window.getSelection()
      const text = selection?.toString().trim() ?? ''
      if (!selection || selection.isCollapsed || text.length < 2) {
        setBubble(null)
        return
      }
      const rect = selection.getRangeAt(0).getBoundingClientRect()
      if (!rect.width && !rect.height) return
      setBubble({ x: rect.left + rect.width / 2, y: rect.top - 8, text })
    }
    document.addEventListener('selectionchange', onSelectionChange)
    return () => document.removeEventListener('selectionchange', onSelectionChange)
  }, [])

  // --- keyboard shortcuts -------------------------------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return
      if (e.key === ' ') {
        e.preventDefault()
        playing !== null ? stopPlayback() : playChapter()
      }
      if (e.key === 'Escape') {
        stopPlayback()
        setSelected(null)
      }
      if (e.key === 'ArrowRight' || e.key === 'j') go(1)
      if (e.key === 'ArrowLeft' || e.key === 'k') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  const go = (direction: 1 | -1) => {
    if (!book) return
    const next = step(corpus, book.id, settings.chapter, direction)
    if (!next) return
    update((s) => ({ ...s, settings: { ...s.settings, bookId: next.bookId, chapter: next.chapter } }))
    window.scrollTo({ top: 0 })
  }

  const known = useMemo(() => {
    const set = new Set<string>()
    for (const card of Object.values(state.cards)) {
      set.add(normalize(card.surface))
      set.add(normalize(card.lemma))
    }
    return set
  }, [state.cards])

  const phrases = useMemo(
    () => (chapter ? phrasesIn(chapter.verses.map((v) => v.no).join(' ')) : []),
    [chapter],
  )

  const readCount = useMemo(() => {
    if (!book || !chapter) return 0
    return chapter.verses.filter(
      (v) => state.read[refKey({ corpus: corpus.id, book: book.id, chapter: chapter.n, verse: v.n })],
    ).length
  }, [book, chapter, state.read, corpus.id])

  if (!book || !chapter) return <div className="empty">This text has no chapters yet.</div>

  const existingCardFor = (word: string) =>
    Object.values(state.cards).find((c) => normalize(c.surface) === normalize(word))

  return (
    <>
      <div className="chapter-bar ui">
        <select
          value={book.id}
          onChange={(e) =>
            update((s) => ({ ...s, settings: { ...s.settings, bookId: e.target.value, chapter: 1 } }))
          }
        >
          {corpus.books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title}
            </option>
          ))}
        </select>
        <select
          value={chapter.n}
          onChange={(e) =>
            update((s) => ({ ...s, settings: { ...s.settings, chapter: Number(e.target.value) } }))
          }
        >
          {book.chapters.map((c) => (
            <option key={c.n} value={c.n}>
              Kapittel {c.n}
            </option>
          ))}
        </select>
        <span style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => go(-1)} title="Previous chapter (←)">
            ‹
          </button>
          <button onClick={() => go(1)} title="Next chapter (→)">
            ›
          </button>
        </span>
      </div>

      <div className="toolbar">
        {playing !== null ? (
          <button className="primary" onClick={stopPlayback}>
            ■ Stopp
          </button>
        ) : (
          <button className="primary" onClick={playChapter} title="Read the chapter aloud (space)">
            ▶ Les kapittelet
          </button>
        )}

        <label>
          Fart
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.05}
            value={settings.rate}
            onChange={(e) =>
              update((s) => ({ ...s, settings: { ...s.settings, rate: Number(e.target.value) } }))
            }
          />
          <span style={{ width: 42 }}>{settings.rate.toFixed(2)}×</span>
        </label>

        <label>
          English
          <select
            value={settings.parallel}
            onChange={(e) =>
              update((s) => ({
                ...s,
                settings: { ...s.settings, parallel: e.target.value as ParallelMode },
              }))
            }
          >
            <option value="off">off</option>
            <option value="below">below</option>
            <option value="side">side by side</option>
          </select>
        </label>

        <label>
          <input
            type="checkbox"
            checked={settings.highlightKnown}
            onChange={(e) =>
              update((s) => ({ ...s, settings: { ...s.settings, highlightKnown: e.target.checked } }))
            }
          />
          Tint deck words
        </label>
      </div>

      <h1 className="chapter-title">
        {book.title} {chapter.n}
      </h1>
      <p className="chapter-sub">
        {chapter.verses.length} verses · {readCount} read
      </p>
      <div className="progress">
        <div style={{ width: `${(readCount / Math.max(1, chapter.verses.length)) * 100}%` }} />
      </div>

      {chapter.heading && <p className="heading">{chapter.heading}</p>}

      <div style={{ fontSize: settings.fontSize }}>
        {chapter.verses.map((verse) => {
          const ref_: VerseRef = {
            corpus: corpus.id,
            book: book.id,
            chapter: chapter.n,
            verse: verse.n,
          }
          const key = refKey(ref_)
          return (
            <VerseView
              key={key}
              verse={verse}
              ref_={ref_}
              parallel={settings.parallel}
              known={known}
              highlightKnown={settings.highlightKnown}
              isRead={Boolean(state.read[key])}
              note={state.notes[key]}
              speakingAt={playing === verse.n ? boundary : null}
              selectedWord={selected ? normalize(selected.word) : null}
              onWordClick={handleWordClick}
              onSpeakVerse={handleSpeakVerse}
              onToggleRead={handleToggleRead}
              onSaveNote={handleSaveNote}
            />
          )
        })}
      </div>

      {phrases.length > 0 && (
        <>
          <h2 className="section">Phrases in this chapter</h2>
          <div className="card-grid">
            {phrases.map((p) => (
              <div className="row" key={p.no}>
                <span className="lemma" style={{ minWidth: 170 }}>
                  {p.no}
                </span>
                <span className="en">{p.en}</span>
                <button onClick={() => speakOne(p.no)}>🔊</button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="panel-actions" style={{ marginTop: 28, justifyContent: 'space-between' }}>
        <button onClick={() => go(-1)}>‹ Forrige kapittel</button>
        <button onClick={() => go(1)}>Neste kapittel ›</button>
      </div>

      {bubble && (
        <div className="selection-bubble" style={{ left: bubble.x, top: bubble.y }}>
          <button
            onClick={() => {
              speakOne(bubble.text)
              setBubble(null)
            }}
          >
            🔊 Speak selection
          </button>
        </div>
      )}

      {selected && (
        <WordPanel
          word={selected.word}
          ref_={selected.ref}
          refLabel={formatRef(corpus, selected.ref)}
          context={selected.context}
          userGlossary={state.userGlossary}
          existingCard={existingCardFor(selected.word)}
          onSpeak={speakOne}
          onAddCard={onAddCard}
          onRemoveCard={onRemoveCard}
          onSaveGloss={(entry) =>
            update((s) => ({
              ...s,
              userGlossary: { ...s.userGlossary, [entry.lemma.toLowerCase()]: entry },
            }))
          }
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}
