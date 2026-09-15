import { useMemo } from 'react'
import type { AppState, PlanItem, PlanItemKind } from '../types'
import { buildPlan, curriculumProgress, dayLog, recentDays, streak } from '../lib/plan'
import { stats } from '../lib/srs'
import { UNITS } from '../data/lessons'
import { nextLesson } from '../lib/plan'

interface Props {
  state: AppState
  onGo: (kind: PlanItemKind) => void
}

const ICON: Record<PlanItemKind, string> = {
  review: '🔁',
  lesson: '📘',
  drill: '✍️',
  speak: '🎤',
  read: '📖',
}

const ACTION: Record<PlanItemKind, string> = {
  review: 'Review',
  lesson: 'Open lesson',
  drill: 'Practise',
  speak: 'Speak',
  read: 'Read',
}

export function Home({ state, onGo }: Props) {
  const plan = useMemo(() => buildPlan(state), [state])
  const days = useMemo(() => recentDays(state), [state])
  const progress = useMemo(() => curriculumProgress(state), [state])
  const deck = useMemo(() => stats(Object.values(state.cards)), [state.cards])
  const run = useMemo(() => streak(state), [state])
  const log = dayLog(state)
  const lesson = nextLesson(state)

  const unit = lesson ? UNITS.find((u) => u.id === lesson.unitId) : undefined
  const goalPct = Math.min(100, Math.round((log.drills / Math.max(1, state.settings.dailyGoal)) * 100))

  return (
    <>
      <header className="home-head">
        <h1>God dag!</h1>
        <p className="ui">
          {run > 0 ? (
            <>
              <strong>{run}-day streak.</strong> {log.drills > 0 ? 'Today is under way.' : 'Keep it going today.'}
            </>
          ) : (
            'Start a streak today — anything counts.'
          )}
        </p>
      </header>

      <div className="stats">
        <div className="stat">
          <div className="n">{run}</div>
          <div className="k">day streak</div>
        </div>
        <div className="stat">
          <div className="n">
            {progress.done}
            <span className="of">/{progress.total}</span>
          </div>
          <div className="k">lessons</div>
        </div>
        <div className="stat">
          <div className="n">{deck.total}</div>
          <div className="k">words saved</div>
        </div>
        <div className="stat">
          <div className="n">{deck.due}</div>
          <div className="k">due now</div>
        </div>
      </div>

      <div className="streak-strip" aria-label="Activity over the last two weeks">
        {days.map((d) => {
          const active = d.drills > 0 || d.lessonsDone > 0 || d.versesRead > 0
          const strong = d.drills >= state.settings.dailyGoal
          return (
            <span
              key={d.date}
              className={`tick ${active ? 'active' : ''} ${strong ? 'strong' : ''}`}
              title={`${d.date}: ${d.drills} drills, ${d.versesRead} verses`}
            />
          )
        })}
      </div>

      <h2 className="section">I dag — today</h2>
      <div className="card-grid">
        {plan.map((item) => (
          <PlanRow key={item.kind} item={item} onGo={() => onGo(item.kind)} />
        ))}
      </div>

      {log.drills > 0 && (
        <>
          <h2 className="section">Dagens mål — today’s goal</h2>
          <div className="progress">
            <div style={{ width: `${goalPct}%` }} />
          </div>
          <p className="ui meta">
            {log.drills} of {state.settings.dailyGoal} drills · {log.correct} correct
          </p>
        </>
      )}

      {unit && lesson && (
        <>
          <h2 className="section">Hvor du er — where you are</h2>
          <div className="notice">
            <strong>{unit.title}</strong> — {unit.goal}
            <br />
            Next up: <strong>{lesson.title}</strong> ({lesson.titleEn}).
          </div>
        </>
      )}
    </>
  )
}

function PlanRow({ item, onGo }: { item: PlanItem; onGo: () => void }) {
  return (
    <div className={`plan-row ${item.done ? 'done' : ''}`}>
      <span className="plan-icon" aria-hidden="true">
        {ICON[item.kind]}
      </span>
      <span className="plan-text">
        <strong>{item.title}</strong>
        <em>{item.detail}</em>
      </span>
      <button className={item.done ? '' : 'primary'} onClick={onGo}>
        {item.done ? 'Again' : ACTION[item.kind]}
      </button>
    </div>
  )
}
