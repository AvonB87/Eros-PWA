import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <main className="container py-5 text-center">
      <div className="display-1">🐾</div>
      <h1>Stran ne obstaja</h1>
      <Link to="/" className="btn btn-primary mt-3">
        Nazaj na začetek
      </Link>
    </main>
  )
}
