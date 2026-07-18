import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const HouseholdContext = createContext(null)

export function HouseholdProvider({ children }) {
  const { user, loading: authLoading } = useAuth()
  const [membership, setMembership] = useState(null)
  const [household, setHousehold] = useState(null)
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)

  const refreshHousehold = useCallback(async () => {
    if (!user) {
      setMembership(null)
      setHousehold(null)
      setPet(null)
      setLoading(false)
      return
    }

    setLoading(true)

    const { data, error } = await supabase
      .from('household_members')
      .select(`
        role,
        household:households(
          id,
          name,
          join_code,
          created_at,
          pets(
            id,
            name,
            birth_date,
            breed,
            weight,
            notes,
            created_at
          )
        )
      `)
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Napaka pri nalaganju gospodinjstva:', error)
      setMembership(null)
      setHousehold(null)
      setPet(null)
      setLoading(false)
      return
    }

    setMembership(data ? { role: data.role } : null)
    setHousehold(data?.household ?? null)

    const pets = data?.household?.pets ?? []
    const sortedPets = [...pets].sort((a, b) => a.created_at.localeCompare(b.created_at))
    setPet(sortedPets[0] ?? null)
    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!authLoading) {
      refreshHousehold()
    }
  }, [authLoading, refreshHousehold])

  async function createHousehold({
    householdName,
    petName,
    birthDate,
    breed,
    weight
  }) {
    const { data, error } = await supabase.rpc('create_household_with_pet', {
      p_household_name: householdName.trim(),
      p_pet_name: petName.trim(),
      p_birth_date: birthDate || null,
      p_breed: breed.trim() || null,
      p_weight: weight ? Number(weight) : null
    })

    if (error) throw error
    await refreshHousehold()
    return data?.[0] ?? data
  }

  async function joinHousehold(joinCode) {
    const { data, error } = await supabase.rpc('join_household_by_code', {
      p_join_code: joinCode.trim().toUpperCase()
    })

    if (error) throw error
    await refreshHousehold()
    return data
  }

  async function updatePet(payload) {
    if (!pet?.id) throw new Error('Erosov profil ni naložen.')

    const { data, error } = await supabase
      .from('pets')
      .update(payload)
      .eq('id', pet.id)
      .select('id, name, birth_date, breed, weight, notes, created_at')
      .single()

    if (error) throw error
    setPet(data)
  }

  const value = {
    membership,
    household,
    pet,
    loading,
    refreshHousehold,
    createHousehold,
    joinHousehold,
    updatePet
  }

  return <HouseholdContext.Provider value={value}>{children}</HouseholdContext.Provider>
}

export function useHousehold() {
  const context = useContext(HouseholdContext)
  if (!context) {
    throw new Error('useHousehold mora biti uporabljen znotraj HouseholdProvider.')
  }
  return context
}
