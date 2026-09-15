import type { Lesson, Unit } from '../../types'
import { FOUNDATIONS } from './foundations'
import { VERBS } from './verbs'
import { SENTENCES } from './sentences'
import { DESCRIBING } from './describing'
import { EVERYDAY } from './everyday'

/**
 * The curriculum, in the order it should be worked through. Each unit builds on
 * the one before, so the daily plan simply walks this list.
 */
export const UNITS: Unit[] = [
  {
    id: 'lyder',
    title: 'Lyder og hilsener',
    titleEn: 'Sounds and greetings',
    goal: 'Say Norwegian words the way Norwegians say them, and hold a first exchange.',
  },
  {
    id: 'substantiv',
    title: 'Substantiv',
    titleEn: 'Nouns',
    goal: 'Name things: gender, "the", and more than one.',
  },
  {
    id: 'verb',
    title: 'Verb',
    titleEn: 'Verbs',
    goal: 'Say what happens, what happened, and what is going to happen.',
  },
  {
    id: 'setninger',
    title: 'Setninger',
    titleEn: 'Sentence structure',
    goal: 'Put words in Norwegian order — statements, questions and negatives.',
  },
  {
    id: 'beskrive',
    title: 'Å beskrive',
    titleEn: 'Describing things',
    goal: 'Use adjectives correctly and compare one thing with another.',
  },
  {
    id: 'pronomen',
    title: 'Pronomen',
    titleEn: 'Pronouns and possession',
    goal: 'Refer to people and say what belongs to whom.',
  },
  {
    id: 'tall',
    title: 'Tall og tid',
    titleEn: 'Numbers and time',
    goal: 'Handle prices, clock times, days and dates.',
  },
  {
    id: 'hverdag',
    title: 'Hverdagsnorsk',
    titleEn: 'Everyday Norwegian',
    goal: 'Get through a day: family, food, travel and small talk.',
  },
]

export const LESSONS: Lesson[] = [...FOUNDATIONS, ...VERBS, ...SENTENCES, ...DESCRIBING, ...EVERYDAY]

export function lessonById(id: string): Lesson | undefined {
  return LESSONS.find((l) => l.id === id)
}

export function lessonsInUnit(unitId: string): Lesson[] {
  return LESSONS.filter((l) => l.unitId === unitId)
}

/** Position in the curriculum, used to pick "the next lesson". */
export function lessonIndex(id: string): number {
  return LESSONS.findIndex((l) => l.id === id)
}
