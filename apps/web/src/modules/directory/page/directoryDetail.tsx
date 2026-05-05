import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  User,
  Building2,
  ArrowLeft,
  FileText,
  AlertCircle
} from 'lucide-react'
import { Link } from 'react-router'

// Datos de ejemplo (simulando respuesta de base de datos)
// En producción, esto vendría de una API basada en el ID
const directorioDetalle = {
  id: 1,
  nombre: 'Centro de Atención Inamujer Caracas',
  descripcion: 'El Centro de Atención Inamujer Caracas es una institución dedicada a promover el empoderamiento y bienestar de las mujeres en la región capital. Brindamos servicios de orientación, asesoría legal, apoyo psicológico y programas de capacitación profesional.',
  direccion: 'Av. Universidad, Edificio Centro, Piso 1, Caracas',
  telefono: '(0212) 555-1234',
  correo: 'caracas@inamujer.gob.ve',
  municipio: 'Libertador',
  estado: 'Caracas',
  horario: 'Lunes a Viernes: 8:00 AM - 5:00 PM',
  servicios: [
    'Asesoría legal gratuita',
    'Apoyo psicológico',
    'Programas de capacitación',
    'Orientación laboral',
    'Atención a víctimas de violencia',
    'Trámites de documentación'
  ],
  responsables: [
    { nombre: 'Dra. María González', cargo: 'Directora del Centro' },
    { nombre: 'Lic. Ana Pérez', cargo: 'Coordinadora de Programas' },
    { nombre: 'Abg. Carlos Rodríguez', cargo: 'Asesor Legal' }
  ],
  requisitos: [
    'Identificación oficial (cédula)',
    'Ser mayor de edad o estar acompañada de tutor',
    'Solicitud de atención previamente llamada telefónica'
  ],
  redes: [
    { nombre: 'Instagram', url: '#', icono: 'instagram' },
    { nombre: 'Facebook', url: '#', icono: 'facebook' },
    { nombre: 'Twitter', url: '#', icono: 'twitter' }
  ]
}

function DirectoryDetail() {
  // const { id } = useParams()

  // En producción, aquí harías una llamada a la API
  // const { data, loading } = useDirectoryDetail(id)

  // Por ahora usamos los datos de ejemplo
  const directorio = directorioDetalle

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-10 px-4 sm:px-8 mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 text-rose-600 hover:text-rose-700 hover:bg-rose-200"
          asChild
        >
          <Link to="/directorio">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Directorio
          </Link>
        </Button>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Info principal */}
          <div className="flex-1">
            <Badge variant="outline" className="mb-4 bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50">
              <Building2 className="w-3 h-3 mr-1" />
              Centro de Atención
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
              {directorio.nombre}
            </h1>
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="outline" className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50 border-rose-200 dark:border-0">
                {directorio.estado}
              </Badge>
              <Badge variant="outline" className="bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-50 border-rose-200 dark:border-0">
                {directorio.municipio}
              </Badge>
            </div>
            <p className="text-lg text-muted-foreground">
              {directorio.descripcion}
            </p>
          </div>

          {/* Card de contacto rápido */}
          <Card className="w-full lg:w-80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">Información de Contacto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Dirección</p>
                  <p className="text-sm text-muted-foreground">{directorio.direccion}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-rose-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Teléfono</p>
                  <a
                    href={`tel:${directorio.telefono}`}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    {directorio.telefono}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-rose-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Correo</p>
                  <a
                    href={`mailto:${directorio.correo}`}
                    className="text-sm text-rose-600 hover:text-rose-700"
                  >
                    {directorio.correo}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-rose-500 mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Horario</p>
                  <p className="text-sm text-muted-foreground">{directorio.horario}</p>
                </div>
              </div>
              <Button className="w-full font-bold bg-rose-600 hover:bg-rose-700 mt-2">
                <Phone className="w-4 h-4 mr-2" />
                Llamar Ahora
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-12 px-4 bg-muted/30">
        <h2 className="text-2xl font-bold mb-6">Servicios Disponibles</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {directorio.servicios.map((servicio, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-rose-600 dark:text-rose-100" />
                </div>
                <span className="font-medium">{servicio}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Responsables y Requisitos */}
      <section className="py-12 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Responsables */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-rose-600" />
                  Equipo Responsable
                </CardTitle>
                <CardDescription>
                  Personas a cargo del centro
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {directorio.responsables.map((responsable, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                      <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center">
                        <User className="w-6 h-6 text-rose-600 dark:text-rose-100" />
                      </div>
                      <div>
                        <p className="font-medium">{responsable.nombre}</p>
                        <p className="text-sm text-muted-foreground">{responsable.cargo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requisitos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  Requisitos de Atención
                </CardTitle>
                <CardDescription>
                  Documentación necesaria para ser atendida
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {directorio.requisitos.map((requisito, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-900 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-100">{index + 1}</span>
                      </div>
                      <span className="text-muted-foreground">{requisito}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}

export default DirectoryDetail