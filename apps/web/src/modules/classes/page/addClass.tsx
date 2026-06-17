import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
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
import { ArrowLeft, CirclePlus, GraduationCap } from 'lucide-react'

type ModuleItem = {
  title: string
  duration: string
}

type FormFieldProps = {
  label: string
  htmlFor?: string
  children: React.ReactNode
}

function FormField({ label, htmlFor, children }: FormFieldProps) {
  return (
    <fieldset className="space-y-2">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      {children}
    </fieldset>
  )
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-foreground">{title}</h2>
      {description && <p className="text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}

export default function AddClass() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [fullDescription, setFullDescription] = useState('')
  const [instructor, setInstructor] = useState('')
  const [instructorBio, setInstructorBio] = useState('')
  const [duration, setDuration] = useState('')
  const [level, setLevel] = useState('Principiante')
  const [image, setImage] = useState('')
  const [startDate, setStartDate] = useState('')
  const [modules, setModules] = useState<ModuleItem[]>([])
  const [moduleTitle, setModuleTitle] = useState('')
  const [moduleDuration, setModuleDuration] = useState('')
  const [requirements, setRequirements] = useState<string[]>([])
  const [requirementText, setRequirementText] = useState('')
  const [outcomes, setOutcomes] = useState<string[]>([])
  const [outcomeText, setOutcomeText] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return

    const fetchCourse = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await fetch(`/api/class/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'No se pudo cargar el curso')
        }

        const course = data?.data
        setTitle(course.title || '')
        setDescription(course.description || '')
        setFullDescription(course.full_description || course.fullDescription || '')
        setInstructor(course.instructor || '')
        setInstructorBio(course.instructor_bio || course.instructorBio || '')
        setDuration(course.duration || '')
        setLevel(course.level || 'Principiante')
        setImage(course.image || '')
        setStartDate(course.start_date ? course.start_date.split('T')[0] : '')
        setModules(course.modules || [])
        setRequirements(course.requirements || [])
        setOutcomes(course.outcomes || [])
      } catch (fetchError) {
        console.error(fetchError)
        setError('No se pudo cargar el curso. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  const addModule = () => {
    const titleValue = moduleTitle.trim()
    const durationValue = moduleDuration.trim()

    if (!titleValue || !durationValue) return

    setModules((current) => [...current, { title: titleValue, duration: durationValue }])
    setModuleTitle('')
    setModuleDuration('')
  }

  const removeModule = (index: number) => {
    setModules((current) => current.filter((_, idx) => idx !== index))
  }

  const addRequirement = () => {
    const value = requirementText.trim()
    if (!value) return
    setRequirements((current) => [...current, value])
    setRequirementText('')
  }

  const removeRequirement = (index: number) => {
    setRequirements((current) => current.filter((_, idx) => idx !== index))
  }

  const addOutcome = () => {
    const value = outcomeText.trim()
    if (!value) return
    setOutcomes((current) => [...current, value])
    setOutcomeText('')
  }

  const removeOutcome = (index: number) => {
    setOutcomes((current) => current.filter((_, idx) => idx !== index))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setError('')

    if (!title.trim() || !description.trim() || !instructor.trim() || !duration.trim() || !level.trim()) {
      setError('Por favor completa los campos obligatorios.')
      return
    }

    if (isEdit && !id) {
      setError('ID de curso inválido.')
      return
    }

    setSaving(true)

    try {
      const url = isEdit ? `/api/class/${id}` : '/api/class'
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          fullDescription: fullDescription.trim(),
          instructor: instructor.trim(),
          instructorBio: instructorBio.trim(),
          duration: duration.trim(),
          level,
          image: image.trim(),
          startDate: startDate || null,
          modules,
          requirements,
          outcomes,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result?.error || `No se pudo ${isEdit ? 'actualizar' : 'guardar'} el curso.`)
      } else {
        setMessage(`Curso ${isEdit ? 'actualizado' : 'guardado'} correctamente.`)
        if (!isEdit) {
          setTitle('')
          setDescription('')
          setFullDescription('')
          setInstructor('')
          setInstructorBio('')
          setDuration('')
          setLevel('Principiante')
          setImage('')
          setStartDate('')
          setModules([])
          setRequirements([])
          setOutcomes([])
        }
      }
    } catch (err) {
      console.error(err)
      setError('Ocurrió un error al comunicarse con la API.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="pt-15 pb-10 flex items-center justify-center p-8">
        <div className="bg-muted rounded-md p-4">
          <p className="text-lg font-medium">Cargando información del curso...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <form onSubmit={handleSubmit}>
        <section className="py-10 px-4 sm:px-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
                <GraduationCap className="w-3 h-3 mr-1" />
                {isEdit ? 'Editar curso' : 'Nuevo curso'}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                {isEdit ? 'Editar clase' : 'Agregar nuevo curso'}
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {isEdit
                  ? 'Ajusta los datos del curso y guarda los cambios.'
                  : 'Completa el formulario para crear un nuevo curso.'}
              </p>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin/clases">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a clases
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 lg:grid-cols-2 lg:pt-8">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Información básica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Título" htmlFor="title">
                  <Input
                    id="title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Título del curso"
                    className="focus:border-rose-500! focus:ring-2! focus:ring-rose-500/20!"
                    required
                  />
                </FormField>

                <FormField label="Descripción breve" htmlFor="description">
                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Resumen corto del curso"
                    rows={4}
                    className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                </FormField>

                <FormField label="Descripción completa" htmlFor="fullDescription">
                  <textarea
                    id="fullDescription"
                    value={fullDescription}
                    onChange={(event) => setFullDescription(event.target.value)}
                    placeholder="Detalles completos del curso"
                    rows={5}
                    className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                </FormField>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField label="Duración" htmlFor="duration">
                    <Input
                      id="duration"
                      value={duration}
                      onChange={(event) => setDuration(event.target.value)}
                      placeholder="Ej. 40 horas"
                      required
                    />
                  </FormField>

                  <FormField label="Nivel">
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger className="rounded-3xl px-4 py-3 text-sm">
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Nivel</SelectLabel>
                          <SelectItem value="Principiante">Principiante</SelectItem>
                          <SelectItem value="Intermedio">Intermedio</SelectItem>
                          <SelectItem value="Avanzado">Avanzado</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormField>
                </div>

                <FormField label="Fecha de inicio" htmlFor="startDate">
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(event) => setStartDate(event.target.value)}
                  />
                </FormField>

                <FormField label="Imagen" htmlFor="image">
                  <Input
                    id="image"
                    type="url"
                    value={image}
                    onChange={(event) => setImage(event.target.value)}
                    placeholder="https://..."
                  />
                </FormField>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField label="Nombre del instructor" htmlFor="instructor">
                  <Input
                    id="instructor"
                    value={instructor}
                    onChange={(event) => setInstructor(event.target.value)}
                    placeholder="Nombre del instructor"
                    required
                  />
                </FormField>
                <FormField label="Biografía" htmlFor="instructorBio">
                  <textarea
                    id="instructorBio"
                    value={instructorBio}
                    onChange={(event) => setInstructorBio(event.target.value)}
                    placeholder="Breve biografía del instructor"
                    rows={4}
                    className="w-full rounded-3xl border border-input bg-transparent px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                  />
                </FormField>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-8 px-4 sm:px-8 bg-muted/30">
          <SectionHeader title="Módulos" description={isEdit ? 'Agrega o edita los módulos del curso.' : 'Agrega los módulos del curso.'} />
          <div className="grid gap-4 lg:grid-cols-3">
            <Input
              value={moduleTitle}
              onChange={(event) => setModuleTitle(event.target.value)}
              placeholder="Título del módulo"
              className="rounded-3xl px-4 py-3"
            />
            <Input
              value={moduleDuration}
              onChange={(event) => setModuleDuration(event.target.value)}
              placeholder="Duración del módulo"
              className="rounded-3xl px-4 py-3"
            />
            <Button type="button" onClick={addModule} className="bg-rose-600 text-white rounded-3xl">
              <CirclePlus className="w-4 h-4 mr-2" />
              Agregar módulo
            </Button>
          </div>

          {modules.length > 0 && (
            <div className="mt-6 grid gap-3">
              {modules.map((module, index) => (
                <Card key={`${module.title}-${index}`} className="rounded-3xl border">
                  <CardContent className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium">{module.title}</p>
                      <p className="text-sm text-muted-foreground">{module.duration}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeModule(index)}>
                      Eliminar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section className="py-8 px-4 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={requirementText}
                    onChange={(event) => setRequirementText(event.target.value)}
                    placeholder="Agregar requisito"
                    className="rounded-3xl px-4 py-3"
                  />
                  <Button type="button" className="bg-rose-600 text-white rounded-3xl" onClick={addRequirement}>
                    <CirclePlus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
                {requirements.length > 0 && (
                  <ul className="space-y-2">
                    {requirements.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-center justify-between rounded-3xl border border-input px-4 py-3">
                        <span>{item}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeRequirement(index)}>
                          Eliminar
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg bg-muted/50">
              <CardHeader>
                <CardTitle>Lo que aprenderás</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Input
                    value={outcomeText}
                    onChange={(event) => setOutcomeText(event.target.value)}
                    placeholder="Agregar aprendizaje"
                    className="rounded-3xl px-4 py-3"
                  />
                  <Button type="button" className="bg-rose-600 text-white rounded-3xl" onClick={addOutcome}>
                    <CirclePlus className="w-4 h-4 mr-2" />
                    Agregar
                  </Button>
                </div>
                {outcomes.length > 0 && (
                  <ul className="space-y-2">
                    {outcomes.map((item, index) => (
                      <li key={`${item}-${index}`} className="flex items-center justify-between rounded-3xl border border-input px-4 py-3">
                        <span>{item}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeOutcome(index)}>
                          Eliminar
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-10 px-4 sm:px-8">
          <div className="max-w-2xl flex flex-row items-center gap-4">
            <Button type="submit" className="rounded-3xl bg-rose-600 text-white hover:bg-rose-700" disabled={saving}>
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Guardar curso'}
            </Button>
            {isEdit && (
              <Button type="button" variant="outline" className="rounded-3xl" onClick={() => navigate('/admin/clases')}>
                Volver sin guardar
              </Button>
            )}
          </div>
          <div className="max-w-2xl mt-4 space-y-4">
            {error && (
              <div className="rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {message}
              </div>
            )}
          </div>
        </section>
      </form>
    </div>
  )
}
