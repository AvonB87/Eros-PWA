import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AlertMessage from '../components/AlertMessage'
import LoadingScreen from '../components/LoadingScreen'

export default function LoginPage() {
  const { user, loading, signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const destination = location.state?.from?.pathname || '/'

  useEffect(() => {
    if (user) {
      navigate(destination, { replace: true })
    }
  }, [user, navigate, destination])

  if (loading) return <LoadingScreen />
  if (user) return <Navigate to={destination} replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSubmitting(true)

    try {
      if (mode === 'register') {
        if (!displayName.trim()) {
          throw new Error('Vnesi svoje ime.')
        }
        if (password.length < 6) {
          throw new Error('Geslo naj ima vsaj 6 znakov.')
        }

        const data = await signUp(email.trim(), password, displayName)
        if (!data.session) {
          setMessage(
            'Račun je ustvarjen. Preveri e-pošto in potrdi registracijo, nato se prijavi.'
          )
          setMode('login')
        }
      } else {
        await signIn(email.trim(), password)
      }
    } catch (submitError) {
      setError(submitError.message || 'Prijava ni uspela.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-logo">🐶</div>
        <h1>Erosovi dogodki</h1>
        <p className="text-secondary">
          Skupni dnevnik za Erosa na iPhonu in Androidu.
        </p>

        <div className="btn-group w-100 mb-4" role="group">
          <button
            type="button"
            className={`btn ${mode === 'login' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setMode('login')}
          >
            Prijava
          </button>
          <button
            type="button"
            className={`btn ${mode === 'register' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setMode('register')}
          >
            Registracija
          </button>
        </div>

        <AlertMessage>{error}</AlertMessage>
        <AlertMessage type="success">{message}</AlertMessage>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div className="mb-3">
              <label htmlFor="displayName" className="form-label">Ime</label>
              <input
                id="displayName"
                className="form-control form-control-lg"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="email" className="form-label">E-pošta</label>
            <input
              id="email"
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="form-label">Geslo</label>
            <input
              id="password"
              type="password"
              className="form-control form-control-lg"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              minLength="6"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-100" disabled={submitting}>
            {submitting ? 'Počakaj ...' : mode === 'login' ? 'Prijavi se' : 'Ustvari račun'}
          </button>
        </form>
      </section>
    </main>
  )
}
