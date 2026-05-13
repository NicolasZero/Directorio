import { useState, useEffect } from 'react'

export function useLocations() {
    const [listStates, setStates] = useState<string[]>([])
    const [listMunicipalities, setMunicipalities] = useState<Record<string, string[]>>({})
    const [loadingLocation, setLoadingLocation] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const cachedStates = localStorage.getItem('states')
        const cachedMunicipalities = localStorage.getItem('municipalities')

        if (cachedStates && cachedMunicipalities) {
            try {
                const parsedStates = JSON.parse(cachedStates)
                const parsedMunicipalities = JSON.parse(cachedMunicipalities)

                if (Array.isArray(parsedStates) && parsedMunicipalities && typeof parsedMunicipalities === 'object') {
                    setStates(parsedStates)
                    setMunicipalities(parsedMunicipalities as Record<string, string[]>)
                    setLoadingLocation(false)
                    return
                }
            } catch {
                // Ignore invalid cached data and refetch
            }
        }

        const fetchLocationData = async () => {
            try {
                const response = await fetch('/api/location')
                const data = await response.json()

                setStates(data.data.states)
                setMunicipalities(data.data.municipalities)
                localStorage.setItem('states', JSON.stringify(data.data.states))
                localStorage.setItem('municipalities', JSON.stringify(data.data.municipalities))
            } catch (fetchError) {
                console.error(fetchError)
                setError('No se pudieron cargar los estados y municipios. Intenta nuevamente más tarde.')
            } finally {
                setLoadingLocation(false)
            }
        }

        fetchLocationData()
    }, [])

    return { listStates, listMunicipalities, loadingLocation, error }
}
