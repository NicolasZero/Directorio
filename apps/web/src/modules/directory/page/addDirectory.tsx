import { useEffect, useState, type FormEvent } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { MapPin, Phone, Mail, ImageIcon, Clock, Plus, X, Users, Globe } from 'lucide-react'

interface Responsable {
    nombre: string
    cargo: string
}

interface RedSocial {
    nombre: string
    url: string
    icono: string
}

export default function EditDirectory() {
    const [nombre, setNombre] = useState('')
    const [descripcion, setDescripcion] = useState('')
    const [direccion, setDireccion] = useState('')
    const [telefono, setTelefono] = useState('')
    const [correo, setCorreo] = useState('')
    const [foto, setFoto] = useState('')
    const [horario, setHorario] = useState('')
    const [selectedState, setSelectedState] = useState('')
    const [selectedMunicipality, setSelectedMunicipality] = useState('')
    const [listStates, setStates] = useState<string[]>([])
    const [listMunicipalities, setMunicipalities] = useState<Record<string, string[]>>({})
    const [loadingLocation, setLoadingLocation] = useState(true)
    const [saving, setSaving] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    // Nuevos estados para campos relacionados
    const [servicios, setServicios] = useState<string[]>([])
    const [nuevoServicio, setNuevoServicio] = useState('')
    const [responsables, setResponsables] = useState<Responsable[]>([])
    const [nuevoResponsable, setNuevoResponsable] = useState<Responsable>({ nombre: '', cargo: '' })
    const [redes, setRedes] = useState<RedSocial[]>([])
    const [nuevaRed, setNuevaRed] = useState<RedSocial>({ nombre: '', url: '', icono: '' })

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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data?.error || 'Error al registrar el directorio.')
            }

            setMessage('Directorio registrado con éxito.')
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
        } catch (submissionError) {
            console.error(submissionError)
            setError('No se pudo registrar el directorio. Intenta nuevamente más tarde.')
        } finally {
            setSaving(false)
        }
    }

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

    return (
        <div className="min-h-screen px-4 py-8">
            <section className="container mx-auto max-w-4xl">
                <Card className="overflow-hidden border border-rose-100 bg-white/80 shadow-sm dark:border-rose-900/50 dark:bg-slate-950/80">
                    <CardHeader className="bg-rose-50 dark:bg-rose-950/40 p-6">
                        <Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-100">
                            Registro de directorio
                        </Badge>
                        <CardTitle className="text-3xl">Nuevo centro de atención</CardTitle>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Registra el directorio con los datos necesarios para guardarlo en la base de datos.
                        </p>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid gap-4 md:grid-cols-2">
                                <fieldset className="space-y-2">
                                    <label htmlFor="nombre" className="block text-sm font-medium text-foreground">
                                        Nombre del centro
                                    </label>
                                    <Input
                                        id="nombre"
                                        type="text"
                                        value={nombre}
                                        onChange={(event) => setNombre(event.target.value)}
                                        placeholder="Nombre del centro"
                                        required
                                        className="w-full rounded-3xl px-4 py-3"
                                    />
                                </fieldset>

                                <fieldset className="space-y-2">
                                    <label htmlFor="telefono" className="block text-sm font-medium text-foreground">
                                        Teléfono
                                    </label>
                                    <div className="relative">
                                        <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
                                        <Input
                                            id="telefono"
                                            type="tel"
                                            value={telefono}
                                            onChange={(event) => setTelefono(event.target.value)}
                                            placeholder="Teléfono"
                                            required
                                            className="w-full rounded-3xl pl-11 pr-4"
                                        />
                                    </div>
                                </fieldset>

                                <fieldset className="space-y-2">
                                    <label htmlFor="correo" className="block text-sm font-medium text-foreground">
                                        Correo electrónico
                                    </label>
                                    <div className="relative">
                                        <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
                                        <Input
                                            id="correo"
                                            type="email"
                                            value={correo}
                                            onChange={(event) => setCorreo(event.target.value)}
                                            placeholder="Correo opcional"
                                            className="w-full rounded-3xl pl-11 pr-4"
                                        />
                                    </div>
                                </fieldset>

                                <fieldset className="space-y-2">
                                    <label htmlFor="horario" className="block text-sm font-medium text-foreground">
                                        Horario de atención
                                    </label>
                                    <div className="relative">
                                        <Clock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
                                        <Input
                                            id="horario"
                                            type="text"
                                            value={horario}
                                            onChange={(event) => setHorario(event.target.value)}
                                            placeholder="Ej. Lun a Vie 08:00 - 16:00"
                                            className="w-full rounded-3xl pl-11 pr-4"
                                        />
                                    </div>
                                </fieldset>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <fieldset className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">Estado</label>
                                    <Select value={selectedState} onValueChange={(value) => {
                                        setSelectedState(value)
                                        setSelectedMunicipality('')
                                    }} disabled={loadingLocation}>
                                        <SelectTrigger className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-left text-sm">
                                            <SelectValue placeholder={loadingLocation ? 'Cargando estados...' : 'Seleccione un estado'} />
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
                                </fieldset>

                                <fieldset className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">Municipio</label>
                                    <Select value={selectedMunicipality} onValueChange={setSelectedMunicipality} disabled={!selectedState || loadingLocation}>
                                        <SelectTrigger className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-left text-sm">
                                            <SelectValue placeholder={selectedState ? 'Seleccione un municipio' : 'Selecciona un estado primero'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Municipios</SelectLabel>
                                                {selectedState && listMunicipalities[selectedState] ? (
                                                    listMunicipalities[selectedState].map((municipio) => (
                                                        <SelectItem key={municipio} value={municipio}>
                                                            {municipio}
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <SelectItem value="loading-municipios" disabled>
                                                        Cargando municipios...
                                                    </SelectItem>
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </fieldset>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="direccion" className="block text-sm font-medium text-foreground">
                                    Dirección completa
                                </label>
                                <div className="relative">
                                    <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
                                    <Input
                                        id="direccion"
                                        type="text"
                                        value={direccion}
                                        onChange={(event) => setDireccion(event.target.value)}
                                        placeholder="Calle, número, zona"
                                        required
                                        className="w-full rounded-3xl pl-11 pr-4"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <fieldset className="space-y-2">
                                    <label htmlFor="foto" className="block text-sm font-medium text-foreground">
                                        URL de imagen
                                    </label>
                                    <div className="relative">
                                        <ImageIcon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
                                        <Input
                                            id="foto"
                                            type="url"
                                            value={foto}
                                            onChange={(event) => setFoto(event.target.value)}
                                            placeholder="https://"
                                            className="w-full rounded-3xl pl-11 pr-4"
                                        />
                                    </div>
                                </fieldset>

                                <fieldset className="space-y-2">
                                    <label htmlFor="descripcion" className="block text-sm font-medium text-foreground">
                                        Descripción
                                    </label>
                                    <textarea
                                        id="descripcion"
                                        value={descripcion}
                                        onChange={(event) => setDescripcion(event.target.value)}
                                        placeholder="Descripción breve del centro"
                                        rows={5}
                                        className="min-h-[140px] w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:bg-input/30"
                                    />
                                </fieldset>
                            </div>

                            {/* Servicios */}
                            <fieldset className="space-y-4">
                                <label className="block text-sm font-medium text-foreground">
                                    Servicios ofrecidos
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        value={nuevoServicio}
                                        onChange={(event) => setNuevoServicio(event.target.value)}
                                        placeholder="Agregar servicio"
                                        className="flex-1 rounded-3xl px-4 py-3"
                                        onKeyPress={(event) => event.key === 'Enter' && (event.preventDefault(), agregarServicio())}
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
                                    <div className="flex flex-wrap gap-2">
                                        {servicios.map((servicio, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="flex items-center gap-1 px-3 py-1"
                                            >
                                                {servicio}
                                                <button
                                                    type="button"
                                                    onClick={() => removerServicio(index)}
                                                    className="ml-1 hover:text-red-500"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </fieldset>

                            {/* Responsables */}
                            <fieldset className="space-y-4">
                                <label className="block text-sm font-medium text-foreground">
                                    <Users className="w-4 h-4 inline mr-2" />
                                    Responsables
                                </label>
                                <div className="grid gap-2 md:grid-cols-3">
                                    <Input
                                        type="text"
                                        value={nuevoResponsable.nombre}
                                        onChange={(event) => setNuevoResponsable({ ...nuevoResponsable, nombre: event.target.value })}
                                        placeholder="Nombre"
                                        className="rounded-3xl px-4 py-3"
                                    />
                                    <Input
                                        type="text"
                                        value={nuevoResponsable.cargo}
                                        onChange={(event) => setNuevoResponsable({ ...nuevoResponsable, cargo: event.target.value })}
                                        placeholder="Cargo"
                                        className="rounded-3xl px-4 py-3"
                                    />
                                    <Button
                                        type="button"
                                        onClick={agregarResponsable}
                                        variant="outline"
                                        className="rounded-3xl"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar
                                    </Button>
                                </div>
                                {responsables.length > 0 && (
                                    <div className="space-y-2">
                                        {responsables.map((responsable, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-3xl">
                                                <div>
                                                    <p className="font-medium">{responsable.nombre}</p>
                                                    <p className="text-sm text-muted-foreground">{responsable.cargo}</p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    onClick={() => removerResponsable(index)}
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <X className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </fieldset>

                            {/* Redes Sociales */}
                            <fieldset className="space-y-4">
                                <label className="block text-sm font-medium text-foreground">
                                    <Globe className="w-4 h-4 inline mr-2" />
                                    Redes sociales
                                </label>
                                <div className="grid gap-2 md:grid-cols-4">
                                    <Input
                                        type="text"
                                        value={nuevaRed.nombre}
                                        onChange={(event) => setNuevaRed({ ...nuevaRed, nombre: event.target.value })}
                                        placeholder="Nombre (ej. Facebook)"
                                        className="rounded-3xl px-4 py-3"
                                    />
                                    <Input
                                        type="url"
                                        value={nuevaRed.url}
                                        onChange={(event) => setNuevaRed({ ...nuevaRed, url: event.target.value })}
                                        placeholder="URL"
                                        className="rounded-3xl px-4 py-3"
                                    />
                                    <Input
                                        type="text"
                                        value={nuevaRed.icono}
                                        onChange={(event) => setNuevaRed({ ...nuevaRed, icono: event.target.value })}
                                        placeholder="Ícono (opcional)"
                                        className="rounded-3xl px-4 py-3"
                                    />
                                    <Button
                                        type="button"
                                        onClick={agregarRed}
                                        variant="outline"
                                        className="rounded-3xl"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Agregar
                                    </Button>
                                </div>
                                {redes.length > 0 && (
                                    <div className="space-y-2">
                                        {redes.map((red, index) => (
                                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-3xl">
                                                <div>
                                                    <p className="font-medium">{red.nombre}</p>
                                                    <p className="text-sm text-muted-foreground">{red.url}</p>
                                                    {red.icono && <p className="text-xs text-muted-foreground">Ícono: {red.icono}</p>}
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
                                )}
                            </fieldset>

                            <div className="space-y-4">
                                <Button
                                    type="submit"
                                    className="rounded-3xl bg-rose-600 text-white hover:bg-rose-700"
                                    disabled={saving || loadingLocation}
                                >
                                    {saving ? 'Guardando...' : 'Registrar directorio'}
                                </Button>

                                {error ? (
                                    <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                                        {error}
                                    </div>
                                ) : null}

                                {message ? (
                                    <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                                        {message}
                                    </div>
                                ) : null}
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </section>
        </div>
    )
}
