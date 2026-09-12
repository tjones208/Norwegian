import { useCallback, useEffect, useRef, useState } from 'react'
import type { AppState } from '../types'
import { load, save } from './storage'

/**
 * The single source of truth for everything we persist. Writes are debounced so
 * typing a note does not hit local storage on every keystroke, and flushed when
 * the page is hidden so a change made moments before closing the tab still
 * survives.
 */
export function useAppState() {
  const [state, setState] = useState<AppState>(() => load())
  const timer = useRef<number>()
  const latest = useRef(state)
  latest.current = state

  useEffect(() => {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => save(state), 300)
    return () => window.clearTimeout(timer.current)
  }, [state])

  useEffect(() => {
    const flush = () => {
      window.clearTimeout(timer.current)
      save(latest.current)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') flush()
    }
    // pagehide is the reliable one on mobile Safari, where beforeunload and
    // unload are not guaranteed to fire at all.
    window.addEventListener('pagehide', flush)
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.removeEventListener('pagehide', flush)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  const update = useCallback((fn: (previous: AppState) => AppState) => setState(fn), [])

  return { state, setState, update }
}
