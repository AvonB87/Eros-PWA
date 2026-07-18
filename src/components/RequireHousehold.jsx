import { Navigate, Outlet } from 'react-router-dom'
import { useHousehold } from '../contexts/HouseholdContext'
import LoadingScreen from './LoadingScreen'

export default function RequireHousehold() {
  const { household, pet, loading } = useHousehold()

  if (loading) return <LoadingScreen text="Nalagam Erosove podatke ..." />

  if (!household || !pet) {
    return <Navigate to="/setup" replace />
  }

  return <Outlet />
}
