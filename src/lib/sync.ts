import type { AppState } from '../types'

/**
 * Optional Supabase sync. The app is local-first: everything works with browser
 * storage alone. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see
 * .env.example and supabase/schema.sql) to also mirror your deck, notes and
 * progress to a row keyed by device id, so you can pick up on another device.
 *
 * The client is imported lazily so the dependency stays optional — if
 * @supabase/supabase-js is not installed, sync just reports as unavailable.
 */

const URL_ = import.meta.env.VITE_SUPABASE_URL as string | undefined
const KEY_ = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined
const DEVICE_KEY = 'norsk-lesar:device'

export function syncConfigured(): boolean {
  return Boolean(URL_ && KEY_)
}

export function deviceId(): string {
  let id = localStorage.getItem(DEVICE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(DEVICE_KEY, id)
  }
  return id
}

type Client = { from: (t: string) => any }
let clientPromise: Promise<Client | null> | null = null

async function client(): Promise<Client | null> {
  if (!syncConfigured()) return null
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js')
      .then((m) => m.createClient(URL_!, KEY_!) as unknown as Client)
      .catch(() => null)
  }
  return clientPromise
}

export async function push(state: AppState): Promise<{ ok: boolean; error?: string }> {
  const db = await client()
  if (!db) return { ok: false, error: 'Sync is not configured.' }
  const { error } = await db
    .from('study_state')
    .upsert({ device_id: deviceId(), state, updated_at: new Date().toISOString() })
  return error ? { ok: false, error: error.message } : { ok: true }
}

export async function pull(): Promise<{ ok: boolean; state?: AppState; error?: string }> {
  const db = await client()
  if (!db) return { ok: false, error: 'Sync is not configured.' }
  const { data, error } = await db
    .from('study_state')
    .select('state')
    .eq('device_id', deviceId())
    .maybeSingle()
  if (error) return { ok: false, error: error.message }
  if (!data) return { ok: false, error: 'Nothing saved for this device yet.' }
  return { ok: true, state: data.state as AppState }
}
