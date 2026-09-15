import type { AppState, DayLog, Lesson, PlanItem } from '../types'
import { LESSONS } from '../data/lessons'
import { dueCards } from './srs'
import { today } from './storage'

/**
 * Works out what the learner should do today and how far along they are.
 * The plan is deliberately short: four things, finishable in a sitting.
 */

export function dayLog(state: AppState, date = today()): DayLog {
  return state.days[date] ?? { date, drills: 0, correct: 0, versesRead: 0, lessonsDone: 0 }
}

function isActive(log: DayLog): boolean {
  return log.drills > 0 || log.lessonsDone > 0 || log.versesRead > 0
}

/**
 * Consecutive active days ending today (or yesterday — a streak is not broken
 * until a day has been missed in full).
 */
export function streak(state: AppState, now = new Date()): number {
  let count = 0
  const cursor = new Date(now)

  if (!isActive(dayLog(state, today(cursor)))) {
    cursor.setDate(cursor.getDate() - 1)
    if (!isActive(dayLog(state, today(cursor)))) return 0
  }

  while (isActive(dayLog(state, today(cursor)))) {
    count++
    cursor.setDate(cursor.getDate() - 1)
  }
  return count
}

/** The first lesson not yet completed. */
export function nextLesson(state: AppState): Lesson | undefined {
  return LESSONS.find((lesson) => !state.lessons[lesson.id]?.completedAt)
}

export function completedLessonIds(state: AppState): string[] {
  return LESSONS.filter((l) => state.lessons[l.id]?.completedAt).map((l) => l.id)
}

/** Lessons available to draw practice from: everything completed, plus the current one. */
export function studiedLessonIds(state: AppState): string[] {
  const done = completedLessonIds(state)
  const current = nextLesson(state)
  return current ? [...done, current.id] : done
}

export function curriculumProgress(state: AppState): { done: number; total: number } {
  return { done: completedLessonIds(state).length, total: LESSONS.length }
}

export function buildPlan(state: AppState): PlanItem[] {
  const log = dayLog(state)
  const due = dueCards(Object.values(state.cards)).length
  const lesson = nextLesson(state)
  const goal = state.settings.dailyGoal

  const items: PlanItem[] = []

  if (due > 0 || Object.keys(state.cards).length > 0) {
    items.push({
      kind: 'review',
      title: due > 0 ? `Review ${due} word${due === 1 ? '' : 's'}` : 'Reviews are clear',
      detail: due > 0 ? 'Words you saved are due to come back.' : 'Nothing due right now — come back tomorrow.',
      count: due,
      done: due === 0,
    })
  }

  if (lesson) {
    items.push({
      kind: 'lesson',
      title: `Lesson: ${lesson.titleEn}`,
      detail: `${lesson.summary} · about ${lesson.minutes} min`,
      done: false,
    })
  } else {
    items.push({
      kind: 'lesson',
      title: 'Curriculum finished',
      detail: 'Every lesson is done. Keep drilling and reading to hold on to it.',
      done: true,
    })
  }

  items.push({
    kind: 'drill',
    title: `Practice ${goal} drills`,
    detail:
      log.drills >= goal
        ? `Done — ${log.drills} today, ${log.correct} right.`
        : `${log.drills} of ${goal} done today. Mixed translation, gaps and listening.`,
    count: Math.max(0, goal - log.drills),
    done: log.drills >= goal,
  })

  items.push({
    kind: 'speak',
    title: 'Speaking practice',
    detail: state.settings.micEnabled
      ? 'Say your sentences out loud and have them checked.'
      : 'Listen and repeat. Turn on the microphone in Settings to be scored.',
    done: false,
  })

  items.push({
    kind: 'read',
    title: 'Read a passage',
    detail:
      log.versesRead > 0
        ? `${log.versesRead} verse${log.versesRead === 1 ? '' : 's'} read today.`
        : 'Read with the audio, and tap anything you do not recognise.',
    count: log.versesRead,
    done: log.versesRead > 0,
  })

  return items
}

/** Records activity against today's log. */
export function logActivity(
  state: AppState,
  change: Partial<Omit<DayLog, 'date'>>,
): AppState {
  const date = today()
  const current = dayLog(state, date)
  return {
    ...state,
    days: {
      ...state.days,
      [date]: {
        date,
        drills: current.drills + (change.drills ?? 0),
        correct: current.correct + (change.correct ?? 0),
        versesRead: current.versesRead + (change.versesRead ?? 0),
        lessonsDone: current.lessonsDone + (change.lessonsDone ?? 0),
      },
    },
  }
}

/** Activity over the last n days, oldest first — for the little streak strip. */
export function recentDays(state: AppState, days = 14): DayLog[] {
  const out: DayLog[] = []
  const cursor = new Date()
  cursor.setDate(cursor.getDate() - (days - 1))
  for (let i = 0; i < days; i++) {
    out.push(dayLog(state, today(cursor)))
    cursor.setDate(cursor.getDate() + 1)
  }
  return out
}
