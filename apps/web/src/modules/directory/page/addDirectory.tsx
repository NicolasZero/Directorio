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
import { Link } from 'react-router'

// ─── Sub-components ────────────────────────────────────────────────────────────

function FormField({ label, htmlFor, children }: { label: string; htmlFor?: string; children: React.ReactNode }) {
    return (
        <fieldset className="space-y-2">
            <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
                {label}
            </label>
            {children}
        </fieldset>
    )
}

function IconInput({ icon: Icon, ...props }: React.ComponentProps<typeof Input> & { icon: React.ElementType }) {
    return (
        <div className="relative">
            <Icon className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />
            <Input {...props} className="w-full rounded-3xl pl-11 pr-4" />
        </div>
    )
}

function SectionHeader({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description?: string }) {
    return (
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-rose-600 dark:text-rose-100" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-foreground">{title}</h2>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>
        </div>
    )
}

// ─── Main Component ─────────────────────────────────────────────────────────────

export default function AddDirectory() {
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
        saving,
        message,
        error,
        servicios,
        nuevoServicio, setNuevoServicio,
        responsables,
        nuevoResponsable, setNuevoResponsable,
        redes,
        nuevaRed, setNuevaRed,
        agregarServicio, removerServicio,
        agregarResponsable, removerResponsable,
        agregarRed, removerRed,
        handleSubmit,
    } = useDirectoryForm()

    const { listStates, listMunicipalities, loadingLocation, error: locationError } = useLocations()

    const formError = error || locationError

    return (
        <div className="min-h-screen">
            <form onSubmit={handleSubmit}>
                <section className="py-10 px-4 sm:px-8">
                    <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
                        <Badge
                            variant="outline"
                            className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50"
                        >
                            <Building2 className="w-3 h-3 mr-1" />
                            Registro de directorio
                        </Badge>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/admin/directorio">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver al directorio
                            </Link>
                        </Button>
                    </div>
                    <div className="flex flex-col lg:flex-row items-start gap-8">
                        {/* Left: Title + basic fields */}
                        <div className="flex-1 space-y-6">
                            <div>
                                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2">
                                    Nuevo centro de atención
                                </h1>
                                <p className="text-muted-foreground">
                                    Completa los datos para registrar el centro en el directorio.
                                </p>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField label="Nombre del centro" htmlFor="nombre">
                                    <Input
                                        id="nombre"
                                        type="text"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        placeholder="Nombre del centro"
                                        required
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
                                        required
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
                            </div>
                        </div>

                        {/* Right: Contact card preview (location + address) */}
                        <Card className="w-full lg:w-80 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg">Ubicación</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <FormField label="Estado">
                                    <Select
                                        value={selectedState}
                                        onValueChange={(value) => {
                                            setSelectedState(value)
                                            setSelectedMunicipality('')
                                        }}
                                        disabled={loadingLocation}
                                    >
                                        <SelectTrigger className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-left text-sm">
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

                                <FormField label="Municipio">
                                    <Select
                                        value={selectedMunicipality}
                                        onValueChange={setSelectedMunicipality}
                                        disabled={!selectedState || loadingLocation}
                                    >
                                        <SelectTrigger className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-left text-sm">
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

                                <FormField label="Dirección completa" htmlFor="direccion">
                                    <IconInput
                                        id="direccion"
                                        icon={MapPin}
                                        type="text"
                                        value={direccion}
                                        onChange={(e) => setDireccion(e.target.value)}
                                        placeholder="Calle, número, zona"
                                        required
                                    />
                                </FormField>

                                <FormField label="URL de imagen" htmlFor="foto">
                                    <IconInput
                                        id="foto"
                                        icon={ImageIcon}
                                        type="url"
                                        value={foto}
                                        onChange={(e) => setFoto(e.target.value)}
                                        placeholder="https://"
                                    />
                                </FormField>
                            </CardContent>
                        </Card>
                    </div>

                </section>

                {/* ── Description ───────────────────────────────────────────── */}
                <section className="py-8 px-4 sm:px-8 bg-muted/30">
                    <div className="max-w-[90vw] mx-auto">
                        <SectionHeader icon={FileText} title="Descripción" description="Información general del centro" />
                        <textarea
                            id="descripcion"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            placeholder="Descripción breve del centro de atención"
                            rows={4}
                            className="min-h-[120px] w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-sm text-foreground transition-colors outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 dark:bg-input/30"
                        />
                    </div>
                </section>

                {/* ── Servicios ─────────────────────────────────────────────── */}
                <section className="py-12 px-4 sm:px-8">
                    <SectionHeader
                        icon={FileText}
                        title="Servicios Disponibles"
                        description="Agrega los servicios que ofrece el centro"
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

                {/* ── Responsables y Redes ──────────────────────────────────── */}
                <section className="py-12 px-4 sm:px-8 bg-muted/30">
                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Responsables */}
                        <div>
                            <SectionHeader
                                icon={Users}
                                title="Equipo Responsable"
                                description="Personas a cargo del centro"
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
                        </div>

                        {/* Redes Sociales */}
                        <div>
                            <SectionHeader
                                icon={Globe}
                                title="Redes Sociales"
                                description="Perfiles y sitios web del centro"
                            />

                            <div className="grid gap-2 mb-4">
                                <Input
                                    type="text"
                                    value={nuevaRed.nombre}
                                    onChange={(e) => setNuevaRed({ ...nuevaRed, nombre: e.target.value })}
                                    placeholder="Nombre (ej. Facebook)"
                                    className="rounded-3xl px-4 py-3"
                                />
                                <Input
                                    type="url"
                                    value={nuevaRed.url}
                                    onChange={(e) => setNuevaRed({ ...nuevaRed, url: e.target.value })}
                                    placeholder="URL"
                                    className="rounded-3xl px-4 py-3"
                                />
                                {/* <Input
                                    type="text"
                                    value={nuevaRed.icono}
                                    onChange={(e) => setNuevaRed({ ...nuevaRed, icono: e.target.value })}
                                    placeholder="Ícono (opcional)"
                                    className="rounded-3xl px-4 py-3"
                                /> */}
                                <Select
                                    value={nuevaRed.icono}
                                    onValueChange={(value) => setNuevaRed({ ...nuevaRed, icono: value })}
                                >
                                    <SelectTrigger className="rounded-3xl px-4 py-3 w-full">
                                        <SelectValue placeholder="Nombre de la red social" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="facebook">Facebook</SelectItem>
                                        <SelectItem value="instagram">Instagram</SelectItem>
                                        <SelectItem value="twitter">Twitter</SelectItem>
                                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                                        <SelectItem value="tiktok">TikTok</SelectItem>
                                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                                        <SelectItem value="youtube">YouTube</SelectItem>
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
                                            {red.icono === 'facebook' && <FacebookLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                            {red.icono === 'instagram' && <InstagramLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                            {red.icono === 'twitter' && <TwitterLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                            {red.icono === 'whatsapp' && <WhatsappLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                            {red.icono === 'tiktok' && <TiktokLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                            {red.icono === 'linkedin' && <LinkedinLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                            {red.icono === 'youtube' && <YoutubeLogoIcon className="w-6 h-6 text-rose-600 dark:text-rose-100" />}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium">{red.nombre}</p>
                                            <p className="text-sm text-muted-foreground truncate">{red.url}</p>
                                            {/* {red.icono && (
                                                <p className="text-xs text-muted-foreground">Ícono: {red.icono}</p>
                                            )} */}
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
                        </div>
                    </div>
                </section>

                {/* ── Submit ────────────────────────────────────────────────── */}
                <section className="py-10 px-4 sm:px-8">
                    <div className="flex flex-col gap-4 max-w-md">
                        <Button
                            type="submit"
                            className="rounded-3xl bg-rose-600 text-white hover:bg-rose-700"
                            disabled={saving || loadingLocation}
                        >
                            <AlertCircle className="w-4 h-4 mr-2" />
                            {saving ? 'Guardando...' : 'Registrar directorio'}
                        </Button>

                        {formError && (
                            <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
                                {formError}
                            </div>
                        )}

                        {message && (
                            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
                                {message}
                            </div>
                        )}
                    </div>
                </section>
            </form>
        </div>
    )
}
