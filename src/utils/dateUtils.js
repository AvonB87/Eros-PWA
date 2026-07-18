import dayjs from 'dayjs'
import 'dayjs/locale/sl'

dayjs.locale('sl')

export function todayInputValue() {
  return dayjs().format('YYYY-MM-DD')
}

export function currentTimeInputValue() {
  return dayjs().format('HH:mm')
}

export function combineLocalDateAndTime(date, time) {
  const value = dayjs(`${date}T${time}`)
  if (!value.isValid()) {
    throw new Error('Datum ali čas ni veljaven.')
  }
  return value.toISOString()
}

export function formatEventTime(value) {
  return dayjs(value).format('HH:mm')
}

export function formatFullDate(value) {
  return dayjs(value).format('dddd, D. MMMM YYYY')
}

export function formatShortDate(value) {
  return dayjs(value).format('D. MMM YYYY')
}

export function dayRange(date = dayjs()) {
  const selected = dayjs(date)
  return {
    start: selected.startOf('day').toISOString(),
    end: selected.add(1, 'day').startOf('day').toISOString()
  }
}

export function toLocalFormValues(value) {
  const date = dayjs(value)
  return {
    eventDate: date.format('YYYY-MM-DD'),
    eventTime: date.format('HH:mm')
  }
}
