import { useEffect, useRef, useState } from 'react'
import type { AppState, Corpus } from '../types'
import type { ManifestEntry } from '../lib/corpus'
import { exportState, importState } from '../lib/storage'
import { countVerses } from '../lib/corpus'
import * as tts from '../lib/tts'
import * as asr from '../lib/asr'
import * as sync from '../lib/sync'

interface Props {
  state: AppState
  corpus: Corpus
  manifest: ManifestEntry[]
  update: (fn: (previous: AppState) => AppState) => void
  replaceState: (next: AppState) => void
}

export function SettingsPanel({ state, corpus, manifest, update, replaceState }: Props) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [message, setMessage] = useState('')
  const fileInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    tts.loadVoices().then((all) => setVoices(tts.norwegianVoices(all)))
  }, [])

  const { settings } = state

  return (
    <>
      <h2 className="section">Text</h2>
      <div className="field">
        <label htmlFor="corpus">Reading</label>
        <select
          id="corpus"
          value={settings.corpusId}
          onChange={(e) =>
            update((s) => ({ ...s, settings: { ...s.settings, corpusId: e.target.value, bookId: '', chapter: 1 } }))
          }
        >
          {manifest.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>
        <div className="help">
          {corpus.books.length} books · {countVerses(corpus)} verses
          {corpus.source && <> · {corpus.source}</>}
        </div>
      </div>

      <div className="notice">
        <strong>Adding your own text.</strong> Put a plain-text file together and run{' '}
        <code>npm run import -- yourtext.txt --id bom --title "Mormons bok"</code>. It writes a JSON file
        into <code>public/data/</code> and registers it here, so the text ships with the app. The expected
        layout is documented at the top of <code>scripts/import-text.mjs</code>. Add{' '}
        <code>--en english.txt</code> to attach a parallel English translation.
      </div>

      <h2 className="section">Speech</h2>
      {!tts.speechSupported() ? (
        <div className="notice warn">
          This browser has no speech synthesis, so read-aloud is unavailable. Chrome, Edge and Safari all
          support it.
        </div>
      ) : voices.length === 0 ? (
        <div className="notice warn">
          <strong>No Norwegian voice is installed.</strong> Speech will fall back to another language and
          sound wrong. Install one from your operating system:
          <br />
          macOS: System Settings → Accessibility → Spoken Content → System Voice → Manage Voices → Norwegian.
          <br />
          Windows: Settings → Time &amp; Language → Language → Add “Norsk bokmål” with the speech pack.
          <br />
          Android/iOS: install the Norwegian language pack under text-to-speech settings.
        </div>
      ) : (
        <div className="field">
          <label htmlFor="voice">Voice</label>
          <select
            id="voice"
            value={settings.voiceURI ?? ''}
            onChange={(e) =>
              update((s) => ({ ...s, settings: { ...s.settings, voiceURI: e.target.value || null } }))
            }
          >
            <option value="">Automatic</option>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name} ({v.lang}){v.localService ? '' : ' — online'}
              </option>
            ))}
          </select>
          <div className="help">{voices.length} Norwegian voice(s) available.</div>
          <div className="panel-actions">
            <button
              onClick={() =>
                tts.speak('God morgen. Jeg leser norsk hver dag.', {
                  rate: settings.rate,
                  voiceURI: settings.voiceURI,
                })
              }
            >
              🔊 Test voice
            </button>
          </div>
        </div>
      )}

      <div className="field">
        <label htmlFor="slow">Slow speed — {settings.slowRate.toFixed(2)}×</label>
        <input
          id="slow"
          type="range"
          min={0.3}
          max={0.9}
          step={0.05}
          value={settings.slowRate}
          onChange={(e) =>
            update((s) => ({ ...s, settings: { ...s.settings, slowRate: Number(e.target.value) } }))
          }
        />
        <div className="help">
          What the 🐢 button next to every play control uses. Drop it as low as you need — very slow speech
          separates the words, which is exactly what you want when a sentence runs together.
        </div>
        <div className="panel-actions">
          <button
            onClick={() =>
              tts.speak('Jeg snakker ikke så fort som du tror.', {
                rate: settings.slowRate,
                voiceURI: settings.voiceURI,
              })
            }
          >
            🐢 Test slow speed
          </button>
        </div>
      </div>

      <div className="field">
        <label>
          <input
            type="checkbox"
            checked={settings.speakOnTap}
            onChange={(e) =>
              update((s) => ({ ...s, settings: { ...s.settings, speakOnTap: e.target.checked } }))
            }
          />{' '}
          Speak a word when I tap it
        </label>
        <div className="help">Turn this off if you would rather see the definition silently.</div>
      </div>

      <h2 className="section">Speaking</h2>
      {asr.unavailableReason() ? (
        <div className="notice warn">
          <strong>Speaking practice cannot be scored in this browser.</strong> {asr.unavailableReason()} You
          can still do speaking drills — listen to the model sentence, say it back, and compare by ear.
        </div>
      ) : (
        <>
          <div className="field">
            <label>
              <input
                type="checkbox"
                checked={settings.micEnabled}
                onChange={(e) =>
                  update((s) => ({ ...s, settings: { ...s.settings, micEnabled: e.target.checked } }))
                }
              />{' '}
              Use the microphone to score my speaking
            </label>
            <div className="help">
              When this is on, speaking drills listen to you and mark each word against the target. Your
              browser will ask permission the first time.
            </div>
          </div>
          <div className="notice">
            <strong>Where your voice goes.</strong> This uses the browser's own speech recognition. In Chrome
            that means the audio is sent to Google's servers to be transcribed — it does not stay on your
            device, and it does not come to this app or to anyone running it. Leave this off if you would
            rather not send audio anywhere; every speaking drill still works, just without the automatic
            scoring.
          </div>
        </>
      )}

      <h2 className="section">Reading</h2>
      <div className="field">
        <label htmlFor="size">Text size — {settings.fontSize}px</label>
        <input
          id="size"
          type="range"
          min={15}
          max={28}
          value={settings.fontSize}
          onChange={(e) =>
            update((s) => ({ ...s, settings: { ...s.settings, fontSize: Number(e.target.value) } }))
          }
        />
      </div>
      <div className="field">
        <label htmlFor="theme">Theme</label>
        <select
          id="theme"
          value={settings.theme}
          onChange={(e) =>
            update((s) => ({
              ...s,
              settings: { ...s.settings, theme: e.target.value as AppState['settings']['theme'] },
            }))
          }
        >
          <option value="system">Follow system</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="goal">Daily goal — {settings.dailyGoal} drills</label>
        <input
          id="goal"
          type="range"
          min={5}
          max={60}
          step={5}
          value={settings.dailyGoal}
          onChange={(e) =>
            update((s) => ({ ...s, settings: { ...s.settings, dailyGoal: Number(e.target.value) } }))
          }
        />
        <div className="help">
          What the home screen asks of you each day. Twenty is a good daily habit; lower it rather than
          break the streak.
        </div>
      </div>

      <h2 className="section">Your data</h2>
      <div className="notice">
        Everything you save — words, notes, review history — lives in this browser. Export a backup before
        clearing site data or switching devices.
      </div>
      <div className="panel-actions">
        <button
          onClick={() => {
            const blob = new Blob([exportState(state)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = `norsk-lesar-${new Date().toISOString().slice(0, 10)}.json`
            a.click()
            URL.revokeObjectURL(url)
          }}
        >
          Export backup
        </button>
        <button onClick={() => fileInput.current?.click()}>Import backup</button>
        <input
          ref={fileInput}
          type="file"
          accept="application/json"
          hidden
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return
            try {
              replaceState(importState(await file.text()))
              setMessage('Backup restored.')
            } catch {
              setMessage('That file could not be read as a backup.')
            }
            e.target.value = ''
          }}
        />
      </div>

      {sync.syncConfigured() && (
        <>
          <h2 className="section">Sync</h2>
          <div className="notice">
            Supabase is configured. Push to save this browser’s study data to your project; pull to restore
            it on another device using the same device id.
          </div>
          <div className="panel-actions">
            <button
              onClick={async () => {
                const result = await sync.push(state)
                setMessage(result.ok ? 'Pushed to Supabase.' : `Push failed: ${result.error}`)
              }}
            >
              Push
            </button>
            <button
              onClick={async () => {
                const result = await sync.pull()
                if (result.ok && result.state) {
                  replaceState(result.state)
                  setMessage('Pulled from Supabase.')
                } else setMessage(`Pull failed: ${result.error}`)
              }}
            >
              Pull
            </button>
          </div>
        </>
      )}

      {message && (
        <div className="notice" style={{ marginTop: 16 }}>
          {message}
        </div>
      )}

      <h2 className="section">Keyboard</h2>
      <div className="notice">
        <kbd>space</kbd> play / stop the chapter (and show the answer while reviewing) ·{' '}
        <kbd>←</kbd> <kbd>→</kbd> change chapter · <kbd>esc</kbd> stop speaking ·{' '}
        <kbd>1</kbd>–<kbd>4</kbd> grade a flashcard
      </div>
    </>
  )
}
