import { useInstall } from '../lib/install'

/**
 * Explains how to put the app on the home screen, in the terms of whichever
 * device is asking. Renders nothing once the app is already installed.
 */
export function InstallCard({ compact = false }: { compact?: boolean }) {
  const { canPrompt, installed, platform, promptInstall } = useInstall()

  if (installed) {
    return compact ? null : (
      <div className="notice">
        <strong>Installed.</strong> You are running Norsk Lærer from your home screen. It works without a
        connection — lessons, drills and the text are all stored on the device.
      </div>
    )
  }

  if (canPrompt) {
    return (
      <div className="install-card">
        <span className="plan-icon" aria-hidden="true">
          📲
        </span>
        <span className="plan-text">
          <strong>Install on this device</strong>
          <em>Opens full screen, works offline, and keeps your progress.</em>
        </span>
        <button className="primary" onClick={promptInstall}>
          Install
        </button>
      </div>
    )
  }

  if (compact) return null

  return (
    <div className="notice">
      <strong>Put it on your home screen.</strong>
      {platform === 'ios' ? (
        <>
          {' '}
          In Safari, tap the Share button (the square with an arrow), scroll down and choose{' '}
          <strong>Add to Home Screen</strong>. It has to be Safari — Chrome on iOS cannot install apps.
        </>
      ) : platform === 'android' ? (
        <>
          {' '}
          In Chrome, open the ⋮ menu and choose <strong>Install app</strong> or{' '}
          <strong>Add to Home screen</strong>.
        </>
      ) : (
        <>
          {' '}
          In Chrome or Edge, click the install icon at the right-hand end of the address bar, or open the ⋮
          menu and choose <strong>Install</strong>.
        </>
      )}{' '}
      Once installed it runs full screen and works with no connection at all.
    </div>
  )
}
