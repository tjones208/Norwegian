import * as tts from '../lib/tts'

interface Props {
  text: string
  rate: number
  slowRate: number
  voiceURI: string | null
  /** Text on the normal-speed button. Omit for an icon-only pair. */
  label?: string
  /** Style the normal-speed button as the primary action. */
  primary?: boolean
  /** Larger touch targets, for the main control on a listening drill. */
  big?: boolean
}

/**
 * A play control and the slow replay that belongs beside it. Every place the
 * app speaks a sentence uses this, so "say that again, slower" is always one
 * press away rather than a trip to Settings.
 */
export function Speak({ text, rate, slowRate, voiceURI, label, primary, big }: Props) {
  if (!text) return null
  const speak = (at: number) => tts.speak(text, { rate: at, voiceURI })

  return (
    <span className={`speak-pair ${big ? 'big' : ''}`}>
      <button className={primary ? 'primary' : ''} onClick={() => speak(rate)} title="Read aloud">
        🔊{label ? ` ${label}` : ''}
      </button>
      <button
        className="slow"
        onClick={() => speak(slowRate)}
        title={`Read aloud slowly (${slowRate.toFixed(2)}×)`}
        aria-label="Read aloud slowly"
      >
        🐢
      </button>
    </span>
  )
}
