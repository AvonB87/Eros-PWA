import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import ProtectedRoute from './components/ProtectedRoute'
import RequireHousehold from './components/RequireHousehold'
import LoginPage from './pages/LoginPage'
import SetupPage from './pages/SetupPage'
import TodayPage from './pages/TodayPage'
import AddEventPage from './pages/AddEventPage'
import EditEventPage from './pages/EditEventPage'
import CalendarPage from './pages/CalendarPage'
import PetPage from './pages/PetPage'
import SettingsPage from './pages/SettingsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/setup" element={<SetupPage />} />

        <Route element={<RequireHousehold />}>
          <Route element={<AppLayout />}>
            <Route index element={<TodayPage />} />
            <Route path="/events/new" element={<AddEventPage />} />
            <Route path="/events/:eventId/edit" element={<EditEventPage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/eros" element={<PetPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="/home" element={<Navigate to="/" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
