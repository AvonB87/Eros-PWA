import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useHousehold } from '../contexts/HouseholdContext'
import { createEvent } from '../services/eventService'
import EventForm from '../components/EventForm'
import PageTitle from '../components/PageTitle'

export default function AddEventPage() {
  const { user } = useAuth()
  const { pet } = useHousehold()
  const navigate = useNavigate()

  async function handleSubmit(values) {
    await createEvent({
      ...values,
      pet_id: pet.id,
      created_by: user.id
    })
    navigate('/', { replace: true })
  }

  return (
    <section>
      <PageTitle
        title="Dodaj dogodek"
        subtitle={`Nov zapis za ${pet.name}`}
      />
      <EventForm onSubmit={handleSubmit} />
    </section>
  )
}
