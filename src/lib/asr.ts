/**
 * Speech recognition for speaking practice, via the browser's Web Speech API.
 *
 * Availability is narrow — Chrome and Edge, and in Chrome the audio is sent to
 * Google's servers to be transcribed. Nothing here runs until the learner turns
 * the microphone on in Settings, and `available()` lets the UI explain itself
 * rather than failing silently in a browser that cannot do this.
 */

interface RecognitionAlternative {
  transcript: string
  confidence: number
}
interface RecognitionResult {
  0: RecognitionAlternative
  isFinal: boolean
  length: number
}
interface RecognitionEvent extends Event {
  resultIndex: number
  results: { length: number; [index: number]: RecognitionResult }
}
interface RecognitionErrorEvent extends Event {
  error: string
}
interface Recognition extends EventTarget {
  lang: string
  continuous: boolean
  interimResults: boolean
  maxAlternatives: number
  start(): void
  stop(): void
  abort(): void
  onresult: ((event: RecognitionEvent) => void) | null
  onerror: ((event: RecognitionErrorEvent) => void) | null
  onend: (() => void) | null
  onstart: (() => void) | null
}
type RecognitionConstructor = new () => Recognition

function constructor(): RecognitionConstructor | undefined {
  const w = window as unknown as {
    SpeechRecognition?: RecognitionConstructor
    webkitSpeechRecognition?: RecognitionConstructor
  }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition
}

export function available(): boolean {
  return typeof window !== 'undefined' && Boolean(constructor())
}

/** Human-readable reason the microphone cannot be used, if it cannot. */
export function unavailableReason(): string | null {
  if (typeof window === 'undefined') return 'Speech recognition is not available here.'
  if (!window.isSecureContext) return 'Speech recognition needs a secure (https) connection.'
  if (!constructor())
    return 'This browser has no speech recognition. Chrome and Edge support it; Firefox and Safari do not.'
  return null
}

export interface ListenHandlers {
  /** Fires repeatedly with the best guess so far. */
  onPartial?: (transcript: string) => void
  onResult: (transcript: string) => void
  onError: (message: string) => void
  onEnd?: () => void
}

export interface Session {
  stop: () => void
}

const MESSAGES: Record<string, string> = {
  'not-allowed': 'Microphone access was blocked. Allow it in your browser’s site settings and try again.',
  'service-not-allowed': 'Microphone access was blocked by the browser or the operating system.',
  'no-speech': 'Nothing was heard. Try again, a little closer to the microphone.',
  'audio-capture': 'No microphone was found.',
  network: 'The speech service could not be reached.',
  aborted: '',
}

/**
 * Listens for one utterance in Norwegian and reports the transcript. Returns a
 * handle so the caller can stop early.
 */
export function listen(handlers: ListenHandlers): Session | null {
  const Ctor = constructor()
  if (!Ctor) {
    handlers.onError(unavailableReason() ?? 'Speech recognition is unavailable.')
    return null
  }

  const recognition = new Ctor()
  recognition.lang = 'nb-NO'
  recognition.continuous = false
  recognition.interimResults = true
  recognition.maxAlternatives = 3

  let finished = false

  recognition.onresult = (event) => {
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i]
      const transcript = result[0].transcript
      if (result.isFinal) {
        finished = true
        handlers.onResult(transcript.trim())
        return
      }
      interim += transcript
    }
    if (interim) handlers.onPartial?.(interim.trim())
  }

  recognition.onerror = (event) => {
    const message = MESSAGES[event.error] ?? `Speech recognition failed (${event.error}).`
    if (message) handlers.onError(message)
  }

  recognition.onend = () => {
    // Chrome ends the session silently when it hears nothing at all.
    if (!finished) handlers.onError(MESSAGES['no-speech'])
    handlers.onEnd?.()
  }

  try {
    recognition.start()
  } catch {
    handlers.onError('Could not start listening. Is another tab already using the microphone?')
    return null
  }

  return { stop: () => recognition.abort() }
}
