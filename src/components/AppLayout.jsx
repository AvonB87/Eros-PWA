import { Outlet } from 'react-router-dom'
import BottomNavigation from './BottomNavigation'
import AppHeader from './AppHeader'

export default function AppLayout() {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-content container-fluid">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}
