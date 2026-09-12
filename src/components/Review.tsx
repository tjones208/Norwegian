import { useEffect, useMemo, useState } from 'react'
import type { Card } from '../types'
import { dueCards, formatInterval, review, stats, type Grade } from '../lib/srs'
import * as tts from '../lib/tts'

interface Props {
  cards: Record<string, Card>
  rate: number
  voiceURI: string | null
  onGrade: (card: Card, grade: Grade) => void
}

const GRADES: Array<{ grade: Grade; label: string; key: string }> = [
  { grade: 'again', label: 'Again', key: '1' },
  { grade: 'hard', label: 'Hard', key: '2' },
  { grade: 'good', label: 'Good', key: '3' },
  { grade: 'easy', label: 'Easy', key: '4' },
]

export function Review({ cards, rate, voiceURI, onGrade }: Props) {
  const [revealed, setRevealed] = useState(false)
  const [done, setDone] = useState(0)

  const list = useMemo(() => Object.values(cards), [cards])
  const queue = useMemo(() => dueCards(list), [list])
  const deck = useMemo(() => stats(list), [list])
  const current = queue[0]

  useEffect(() => setRevealed(false), [current?.id])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      if (!current) return
      if (e.key === ' ') {
        e.preventDefault()
        setRevealed(true)
        return
      }
      if (!revealed) return
      const match = GRADES.find((g) => g.key === e.key)
      if (match) {
        onGrade(current, match.grade)
        setDone((n) => n + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [current, revealed, onGrade])

  const speak = (text: string) => tts.speak(text, { rate, voiceURI })

  if (!list.length) {
    return (
      <div className="empty">
        <p>Your deck is empty.</p>
        <p>Click a word while reading and choose “Add to deck” to start collecting vocabulary.</p>
      </div>
    )
  }

  return (
    <>
      <div className="stats">
        <div className="stat">
          <div className="n">{deck.due}</div>
          <div className="k">due now</div>
        </div>
        <div className="stat">
          <div className="n">{deck.fresh}</div>
          <div className="k">new</div>
        </div>
        <div className="stat">
          <div className="n">{deck.learning}</div>
          <div className="k">learning</div>
        </div>
        <div className="stat">
          <div className="n">{deck.mature}</div>
          <div className="k">mature</div>
        </div>
        <div className="stat">
          <div className="n">{done}</div>
          <div className="k">this session</div>
        </div>
      </div>

      {!current ? (
        <div className="empty">
          <p>Nothing due right now. {done > 0 && `You reviewed ${done} ${done === 1 ? 'card' : 'cards'}.`}</p>
          {deck.nextDueAt && <p>Next card is due {relative(deck.nextDueAt)}.</p>}
        </div>
      ) : (
        <>
          <div className="flashcard">
            <div className="front">{current.surface}</div>
            {revealed ? (
              <>
                <div className="back">{current.en || '—'}</div>
                {current.lemma.toLowerCase() !== current.surface.toLowerCase() && (
                  <div className="via ui" style={{ marginTop: 6 }}>
                    dictionary form: {current.lemma}
                  </div>
                )}
                {current.context && (
                  <div className="ctx">
                    {current.context}
                    {current.contextRef && (
                      <div className="ui" style={{ fontSize: 12, color: 'var(--text-faint)', marginTop: 8 }}>
                        {current.contextRef.book} {current.contextRef.chapter}:{current.contextRef.verse}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="back" style={{ color: 'var(--text-faint)' }}>
                What does it mean?
              </div>
            )}
            <div className="panel-actions" style={{ justifyContent: 'center', marginTop: 18 }}>
              <button onClick={() => speak(current.surface)}>🔊 Word</button>
              {current.context && <button onClick={() => speak(current.context!)}>🔊 Sentence</button>}
            </div>
          </div>

          {revealed ? (
            <div className="grade-row">
              {GRADES.map(({ grade, label, key }) => (
                <button
                  key={grade}
                  className={grade === 'good' ? 'primary' : ''}
                  onClick={() => {
                    onGrade(current, grade)
                    setDone((n) => n + 1)
                  }}
                >
                  <span>
                    {label} <kbd>{key}</kbd>
                  </span>
                  <span className="when">{formatInterval(current, grade)}</span>
                </button>
              ))}
            </div>
          ) : (
            <button className="primary" style={{ width: '100%' }} onClick={() => setRevealed(true)}>
              Show answer <kbd>space</kbd>
            </button>
          )}

          <p className="ui" style={{ color: 'var(--text-faint)', fontSize: 13, marginTop: 14 }}>
            {queue.length} left in this queue · answering with{' '}
            <kbd>1</kbd>–<kbd>4</kbd> also works.
          </p>
        </>
      )}
    </>
  )
}

/** Rough "in 3 days" phrasing for the next-due hint. */
function relative(timestamp: number): string {
  const ms = timestamp - Date.now()
  if (ms < 60 * 60 * 1000) return `in ${Math.max(1, Math.round(ms / 60000))} minutes`
  if (ms < 24 * 60 * 60 * 1000) return `in ${Math.round(ms / (60 * 60 * 1000))} hours`
  return `in ${Math.round(ms / (24 * 60 * 60 * 1000))} days`
}

export { review }
