import { useEffect, useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/context/authContext"
import { GraduationCap } from "lucide-react"
import ClassCard from "../components/classCard"

type CourseEntry = {
  id: number
  title: string
  description: string
  instructor: string
  duration: string
  level: string
  image: string
}

function ClassesMain() {
  const { status } = useAuth()
  const [courses, setCourses] = useState<CourseEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCourses = async () => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/class')
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || 'No se pudieron cargar las clases')
        }

        setCourses(data?.data || [])
      } catch (fetchError) {
        console.error(fetchError)
        setError('No se pudieron cargar las clases. Intenta de nuevo más tarde.')
      } finally {
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  const totalHours = useMemo(() => {
    return courses.reduce((acc, course) => acc + (parseInt(course.duration, 10) || 0), 0)
  }, [courses])

  const levelsCount = useMemo(() => {
    return new Set(courses.map((course) => course.level)).size
  }, [courses])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-4 md:py-10 px-4">
        <div className="container mx-auto text-center max-w-2xl">
          <Badge variant="secondary" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
            <GraduationCap className="w-3 h-3 mr-1" />
            Educación
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Cursos <span className="text-rose-600">en Línea</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Explora nuestra oferta de cursos diseñados para impulsar tu desarrollo profesional.
            Aprende a tu propio ritmo con contenido de calidad.
          </p>

          {/* Stats */}
          <div className="flex justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{courses.length}</div>
              <div className="text-sm text-muted-foreground">Cursos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{totalHours}</div>
              <div className="text-sm text-muted-foreground">Horas Totales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{levelsCount}</div>
              <div className="text-sm text-muted-foreground">Niveles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="col-span-full rounded-3xl border border-dashed border-rose-200 bg-rose-50 dark:bg-rose-900 dark:border-rose-800 dark:text-rose-100 p-3 text-center text-muted-foreground">
                Cargando cursos...
              </div>
            ) : error ? (
              <Card className="col-span-full mx-auto mb-6">
                <CardContent className="p-6 text-center">
                  <p className="text-foreground font-medium">{error}</p>
                </CardContent>
              </Card>
            ) : courses.length === 0 ? (
              <div className="col-span-full rounded-3xl border border-rose-200 bg-rose-50 dark:bg-rose-900 dark:border-rose-800 dark:text-rose-100 p-3 text-center text-muted-foreground">
                No hay cursos disponibles.
              </div>
            ) : (
              courses.map((course) => (
                // console.log(course),
                <ClassCard key={course.id} course={course} status={status} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ClassesMain
