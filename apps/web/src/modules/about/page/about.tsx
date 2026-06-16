import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Heart,
  Globe,
  Calendar,
  Target,
  Lightbulb
} from "lucide-react"
// import { useEffect, useState } from "react"
import { useInstitution } from "../hooks/useInstitucion"
import getIconComponent from "../hooks/useIconComponent"
// import type { Institution } from "../scheme/about"

const institucionMock = {
  nombre: "Instituto Nacional de la Mujer",
  nombre_corto: "Inamujer",
  fecha_creacion: "25 de octubre de 1999",
  ley_creacion: "Ley de Igualdad de Oportunidades para la Mujer",
  descripcion: "El Instituto Nacional de la Mujer (Inamujer) fue creado para la defensa y materialización de los derechos de la población femenina y el incremento de su participación en las misiones, planes y programas sociales del Estado, como parte de un nuevo estado de derecho para este sector.",
  vision: "Ser el órgano rector de las políticas públicas para la igualdad de género, promoviendo la empoderamiento y bienestar de todas las mujeres en Venezuela.",
  mision: "Ejecutar políticas públicas para la defensa permanente de los derechos humanos de las mujeres, propiciando su acceso real y efectivo a todas las esferas de la vida social en igualdad de oportunidades.",
  valores: [
    { icono: 'Heart', titulo: "Igualdad", descripcion: "Promovemos la igualdad de oportunidades entre hombres y mujeres" },
    { icono: 'Shield', titulo: "Protección", descripcion: "Defendemos los derechos de las mujeres contra toda forma de violencia" },
    { icono: 'Users', titulo: "Empoderamiento", descripcion: "Fomentamos la autonomía y desarrollo integral de las mujeres" },
    { icono: 'Scale', titulo: "Justicia", descripcion: "Garantizamos el acceso a la justicia y servicios legales" }
  ],
  logros: [
    { numero: "150+", titulo: "Centros de Atención", descripcion: "Centros operativos a nivel nacional" },
    { numero: "500K+", titulo: "Mujeres Atendidas", descripcion: "Atenciones directas realizadas" },
    { numero: "24", titulo: "Estados Cobertos", descripcion: "Presencia en todo el territorio nacional" },
    { numero: "98%", titulo: "Satisfacción", descripcion: "Tasa de satisfacción de usuarias" }
  ],
  aliados: [
    { nombre: "Ministerio del Poder Popular para la Mujer", tipo: "Gubernamental" },
    { nombre: "PNUD Venezuela", tipo: "Organismo Internacional" },
    { nombre: "ONU Mujeres", tipo: "Organismo Internacional" },
    { nombre: "Fundaciones Privadas", tipo: "Sector Privado" }
  ],
  contacto: {
    direccion: "Av. Universidad, Edificio Inamujer, Caracas, Venezuela",
    telefono: "+58 212 555-1234",
    correo: "contacto@inamujer.gob.ve",
    horario: "Lunes a Viernes: 8:00 AM - 5:00 PM"
  },
  redesSociales: [
    { nombre: "Instagram", url: "#" },
    { nombre: "Facebook", url: "#" },
    { nombre: "Twitter", url: "#" },
    { nombre: "YouTube", url: "#" }
  ]
}



const About = () => {
  const { institucion = institucionMock, loadingInstitution } = useInstitution()
  // console.log(institucion, loadingInstitution, error)

  if (loadingInstitution) {
    return <div className="min-h-screen flex items-center justify-center">Cargando...</div>
  }

  if (!institucion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 dark:text-red-400 text-2xl">Ocurrio un error. Intenta nuevamente más tarde.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <section className="bg-linear-to-br from-rose-100 dark:from-rose-950/80 via-white dark:via-black to-rose-100/50 dark:to-rose-950/30 py-4 md:py-10 px-4">

        <div className="container mx-auto text-center max-w-4xl">
          <Badge variant="outline" className="mb-4 bg-rose-100 dark:bg-rose-900 dark:text-rose-50 text-rose-700">
            <Heart className="w-3 h-3 mr-1" />
            Conócenos
          </Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-foreground">
            {institucion.nombre}
          </h1>
          <p className="text-xl text-muted-foreground mb-6">
            {institucion.descripcion}
          </p>
          <div className="flex items-center flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Creado el {institucion.fecha_creacion}</span>
            <span className="mx-2">•</span>
            <span>Por {institucion.ley_creacion}</span>
          </div>
        </div>

      </section>

      {/* Misión y Visión */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 w-fit rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-100 mb-3">
                  <Target className="w-8 h-8" />
                </div>
                <CardTitle>Misión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  {institucion.mision}
                </p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="p-3 w-fit rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-100 mb-3">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <CardTitle>Visión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  {institucion.vision}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores Institucionales */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Nuestros Valores</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Los principios que guían nuestro trabajo diario
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {institucion.valores.map((valor, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="p-4 w-fit rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900 dark:text-rose-100 mx-auto mb-4">
                    {getIconComponent(valor.icono)}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{valor.titulo}</h3>
                  <p className="text-sm text-muted-foreground">{valor.descripcion}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Logros */}
      <section className="py-16 px-4 bg-rose-600 dark:bg-rose-900 text-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Nuestro Impacto</h2>
            <p className="text-rose-100 dark:text-rose-300 max-w-xl mx-auto">
              Números que reflejan nuestro compromiso con las mujeres
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {institucion.logros.map((logro, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold mb-2">{logro.numero}</div>
                <div className="text-rose-100 font-medium">{logro.titulo}</div>
                <div className="text-rose-200 text-sm">{logro.descripcion}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Historia Breve */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">Nuestra Historia</h2>
            </div>

            <Card>
              <CardContent className="p-8">
                El Instituto Nacional de la Mujer (Inamujer) fue creado el 25 de octubre de 1999, por disposición de la Ley de Igualdad de Oportunidades para la Mujer, para la defensa y materialización de los derechos de la población femenina y el incremento de su participación en las misiones, planes y programas sociales del Estado, como parte de un nuevo estado de derecho para este sector. Como parte de estas políticas públicas se destacan, entre otros, la creación de una infraestructura institucional de servicio para la atención, prevención y erradicación de la violencia contra las damas, en concordancia con la Ley Orgánica sobre el Derecho de las Mujeres a una Vida Libre de Violencia. Luego de la creación del Ministerio del Poder Popular para la Mujer y la Igualdad de Género (MinMujer) en el año 2009, el Inamujer se implantó como órgano del Estado para ejecutar las políticas públicas emanadas para la defensa permanente de los derechos humanos de las mujeres, a fin de propiciar su acceso real y efectivo a todas las esferas de la vida social en igualdad de oportunidades y condiciones que los hombres. Le corresponde al Instituto Nacional de la Mujer la promoción y el fortalecimiento de mecanismos institucionales a escala nacional para la defensa de los derechos humanos de las mujeres. De allí que las acciones del Inamujer han fortalecido sustancialmente la capacidad del Estado venezolano para dar cumplimiento a los objetivos de la Plataforma de Acción aprobada por la Cuarta Conferencia Mundial sobre la Mujer, celebrada en Beijing en 1995 y la Convención sobre la Eliminación de todas las Formas de Discriminación contra la Mujer (CEDAW). Ciertamente, lograr la igualdad entre el hombre y la mujer depende de una profunda transformación en las actitudes y los comportamientos a todos los niveles de la sociedad, comenzando con la base y prosiguiendo hasta las instancias más altas de Gobierno. El Instituto Nacional de la Mujer es el órgano del Estado que ejecuta las políticas públicas emanadas del Ministerio del Poder Popular para la Mujer y la Igualdad de Género (Minmujer), para la defensa permanente de los derechos humanos de las mujeres, a fin de propiciar su acceso real y efectivo a todas las esferas de la vida social en igualdad de oportunidades y condiciones que los hombres.
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Aliados */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          {/* <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Nuestros Aliados</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Trabajamos de la mano con organizaciones que comparten nuestra visión
            </p>
          </div> */}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {institucion.aliados.map((aliado, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Globe className="w-8 h-8 mx-auto mb-3 text-rose-600" />
                  <h3 className="font-semibold mb-1">{aliado.nombre}</h3>
                  <Badge variant="outline" className="text-xs">{aliado.tipo}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default About