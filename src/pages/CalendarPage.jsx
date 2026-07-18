import { useCallback, useEffect, useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { useHousehold } from '../contexts/HouseholdContext'
import { getRecentEvents } from '../services/eventService'
import { formatShortDate } from '../utils/dateUtils'
import { getEventType } from '../constants/eventTypes'
import PageTitle from '../components/PageTitle'
import AlertMessage from '../components/AlertMessage'

export default function CalendarPage() {
  const { pet } = useHousehold()
  const [events, setEvents] = useState([])
  const [filterDate, setFilterDate] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const loadEvents = useCallback(async () => {
    try {
      const data = await getRecentEvents(pet.id, 300)
      setEvents(data)
    } catch (loadError) {
      setError(loadError.message || 'Zgodovine ni bilo mogoče naložiti.')
    } finally {
      setLoading(false)
    }
  }, [pet.id])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const grouped = useMemo(() => {
    const visible = filterDate
      ? events.filter((event) => dayjs(event.event_time).format('YYYY-MM-DD') === filterDate)
      : events

    return visible.reduce((groups, event) => {
      const key = dayjs(event.event_time).format('YYYY-MM-DD')
      if (!groups[key]) groups[key] = []
      groups[key].push(event)
      return groups
    }, {})
  }, [events, filterDate])

  return (
    <section>
      <PageTitle
        title="Koledar"
        subtitle="Zgodovina Erosovih dogodkov"
      />

      <AlertMessage>{error}</AlertMessage>

      <div className="card app-card p-3 mb-3">
        <label htmlFor="calendarDate" className="form-label">Prikaži določen dan</label>
        <div className="d-flex gap-2">
          <input
            id="calendarDate"
            type="date"
            className="form-control"
            value={filterDate}
            onChange={(event) => setFilterDate(event.target.value)}
          />
          {filterDate && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setFilterDate('')}
            >
              Počisti
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📅</div>
          <h2>Ni dogodkov</h2>
          <p>Za izbrani dan ni shranjenih zapisov.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dayEvents]) => (
          <div key={date} className="calendar-day">
            <h2>{formatShortDate(date)}</h2>
            <div className="card app-card overflow-hidden">
              {dayEvents.map((event) => {
                const type = getEventType(event.event_type)
                return (
                  <div key={event.id} className="calendar-event">
                    <span className="calendar-event-icon">{type.icon}</span>
                    <div className="flex-grow-1">
                      <strong>{event.title || type.label}</strong>
                      {event.notes && <div className="small text-secondary">{event.notes}</div>}
                    </div>
                    <time>{dayjs(event.event_time).format('HH:mm')}</time>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}
    </section>
  )
}
