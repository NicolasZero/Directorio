import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  MapPin, 
  Users, 
  Calendar, 
  Phone, 
  Mail, 
  ArrowRight,
  GraduationCap,
  Heart
} from "lucide-react"

function Home() {
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
      enlace: "/map"
    },
    {
      icon: <Users className="h-8 w-8" />,
      titulo: "Clases y Cursos",
      descripcion: "Accede a materiales educativos y cursos disponibles para tu desarrollo.",
      enlace: "/classes"
    }
  ]

  const ultimasClases = [
    {
      titulo: "Taller de Empoderamiento",
      descripcion: "Programa integral de desarrollo personal y profesional para mujeres.",
      categoria: "Desarrollo Personal",
      fecha: "15 Abr 2026"
    },
    {
      titulo: "Curso de Derechos de la Mujer",
      descripcion: "Conocimiento sobre tus derechos legales y recursos disponibles.",
      categoria: "Educación Legal",
      fecha: "10 Abr 2026"
    }
  ]

  const preguntasFrecuentes = [
    {
      pregunta: "¿Cómo puedo acceder a los servicios?",
      respuesta: "Puedes registrarte en nuestra plataforma o visitar nuestras oficinas durante horario laboral."
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
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-rose-50 via-white to-rose-50/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-rose-100/40 via-transparent to-transparent" />
        
        <div className="container mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
            <div className="flex-1 text-center lg:text-left">
              <Badge variant="secondary" className="mb-4 bg-rose-100 text-rose-700 hover:bg-rose-200">
                Bienvenida
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
                Instituto de la <span className="text-rose-600">Mujer</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6 max-w-2xl mx-auto lg:mx-0">
                Un espacio dedicado a empoderar, informar y acompañar a las mujeres en su desarrollo personal, 
                profesional y legal. Descubre los recursos y servicios que tenemos para ti.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Button size="lg" className="bg-rose-600 hover:bg-rose-700">
                  Explorar Directorio
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Conocer Más
                </Button>
              </div>
            </div>
            
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-linear-to-r from-rose-400 to-rose-600 rounded-3xl rotate-6 opacity-20" />
                <div className="relative bg-white rounded-3xl shadow-xl p-8 border">
                  <div className="flex items-center justify-center gap-4 mb-6">
                    <div className="p-3 bg-rose-100 rounded-full">
                      <Heart className="h-8 w-8 text-rose-600" />
                    </div>
                    <div className="text-2xl font-bold text-rose-600">INAmujer</div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <BookOpen className="h-5 w-5 text-rose-500" />
                      <span className="text-sm font-medium">Directorio de Recursos</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <MapPin className="h-5 w-5 text-rose-500" />
                      <span className="text-sm font-medium">Mapa de Servicios</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <GraduationCap className="h-5 w-5 text-rose-500" />
                      <span className="text-sm font-medium">Educación y Capacitación</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="py-16 px-4 bg-muted/30">
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
                  <div className="p-3 w-fit rounded-lg bg-rose-100 text-rose-600 mb-3">
                    {servicio.icon}
                  </div>
                  <CardTitle>{servicio.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {servicio.descripcion}
                  </CardDescription>
                  <Button variant="link" className="px-0 mt-4 text-rose-600">
                    Ver más <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Últimas Clases */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Últimas Clases y Cursos</h2>
              <p className="text-muted-foreground">Material educativo reciente</p>
            </div>
            <Button variant="outline">Ver Todas</Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {ultimasClases.map((clase, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-rose-100 rounded-lg h-fit">
                      <Calendar className="h-6 w-6 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                          {clase.categoria}
                        </Badge>
                        <span className="text-sm text-muted-foreground">{clase.fecha}</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{clase.titulo}</h3>
                      <p className="text-muted-foreground">{clase.descripcion}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Preguntas Frecuentes */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Preguntas Frecuentes</h2>
            <p className="text-muted-foreground">Respuestas a las dudas más comunes</p>
          </div>
          
          <div className="space-y-4">
            {preguntasFrecuentes.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-100 text-rose-600 text-sm font-bold">
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

      {/* Contacto */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Card className="bg-rose-600 text-white overflow-hidden">
            <CardContent className="p-8 md:p-12 relative">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-3">¿Necesitas Ayuda?</h2>
                <p className="text-rose-100 max-w-xl mx-auto">
                  Estamos aquí para apoyarte. Contáctanos mediante cualquiera de estos canales.
                </p>
              </div>
              
              <div className="grid sm:grid-cols-3 gap-6">
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Phone className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-1">Teléfono</h3>
                  <p className="text-rose-100 text-sm">+XX XXX XXX</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <Mail className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-1">Correo</h3>
                  <p className="text-rose-100 text-sm">contacto@inamujer.gob.mx</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
                  <MapPin className="h-8 w-8 mb-3" />
                  <h3 className="font-semibold mb-1">Dirección</h3>
                  <p className="text-rose-100 text-sm">Ciudad de México</p>
                </div>
              </div>
              
              <div className="text-center mt-8">
                <Button variant="secondary" size="lg">
                  Contáctanos
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

export default Home