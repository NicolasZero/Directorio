import { useEffect, useState, useRef, useCallback } from "react"
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
  const [loadingMore, setLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [count, setCount] = useState<{ total_cursos: number; total_horas: number; total_niveles: number } | null>(null)

  const observer = useRef<IntersectionObserver | null>(null)

  const fetchCount = async () => {
    try {
      const response = await fetch('/api/class/count')
      const data = await response.json()
      if (response.ok) {
        setCount(data.data)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchCount()
  }, [])

  const fetchCourses = useCallback(async (pageNumber: number, resetList = false) => {
    if (pageNumber === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const response = await fetch(`/api/class?page=${pageNumber}&limit=9`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'No se pudieron cargar las clases')
      }

      const newCourses = data?.data || []
      if (newCourses.length < 9) {
        setHasMore(false)
      } else {
        setHasMore(true)
      }

      setCourses((prev: CourseEntry[]) => {
        if (resetList) return newCourses
        const existingIds = new Set(prev.map((c: CourseEntry) => c.id))
        const filteredNew = newCourses.filter((c: CourseEntry) => !existingIds.has(c.id))
        return [...prev, ...filteredNew]
      })
    } catch (fetchError) {
      console.error(fetchError)
      setError('No se pudieron cargar las clases. Intenta de nuevo más tarde.')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses(1, true)
  }, [fetchCourses])

  useEffect(() => {
    if (page > 1) {
      fetchCourses(page, false)
    }
  }, [page, fetchCourses])

  const lastElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || loadingMore) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, loadingMore, hasMore]
  )

  return (
    <>
      {/* Hero Section */}
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 md:py-10 px-4">
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
              <div className="text-3xl font-bold text-rose-600">{count?.total_cursos ?? 0}</div>
              <div className="text-sm text-muted-foreground">Cursos</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{count?.total_horas ?? 0}</div>
              <div className="text-sm text-muted-foreground">Horas Totales</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">{count?.total_niveles ?? 0}</div>
              <div className="text-sm text-muted-foreground">Niveles</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cursos Grid */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          {loading ? (
            <div className="rounded-3xl border border-dashed border-rose-200 bg-rose-50 dark:bg-rose-900 dark:border-rose-800 dark:text-rose-100 p-3 text-center text-muted-foreground">
              Cargando cursos...
            </div>
          ) : error ? (
            <Card className="mx-auto mb-6 max-w-md">
              <CardContent className="p-6 text-center">
                <p className="text-foreground font-medium">{error}</p>
              </CardContent>
            </Card>
          ) : courses.length === 0 ? (
            <div className="rounded-3xl bg-muted border p-3 text-center text-muted-foreground">
              No hay cursos disponibles.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <ClassCard key={course.id} course={course} status={status} />
                ))}
              </div>
              <div ref={lastElementRef} className="h-10 w-full flex justify-center items-center mt-6">
                {loadingMore && <p className="text-sm text-muted-foreground animate-pulse">Cargando más cursos...</p>}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  )
}
export default ClassesMain