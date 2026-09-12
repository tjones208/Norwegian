/**
 * Suffix rules that map an inflected Norwegian (bokmål) surface form back to a
 * dictionary form. Each rule turns a surface ending into one or more candidate
 * lemmas; the glossary decides which candidate actually exists, so the rules can
 * afford to over-generate.
 *
 * Order matters: longer, more specific endings are tried before short ones.
 */

export interface Rule {
  /** Surface ending to strip. */
  suffix: string
  /** Endings to try in its place. "" means just drop the suffix. */
  replace: string[]
  /** Human-readable analysis, shown under the gloss. */
  label: string
}

export const RULES: Rule[] = [
  // --- nouns -------------------------------------------------------------
  { suffix: 'ene', replace: ['e', ''], label: 'definite plural' },
  { suffix: 'ane', replace: [''], label: 'definite plural' },
  { suffix: 'ene', replace: ['el'], label: 'definite plural' },
  { suffix: 'er', replace: ['e', ''], label: 'plural' },
  { suffix: 'en', replace: ['e', ''], label: 'definite singular (masc.)' },
  { suffix: 'et', replace: ['e', ''], label: 'definite singular (neut.)' },
  { suffix: 'a', replace: ['e', ''], label: 'definite singular (fem.) or definite plural' },
  { suffix: 's', replace: [''], label: 'possessive' },

  // --- verbs -------------------------------------------------------------
  { suffix: 'ende', replace: ['e', ''], label: 'present participle' },
  { suffix: 'dde', replace: [''], label: 'past tense' },
  { suffix: 'ede', replace: ['e'], label: 'past tense' },
  { suffix: 'ete', replace: ['e'], label: 'past tense' },
  { suffix: 'te', replace: ['e'], label: 'past tense' },
  { suffix: 'de', replace: ['e'], label: 'past tense' },
  { suffix: 'et', replace: ['e'], label: 'past tense / perfect' },
  { suffix: 'dd', replace: [''], label: 'perfect participle' },
  { suffix: 'er', replace: ['e', ''], label: 'present tense' },
  { suffix: 'es', replace: ['e'], label: 'passive' },
  { suffix: 't', replace: ['e', ''], label: 'perfect participle / neuter' },

  // --- adjectives --------------------------------------------------------
  { suffix: 'este', replace: ['', 'e'], label: 'superlative' },
  { suffix: 'este', replace: ['ig'], label: 'superlative' },
  { suffix: 'est', replace: ['', 'e'], label: 'superlative' },
  { suffix: 'ere', replace: ['', 'e'], label: 'comparative' },
  { suffix: 'e', replace: [''], label: 'plural / definite' },
]

/** Candidate lemmas for a surface form, each with the analysis that produced it. */
export function candidates(surface: string): Array<{ lemma: string; label: string }> {
  const out: Array<{ lemma: string; label: string }> = []
  const seen = new Set<string>([surface])
  for (const rule of RULES) {
    if (!surface.endsWith(rule.suffix)) continue
    const stem = surface.slice(0, surface.length - rule.suffix.length)
    if (stem.length < 2) continue
    for (const rep of rule.replace) {
      const lemma = stem + rep
      if (lemma.length < 2 || seen.has(lemma)) continue
      seen.add(lemma)
      out.push({ lemma, label: rule.label })
      // Norwegian doubles a final consonant before a short-vowel ending
      // (kalle -> kalt, but also legge -> lagt). Undo that too.
      const doubled = /(.*?)([bdfgklmnprstv])\2$/.exec(stem)
      if (doubled && rep === '') {
        const undoubled = doubled[1] + doubled[2] + rep
        if (!seen.has(undoubled) && undoubled.length >= 2) {
          seen.add(undoubled)
          out.push({ lemma: undoubled, label: rule.label })
        }
      }
    }
  }
  return out
}

/**
 * A rough description of a word we cannot find, so an unknown word still tells
 * you something about its shape.
 */
export function describeShape(surface: string): string | undefined {
  if (/ene$/.test(surface)) return 'Looks like a definite plural noun (-ene).'
  if (/(en|et)$/.test(surface)) return 'Looks like a definite singular noun (-en / -et).'
  if (/er$/.test(surface)) return 'Looks like a present-tense verb or a plural noun (-er).'
  if (/(te|de|dde)$/.test(surface)) return 'Looks like a past-tense verb (-te / -de / -dde).'
  if (/ende$/.test(surface)) return 'Looks like a present participle (-ende).'
  if (/het$/.test(surface)) return 'Ends in -het, which forms abstract nouns (like English -ness).'
  if (/else$/.test(surface)) return 'Ends in -else, which forms nouns from verbs (like English -ment).'
  if (/lig$/.test(surface)) return 'Ends in -lig, a common adjective ending (like English -ly / -able).'
  if (/skap$/.test(surface)) return 'Ends in -skap, which forms nouns (like English -ship / -hood).'
  return undefined
}
