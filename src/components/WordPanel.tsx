import { useMemo, useState } from 'react'
import type { Card, GlossEntry, Settings, VerseRef } from '../types'
import { article, lookup, POS_LABEL } from '../lib/glossary'
import { pronunciationHints } from '../lib/tts'
import { normalize } from '../lib/tokenize'
import { Speak } from './Speak'

interface Props {
  word: string
  ref_: VerseRef
  refLabel: string
  context: string
  userGlossary: Record<string, GlossEntry>
  existingCard?: Card
  settings: Settings
  onAddCard: (fields: { surface: string; lemma: string; en: string; pos?: GlossEntry['pos']; context: string; ref: VerseRef }) => void
  onRemoveCard: (id: string) => void
  onSaveGloss: (entry: GlossEntry) => void
  onClose: () => void
}

/**
 * The pop-up that appears when you click a word: what it means, how it is
 * inflected, how to say it, and a one-click path into your review deck.
 */
export function WordPanel({
  word,
  ref_,
  refLabel,
  context,
  userGlossary,
  existingCard,
  settings,
  onAddCard,
  onRemoveCard,
  onSaveGloss,
  onClose,
}: Props) {
  const surface = normalize(word)
  const result = useMemo(() => lookup(word, userGlossary), [word, userGlossary])
  const hints = useMemo(() => pronunciationHints(surface), [surface])

  const [defining, setDefining] = useState(false)
  const [draftEn, setDraftEn] = useState('')
  const [draftPos, setDraftPos] = useState<GlossEntry['pos']>('noun')

  const entry = result.entry
  const gloss = entry ? entry.en.join(', ') : ''

  return (
    <aside className="panel">
      <div className="panel-head">
        <span className="panel-word">{word}</span>
        {entry && <span className="pos">{POS_LABEL[entry.pos] ?? entry.pos}</span>}
        <button className="ghost panel-close" onClick={onClose} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="via">
        {result.via ? result.via : 'not in the glossary'}
        {entry && article(entry) ? ` · ${article(entry)} ${entry.lemma}` : ''}
      </div>

      {entry ? (
        <div className="gloss">{gloss}</div>
      ) : (
        <div className="gloss" style={{ color: 'var(--text-faint)' }}>
          No definition yet.
        </div>
      )}

      {entry?.note && <div className="note">{entry.note}</div>}
      {!entry && result.guess && <div className="note">{result.guess}</div>}
      {hints.map((hint) => (
        <div className="hint" key={hint}>
          {hint}
        </div>
      ))}

      {context && <div className="context">{context}</div>}

      <div className="panel-actions">
        <Speak
          text={word}
          label="Word"
          rate={settings.rate}
          slowRate={settings.slowRate}
          voiceURI={settings.voiceURI}
        />
        <Speak
          text={context}
          label="Sentence"
          rate={settings.rate}
          slowRate={settings.slowRate}
          voiceURI={settings.voiceURI}
        />
      </div>

      <div className="panel-actions">
        {existingCard ? (
          <button onClick={() => onRemoveCard(existingCard.id)}>✓ In deck — remove</button>
        ) : entry ? (
          <button
            className="primary"
            onClick={() =>
              onAddCard({
                surface: word,
                lemma: entry.lemma,
                en: gloss,
                pos: entry.pos,
                context,
                ref: ref_,
              })
            }
          >
            + Add to deck
          </button>
        ) : (
          // Without a definition there is nothing to put on the back of the
          // card, so writing one is the only sensible next step.
          !defining && (
            <button className="primary" onClick={() => setDefining(true)}>
              Define it &amp; add to deck
            </button>
          )
        )}
      </div>

      {defining && (
        <div style={{ marginTop: 14 }}>
          <div className="field">
            <label htmlFor="own-gloss">English for “{surface}”</label>
            <input
              id="own-gloss"
              type="text"
              autoFocus
              value={draftEn}
              placeholder="e.g. to gather"
              onChange={(e) => setDraftEn(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="own-pos">Part of speech</label>
            <select id="own-pos" value={draftPos} onChange={(e) => setDraftPos(e.target.value as GlossEntry['pos'])}>
              {Object.entries(POS_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="panel-actions">
            <button
              className="primary"
              disabled={!draftEn.trim()}
              onClick={() => {
                const own: GlossEntry = {
                  lemma: surface,
                  pos: draftPos,
                  en: draftEn.split(',').map((s) => s.trim()).filter(Boolean),
                }
                onSaveGloss(own)
                onAddCard({
                  surface: word,
                  lemma: own.lemma,
                  en: own.en.join(', '),
                  pos: own.pos,
                  context,
                  ref: ref_,
                })
                setDefining(false)
                setDraftEn('')
              }}
            >
              Save & add to deck
            </button>
            <button onClick={() => setDefining(false)}>Cancel</button>
          </div>
          <div className="help" style={{ marginTop: 8, fontSize: 12, color: 'var(--text-faint)' }}>
            Saved to your own glossary, so the next time this word appears it will be recognised.
          </div>
        </div>
      )}

      <div className="via" style={{ marginTop: 14 }}>
        {refLabel}
      </div>
    </aside>
  )
}
