import { useHousehold } from '../contexts/HouseholdContext'

export default function AppHeader() {
  const { pet } = useHousehold()

  return (
    <header className="app-header">
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div>
          <div className="app-brand">Eros</div>
          <div className="app-subtitle">Dnevni dogodki in skrb</div>
        </div>
        <div className="pet-avatar" aria-label={pet?.name ?? 'Eros'}>
          🐶
        </div>
      </div>
    </header>
  )
}
