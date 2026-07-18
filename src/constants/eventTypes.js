export const EVENT_TYPES = [
  { value: 'poop', label: 'Kakanje', icon: '💩', defaultTitle: 'Kakanje' },
  { value: 'meal', label: 'Obrok', icon: '🍖', defaultTitle: 'Obrok' },
  { value: 'treat', label: 'Priboljšek', icon: '🦴', defaultTitle: 'Priboljšek' },
  { value: 'walk', label: 'Sprehod', icon: '🐾', defaultTitle: 'Sprehod' },
  { value: 'medicine', label: 'Zdravilo', icon: '💊', defaultTitle: 'Zdravilo' },
  { value: 'spot_on', label: 'Ampula', icon: '💧', defaultTitle: 'Ampula' },
  { value: 'deworming', label: 'Razglistenje', icon: '🪱', defaultTitle: 'Razglistenje' },
  { value: 'weight', label: 'Tehtanje', icon: '⚖️', defaultTitle: 'Tehtanje' },
  { value: 'vet', label: 'Veterinar', icon: '🩺', defaultTitle: 'Veterinar' },
  { value: 'grooming', label: 'Striženje', icon: '✂️', defaultTitle: 'Striženje' },
  { value: 'note', label: 'Opomba', icon: '📝', defaultTitle: 'Opomba' }
]

export function getEventType(value) {
  return EVENT_TYPES.find((type) => type.value === value) ?? EVENT_TYPES.at(-1)
}
