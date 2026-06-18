import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
    ArrowLeft,
} from 'lucide-react'
import { useDirectoryForm } from '../hooks/useDirectoryForm'
import { useLocations } from '../hooks/useLocations'
import { FacebookLogoIcon, InstagramLogoIcon, TwitterLogoIcon, WhatsappLogoIcon, TiktokLogoIcon, LinkedinLogoIcon, YoutubeLogoIcon } from '@phosphor-icons/react'
import { Link, useNavigate, useParams } from 'react-router'
import { Textarea } from '@/components/ui/textarea'
import FormField from '@/components/formField'
import SectionHeader from '@/components/sectionHeader'
import IconInput from '@/components/iconinput'

export default function AddDirectory() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const isEdit = Boolean(id)

    const {
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
        agregarServicio, removerServicio,
        agregarResponsable, removerResponsable,
        agregarRed, removerRed,
        agregarRequisito, removerRequisito,
        handleSubmit,
    } = useDirectoryForm()

    const { listStates, listMunicipalities, loadingLocation, error: locationError } = useLocations()
    const [loading, setLoading] = useState(isEdit)

    // Load data if in edit mode
    useEffect(() => {
        if (!id) return

        const fetchDirectory = async () => {
            setLoading(true)
            setError('')
            setMessage('')

            try {
                const response = await fetch(`/api/directory/${id}`)
                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data?.error || 'No se pudo cargar el directorio')
                }

                const directorio = data?.data

                setNombre(directorio.nombre || '')
                setDescripcion(directorio.descripcion || '')
                setDireccion(directorio.direccion || '')
                setTelefono(directorio.telefono || '')
                setCorreo(directorio.correo || '')
                setFoto(directorio.foto || '')
                setHorario(directorio.horario || '')
                setSelectedState(directorio.estado || '')
                setSelectedMunicipality(directorio.municipio || '')
                setServicios(directorio.servicios || [])
                setResponsables(directorio.responsables || [])
                setRedes(directorio.redes || [])
                setRequisitos(directorio.requisitos || [])
            } catch (fetchError) {
                console.error(fetchError)
                setError('No se pudo cargar el directorio. Intenta de nuevo más tarde.')
            } finally {
                setLoading(false)
            }
        }

        fetchDirectory()
    }, [id])

    const handleFormSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        setError('')
        setMessage('')

        if (!isEdit) {
            await handleSubmit(event)
            return
        }

        if (!nombre || !direccion || !telefono || !selectedState || !selectedMunicipality) {
            setError('Por favor completa todos los campos obligatorios.')
            return
        }

        setSaving(true)

        try {
            const response = await fetch(`/api/directory/${id}`, {
                method: 'PUT',
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
                throw new Error(data?.error || 'Error al actualizar el directorio.')
            }

            setMessage('Directorio actualizado correctamente.')
        } catch (submissionError) {
            console.error(submissionError)
            setError('No se pudo actualizar el directorio. Intenta nuevamente más tarde.')
        } finally {
            setSaving(false)
        }
    }

    const formError = error || locationError

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="text-center">
                    <p className="text-lg font-medium">Cargando información del directorio...</p>
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
                            {isEdit ? 'Editar directorio' : 'Registro de directorio'}
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/admin/directorio">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al directorio
                            </Link>
                        </Button>
                    </div>

                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                        {isEdit ? 'Editar centro de atención' : 'Nuevo centro de atención'}
                    </h1>

                    <p className="text-muted-foreground">
                        {isEdit
                            ? 'Modifica los datos y guarda los cambios para el directorio.'
                            : 'Completa los datos para registrar el centro en el directorio.'}
                    </p>
                </header>

                <fieldset className="px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-2 items-start gap-8">
                    {/* datos generales */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="col-span-2">
                            <SectionHeader
                                icon={Building2}
                                title="Datos Generales"
                                description="Información básica del centro"
                            />
                        </div>

                        <FormField label="Nombre del centro" htmlFor="nombre">
                            <Input
                                id="nombre"
                                type="text"
                                value={nombre}
                                onChange={(e) => setNombre(e.target.value)}
                                placeholder="Nombre del centro"
                                // required
                                className="w-full rounded-3xl px-4 py-3"
                            />
                        </FormField>

                        <FormField label="Teléfono" htmlFor="telefono">
                            <IconInput
                                id="telefono"
                                icon={Phone}
                                type="tel"
                                value={telefono}
                                onChange={(e) => setTelefono(e.target.value)}
                                placeholder="Teléfono"
                            // required
                            />
                        </FormField>

                        <FormField label="Correo electrónico" htmlFor="correo">
                            <IconInput
                                id="correo"
                                icon={Mail}
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                placeholder="Correo opcional"
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

                        <FormField label="URL de imagen" htmlFor="foto" className='col-span-2'>
                            <IconInput
                                id="foto"
                                icon={ImageIcon}
                                type="url"
                                value={foto}
                                onChange={(e) => setFoto(e.target.value)}
                                placeholder="https://"
                            />
                        </FormField>
                    </div>

                    {/* Ubicación */}
                    <div className='grid gap-4 md:grid-cols-2'>
                        <SectionHeader
                            className='col-span-2'
                            icon={Building2}
                            title="Ubicación"
                            description="Información de la ubicación del centro"
                        />

                        <FormField label="Estado" htmlFor="estado">
                            <Select
                                value={selectedState}
                                onValueChange={(value) => {
                                    setSelectedState(value)
                                    setSelectedMunicipality('')
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
                                onValueChange={setSelectedMunicipality}
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
                        </FormField>

                        <FormField label="Dirección completa" htmlFor="direccion" className='col-span-2'>
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
                    </div>
                </fieldset>

                {/* ── Description ───────────────────────────────────────────── */}
                <fieldset className="p-4 sm:p-8 bg-muted/30 space-y-4">
                    <SectionHeader icon={FileText} title="Descripción" />
                    <Textarea
                        name="descripcion"
                        value={descripcion}
                        onChange={(e) => setDescripcion(e.target.value)}
                        placeholder="Descripción breve del centro de atención"
                    />
                </fieldset>

                <fieldset className='grid grid-cols-1 sm:grid-cols-2 gap-8'>
                    {/* ── Servicios ─────────────────────────────────────────────── */}
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

                    {/* Requisitos de atencion */}
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

                {/* ── Responsables y Redes ──────────────────────────────────── */}
                <fieldset className="py-12 px-4 sm:px-8 bg-muted grid lg:grid-cols-2 gap-8">
                    {/* Responsables */}
                    <section>
                        <SectionHeader
                            icon={Users}
                            title="Equipo Responsable"
                            description="Personas a cargo del centro"
                            className='mb-3'
                        />

                        <div className="grid gap-2 sm:grid-cols-2 mb-4">
                            <Input
                                type="text"
                                value={nuevoResponsable.nombre}
                                onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, nombre: e.target.value })}
                                placeholder="Nombre"
                                className="rounded-3xl px-4 py-3"
                            />
                            <Input
                                type="text"
                                value={nuevoResponsable.cargo}
                                onChange={(e) => setNuevoResponsable({ ...nuevoResponsable, cargo: e.target.value })}
                                placeholder="Cargo"
                                className="rounded-3xl px-4 py-3"
                            />
                            <Button
                                type="button"
                                onClick={agregarResponsable}
                                variant="outline"
                                className="rounded-3xl sm:col-span-2"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar responsable
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {responsables.map((responsable, index) => (
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-background">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                                        <Users className="w-6 h-6 text-rose-600 dark:text-rose-100" />
                                    </div>
                                    <div className="flex-1">
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
                    </section>

                    {/* Redes Sociales */}
                    <section>
                        <SectionHeader
                            icon={Globe}
                            title="Redes Sociales"
                            description="Perfiles y sitios web del centro"
                            className='mb-3'
                        />

                        <div className="grid gap-2 mb-4">
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
                                <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-background">
                                    <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                                        {red.icono === 'Facebook' && <FacebookLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Instagram' && <InstagramLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Twitter' && <TwitterLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Whatsapp' && <WhatsappLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Tiktok' && <TiktokLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Linkedin' && <LinkedinLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        {red.icono === 'Youtube' && <YoutubeLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                    </div>
                                    <div className="flex-1">
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

                {/* ── Submit ────────────────────────────────────────────────── */}
                <section className="p-4 sm:p-8 space-y-4">
                    <div className="flex flex-row gap-4 max-w-md">
                        <Button
                            type="submit"
                            className="rounded-3xl bg-rose-600 text-white hover:bg-rose-700"
                            disabled={saving || loadingLocation}
                        >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {saving ? 'Guardando...' : isEdit ? 'Actualizar directorio' : 'Registrar directorio'}
                        </Button>

                        {isEdit && (
                            <Button type="button" variant="outline" onClick={() => navigate('/admin/directorio')}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver sin guardar
                            </Button>
                        )}
                    </div>

                    {(formError || message) && (
                        <div className={`flex justify-between items-center rounded-3xl border px-4 py-3 text-sm ${formError ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950 dark:text-red-400' : 'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'}`}>
                            {formError ? formError : message}
                            <Button type="button" size="sm" variant="ghost" className="ml-2" onClick={() => { setError(''), setMessage('') }}><X /></Button>
                        </div>
                    )}
                </section>
            </form>
        </>
    )
}
