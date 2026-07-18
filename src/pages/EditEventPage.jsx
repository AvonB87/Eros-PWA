import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getEventById, updateEvent } from '../services/eventService'
import { toLocalFormValues } from '../utils/dateUtils'
import EventForm from '../components/EventForm'
import PageTitle from '../components/PageTitle'
import AlertMessage from '../components/AlertMessage'

export default function EditEventPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    getEventById(eventId)
      .then((data) => {
        if (active) setEvent(data)
      })
      .catch((loadError) => {
        if (active) setError(loadError.message || 'Dogodka ni bilo mogoče naložiti.')
      })

    return () => {
      active = false
    }
  }, [eventId])

  async function handleSubmit(values) {
    await updateEvent(eventId, values)
    navigate('/', { replace: true })
  }

  if (error) {
    return (
      <section>
        <PageTitle title="Uredi dogodek" />
        <AlertMessage>{error}</AlertMessage>
      </section>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    )
  }

  const local = toLocalFormValues(event.event_time)

  return (
    <section>
      <PageTitle title="Uredi dogodek" />
      <EventForm
        submitLabel="Shrani spremembe"
        initialValues={{
          eventType: event.event_type,
          eventDate: local.eventDate,
          eventTime: local.eventTime,
          title: event.title ?? '',
          quantity: event.quantity ?? '',
          unit: event.unit ?? '',
          notes: event.notes ?? ''
        }}
        onSubmit={handleSubmit}
      />
    </section>
  )
}
