import { useState, type SubmitEvent } from 'react'

export interface Responsable {
    nombre: string
    cargo: string
}

export interface RedSocial {
    nombre: string
    url: string
    icono: string
}

export function useDirectoryForm() {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [foto, setFoto] = useState('')
    const [horario, setHorario] = useState('')
    const [selectedState, setSelectedState] = useState('')
    const [selectedMunicipality, setSelectedMunicipality] = useState('')
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    // Listas y estados temporales
    const [servicios, setServicios] = useState<string[]>([])
    const [nuevoServicio, setNuevoServicio] = useState('')
    const [responsables, setResponsables] = useState<Responsable[]>([])
    const [nuevoResponsable, setNuevoResponsable] = useState<Responsable>({ nombre: '', cargo: '' })
    const [redes, setRedes] = useState<RedSocial[]>([])
    const [nuevaRed, setNuevaRed] = useState<RedSocial>({ nombre: '', url: '', icono: '' })
    const [requisitos, setRequisitos] = useState<string[]>([])
    const [nuevoRequisito, setNuevoRequisito] = useState('')

    const agregarServicio = () => {
        if (nuevoServicio.trim()) {
            setServicios([...servicios, nuevoServicio.trim()])
            setNuevoServicio('')
        }
    }

    const removerServicio = (index: number) => {
        setServicios(servicios.filter((_, i) => i !== index))
    }

    const agregarResponsable = () => {
        if (nuevoResponsable.nombre.trim() && nuevoResponsable.cargo.trim()) {
            setResponsables([...responsables, { ...nuevoResponsable }])
            setNuevoResponsable({ nombre: '', cargo: '' })
        }
    }

    const removerResponsable = (index: number) => {
        setResponsables(responsables.filter((_, i) => i !== index))
    }

    const agregarRed = () => {
        if (nuevaRed.nombre.trim() && nuevaRed.url.trim()) {
            setRedes([...redes, { ...nuevaRed }])
            setNuevaRed({ nombre: '', url: '', icono: '' })
        }
    }

    const removerRed = (index: number) => {
        setRedes(redes.filter((_, i) => i !== index))
    }

    const agregarRequisito = () => {
        if (nuevoRequisito.trim()) {
            setRequisitos([...requisitos, nuevoRequisito.trim()])
            setNuevoRequisito('')
        }
    }

    const removerRequisito = (index: number) => {
        setRequisitos(requisitos.filter((_, i) => i !== index))
    }

    const resetForm = () => {
        setNombre('')
        setDescripcion('')
        setDireccion('')
        setTelefono('')
        setCorreo('')
        setFoto('')
        setHorario('')
        setSelectedState('')
        setSelectedMunicipality('')
        setServicios([])
        setNuevoServicio('')
        setResponsables([])
        setNuevoResponsable({ nombre: '', cargo: '' })
        setRedes([])
        setNuevaRed({ nombre: '', url: '', icono: '' })
        setRequisitos([])
        setNuevoRequisito('')
    }

    const handleSubmit = async (event: SubmitEvent) => {
        event.preventDefault()
        setError('')
        setMessage('')

        if (!nombre || !direccion || !telefono || !selectedState || !selectedMunicipality) {
            setError('Por favor completa todos los campos obligatorios.')
            return
        }

        setSaving(true)

        try {
            const response = await fetch('/api/directory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    descripcion,
                    direccion,
                    telefono,
                    correo,
                    foto,
                    horario,
                    estado: selectedState,
                    municipio: selectedMunicipality,
                    servicios,
                    responsables,
                    redes,
                    requisitos,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data?.error || 'Error al registrar el directorio.')
            }

            setMessage('Directorio registrado con éxito.')
            resetForm()
        } catch (submissionError) {
            console.error(submissionError)
            setError('No se pudo registrar el directorio. Intenta nuevamente más tarde.')
        } finally {
            setSaving(false)
        }
    }

    return {
        // State
        nombre, setNombre,
        descripcion, setDescripcion,
        direccion, setDireccion,
        telefono, setTelefono,
        correo, setCorreo,
        foto, setFoto,
        horario, setHorario,
        selectedState, setSelectedState,
        selectedMunicipality, setSelectedMunicipality,
        saving, setSaving,
        message, setMessage,
        error, setError,
        servicios, setServicios,
        nuevoServicio, setNuevoServicio,
        responsables, setResponsables,
        nuevoResponsable, setNuevoResponsable,
        redes, setRedes,
        nuevaRed, setNuevaRed,
        requisitos, setRequisitos,
        nuevoRequisito, setNuevoRequisito,
        // Handlers
        agregarServicio, removerServicio,
        agregarResponsable, removerResponsable,
        agregarRed, removerRed,
        agregarRequisito, removerRequisito,
        handleSubmit
    }
}