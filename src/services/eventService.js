import { supabase } from '../lib/supabase'

const EVENT_SELECT = `
  id,
  pet_id,
  created_by,
  event_type,
  event_time,
  title,
  quantity,
  unit,
  notes,
  created_at,
  updated_at,
  creator:profiles!events_created_by_fkey(display_name)
`

export async function getEventsForRange(petId, start, end) {
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('pet_id', petId)
    .gte('event_time', start)
    .lt('event_time', end)
    .order('event_time', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function getRecentEvents(petId, limit = 200) {
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('pet_id', petId)
    .order('event_time', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}

export async function getEventById(eventId) {
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_SELECT)
    .eq('id', eventId)
    .single()

  if (error) throw error
  return data
}

export async function createEvent(payload) {
  const { data, error } = await supabase
    .from('events')
    .insert(payload)
    .select(EVENT_SELECT)
    .single()

  if (error) throw error
  return data
}

export async function updateEvent(eventId, payload) {
  const { data, error } = await supabase
    .from('events')
    .update(payload)
    .eq('id', eventId)
    .select(EVENT_SELECT)
    .single()

  if (error) throw error
  return data
}

export async function deleteEvent(eventId) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', eventId)

  if (error) throw error
}
