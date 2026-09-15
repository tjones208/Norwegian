import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { AppState, Corpus, Drill, DrillKind } from '../types'
import { KIND_LABEL, drillsForLesson, mixedDrills } from '../lib/drills'
import { grade, percent, type Result } from '../lib/scoring'
import { studiedLessonIds } from '../lib/plan'
import { LESSONS } from '../data/lessons'
import * as tts from '../lib/tts'
import * as asr from '../lib/asr'

interface Props {
  state: AppState
  corpus?: Corpus
  /** Restrict to one lesson's drills, when arriving from a lesson page. */
  lessonId?: string
  /** Restrict to certain kinds — the Speak tab passes ['speak']. */
  only?: DrillKind[]
  onAnswered: (correct: boolean) => void
}

const ALL_KINDS: DrillKind[] = ['translate', 'cloze', 'dictation', 'choice']

export function Practice({ state, corpus, lessonId, only, onAnswered }: Props) {
  const kinds = useMemo<DrillKind[]>(() => {
    if (only) return only
    // Speaking drills only join the mix once the microphone is switched on.
    return state.settings.micEnabled ? [...ALL_KINDS, 'speak'] : ALL_KINDS
  }, [only, state.settings.micEnabled])

  // The seed fixes the queue for a round, so answering does not reshuffle the
  // questions underneath you. Starting another round draws a new one.
  const [seed, setSeed] = useState(() => Date.now())

  // Only the set of studied lessons should change the pool — not the rest of
  // app state, which updates on every answer as the day's tally is logged.
  const lessonIds = useMemo(() => studiedLessonIds(state), [state.lessons])
  const limit = Math.max(10, state.settings.dailyGoal)

  const queue = useMemo(() => {
    if (lessonId) {
      const lesson = LESSONS.find((l) => l.id === lessonId)
      return lesson ? drillsForLesson(lesson, kinds) : []
    }
    return mixedDrills({ lessonIds, kinds, limit, seed, corpus })
  }, [lessonId, kinds, seed, corpus, lessonIds, limit])

  const [index, setIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const [result, setResult] = useState<Result | null>(null)
  const [score, setScore] = useState({ done: 0, right: 0 })
  const inputRef = useRef<HTMLInputElement>(null)

  const drill = queue[index]

  const speak = useCallback(
    (text: string) => tts.speak(text, { rate: state.settings.rate, voiceURI: state.settings.voiceURI }),
    [state.settings.rate, state.settings.voiceURI],
  )

  // Dictation plays itself as soon as it appears — that is the whole exercise.
  useEffect(() => {
    if (drill?.kind === 'dictation' && drill.audio) speak(drill.audio)
    setTyped('')
    setResult(null)
    inputRef.current?.focus()
  }, [drill?.id, drill?.kind, drill?.audio, speak])

  const check = (answer: string) => {
    if (!drill || result) return
    const graded = grade(drill.answer, answer, drill.alternatives)
    setResult(graded)
    setScore((s) => ({ done: s.done + 1, right: s.right + (graded.correct ? 1 : 0) }))
    onAnswered(graded.correct)
  }

  const next = () => {
    setIndex((i) => i + 1)
  }

  if (!queue.length) {
    return (
      <div className="empty">
        <p>No drills available yet.</p>
        <p>Work through a lesson first — practice is built from sentences you have already seen.</p>
      </div>
    )
  }

  if (!drill) {
    const pct = score.done ? Math.round((score.right / score.done) * 100) : 0
    return (
      <div className="empty">
        <h2 className="section">Ferdig!</h2>
        <p>
          {score.right} of {score.done} correct — {pct}%.
        </p>
        <button
          className="primary"
          onClick={() => {
            setSeed(Date.now())
            setIndex(0)
            setScore({ done: 0, right: 0 })
          }}
        >
          Another round
        </button>
      </div>
    )
  }

  return (
    <>
      <div className="drill-bar ui">
        <span className="kind">{KIND_LABEL[drill.kind]}</span>
        {drill.sourceLabel && <span className="src">{drill.sourceLabel}</span>}
        <span className="spacer" />
        <span className="meta">
          {index + 1} / {queue.length} · {score.right} right
        </span>
      </div>
      <div className="progress">
        <div style={{ width: `${(index / queue.length) * 100}%` }} />
      </div>

      <div className="drill">
        {drill.kind === 'dictation' ? (
          <div className="drill-prompt">
            <button className="primary big-audio" onClick={() => drill.audio && speak(drill.audio)}>
              🔊 Play again
            </button>
            <p className="ui" style={{ color: 'var(--text-faint)' }}>{drill.prompt}</p>
          </div>
        ) : (
          <div className="drill-prompt">
            <p className="prompt-text">{drill.prompt}</p>
            {drill.kind === 'translate' && <p className="ui prompt-task">Write it in Norwegian.</p>}
            {drill.kind === 'cloze' && drill.hint && <p className="ui prompt-task">{drill.hint}</p>}
            {drill.kind === 'speak' && (
              <button className="ghost" onClick={() => drill.audio && speak(drill.audio)}>
                🔊 Hear it first
              </button>
            )}
          </div>
        )}

        {drill.kind === 'choice' ? (
          <div className="choice-row">
            {drill.choices?.map((choice) => (
              <button
                key={choice}
                className={
                  result
                    ? choice === drill.answer
                      ? 'primary'
                      : ''
                    : ''
                }
                disabled={Boolean(result)}
                onClick={() => check(choice)}
              >
                {choice}
              </button>
            ))}
          </div>
        ) : drill.kind === 'speak' ? (
          <SpeakAnswer
            target={drill.answer}
            enabled={state.settings.micEnabled}
            onTranscript={check}
            disabled={Boolean(result)}
          />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              result ? next() : check(typed)
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="Skriv på norsk…"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              disabled={Boolean(result)}
              aria-label="Your answer"
            />
            {!result && (
              <button className="primary" type="submit" style={{ marginTop: 10 }}>
                Sjekk — check
              </button>
            )}
          </form>
        )}

        {result && <Feedback result={result} drill={drill} onSpeak={speak} onNext={next} />}
      </div>

      <p className="ui hint-line">
        Special letters: <button className="chip" onClick={() => setTyped((t) => t + 'æ')}>æ</button>
        <button className="chip" onClick={() => setTyped((t) => t + 'ø')}>ø</button>
        <button className="chip" onClick={() => setTyped((t) => t + 'å')}>å</button>
        <span className="meta"> — or type ae, o, a and they will still be accepted.</span>
      </p>
    </>
  )
}

function Feedback({
  result,
  drill,
  onSpeak,
  onNext,
}: {
  result: Result
  drill: Drill
  onSpeak: (t: string) => void
  onNext: () => void
}) {
  return (
    <div className={`feedback ${result.correct ? 'right' : 'wrong'}`}>
      <div className="verdict">
        {result.correct ? 'Riktig!' : `Not quite — ${percent(result.ratio)}% of the words`}
      </div>

      <div className="word-diff">
        {result.words.map((w, i) => (
          <span key={i} className={`wd ${w.status}`} title={w.got ? `you wrote: ${w.got}` : w.status}>
            {w.word}
          </span>
        ))}
      </div>

      {!result.correct && (
        <p className="ui legend">
          <span className="wd ok">matched</span>
          <span className="wd close">spelling</span>
          <span className="wd missing">missed</span>
          <span className="wd extra">not needed</span>
        </p>
      )}

      {result.note && <p className="ui note-line">{result.note}</p>}

      {!result.correct && (
        <p className="answer-line">
          <strong>{drill.answer}</strong>
          {drill.hint && drill.kind !== 'cloze' && <em> — {drill.hint}</em>}
        </p>
      )}

      <div className="panel-actions">
        <button onClick={() => onSpeak(drill.audio ?? drill.answer)}>🔊 Hear it</button>
        <button className="primary" onClick={onNext} autoFocus>
          Neste ›
        </button>
      </div>
    </div>
  )
}

/** Microphone answer: listens once, hands the transcript back for grading. */
function SpeakAnswer({
  target,
  enabled,
  onTranscript,
  disabled,
}: {
  target: string
  enabled: boolean
  onTranscript: (text: string) => void
  disabled: boolean
}) {
  const [listening, setListening] = useState(false)
  const [partial, setPartial] = useState('')
  const [error, setError] = useState<string | null>(null)
  const session = useRef<asr.Session | null>(null)

  useEffect(() => () => session.current?.stop(), [])

  const reason = asr.unavailableReason()

  if (!enabled) {
    return (
      <div className="notice">
        Speaking drills are scored with the microphone, which is off. Turn it on under{' '}
        <strong>Innstillinger → Speaking</strong>. Until then, read the sentence aloud and compare yourself
        with the audio.
        <div className="panel-actions">
          <button onClick={() => onTranscript(target)}>I said it — continue</button>
        </div>
      </div>
    )
  }

  if (reason) {
    return (
      <div className="notice warn">
        {reason}
        <div className="panel-actions">
          <button onClick={() => onTranscript(target)}>Continue without scoring</button>
        </div>
      </div>
    )
  }

  const start = () => {
    setError(null)
    setPartial('')
    setListening(true)
    session.current = asr.listen({
      onPartial: setPartial,
      onResult: (text) => {
        setListening(false)
        setPartial('')
        onTranscript(text)
      },
      onError: (message) => {
        setListening(false)
        if (message) setError(message)
      },
      onEnd: () => setListening(false),
    })
  }

  return (
    <div className="mic-area">
      <button
        className={`mic ${listening ? 'on' : ''}`}
        onClick={listening ? () => session.current?.stop() : start}
        disabled={disabled}
      >
        {listening ? '● Lytter…' : '🎤 Snakk'}
      </button>
      {partial && <p className="partial ui">{partial}</p>}
      {error && <p className="ui error-line">{error}</p>}
      {!listening && !error && <p className="ui meta">Press, then read the sentence aloud.</p>}
    </div>
  )
}
