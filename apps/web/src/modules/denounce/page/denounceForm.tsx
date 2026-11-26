import { useState, type SubmitEvent, type ReactNode } from 'react'
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useLocations } from '@/modules/directory/hooks/useLocations'

type Identification = 'datos' | 'sin-cedula' | 'anonimo'

type DenounceFormData = {
    identification: Identification | ''
    documentType: 'V' | 'E'
    documentNumber: string
    name: string
    age: string
    state: string
    municipality: string
    parish: string
    reference: string
    phone: string
    email: string
    safeToCall: boolean | null
    safeWhatsapp: boolean | null
    safeTimes: string[]
    situations: string[]
    relationship: string
    knowsAggressor: string
    aggressorName: string
    livesTogether: string
    weaponsOrThreats: string
    childrenAtHome: string
    isSafeNow: string
    details: string
}

type FormResponse = {
    data?: {
        caseCode?: unknown
        secretKey?: unknown
    }
    error?: unknown
}

const steps = [
    { title: 'Sobre ti', question: '¿Cómo quieres identificarte?' },
    { title: 'Dónde estás', question: '¿En qué parte de Venezuela estás?' },
    { title: 'Contacto seguro', question: '¿Cómo podemos comunicarnos contigo?' },
    { title: 'Qué está pasando', question: '¿Qué tipo de situación estás viviendo?' },
    { title: 'Tu seguridad', question: 'Cuéntanos sobre la persona y tu seguridad' },
    { title: 'Lo que ocurrió', question: 'Cuéntanos lo que quieras compartir' },
]

const initialForm: DenounceFormData = {
    identification: '',
    documentType: 'V',
    documentNumber: '',
    name: '',
    age: '',
    state: '',
    municipality: '',
    parish: '',
    reference: '',
    phone: '',
    email: '',
    safeToCall: null,
    safeWhatsapp: null,
    safeTimes: [],
    situations: [],
    relationship: '',
    knowsAggressor: '',
    aggressorName: '',
    livesTogether: '',
    weaponsOrThreats: '',
    childrenAtHome: '',
    isSafeNow: '',
    details: '',
}

const situations = [
    'Violencia física',
    'Violencia psicológica',
    'Violencia en redes sociales',
    'Violencia sexual',
    'Violencia económica',
    'Acoso o persecución',
    'Amenaza de muerte o daño',
    'Daño a través de mis hijos',
]

const supportRequests = [
    { label: 'Medidas de protección', text: 'Solicito medidas de protección urgentes.' },
    { label: 'Apoyo psicológico', text: 'Requiero orientación y apoyo psicológico.' },
    { label: 'Asesoría legal', text: 'Necesito asistencia y representación legal gratuita.' },
    { label: 'No puedo salir', text: 'El agresor no me deja salir ni comunicarme.' },
]

const radioClass =
    'flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border border-border bg-background px-4 py-3 text-left text-base transition-colors hover:border-primary/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5 focus-within:ring-2 focus-within:ring-ring'

function ChoiceGroup({
    name,
    options,
    value,
    onChange,
}: {
    name: string
    options: string[]
    value: string
    onChange: (value: string) => void
}) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
                <label key={option} className={radioClass}>
                    <input
                        className="size-5 accent-primary"
                        type="radio"
                        name={name}
                        value={option}
                        checked={value === option}
                        onChange={() => onChange(option)}
                    />
                    <span>{option}</span>
                </label>
            ))}
        </div>
    )
}

function CheckGroup({
    name,
    options,
    value,
    onChange,
}: {
    name: string
    options: string[]
    value: string[]
    onChange: (value: string[]) => void
}) {
    const toggleOption = (option: string) => {
        onChange(value.includes(option) ? value.filter((item) => item !== option) : [...value, option])
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
                <label key={option} className={radioClass}>
                    <input
                        className="size-5 accent-primary"
                        type="checkbox"
                        name={name}
                        value={option}
                        checked={value.includes(option)}
                        onChange={() => toggleOption(option)}
                    />
                    <span>{option}</span>
                </label>
            ))}
        </div>
    )
}

function Field({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string
    htmlFor?: string
    hint?: string
    children: ReactNode
}) {
    return (
        <div className="space-y-2">
            <label htmlFor={htmlFor} className="block text-base font-semibold">
                {label}
            </label>
            {hint && <p className="text-sm text-muted-foreground">{hint}</p>}
            {children}
        </div>
    )
}

function isRecord(value: unknown): value is FormResponse {
    return typeof value === 'object' && value !== null
}

export default function DenounceForm() {
    const [form, setForm] = useState(initialForm)
    const [step, setStep] = useState(0)
    const [errors, setErrors] = useState<string[]>([])
    const [submitError, setSubmitError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [confirmation, setConfirmation] = useState<{ caseCode: string; secretKey: string } | null>(null)
    const { listStates, listMunicipalities, listParishes, loadingLocation, error: locationError } = useLocations()

    const updateForm = <K extends keyof DenounceFormData>(key: K, value: DenounceFormData[K]) => {
        setForm((current) => ({ ...current, [key]: value }))
        setErrors([])
        setSubmitError('')
    }

    const validateStep = (stepToValidate: number) => {
        const messages: string[] = []

        if (stepToValidate === 0) {
            if (!form.identification) messages.push('Elige cómo quieres identificarte.')
            if (
                form.identification === 'datos' &&
                (!/^\d+$/.test(form.documentNumber.trim()) || Number(form.documentNumber) < 1)
            ) {
                messages.push('Escribe tu número de cédula usando solo números.')
            }
            if (form.identification !== 'anonimo' && !form.name.trim()) {
                messages.push('Escribe tu nombre, apellido o un apodo.')
            }
            const age = Number(form.age)
            if (!form.age || !Number.isInteger(age) || age < 10 || age > 120) {
                messages.push('Escribe una edad válida. Este formulario es para personas de 10 años o más.')
            }
        }

        if (stepToValidate === 1) {
            if (!form.state) messages.push('Elige el estado donde estás.')
            if (!form.municipality) messages.push('Elige tu municipio.')
        }

        if (stepToValidate === 2 && !form.phone.trim()) {
            messages.push('Escribe un número de teléfono para poder contactarte.')
        }
        if (stepToValidate === 2 && form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            messages.push('Revisa el correo electrónico o déjalo vacío si no quieres compartirlo.')
        }

        if (stepToValidate === 3 && form.situations.length === 0) {
            messages.push('Elige al menos una situación. Puedes marcar varias.')
        }

        if (stepToValidate === 4) {
            if (!form.relationship) messages.push('Elige qué relación tiene esa persona contigo.')
            if (!form.knowsAggressor) messages.push('Dinos si conoces su nombre o apodo.')
            if (form.knowsAggressor === 'Sí, lo conozco' && !form.aggressorName.trim()) {
                messages.push('Escribe el nombre o apodo, si lo sabes.')
            }
            if (!form.livesTogether) messages.push('Cuéntanos si viven en la misma casa.')
            if (!form.weaponsOrThreats) messages.push('Elige una respuesta sobre armas o amenazas.')
            if (form.childrenAtHome === '' || !Number.isInteger(Number(form.childrenAtHome)) || Number(form.childrenAtHome) < 0) {
                messages.push('Escribe cuántos niños, niñas o adolescentes viven en tu hogar. Si no hay, escribe 0.')
            }
            if (!form.isSafeNow) messages.push('Dinos si estás en un lugar seguro ahora.')
        }

        if (stepToValidate === 5 && !form.details.trim()) {
            messages.push('Escribe algo sobre lo que ocurrió o qué ayuda necesitas.')
        }

        return messages
    }

    const goToNextStep = () => {
        const messages = validateStep(step)
        if (messages.length) {
            setErrors(messages)
            return
        }
        setErrors([])
        setStep((current) => Math.min(current + 1, steps.length - 1))
    }

    const addSupportRequest = (text: string) => {
        const separator = form.details.trim() ? '\n' : ''
        updateForm('details', `${form.details.trimEnd()}${separator}${text}`)
    }

    const handleSubmit = async (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()
        const messages = validateStep(step)
        if (messages.length) {
            setErrors(messages)
            return
        }

        setIsSubmitting(true)
        setSubmitError('')
        try {
            const response = await fetch('/api/denounce', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            })
            const result: unknown = await response.json()

            if (!response.ok) {
                throw new Error('No pudimos enviar tu solicitud. Inténtalo de nuevo más tarde.')
            }

            if (
                !isRecord(result) ||
                !isRecord(result.data) ||
                typeof result.data.caseCode !== 'string' ||
                !result.data.caseCode.trim() ||
                typeof result.data.secretKey !== 'string' ||
                !/^\d{5}$/.test(result.data.secretKey)
            ) {
                throw new Error('El servidor recibió una respuesta que no pudimos confirmar. Contacta a una persona de confianza.')
            }

            setConfirmation({ caseCode: result.data.caseCode, secretKey: result.data.secretKey })
        } catch (error) {
            setSubmitError(
                error instanceof TypeError
                    ? 'No pudimos conectar con el servicio para enviar tu solicitud. Tus respuestas no se guardaron. Inténtalo más tarde o pide ayuda a una persona de confianza.'
                    : error instanceof Error
                      ? error.message
                      : 'Ocurrió un problema al enviar tu solicitud. Inténtalo de nuevo.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    if (confirmation) {
        return (
            <Card className="mx-auto max-w-2xl border-emerald-200">
                <CardContent className="space-y-5 p-6 text-center sm:p-10">
                    <CheckCircle2 aria-hidden="true" className="mx-auto size-14 text-emerald-600" />
                    <h1 className="text-2xl font-bold">Recibimos tu solicitud</h1>
                    <p className="text-muted-foreground">
                        Guarda estos datos en un lugar seguro. Los necesitarás para consultar el avance de tu caso.
                    </p>
                    <div className="grid gap-4 rounded-xl bg-muted p-5 text-left sm:grid-cols-2">
                        <div>
                            <p className="text-sm text-muted-foreground">Código de caso</p>
                            <p className="break-all text-xl font-bold">{confirmation.caseCode}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Llave secreta</p>
                            <p className="text-xl font-bold tracking-widest">{confirmation.secretKey}</p>
                        </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        Si no estás a salvo ahora, busca a una persona adulta de confianza o un lugar seguro.
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="mx-auto max-w-3xl">
            <CardContent className="space-y-7 p-5 sm:p-8">
                <header className="space-y-4">
                    <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
                        <ShieldCheck aria-hidden="true" className="mt-0.5 size-6 shrink-0 text-primary" />
                        <div>
                            <p className="font-semibold">Tú decides qué compartir</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Responde con calma. Si no sabes una respuesta, puedes dejarla sin contestar cuando sea opcional.
                                Si estás en peligro ahora, busca a una persona adulta de confianza o un lugar seguro.
                            </p>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Paso {step + 1} de {steps.length}
                        </p>
                        <div
                            className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                            role="progressbar"
                            aria-label="Avance del formulario"
                            aria-valuemin={1}
                            aria-valuemax={steps.length}
                            aria-valuenow={step + 1}
                        >
                            <div
                                className="h-full rounded-full bg-primary transition-all"
                                style={{ width: `${((step + 1) / steps.length) * 100}%` }}
                            />
                        </div>
                        <h1 className="mt-5 text-2xl font-bold">{steps[step].question}</h1>
                    </div>
                </header>

                {errors.length > 0 && (
                    <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                        <p className="font-semibold">Revisa estas respuestas:</p>
                        <ul className="mt-2 list-inside list-disc space-y-1">
                            {errors.map((error) => <li key={error}>{error}</li>)}
                        </ul>
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                    {step === 0 && (
                        <div className="space-y-6">
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">¿Cómo prefieres identificarte?</legend>
                                <ChoiceGroup
                                    name="identification"
                                    options={['Dar mis datos', 'No tengo cédula', 'Prefiero no decir']}
                                    value={
                                        form.identification === 'datos'
                                            ? 'Dar mis datos'
                                            : form.identification === 'sin-cedula'
                                              ? 'No tengo cédula'
                                              : form.identification === 'anonimo'
                                                ? 'Prefiero no decir'
                                                : ''
                                    }
                                    onChange={(value) =>
                                        updateForm(
                                            'identification',
                                            value === 'Dar mis datos'
                                                ? 'datos'
                                                : value === 'No tengo cédula'
                                                  ? 'sin-cedula'
                                                  : 'anonimo',
                                        )
                                    }
                                />
                            </fieldset>

                            {form.identification === 'datos' && (
                                <Field label="Documento de identidad" htmlFor="documentNumber">
                                    <div className="flex gap-3">
                                        <select
                                            aria-label="Tipo de documento"
                                            className="h-12 rounded-lg border border-input bg-background px-3 text-base"
                                            value={form.documentType}
                                            onChange={(event) => updateForm('documentType', event.target.value as 'V' | 'E')}
                                        >
                                            <option value="V">V</option>
                                            <option value="E">E</option>
                                        </select>
                                        <Input
                                            id="documentNumber"
                                            type="number"
                                            min={1}
                                            step={1}
                                            inputMode="numeric"
                                            autoComplete="off"
                                            placeholder="Número de cédula"
                                            value={form.documentNumber}
                                            onChange={(event) => updateForm('documentNumber', event.target.value)}
                                            className="h-12"
                                        />
                                    </div>
                                </Field>
                            )}

                            {form.identification !== '' && form.identification !== 'anonimo' && (
                                <Field label="Dinos tu nombre y apellido (o un apodo)" htmlFor="name">
                                    <Input
                                        id="name"
                                        autoComplete="name"
                                        value={form.name}
                                        onChange={(event) => updateForm('name', event.target.value)}
                                        className="h-12"
                                    />
                                </Field>
                            )}

                            <Field label="¿Qué edad tienes?" htmlFor="age">
                                <Input
                                    id="age"
                                    type="number"
                                    min={10}
                                    max={120}
                                    inputMode="numeric"
                                    value={form.age}
                                    onChange={(event) => updateForm('age', event.target.value)}
                                    className="h-12 max-w-xs"
                                />
                            </Field>
                        </div>
                    )}

                    {step === 1 && (
                        <div className="space-y-6">
                            {locationError && (
                                <p role="alert" className="rounded-xl border border-destructive/30 p-4 text-sm">
                                    {locationError}
                                </p>
                            )}
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">Estado</legend>
                                {loadingLocation ? (
                                    <p className="text-sm text-muted-foreground">Cargando estados...</p>
                                ) : (
                                    <ChoiceGroup
                                        name="state"
                                        options={listStates}
                                        value={form.state}
                                        onChange={(state) => {
                                            updateForm('state', state)
                                            updateForm('municipality', '')
                                            updateForm('parish', '')
                                        }}
                                    />
                                )}
                            </fieldset>
                            {form.state && (
                                <fieldset className="space-y-3">
                                    <legend className="mb-3 text-base font-semibold">Municipio</legend>
                                    <ChoiceGroup
                                        name="municipality"
                                        options={listMunicipalities[form.state] || []}
                                        value={form.municipality}
                                        onChange={(municipality) => {
                                            updateForm('municipality', municipality)
                                            updateForm('parish', '')
                                        }}
                                    />
                                </fieldset>
                            )}
                            {form.municipality && (
                                <fieldset className="space-y-3">
                                    <legend className="mb-3 text-base font-semibold">Parroquia (opcional)</legend>
                                    <p className="text-sm text-muted-foreground">
                                        Si no la sabes, puedes dejar este espacio sin seleccionar.
                                    </p>
                                    {listParishes[form.state]?.[form.municipality]?.length ? (
                                        <ChoiceGroup
                                            name="parish"
                                            options={listParishes[form.state][form.municipality]}
                                            value={form.parish}
                                            onChange={(parish) => updateForm('parish', parish)}
                                        />
                                    ) : (
                                        <p role="status" className="text-sm text-muted-foreground">
                                            No hay parroquias registradas para este municipio.
                                        </p>
                                    )}
                                </fieldset>
                            )}
                            <Field label="Comunidad o punto de referencia (opcional)" htmlFor="reference">
                                <Input
                                    id="reference"
                                    value={form.reference}
                                    onChange={(event) => updateForm('reference', event.target.value)}
                                    className="h-12"
                                />
                            </Field>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <Field label="¿Cuál es tu número de teléfono?" htmlFor="phone" hint="Escribe un número donde podamos comunicarnos contigo.">
                                <Input
                                    id="phone"
                                    type="tel"
                                    autoComplete="tel"
                                    value={form.phone}
                                    onChange={(event) => updateForm('phone', event.target.value)}
                                    className="h-12"
                                />
                            </Field>
                            <Field label="¿Cuál es tu correo? (opcional)" htmlFor="email">
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    value={form.email}
                                    onChange={(event) => updateForm('email', event.target.value)}
                                    className="h-12"
                                />
                            </Field>
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">¿Es seguro llamarte por teléfono?</legend>
                                <ChoiceGroup
                                    name="safeToCall"
                                    options={['Sí', 'No']}
                                    value={form.safeToCall === null ? '' : form.safeToCall ? 'Sí' : 'No'}
                                    onChange={(value) => updateForm('safeToCall', value === 'Sí')}
                                />
                            </fieldset>
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">¿Es seguro escribirte por WhatsApp?</legend>
                                <ChoiceGroup
                                    name="safeWhatsapp"
                                    options={['Sí', 'No']}
                                    value={form.safeWhatsapp === null ? '' : form.safeWhatsapp ? 'Sí' : 'No'}
                                    onChange={(value) => updateForm('safeWhatsapp', value === 'Sí')}
                                />
                            </fieldset>
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">¿En qué momento del día es más seguro contactarte?</legend>
                                <CheckGroup
                                    name="safeTimes"
                                    options={['En las mañanas', 'En las tardes', 'En las noches']}
                                    value={form.safeTimes}
                                    onChange={(value) => updateForm('safeTimes', value)}
                                />
                            </fieldset>
                        </div>
                    )}

                    {step === 3 && (
                        <fieldset className="space-y-3">
                            <legend className="mb-3 text-base font-semibold">
                                Marca todas las opciones que se parezcan a lo que estás viviendo.
                            </legend>
                            <CheckGroup
                                name="situations"
                                options={situations}
                                value={form.situations}
                                onChange={(value) => updateForm('situations', value)}
                            />
                        </fieldset>
                    )}

                    {step === 4 && (
                        <div className="space-y-6">
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">¿Qué relación tiene esa persona contigo?</legend>
                                <ChoiceGroup
                                    name="relationship"
                                    options={['Pareja actual', 'Expareja', 'Familiar', 'Vecino', 'Laboral o docente', 'No la conozco / otra']}
                                    value={form.relationship}
                                    onChange={(value) => updateForm('relationship', value)}
                                />
                            </fieldset>
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">¿Conoces el nombre o apodo de esa persona?</legend>
                                <ChoiceGroup
                                    name="knowsAggressor"
                                    options={['Sí, lo conozco', 'No lo conozco', 'No puedo decir']}
                                    value={form.knowsAggressor}
                                    onChange={(value) => updateForm('knowsAggressor', value)}
                                />
                            </fieldset>
                            {form.knowsAggressor === 'Sí, lo conozco' && (
                                <Field label="¿Cuál es su nombre o apodo?" htmlFor="aggressorName">
                                    <Input
                                        id="aggressorName"
                                        value={form.aggressorName}
                                        onChange={(event) => updateForm('aggressorName', event.target.value)}
                                        className="h-12"
                                    />
                                </Field>
                            )}
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">¿Viven en la misma casa?</legend>
                                <ChoiceGroup
                                    name="livesTogether"
                                    options={['Sí, vivimos juntos', 'No vivimos juntos']}
                                    value={form.livesTogether}
                                    onChange={(value) => updateForm('livesTogether', value)}
                                />
                            </fieldset>
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">
                                    ¿Tiene armas o te ha amenazado con hacerte daño?
                                </legend>
                                <ChoiceGroup
                                    name="weaponsOrThreats"
                                    options={['Sí, tiene armas o me ha amenazado', 'No']}
                                    value={form.weaponsOrThreats}
                                    onChange={(value) => updateForm('weaponsOrThreats', value)}
                                />
                            </fieldset>
                            <Field
                                label="¿Cuántos niños, niñas o adolescentes viven en tu hogar?"
                                htmlFor="childrenAtHome"
                            >
                                <Input
                                    id="childrenAtHome"
                                    type="number"
                                    min={0}
                                    inputMode="numeric"
                                    value={form.childrenAtHome}
                                    onChange={(event) => updateForm('childrenAtHome', event.target.value)}
                                    className="h-12 max-w-xs"
                                />
                            </Field>
                            <fieldset className="space-y-3">
                                <legend className="mb-3 text-base font-semibold">¿Estás en un lugar seguro ahora?</legend>
                                <ChoiceGroup
                                    name="isSafeNow"
                                    options={['Sí, estoy a salvo', 'Tengo miedo y estoy en peligro']}
                                    value={form.isSafeNow}
                                    onChange={(value) => updateForm('isSafeNow', value)}
                                />
                            </fieldset>
                            {form.isSafeNow === 'Tengo miedo y estoy en peligro' && (
                                <p className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                                    Tu seguridad es lo más importante. Si puedes, ve a un lugar seguro y busca ahora a una persona adulta
                                    de confianza.
                                </p>
                            )}
                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-5">
                            <p className="text-muted-foreground">
                                Puedes escribir con tus propias palabras. Comparte solo lo que te sientas listo o lista para contar.
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {supportRequests.map((request) => (
                                    <Button
                                        key={request.label}
                                        type="button"
                                        variant="outline"
                                        className="h-auto min-h-10 whitespace-normal text-left"
                                        onClick={() => addSupportRequest(request.text)}
                                    >
                                        {request.label}
                                    </Button>
                                ))}
                            </div>
                            <Field label="¿Qué ocurrió o qué ayuda necesitas?" htmlFor="details">
                                <Textarea
                                    id="details"
                                    rows={7}
                                    value={form.details}
                                    onChange={(event) => updateForm('details', event.target.value)}
                                    placeholder="Escribe aquí. No tienes que usar palabras especiales."
                                    className="min-h-40 text-base"
                                />
                            </Field>
                            {submitError && (
                                <p role="alert" className="flex gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm">
                                    <AlertCircle aria-hidden="true" className="size-5 shrink-0" />
                                    <span>{submitError}</span>
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                                Al enviar, tus respuestas se mandarán al servicio de atención para crear tu caso.
                            </p>
                        </div>
                    )}

                    <div className="mt-8 flex flex-col-reverse justify-between gap-3 border-t pt-5 sm:flex-row">
                        {step > 0 ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setErrors([])
                                    setSubmitError('')
                                    setStep((current) => current - 1)
                                }}
                                className="min-h-12 px-5 text-base"
                            >
                                <ArrowLeft aria-hidden="true" />
                                Atrás
                            </Button>
                        ) : <span />}

                        {step < steps.length - 1 ? (
                            <Button type="button" onClick={goToNextStep} className="min-h-12 px-5 text-base">
                                Continuar
                                <ArrowRight aria-hidden="true" />
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isSubmitting} className="min-h-12 px-5 text-base">
                                {isSubmitting ? (
                                    <>
                                        <LoaderCircle aria-hidden="true" className="animate-spin" />
                                        Enviando...
                                    </>
                                ) : 'Enviar solicitud'}
                            </Button>
                        )}
                    </div>
                </form>
            </CardContent>
        </Card>
    )
}