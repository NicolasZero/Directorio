import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  MapPin,
  Users,
  Calendar,
  ArrowRight,
  GraduationCap,
  Heart,
  Newspaper,
  X
} from "lucide-react"
import { Link } from "react-router";
import { useEffect, useState } from "react";
import { formatNewsDate, type NewsEntry } from "@/modules/news/types/news"

type ClassEntry = {
  id: number
  title: string
  description: string
  level: string
  start_date: string | null
}

function formatCourseDate(startDate: string | null) {
  if (!startDate) return "Fecha por definir"

  const date = new Date(`${startDate.slice(0, 10)}T00:00:00`)
  if (Number.isNaN(date.getTime())) return "Fecha por definir"

  return new Intl.DateTimeFormat("es", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  }).format(date)
}

function Home() {
  const [showAviso, setShowAviso] = useState(() => {
    return sessionStorage.getItem("inamujer_aviso_closed") !== "true"
  })
  const [ultimasClases, setUltimasClases] = useState<ClassEntry[]>([])
  const [loadingClases, setLoadingClases] = useState(true)
  const [errorClases, setErrorClases] = useState<string | null>(null)
  const [ultimasNoticias, setUltimasNoticias] = useState<NewsEntry[]>([])
  const [loadingNoticias, setLoadingNoticias] = useState(true)
  const [errorNoticias, setErrorNoticias] = useState<string | null>(null)

  const handleCloseAviso = () => {
    sessionStorage.setItem("inamujer_aviso_closed", "true")
    setShowAviso(false)
  }

  useEffect(() => {
    let cancelled = false

    const fetchLatestClasses = async () => {
      try {
        const response = await fetch("/api/class?limit=4")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || "No se pudieron cargar las clases")
        }

        if (!cancelled) {
          setUltimasClases((data?.data ?? []).slice(0, 4))
        }
      } catch (error) {
        console.error(error)
        if (!cancelled) {
          setErrorClases("No se pudieron cargar las clases. Intenta de nuevo más tarde.")
        }
      } finally {
        if (!cancelled) {
          setLoadingClases(false)
        }
      }
    }

    void fetchLatestClasses()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    const fetchLatestNews = async () => {
      try {
        const response = await fetch("/api/news?limit=4")
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data?.error || "No se pudieron cargar las noticias")
        }

        if (!cancelled) {
          setUltimasNoticias((data?.data ?? []).slice(0, 4))
        }
      } catch (error) {
        console.error(error)
        if (!cancelled) {
          setErrorNoticias("No se pudieron cargar las noticias. Intenta de nuevo más tarde.")
        }
      } finally {
        if (!cancelled) {
          setLoadingNoticias(false)
        }
      }
    }

    void fetchLatestNews()

    return () => {
      cancelled = true
    }
  }, [])

  const servicios = [
    {
      icon: <BookOpen className="h-8 w-8" />,
      titulo: "Directorio",
      descripcion: "Explora nuestro directorio de recursos y servicios disponibles para mujeres.",
      enlace: "/directorio"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      titulo: "Mapa Interactivo",
      descripcion: "Encuentra ubicaciones de interés cercanas mediante nuestro mapa interactivo.",
      enlace: "/mapa"
    },
    {
      icon: <Users className="h-8 w-8" />,
      titulo: "Clases y Cursos",
      descripcion: "Accede a materiales educativos y cursos disponibles para tu desarrollo.",
      enlace: "/clases"
    }
  ]

  const preguntasFrecuentes = [
    {
      pregunta: "¿Cómo puedo acceder a los servicios?",
      respuesta: "Puedes visitar nuestras oficinas durante horario laboral."
    },
    {
      pregunta: "¿Los servicios son gratuitos?",
      respuesta: "Sí, todos nuestros servicios son gratuitos para mujeres que buscan apoyo y recursos."
    },
    {
      pregunta: "¿Cómo puedo contactarles?",
      respuesta: "Puedes llamarnos, visitarnos o escribirnos un correo electrónico."
    }
  ]

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/50 via-white dark:via-rose-950 to-rose-100/50 dark:to-rose-950/50 py-8 md:py-12 px-4 md:px-6">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
          <div className="flex-1 text-center lg:text-left px-3">
            <Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
              Bienvenida
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
              Instituto Nacional de la <span className="text-rose-600">Mujer</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto lg:mx-0">
              Un espacio dedicado a empoderar, informar y acompañar a las mujeres en su desarrollo personal,
              profesional y legal. Descubre los recursos y servicios que tenemos para ti.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link to="/directorio">
                <Button size="lg" className="text-base font-bold bg-rose-600 hover:bg-rose-700">
                  Explorar Directorio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/conocenos">
                <Button size="lg" variant="outline">
                  Conocer Más
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">

              <div className="absolute inset-0 bg-linear-to-r from-rose-400 to-rose-600 rounded-3xl rotate-6 opacity-20" />

              <div className="relative bg-neutral-50 dark:bg-neutral-900 rounded-3xl shadow-xl p-8 dark:border-0 border">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="p-3 bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-50 rounded-full">
                    <Heart className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-rose-600">INAMUJER</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/80">
                    <BookOpen className="h-5 w-5 text-rose-500" />
                    <span className="text-sm font-medium">Directorio de Recursos</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/80">
                    <MapPin className="h-5 w-5 text-rose-500" />
                    <span className="text-sm font-medium">Mapa de Servicios</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/80">
                    <GraduationCap className="h-5 w-5 text-rose-500" />
                    <span className="text-sm font-medium">Educación y Capacitación</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

      {/* Servicios */}
      <section className="py-10 md:py-14 px-4 md:px-6 bg-muted/50 dark:bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Nuestros Servicios</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Explora las diferentes herramientas y recursos que ponemos a tu disposición
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {servicios.map((servicio, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="p-3 w-fit rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-50 mb-3">
                    {servicio.icon}
                  </div>
                  <CardTitle>{servicio.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {servicio.descripcion}
                  </CardDescription>
                  <Link to={servicio.enlace}>
                    <Button variant="link" className="px-0 mt-4 text-rose-600">
                      Ver más <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Últimas Clases */}
      <section className="py-10 md:py-14 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Últimas Clases y Cursos</h2>
              <p className="text-muted-foreground">Material educativo reciente</p>
            </div>
            <Link to="/clases">
              <Button variant="outline">Ver Todas</Button>
            </Link>
          </div>

          {loadingClases ? (
            <p className="text-center text-muted-foreground">Cargando clases...</p>
          ) : errorClases ? (
            <p role="alert" className="text-center text-muted-foreground">{errorClases}</p>
          ) : ultimasClases.length === 0 ? (
            <p className="text-center text-muted-foreground">No hay clases disponibles.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {ultimasClases.map((clase) => (
                <Card key={clase.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="p-3 text-rose-600 dark:text-rose-50 bg-rose-100 dark:bg-rose-900 rounded-lg h-6 w-6 box-content" />
                      <div className="flex justify-between w-full">
                        <Badge variant="outline" className="text-nowrap bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
                          {clase.level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{formatCourseDate(clase.start_date)}</span>
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold mb-2">{clase.title}</h3>
                    <p className="text-muted-foreground">{clase.description}</p>
                    <Link to={`/clases/curso/${clase.id}`}>
                      <Button variant="link" className="px-0 mt-4 text-rose-600">
                        Ver más <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="bg-muted/30 px-4 py-10 md:px-6 md:py-14">
        <div className="container mx-auto">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold">Últimas Noticias</h2>
              <p className="text-muted-foreground">Novedades y actividades recientes</p>
            </div>
            <Button asChild variant="outline"><Link to="/noticias">Ver Todas</Link></Button>
          </div>

          {loadingNoticias ? (
            <p className="text-center text-muted-foreground">Cargando noticias...</p>
          ) : errorNoticias ? (
            <p role="alert" className="text-center text-muted-foreground">{errorNoticias}</p>
          ) : ultimasNoticias.length === 0 ? (
            <p className="text-center text-muted-foreground">Aún no hay noticias publicadas.</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {ultimasNoticias.map((noticia) => (
                <Card key={noticia.id} className="overflow-hidden transition-shadow hover:shadow-md">
                  {noticia.image && <img src={noticia.image} alt="" className="aspect-video w-full object-cover" />}
                  <CardContent className="p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <Badge variant="outline" className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
                        {noticia.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{formatNewsDate(noticia.published_at)}</span>
                    </div>
                    <div className="mb-2 flex items-center gap-2">
                      <Newspaper className="h-5 w-5 shrink-0 text-rose-600" />
                      <h3 className="line-clamp-2 text-xl font-semibold">{noticia.title}</h3>
                    </div>
                    <p className="line-clamp-3 text-muted-foreground">{noticia.summary}</p>
                    <Button asChild variant="link" className="mt-3 px-0 text-rose-600">
                      <Link to={`/noticias/${noticia.id}`}>
                        Leer noticia <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Aviso inline si ya fue cerrado como modal */}
      {!showAviso && (
        <section className="py-8 px-4 md:px-6">
          <div className="container mx-auto flex flex-col items-center">
            <div className="overflow-hidden rounded-xl shadow-md border max-w-4xl bg-card">
              <img
                src="/aviso.jpeg"
                alt="Aviso Importante"
                className="w-full h-auto object-contain max-h-150"
              />
            </div>
          </div>
        </section>
      )}

      {/* Preguntas Frecuentes */}
      <section className="py-10 md:py-14 px-4 md:px-6 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Preguntas Frecuentes</h2>
            <p className="text-muted-foreground">Respuestas a las dudas más comunes</p>
          </div>

          <div className="space-y-4">
            {preguntasFrecuentes.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-50 text-sm font-bold">
                      {index + 1}
                    </span>
                    {item.pregunta}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{item.respuesta}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Aviso */}
      {showAviso && (
        <section className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4 py-6 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-fit overflow-hidden animate-in zoom-in-95 duration-200">
            <button
              onClick={handleCloseAviso}
              className="absolute top-4 right-4 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-2 transition-all hover:scale-105 shadow-md focus:outline-hidden"
              aria-label="Cerrar aviso"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src="/aviso.jpeg"
              alt="Aviso Importante"
              className="w-full h-auto object-contain max-h-[90vh]"
            />
          </div>
        </section>
      )}
    </div>
  )
}

export default Home