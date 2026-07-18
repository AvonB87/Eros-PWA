import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useHousehold } from '../contexts/HouseholdContext'
import PageTitle from '../components/PageTitle'
import AlertMessage from '../components/AlertMessage'

function isIos() {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

function isStandalone() {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone
}

export default function SettingsPage() {
  const { user, profile, updateDisplayName, signOut } = useAuth()
  const { household, membership } = useHousehold()
  const [displayName, setDisplayName] = useState(profile?.display_name ?? '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [installPrompt, setInstallPrompt] = useState(null)
  const [installed, setInstalled] = useState(isStandalone())

  useEffect(() => {
    function handleBeforeInstall(event) {
      event.preventDefault()
      setInstallPrompt(event)
    }

    function handleInstalled() {
      setInstalled(true)
      setInstallPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function saveProfile(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    try {
      await updateDisplayName(displayName)
      setMessage('Ime je shranjeno.')
    } catch (saveError) {
      setError(saveError.message || 'Imena ni bilo mogoče shraniti.')
    }
  }

  async function installApp() {
    if (!installPrompt) return
    await installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  async function copyJoinCode() {
    try {
      await navigator.clipboard.writeText(household.join_code)
      setMessage('Koda je kopirana.')
    } catch {
      setError('Kode ni bilo mogoče samodejno kopirati.')
    }
  }

  return (
    <section>
      <PageTitle title="Nastavitve" subtitle={user.email} />

      <AlertMessage>{error}</AlertMessage>
      <AlertMessage type="success">{message}</AlertMessage>

      <form className="card app-card p-3 mb-3" onSubmit={saveProfile}>
        <h2 className="h5">Uporabnik</h2>
        <label htmlFor="settingsName" className="form-label">Prikazno ime</label>
        <div className="d-flex gap-2">
          <input
            id="settingsName"
            className="form-control"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            required
          />
          <button className="btn btn-primary">Shrani</button>
        </div>
      </form>

      <div className="card app-card p-3 mb-3">
        <h2 className="h5">Erosova družina</h2>
        <p className="mb-1"><strong>{household.name}</strong></p>
        <p className="small text-secondary">
          Tvoja vloga: {membership?.role === 'owner' ? 'lastnik' : 'član'}
        </p>

        <label className="form-label">Koda za partnerko</label>
        <div className="join-code-box">
          <code>{household.join_code}</code>
          <button type="button" className="btn btn-outline-primary" onClick={copyJoinCode}>
            Kopiraj
          </button>
        </div>
        <p className="small text-secondary mt-2 mb-0">
          Partnerka se registrira, izbere »Pridruži se« in vnese to kodo.
        </p>
      </div>

      <div className="card app-card p-3 mb-3">
        <h2 className="h5">Namestitev aplikacije</h2>

        {installed ? (
          <p className="mb-0">Aplikacija je odprta kot nameščena PWA.</p>
        ) : installPrompt ? (
          <button type="button" className="btn btn-primary" onClick={installApp}>
            <i className="bi bi-download me-2" />
            Namesti aplikacijo
          </button>
        ) : isIos() ? (
          <ol className="small mb-0 ps-3">
            <li>Odpri aplikacijo v Safariju.</li>
            <li>Pritisni gumb za deljenje.</li>
            <li>Izberi »Dodaj na začetni zaslon«.</li>
          </ol>
        ) : (
          <p className="small mb-0">
            V meniju brskalnika izberi »Namesti aplikacijo« ali »Dodaj na začetni zaslon«.
          </p>
        )}
      </div>

      <button type="button" className="btn btn-outline-danger w-100" onClick={signOut}>
        <i className="bi bi-box-arrow-right me-2" />
        Odjava
      </button>
    </section>
  )
}
