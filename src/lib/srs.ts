import type { Card } from '../types'

/**
 * SM-2 spaced repetition, the algorithm behind Anki's default scheduler.
 * A card's interval grows by its ease factor on each success and collapses to a
 * same-day retry on a failure.
 */

export type Grade = 'again' | 'hard' | 'good' | 'easy'

/** SM-2 quality scores, 0–5. Below 3 counts as a lapse. */
const QUALITY: Record<Grade, number> = { again: 2, hard: 3, good: 4, easy: 5 }

export const DAY = 24 * 60 * 60 * 1000

export function newCard(fields: Omit<Card, 'ef' | 'interval' | 'reps' | 'lapses' | 'dueAt' | 'createdAt'>): Card {
  return {
    ...fields,
    createdAt: Date.now(),
    ef: 2.5,
    interval: 0,
    reps: 0,
    lapses: 0,
    dueAt: Date.now(),
  }
}

export function review(card: Card, grade: Grade, now = Date.now()): Card {
  const q = QUALITY[grade]
  const next: Card = { ...card, lastReviewedAt: now }

  if (q < 3) {
    // Failed: restart the ladder and show it again in ten minutes.
    next.reps = 0
    next.lapses = card.lapses + 1
    next.interval = 0
    next.dueAt = now + 10 * 60 * 1000
  } else {
    next.reps = card.reps + 1
    if (next.reps === 1) next.interval = 1
    else if (next.reps === 2) next.interval = 6
    else next.interval = Math.round(card.interval * card.ef)
    if (grade === 'hard') next.interval = Math.max(1, Math.round(next.interval * 0.6))
    if (grade === 'easy') next.interval = Math.round(next.interval * 1.3)
    next.dueAt = now + next.interval * DAY
  }

  // Standard SM-2 ease adjustment, floored so a hard card never stalls entirely.
  next.ef = Math.max(1.3, card.ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
  return next
}

/** Cards due now, hardest-earned first so lapses come back around quickly. */
export function dueCards(cards: Card[], now = Date.now()): Card[] {
  return cards
    .filter((c) => c.dueAt <= now)
    .sort((a, b) => a.dueAt - b.dueAt || b.lapses - a.lapses)
}

export interface DeckStats {
  total: number
  due: number
  /** Never reviewed. */
  fresh: number
  /** Reviewed, but interval still under 21 days. */
  learning: number
  /** Interval of 21 days or more — the usual "mature" threshold. */
  mature: number
  nextDueAt?: number
}

export function stats(cards: Card[], now = Date.now()): DeckStats {
  const upcoming = cards.filter((c) => c.dueAt > now).map((c) => c.dueAt)
  return {
    total: cards.length,
    due: cards.filter((c) => c.dueAt <= now).length,
    fresh: cards.filter((c) => c.reps === 0).length,
    learning: cards.filter((c) => c.reps > 0 && c.interval < 21).length,
    mature: cards.filter((c) => c.interval >= 21).length,
    nextDueAt: upcoming.length ? Math.min(...upcoming) : undefined,
  }
}

/** "in 3 days", "in 10 min" — the preview under each answer button. */
export function formatInterval(card: Card, grade: Grade): string {
  const next = review(card, grade)
  const ms = next.dueAt - Date.now()
  if (ms < 60 * 60 * 1000) return `${Math.max(1, Math.round(ms / 60000))} min`
  if (ms < DAY) return `${Math.round(ms / (60 * 60 * 1000))} h`
  const days = Math.round(ms / DAY)
  if (days < 30) return `${days} d`
  if (days < 365) return `${Math.round(days / 30)} mo`
  return `${(days / 365).toFixed(1)} yr`
}
