import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useHousehold } from '../contexts/HouseholdContext'
import AlertMessage from '../components/AlertMessage'
import LoadingScreen from '../components/LoadingScreen'

export default function SetupPage() {
  const {
    household,
    pet,
    loading,
    createHousehold,
    joinHousehold
  } = useHousehold()
  const navigate = useNavigate()

  const [tab, setTab] = useState('create')
  const [householdName, setHouseholdName] = useState('Erosova družina')
  const [petName, setPetName] = useState('Eros')
  const [birthDate, setBirthDate] = useState('2024-08-18')
  const [breed, setBreed] = useState('Maltežan')
  const [weight, setWeight] = useState('2.5')
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  if (loading) return <LoadingScreen />
  if (household && pet) return <Navigate to="/" replace />

  async function handleCreate(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      await createHousehold({
        householdName,
        petName,
        birthDate,
        breed,
        weight
      })
      navigate('/', { replace: true })
    } catch (submitError) {
      setError(submitError.message || 'Družine ni bilo mogoče ustvariti.')
      setSaving(false)
    }
  }

  async function handleJoin(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      await joinHousehold(joinCode)
      navigate('/', { replace: true })
    } catch (submitError) {
      setError(
        submitError.message === 'Invalid join code'
          ? 'Koda za pridružitev ni veljavna.'
          : submitError.message || 'Družini se ni bilo mogoče pridružiti.'
      )
      setSaving(false)
    }
  }

  return (
    <main className="setup-page container py-4">
      <section className="mx-auto setup-card">
        <div className="text-center mb-4">
          <div className="auth-logo">🐾</div>
          <h1 className="h3">Prva nastavitev</h1>
          <p className="text-secondary">
            Prvi uporabnik ustvari Erosovo družino, drugi pa se ji pridruži s kodo.
          </p>
        </div>

        <div className="btn-group w-100 mb-4">
          <button
            type="button"
            className={`btn ${tab === 'create' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => {
              setTab('create')
              setError('')
            }}
          >
            Ustvari
          </button>
          <button
            type="button"
            className={`btn ${tab === 'join' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => {
              setTab('join')
              setError('')
            }}
          >
            Pridruži se
          </button>
        </div>

        <AlertMessage>{error}</AlertMessage>

        {tab === 'create' ? (
          <form className="card app-card p-3" onSubmit={handleCreate}>
            <div className="mb-3">
              <label htmlFor="householdName" className="form-label">Ime družine</label>
              <input
                id="householdName"
                className="form-control"
                value={householdName}
                onChange={(event) => setHouseholdName(event.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="petName" className="form-label">Ime psa</label>
              <input
                id="petName"
                className="form-control"
                value={petName}
                onChange={(event) => setPetName(event.target.value)}
                required
              />
            </div>

            <div className="row g-3">
              <div className="col-12">
                <label htmlFor="birthDate" className="form-label">Datum rojstva</label>
                <input
                  id="birthDate"
                  type="date"
                  className="form-control"
                  value={birthDate}
                  onChange={(event) => setBirthDate(event.target.value)}
                />
              </div>

              <div className="col-7">
                <label htmlFor="breed" className="form-label">Pasma</label>
                <input
                  id="breed"
                  className="form-control"
                  value={breed}
                  onChange={(event) => setBreed(event.target.value)}
                />
              </div>

              <div className="col-5">
                <label htmlFor="weight" className="form-label">Teža (kg)</label>
                <input
                  id="weight"
                  type="number"
                  inputMode="decimal"
                  step="0.01"
                  min="0"
                  className="form-control"
                  value={weight}
                  onChange={(event) => setWeight(event.target.value)}
                />
              </div>
            </div>

            <button className="btn btn-primary btn-lg mt-4" disabled={saving}>
              {saving ? 'Ustvarjam ...' : 'Ustvari Erosovo družino'}
            </button>
          </form>
        ) : (
          <form className="card app-card p-3" onSubmit={handleJoin}>
            <label htmlFor="joinCode" className="form-label">
              Koda za pridružitev
            </label>
            <input
              id="joinCode"
              className="form-control form-control-lg text-uppercase text-center join-code-input"
              value={joinCode}
              maxLength="8"
              placeholder="AB12CD34"
              onChange={(event) => setJoinCode(event.target.value)}
              required
            />
            <p className="small text-secondary mt-2">
              Kodo najde prvi uporabnik v Nastavitvah.
            </p>

            <button className="btn btn-primary btn-lg mt-3" disabled={saving}>
              {saving ? 'Pridružujem ...' : 'Pridruži se družini'}
            </button>
          </form>
        )}
      </section>
    </main>
  )
}
