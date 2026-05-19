import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, MapPin, Users, Calendar, ArrowRight, ShieldCheck, GraduationCap } from 'lucide-react'
import { Link } from 'react-router'

function HomeAdminPage() {
  const [stats, setStats] = useState({ directorios: 0, cursos: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats')
        const data = await response.json()

        if (!response.ok || data.status !== 'OK') {
          throw new Error(data.error || 'No se pudo cargar la informacion')
        }

        setStats({
          directorios: Number(data.data.directorios ?? 0),
          cursos: Number(data.data.cursos ?? 0)
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrio un error inesperado')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-br from-rose-100 dark:from-rose-950/50 via-white dark:via-rose-950 to-rose-100/50 dark:to-rose-950/50 py-8 md:py-12 px-4 md:px-6">
      <div className="container mx-auto">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr] items-start">
          <section className="rounded-[2rem] bg-neutral-50 dark:bg-neutral-900 shadow-xl p-8 border border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-3xl bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-50">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <div>
                <Badge variant="outline" className="mb-2 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
                  Dashboard Admin
                </Badge>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  Bienvenido al Panel de Administracion
                </h1>
              </div>
            </div>

            <p className="text-base text-muted-foreground max-w-2xl">
              Aqui puedes ver un resumen rapido de los recursos registrados en la base de datos.
              Revisa los directorios y cursos disponibles, y navega directamente a las secciones de administracion.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Card className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <BookOpen className="h-6 w-6 text-rose-600" />
                    <CardTitle className="text-lg">Directorios</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-extrabold text-rose-700">{loading ? '...' : stats.directorios}</p>
                  <CardDescription className="mt-2 text-sm text-muted-foreground">
                    Total de directorios registrados en el sistema.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="h-6 w-6 text-rose-600" />
                    <CardTitle className="text-lg">Cursos / Clases</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-5xl font-extrabold text-rose-700">{loading ? '...' : stats.cursos}</p>
                  <CardDescription className="mt-2 text-sm text-muted-foreground">
                    Cantidad de cursos y talleres disponibles.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/admin/directorio">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                  Administrar Directorio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/admin/clases">
                <Button size="lg" variant="outline">
                  Administrar Cursos
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl bg-red-50 text-red-700 px-4 py-3 text-sm dark:bg-red-950/20 dark:text-red-300">
                {error}
              </div>
            ) : null}
          </section>

          <section className="space-y-6">
            <Card className="overflow-hidden rounded-[2rem] bg-rose-100/80 dark:bg-rose-900/80 shadow-lg border border-rose-200 dark:border-rose-800">
              <CardHeader className="px-6 py-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-rose-700 dark:text-rose-100">Resumen de servicio</h2>
                    <p className="text-sm text-muted-foreground">Una vista general de los modulos administrables.</p>
                  </div>
                  <Badge className="bg-white/90 text-rose-700 dark:bg-rose-950 dark:text-rose-50">Actualizado</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <div className="flex items-center gap-3 rounded-3xl bg-white/90 dark:bg-neutral-950/70 p-4">
                  <MapPin className="h-6 w-6 text-rose-600" />
                  <div>
                    <p className="text-sm font-medium">Mapa de servicios</p>
                    <p className="text-sm text-muted-foreground">Accede a la geolocalizacion y estados.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-3xl bg-white/90 dark:bg-neutral-950/70 p-4">
                  <Users className="h-6 w-6 text-rose-600" />
                  <div>
                    <p className="text-sm font-medium">Usuarios activos</p>
                    <p className="text-sm text-muted-foreground">Visibilidad del equipo de administracion.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-3xl bg-white/90 dark:bg-neutral-950/70 p-4">
                  <Calendar className="h-6 w-6 text-rose-600" />
                  <div>
                    <p className="text-sm font-medium">Eventos proximos</p>
                    <p className="text-sm text-muted-foreground">Planifica y gestiona los cursos.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  )
}

export default HomeAdminPage
