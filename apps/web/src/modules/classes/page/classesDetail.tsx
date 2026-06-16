import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, User, BarChart, BookOpen, Calendar, CheckCircle2, AlertCircle, GraduationCap } from "lucide-react"
import { Link, useParams } from "react-router"
import { useAuth } from "@/context/authContext"
import type { ClassDetailType } from "@/modules/classes/schemas/classDetailSchema"

export default function ClassesDetail() {
  const { status } = useAuth()
  const { id } = useParams()
  const [course, setCourse] = useState<ClassDetailType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const loadCourse = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/class/${id}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'No se pudo cargar el curso')
        }

        setCourse(data?.data || null)
      } catch (fetchError) {
        console.error(fetchError)
        setError('No se pudo cargar el curso. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [id])

  if (loading) {
    return (
      <section className="pt-15 pb-10 flex items-center justify-center">
        <div className="bg-muted rounded-md p-4">
          <p className="text-base text-muted-foreground">Cargando curso...</p>
        </div>
      </section>
    )
  }

  if (error || !course) {
    return (
      <section className="pt-15 pb-10 flex items-center justify-center">
        <div className="bg-muted rounded-md p-4">
          <p className="text-base text-muted-foreground">{error || 'No se pudo cargar el curso'}</p>
        </div>
      </section>
    )
  }

  const startDate = course.start_date
    ? new Date(course.start_date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    : ''
  const modules = course.modules || []
  const requirements = course.requirements || []
  const outcomes = course.outcomes || []
  const image = course.image || '/default.png'
  const fullDescription = course.full_description || course.description

  return (
    <section className="px-4 overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-rose-600 hover:text-rose-700 hover:bg-rose-200"
            asChild
          >
            <Link to="/clases">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a Cursos
            </Link>
          </Button>
          {status === 'authenticated' && (
            <Button
              variant="secondary"
              size="sm"
              asChild
            >
              <Link to="/admin/clases">Editar curso</Link>
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Badge y titulo */}
            <div>
              <Badge variant="outline" className="mb-4 bg-rose-200 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
                <GraduationCap className="w-3 h-3 mr-1" />
                {course.level}
              </Badge>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {fullDescription}
              </p>
            </div>

            {/* Imagen */}
            <div className="aspect-video relative overflow-hidden dark:border border-background-foreground rounded-xl shadow-lg">
              <img
                src={image}
                alt={course.title}
                className="object-cover w-full h-full"
              />
            </div>

            {/* Lo que aprenderas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-rose-600" />
                  Lo que aprenderás
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {outcomes.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{item.outcome}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Modulos del curso */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart className="h-5 w-5 text-rose-600" />
                  Contenido del Curso
                </CardTitle>
                <CardDescription>
                  {modules.length} módulos • {course.duration}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {modules.map((module, index) => (
                    <div
                      key={module.id}
                      className="flex items-center gap-2 flex-wrap p-4 rounded-lg border bg-muted/30 hover:bg-rose-50 hover:border-rose-200 dark:hover:bg-rose-950 dark:hover:border-gray-800 transition-colors cursor-default"
                    >
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-100 text-sm font-bold">
                        {index + 1}
                      </span>
                      <span className="font-medium">{module.title}</span>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {module.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="sticky top-8 shadow-lg border-rose-200 dark:border-rose-800">
              <CardHeader>
                <CardTitle>Información del Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Instructor */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900">
                    <User className="h-5 w-5 text-rose-600 dark:text-rose-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Instructor</p>
                    <p className="text-sm text-muted-foreground">{course.instructor}</p>
                  </div>
                </div>

                {/* Duración */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900">
                    <Clock className="h-5 w-5 text-rose-600 dark:text-rose-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Duración</p>
                    <p className="text-sm text-muted-foreground">{course.duration}</p>
                  </div>
                </div>

                {/* Nivel */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900">
                    <BarChart className="h-5 w-5 text-rose-600 dark:text-rose-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Nivel</p>
                    <p className="text-sm text-muted-foreground">{course.level}</p>
                  </div>
                </div>

                {/* Fecha de inicio */}
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900">
                    <Calendar className="h-5 w-5 text-rose-600 dark:text-rose-100" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Fecha de inicio</p>
                    <p className="text-sm text-muted-foreground">{startDate}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="w-full font-bold bg-rose-600 hover:bg-rose-700" size="lg">
                    Inscríbete Ahora
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-2">
                    Acceso ilimitado • Certificado incluido
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Requisitos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-rose-600" />
                  Requisitos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-100 text-xs font-bold shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{req.requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructor bio */}
            <Card>
              <CardHeader>
                <CardTitle>Sobre el Instructor</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {course.instructor_bio}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}