/**
 * Norwegian speech via the browser's built-in Web Speech API: no key, no
 * network, no cost. Quality depends on which voices the operating system has
 * installed, so `norwegianVoices()` is used to warn when none is present.
 */

export type BoundaryHandler = (charIndex: number, charLength: number) => void

const NORWEGIAN = /^(nb|nn|no)\b/i

let cachedVoices: SpeechSynthesisVoice[] = []

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

/**
 * Voices load asynchronously in most browsers, and Chrome sometimes fires
 * `voiceschanged` only after the first `getVoices()` call, so we poll briefly
 * rather than trusting a single read.
 */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!speechSupported()) return Promise.resolve([])
  const immediate = window.speechSynthesis.getVoices()
  if (immediate.length) {
    cachedVoices = immediate
    return Promise.resolve(immediate)
  }
  return new Promise((resolve) => {
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      clearInterval(poll)
      window.speechSynthesis.removeEventListener('voiceschanged', finish)
      cachedVoices = window.speechSynthesis.getVoices()
      resolve(cachedVoices)
    }
    window.speechSynthesis.addEventListener('voiceschanged', finish)
    const poll = setInterval(() => {
      if (window.speechSynthesis.getVoices().length) finish()
    }, 200)
    setTimeout(finish, 3000)
  })
}

export function norwegianVoices(voices: SpeechSynthesisVoice[] = cachedVoices): SpeechSynthesisVoice[] {
  return voices.filter((v) => NORWEGIAN.test(v.lang))
}

export function pickVoice(voiceURI: string | null): SpeechSynthesisVoice | undefined {
  if (voiceURI) {
    const exact = cachedVoices.find((v) => v.voiceURI === voiceURI)
    if (exact) return exact
  }
  const norsk = norwegianVoices()
  // Prefer a local voice: no network round-trip, and it keeps working offline.
  return norsk.find((v) => v.localService) ?? norsk[0]
}

export interface SpeakOptions {
  rate?: number
  voiceURI?: string | null
  onBoundary?: BoundaryHandler
  onStart?: () => void
  onEnd?: () => void
}

export function stop(): void {
  if (speechSupported()) window.speechSynthesis.cancel()
}

export function speak(text: string, options: SpeakOptions = {}): void {
  if (!speechSupported() || !text.trim()) return
  stop()

  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickVoice(options.voiceURI ?? null)
  if (voice) utterance.voice = voice
  // Set lang even without a matching voice: some engines pick a better default.
  utterance.lang = voice?.lang ?? 'nb-NO'
  utterance.rate = clampRate(options.rate ?? 1)

  if (options.onBoundary) {
    utterance.onboundary = (event) => {
      if (event.name && event.name !== 'word') return
      options.onBoundary?.(event.charIndex, event.charLength ?? 0)
    }
  }
  utterance.onstart = () => options.onStart?.()
  utterance.onend = () => options.onEnd?.()
  utterance.onerror = () => options.onEnd?.()

  // Chrome drops long utterances when the tab has been idle; resuming first is
  // a cheap, harmless guard against the queue being stuck in a paused state.
  window.speechSynthesis.resume()
  window.speechSynthesis.speak(utterance)
}

export function clampRate(rate: number): number {
  return Math.min(1.5, Math.max(0.5, rate))
}

/**
 * Pronunciation hints for the letters and clusters that trip up English
 * readers. Shown alongside a word so you learn to sound it out, not just
 * recognise it.
 */
const HINTS: Array<[RegExp, string]> = [
  [/^hv/i, 'hv- is pronounced like "v" — the h is silent.'],
  [/^skj|skj/i, 'skj is pronounced like English "sh".'],
  [/^sk[iey]|sk[øy]/i, 'sk before i, y, ø or ei sounds like English "sh".'],
  [/^kj|kj/i, 'kj is a soft "hy" sound, as in German "ich".'],
  [/^k[iey]/i, 'k before i, y or ei takes the soft "hy" sound.'],
  [/rs/i, 'rs blends into a "sh" sound in eastern Norwegian.'],
  [/^gj|gj/i, 'gj is pronounced like English "y".'],
  [/^g[iey]/i, 'g before i, y or ei is pronounced like "y".'],
  [/eg$|egn/i, 'eg often sounds like "ei" (as in "meg" = "mei").'],
  [/ld$|nd$/i, 'The d is usually silent at the end of -ld and -nd.'],
  [/å/i, 'å sounds like the "o" in "more".'],
  [/ø/i, 'ø sounds like the "i" in "bird".'],
  [/æ/i, 'æ sounds like the "a" in "cat".'],
]

export function pronunciationHints(word: string): string[] {
  const hints: string[] = []
  for (const [pattern, hint] of HINTS) {
    if (pattern.test(word) && !hints.includes(hint)) hints.push(hint)
    if (hints.length === 3) break
  }
  return hints
}
