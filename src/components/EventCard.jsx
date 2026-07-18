import { Link } from 'react-router-dom'
import { getEventType } from '../constants/eventTypes'
import { formatEventTime } from '../utils/dateUtils'

export default function EventCard({ event, onDelete, deleting = false }) {
  const type = getEventType(event.event_type)
  const creatorName = event.creator?.display_name ?? 'Neznan uporabnik'

  return (
    <article className="event-card">
      <div className="event-icon" aria-hidden="true">{type.icon}</div>

      <div className="event-body">
        <div className="d-flex align-items-start justify-content-between gap-2">
          <div>
            <h2 className="event-title">{event.title || type.label}</h2>
            <div className="event-meta">
              {formatEventTime(event.event_time)} · dodal/a {creatorName}
            </div>
          </div>

          <div className="dropdown">
            <button
              className="btn btn-sm btn-light border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-label="Možnosti dogodka"
            >
              <i className="bi bi-three-dots-vertical" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Link className="dropdown-item" to={`/events/${event.id}/edit`}>
                  <i className="bi bi-pencil me-2" />
                  Uredi
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="dropdown-item text-danger"
                  disabled={deleting}
                  onClick={() => onDelete(event)}
                >
                  <i className="bi bi-trash me-2" />
                  Izbriši
                </button>
              </li>
            </ul>
          </div>
        </div>

        {event.quantity != null && (
          <div className="event-detail">
            {event.quantity} {event.unit || ''}
          </div>
        )}

        {event.notes && <p className="event-notes">{event.notes}</p>}
      </div>
    </article>
  )
}
