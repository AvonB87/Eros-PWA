import { useState } from 'react'
import { useHousehold } from '../contexts/HouseholdContext'
import PageTitle from '../components/PageTitle'
import AlertMessage from '../components/AlertMessage'

export default function PetPage() {
  const { pet, updatePet } = useHousehold()
  const [name, setName] = useState(pet.name ?? '')
  const [birthDate, setBirthDate] = useState(pet.birth_date ?? '')
  const [breed, setBreed] = useState(pet.breed ?? '')
  const [weight, setWeight] = useState(pet.weight ?? '')
  const [notes, setNotes] = useState(pet.notes ?? '')
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')
    setSaving(true)

    try {
      await updatePet({
        name: name.trim(),
        birth_date: birthDate || null,
        breed: breed.trim() || null,
        weight: weight === '' ? null : Number(String(weight).replace(',', '.')),
        notes: notes.trim() || null
      })
      setMessage('Erosov profil je posodobljen.')
    } catch (submitError) {
      setError(submitError.message || 'Profila ni bilo mogoče shraniti.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <section>
      <PageTitle title={pet.name} subtitle="Profil hišnega ljubljenčka" />

      <form className="card app-card p-3 p-md-4" onSubmit={handleSubmit}>
        <div className="pet-profile-hero">
          <div className="pet-profile-avatar">🐶</div>
          <div>
            <h2>{pet.name}</h2>
            <p>{pet.breed || 'Pasma ni vnesena'}</p>
          </div>
        </div>

        <AlertMessage>{error}</AlertMessage>
        <AlertMessage type="success">{message}</AlertMessage>

        <div className="mb-3">
          <label htmlFor="petProfileName" className="form-label">Ime</label>
          <input
            id="petProfileName"
            className="form-control"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="petBirthDate" className="form-label">Datum rojstva</label>
          <input
            id="petBirthDate"
            type="date"
            className="form-control"
            value={birthDate}
            onChange={(event) => setBirthDate(event.target.value)}
          />
        </div>

        <div className="row g-3">
          <div className="col-7">
            <label htmlFor="petBreed" className="form-label">Pasma</label>
            <input
              id="petBreed"
              className="form-control"
              value={breed}
              onChange={(event) => setBreed(event.target.value)}
            />
          </div>

          <div className="col-5">
            <label htmlFor="petWeight" className="form-label">Teža (kg)</label>
            <input
              id="petWeight"
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

        <div className="mt-3">
          <label htmlFor="petNotes" className="form-label">Opombe</label>
          <textarea
            id="petNotes"
            className="form-control"
            rows="5"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Alergije, veterinar, posebnosti ..."
          />
        </div>

        <button className="btn btn-primary btn-lg mt-4" disabled={saving}>
          {saving ? 'Shranjujem ...' : 'Shrani profil'}
        </button>
      </form>
    </section>
  )
}
