import { useMemo, useState } from 'react'
import type { AppState, Lesson, Section } from '../types'
import { LESSONS, UNITS, lessonsInUnit } from '../data/lessons'
import { nextLesson } from '../lib/plan'
import * as tts from '../lib/tts'

interface Props {
  state: AppState
  onComplete: (lessonId: string) => void
  onPractiseLesson: (lessonId: string) => void
  /** Pre-open a specific lesson, e.g. when arriving from the daily plan. */
  initialLessonId?: string
}

export function Lessons({ state, onComplete, onPractiseLesson, initialLessonId }: Props) {
  const suggested = useMemo(() => nextLesson(state), [state])
  const [openId, setOpenId] = useState<string | null>(initialLessonId ?? null)

  const lesson = openId ? LESSONS.find((l) => l.id === openId) : undefined
  const speak = (text: string) =>
    tts.speak(text, { rate: state.settings.rate, voiceURI: state.settings.voiceURI })

  if (lesson) {
    return (
      <LessonView
        lesson={lesson}
        done={Boolean(state.lessons[lesson.id]?.completedAt)}
        onSpeak={speak}
        onBack={() => setOpenId(null)}
        onComplete={() => {
          onComplete(lesson.id)
          setOpenId(null)
        }}
        onPractise={() => onPractiseLesson(lesson.id)}
      />
    )
  }

  return (
    <>
      <h2 className="section">Kurset — the course</h2>
      <p className="ui lead">
        Twenty-six lessons, in order. Each one explains a piece of Norwegian, shows it in real sentences,
        and feeds the practice drills.
      </p>

      {UNITS.map((unit) => {
        const lessons = lessonsInUnit(unit.id)
        const done = lessons.filter((l) => state.lessons[l.id]?.completedAt).length
        return (
          <section key={unit.id} className="unit">
            <header className="unit-head">
              <div>
                <h3>{unit.title}</h3>
                <p>{unit.goal}</p>
              </div>
              <span className="unit-count ui">
                {done}/{lessons.length}
              </span>
            </header>
            <div className="card-grid">
              {lessons.map((l) => {
                const complete = Boolean(state.lessons[l.id]?.completedAt)
                return (
                  <button
                    key={l.id}
                    className={`lesson-row ${complete ? 'complete' : ''} ${suggested?.id === l.id ? 'current' : ''}`}
                    onClick={() => setOpenId(l.id)}
                  >
                    <span className="mark">{complete ? '✓' : suggested?.id === l.id ? '▸' : ''}</span>
                    <span className="lesson-title">
                      <strong>{l.title}</strong>
                      <em>{l.titleEn}</em>
                    </span>
                    <span className="meta">{l.minutes} min</span>
                  </button>
                )
              })}
            </div>
          </section>
        )
      })}
    </>
  )
}

interface ViewProps {
  lesson: Lesson
  done: boolean
  onSpeak: (text: string) => void
  onBack: () => void
  onComplete: () => void
  onPractise: () => void
}

function LessonView({ lesson, done, onSpeak, onBack, onComplete, onPractise }: ViewProps) {
  return (
    <article>
      <button className="ghost ui" onClick={onBack} style={{ marginBottom: 12 }}>
        ‹ All lessons
      </button>

      <h1 className="chapter-title">{lesson.title}</h1>
      <p className="chapter-sub">
        {lesson.titleEn} · about {lesson.minutes} min
      </p>
      <p className="heading">{lesson.summary}</p>

      {lesson.sections.map((section, i) => (
        <SectionView key={i} section={section} onSpeak={onSpeak} />
      ))}

      {lesson.vocab && lesson.vocab.length > 0 && (
        <>
          <h2 className="section">Ord — words from this lesson</h2>
          <div className="card-grid">
            {lesson.vocab.map((v) => (
              <div className="row" key={v.no}>
                <span className="lemma" style={{ minWidth: 150 }}>
                  {v.no}
                </span>
                <span className="en">{v.en}</span>
                <button onClick={() => onSpeak(v.no)} aria-label={`Speak ${v.no}`}>
                  🔊
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <div className="lesson-actions">
        <button className="primary" onClick={onPractise}>
          Practise this lesson
        </button>
        <button onClick={onComplete}>{done ? 'Mark as not done' : 'Mark as done'}</button>
      </div>
    </article>
  )
}

function SectionView({ section, onSpeak }: { section: Section; onSpeak: (t: string) => void }) {
  return (
    <section className="lesson-section">
      <h2 className="section">{section.heading}</h2>
      <p className="ui body">{section.body}</p>

      {section.examples && (
        <div className="examples">
          {section.examples.map((ex, i) => (
            <div className="example" key={i}>
              <button
                className="ghost ex-speak"
                onClick={() => onSpeak(ex.no)}
                aria-label={`Speak ${ex.no}`}
                title="Read aloud"
              >
                🔊
              </button>
              <div>
                <div className="ex-no">{ex.no}</div>
                <div className="ex-en">{ex.en}</div>
                {ex.note && <div className="ex-note">{ex.note}</div>}
              </div>
            </div>
          ))}
        </div>
      )}

      {section.table && (
        <figure className="table-wrap">
          {section.table.caption && <figcaption>{section.table.caption}</figcaption>}
          <table>
            <thead>
              <tr>
                {section.table.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </figure>
      )}
    </section>
  )
}
