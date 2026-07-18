import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import dayjs from 'dayjs'
import { supabase } from '../lib/supabase'
import { useHousehold } from '../contexts/HouseholdContext'
import { deleteEvent, getEventsForRange } from '../services/eventService'
import { dayRange, formatFullDate } from '../utils/dateUtils'
import EventCard from '../components/EventCard'
import PageTitle from '../components/PageTitle'
import AlertMessage from '../components/AlertMessage'

export default function TodayPage() {
  const { pet } = useHousehold()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  const loadEvents = useCallback(async () => {
    if (!pet?.id) return

    setError('')
    try {
      const { start, end } = dayRange()
      const data = await getEventsForRange(pet.id, start, end)
      setEvents(data)
    } catch (loadError) {
      setError(loadError.message || 'Dogodkov ni bilo mogoče naložiti.')
    } finally {
      setLoading(false)
    }
  }, [pet?.id])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  useEffect(() => {
    if (!pet?.id) return undefined

    const channel = supabase
      .channel(`events-${pet.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events',
          filter: `pet_id=eq.${pet.id}`
        },
        () => loadEvents()
      )
      .subscribe((status, subscriptionError) => {
        if (status === 'CHANNEL_ERROR') {
          console.error('Realtime napaka:', subscriptionError)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [pet?.id, loadEvents])

  async function handleDelete(event) {
    const confirmed = window.confirm(`Izbrišem dogodek »${event.title}«?`)
    if (!confirmed) return

    setDeletingId(event.id)
    setError('')

    try {
      await deleteEvent(event.id)
      setEvents((current) => current.filter((item) => item.id !== event.id))
    } catch (deleteError) {
      setError(deleteError.message || 'Dogodka ni bilo mogoče izbrisati.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section>
      <PageTitle
        title="Danes"
        subtitle={formatFullDate(dayjs())}
        action={
          <Link to="/events/new" className="btn btn-primary rounded-pill">
            <i className="bi bi-plus-lg me-1" />
            Dodaj
          </Link>
        }
      />

      <AlertMessage>{error}</AlertMessage>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" />
        </div>
      ) : events.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🐾</div>
          <h2>Danes še ni dogodkov</h2>
          <p>Dodaj prvi obrok, sprehod, kakanje ali drug dogodek.</p>
          <Link to="/events/new" className="btn btn-primary">
            Dodaj prvi dogodek
          </Link>
        </div>
      ) : (
        <div className="event-list">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              deleting={deletingId === event.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  )
}
