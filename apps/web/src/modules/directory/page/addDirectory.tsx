import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import BackArrowButton from '@/components/backArrowButton'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    MapPin,
    Phone,
    Mail,
    ImageIcon,
    Clock,
    Plus,
    X,
    Users,
    Globe,
    Building2,
    FileText,
    AlertCircle,
    ExternalLink,
    UserCog,
    Trash2,
} from 'lucide-react'
import { getCoordinateValidationError } from '../schemes/directory'
import { useLocations } from '../hooks/useLocations'
import { FacebookLogoIcon, InstagramLogoIcon, TwitterLogoIcon, WhatsappLogoIcon, TiktokLogoIcon, LinkedinLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react'
import { useNavigate, useParams } from 'react-router'
import { Textarea } from '@/components/ui/textarea'
import FormField from '@/components/formField'
import SectionHeader from '@/components/sectionHeader'
import IconInput from '@/components/iconinput'
import LocationPicker from '../components/locationPicker'

const NOMBRE_PREDETERMINADO = 'GERENCIA DE LA DEFENSORA NACIONAL DE LOS DERECHOS DE LA MUJER'

interface DefensoraForm {
    id?: number
    correo: string
    telefono: string
}

interface RedForm {
    nombre: string
    url: string
    icono: string
}

export default function AddDirectory() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    // ── Datos generales ────────────────────────────────────────────
    const [nombre, setNombre] = useState(NOMBRE_PREDETERMINADO)
    const [organismo, setOrganismo] = useState('')
    const [foto, setFoto] = useState('')
    const [foto2, setFoto2] = useState('')
    const [horario, setHorario] = useState('')
    const [descripcion, setDescripcion] = useState('')

    // ── Directora del centro ──────────────────────────────────────
    const [directora, setDirectora] = useState({ nombre: '', apellido: '', cargo: '' })

    // ── Ubicación ─────────────────────────────────────────────────
    const [selectedState, setSelectedState] = useState('')
    const [selectedMunicipality, setSelectedMunicipality] = useState('')
    const [selectedParroquia, setSelectedParroquia] = useState('')
    const [listParroquias, setListParroquias] = useState<string[]>([])
    const [direccion, setDireccion] = useState('')
    const [latitud, setLatitud] = useState('')
    const [longitud, setLongitud] = useState('')

    // ── Defensoras ────────────────────────────────────────────────
    const [defensoras, setDefensoras] = useState<DefensoraForm[]>([])
    const [defensorasEliminadas, setDefensorasEliminadas] = useState<number[]>([])
    const [duplicateWarning, setDuplicateWarning] = useState('')

    // ── Listas simples ────────────────────────────────────────────
    const [servicios, setServicios] = useState<string[]>([])
    const [nuevoServicio, setNuevoServicio] = useState('')
    const [redes, setRedes] = useState<RedForm[]>([])
    const [nuevaRed, setNuevaRed] = useState<RedForm>({ nombre: '', url: '', icono: '' })
    const [requisitos, setRequisitos] = useState<string[]>([])
    const [nuevoRequisito, setNuevoRequisito] = useState('')

    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(isEdit)

    const { listStates, listMunicipalities, loadingLocation, error: locationError } = useLocations()

    const coordinateError = getCoordinateValidationError(latitud, longitud)
    const coordinatesReady = latitud.trim() !== '' && longitud.trim() !== '' && !coordinateError
    const coordinateMapUrl = coordinatesReady
        ? `https://www.google.com/maps/search/?api=1&query=${Number(latitud)},${Number(longitud)}`
        : null

    // ── Parroquias del municipio seleccionado ─────────────────────
    useEffect(() => {
        let cancelled = false

        const fetchParroquias = async () => {
            if (!selectedState || !selectedMunicipality) {
                setListParroquias([])
                return
            }

            try {
                const query = new URLSearchParams({ estado: selectedState, municipio: selectedMunicipality })
                const response = await fetch(`/api/location/parroquias?${query}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data?.error || 'Error al cargar parroquias')
                }

                if (!cancelled) setListParroquias(data?.data || [])
            } catch (fetchError) {
                console.error(fetchError)
                if (!cancelled) setListParroquias([])
            }
        }

        void fetchParroquias()
        return () => { cancelled = true }
    }, [selectedState, selectedMunicipality])

    // ── Cargar datos en modo edición ──────────────────────────────
    useEffect(() => {
        if (!id) return

        const fetchCenter = async () => {
            setLoading(true)
            setError('')
            setMessage('')

            try {
                const response = await fetch(`/api/directory/admin/centers/${id}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data?.error || 'No se pudo cargar el centro')
                }

                const center = data?.data
                setNombre(center.nombre || NOMBRE_PREDETERMINADO)
                setOrganismo(center.organismo || '')
                setDescripcion(center.descripcion || '')
                setDireccion(center.direccion || '')
                setFoto(center.foto || '')
                setFoto2(center.foto2 || '')
                setHorario(center.horario || '')
                setLatitud(center.latitud == null ? '' : String(center.latitud))
                setLongitud(center.longitud == null ? '' : String(center.longitud))
                setSelectedState(center.estado || '')
                setSelectedMunicipality(center.municipio || '')
                setSelectedParroquia(center.parroquia || '')
                setServicios(center.servicios || [])
                setRedes(center.redes || [])
                setRequisitos(center.requisitos || [])

                const responsables = center.responsables || []
                if (responsables.length > 0) {
                    const [nombreApellido, ...resto] = responsables[0].nombre.split(' ')
                    setDirectora({
                        nombre: nombreApellido || '',
                        apellido: resto.join(' ') || '',
                        cargo: responsables[0].cargo || '',
                    })
                }

                setDefensoras((center.defensoras || []).map((d: { id: number; correo: string | null; telefono: string | null }) => ({
                    id: d.id,
                    correo: d.correo || '',
                    telefono: d.telefono || '',
                })))
            } catch (fetchError) {
                console.error(fetchError)
                setError('No se pudo cargar el centro. Intenta de nuevo más tarde.')
            } finally {
                setLoading(false)
            }
        }

        void fetchCenter()
    }, [id])

    // ── Manejo de defensoras ──────────────────────────────────────
    const agregarDefensora = () => {
        setDefensoras([...defensoras, { correo: '', telefono: '' }])
    }

    const removerDefensora = (index: number) => {
        const defensora = defensoras[index]
        if (defensora.id) {
            setDefensorasEliminadas([...defensorasEliminadas, defensora.id])
        }
        setDefensoras(defensoras.filter((_, i) => i !== index))
    }

    const actualizarDefensora = (index: number, campo: 'correo' | 'telefono', valor: string) => {
        setDefensoras(defensoras.map((d, i) => (i === index ? { ...d, [campo]: valor } : d)))
        setDuplicateWarning('')
    }

    // ── Validar duplicado de una defensora contra la API ──────────
    const validarDefensora = async (defensora: DefensoraForm) => {
        const email = defensora.correo.trim()
        const phone = defensora.telefono.trim()

        if (!email && !phone) return

        try {
            const response = await fetch('/api/directory/admin/check-duplicate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo: email, telefono: phone }),
            })
            const data = await response.json()

            if (response.ok && data.duplicado) {
                setDuplicateWarning(data.mensaje)
            }
        } catch (fetchError) {
            console.error(fetchError)
        }
    }

    // ── Listas simples ────────────────────────────────────────────
    const agregarServicio = () => {
        if (nuevoServicio.trim()) {
            setServicios([...servicios, nuevoServicio.trim()])
            setNuevoServicio('')
        }
    }
    const removerServicio = (index: number) => setServicios(servicios.filter((_, i) => i !== index))

    const agregarRed = () => {
        if (nuevaRed.nombre.trim() && nuevaRed.url.trim()) {
            setRedes([...redes, { ...nuevaRed }])
            setNuevaRed({ nombre: '', url: '', icono: '' })
        }
    }
    const removerRed = (index: number) => setRedes(redes.filter((_, i) => i !== index))

    const agregarRequisito = () => {
        if (nuevoRequisito.trim()) {
            setRequisitos([...requisitos, nuevoRequisito.trim()])
            setNuevoRequisito('')
        }
    }
    const removerRequisito = (index: number) => setRequisitos(requisitos.filter((_, i) => i !== index))

    // ── Guardar ───────────────────────────────────────────────────
    const handleFormSubmit = async (event: { preventDefault: () => void }) => {
        event.preventDefault()
        setError('')
        setMessage('')

        if (!organismo.trim() || !direccion.trim() || !selectedState || !selectedMunicipality) {
            setError('Completa el organismo, la dirección, el estado y el municipio.')
            return
        }

        if (coordinateError) {
            setError(coordinateError)
            return
        }

        setSaving(true)

        const responsables = directora.nombre.trim() && directora.cargo.trim()
            ? [{ nombre: `${directora.nombre.trim()} ${directora.apellido.trim()}`.trim(), cargo: directora.cargo.trim() }]
            : []

        const payload = {
            nombre,
            organismo,
            descripcion,
            direccion,
            foto,
            foto2,
            horario,
            latitud,
            longitud,
            estado: selectedState,
            municipio: selectedMunicipality,
            parroquia: selectedParroquia,
            servicios,
            responsables,
            redes,
            requisitos,
            defensoras,
            ...(isEdit ? { defensorasEliminadas } : {}),
        }

        try {
            const response = await fetch(isEdit ? `/api/directory/admin/centers/${id}` : '/api/directory/admin/centers', {
                method: isEdit ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data?.error || 'Error al guardar el centro.')
            }

            setMessage(isEdit ? 'Centro actualizado correctamente.' : 'Centro registrado correctamente.')
            if (!isEdit) {
                setTimeout(() => navigate('/admin/directorio'), 1200)
            }
        } catch (submissionError) {
            console.error(submissionError)
            setError(submissionError instanceof Error ? submissionError.message : 'No se pudo guardar el centro. Intenta nuevamente.')
        } finally {
            setSaving(false)
        }
    }

    const formError = error || locationError

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-lg font-medium">Cargando información del centro...</p>
                </div>
            </div>
        )
    }

    return (
        <>
            <form onSubmit={handleFormSubmit} className="py-4 sm:py-8">
                <header className="px-4 sm:px-8 mb-6">
                    <div className='flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8'>
                        <Badge
                            variant="outline"
                            className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50"
                        >
                            <Building2 className="w-3 h-3 mr-1" />
                            {isEdit ? 'Editar centro' : 'Registro de centro'}
                        </Badge>
                        <BackArrowButton to="/admin/directorio" ariaLabel="Volver a la gestión de centros" />
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                        {isEdit ? 'Editar centro de atención' : 'Nuevo centro de atención'}
                    </h1>

                    <p className="text-muted-foreground">
                        {isEdit
                            ? 'Modifica los datos del centro, sus defensoras y guarda los cambios.'
                            : 'Completa los datos para registrar el centro y sus defensoras.'}
                    </p>
                </header>

                {formError && (
                    <div className="mx-4 sm:mx-8 mb-4 rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                        {formError}
                    </div>
                )}
                {message && (
                    <div className="mx-4 sm:mx-8 mb-4 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {message}
                    </div>
                )}

                {/* ── Datos Generales ─────────────────────────────────── */}
                <fieldset className="px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 items-start gap-8">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="col-span-2">
                            <SectionHeader
                                icon={Building2}
                                title="Datos Generales del Centro"
                                description="Información básica del centro"
                            />
                        </div>

                        <FormField label="Nombre" htmlFor="nombre" className='col-span-2'>
                            <Select value={nombre} onValueChange={setNombre}>
                                <SelectTrigger id="nombre" className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-left text-sm">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Nombre institucional</SelectLabel>
                                        <SelectItem value={NOMBRE_PREDETERMINADO}>{NOMBRE_PREDETERMINADO}</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Organismo (tipo de centro)" htmlFor="organismo" className='col-span-2'>
                            <Input
                                id="organismo"
                                type="text"
                                value={organismo}
                                onChange={(e) => setOrganismo(e.target.value)}
                                placeholder="Ej. CAFIM, Instituto, Sede, Defensoría Municipal"
                                required
                                className="w-full rounded-3xl px-4 py-3"
                            />
                        </FormField>

                        <FormField label="Horario de atención" htmlFor="horario">
                            <IconInput
                                id="horario"
                                icon={Clock}
                                type="text"
                                value={horario}
                                onChange={(e) => setHorario(e.target.value)}
                                placeholder="Ej. Lun a Vie 08:00 - 16:00"
                            />
                        </FormField>

                        <FormField label="URL de imagen 1" htmlFor="foto">
                            <IconInput
                                id="foto"
                                icon={ImageIcon}
                                type="url"
                                value={foto}
                                onChange={(e) => setFoto(e.target.value)}
                                placeholder="https://"
                            />
                        </FormField>

                        <FormField
                            label="URL de imagen 2"
                            htmlFor="foto2"
                            description="Segunda imagen que se muestra en el mapa"
                            className='col-span-2'
                        >
                            <IconInput
                                id="foto2"
                                icon={ImageIcon}
                                type="url"
                                value={foto2}
                                onChange={(e) => setFoto2(e.target.value)}
                                placeholder="https://"
                            />
                        </FormField>
                    </div>

                    {/* ── Directora del Centro ────────────────────────── */}
                    <div className="grid gap-4">
                        <SectionHeader
                            icon={UserCog}
                            title="Directora del Centro"
                            description="Persona a cargo del centro"
                        />

                        <div className="grid gap-4 md:grid-cols-2">
                            <FormField label="Nombres" htmlFor="directora-nombre">
                                <Input
                                    id="directora-nombre"
                                    type="text"
                                    value={directora.nombre}
                                    onChange={(e) => setDirectora({ ...directora, nombre: e.target.value })}
                                    placeholder="Nombres"
                                    className="w-full rounded-3xl px-4 py-3"
                                />
                            </FormField>

                            <FormField label="Apellidos" htmlFor="directora-apellido">
                                <Input
                                    id="directora-apellido"
                                    type="text"
                                    value={directora.apellido}
                                    onChange={(e) => setDirectora({ ...directora, apellido: e.target.value })}
                                    placeholder="Apellidos"
                                    className="w-full rounded-3xl px-4 py-3"
                                />
                            </FormField>

                            <FormField label="Cargo" htmlFor="directora-cargo" className='md:col-span-2'>
                                <Input
                                    id="directora-cargo"
                                    type="text"
                                    value={directora.cargo}
                                    onChange={(e) => setDirectora({ ...directora, cargo: e.target.value })}
                                    placeholder="Ej. Directora General"
                                    className="w-full rounded-3xl px-4 py-3"
                                />
                            </FormField>
                        </div>
                    </div>
                </fieldset>

                {/* ── Ubicación del Centro ────────────────────────────── */}
                <fieldset className="p-4 sm:p-8 bg-muted/30 mt-8 grid grid-cols-1 lg:grid-cols-2 items-start gap-8">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="col-span-2">
                            <SectionHeader
                                icon={MapPin}
                                title="Ubicación del Centro"
                                description="Selecciona la ubicación geográfica"
                            />
                        </div>

                        <FormField label="Estado" htmlFor="estado">
                            <Select
                                value={selectedState}
                                onValueChange={(value) => {
                                    setSelectedState(value)
                                    setSelectedMunicipality('')
                                    setSelectedParroquia('')
                                }}
                                disabled={loadingLocation}
                            >
                                <SelectTrigger id="estado" className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-left text-sm">
                                    <SelectValue
                                        placeholder={loadingLocation ? 'Cargando estados...' : 'Seleccione un estado'}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Estados</SelectLabel>
                                        {listStates.map((state) => (
                                            <SelectItem key={state} value={state}>
                                                {state}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Municipio" htmlFor="municipio">
                            <Select
                                value={selectedMunicipality}
                                onValueChange={(value) => {
                                    setSelectedMunicipality(value)
                                    setSelectedParroquia('')
                                }}
                                disabled={!selectedState || loadingLocation}
                            >
                                <SelectTrigger id="municipio" className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-left text-sm">
                                    <SelectValue
                                        placeholder={selectedState ? 'Seleccione un municipio' : 'Selecciona un estado primero'}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Municipios</SelectLabel>
                                        {(listMunicipalities[selectedState] || []).map((municipio) => (
                                            <SelectItem key={municipio} value={municipio}>
                                                {municipio}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Parroquia" htmlFor="parroquia">
                            <Select
                                value={selectedParroquia}
                                onValueChange={setSelectedParroquia}
                                disabled={!selectedMunicipality}
                            >
                                <SelectTrigger id="parroquia" className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-left text-sm">
                                    <SelectValue
                                        placeholder={
                                            selectedMunicipality
                                                ? listParroquias.length > 0
                                                    ? 'Seleccione una parroquia'
                                                    : 'No hay parroquias registradas'
                                                : 'Selecciona un municipio primero'
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Parroquias</SelectLabel>
                                        {listParroquias.map((parroquia) => (
                                            <SelectItem key={parroquia} value={parroquia}>
                                                {parroquia}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </FormField>

                        <FormField label="Dirección completa" htmlFor="direccion">
                            <IconInput
                                id="direccion"
                                name='direccion'
                                icon={MapPin}
                                type="text"
                                value={direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                placeholder="Calle, número, zona"
                                required
                            />
                        </FormField>

                        <FormField label="Latitud" htmlFor="latitud">
                            <Input
                                id="latitud"
                                type="number"
                                min="-90"
                                max="90"
                                step="any"
                                value={latitud}
                                onChange={(e) => setLatitud(e.target.value)}
                                placeholder="Ej. 10.5061"
                                className="w-full rounded-3xl px-4 py-3"
                            />
                        </FormField>

                        <FormField label="Longitud" htmlFor="longitud">
                            <Input
                                id="longitud"
                                type="number"
                                min="-180"
                                max="180"
                                step="any"
                                value={longitud}
                                onChange={(e) => setLongitud(e.target.value)}
                                placeholder="Ej. -66.9146"
                                className="w-full rounded-3xl px-4 py-3"
                            />
                        </FormField>

                        <div className="col-span-2 flex flex-col gap-3 rounded-2xl border bg-background/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p
                                className={`text-sm ${coordinateError ? 'text-destructive' : 'text-muted-foreground'}`}
                                role="status"
                                aria-live="polite"
                            >
                                {coordinateError ||
                                    (coordinatesReady
                                        ? `El centro aparecerá en el mapa en ${Number(latitud).toFixed(5)}, ${Number(longitud).toFixed(5)}.`
                                        : 'Las coordenadas son opcionales. Completa ambas para mostrar el centro en el mapa.')}
                            </p>
                            {coordinateMapUrl && (
                                <a
                                    href={coordinateMapUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex shrink-0 items-center gap-2 text-sm font-medium text-rose-700 underline-offset-4 hover:underline dark:text-rose-300"
                                >
                                    Probar ubicación
                                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ── Mapa interactivo para ubicar el centro ──────── */}
                    <LocationPicker
                        latitud={latitud}
                        longitud={longitud}
                        onPick={(lat, lng) => {
                            setLatitud(String(lat))
                            setLongitud(String(lng))
                            setMessage('Coordenadas aplicadas al centro.')
                        }}
                    />
                </fieldset>

                {/* ── Descripción ─────────────────────────────────────── */}
                <fieldset className="p-4 sm:p-8 bg-muted/30 space-y-4 mt-8">
                    <SectionHeader icon={FileText} title="Descripción del Centro" description="Describe qué hace el centro y cuál es su finalidad" />
                    <Textarea
                        name="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción del centro de atención, servicios que brinda y su finalidad"
                    />
                </fieldset>

                {/* ── Datos de las Defensoras ─────────────────────────── */}
                <fieldset className="p-4 sm:p-8 mt-8 space-y-4">
                    <SectionHeader
                        icon={Users}
                        title="Datos de las Defensoras"
                        description="Cada defensora se identifica solo por su correo y teléfono (sin nombres por privacidad)"
                    />

                    {duplicateWarning && (
                        <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800" role="alert">
                            {duplicateWarning}
                        </div>
                    )}

                    <div className="space-y-4">
                        {defensoras.map((defensora, index) => (
                            <Card key={defensora.id ?? `nueva-${index}`}>
                                <CardContent className="p-4 grid gap-4 md:grid-cols-[auto_1fr_1fr_auto] items-end">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 dark:bg-rose-900">
                                        <span className="text-sm font-bold text-rose-700 dark:text-rose-100">{index + 1}</span>
                                    </div>

                                    <FormField label={`Correo de la defensora ${index + 1}`} htmlFor={`defensora-correo-${index}`}>
                                        <IconInput
                                            id={`defensora-correo-${index}`}
                                            icon={Mail}
                                            type="email"
                                            value={defensora.correo}
                                            onChange={(e) => actualizarDefensora(index, 'correo', e.target.value)}
                                            onBlur={() => validarDefensora(defensoras[index])}
                                            placeholder="correo@ejemplo.com"
                                        />
                                    </FormField>

                                    <FormField label={`Teléfono de la defensora ${index + 1}`} htmlFor={`defensora-telefono-${index}`}>
                                        <IconInput
                                            id={`defensora-telefono-${index}`}
                                            icon={Phone}
                                            type="tel"
                                            value={defensora.telefono}
                                            onChange={(e) => actualizarDefensora(index, 'telefono', e.target.value)}
                                            onBlur={() => validarDefensora(defensoras[index])}
                                            placeholder="Ej. 04120000000"
                                        />
                                    </FormField>

                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Eliminar defensora ${index + 1}`}
                                        onClick={() => removerDefensora(index)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Button type="button" variant="outline" onClick={agregarDefensora}>
                        <Plus className="mr-2 h-4 w-4" />
                        Agregar defensora
                    </Button>
                </fieldset>

                {/* ── Servicios y Requisitos ──────────────────────────── */}
                <fieldset className='grid grid-cols-1 sm:grid-cols-2 gap-8 mt-8'>
                    <section className="p-4 sm:p-8">
                        <SectionHeader
                            icon={FileText}
                            title="Servicios Disponibles"
                            description="Agrega los servicios que ofrece el centro"
                            className='mb-3'
                        />

                        <div className="flex gap-2 max-w-xl mb-4">
                            <Input
                                type="text"
                                value={nuevoServicio}
                                onChange={(e) => setNuevoServicio(e.target.value)}
                                placeholder="Agregar servicio"
                                className="flex-1 rounded-3xl px-4 py-3"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarServicio())}
                            />
                            <Button
                                type="button"
                                onClick={agregarServicio}
                                variant="outline"
                                size="sm"
                                className="rounded-3xl"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {servicios.length > 0 && (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {servicios.map((servicio, index) => (
                                    <Card key={index} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                                                    <FileText className="w-5 h-5 text-rose-600 dark:text-rose-100" />
                                                </div>
                                                <span className="font-medium text-sm">{servicio}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removerServicio(index)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                    <section className="p-4 sm:p-8">
                        <SectionHeader
                            icon={AlertCircle}
                            title="Requisitos de Atención"
                            description="Agrega los requisitos necesarios para ser atendida"
                            className='mb-3'
                        />

                        <div className="flex gap-2 max-w-xl mb-4">
                            <Input
                                type="text"
                                value={nuevoRequisito}
                                onChange={(e) => setNuevoRequisito(e.target.value)}
                                placeholder="Agregar requisito"
                                className="flex-1 rounded-3xl px-4 py-3"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), agregarRequisito())}
                            />
                            <Button
                                type="button"
                                onClick={agregarRequisito}
                                variant="outline"
                                size="sm"
                                className="rounded-3xl"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                        </div>

                        {requisitos.length > 0 && (
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {requisitos.map((requisito, index) => (
                                    <Card key={index} className="hover:shadow-md transition-shadow">
                                        <CardContent className="p-4 flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                                                    <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-100" />
                                                </div>
                                                <span className="font-medium text-sm">{requisito}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removerRequisito(index)}
                                                className="text-muted-foreground hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </fieldset>

                {/* ── Redes Sociales ──────────────────────────────────── */}
                <fieldset className="py-12 px-4 sm:px-8 bg-muted mt-8">
                    <section>
                        <SectionHeader
                            icon={Globe}
                            title="Redes Sociales"
                            description="Perfiles y sitios web del centro"
                            className='mb-3'
                        />

                        <div className="grid gap-2 mb-4 max-w-xl">
                            <Input
                                type="url"
                                value={nuevaRed.url}
                                onChange={(e) => setNuevaRed({ ...nuevaRed, url: e.target.value })}
                                placeholder="URL"
                                className="rounded-3xl px-4 py-3"
                            />
                            <Select
                                value={nuevaRed.icono}
                                onValueChange={(value) => setNuevaRed({ ...nuevaRed, nombre: value, icono: value })}
                            >
                                <SelectTrigger className="rounded-3xl px-4 py-3 w-full">
                                    <SelectValue placeholder="Nombre de la red social" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Facebook"> <FacebookLogoIcon className="w-6 h-6" /> Facebook</SelectItem>
                                    <SelectItem value="Instagram"> <InstagramLogoIcon className="w-6 h-6" /> Instagram</SelectItem>
                                    <SelectItem value="Twitter"> <TwitterLogoIcon className="w-6 h-6" /> Twitter</SelectItem>
                                    <SelectItem value="Whatsapp"> <WhatsappLogoIcon className="w-6 h-6" /> WhatsApp</SelectItem>
                                    <SelectItem value="Tiktok"> <TiktokLogoIcon className="w-6 h-6" /> TikTok</SelectItem>
                                    <SelectItem value="Linkedin"> <LinkedinLogoIcon className="w-6 h-6" /> LinkedIn</SelectItem>
                                    <SelectItem value="Youtube"><YoutubeLogoIcon className="w-6 h-6" /> YouTube</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                onClick={agregarRed}
                                variant="outline"
                                className="rounded-3xl"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar red social
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {redes.map((red, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-background max-w-xl">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                                        {red.icono === 'Facebook' && <FacebookLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Instagram' && <InstagramLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Twitter' && <TwitterLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Whatsapp' && <WhatsappLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Tiktok' && <TiktokLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Linkedin' && <LinkedinLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Youtube' && <YoutubeLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium">{red.nombre}</p>
                                        <p className="text-sm text-muted-foreground truncate">{red.url}</p>
                                    </div>
                                    <Button
                                        type="button"
                                        onClick={() => removerRed(index)}
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </section>
                </fieldset>

                <div className="px-4 sm:px-8 py-8 flex justify-end">
                    <Button
                        type="submit"
                        size="lg"
                        disabled={saving}
                        className="font-bold bg-rose-600 hover:bg-rose-700"
                    >
                        {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Registrar centro'}
                    </Button>
                </div>
            </form>
        </>
    )
}
