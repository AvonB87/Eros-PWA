import { NavLink } from 'react-router-dom'

const items = [
  { to: '/', label: 'Danes', icon: 'bi-house-heart', end: true },
  { to: '/calendar', label: 'Koledar', icon: 'bi-calendar3' },
  { to: '/events/new', label: 'Dodaj', icon: 'bi-plus-lg', primary: true },
  { to: '/eros', label: 'Eros', icon: 'bi-heart' },
  { to: '/settings', label: 'Nastavitve', icon: 'bi-gear' }
]

export default function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="Glavna navigacija">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          className={({ isActive }) =>
            [
              'bottom-nav-item',
              item.primary ? 'bottom-nav-primary' : '',
              isActive ? 'active' : ''
            ]
              .filter(Boolean)
              .join(' ')
          }
        >
          <i className={`bi ${item.icon}`} aria-hidden="true" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
