import { memo, useMemo, useState } from 'react'
import type { Note, ParallelMode, Verse, VerseRef } from '../types'
import { tokenize, normalize } from '../lib/tokenize'

interface Props {
  verse: Verse
  ref_: VerseRef
  parallel: ParallelMode
  /** Lemmas/surfaces already in the deck, used to tint known words. */
  known: Set<string>
  highlightKnown: boolean
  isRead: boolean
  note?: Note
  /** Character offset currently being spoken, or null when idle. */
  speakingAt: number | null
  selectedWord: string | null
  onWordClick: (word: string, ref: VerseRef, verseText: string) => void
  onSpeakVerse: (ref: VerseRef, text: string, slow?: boolean) => void
  onToggleRead: (ref: VerseRef) => void
  onSaveNote: (ref: VerseRef, text: string) => void
}

function VerseViewInner({
  verse,
  ref_,
  parallel,
  known,
  highlightKnown,
  isRead,
  note,
  speakingAt,
  selectedWord,
  onWordClick,
  onSpeakVerse,
  onToggleRead,
  onSaveNote,
}: Props) {
  const [editingNote, setEditingNote] = useState(false)
  const [draft, setDraft] = useState(note?.text ?? '')
  const tokens = useMemo(() => tokenize(verse.no), [verse.no])

  const active = speakingAt !== null

  return (
    <div className={`verse ${parallel === 'side' ? 'side' : ''} ${active ? 'active' : ''} ${isRead ? 'read' : ''}`}>
      <button
        className="verse-num"
        onClick={() => onToggleRead(ref_)}
        title={isRead ? 'Marked as read — click to unmark' : 'Mark as read'}
      >
        {verse.n}
      </button>

      <div className="verse-text">
        {tokens.map((token, i) =>
          token.isWord ? (
            <span
              key={i}
              className={[
                'w',
                highlightKnown && known.has(normalize(token.text)) ? 'known' : '',
                speakingAt !== null &&
                speakingAt >= token.start &&
                speakingAt < token.start + token.text.length
                  ? 'speaking'
                  : '',
                selectedWord === normalize(token.text) ? 'selected' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => onWordClick(token.text, ref_, verse.no)}
            >
              {token.text}
            </span>
          ) : (
            <span key={i}>{token.text}</span>
          ),
        )}
      </div>

      {parallel !== 'off' && verse.en && <div className="verse-en">{verse.en}</div>}

      <div className="verse-tools ui">
        <button onClick={() => onSpeakVerse(ref_, verse.no)} title="Read this verse aloud">
          ▶ Les
        </button>
        <button onClick={() => onSpeakVerse(ref_, verse.no, true)} title="Read this verse aloud, slowly">
          🐢 Sakte
        </button>
        <button
          onClick={() => {
            setDraft(note?.text ?? '')
            setEditingNote((v) => !v)
          }}
        >
          {note ? 'Edit note' : '+ Note'}
        </button>
      </div>

      {note && !editingNote && (
        <div
          className="note-saved"
          onClick={() => {
            setDraft(note.text)
            setEditingNote(true)
          }}
        >
          {note.text}
        </div>
      )}

      {editingNote && (
        <div className="note-box">
          <textarea
            autoFocus
            value={draft}
            placeholder="What did you notice about this verse?"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') setEditingNote(false)
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                onSaveNote(ref_, draft)
                setEditingNote(false)
              }
            }}
          />
          <div className="panel-actions">
            <button
              className="primary"
              onClick={() => {
                onSaveNote(ref_, draft)
                setEditingNote(false)
              }}
            >
              Save
            </button>
            <button onClick={() => setEditingNote(false)}>Cancel</button>
            {note && (
              <button
                onClick={() => {
                  onSaveNote(ref_, '')
                  setEditingNote(false)
                }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export const VerseView = memo(VerseViewInner)
