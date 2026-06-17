import { useEffect, useState } from "react";
import type { Institution } from "../scheme/about";

export function useInstitution() {
    const [institucion, setInstitucion] = useState<Institution | null>(null)
    const [loadingInstitution, setLoadingInstitution] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchInstitutionData = async () => {
            try {
                const response = await fetch('/api/about')
                const data = await response.json()

                // console.log(data);

                setInstitucion(data)
            } catch (fetchError) {
                console.error(fetchError)
                setError('No se pudo cargar la información de la institución. Intenta nuevamente más tarde.')
            } finally {
                setLoadingInstitution(false)
            }
        }

        fetchInstitutionData()
    }, [])

    return { institucion, loadingInstitution, error }
}