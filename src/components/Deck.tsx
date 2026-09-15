import { useMemo, useState } from 'react'
import type { AppState, Card, Corpus, Note } from '../types'
import { stats, type Grade } from '../lib/srs'
import { Review } from './Review'
import { wordFrequencies } from '../lib/tokenize'
import { allVerseTexts } from '../lib/corpus'
import { lookup } from '../lib/glossary'
import * as tts from '../lib/tts'

interface Props {
  state: AppState
  corpus: Corpus
  onRemoveCard: (id: string) => void
  onGrade: (card: Card, grade: Grade) => void
  onAddWord: (word: string, en: string, lemma: string) => void
}

type View = 'review' | 'deck' | 'notes' | 'frequency'

export function Deck({ state, corpus, onRemoveCard, onGrade, onAddWord }: Props) {
  const [view, setView] = useState<View>('review')
  const [query, setQuery] = useState('')

  const cards = useMemo(
    () => Object.values(state.cards).sort((a, b) => a.dueAt - b.dueAt),
    [state.cards],
  )
  const notes = useMemo(
    () => Object.values(state.notes).sort((a, b) => b.updatedAt - a.updatedAt),
    [state.notes],
  )
  const deck = useMemo(() => stats(cards), [cards])

  /**
   * The most common words in this text that are not yet in your deck — the
   * highest-value vocabulary to learn next, since you will meet them constantly.
   */
  const frequency = useMemo(() => {
    const inDeck = new Set(Object.values(state.cards).map((c) => c.surface.toLowerCase()))
    const counts = wordFrequencies(allVerseTexts(corpus))
    const out: Array<{ word: string; count: number; en: string; lemma: string }> = []
    for (const [word, count] of counts) {
      if (inDeck.has(word)) continue
      const hit = lookup(word, state.userGlossary)
      if (!hit.entry) continue
      out.push({ word, count, en: hit.entry.en.join(', '), lemma: hit.entry.lemma })
      if (out.length === 80) break
    }
    return out
  }, [corpus, state.cards, state.userGlossary])

  const filter = <T,>(items: T[], text: (item: T) => string) =>
    query.trim() ? items.filter((i) => text(i).toLowerCase().includes(query.toLowerCase())) : items

  const speak = (text: string) => tts.speak(text, { rate: state.settings.rate, voiceURI: state.settings.voiceURI })

  return (
    <>
      <div className="stats">
        <div className="stat">
          <div className="n">{deck.total}</div>
          <div className="k">words saved</div>
        </div>
        <div className="stat">
          <div className="n">{deck.mature}</div>
          <div className="k">known well</div>
        </div>
        <div className="stat">
          <div className="n">{notes.length}</div>
          <div className="k">notes</div>
        </div>
        <div className="stat">
          <div className="n">{Object.keys(state.read).length}</div>
          <div className="k">verses read</div>
        </div>
      </div>

      <div className="chapter-bar ui">
        <div className="tabs">
          {(['review', 'deck', 'frequency', 'notes'] as View[]).map((v) => (
            <button key={v} className="tab" aria-selected={view === v} onClick={() => setView(v)}>
              {v === 'review' ? 'Repeter' : v === 'deck' ? 'My words' : v === 'frequency' ? 'Learn next' : 'Notes'}
              {v === 'review' && deck.due > 0 && <span className="badge">{deck.due}</span>}
            </button>
          ))}
        </div>
        <div className="spacer" />
        {view !== 'review' && (
          <input
            type="search"
            placeholder="Search…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 200 }}
          />
        )}
      </div>

      {view === 'review' && (
        <Review
          cards={state.cards}
          rate={state.settings.rate}
          voiceURI={state.settings.voiceURI}
          onGrade={onGrade}
        />
      )}

      {view === 'deck' && (
        <div className="card-grid">
          {filter(cards, (c) => `${c.surface} ${c.lemma} ${c.en}`).map((card) => (
            <CardRow key={card.id} card={card} onSpeak={speak} onRemove={() => onRemoveCard(card.id)} />
          ))}
          {!cards.length && <div className="empty">No saved words yet.</div>}
        </div>
      )}

      {view === 'frequency' && (
        <>
          <div className="notice">
            The most frequent words in <strong>{corpus.title}</strong> that are not yet in your deck.
            Learning these first buys the most reading comprehension per word.
          </div>
          <div className="card-grid">
            {filter(frequency, (f) => `${f.word} ${f.en}`).map((item) => (
              <div className="row" key={item.word}>
                <span className="lemma">{item.word}</span>
                <span className="en">{item.en}</span>
                <span className="meta">{item.count}×</span>
                <button onClick={() => speak(item.word)}>🔊</button>
                <button onClick={() => onAddWord(item.word, item.en, item.lemma)}>+ Add</button>
              </div>
            ))}
            {!frequency.length && <div className="empty">Every recognised word is already in your deck.</div>}
          </div>
        </>
      )}

      {view === 'notes' && (
        <div className="card-grid">
          {filter(notes, (n) => n.text).map((note) => (
            <NoteRow key={note.id} note={note} />
          ))}
          {!notes.length && <div className="empty">No notes yet. Add one from any verse while reading.</div>}
        </div>
      )}
    </>
  )
}

function CardRow({ card, onSpeak, onRemove }: { card: Card; onSpeak: (t: string) => void; onRemove: () => void }) {
  const due = card.dueAt <= Date.now()
  return (
    <div className="row">
      <span className="lemma">{card.surface}</span>
      <span className="en">{card.en || '—'}</span>
      <span className="meta" style={{ color: due ? 'var(--due)' : undefined }}>
        {card.reps === 0 ? 'new' : due ? 'due' : `${card.interval}d`}
      </span>
      <button onClick={() => onSpeak(card.surface)}>🔊</button>
      <button onClick={onRemove} title="Remove from deck">
        ✕
      </button>
    </div>
  )
}

function NoteRow({ note }: { note: Note }) {
  return (
    <div className="row" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: 6 }}>
      <span className="meta">
        {note.ref.book} {note.ref.chapter}:{note.ref.verse}
      </span>
      <span style={{ whiteSpace: 'pre-wrap' }}>{note.text}</span>
    </div>
  )
}
