import { useState, useEffect } from 'react'

type ParishList = Record<string, Record<string, string[]>>
type LocationData = {
    states: string[]
    municipalities: Record<string, string[]>
    parishes: ParishList
}

function isParishList(value: unknown): value is ParishList {
    return typeof value === 'object' && value !== null && !Array.isArray(value) &&
        Object.values(value).every((municipalities) =>
            typeof municipalities === 'object' && municipalities !== null && !Array.isArray(municipalities) &&
            Object.values(municipalities).every((parishes) =>
                Array.isArray(parishes) && parishes.every((parish) => typeof parish === 'string')
            )
        )
}

function isMunicipalityList(value: unknown): value is Record<string, string[]> {
    return typeof value === 'object' && value !== null && !Array.isArray(value) &&
        Object.values(value).every((municipalities) =>
            Array.isArray(municipalities) && municipalities.every((municipality) => typeof municipality === 'string')
        )
}

function getCachedLocations(): LocationData | null {
    try {
        const states = localStorage.getItem('states')
        const municipalities = localStorage.getItem('municipalities')
        const parishes = localStorage.getItem('parishes')

        if (!states || !municipalities || !parishes) return null

        const parsedStates: unknown = JSON.parse(states)
        const parsedMunicipalities: unknown = JSON.parse(municipalities)
        const parsedParishes: unknown = JSON.parse(parishes)

        if (
            Array.isArray(parsedStates) &&
            parsedStates.every((state) => typeof state === 'string') &&
            isMunicipalityList(parsedMunicipalities) &&
            isParishList(parsedParishes)
        ) {
            return {
                states: parsedStates,
                municipalities: parsedMunicipalities,
                parishes: parsedParishes,
            }
        }
    } catch {
        // Ignore invalid cached data and refetch.
    }

    return null
}

export function useLocations() {
    const [cachedLocations] = useState(getCachedLocations)
    const [locations, setLocations] = useState<LocationData>(cachedLocations ?? {
        states: [],
        municipalities: {},
        parishes: {},
    })
    const [loadingLocation, setLoadingLocation] = useState(cachedLocations === null)
    const [error, setError] = useState('')

    useEffect(() => {
        if (cachedLocations) return

        const fetchLocationData = async () => {
            try {
                const response = await fetch('/api/location')
                const data = await response.json()

                if (
                    !response.ok ||
                    !Array.isArray(data?.data?.states) ||
                    !data.data.states.every((state: unknown) => typeof state === 'string') ||
                    !isMunicipalityList(data?.data?.municipalities) ||
                    !isParishList(data?.data?.parishes)
                ) {
                    throw new Error(data?.error || 'Respuesta inválida al cargar ubicaciones')
                }

                const locationData: LocationData = {
                    states: data.data.states,
                    municipalities: data.data.municipalities,
                    parishes: data.data.parishes,
                }
                setLocations(locationData)
                localStorage.setItem('states', JSON.stringify(data.data.states))
                localStorage.setItem('municipalities', JSON.stringify(data.data.municipalities))
                localStorage.setItem('parishes', JSON.stringify(data.data.parishes))
            } catch (fetchError) {
                console.error(fetchError)
                setError('No se pudieron cargar los estados, municipios y parroquias. Intenta nuevamente más tarde.')
            } finally {
                setLoadingLocation(false)
            }
        }

        fetchLocationData()
    }, [cachedLocations])

    return {
        listStates: locations.states,
        listMunicipalities: locations.municipalities,
        listParishes: locations.parishes,
        loadingLocation,
        error,
    }
}
