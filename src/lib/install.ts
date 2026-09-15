import { useEffect, useState } from 'react'

/**
 * Home-screen installation. Chrome and Edge fire `beforeinstallprompt`, which we
 * keep hold of so the app can offer its own button at a sensible moment. Safari
 * fires nothing at all — on iOS the only route is Share → Add to Home Screen, so
 * the UI has to say so rather than showing a button that cannot work.
 */

interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type Platform = 'ios' | 'android' | 'desktop'

export function platform(): Platform {
  if (typeof navigator === 'undefined') return 'desktop'
  const ua = navigator.userAgent
  // iPadOS 13+ reports as a Mac, so check for a touch screen as well.
  const iOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)
  if (iOS) return 'ios'
  if (/Android/.test(ua)) return 'android'
  return 'desktop'
}

/** True when the app is already running from the home screen. */
export function isStandalone(): boolean {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // Safari's own flag, which predates the standard media query.
    (navigator as { standalone?: boolean }).standalone === true
  )
}

export interface Install {
  /** A real install prompt is available right now. */
  canPrompt: boolean
  installed: boolean
  platform: Platform
  /** Shows the browser's install dialog. Resolves to whether it was accepted. */
  promptInstall: () => Promise<boolean>
}

export function useInstall(): Install {
  const [event, setEvent] = useState<InstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(isStandalone)

  useEffect(() => {
    const onPrompt = (e: Event) => {
      // Keep the event so the app can offer installation on its own terms.
      e.preventDefault()
      setEvent(e as InstallPromptEvent)
    }
    const onInstalled = () => {
      setInstalled(true)
      setEvent(null)
    }
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)

    const media = window.matchMedia('(display-mode: standalone)')
    const onDisplay = () => setInstalled(isStandalone())
    media.addEventListener('change', onDisplay)

    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      media.removeEventListener('change', onDisplay)
    }
  }, [])

  return {
    canPrompt: Boolean(event) && !installed,
    installed,
    platform: platform(),
    promptInstall: async () => {
      if (!event) return false
      await event.prompt()
      const { outcome } = await event.userChoice
      if (outcome === 'accepted') setInstalled(true)
      setEvent(null)
      return outcome === 'accepted'
    },
  }
}
