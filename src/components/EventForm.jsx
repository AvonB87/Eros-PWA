import { useMemo, useState } from 'react'
import { EVENT_TYPES, getEventType } from '../constants/eventTypes'
import {
  combineLocalDateAndTime,
  currentTimeInputValue,
  todayInputValue
} from '../utils/dateUtils'
import AlertMessage from './AlertMessage'

export default function EventForm({
  initialValues,
  submitLabel = 'Shrani dogodek',
  onSubmit
}) {
  const [form, setForm] = useState({
    eventType: initialValues?.eventType ?? 'poop',
    eventDate: initialValues?.eventDate ?? todayInputValue(),
    eventTime: initialValues?.eventTime ?? currentTimeInputValue(),
    title: initialValues?.title ?? '',
    quantity: initialValues?.quantity ?? '',
    unit: initialValues?.unit ?? '',
    notes: initialValues?.notes ?? ''
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const selectedType = useMemo(
    () => getEventType(form.eventType),
    [form.eventType]
  )

  const showQuantity = ['meal', 'treat', 'medicine', 'deworming', 'weight'].includes(
    form.eventType
  )

  const unitSuggestions = {
    meal: ['g'],
    treat: ['kos', 'g'],
    medicine: ['tableta', 'ml', 'kapljica'],
    deworming: ['tableta'],
    weight: ['kg']
  }

  function updateField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function changeType(value) {
    const nextType = getEventType(value)
    const defaultUnit = unitSuggestions[value]?.[0] ?? ''

    setForm((current) => ({
      ...current,
      eventType: value,
      title:
        !current.title || current.title === selectedType.defaultTitle
          ? nextType.defaultTitle
          : current.title,
      unit: value === 'weight' ? 'kg' : defaultUnit
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSaving(true)

    try {
      if (!form.eventDate || !form.eventTime) {
        throw new Error('Izberi datum in čas dogodka.')
      }

      const title = form.title.trim() || selectedType.defaultTitle
      const parsedQuantity =
        form.quantity === '' || form.quantity == null
          ? null
          : Number(String(form.quantity).replace(',', '.'))

      if (parsedQuantity != null && Number.isNaN(parsedQuantity)) {
        throw new Error('Količina mora biti število.')
      }

      await onSubmit({
        event_type: form.eventType,
        event_time: combineLocalDateAndTime(form.eventDate, form.eventTime),
        title,
        quantity: parsedQuantity,
        unit: form.unit.trim() || null,
        notes: form.notes.trim() || null
      })
    } catch (submitError) {
      setError(submitError.message || 'Dogodka ni bilo mogoče shraniti.')
      setSaving(false)
    }
  }

  return (
    <form className="card app-card p-3 p-md-4" onSubmit={handleSubmit}>
      <AlertMessage>{error}</AlertMessage>

      <div className="mb-3">
        <label className="form-label">Vrsta dogodka</label>
        <div className="event-type-grid">
          {EVENT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              className={`event-type-button ${
                form.eventType === type.value ? 'selected' : ''
              }`}
              onClick={() => changeType(type.value)}
            >
              <span className="event-type-emoji">{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="row g-3">
        <div className="col-7">
          <label htmlFor="eventDate" className="form-label">Datum</label>
          <input
            id="eventDate"
            type="date"
            className="form-control"
            value={form.eventDate}
            onChange={(event) => updateField('eventDate', event.target.value)}
            required
          />
        </div>

        <div className="col-5">
          <label htmlFor="eventTime" className="form-label">Čas</label>
          <input
            id="eventTime"
            type="time"
            className="form-control"
            value={form.eventTime}
            onChange={(event) => updateField('eventTime', event.target.value)}
            required
          />
        </div>

        <div className="col-12">
          <label htmlFor="title" className="form-label">Naziv</label>
          <input
            id="title"
            type="text"
            className="form-control"
            value={form.title}
            placeholder={selectedType.defaultTitle}
            maxLength={100}
            onChange={(event) => updateField('title', event.target.value)}
          />
        </div>

        {showQuantity && (
          <>
            <div className="col-7">
              <label htmlFor="quantity" className="form-label">
                {form.eventType === 'weight' ? 'Teža' : 'Količina'}
              </label>
              <input
                id="quantity"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                className="form-control"
                value={form.quantity}
                onChange={(event) => updateField('quantity', event.target.value)}
              />
            </div>

            <div className="col-5">
              <label htmlFor="unit" className="form-label">Enota</label>
              <input
                id="unit"
                type="text"
                list="unit-suggestions"
                className="form-control"
                value={form.unit}
                maxLength={30}
                onChange={(event) => updateField('unit', event.target.value)}
              />
              <datalist id="unit-suggestions">
                {(unitSuggestions[form.eventType] ?? []).map((unit) => (
                  <option key={unit} value={unit} />
                ))}
              </datalist>
            </div>
          </>
        )}

        <div className="col-12">
          <label htmlFor="notes" className="form-label">Opomba</label>
          <textarea
            id="notes"
            className="form-control"
            rows="4"
            value={form.notes}
            maxLength={1000}
            placeholder="Dodatne podrobnosti ..."
            onChange={(event) => updateField('notes', event.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary btn-lg mt-4" disabled={saving}>
        {saving ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />
            Shranjujem ...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  )
}
